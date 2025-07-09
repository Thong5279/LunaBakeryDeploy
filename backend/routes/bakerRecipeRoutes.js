const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { protect, admin, baker } = require('../middleware/authMiddleware');

// @desc    Get all published recipes for baker
// @route   GET /api/baker/recipes
// @access  Private/Baker
router.get('/', protect, baker, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Filters
    const filters = {
      isPublished: true,
      status: 'active'
    };

    if (req.query.search) {
      filters.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }



    if (req.query.difficulty && req.query.difficulty !== 'all') {
      filters.difficulty = req.query.difficulty;
    }

    // Sorting
    let sortBy = { createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'name':
          sortBy = { name: 1 };
          break;
        case 'difficulty':
          sortBy = { difficulty: 1 };
          break;
        case 'totalTime':
          sortBy = { cookingTime: 1 };
          break;
        case 'newest':
          sortBy = { createdAt: -1 };
          break;
        case 'popular':
          sortBy = { views: -1 };
          break;
      }
    }

    const recipes = await Recipe.find(filters)
      .populate('createdBy', 'name')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Recipe.countDocuments(filters);

    res.json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecipes: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Error fetching baker recipes:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi lấy danh sách công thức',
      error: error.message 
    });
  }
});

// @desc    Get recipe by ID for baker
// @route   GET /api/baker/recipes/:id
// @access  Private/Baker
router.get('/:id', protect, baker, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!recipe) {
      return res.status(404).json({ message: 'Không tìm thấy công thức' });
    }

    if (!recipe.isPublished || recipe.status !== 'active') {
      return res.status(403).json({ message: 'Công thức này chưa được xuất bản' });
    }

    // Increment views
    await Recipe.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID công thức không hợp lệ' });
    }
    res.status(500).json({ 
      message: 'Lỗi server khi lấy chi tiết công thức',
      error: error.message 
    });
  }
});


// @desc    Search recipes for baker
// @route   GET /api/baker/recipes/search/quick
// @access  Private/Baker
router.get('/search/quick', protect, baker, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ recipes: [] });
    }

    const recipes = await Recipe.find({
      isPublished: true,
      status: 'active',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .select('name difficulty cookingTime image')
    .limit(10)
    .lean();

    res.json({ recipes });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi tìm kiếm công thức',
      error: error.message 
    });
  }
});

module.exports = router; 