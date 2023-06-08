const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

function validate(inputString) {
    if (inputString == undefined || inputString.length === 0) {
        return false;
    } else {
        return true;
    }
}

exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!validate(name) || !validate(email) || !validate(phone) || !validate(password)) {
            res.status(401).json({ message: "Bad Parameters", success: "false" });
            return;
        }

        const existingUser = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exist" });
        }

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                res.status(400).json({ err: err });
                return;
            }
            await User.create({ name, email, phone, password: hash });
            res.status(200).json({ message: "User created", status: "success" });
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

