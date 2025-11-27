const razorpay = require('../config/razorpay');
const logger = require('../config/logger');
const crypto = require("crypto");

const createPaymentOrder = async(req, res)=>{
  const { amount, currency ='INR' } = req.body;
  try{
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt:  "order_rcpt_" + Date.now()
    }
    const order = await razorpay.orders.create(options);

    return res.status(200).json({ ...order, key: process.env.RAZORPAY_KEY_ID });
  } catch(err){
    logger.error(`Error creating payment order/Razorpay Error: ${err.message}`);
    return res.status(500).json({ message: `Error creating payment order: ${err.message}` });
  }
}

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    return res.status(200).json({ message: "Payment verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error verifying payment" });
  }
};

module.exports = { createPaymentOrder, verifyPayment };