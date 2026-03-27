const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, adminMiddleware, orderController.getAll);
router.get('/my-orders', authMiddleware, orderController.getByUserId);
router.post('/', authMiddleware, orderController.create);
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateStatus);

module.exports = router;
