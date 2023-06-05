const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = Schema({
    paymentId: {
        type: String,
        default: null,
    },
    orderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Order', orderSchema);
