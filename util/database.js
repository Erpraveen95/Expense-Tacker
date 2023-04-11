const Sequelize = require("sequelize")
const sequelize = new Sequelize("signup", "root", "Gautam@123", {
    dialect: "mysql",
    host: "localhost",
})

module.exports = sequelize;