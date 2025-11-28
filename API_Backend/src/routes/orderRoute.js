const express = require('express');
const router = express.Router();
const { viewOrderDetails, viewUserOrders, cancelOrder, updateOrderStatus} = require('../controllers/ordersController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /order:
 *   get:
 *     summary: View user orders
 *     tags: [Orders]
 *     description: Fetch all orders of the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               orders:
 *                 - id: 12
 *                   total_price: 1299
 *                   status: pending
 *                   created_at: "2025-03-25T10:30:20.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, viewUserOrders);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: View order details
 *     tags: [Orders]
 *     description: Fetch order details and items for a specific order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved
 *         content:
 *           application/json:
 *             example:
 *               order:
 *                 id: 12
 *                 total_price: 1299
 *                 status: pending
 *               items:
 *                 - name: Coffee Mug
 *                   description: Ceramic mug
 *                   quantity: 2
 *                   price: 299
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id", verifyToken, viewOrderDetails);

/**
 * @swagger
 * /order/{id}/cancel:
 *   put:
 *     summary: Cancel order
 *     tags: [Orders]
 *     description: Cancels a pending order and restores product stock
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/:id/cancel", verifyToken, cancelOrder);

/**
 * @swagger
 * /order/{id}/status:
 *   put:
 *     summary: Update order status (Admin)
 *     tags: [Orders]
 *     description: Admin-only endpoint to update order status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             example:
 *               message: Order status updated to shipped
 *       400:
 *         description: Invalid order status
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

module.exports = router;