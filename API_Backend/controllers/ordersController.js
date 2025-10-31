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
    return res.status(500).json({ message: "Server error in Buy Now" });
  }
};

module.exports = { buyNow };
