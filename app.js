const express = require("express")
const bodyParser = require("body-parser")
const morgan = require('morgan')
const fs = require('fs')
const path = require("path")
require('dotenv').config()

const User = require("./models/loginPageModel")
const expenseData = require("./models/expenseData")
const Order = require("./models/orders")
const Forgetpassword = require("./models/forgetPasswords")
const Uploads = require("./models/fileUploads")

const sequelize = require("./util/database")
const loginRoutes = require("./routes/signUpRoutes")
const forgotPasswordRoute = require("./routes/forgotPasswordRoutes")
const expenseRoutes = require("./routes/expenseRoutes")
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require("./routes/premiumFeatures")

const accessLogStream = fs.createWriteStream(path.join(__dirname, "accessLog"), { flags: "a" })

const app = express()
app.use(morgan('combined', { stream: accessLogStream }))


app.use(bodyParser.json())

app.use(loginRoutes)
app.use(forgotPasswordRoute)
app.use(expenseRoutes)
app.use(purchaseRoutes)
app.use(premiumFeatureRoutes)

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `views/html/${req.url}`))
})

expenseData.belongsTo(User, { constrains: true, onDelete: 'CASCADE' })
User.hasMany(expenseData)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Forgetpassword)
Forgetpassword.belongsTo(User)

User.hasMany(Uploads)
Uploads.belongsTo(User)

sequelize
    //.sync({ force: true })
    .sync()
    .then(() => {
        console.log("db connect")

        app.listen(process.env.PORT || 3000, () => {
            console.log(`server started at port ${process.env.PORT || 3000}`)
        })
    })
    .catch(err => {
        console.log(err)
    })