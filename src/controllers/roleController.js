const Role = require('../models/Role');
const { createRoleSchema, updateRoleSchema } = require('../validations/roleValidation');

class RoleController {
    async getAll(req, res) {
        try {
            const roles = await Role.find({ isActive: true })
                .sort({ priority: -1, name: 1 });

            res.status(200).json({
                success: true,
                data: roles
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Roller getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const role = await Role.findById(id);

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Rol bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: role
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Rol getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const { error, value } = createRoleSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const role = new Role(value);
            await role.save();

            res.status(201).json({
                success: true,
                message: 'Rol başarıyla oluşturuldu',
                data: role
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu rol adı zaten kullanılıyor'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Rol oluşturulurken hata oluştu',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateRoleSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const role = await Role.findByIdAndUpdate(
                id,
                value,
                { new: true, runValidators: true }
            );

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Rol bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Rol başarıyla güncellendi',
                data: role
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu rol adı zaten kullanılıyor'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Rol güncellenirken hata oluştu',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const role = await Role.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Rol bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Rol başarıyla silindi',
                data: role
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Rol silinirken hata oluştu',
                error: error.message
            });
        }
    }

    // Varsayılan rolü getir
    async getDefaultRole(req, res) {
        try {
            const role = await Role.getDefaultRole();

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Varsayılan rol bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: role
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Varsayılan rol getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    // Rolün tüm izinlerini getir
    async getRolePermissions(req, res) {
        try {
            const { roleId } = req.params;

            const role = await Role.findById(roleId).populate('permissions');

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Rol bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    roleId,
                    roleName: role.name,
                    permissions: role.permissions || []
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Rol izinleri getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    // Rolün belirli bir iznini getir
    async getRolePermission(req, res) {
        try {
            const { roleId, permission } = req.params;

            const role = await Role.findById(roleId).populate('permissions');

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Rol bulunamadı'
                });
            }

            const targetPermission = role.permissions.find(p => p._id.toString() === permission);

            if (!targetPermission) {
                return res.status(404).json({
                    success: false,
                    message: 'Bu rol belirtilen izne sahip değil'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    roleId,
                    roleName: role.name,
                    permission: targetPermission
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Rol izni getirilirken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new RoleController(); 