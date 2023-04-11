const Razorpay = require("razorpay")
const Order = require("../models/orders")

exports.getPayment = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 500;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(json.stringify(err))
            }
            req.user.createOrder({ orderId: order.id, status: "Pending" }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id })

            })
                .catch(err => {
                    throw new Error(err)
                })
        })
    } catch (err) {
        res.status(403).json({ err: err })
    }
}

exports.updateUserStatus = async (req, res) => {
    try {
        console.log(res, "this is req status")
        const { payment_id, order_id } = req.body
        const order = await Order.findOne({ where: { orderId: order_id } })
        if (!order) {
            res.status(404).json({ message: "Order not found" })
        }
        const promise1 = order.update({
            paymentId: payment_id,
            status: payment_id ? "Success" : "Failed"
        })
        const promise2 = req.user.update({ isPremiumUser: payment_id ? true : false })
        await Promise.all([promise1, promise2])
        res.status(202).json({ message: "transaction successful" })
    } catch (err) {
        console.log(err, "update status err")
        res.status(500).json({ err: err })
    }
}