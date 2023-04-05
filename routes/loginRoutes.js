
const express = require('express')
const router = express.Router()

const login = require("../models/loginPageModel.js")

router.post("/login", async (req, res, next) => {
    console.log(req.body, "data from frountend")
    try {
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const user = await login.create({
            name: name,
            email: email,
            phone: phone,
            password: password
        })
        //console.log("this is returned by user.create", user)
        res.status(200).json({ res: "Create Account Success" });
    } catch (err) {
        const errorMessage = err.errors[0].message;
        res.status(500).json({ err: errorMessage })
    }
})

module.exports = router