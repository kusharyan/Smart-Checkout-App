const logger = require('../logger');
const pool = require('../db/db');

const checkout = async (req, res)=> {
  const { source, product_id, quantity } = req.body;
  const userId = req.user.id;
  try{
    let items = [];
    let totalAmount = 0;

    if(source === 'cart'){
      const cartQuery = `SELECT ci.product_id, ci.quantity, p.price 
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = (SELECT id FROM cart WHERE user_id = ? AND is_active = TRUE)`;
      const [cartItems] = await pool.execute(cartQuery, [userId]);
      if(cartItems.length === 0){
        return res.status(400).json({ message: 'Cart is empty!' });
      }
      items = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));
      totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else if(source === 'buyNow'){
      const productQuery = `SELECT * FROM products WHERE id = ?`;
      const [productRows] = await pool.execute(productQuery, [product_id]);
      if(productRows.length === 0){
        return res.status(404).json({ message: 'Product not found!' });
      }
      const product = productRows[0];
      totalAmount = product.price * quantity;
      items = [{ product_id: product.id, quantity, price: product.price }];
    } else{
      return res.status(400).json({ message: 'Invalid source for checkout!' });
    }
    const orderQuery = `INSERT INTO orders(user_id, total_amount, status) VALUES(?, ?, 'pending')`;
    const [orderResult] = await pool.execute(orderQuery, [userId, totalAmount]); 
    const orderId = orderResult.insertId;
    for(const item of items){
      const orderItemQuery = `INSERT INTO order_items(order_id, product_id, quantity, price) VALUES(?, ?, ?, ?)`;
      await pool.execute(orderItemQuery, [orderId, item.product_id, item.quantity, item.price]);
      await pool.execute(`UPDATE products SET stock = stock - ? WHERE id = ?`, [item.quantity, item.product_id]);
    }
    if(source === 'cart'){
      const deactivateCartQuery = `UPDATE cart SET is_active = FALSE WHERE user_id = ?`;
      await pool.execute(deactivateCartQuery, [userId]);
    }
    logger.info(`Checkout Successful for User ID: ${userId}, Order ID: ${orderId}`);
    return res.status(200).json({ message: 'Checkout Successful!', order: {id: orderId, total:totalAmount, items} });
  } catch(err){
    logger.error(`Error during Checkout, ERROR: ${err.message}`);
    return res.status(500).json({ message: `Error during Checkout${err.message}`});
  }
}

module.exports = {checkout};