const mongoose = require("mongoose");

const forgetPasswordSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.UUID,
        required: true,
        auto: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ForgetPassword", forgetPasswordSchema);
