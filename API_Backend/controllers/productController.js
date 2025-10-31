const pool = require('../db/db');
const logger = require('../logger');

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
4//add product
const addProduct = async(req, res)=> {
  const {name, description, price, stock } = req.body;
  try{
    const query = `INSERT INTO Products(name, description, price, stock) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [name, description, price, stock]);
    logger.info(`Product Added Successfully!`);
    return res.status(200).json({id:result.insertId, message:`Product added!`});
  } catch(err){
    logger.error(`Error Adding Product, ERROR: ${err.message}`);
    return res.status(500).json({ message: `Error Adding Prodcut${err.message}`});
  }
}

//update product
const updateProduct = async (req, res)=> {
  const {name, description, price, stock } = req.body;
  const { id } = req.params;
  try{
    const query = `UPDATE Products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [name, description, price, stock, id]);
    logger.info(`Product details Updated!`);
    return res.status(200).json({ id: result.insertId, message: `Product Updated!`});
  } catch(err){
    logger.error(`Error while updating product details ${err.message}`);
    return res.status(500).json({ message:`Error while updating the product details`});
  }
}

//update stock of the product
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

//delete prodcut
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