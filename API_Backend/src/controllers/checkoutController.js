const logger = require('../config/logger');
const pool = require('../config/db');

const checkoutCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const [cartRows] = await pool.execute(
      `SELECT * FROM cart WHERE user_id = ? AND is_active = TRUE`,
      [userId]
    );

    if (cartRows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartId = cartRows[0].id;
    const [items] = await pool.execute(
      `
      SELECT ci.product_id, ci.quantity, p.price, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
      `,
      [cartId]
    );

    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    let totalAmount = 0;

    for (const item of items) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${item.product_id}`,
        });
      }
      totalAmount += item.price * item.quantity;
    }
    const [orderResult] = await pool.execute(
      `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`,
      [userId, totalAmount]
    );

    const orderId = orderResult.insertId;
    for (const item of items) {
      await pool.execute(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.product_id, item.quantity, item.price]
      );

      await pool.execute(
        `UPDATE products SET stock = stock - ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }
    await pool.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
    await pool.execute(`UPDATE cart SET is_active = FALSE WHERE id = ?`, [cartId]);

    logger.info(`Checkout successful for user ${userId}, order ${orderId}`);

    return res.status(201).json({
      message: "Order placed successfully",
      orderId,
      totalAmount,
    });

  } catch (err) {
    logger.error(`Checkout Error: ${err.message}`);
    return res.status(500).json({ message: "Checkout failed" });
  }
};

module.exports = {checkoutCart};