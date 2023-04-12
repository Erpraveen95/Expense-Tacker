const express = require("express")
const router = express.Router()
const userAuthentication = require("../middleware/authenticate")
const premiumControllers = require("../controllers/premiumFeatureController")

router.get("/premium/showleaderboard", userAuthentication.authenticate,
    premiumControllers.showLeaderBoard)

module.exports = router