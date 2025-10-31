const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, updateStock, deleteProduct, getSingleProduct } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/getProducts', verifyToken, getAllProducts);
router.get('/SingleProduct/:id', verifyToken, getSingleProduct );
router.post('/addProduct', verifyToken, isAdmin, addProduct);
router.put('/updateProduct/:id', verifyToken, isAdmin, updateProduct);
router.put('/updateStock/:id', verifyToken, isAdmin, updateStock);
router.delete('/deleteProduct/:id', verifyToken, isAdmin, deleteProduct)

module.exports = router;
