const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', cityController.getAll);
router.get('/:id', cityController.getById);
router.get('/country/:countryId', cityController.getByCountry);
router.get('/capitals', cityController.getCapitals);

// Admin routes
router.post('/', authenticateToken, authorizeRoles(['admin']), cityController.create);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), cityController.update);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), cityController.delete);

module.exports = router; 