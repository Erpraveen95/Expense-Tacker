const Sequelize = require("sequelize")
const sequelize = new Sequelize("signup", "root", "Gautam@123", {
    dialect: "mysql",
    host: "localhost",
    define: {
        timestamps: false
    },
})

module.exports = sequelize;