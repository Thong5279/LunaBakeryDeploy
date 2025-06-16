const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST /api/users/register
//@desc Register a new user
//@access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
    });
    await user.save();

    //create jwt payload

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    //sign and return the token

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(" Error", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route POST /api/users/login
// @desc Mô tả quyền xác nhập truy cập
//@access Public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    //kiểm tra người dùng có tồn tại hay không
    if (!user)
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ!" });
    const isMatch = await user.matchPassword(password);
    //kiểm tra mật khẩu
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ!" });

    //sign and return the token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
});

// @route GET /api/users/profile
//@desc Lấy hồ sơ người dùng đã đăng nhập
//@access Private

router.get("/profile",protect, async (req, res) => {
    res.json(req.user);
})

module.exports = router;
