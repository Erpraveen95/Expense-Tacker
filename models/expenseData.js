const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const expenseData = sequelize.define("expense", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    }

})
module.exports = expenseData