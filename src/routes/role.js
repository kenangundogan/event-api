const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/default', roleController.getDefaultRole);

// Admin routes
router.get('/', authenticateToken, authorizeRoles(['admin']), roleController.getAll);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), roleController.getById);
router.post('/', authenticateToken, authorizeRoles(['admin']), roleController.create);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), roleController.update);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), roleController.delete);

module.exports = router; 