const express = require('express');
const router = express.Router();
const {addToCart, viewCartItems, removeCartItem} = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/add', verifyToken, addToCart);

router.get('/', verifyToken, viewCartItems);

router.delete('/:id', verifyToken, removeCartItem);

module.exports = router;