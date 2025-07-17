const express = require("express");
const User = require("../models/User");
const { protect, admin, adminOrManager } = require("../middleware/authMiddleware");
const { route } = require("./userRoute");

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users with search and filter (Admin and Manager only)
// @access Private/Admin/Manager
router.get("/", protect, adminOrManager, async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    
    // Xây dựng query filter
    let filter = {};
    
    // Tìm kiếm theo tên hoặc email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Lọc theo role
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    // Lọc theo trạng thái khoá
    if (status && status !== 'all') {
      if (status === 'locked') {
        filter.isLocked = true;
      } else if (status === 'active') {
        filter.isLocked = false;
      }
    }
    
    // Tính toán pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Thực hiện query với pagination
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Đếm tổng số user theo filter
    const totalUsers = await User.countDocuments(filter);
    
    // Tính toán thông tin pagination
    const totalPages = Math.ceil(totalUsers / parseInt(limit));
    
    res.status(200).json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route POST /api/admin/users
// @desc Add a new user (Admin and Manager only)
// @access Private/Admin/Manager
router.post("/", protect, adminOrManager, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ name, email, password, role: role || "customer" });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/admin/users/:id
//@desc Update user info (Admin and Manager only) - Name , email , and role
//@access Private/Admin/Manager
router.put("/:id", protect, adminOrManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const updatedUser = await user.save();
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
})

// @route DELETE /api/admin/users/:id
// @desc Delete a user (Admin and Manager only)
// @access Private/Admin/Manager
router.delete("/:id", protect, adminOrManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
   if(user){
    await user.deleteOne(); // Use deleteOne to remove the user
    res.status(200).json({ message: "User deleted successfully" });
   }else{
    res.status(404).json({ message: "User not found" });
   }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PATCH /api/admin/users/:id/lock
// @desc Lock a user account (Admin and Manager only)
// @access Private/Admin/Manager
router.patch("/:id/lock", protect, adminOrManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Không cho phép khoá tài khoản admin
    if (user.role === 'admin') {
      return res.status(403).json({ message: "Không thể khoá tài khoản admin" });
    }
    
    user.isLocked = true;
    await user.save();
    
    res.status(200).json({ 
      message: "Tài khoản đã được khoá thành công", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isLocked: user.isLocked
      }
    });
  } catch (error) {
    console.error("Error locking user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PATCH /api/admin/users/:id/unlock
// @desc Unlock a user account (Admin and Manager only)
// @access Private/Admin/Manager
router.patch("/:id/unlock", protect, adminOrManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.isLocked = false;
    await user.save();
    
    res.status(200).json({ 
      message: "Tài khoản đã được mở khoá thành công", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isLocked: user.isLocked
      }
    });
  } catch (error) {
    console.error("Error unlocking user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
