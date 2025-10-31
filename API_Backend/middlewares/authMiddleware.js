require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../logger');

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if(!token){
    logger.warn(`Access denied: No token provided`);
    return res.status(401).json({ message: `No Token provided`})
  }
  try{
    const decoded = await jwt.verify(token, process.env.JWt_SECRET);
    req.user = decoded;
    logger.info(`user authenticated: ${decoded.email}`);
    next();
  } catch(err){
    logger.error(`Invalid Token!`);
    return res.status(500).json({ message: `Token is not valid!` });
  }
}

const isAdmin = async (req, res, next) => {
  if(req.user.role_id !== 1){ 
    return res.status(401).json({ message: `Admin Acces required!`});
  }
  next();
}

const isUser = async (req, res, next) => {
  if(req.user.role_id !== 2){
    return res.status(401).json({message: `User acces required!`});
  }
  next();
}

module.exports = {verifyToken, isAdmin, isUser};