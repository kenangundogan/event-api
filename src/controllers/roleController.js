const Role = require('../models/Role');
const { createRoleSchema, updateRoleSchema } = require('../validations/roleValidation');

class RoleController {
    // Tüm rolleri getir
    async getAllRoles(req, res) {
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

    // Tek rol getir
    async getRoleById(req, res) {
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

    // Yeni rol oluştur
    async createRole(req, res) {
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

    // Rol güncelle
    async updateRole(req, res) {
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

    // Rol sil (soft delete)
    async deleteRole(req, res) {
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

    // İzin kontrolü
    async checkPermission(req, res) {
        try {
            const { roleId, permission } = req.params;

            const role = await Role.findById(roleId);

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Rol bulunamadı'
                });
            }

            const hasPermission = role.hasPermission(permission);

            res.status(200).json({
                success: true,
                data: {
                    roleId,
                    permission,
                    hasPermission
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'İzin kontrolü yapılırken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new RoleController(); 