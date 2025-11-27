const express = require('express');
const router = express.Router();
const {addToCart, viewCartItems, removeCartItem} = require('../controllers/cartController');
const { verifyToken, isUser } = require('../middlewares/authMiddleware');

router.post('/add', verifyToken, addToCart);

router.get('/view', verifyToken, viewCartItems);

router.delete('/removeItem/:id', verifyToken, removeCartItem);

module.exports = router;