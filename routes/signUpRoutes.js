
const express = require('express')
const router = express.Router()

const signUpControllers = require("../controllers/signUp")
const loginControllers = require("../controllers/login")

router.post("/signup", signUpControllers.signUp)

router.post('/login', loginControllers.login)

module.exports = router