const express = require("express")
const router = express.Router()

const User = require("../models/loginPageModel")
const Sib = require("sib-api-v3-sdk")
const client = Sib.ApiClient.instance
require('dotenv').config()

const apiKey = client.authentications["api-key"]
apiKey.apiKey = process.env.SIB_API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()

router.post("/password/forgotpassword", async (req, res) => {
    try {
        const { email } = req.body
        const findUser = await User.findOne({ where: { email: email } })
        console.log(findUser.id)
        if (findUser.id) {
            const sender = {
                email: "work.erpraveen@gmail.com",
                name: "Expense Traker Team"
            }
            const recievers = [{
                email: findUser.email,
            }]
            const generateOTP = () => Math.floor(Math.random() * 9000) + 1000;
            const otp = generateOTP()
            await tranEmailApi.sendTransacEmail({
                sender,
                to: recievers,
                subject: "Expense Tracker : OTP ",
                textContent: `Here is Your otp ${otp} dont share it with anyone else!!`
            })
        }
        res.status(200).json({ res: "otp sent success" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err })
    }
})

module.exports = router