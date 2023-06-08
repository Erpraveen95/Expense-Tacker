
const uuid = require("uuid")
const User = require("../models/userModel")
const Forgetpassword = require("../models/forgetPasswords")
const Sib = require("sib-api-v3-sdk")
const client = Sib.ApiClient.instance
require('dotenv').config()

const apiKey = client.authentications["api-key"]
apiKey.apiKey = process.env.SIB_API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()
const bcrypt = require("bcrypt")

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email: email })
        if (user) {
            const id = uuid.v4()
            await Forgetpassword.create({ _id: id, isActive: true, user: user._id }) // Create ForgetPassword document
            const sender = {
                email: "work.erpraveen@gmail.com",
                name: "Expense Tracker Team"
            }
            const recievers = [{
                email: user.email,
            }]

            await tranEmailApi.sendTransacEmail({
                sender,
                to: recievers,
                subject: "Expense Tracker : OTP ",
                textContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
            })
        }
        res.status(200).json({ res: "link to reset password has been sent to your email!!" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const id = req.params.id;
        const forgetPasswordReq = await Forgetpassword.findOne({ _id: id, isActive: true })
        if (forgetPasswordReq) {
            await forgetPasswordReq.updateOne({ isActive: false })
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`)
            res.end()
        }
    } catch (err) {
        res.status(500).json({ err: err })
    }
}
exports.updatePassword = async (req, res) => {
    try {
        const { newpassword } = req.query
        const { resetpasswordid } = req.params
        const resetpasswordrequest = await Forgetpassword.findOne({ _id: resetpasswordid })
        const user = await User.findOne({ _id: resetpasswordrequest.user })

        if (user) {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                    throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                    if (err) {
                        throw new Error(err);
                    }
                    user.updateOne({ password: hash }).then(() => {
                        res.status(201).json({ res: "password changed success!!" })
                    })
                })
            })
        } else {
            return res.status(404).json({ res: "no user found" })
        }
    } catch (err) {
        res.status(500).json({ err: err })
    }
}