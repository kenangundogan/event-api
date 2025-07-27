const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/resource/:resource', permissionController.getPermissionsByResource);
router.get('/check/:resource/:action', permissionController.checkPermission);

// Admin routes
router.get('/', authenticateToken, authorizeRoles(['admin']), permissionController.getAllPermissions);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), permissionController.getPermissionById);
router.post('/', authenticateToken, authorizeRoles(['admin']), permissionController.createPermission);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), permissionController.updatePermission);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), permissionController.deletePermission);

module.exports = router; 