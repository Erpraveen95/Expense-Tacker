const User = require("../models/loginPageModel")
const expenseData = require("../models/expenseData")

exports.showLeaderBoard = async (req, res) => {
    try {
        const allUser = User.findAll()
        const allExpense = expenseData.findAll()
        const response = await Promise.all([allUser, allExpense])
        const userAggregatedResponse = {}
        //console.log(response[1], "this is a ll expense")
        response[1].forEach(expense => {
            const userId = expense.dataValues.logindatumId
            const amount = expense.dataValues.amount
            if (userAggregatedResponse[userId]) {
                userAggregatedResponse[userId] += amount
            } else {
                userAggregatedResponse[userId] = amount
            }
        });
        const leaderboardData = []
        response[0].forEach(user => {
            leaderboardData.push({ name: user.name, totalExpense: userAggregatedResponse[user.id] })
        })
        //console.log("leaderboard data", leaderboardData)
        leaderboardData.sort((a, b) => {
            return b.totalExpense - a.totalExpense;
        })
        res.status(201).json({ leaderboardData })

    } catch (err) {
        res.status(500).json({ err: err })
    }
}