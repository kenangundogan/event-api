const mongoose = require('mongoose');

class QueryBuilder {
    constructor(model) {
        this.model = model;
        this.query = model.find();
        this.countQuery = model.countDocuments();
        this.filters = {};
        this.sort = {};
        this.selectString = '';
        this.populate = [];
        this.page = 1;
        this.limit = 10;
        this.skip = 0;
        this.basePath = null;
        this.queryParams = {};
        
        // Sort alias'ları (her model için ayrı tanımlanabilir)
        this.sortAliases = {};
    }

    // Sort alias'ları tanımla
    setSortAliases(aliases) {
        this.sortAliases = { ...this.sortAliases, ...aliases };
        return this;
    }

    // Gelişmiş filtreleme - Laravel benzeri
    applyFilters(filters, reqQuery = {}) {
        let parsedFilters = filters;
        
        // String formatında gelirse parse et
        if (typeof filters === 'string') {
            try {
                parsedFilters = JSON.parse(filters);
            } catch (e) {
                // String formatında değilse, req.query'den al
                parsedFilters = {};
                Object.keys(reqQuery).forEach(key => {
                    if (key.startsWith('filter[') && key.endsWith(']')) {
                        const field = key.slice(7, -1);
                        const value = reqQuery[key];
                        
                        // Virgülle ayrılmış değerleri array'e çevir
                        if (typeof value === 'string' && value.includes(',')) {
                            parsedFilters[field] = value.split(',').map(v => v.trim());
                        } else {
                            parsedFilters[field] = value;
                        }
                    }
                });
            }
        }

        if (!parsedFilters || typeof parsedFilters !== 'object') {
            return this;
        }

        Object.keys(parsedFilters).forEach(field => {
            const value = parsedFilters[field];
            
            if (Array.isArray(value)) {
                this.filters[field] = { $in: value };
            } else if (typeof value === 'object' && value !== null) {
                const operators = {};
                Object.keys(value).forEach(op => {
                    switch (op) {
                        case 'gt':
                            operators.$gt = value[op];
                            break;
                        case 'gte':
                            operators.$gte = value[op];
                            break;
                        case 'lt':
                            operators.$lt = value[op];
                            break;
                        case 'lte':
                            operators.$lte = value[op];
                            break;
                        case 'ne':
                            operators.$ne = value[op];
                            break;
                        case 'in':
                            operators.$in = Array.isArray(value[op]) ? value[op] : [value[op]];
                            break;
                        case 'nin':
                            operators.$nin = Array.isArray(value[op]) ? value[op] : [value[op]];
                            break;
                        case 'like':
                            operators.$regex = value[op];
                            operators.$options = 'i';
                            break;
                        default:
                            operators[`$${op}`] = value[op];
                    }
                });
                this.filters[field] = operators;
            } else {
                this.filters[field] = value;
            }
        });

        return this;
    }

    // Filtreleme metodları
    where(field, operator, value) {
        if (value === undefined) {
            this.filters[field] = operator;
        } else {
            this.filters[field] = { [`$${operator}`]: value };
        }
        return this;
    }

    orWhere(field, operator, value) {
        if (!this.filters.$or) {
            this.filters.$or = [];
        }
        
        if (value === undefined) {
            this.filters.$or.push({ [field]: operator });
        } else {
            this.filters.$or.push({ [field]: { [`$${operator}`]: value } });
        }
        return this;
    }

    andWhere(field, operator, value) {
        if (!this.filters.$and) {
            this.filters.$and = [];
        }
        
        if (value === undefined) {
            this.filters.$and.push({ [field]: operator });
        } else {
            this.filters.$and.push({ [field]: { [`$${operator}`]: value } });
        }
        return this;
    }

    // Tarih aralığı
    whereBetween(field, startDate, endDate) {
        this.filters[field] = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
        return this;
    }

    // Tarih aralığı (dışında)
    whereNotBetween(field, startDate, endDate) {
        this.filters[field] = {
            $or: [
                { $lt: new Date(startDate) },
                { $gt: new Date(endDate) }
            ]
        };
        return this;
    }

    // Gelişmiş sıralama - Laravel benzeri
    applySort(sortString) {
        if (!sortString) return this;

        const sortFields = sortString.split(',').map(field => field.trim());
        
        sortFields.forEach(field => {
            const isDescending = field.startsWith('-');
            const cleanField = isDescending ? field.substring(1) : field;
            const direction = isDescending ? -1 : 1;
            
            // Sort alias kontrolü
            if (this.sortAliases[cleanField]) {
                const alias = this.sortAliases[cleanField];
                this.applySortAlias(alias, direction);
            } else {
                // Normal alan sıralama
                this.sort[cleanField] = direction;
            }
        });

        return this;
    }

