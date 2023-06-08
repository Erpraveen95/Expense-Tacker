const express = require("express")
const bodyParser = require("body-parser")
const morgan = require('morgan')
const cors = require("cors")
const fs = require('fs')
const path = require("path")
const mongoose = require('mongoose')
require('dotenv').config()

const loginRoutes = require("./routes/signUpRoutes")
const forgotPasswordRoute = require("./routes/forgotPasswordRoutes")
const expenseRoutes = require("./routes/expenseRoutes")
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require("./routes/premiumFeatures")

const accessLogStream = fs.createWriteStream(path.join(__dirname, "accessLog"), { flags: "a" })

const app = express()
app.use(cors())
app.use(morgan('combined', { stream: accessLogStream }))


app.use(bodyParser.json())

app.use(loginRoutes)
app.use(forgotPasswordRoute)
app.use(expenseRoutes)
app.use(purchaseRoutes)
app.use(premiumFeatureRoutes)

app.use((req, res) => {
    let url = req.url
    res.header('Content-Security-Policy', "img-src 'self'");
    if (url == "/") {
        url = "signUpPage.html"
    }
    res.sendFile(path.join(__dirname, `views/html/${url}`))
})


mongoose.connect(`mongodb+srv://${process.env.DBUSERNAME}:${process.env.PASSWORD}@cluster0.6ksoj3r.mongodb.net/Expense-Tracker?retryWrites=true&w=majority`)
    .then(() => {
        console.log('mongoDb connected!')
        app.listen(3000, () => {
            console.log('server started at port 3000')
        })
    })