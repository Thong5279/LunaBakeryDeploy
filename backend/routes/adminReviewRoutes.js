const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, adminOrManager } = require('../middleware/authMiddleware');

// @desc    Lấy tất cả reviews với filter và pagination (Admin/Manager only)
// @route   GET /api/admin/reviews
// @access  Private/Admin or Manager
router.get('/', protect, adminOrManager, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Filter by itemType (Product/Ingredient)
    if (req.query.itemType && req.query.itemType !== 'all') {
      filter.itemType = req.query.itemType;
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    
    // Filter by rating
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }
    
    // Filter by rating range
    if (req.query.minRating || req.query.maxRating) {
      filter.rating = {};
      if (req.query.minRating) {
        filter.rating.$gte = parseInt(req.query.minRating);
      }
      if (req.query.maxRating) {
        filter.rating.$lte = parseInt(req.query.maxRating);
      }
    }
    
    // Search by comment content
    if (req.query.search) {
      filter.comment = { $regex: req.query.search, $options: 'i' };
    }
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }
    
    // Sort options
    let sortOption = {};
    switch (req.query.sort) {
      case 'rating-asc':
        sortOption = { rating: 1 };
        break;
      case 'rating-desc':
        sortOption = { rating: -1 };
        break;
      case 'date-asc':
        sortOption = { createdAt: 1 };
        break;
      case 'date-desc':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate('user', 'name email avatar')
      .populate('product', 'name images')
      .populate('order', 'orderNumber totalPrice')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    // Calculate statistics
    const stats = await Review.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
        }
      }
    ]);
    
    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      stats: stats[0] || {
        totalReviews: 0,
        avgRating: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
        rating5: 0
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi lấy danh sách đánh giá'
    });
  }
});

// @desc    Lấy chi tiết review (Admin/Manager only)
// @route   GET /api/admin/reviews/:id
// @access  Private/Admin or Manager
router.get('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('product', 'name images')
      .populate('order', 'orderNumber totalPrice status');
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi lấy chi tiết đánh giá'
    });
  }
});

// @desc    Cập nhật trạng thái review (Admin/Manager only)
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin or Manager
router.put('/:id/status', protect, adminOrManager, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'hidden'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }
    
    review.status = status;
    await review.save();
    
    // Populate thông tin trước khi trả về
    await review.populate([
      { path: 'user', select: 'name email avatar' },
      { path: 'product', select: 'name images' },
      { path: 'order', select: 'orderNumber totalPrice status' }
    ]);
    
    res.json({
      success: true,
      message: 'Cập nhật trạng thái đánh giá thành công',
      data: review
    });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái đánh giá'
    });
  }
});

// @desc    Ẩn review (Admin/Manager only)
// @route   PUT /api/admin/reviews/:id/hide
// @access  Private/Admin or Manager
router.put('/:id/hide', protect, adminOrManager, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }
    
    review.status = 'hidden';
    await review.save();
    
    // Populate thông tin trước khi trả về
    await review.populate([
      { path: 'user', select: 'name email avatar' },
      { path: 'product', select: 'name images' },
      { path: 'order', select: 'orderNumber totalPrice status' }
    ]);
    
    res.json({
      success: true,
      message: 'Đã ẩn đánh giá thành công',
      data: review
    });
  } catch (error) {
    console.error('Error hiding review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi ẩn đánh giá'
    });
  }
});

// @desc    Hiện lại review (Admin/Manager only)
// @route   PUT /api/admin/reviews/:id/show
// @access  Private/Admin or Manager
router.put('/:id/show', protect, adminOrManager, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }
    
    review.status = 'approved';
    await review.save();
    
    // Populate thông tin trước khi trả về
    await review.populate([
      { path: 'user', select: 'name email avatar' },
      { path: 'product', select: 'name images' },
      { path: 'order', select: 'orderNumber totalPrice status' }
    ]);
    
    res.json({
      success: true,
      message: 'Đã hiện lại đánh giá thành công',
      data: review
    });
  } catch (error) {
    console.error('Error showing review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi hiện lại đánh giá'
    });
  }
});

// @desc    Xóa review (Admin/Manager only)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin or Manager
router.delete('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Xóa đánh giá thành công'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi xóa đánh giá'
    });
  }
});

// @desc    Lấy thống kê reviews (Admin/Manager only)
// @route   GET /api/admin/reviews/stats/overview
// @access  Private/Admin or Manager
router.get('/stats/overview', protect, adminOrManager, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    
    const stats = await Review.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          pendingReviews: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approvedReviews: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          rejectedReviews: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          hiddenReviews: { $sum: { $cond: [{ $eq: ['$status', 'hidden'] }, 1, 0] } },
          productReviews: { $sum: { $cond: [{ $eq: ['$itemType', 'Product'] }, 1, 0] } },
          ingredientReviews: { $sum: { $cond: [{ $eq: ['$itemType', 'Ingredient'] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: stats[0] || {
        totalReviews: 0,
        avgRating: 0,
        pendingReviews: 0,
        approvedReviews: 0,
        rejectedReviews: 0,
        hiddenReviews: 0,
        productReviews: 0,
        ingredientReviews: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
        rating5: 0
      }
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi lấy thống kê đánh giá'
    });
  }
});

module.exports = router; 