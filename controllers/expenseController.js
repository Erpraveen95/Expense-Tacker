const expenseData = require('../models/expenseData')
const User = require('../models/loginPageModel')

const sequelize = require('../util/database')
const AWS = require("aws-sdk")
require("dotenv").config()


exports.getExpense = async (req, res) => {
    try {
        // const user = req.user
        // //console.log(">>>>>>>>>>>>>>>>>this ", user.id)
        // const fetchExpense = await expenseData.findAll({ where: { logindatumId: user.id } })
        // res.status(200).json({
        //     fetchExpense: fetchExpense, username: user.name,
        //     isPremiumUser: user.isPremiumUser
        // })
        let itemsPerPage = +req.header("rows") || 2;
        let currentPage = +req.query.page || 1;
        let totalItems = await expenseData.count();
        let lastPage;
        const user = req.user
        let fetchExpense = await expenseData.findAll({
            where: { logindatumId: user.id }, offset: ((currentPage - 1) * itemsPerPage),
            limit: itemsPerPage
        })
        res.status(200).json({
            fetchExpense: fetchExpense,
            username: user.name,
            isPremiumUser: user.isPremiumUser,
            totalItems,
            currentPage: currentPage,
            hasNextPage: ((currentPage * itemsPerPage) < totalItems),
            hasPreviousPage: currentPage > 1,
            nextPage: currentPage + 1,
            previousPage: currentPage - 1,
            lastPage: lastPage,
        });
    } catch (err) {
        res.status(500).json({ err: err })
    }
}
exports.postExpense = async (req, res) => {
    try {
        const t = await sequelize.transaction();
        const { description, amount, category } = req.body
        const dataFromBack = req.user.createExpense({  // magic sequelize operation 
            description,
            amount,
            category,
            //logindatumId: req.user.id
        }, { transaction: t })
        const totalExpense = parseInt(req.user.totalExpense) + parseInt(amount)
        const update = User.update({
            totalExpense: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        })
        const expense = await Promise.all([dataFromBack, update])
        await t.commit()
        res.status(201).json({ dataFromBack: expense })
    } catch (err) {
        await t.rollback()
        console.log(err)
        res.status(500).json({ err: err })
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.user.id
        console.log(userId)
        const t = await sequelize.transaction()
        const expense = await expenseData.findOne({ where: { id: id, logindatumId: userId }, transaction: t })
        const totalExpense = parseInt(req.user.totalExpense) - parseInt(expense.amount)
        await User.update({
            totalExpense: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        })
        await expenseData.destroy({ where: { id: id, logindatumId: userId }, transaction: t })
        await t.commit()
        res.status(200).json({ res: "delete success" })
    } catch (err) {
        await t.rollback()
        res.status(500).json({ err: err })
    }
}

exports.downloadExpense = async (req, res) => {
    try {
        const user = req.user
        const expenses = await user.getExpenses();
        //console.log(expenses)
        const stringifiedExpenses = JSON.stringify(expenses)
        const filename = `${user.id}Expense/${new Date()}.txt`
        const file = await uploadToS3(stringifiedExpenses, filename)

        const fileUpload = req.user.createUpload({
            fileUrl: file,
            fileName: filename
        })
        res.status(201).json({ url: file })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err })
    }
}

function uploadToS3(data, filename) {

    const BUCKET_NAME = "expense9876"
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_SECRET_KEY;
    console.log(IAM_USER_KEY, IAM_USER_SECRET)
    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                console.log(s3response)
                resolve(s3response.Location);
            }
        })
    })
}