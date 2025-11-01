const express = require('express');
const router = express.Router();
const { checkout } = require('../controllers/checkoutController');
const { verifyToken, isUser } = require('../middlewares/authMiddleware');

router.post('/checkout', verifyToken, isUser, checkout);

module.exports = router;