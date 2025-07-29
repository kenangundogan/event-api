const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

function createBaseRoutes(controller, options = {}) {
    const router = express.Router();
    const {
        auth = true,
        roles = ['admin']
    } = options;

    // Middleware'leri hazırla
    const middlewares = [];
    if (auth) {
        middlewares.push(authenticateToken);
        if (roles && roles.length > 0) {
            middlewares.push(authorizeRoles(roles));
        }
    }

    // CRUD Routes
    router.get('/', ...middlewares, controller.getAll);
    router.get('/:id', ...middlewares, controller.getById);
    router.post('/', ...middlewares, controller.create);
    router.put('/:id', ...middlewares, controller.update);
    router.delete('/:id', ...middlewares, controller.delete);

    return router;
}

module.exports = { createBaseRoutes }; 