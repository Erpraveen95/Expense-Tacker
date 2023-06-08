const User = require("../models/userModel")
const Uploads = require("../models/fileUploads")
const Expense = require("../models/expenseData");

exports.showLeaderBoard = async (req, res) => {
    try {
        const leaderboardData = await User.find().sort({ totalExpense: -1 });
        res.status(201).json({ leaderboardData });
    } catch (err) {
        res.status(500).json({ err: err });
    }
};

exports.getTableData = async (req, res) => {
    try {
        const user = req.user;
        const response = await Expense.find({ userId: user._id })
            .select('createdAt amount description category');

        res.status(200).json({ res: response });
    } catch (err) {
        res.status(500).json({ err: err });
    }
};


exports.getFileHistory = async (req, res) => {
    try {
        const user = req.user;
        const files = await Uploads.find({ userId: user._id });
        res.status(200).json({ files: files });
    } catch (err) {
        res.status(500).json({ err: err });
    }
};
