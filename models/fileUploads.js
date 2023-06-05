const mongoose = require("mongoose");

const uploadsSchema = new mongoose.Schema({
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model("Uploads", uploadsSchema);
