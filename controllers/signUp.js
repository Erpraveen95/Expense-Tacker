
const login = require("../models/loginPageModel.js")
const bcrypt = require('bcrypt')

exports.signUp = async (req, res) => {
    //console.log(req.body, "data from frountend")

    const { name, email, phone, password } = req.body
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        try {
            await login.create({
                name,
                email,
                phone,
                password: hash
            })
            res.status(201).json({ res: "Create Account Success" });
        } catch (err) {
            console.log("backend err", err)

            res.status(400).json({ error: err })
        }

    })
}