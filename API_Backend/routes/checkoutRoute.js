const express = require('express');
const router = express.Router();
const { checkout } = require('../controllers/checkoutController');
const { verifyToken, isUser } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout process from cart or direct buy-now
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - source
 *             properties:
 *               source:
 *                 type: string
 *                 description: Determines checkout flow
 *                 enum: [cart, buyNow]
 *                 example: cart
 *               product_id:
 *                 type: integer
 *                 description: Required only for buyNow
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 description: Required only for buyNow
 *                 example: 1
 *     responses:
 *       200:
 *         description: Checkout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Checkout Successful!"
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: number
 *                       example: 1599.99
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: integer
 *                             example: 3
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 799.99
 *       400:
 *         description: Invalid source or cart empty
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/checkout', verifyToken, isUser, checkout);

module.exports = router;