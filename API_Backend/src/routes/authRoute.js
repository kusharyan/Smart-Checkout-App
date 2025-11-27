const express = require('express');
const router = express.Router();

const {signup, login, getAllUsers, deleteUser} = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/getAllUsers', verifyToken, isAdmin, getAllUsers)

router.post('/signup', signup);

router.post('/login', login);

router.delete('/deleteUser/:id', verifyToken, isAdmin, deleteUser)

module.exports = router;