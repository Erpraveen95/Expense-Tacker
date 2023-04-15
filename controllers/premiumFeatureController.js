const User = require("../models/loginPageModel")
const expenseData = require("../models/expenseData")
const sequelize = require("../util/database")
const Uploads = require("../models/fileUploads")

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
exports.getTableData = async (req, res) => {
    try {
        const user = req.user
        const response = await expenseData.findAll({
            where: { logindatumId: user.id },
            attributes: ['createdAt', 'amount', 'description', 'category']
        })
        console.log(response)
        res.status(200).json({ res: response })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err })
    }
}
exports.getFileHistory = async (req, res) => {
    try {
        const user = req.user
        const files = await user.getUploads()
        res.status(200).json({ files: files })
    } catch (err) {
        res.status(500).json({ err: err })
    }
}