const jwt = require("jsonwebtoken");
const User = require("../models/User");

//
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token (handle both id and _id)
      const userId = decoded.user.id || decoded.user._id;
      req.user = await User.findById(userId).select("-password");
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }else{
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

//middleware kiểm tra quyền truy cập admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

//middleware kiểm tra quyền truy cập admin hoặc manager
const adminOrManager = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "manager")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin or manager" });
  }
};

//middleware kiểm tra quyền truy cập manager
const manager = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as a manager" });
  }
};

//middleware kiểm tra quyền truy cập baker
const baker = (req, res, next) => {
  if (req.user && req.user.role === "baker") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as a baker" });
  }
};

//middleware kiểm tra quyền truy cập delivery
const delivery = (req, res, next) => {
  if (req.user && req.user.role === "shipper") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as a delivery" });
  }
};

module.exports = { protect, admin, adminOrManager, manager, baker, delivery};