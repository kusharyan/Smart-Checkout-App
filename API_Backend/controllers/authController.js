require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require('../db/db');
const logger = require('../logger');

//user signup
const signup = async (req, res) => {
  const { name, email, password, role_id} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let assignedRole = 2;
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
        user: { id: result.insertId, name, email, role_id },
      });
  } catch (err) {
    logger.error(`Error during signup: ${err.message}`);
    return res.status(500).json({ message: "Internal Server/Code Error" });
  }
};

// user login
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
    return res.status(200).json({ message : `Login Successfull!`, user: { id: user.id, name: user.name}, token});
  } catch(err){
    logger.error(`Error Login user ${err.message}`);
    return res.status(500).json({ message: `Interval server error`});
  }
}

const getAllUsers = async(req, res)=> {
  try{
    const query = `Select id, name, email, role_id from users`;
    const [users] = await pool.execute(query);
    return res.status(200).json({ users });
  } catch(err){
    logger.error(`Error fetching users: ${err.message}`);
    return res.status(500).json({ message: `Error fetching users`});
  }
}

const deleteUser = async(req, res)=> {
  const userId =req.params.id;
  try{
    const deleteQuery = `DELETE FROM users WHERE id = ?`;
    await pool.execute(deleteQuery, [userId]);
    logger.info(`User Deleted Successfully: ${userId}`);
    return res.status(200).json({ message: `User Deleted Successfully`});
  } catch(err){
    logger.error(`Error deleting user: ${err.message}`);
    return res.status(500).json({ message: `Error deleting user`});
  }
}

module.exports = { signup, login, getAllUsers, deleteUser };
