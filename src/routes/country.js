const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', countryController.getAll);
router.get('/:id', countryController.getById);
router.get('/iso/:code', countryController.getByIsoCode);
router.get('/continent/:continentId', countryController.getByContinent);

// Admin routes
router.post('/', authenticateToken, authorizeRoles(['admin']), countryController.create);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), countryController.update);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), countryController.delete);

module.exports = router; 