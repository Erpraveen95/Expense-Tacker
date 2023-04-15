const express = require("express")
const router = express.Router()
const userAuthentication = require("../middleware/authenticate")

const expenseControllers = require("../controllers/expenseController")

router.get('/getExpense', userAuthentication.authenticate, expenseControllers.getExpense)

router.post("/addExpense", userAuthentication.authenticate, expenseControllers.postExpense)

router.delete("/delete/:id", userAuthentication.authenticate, expenseControllers.deleteExpense)

router.get("/user/download", userAuthentication.authenticate, expenseControllers.downloadExpense)

module.exports = router
