const expenseData = require('../models/expenseData')

exports.getExpense = async (req, res) => {
    try {
        const user = req.user
        console.log(">>>>>>>>>>>>>>>>>this ", user.id)
        const fetchExpense = await expenseData.findAll({ where: { logindatumId: user.id } })
        res.status(200).json({ fetchExpense: fetchExpense })

    } catch (err) {
        res.status(500).json({ err: err })
    }
}
exports.postExpense = async (req, res) => {
    try {
        const { description, amount, category } = req.body
        const dataFromBack = await req.user.createExpense({  // magic sequelize operation 
            description,
            amount,
            category,
            //logindatumId: req.user.id
        })
        res.status(201).json({ dataFromBack: dataFromBack })
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