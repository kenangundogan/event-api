const Gender = require('../models/Gender');
const { createGenderSchema, updateGenderSchema } = require('../validations/gender');

class GenderController {
    async getAll(req, res) {
        try {
            const { resource } = req.query;

            let query = { isActive: true };
            if (resource) {
                query.resource = resource;
            }

            const genders = await Gender.find(query)
                .sort({ name: 1 });

            res.status(200).json({
                success: true,
                data: genders
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Cinsiyetler getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const gender = await Gender.findById(id);

            if (!gender) {
                return res.status(404).json({
                    success: false,
                    message: 'Cinsiyet bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: gender
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Cinsiyet getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const { error, value } = createGenderSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Aynı resource ve action kombinasyonu var mı kontrol et
            const existingGender = await Gender.findOne({
                name: value.name
            });

            if (existingGender) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu cinsiyet zaten mevcut'
                });
            }

            const gender = new Gender(value);
            await gender.save();

            res.status(201).json({
                success: true,
                message: 'Cinsiyet başarıyla oluşturuldu',
                data: gender
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Cinsiyet oluşturulurken hata oluştu',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateGenderSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Eğer name değişiyorsa, çakışma kontrolü yap
            if (value.name) {
                const existingGender = await Gender.findOne({
                    name: value.name || (await Gender.findById(id)).name,
                    _id: { $ne: id }
                });

                if (existingGender) {
                    return res.status(409).json({
                        success: false,
                        message: 'Bu cinsiyet zaten mevcut'
                    });
                }
            }

            const gender = await Gender.findByIdAndUpdate(
                id,
                value,
                { new: true, runValidators: true }
            );

            if (!gender) {
                return res.status(404).json({
                    success: false,
                    message: 'Cinsiyet bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Cinsiyet başarıyla güncellendi',
                data: gender
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Cinsiyet güncellenirken hata oluştu',
                error: error.message
            });
        }
    }
    
    async delete(req, res) {
        try {
            const { id } = req.params;

            const gender = await Gender.findByIdAndDelete(id);

            if (!gender) {
                return res.status(404).json({
                    success: false,
                    message: 'Cinsiyet bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Cinsiyet başarıyla silindi'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Cinsiyet silinirken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new GenderController(); 