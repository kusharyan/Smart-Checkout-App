const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentsController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post("/create-order", verifyToken, createPaymentOrder);

router.post("/verify", verifyToken, verifyPayment);

module.exports = router;