const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, updateStock, deleteProduct, getSingleProduct } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/getProducts', verifyToken, getAllProducts);

router.get('/SingleProduct/:id', verifyToken, getSingleProduct );

router.post('/addProduct', verifyToken, isAdmin, upload.single('image'), addProduct);

router.put('/updateProduct/:id', verifyToken, isAdmin, upload.single('image'), updateProduct);

router.patch('/updateStock/:id', verifyToken, isAdmin, updateStock);

router.delete('/deleteProduct/:id', verifyToken, isAdmin, deleteProduct)

module.exports = router;
