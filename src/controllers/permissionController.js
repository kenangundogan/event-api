const Permission = require('../models/Permission');
const { createPermissionSchema, updatePermissionSchema } = require('../validations/permissionValidation');

class PermissionController {
    async getAll(req, res) {
        try {
            const { resource } = req.query;

            let query = { isActive: true };
            if (resource) {
                query.resource = resource;
            }

            const permissions = await Permission.find(query)
                .sort({ resource: 1, priority: -1, action: 1 });

            res.status(200).json({
                success: true,
                data: permissions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'İzinler getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const permission = await Permission.findById(id);

            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: 'İzin bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: permission
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'İzin getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const { error, value } = createPermissionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Aynı resource ve action kombinasyonu var mı kontrol et
            const existingPermission = await Permission.findOne({
                resource: value.resource,
                action: value.action
            });

            if (existingPermission) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu resource ve action kombinasyonu zaten mevcut'
                });
            }

            const permission = new Permission(value);
            await permission.save();

            res.status(201).json({
                success: true,
                message: 'İzin başarıyla oluşturuldu',
                data: permission
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'İzin oluşturulurken hata oluştu',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updatePermissionSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Eğer resource veya action değişiyorsa, çakışma kontrolü yap
            if (value.resource || value.action) {
                const existingPermission = await Permission.findOne({
                    resource: value.resource || (await Permission.findById(id)).resource,
                    action: value.action || (await Permission.findById(id)).action,
                    _id: { $ne: id }
                });

                if (existingPermission) {
                    return res.status(409).json({
                        success: false,
                        message: 'Bu resource ve action kombinasyonu zaten mevcut'
                    });
                }
            }

            const permission = await Permission.findByIdAndUpdate(
                id,
                value,
                { new: true, runValidators: true }
            );

            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: 'İzin bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'İzin başarıyla güncellendi',
                data: permission
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'İzin güncellenirken hata oluştu',
                error: error.message
            });
        }
    }
    
    async delete(req, res) {
        try {
            const { id } = req.params;

            const permission = await Permission.findByIdAndDelete(id);

            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: 'İzin bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'İzin başarıyla silindi'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'İzin silinirken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new PermissionController(); 