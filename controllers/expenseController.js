const expenseData = require('../models/expenseData')

exports.getExpense = async (req, res) => {
    try {
        const fetchExpense = await expenseData.findAll()
        res.status(200).json({ fetchExpense: fetchExpense })

    } catch (err) {
        res.status(500).json({ err: err })
    }
}
exports.postExpense = async (req, res) => {
    try {
        const { description, amount, category } = req.body
        const dataFromBack = await expenseData.create({
            description,
            amount,
            category
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
        await expenseData.destroy({ where: { id: id } })
        res.status(200).json({ res: "delete success" })
    } catch (err) {

    }
}