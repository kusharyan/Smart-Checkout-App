const express = require('express');
const router = express.Router();

const {signup, login, getAllUsers, deleteUser} = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, isAdmin, getAllUsers)

router.post('/signup', signup);

router.post('/login', login);

router.delete('/delete/:id', verifyToken, isAdmin, deleteUser)

module.exports = router;