const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.post('/register', userController.createUser);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.put('/change-password', authenticateToken, userController.changeOwnPassword);
router.put('/change-password/:id', authenticateToken, authorizeRoles(['admin']), userController.changePassword);

// Admin routes
router.get('/', authenticateToken, authorizeRoles(['admin']), userController.getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), userController.getUserById);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), userController.updateUser);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), userController.deleteUser);

module.exports = router; 