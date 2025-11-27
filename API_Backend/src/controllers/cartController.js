const pool = require('../config/db');
const logger = require('../config/logger');

const addToCart = async(req, res)=> {
  const {product_id, quantity} = req.body;
  const userId = req.user.id;
  try{
    const query = `Select * from cart where user_id = ? AND is_active = TRUE`;
    const [cartRows] = await pool.execute(query, [userId]);
    let cartId;
    if(cartRows.length == 0){
      const newCartQuery = `INSERT INTO cart(user_id) VALUES(?)`;
      const [newCart] = await pool.execute(newCartQuery, [userId]);
      cartId = newCart.insertId;
    } else{
      cartId = cartRows[0].id;
    }

    const itemsQuery = `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`;
    const [itemsRows] = await pool.execute(itemsQuery, [cartId, product_id]);
    if(itemsRows.length > 0){
      const updateQunatityQuery = `Update cart_items set quantity = quantity + ? where cart_id = ? and product_id = ?`;
      const [updateQuantityRows] = await pool.execute(updateQunatityQuery, [quantity, cartId, product_id]);
    } else{
      const addItemQuery = `INSERT INTO cart_items(cart_id, product_id, quantity) VALUES(?, ?, ?)`;
      const [addItemRows] = await pool.execute(addItemQuery, [cartId, product_id, quantity]);
    }
    logger.info(`Item Added to Cart Successfully! ${userId}`);
    return res.status(200).json({message:`Item Added to Cart!`});
  } catch(err){
    logger.error(`Error Adding to Cart, ERROR: ${err.message}`);
    return res.status(500).json({ message: `Error Adding to Cart${err.message}`});
  }
}

const viewCartItems = async (req, res) => {
  const userId = req.user.id;
  try {
    const [items] = await pool.execute(
      `SELECT ci.id, p.name, p.price, ci.quantity, (p.price * ci.quantity) AS total
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       JOIN cart c ON ci.cart_id = c.id
       WHERE c.user_id = ? AND c.is_active = TRUE`,
      [userId]
    );

    if (items.length === 0) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }

    const totalAmount = items.reduce((sum, i) => sum + parseFloat(i.total), 0);
    return res.status(200).json({ message: `Cart items of userId ${userId}`, items, totalAmount });
  } catch (err) {
    logger.error(`Error Viewing Cart Items, ERROR: ${err.message}`);
    return res.status(500).json({ message: `Error Viewing Cart Items ${err.message}` });
  }
};

const removeCartItem = async (req, res)=> {
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const deleteQuery = `DELETE ci FROM cart_items ci
                         JOIN cart c ON ci.cart_id = c.id
                         WHERE ci.id = ? AND c.user_id = ? AND c.is_active = TRUE`;
    const [deleteResult] = await pool.execute(deleteQuery, [id, userId]);
    if(deleteResult.affectedRows === 0){
      return res.status(404).json({ message: `Cart item not found or does not belong to user` });
    }
    logger.info(`Cart Item Removed Successfully! User ID: ${userId}, Item ID: ${id}`);
    return res.status(200).json({ message: `Cart Item Removed Successfully!` });
  } catch(error){
    logger.error(`Error Removing Cart Item, ERROR: ${error.message}`);
    return res.status(500).json({ message: `Error Removing Cart Item ${error.message}` });
  }
}

module.exports = { addToCart, viewCartItems, removeCartItem };