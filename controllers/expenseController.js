const AWS = require("aws-sdk")
const Expense = require("../models/expenseData");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.getAllExpense = async (req, res) => {
    try {
        const user = req.user;
        const fetchExpense = await Expense.find({ userId: user._id });
        res.status(200).json({
            fetchExpense: fetchExpense,
            username: user.name,
            isPremiumUser: user.isPremiumUser,
        });
    } catch (err) {
        res.status(500).json({ err: err });
    }
};
exports.getOneExpense = async (req, res, next) => {
    try {
        const response = await Expense.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ err: err });
    }
};
exports.getExpense = async (req, res) => {
    try {
        const itemsPerPage = +req.header('rows') || 2;
        let currentPage = +req.query.page || 1;
        const user = req.user;

        const totalItems = await Expense.countDocuments({ userId: user._id });
        const fetchExpense = await Expense.find({ userId: user._id })
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const lastPage = Math.ceil(totalItems / itemsPerPage);

        res.status(200).json({
            fetchExpense,
            username: user.name,
            isPremiumUser: user.isPremiumUser,
            totalItems,
            currentPage,
            hasNextPage: currentPage * itemsPerPage < totalItems,
            hasPreviousPage: currentPage > 1,
            nextPage: currentPage + 1,
            previousPage: currentPage - 1,
            lastPage,
        });
    } catch (err) {
        res.status(500).json({ err: err });
    }
};
exports.putUpdateExpense = async (req, res, next) => {
    const amount = parseInt(req.body.amount);
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const expenseResponse = await Expense.findOne(
            {
                _id: req.params.id,
                userId: req.user.id,
            },
        ).session(session);
        if (expenseResponse.amount != amount) {
            if (expenseResponse.amount < amount) {
                req.user.totalExpense += amount - expenseResponse.amount;
            } else {
                req.user.totalExpense -= expenseResponse.amount - amount;
            }
        }
        expenseResponse.amount = amount;
        expenseResponse.description = req.body.description;
        expenseResponse.category = req.body.category;
        await expenseResponse.save({ session });
        await req.user.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ expenseResponse, message: 'Expense updated successfully!' });
    } catch (err) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        res.status(500).json({ err: err });
    }
};

exports.postExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { description, amount, category } = req.body;
        const user = req.user;
        const expense = new Expense({
            description,
            amount,
            category,
            userId: user,
        });

        const dataFromBack = await expense.save({ session });

        const totalExpense = parseInt(user.totalExpense) + parseInt(amount);
        user.totalExpense = totalExpense;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ dataFromBack });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.log(err);
        res.status(500).json({ err: err });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const expense = await Expense.findOne({ _id: id, userId: userId }).session(session);
            const totalExpense = parseInt(req.user.totalExpense) - parseInt(expense.amount);

            await User.updateOne({ _id: userId }, { totalExpense: totalExpense }).session(session);
            await Expense.deleteOne({ _id: id, userId: userId }).session(session);

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ res: 'delete success' });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            throw error;
        }
    } catch (err) {
        res.status(500).json({ err: err });
    }
};

exports.downloadExpense = async (req, res) => {
    try {
        const user = req.user
        const expenses = await user.getExpenses();
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