const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, updateStock, deleteProduct, getSingleProduct } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/getProducts:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Retrieve a list of all available products.
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Wireless Mouse"
 *                   description:
 *                     type: string
 *                     example: "Ergonomic wireless mouse with USB receiver"
 *                   price:
 *                     type: number
 *                     example: 499.99
 *                   stock:
 *                     type: integer
 *                     example: 25
 *       500:
 *         description: Internal server error
 */
router.get('/getProducts', verifyToken, getAllProducts);

/**
 * @swagger
 * /api/SingleProduct/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 *     description: Retrieve details for a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Bluetooth Headphones"
 *                 description:
 *                   type: string
 *                   example: "Noise-cancelling over-ear headphones"
 *                 price:
 *                   type: number
 *                   example: 1999.99
 *                 stock:
 *                   type: integer
 *                   example: 10
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/SingleProduct/:id', verifyToken, getSingleProduct );

/**
 * @swagger
 * /api/addProduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []   # Optional if only admin can add products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smart Watch"
 *               description:
 *                 type: string
 *                 example: "Fitness tracker with heart rate sensor"
 *               price:
 *                 type: number
 *                 example: 2999.99
 *               stock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Product added successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post('/addProduct', verifyToken, isAdmin, addProduct);

/**
 * @swagger
 * /api/updateProduct/{id}:
 *   put:
 *     summary: Update product details
 *     tags: [Products]
 *     description: Update all fields of a product by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               description:
 *                 type: string
 *                 example: "Updated description for the product"
 *               price:
 *                 type: number
 *                 example: 1599.99
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateProduct/:id', verifyToken, isAdmin, updateProduct);

/**
 * @swagger
 * /api/updateStock/{id}:
 *   patch:
 *     summary: Update product stock
 *     tags: [Products]
 *     description: Update the stock quantity of a specific product.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.patch('/updateStock/:id', verifyToken, isAdmin, updateStock);

/**
 * @swagger
 * /api/deleteProduct/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     description: Remove a product from the database by ID.
 *     security:
 *       - bearerAuth: []   # optional
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteProduct/:id', verifyToken, isAdmin, deleteProduct)

module.exports = router;
