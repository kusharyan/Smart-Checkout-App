require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require('../config/db');
const logger = require('../config/logger');

const signup = async (req, res) => {
  const { name, email, password, role_id} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let assignedRole = role_id ?? 2;// role_id 2 is for regular user by default
    if(req.user && req.user.role_id === 1 && role_id === 1){
      assignedRole = role_id;
    }
    const query = `INSERT INTO users(email, name, password, role_id) VALUES(?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [email, name, hashedPassword, assignedRole]);
    logger.info(`User Created Successfully!`)
    return res
      .status(200)
      .json({
        message: "User Created Successfully!",
        user: { id: result.insertId, name, email, role_id: assignedRole },
      });
  } catch (err) {
    logger.error(`Error during signup: ${err.message}`);
    return res.status(500).json({ message: "Internal Server/Code Error" });
  }
};

const login = async (req, res) => {
  const { email, password}  =req.body;
  try{
    const query =  `SELECT * FROM users WHERE email = ?`;
    const [result] = await pool.execute(query, [email]);
    if(result.length === 0){
      logger.error(`Enter Valid Email`);
      return res.status(401).json({ message: `Enter Valid Email`});
    }
    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({ message: `Enter Valid Password`})
    }
    const token = await jwt.sign({id: user.id, role_id: user.role_id}, process.env.JWT_SECRET, { expiresIn: '1h'});
    logger.info(`User Login Successfull: ${user.id}`);
    return res
      .status(200)
      .json({
        message: `Login Successfull!`,
        token,
        user: { id: user.id, name: user.name, role_id: user.role_id },
      });
  } catch(err){
    logger.error(`Error Login user ${err.message}`);
    return res.status(500).json({ message: `Interval server error`});
  }
}

const getAllUsers = async(req, res)=> {
  try{
    const query = `Select id, name, email, role_id from users`;
    const [users] = await pool.execute(query);
    logger.info(`Fetched all users successfully`);
    return res.status(200).json({ users });
  } catch(err){
    logger.error(`Error fetching users: ${err.message}`);
    return res.status(500).json({ message: `Error fetching users`});
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    logger.error(`No user id provided in params`);
    return res.status(400).json({ message: `User id is required` });
  }
  try {
    const deleteQuery = `DELETE FROM users WHERE id = ?`;
    const [result] = await pool.execute(deleteQuery, [id]);
    if (result && result.affectedRows === 0) {
      logger.warn(`No user found with id: ${id}`);
      return res.status(404).json({ message: `User not found` });
    }
    logger.info(`User Deleted Successfully: ${id}`);
    return res.status(200).json({ message: `User Deleted Successfully` });
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    return res.status(500).json({ message: `Error deleting user ${err.message}` });
  }
}

module.exports = { signup, login, getAllUsers, deleteUser };
