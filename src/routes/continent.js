const express = require('express');
const router = express.Router();
const continentController = require('../controllers/continent');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', continentController.getAll);
router.get('/:id', continentController.getById);
router.get('/code/:code', continentController.getByCode);

// Admin routes
router.post('/', authenticateToken, authorizeRoles(['admin']), continentController.create);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), continentController.update);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), continentController.delete);

module.exports = router; 