const express = require('express');
const router = express.Router();
const {buyNow} = require('../controllers/ordersController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/buyNow', verifyToken, buyNow);

module.exports = router;