    // Sort alias uygula
    applySortAlias(alias, direction) {
        switch (alias.type) {
            case 'stringLength':
                // String uzunluğuna göre sıralama (aggregation gerekli)
                this.sort = { _aggregation: 'stringLength', field: alias.field, direction };
                break;
                
            case 'date':
                // Tarih sıralama
                this.sort[alias.field] = direction;
                break;
                
            case 'fullName':
                // Tam isim sıralama (firstName + lastName) - aggregation gerekli
                this.sort = { _aggregation: 'fullName', field: alias.field, direction };
                break;
                
            case 'relationField':
                // İlişki alanına göre sıralama
                this.populate.push({ 
                    path: alias.field,
                    select: alias.relationField 
                });
                this.sort[`${alias.field}.${alias.relationField}`] = direction;
                break;
                
            default:
                // Varsayılan: normal alan sıralama
                this.sort[alias.field] = direction;
        }
    }

    // Sıralama
    orderBy(field, direction = 'asc') {
        this.sort[field] = direction === 'asc' ? 1 : -1;
        return this;
    }

    // Çoklu sıralama
    orderByMultiple(sortArray) {
        sortArray.forEach(({ field, direction = 'asc' }) => {
            this.sort[field] = direction === 'asc' ? 1 : -1;
        });
        return this;
    }

    // Alan seçimi
    select(fields) {
        if (typeof fields === 'string') {
            fields = fields.split(',').map(field => field.trim());
        }
        
        const selectString = fields.map(field => {
            if (field.startsWith('-')) {
                return field;
            } else {
                return field;
            }
        }).join(' ');
        
        this.selectString = selectString;
        return this;
    }

    // İlişki dahil etme
    with(relations) {
        if (typeof relations === 'string') {
            relations = relations.split(',').map(relation => relation.trim());
        }
        
        relations.forEach(relation => {
            this.populate.push({ path: relation });
        });
        return this;
    }

    // İlişki dahil etme (detaylı)
    withDetails(relations) {
        relations.forEach(relation => {
            if (typeof relation === 'string') {
                this.populate.push({ path: relation });
            } else {
                this.populate.push(relation);
            }
        });
        return this;
    }

    // Sayfalama
    paginate(page = 1, limit = 10) {
        this.page = parseInt(page);
        this.limit = parseInt(limit);
        this.skip = (this.page - 1) * this.limit;
        return this;
    }

    // Grup
    groupBy(field) {
        this.groupBy = field;
        return this;
    }

    // Benzersiz
    distinct(field) {
        this.distinct = field;
        return this;
    }

    // Sorguyu çalıştır
    async get() {
        try {
            // Aggregation gerekiyor mu kontrol et
            const needsAggregation = this.sort._aggregation;
            
            if (needsAggregation) {
                return await this.executeAggregation();
            } else {
                return await this.executeFind();
            }
        } catch (error) {
            throw error;
        }
    }

    // Normal find sorgusu
    async executeFind() {
        let query = this.model.find(this.filters);

        // Select fields
        if (this.selectString) {
            query = query.select(this.selectString);
        }

        // Sort
        if (Object.keys(this.sort).length > 0) {
            query = query.sort(this.sort);
        }

        // Populate
        if (this.populate.length > 0) {
            query = query.populate(this.populate);
        }

        // Pagination
        if (this.skip > 0) {
            query = query.skip(this.skip);
        }
        if (this.limit > 0) {
            query = query.limit(this.limit);
        }

        const data = await query.exec();
        const total = await this.model.countDocuments(this.filters);

        const totalPages = Math.ceil(total / this.limit);
        const hasNextPage = this.page < totalPages;
        const hasPrevPage = this.page > 1;
        const from = (this.page - 1) * this.limit + 1;
        const to = Math.min(this.page * this.limit, total);
        
        // Base URL ve path oluştur
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const path = this.basePath ? `${baseUrl}${this.basePath}` : `${baseUrl}/api/users`;
        
        // URL oluşturma fonksiyonu
        const buildUrl = (page) => {
            const cleanParams = {};
            Object.keys(this.queryParams).forEach(key => {
                if (this.queryParams[key] !== undefined && this.queryParams[key] !== null) {
                    cleanParams[key] = this.queryParams[key];
                }
            });
            
            const params = new URLSearchParams({
                ...cleanParams,
                page: page
            });
            
            if (this.limit !== 10 && !cleanParams.limit) {
                params.append('limit', this.limit);
            }
            
            return `${path}?${params.toString()}`;
        };
        
        return {
            data,
            pagination: {
                total,
                per_page: this.limit,
                current_page: this.page,
                last_page: totalPages,
                current_page_url: buildUrl(this.page),
                first_page_url: buildUrl(1),
                last_page_url: buildUrl(totalPages),
                next_page_url: hasNextPage ? buildUrl(this.page + 1) : null,
                prev_page_url: hasPrevPage ? buildUrl(this.page - 1) : null,
                path,
                from,
                to,
                hasNextPage,
                hasPrevPage
            }
        };
    }

