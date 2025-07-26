const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token doğrulama middleware'i
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Erişim token\'ı gerekli'
            });
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kullanıcının hala aktif olup olmadığını kontrol et
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token veya kullanıcı aktif değil'
            });
        }

        // Kullanıcı bilgilerini request'e ekle
        req.user = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token süresi dolmuş'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Token doğrulama hatası',
            error: error.message
        });
    }
};

// Rol yetkilendirme middleware'i
const authorizeRoles = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli'
      });
    }

    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.userId).populate('role');
      
      if (!user || !user.role) {
        return res.status(403).json({
          success: false,
          message: 'Bu işlem için yetkiniz bulunmuyor'
        });
      }

      // Role name kontrolü
      if (roles.includes(user.role.name)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmuyor'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Yetkilendirme kontrolü sırasında hata oluştu',
        error: error.message
      });
    }
  };
};

// İzin tabanlı yetkilendirme middleware'i
const authorizePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli'
      });
    }

    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.userId).populate('role');
      
      if (!user || !user.role) {
        return res.status(403).json({
          success: false,
          message: 'Bu işlem için yetkiniz bulunmuyor'
        });
      }

      // İzin kontrolü
      if (user.role.hasPermission(permission)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmuyor'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Yetkilendirme kontrolü sırasında hata oluştu',
        error: error.message
      });
    }
  };
};

// Birden fazla izin kontrolü
const authorizeAnyPermission = (permissions) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Yetkilendirme gerekli'
      });
    }

    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.userId).populate('role');
      
      if (!user || !user.role) {
        return res.status(403).json({
          success: false,
          message: 'Bu işlem için yetkiniz bulunmuyor'
        });
      }

      // İzin kontrolü (herhangi biri)
      if (user.role.hasAnyPermission(permissions)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmuyor'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Yetkilendirme kontrolü sırasında hata oluştu',
        error: error.message
      });
    }
  };
};

// Kendi profilini düzenleme kontrolü
const authorizeSelfOrAdmin = (req, res, next) => {
    const { id } = req.params;

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Yetkilendirme gerekli'
        });
    }

    // Admin ise herhangi bir kullanıcıyı düzenleyebilir
    if (req.user.role === 'admin') {
        return next();
    }

    // Kendi profilini düzenleyebilir
    if (req.user.userId.toString() === id) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmuyor'
    });
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizePermission,
  authorizeAnyPermission,
  authorizeSelfOrAdmin
}; 