const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, updateStock, deleteProduct, getSingleProduct } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', verifyToken, getAllProducts);

router.get('/:id', verifyToken, getSingleProduct );

router.post('/add', verifyToken, isAdmin, upload.single('image'), addProduct);

router.put('/update/:id', verifyToken, isAdmin, upload.single('image'), updateProduct);

router.patch('/stock/:id', verifyToken, isAdmin, updateStock);

router.delete('/delete/:id', verifyToken, isAdmin, deleteProduct)

module.exports = router;
