const City = require('../models/City');
const Country = require('../models/Country');
const { createCitySchema, updateCitySchema } = require('../validations/city');

class CityController {
    async getAll(req, res) {
        try {
            const { countryId, status, isCapital } = req.query;

            let query = {};
            if (countryId) {
                query.countryId = countryId;
            }
            if (status) {
                query.status = status;
            }
            if (isCapital !== undefined) {
                query.isCapital = isCapital === 'true';
            }

            const cities = await City.find(query)
                .populate('countryId', 'name isoAlpha2 isoAlpha3')
                .sort({ name: 1 });

            res.status(200).json({
                success: true,
                data: cities
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şehirler getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const city = await City.findById(id)
                .populate('countryId', 'name isoAlpha2 isoAlpha3');

            if (!city) {
                return res.status(404).json({
                    success: false,
                    message: 'Şehir bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: city
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şehir getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getByCountry(req, res) {
        try {
            const { countryId } = req.params;
            const { status, isCapital } = req.query;

            let query = { countryId };
            if (status) {
                query.status = status;
            }
            if (isCapital !== undefined) {
                query.isCapital = isCapital === 'true';
            }

            const cities = await City.find(query)
                .populate('countryId', 'name isoAlpha2 isoAlpha3')
                .sort({ name: 1 });

            res.status(200).json({
                success: true,
                data: cities
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şehirler getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getCapitals(req, res) {
        try {
            const { countryId, status } = req.query;

            let query = { isCapital: true };
            if (countryId) {
                query.countryId = countryId;
            }
            if (status) {
                query.status = status;
            }

            const capitals = await City.find(query)
                .populate('countryId', 'name isoAlpha2 isoAlpha3')
                .sort({ 'countryId.name': 1 });

            res.status(200).json({
                success: true,
                data: capitals
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Başkentler getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const { error, value } = createCitySchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Ülke var mı kontrol et
            const country = await Country.findById(value.countryId);
            if (!country) {
                return res.status(404).json({
                    success: false,
                    message: 'Belirtilen ülke bulunamadı'
                });
            }

            // Aynı ülke içinde şehir adı var mı kontrol et
            const existingCity = await City.findOne({
                countryId: value.countryId,
                name: value.name
            });

            if (existingCity) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu şehir zaten mevcut'
                });
            }

            const city = new City(value);
            await city.save();

            await city.populate('countryId', 'name isoAlpha2 isoAlpha3');

            res.status(201).json({
                success: true,
                message: 'Şehir başarıyla oluşturuldu',
                data: city
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şehir oluşturulurken hata oluştu',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateCitySchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Eğer ülke değişiyorsa, ülke var mı kontrol et
            if (value.countryId) {
                const country = await Country.findById(value.countryId);
                if (!country) {
                    return res.status(404).json({
                        success: false,
                        message: 'Belirtilen ülke bulunamadı'
                    });
                }
            }

            // Eğer name değişiyorsa, çakışma kontrolü yap
            if (value.name) {
                const existingCity = await City.findOne({
                    countryId: value.countryId || (await City.findById(id)).countryId,
                    name: value.name,
                    _id: { $ne: id }
                });

                if (existingCity) {
                    return res.status(409).json({
                        success: false,
                        message: 'Bu şehir zaten mevcut'
                    });
                }
            }

            const city = await City.findByIdAndUpdate(
                id,
                value,
                { new: true, runValidators: true }
            );

            if (!city) {
                return res.status(404).json({
                    success: false,
                    message: 'Şehir bulunamadı'
                });
            }

            await city.populate('countryId', 'name isoAlpha2 isoAlpha3');

            res.status(200).json({
                success: true,
                message: 'Şehir başarıyla güncellendi',
                data: city
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şehir güncellenirken hata oluştu',
                error: error.message
            });
        }
    }
    
    async delete(req, res) {
        try {
            const { id } = req.params;

            const city = await City.findByIdAndDelete(id);

            if (!city) {
                return res.status(404).json({
                    success: false,
                    message: 'Şehir bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Şehir başarıyla silindi'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şehir silinirken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new CityController(); 