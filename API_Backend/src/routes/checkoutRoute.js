const express = require('express');
const router = express.Router();
const { checkoutCart } = require('../controllers/checkoutController');
const { verifyToken, isUser } = require('../middlewares/authMiddleware');

router.post('/checkout', verifyToken, isUser, checkoutCart);

module.exports = router;