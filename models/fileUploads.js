const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const uploads = sequelize.define("uploads", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileUrl: {
        type: Sequelize.STRING
    },
    fileName: {
        type: Sequelize.STRING
    }
})

module.exports = uploads;