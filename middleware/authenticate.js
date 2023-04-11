const jwt = require('jsonwebtoken')
const User = require('../models/loginPageModel')

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Autherization')
        //console.log(token, "code iscomig to autherization")
        const user = jwt.verify(token, "secretkey")
        //console.log(user)
        User.findByPk(user.userId).
            then(user => {
                console.log(user)
                req.user = user
                next()
            })
            .catch(err => console.log(err))

    } catch (err) {
        //console.log(err)
        return res.status(401).json({ err: err })
    }
}
