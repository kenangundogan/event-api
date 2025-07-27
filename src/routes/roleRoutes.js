const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes (sadece varsayılan rol)
// Kullıcı oluşturulurken varsayılan rol gönderilir.
router.get('/default', roleController.getDefaultRole);

// Admin routes
router.get('/', authenticateToken, authorizeRoles(['admin']), roleController.getAllRoles);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), roleController.getRoleById);
router.post('/', authenticateToken, authorizeRoles(['admin']), roleController.createRole);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), roleController.updateRole);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), roleController.deleteRole);

// Role permissions routes
router.get('/:roleId/permissions', authenticateToken, authorizeRoles(['admin']), roleController.getRolePermissions);
router.get('/:roleId/permissions/:permission', authenticateToken, authorizeRoles(['admin']), roleController.getRolePermission);

module.exports = router; 