const express = require('express');
const router = express.Router();
const { viewOrderDetails, viewUserOrders, cancelOrder, updateOrderStatus} = require('../controllers/ordersController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get("/orders", verifyToken, viewUserOrders);

router.get("/orders/:id", verifyToken, viewOrderDetails);

router.put("/orders/:id/cancel", verifyToken, cancelOrder);

router.put("/orders/:id/status", verifyToken, isAdmin, updateOrderStatus);

module.exports = router;