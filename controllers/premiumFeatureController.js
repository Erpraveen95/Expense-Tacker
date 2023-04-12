const User = require("../models/loginPageModel")
const expenseData = require("../models/expenseData")
const sequelize = require("../util/database")

exports.showLeaderBoard = async (req, res) => {
    try {
        const leaderboardData = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')),
                'totalExpense']],
            include: [{
                model: expenseData,
                attributes: []
            }],
            group: ['logindata.id'],
            order: [[sequelize.col('totalExpense'), 'DESC']]
        })
        console.log(leaderboardData)
        res.status(201).json({ leaderboardData })

    } catch (err) {
        res.status(500).json({ err: err })
    }
}