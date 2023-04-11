const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const loginSchema = sequelize.define("logindata", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isPremiumUser: {
        type: Sequelize.BOOLEAN
    }
});

module.exports = loginSchema