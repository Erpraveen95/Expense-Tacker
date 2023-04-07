const express = require("express")
const router = express.Router()

const expenseControllers = require("../controllers/expenseController")

router.get('/getExpense', expenseControllers.getExpense)

router.post("/addExpense", expenseControllers.postExpense)
router.delete("/delete/:id", expenseControllers.deleteExpense)

module.exports = router
