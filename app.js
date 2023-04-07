const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const sequelize = require("./util/database")
const loginRoutes = require("./routes/signUpRoutes")
const expenseRoutes = require("./routes/expenseRoutes")

const app = express()
const User = require("./models/loginPageModel")
const expenseData = require("./models/expenseData")

app.use(cors())

app.use(bodyParser.json())
app.use(loginRoutes)
app.use(expenseRoutes)
expenseData.belongsTo(User, { constrains: true, onDelete: 'CASCADE' })
User.hasMany(expenseData)
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