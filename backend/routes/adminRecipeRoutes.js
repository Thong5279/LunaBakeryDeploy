const express = require("express");
const Recipe = require("../models/Recipe");
const { protect, adminOrManager, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/recipes
// @desc Get all recipes (Admin & Manager)
// @access Private/Admin or Manager
router.get("/", protect, adminOrManager, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status || "";

    // Xây dựng query filter
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.status = status;
    }

    const total = await Recipe.countDocuments(filter);
    const recipes = await Recipe.find(filter)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Lỗi khi tải danh sách công thức" });
  }
});

// @route GET /api/admin/recipes/:id
// @desc Get single recipe by ID (Admin & Manager)
// @access Private/Admin or Manager
router.get("/:id", protect, adminOrManager, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");
    
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Lỗi khi tải công thức" });
  }
});

// @route POST /api/admin/recipes
// @desc Create new recipe (Admin & Manager)
// @access Private/Admin or Manager
router.post("/", protect, adminOrManager, async (req, res) => {
  try {
    const {
      name,
      description,
      instructions,
      image,
      difficulty,
      cookingTime,
      servings,
      ingredients,
      tags,
      status,
      isPublished
    } = req.body;

    // Kiểm tra trùng tên
    const existingRecipe = await Recipe.findOne({ name });
    if (existingRecipe) {
      return res.status(400).json({ message: "Tên công thức đã tồn tại" });
    }

    const recipe = new Recipe({
      name,
      description,
      instructions,
      image,
      difficulty,
      cookingTime: Number(cookingTime),
      servings: Number(servings),
      ingredients: ingredients || [],
      status: status || 'active',
      isPublished: isPublished || false,
      createdBy: req.user._id
    });

    const savedRecipe = await recipe.save();
    const populatedRecipe = await Recipe.findById(savedRecipe._id)
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Tạo công thức thành công",
      recipe: populatedRecipe
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: "Lỗi khi tạo công thức" });
  }
});

// @route PUT /api/admin/recipes/:id
// @desc Update recipe (Admin & Manager)
// @access Private/Admin or Manager
router.put("/:id", protect, adminOrManager, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    const {
      name,
      description,
      instructions,
      image,
      difficulty,
      cookingTime,
      servings,
      ingredients,
      tags,
      status,
      isPublished
    } = req.body;

    // Kiểm tra trùng tên (trừ chính nó)
    if (name && name !== recipe.name) {
      const existingRecipe = await Recipe.findOne({ 
        name, 
        _id: { $ne: req.params.id } 
      });
      if (existingRecipe) {
        return res.status(400).json({ message: "Tên công thức đã tồn tại" });
      }
    }

    // Cập nhật các trường
    recipe.name = name || recipe.name;
    recipe.description = description || recipe.description;
    recipe.instructions = instructions || recipe.instructions;
    recipe.image = image || recipe.image;
    recipe.difficulty = difficulty || recipe.difficulty;
    recipe.cookingTime = cookingTime ? Number(cookingTime) : recipe.cookingTime;
    recipe.servings = servings ? Number(servings) : recipe.servings;
    recipe.ingredients = ingredients !== undefined ? ingredients : recipe.ingredients;
    recipe.status = status || recipe.status;
    recipe.isPublished = isPublished !== undefined ? isPublished : recipe.isPublished;
    recipe.updatedBy = req.user._id;

    const updatedRecipe = await recipe.save();
    const populatedRecipe = await Recipe.findById(updatedRecipe._id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    res.json({
      message: "Cập nhật công thức thành công",
      recipe: populatedRecipe
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: "Lỗi khi cập nhật công thức" });
  }
});

// @route DELETE /api/admin/recipes/:id
// @desc Delete recipe (Admin & Manager)
// @access Private/Admin or Manager
router.delete("/:id", protect, adminOrManager, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    await Recipe.deleteOne({ _id: req.params.id });
    
    res.json({
      message: "Xóa công thức thành công",
      deletedRecipe: {
        _id: recipe._id,
        name: recipe.name
      }
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Lỗi khi xóa công thức" });
  }
});

// @route PATCH /api/admin/recipes/:id/toggle-status
// @desc Toggle recipe status (Admin & Manager)
// @access Private/Admin or Manager
router.patch("/:id/toggle-status", protect, adminOrManager, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    recipe.status = recipe.status === 'active' ? 'inactive' : 'active';
    recipe.updatedBy = req.user._id;
    
    await recipe.save();

    res.json({
      message: `${recipe.status === 'active' ? 'Kích hoạt' : 'Vô hiệu hóa'} công thức thành công`,
      recipe: {
        _id: recipe._id,
        name: recipe.name,
        status: recipe.status
      }
    });
  } catch (error) {
    console.error("Error toggling recipe status:", error);
    res.status(500).json({ message: "Lỗi khi thay đổi trạng thái công thức" });
  }
});

// @route PATCH /api/admin/recipes/:id/toggle-publish
// @desc Toggle recipe publish (Admin & Manager)
// @access Private/Admin or Manager
router.patch("/:id/toggle-publish", protect, adminOrManager, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    recipe.isPublished = !recipe.isPublished;
    recipe.updatedBy = req.user._id;
    
    await recipe.save();

    res.json({
      message: `${recipe.isPublished ? 'Công khai' : 'Ẩn'} công thức thành công`,
      recipe: {
        _id: recipe._id,
        name: recipe.name,
        isPublished: recipe.isPublished,
        publishedAt: recipe.publishedAt
      }
    });
  } catch (error) {
    console.error("Error toggling recipe publish status:", error);
    res.status(500).json({ message: "Lỗi khi thay đổi trạng thái công khai" });
  }
});

// @route GET /api/admin/recipes/stats/overview
// @desc Get recipes statistics (Admin only)
// @access Private/Admin
router.get("/stats/overview", protect, admin, async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const activeRecipes = await Recipe.countDocuments({ status: 'active' });
    const publishedRecipes = await Recipe.countDocuments({ isPublished: true });
    // Category stats removed as category field was removed

    res.json({
      totalRecipes,
      activeRecipes,
      publishedRecipes,
      inactiveRecipes: totalRecipes - activeRecipes,
      unpublishedRecipes: totalRecipes - publishedRecipes
    });
  } catch (error) {
    console.error("Error fetching recipe stats:", error);
    res.status(500).json({ message: "Lỗi khi tải thống kê công thức" });
  }
});

module.exports = router; 