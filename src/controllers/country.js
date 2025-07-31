const Country = require('../models/Country');
const Continent = require('../models/Continent');
const { createCountrySchema, updateCountrySchema } = require('../validations/country');

class CountryController {
    async getAll(req, res) {
        try {
            const { status, continentId } = req.query;

            let query = {};
            if (status) {
                query.status = status;
            }
            if (continentId) {
                query.continentId = continentId;
            }

            const countries = await Country.find(query)
                .populate('continentId', 'name code')
                .sort({ name: 1 });

            res.status(200).json({
                success: true,
                data: countries
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ülkeler getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const country = await Country.findById(id)
                .populate('continentId', 'name code');

            if (!country) {
                return res.status(404).json({
                    success: false,
                    message: 'Ülke bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: country
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ülke getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getByIsoCode(req, res) {
        try {
            const { code } = req.params;

            const country = await Country.findOne({ 
                $or: [
                    { isoAlpha2: code.toUpperCase() },
                    { isoAlpha3: code.toUpperCase() }
                ]
            }).populate('continentId', 'name code');

            if (!country) {
                return res.status(404).json({
                    success: false,
                    message: 'Ülke bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: country
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ülke getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getByContinent(req, res) {
        try {
            const { continentId } = req.params;
            const { status } = req.query;

            let query = { continentId };
            if (status) {
                query.status = status;
            }

            const countries = await Country.find(query)
                .populate('continentId', 'name code')
                .sort({ name: 1 });

            res.status(200).json({
                success: true,
                data: countries
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ülkeler getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const { error, value } = createCountrySchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Kıta var mı kontrol et
            const continent = await Continent.findById(value.continentId);
            if (!continent) {
                return res.status(404).json({
                    success: false,
                    message: 'Belirtilen kıta bulunamadı'
                });
            }

            // Aynı kod veya isim var mı kontrol et
            const existingCountry = await Country.findOne({
                $or: [
                    { isoAlpha2: value.isoAlpha2 },
                    { isoAlpha3: value.isoAlpha3 },
                    { isoNumeric: value.isoNumeric },
                    { name: value.name }
                ]
            });

            if (existingCountry) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu ülke kodu veya adı zaten mevcut'
                });
            }

            const country = new Country(value);
            await country.save();

            await country.populate('continentId', 'name code');

            res.status(201).json({
                success: true,
                message: 'Ülke başarıyla oluşturuldu',
                data: country
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ülke oluşturulurken hata oluştu',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateCountrySchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Eğer kıta değişiyorsa, kıta var mı kontrol et
            if (value.continentId) {
                const continent = await Continent.findById(value.continentId);
                if (!continent) {
                    return res.status(404).json({
                        success: false,
                        message: 'Belirtilen kıta bulunamadı'
                    });
                }
            }

            // Eğer kod veya isim değişiyorsa, çakışma kontrolü yap
            if (value.isoAlpha2 || value.isoAlpha3 || value.isoNumeric || value.name) {
                const existingCountry = await Country.findOne({
                    $or: [
                        { isoAlpha2: value.isoAlpha2 },
                        { isoAlpha3: value.isoAlpha3 },
                        { isoNumeric: value.isoNumeric },
                        { name: value.name }
                    ],
                    _id: { $ne: id }
                });

                if (existingCountry) {
                    return res.status(409).json({
                        success: false,
                        message: 'Bu ülke kodu veya adı zaten mevcut'
                    });
                }
            }

            const country = await Country.findByIdAndUpdate(
                id,
                value,
                { new: true, runValidators: true }
            );

            if (!country) {
                return res.status(404).json({
                    success: false,
                    message: 'Ülke bulunamadı'
                });
            }

            await country.populate('continentId', 'name code');

            res.status(200).json({
                success: true,
                message: 'Ülke başarıyla güncellendi',
                data: country
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ülke güncellenirken hata oluştu',
                error: error.message
            });
        }
    }
    
    async delete(req, res) {
        try {
            const { id } = req.params;

            const country = await Country.findByIdAndDelete(id);

            if (!country) {
                return res.status(404).json({
                    success: false,
                    message: 'Ülke bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Ülke başarıyla silindi'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ülke silinirken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new CountryController(); 