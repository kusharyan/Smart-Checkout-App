const pool = require('../config/db');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');

//get all products
const getAllProducts = async(req, res) => {
  try{
    const query = `SELECT * FROM Products`;
    const [result] = await pool.execute(query);
    logger.info(`Products fetched successfully!`);
    return res.status(200).json(result); 
  } catch(err){
    logger.error(`Error Fetching All Products! ERROR: ${err.message}`);
    return res.status(500).json({message: `Error Fetching All Products!`})
  }
}

// get single product 
const getSingleProduct = async (req, res)=> {
  const {id} = req.params;
  try{
    const query = `SELECT * From Products Where id = ?`;
    const [result] = await pool.execute(query, [id]);
    logger.info(`Product Fetched!`);
    return res.status(200).json({ message: `Product fetched!`, result});
  } catch(err){
    logger.error(`Error Getting product details, ${err.message}`);
    return res.status(500).json({ message: `Error getting product details, ${err.message}` })
  }
}

const addProduct = async(req, res)=> {
  try{
    const { name, description, price, stock } = req.body;
    const file = req.file;

    if (!name || !price) {
      if (file) {
        const fs = require('fs');
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const imagePath = file ? `uploads/products/${file.filename}` : null;

    const query = `
      INSERT INTO products (name, description, price, stock, image_url)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      name,
      description || null,
      price,
      stock || 0,
      imagePath
    ]);

    logger.info(`Product Added Successfully!`);

    return res.status(200).json({
      message: `Product added!`,
      product: {
        id: result.insertId,
        name,
        description,
        price,
        stock,
        image_url: imagePath 
          ? `${req.protocol}://${req.get('host')}/${imagePath}`
          : null
      }
    });

  } catch(err){
    if (req.file) {
      const fs = require('fs');
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    logger.error(`Error Adding Product, ERROR: ${err.message}`);
    return res.status(500).json({ message: `Error Adding Product: ${err.message}` });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const file = req.file;

    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      if (file) fs.unlinkSync(file.path);
      return res.status(404).json({ message: 'Product not found' });
    }
    const existing = rows[0];
    let imagePath = existing.image_url;

    if (file) {
      imagePath = `uploads/products/${file.filename}`;
      if (existing.image_url) {
        const oldPath = path.join(__dirname, '..', existing.image_url);
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore if missing */ }
      }
    }

    const updates = [];
    const values = [];

    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (stock !== undefined) { updates.push('stock = ?'); values.push(stock); }
    if (file) { updates.push('image_url = ?'); values.push(imagePath); }

    if (updates.length === 0) {
      if (file) { /* already handled file replacement */ }
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(query, values);

    return res.status(200).json({ message: 'Product updated' });
  } catch (err) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    logger.error(`Error updating product: ${err.message}`);
    return res.status(500).json({ message: 'Error updating product' });
  }
};

const updateStock = async(req, res)=> {
  const {id} = req.params;
  const {stock} = req.body;
  try{
    const query = `UPDATE Products SET stock = ? where id = ? `;
    const [result] = await pool.execute(query, [stock, id]);
    logger.info(`Stock updated!`);
    return res.status(200).json({ result, message: `Stock updated of product id :${id}`});
  } catch(err){
    logger.error(`Error occured while updating stock ${err.message}`);
    return res.status(500).json({ message: `Error occured while updating stock!`});
  }
}

const deleteProduct = async(req, res)=> {
  const {id} = req.params;
  try{
    const query = `DELETE FROM Products WHERE id = ? `;
    await pool.execute(query, [id]);
    logger.info(`Product deleted!`);
    return res.status(200).json({ message: `Product Deleted!`});
  } catch(err){
    logger.error(`Error occurred while deleting product, ${err.message}`);
    return res.status(500).json({ message:`Error occurred while deleting product, ${err.message}`})
  }
}

module.exports = { getAllProducts, getSingleProduct, addProduct, updateProduct, updateStock, deleteProduct };