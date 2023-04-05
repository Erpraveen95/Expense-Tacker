const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const loginRoutes = require("./routes/loginRoutes")

const app = express()
const sequelize = require("./models/loginPageModel")

app.use(cors())

app.use(bodyParser.json())
app.use(loginRoutes)

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