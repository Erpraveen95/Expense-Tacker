const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const decoded = jwt.verify(token, "secretkey");
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ err: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ err: "Unauthorized" });
    }
};
