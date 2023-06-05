const Razorpay = require("razorpay")
const Order = require("../models/orders")
const User = require("../models/userModel.js");

exports.getPayment = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = 500;

        rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            const user = req.user;

            await Order.create({
                userId: user._id,
                orderId: order.id,
                status: 'Pending',
            });

            res.status(201).json({ order, key_id: rzp.key_id });
        });
    } catch (err) {
        res.status(403).json({ err: err });
    }
};


exports.updateUserStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;

        const order = await Order.findOne({ orderId: order_id });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        const promises = [];

        promises.push(
            order.updateOne({
                paymentId: payment_id,
                status: payment_id ? 'Success' : 'Failed',
            })
        );

        promises.push(
            User.findByIdAndUpdate(
                req.user._id,
                { isPremiumUser: payment_id ? true : false },
                { new: true }
            )
        );

        await Promise.all(promises);

        res.status(202).json({ message: 'Transaction successful' });
    } catch (err) {
        console.log(err, 'update status err');
        res.status(500).json({ err: err });
    }
};