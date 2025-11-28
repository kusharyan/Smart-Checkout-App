const pool = require("../config/db");
const logger = require("../config/logger");

const viewUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const [orders] = await pool.execute(
      `SELECT id, total_price, status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({ orders });
  } catch (err) {
    logger.error(`Error fetching user orders: ${err.message}`);
    return res.status(500).json({ message: "Error fetching orders" });
  }
};

const viewOrderDetails = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [orderRows] = await pool.execute(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [items] = await pool.execute(
      `SELECT 
         oi.quantity,
         oi.price,
         p.name,
         p.description
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    return res.status(200).json({
      order: orderRows[0],
      items,
    });
  } catch (err) {
    logger.error(`Error fetching order details: ${err.message}`);
    return res.status(500).json({ message: "Error fetching order details" });
  }
};

const cancelOrder = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [orderRows] = await pool.execute(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderRows[0].status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    const [items] = await pool.execute(
      `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
      [id]
    );

    for (const item of items) {
      await pool.execute(
        `UPDATE products SET stock = stock + ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    await pool.execute(
      `UPDATE orders SET status = 'cancelled' WHERE id = ?`,
      [id]
    );

    logger.info(`User ${userId} cancelled order ${id}`);

    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (err) {
    logger.error(`Error cancelling order: ${err.message}`);
    return res.status(500).json({ message: "Error cancelling order" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    logger.info(`Order ${id} updated to ${status}`);
    return res.status(200).json({
      message: `Order status updated to ${status}`,
    });
  } catch (err) {
    logger.error(`Error updating order status: ${err.message}`);
    return res.status(500).json({ message: "Error updating order status" });
  }
};

module.exports = {
  viewUserOrders,
  viewOrderDetails,
  cancelOrder,
  updateOrderStatus,
};
