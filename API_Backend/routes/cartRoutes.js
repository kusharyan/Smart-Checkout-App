const express = require('express');
const router = express.Router();
const {addToCart, viewCartItems} = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the user's active cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 3
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item Added to Cart!"
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/add', verifyToken, addToCart);

/**
 * @swagger
 * /cart/view:
 *   get:
 *     summary: View all items in the user's active cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart items of userId 2"
 *                 totalAmount:
 *                   type: number
 *                   example: 2000.50
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Apple Watch"
 *                       price:
 *                         type: number
 *                         example: 999.99
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       total:
 *                         type: number
 *                         example: 1999.98
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/view', verifyToken, viewCartItems);

module.exports = router;