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
function download() {
    axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 201) {
                //the bcakend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileUrl;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            showError(err)
        });
}