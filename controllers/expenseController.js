const expenseData = require('../models/expenseData')
const User = require('../models/loginPageModel')

exports.getExpense = async (req, res) => {
    try {
        const user = req.user
        console.log(">>>>>>>>>>>>>>>>>this ", user.id)
        const fetchExpense = await expenseData.findAll({ where: { logindatumId: user.id } })
        res.status(200).json({
            fetchExpense: fetchExpense, username: user.name,
            isPremiumUser: user.isPremiumUser
        })

    } catch (err) {
        res.status(500).json({ err: err })
    }
}
exports.postExpense = async (req, res) => {
    try {
        const { description, amount, category } = req.body
        const dataFromBack = req.user.createExpense({  // magic sequelize operation 
            description,
            amount,
            category,
            //logindatumId: req.user.id
        })
        const totalExpense = parseInt(req.user.totalExpense) + parseInt(amount)
        const update = User.update({
            totalExpense: totalExpense
        }, {
            where: { id: req.user.id }
        })
        const expense = await Promise.all([dataFromBack, update])
        res.status(201).json({ dataFromBack: expense })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err })
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.user.id
        console.log(userId)
        await expenseData.destroy({ where: { id: id, logindatumId: userId } })
        res.status(200).json({ res: "delete success" })
    } catch (err) {
        res.status(500).json({ err: err })
    }
}