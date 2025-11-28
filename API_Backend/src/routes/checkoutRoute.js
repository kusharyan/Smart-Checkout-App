const express = require('express');
const router = express.Router();
const { checkoutCart } = require('../controllers/checkoutController');
const { verifyToken, isUser } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Cart checkout and order placement
 */

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout cart
 *     tags: [Checkout]
 *     description: |
 *       Places an order for the active cart of the logged-in user.
 *       - Validates cart exists
 *       - Checks stock availability
 *       - Creates order and order items
 *       - Deducts product stock
 *       - Deactivates cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order placed successfully
 *               orderId: 15
 *               totalAmount: 1299
 *       400:
 *         description: Cart empty or insufficient stock
 *         content:
 *           application/json:
 *             example:
 *               message: Cart is empty
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User access required
 *       500:
 *         description: Checkout failed
 */
router.post('/checkout', verifyToken, isUser, checkoutCart);

module.exports = router;