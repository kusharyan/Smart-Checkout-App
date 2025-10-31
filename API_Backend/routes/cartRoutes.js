const express = require('express');
const router = express.Router();
const {addToCart, viewCartItems} = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/add', verifyToken, addToCart);
router.get('/view', verifyToken, viewCartItems);

module.exports = router;