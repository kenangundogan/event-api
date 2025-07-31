const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Admin routes
router.get('/', authenticateToken, authorizeRoles(['admin']), userController.getAll);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), userController.getById);
router.post('/', authenticateToken, authorizeRoles(['admin']), userController.create);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), userController.update);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), userController.delete);

module.exports = router; 