const express = require('express');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @route GET /api/auth/google
// @desc Redirect to Google OAuth
// @access Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// @route GET /api/auth/google/callback
// @desc Google OAuth callback
// @access Public
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      // Kiểm tra tài khoản có bị khoá không
      if (req.user.isLocked) {
        console.log(`🔒 User ${req.user.email} đã bị khoá, từ chối đăng nhập Google`);
        const frontendURL = process.env.NODE_ENV === 'production' 
          ? 'https://luna-bakery-frontend.vercel.app'
          : (process.env.FRONTEND_URL || 'http://localhost:5173');
        return res.redirect(`${frontendURL}/login?error=account_locked&message=${encodeURIComponent('Tài khoản của bạn đã bị khoá. Vui lòng liên hệ admin để được hỗ trợ!')}`);
      }

      // Tạo JWT token
      const payload = {
        user: {
          id: req.user._id,
          role: req.user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '40h' },
        (err, token) => {
          if (err) {
            console.error('JWT signing error:', err);
            const frontendURL = process.env.NODE_ENV === 'production' 
              ? 'https://luna-bakery-frontend.vercel.app'
              : (process.env.FRONTEND_URL || 'http://localhost:5173');
            return res.redirect(`${frontendURL}/login?error=auth_failed`);
          }

          // Redirect về frontend với token
          const frontendURL = process.env.NODE_ENV === 'production' 
            ? 'https://luna-bakery-frontend.vercel.app'
            : (process.env.FRONTEND_URL || 'http://localhost:5173');
          res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            avatar: req.user.avatar,
            phone: req.user.phone,
            address: req.user.address,
            createdAt: req.user.createdAt,
            isLocked: req.user.isLocked
          }))}`);
        }
      );
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendURL = process.env.NODE_ENV === 'production' 
        ? 'https://luna-bakery-frontend.vercel.app'
        : (process.env.FRONTEND_URL || 'http://localhost:5173');
      res.redirect(`${frontendURL}/login?error=auth_failed`);
    }
  }
);

// @route GET /api/auth/logout
// @desc Logout user
// @access Public
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router; 