    // Aggregation sorgusu
    async executeAggregation() {
        const pipeline = [
            { $match: this.filters }
        ];

        // Sort alias'ları için özel alanlar ekle
        if (this.sort._aggregation === 'stringLength') {
            pipeline.push({
                $addFields: {
                    nameLength: { $strLenCP: `$${this.sort.field}` }
                }
            });
            this.sort = { nameLength: this.sort.direction };
        } else if (this.sort._aggregation === 'fullName') {
            pipeline.push({
                $addFields: {
                    fullName: { $concat: [`$${this.sort.field}`, ' ', '$lastName'] }
                }
            });
            this.sort = { fullName: this.sort.direction };
        }

        // Sort
        if (Object.keys(this.sort).length > 0) {
            pipeline.push({ $sort: this.sort });
        }

        // Pagination
        pipeline.push({ $skip: this.skip });
        pipeline.push({ $limit: this.limit });

        const data = await this.model.aggregate(pipeline);
        const total = await this.model.countDocuments(this.filters);

        const totalPages = Math.ceil(total / this.limit);
        const hasNextPage = this.page < totalPages;
        const hasPrevPage = this.page > 1;
        const from = (this.page - 1) * this.limit + 1;
        const to = Math.min(this.page * this.limit, total);
        
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const path = this.basePath ? `${baseUrl}${this.basePath}` : `${baseUrl}/api/users`;
        
        const buildUrl = (page) => {
            const cleanParams = {};
            Object.keys(this.queryParams).forEach(key => {
                if (this.queryParams[key] !== undefined && this.queryParams[key] !== null) {
                    cleanParams[key] = this.queryParams[key];
                }
            });
            
            const params = new URLSearchParams({
                ...cleanParams,
                page: page
            });
            
            if (this.limit !== 10 && !cleanParams.limit) {
                params.append('limit', this.limit);
            }
            
            return `${path}?${params.toString()}`;
        };
        
        return {
            data,
            pagination: {
                total,
                per_page: this.limit,
                current_page: this.page,
                last_page: totalPages,
                current_page_url: buildUrl(this.page),
                first_page_url: buildUrl(1),
                last_page_url: buildUrl(totalPages),
                next_page_url: hasNextPage ? buildUrl(this.page + 1) : null,
                prev_page_url: hasPrevPage ? buildUrl(this.page - 1) : null,
                path,
                from,
                to,
                hasNextPage,
                hasPrevPage
            }
        };
    }

    // İlk kaydı getir
    async first() {
        this.limit = 1;
        const result = await this.get();
        return result.data[0] || null;
    }

    // Son kaydı getir
    async last() {
        this.limit = 1;
        this.sort = Object.keys(this.sort).length > 0 ? this.sort : { _id: -1 };
        const result = await this.get();
        return result.data[0] || null;
    }

    // Sayıyı getir
    async count() {
        try {
            return await this.model.countDocuments(this.filters);
        } catch (error) {
            throw error;
        }
    }

    // Var mı kontrolü
    async exists() {
        try {
            const count = await this.model.countDocuments(this.filters);
            return count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Benzersiz değerleri getir
    async distinct(field) {
        try {
            return await this.model.distinct(field, this.filters);
        } catch (error) {
            throw error;
        }
    }

    // Grup
    async group(field, aggregation = {}) {
        try {
            const pipeline = [
                { $match: this.filters },
                { $group: { _id: `$${field}`, ...aggregation } }
            ];

            if (Object.keys(this.sort).length > 0) {
                pipeline.push({ $sort: this.sort });
            }

            return await this.model.aggregate(pipeline);
        } catch (error) {
            throw error;
        }
    }

    // API path ayarla
    setPath(path) {
        this.basePath = path;
        return this;
    }

    // Query parametrelerini ayarla
    setQueryParams(params) {
        this.queryParams = { ...params };
        return this;
    }

    // Sorguyu sıfırla
    reset() {
        this.query = this.model.find();
        this.countQuery = this.model.countDocuments();
        this.filters = {};
        this.sort = {};
        this.selectString = '';
        this.populate = [];
        this.page = 1;
        this.limit = 10;
        this.skip = 0;
        this.basePath = null;
        this.queryParams = {};
        return this;
    }
}

// Factory function
function queryBuilder(model) {
    return new QueryBuilder(model);
}

module.exports = { QueryBuilder, queryBuilder }; 