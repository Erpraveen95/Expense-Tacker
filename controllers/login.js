const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    function generateToken(id, name, isPremiumUser) {
        return jwt.sign({ userId: id, name, isPremiumUser }, "secretkey");
    }
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result === true) {
                    res.status(200).json({ res: "login success", token: generateToken(user._id, user.name, user.isPremiumUser) });
                } else {
                    res.status(401).json({ res: "password is incorrect" });
                }
            });
        } else {
            res.status(404).json({ res: "invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ err: error });
    }
};
