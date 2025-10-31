const pool = require('../db/db');
const logger = require('../logger');

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
      // logger.info(`Cart Updated Successfully!`);
      // return res.status(200).json({message:`Cart Updated!`});
    } else{
      const addItemQuery = `INSERT INTO cart_items(cart_id, product_id, quantity) VALUES(?, ?, ?)`;
      const [addItemRows] = await pool.execute(addItemQuery, [cartId, product_id, quantity]);
      // logger.info(`Item Added to Cart Successfully!`);
      // return res.status(200).json({message:`Item Added to Cart!`});
    }
    logger.info(`Item Added to Cart Successfully! ${userId}`);
    return res.status(200).json({message:`Item Added to Cart!`});
  } catch(err){
    logger.error(`Error Adding to Cart, ERROR: ${err.message}`);
    return res.status(500).json({ message: `Error Adding to Cart${err.message}`});
  }
}

const viewCartItems = async(req, res)=> {
  const userId = req.user.id;
  try{
    const query = `Select * From cart where user_id = ?`;
    const [cartRows] = await pool.execute(query, [userId]);
    if(cartRows.length == 0){
      return res.status(200).json({message: `Cart is empty!`, items: []});
    }
    const cartId = cartRows[0].id;
    const [items] = await pool.execute(
      `SELECT ci.id, p.name, p.price, ci.quantity, (p.price * ci.quantity) AS total
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    const totalAmount = items.reduce((sum, i) => sum + parseFloat(i.total), 0);
    return res.status(200).json({items, totalAmount});
  } catch(err){
    logger.error(`Error Viewing Cart Items, ERROR: ${err.message}`);
    return res.status(500).json({ message: `Error Viewing Cart Items${err.message}`});
  }
}

module.exports = { addToCart, viewCartItems };