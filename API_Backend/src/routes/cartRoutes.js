const express = require('express');
const router = express.Router();
const {addToCart, viewCartItems, removeCartItem} = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     description: Adds product to active cart or updates quantity if already exists
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, quantity]
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             example:
 *               message: Item Added to Cart!
 *               cart_id: 1
 *               product_id: 5
 *               quantity: 2
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/add', verifyToken, addToCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: View cart items
 *     tags: [Cart]
 *     description: Fetch all cart items of the logged-in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved
 *         content:
 *           application/json:
 *             example:
 *               message: Cart items of userId 1
 *               items:
 *                 - id: 3
 *                   name: Coffee Mug
 *                   price: 299
 *                   quantity: 2
 *                   total: 598
 *               totalAmount: 598
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, viewCartItems);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove cart item
 *     tags: [Cart]
 *     description: Removes a specific cart item belonging to logged-in user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Cart item removed
 *         content:
 *           application/json:
 *             example:
 *               message: Cart Item Removed Successfully!
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, removeCartItem);

module.exports = router;