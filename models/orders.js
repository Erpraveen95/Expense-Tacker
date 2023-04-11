const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const Order = sequelize.define("orders", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    orderId: {
        type: Sequelize.STRING
    },
    paymentId: {
        type: Sequelize.STRING
    },
    status: Sequelize.STRING
})
module.exports = Order;;