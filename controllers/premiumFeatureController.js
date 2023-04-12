const User = require("../models/loginPageModel")
const expenseData = require("../models/expenseData")
const sequelize = require("../util/database")

exports.showLeaderBoard = async (req, res) => {
    try {
        const leaderboardData = await User.findAll({
            order: [["totalExpense", 'DESC']]
        })
        console.log(leaderboardData)
        res.status(201).json({ leaderboardData })

    } catch (err) {
        res.status(500).json({ err: err })
    }
}