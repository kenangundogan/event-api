const express = require('express');
const router = express.Router();
const genderController = require('../controllers/gender');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Admin routes
router.get('/', authenticateToken, authorizeRoles(['admin']), genderController.getAll);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), genderController.getById);
router.post('/', authenticateToken, authorizeRoles(['admin']), genderController.create);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), genderController.update);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), genderController.delete);

module.exports = router; 