const express = require('express');
const router = express.Router();
const { viewOrderDetails, viewUserOrders, cancelOrder, updateOrderStatus} = require('../controllers/ordersController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get("/", verifyToken, viewUserOrders);

router.get("/:id", verifyToken, viewOrderDetails);

router.put("/:id/cancel", verifyToken, cancelOrder);

router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

module.exports = router;