const express = require("express")
const router = express.Router()
const userAuthentication = require("../middleware/authenticate")
const purchaseControllers = require("../controllers/payment")


router.get("/purchase/premiummembership",
    userAuthentication.authenticate,
    purchaseControllers.getPayment)

router.post("/purchase/updatetransactionstatus/", userAuthentication.authenticate,
    purchaseControllers.updateUserStatus)

module.exports = router




