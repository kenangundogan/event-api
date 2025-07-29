const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Admin routes
router.get('/', authenticateToken, authorizeRoles(['admin']), permissionController.getAll);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), permissionController.getById);
router.post('/', authenticateToken, authorizeRoles(['admin']), permissionController.create);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), permissionController.update);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), permissionController.delete);

module.exports = router; 