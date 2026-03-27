const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authMiddleware, adminMiddleware, authController.getUsers);

module.exports = router;
