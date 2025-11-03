const pool = require("../db/db");
const logger = require("../logger");

const buyNow = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const [productRows] = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );
    if (productRows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    const product = productRows[0];
    const totalPrice = product.price * quantity;

    const [orderResult] = await pool.execute(
      "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
      [userId, totalPrice]
    );
    const orderId = orderResult.insertId;

    await pool.execute(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [orderId, productId, quantity, product.price]
    );

    await pool.execute("UPDATE products SET stock = stock - ? WHERE id = ?", [
      quantity,
      productId,
    ]);

    logger.info(`User ${userId} placed instant order #${orderId}`);
    return res.status(200).json({
      message: "Buy Now initiated successfully!",
      order: {
        orderId,
        product: product.name,
        quantity,
        totalPrice,
      },
    });
  } catch (err) {
    logger.error(`Error in Buy Now: ${err.message}`);
    return res.status(500).json({ message: "Server error in Buy Now" });
  }
};

const viewUserOrders =  async (req, res)=> {
  const userId = req.user.id;
  try{
    const ordersQuery = `SELECT * FROM orders WHERE user_id = ?`;
    const [orders] = await pool.execute(ordersQuery, [userId]);
    return res.status(200).json({ orders });
  } catch(err){
    logger.error(`Error fetching user orders: ${err.message}`);
    return res.status(500).json({ message: `Error fetching orders`});
  }
}

const viewOrderDetails = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [orderRows] = await pool.execute(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found!" });
    }

    const [items] = await pool.execute(
      `SELECT oi.quantity, oi.price, p.name, p.description
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
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (orderRows.length === 0)
      return res.status(404).json({ message: "Order not found!" });

    if (orderRows[0].status !== "pending")
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled!" });

    await pool.execute("UPDATE orders SET status = 'cancelled' WHERE id = ?", [
      id,
    ]);

    logger.info(`User ${userId} cancelled order #${id}`);
    return res.status(200).json({ message: "Order cancelled successfully!" });
  } catch (err) {
    logger.error(`Error cancelling order: ${err.message}`);
    return res.status(500).json({ message: "Error cancelling order" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status))
    return res.status(400).json({ message: "Invalid status!" });

  try {
    await pool.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    logger.info(`Order #${id} updated to ${status}`);
    return res.status(200).json({ message: `Order status updated to ${status}` });
  } catch (err) {
    logger.error(`Error updating order status: ${err.message}`);
    return res.status(500).json({ message: "Error updating order status" });
  }
};


module.exports = { buyNow, viewUserOrders, viewOrderDetails, cancelOrder, updateOrderStatus };
