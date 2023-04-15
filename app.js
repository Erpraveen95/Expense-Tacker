const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

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

const app = express()
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

app.use(loginRoutes)
app.use(forgotPasswordRoute)
app.use(expenseRoutes)
app.use(purchaseRoutes)
app.use(premiumFeatureRoutes)

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
        app.listen(3000, () => {
            console.log("server started at port 3000")
        })
    })
    .catch(err => {
        console.log(err)
    })