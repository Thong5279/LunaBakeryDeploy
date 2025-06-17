const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST /api/products
//@desc Create a new product
//@access Private (Admin)

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      sizes,
      flavors,
      images,
      isFeatured,
      isPublished,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      sizes,
      flavors,
      images,
      isFeatured,
      isPublished,
      user: req.user._id, // id của admin người tạo sản phẩm
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route PUT /api/products/:id
//@desc Update an existing product ID
//@access Private (Admin)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      sizes,
      flavors,
      images,
      isFeatured,
      isPublished,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.sizes = sizes || product.sizes;
      product.flavors = flavors || product.flavors;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@Route DELETE /api/products/:id
//@desc Delete a product
//@access Private (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route get /api/products
//@desc Get all products with optional query filters
//@access Public
router.get("/", async (req, res) => {
  try {
    const {
      category,
      size,
      flavor,
      minPrice,
      maxPrice,
      sortBy,
      search,
      limit,
    } = req.query;
    let query = {};

    // Filter logic
    // Tìm kiếm theo tên hoặc mô tả (dạng text search đơn giản)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Lọc theo category
    if (category) {
      query.category = category;
    }

    // Lọc theo size (trong mảng sizes)
    if (size) {
      const sizeArray = Array.isArray(size) ? size : [size];
      query.sizes = { $in: sizeArray };
    }

    // Lọc theo flavor (trong mảng flavors)
    if (flavor) {
      // Nếu flavor là chuỗi (1 vị) => ép thành mảng
      const flavorArray = Array.isArray(flavor) ? flavor : [flavor];
      query.flavors = { $in: flavorArray };
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort logic
    let sort = {};
    if (sortBy === "priceAsc") {
      sort.price = 1;
    } else if (sortBy === "priceDesc") {
      sort.price = -1;
    } else if (sortBy === "popularity") {
      sort.rating = -1;
    } else {
      sort.createdAt = -1; // Mặc định: mới nhất
    }

    // Fetch products and apply sorting and limiting
    let products = await Product.find(query)
      .sort(sort) // Mặc định sắp xếp theo ngày tạo mới nhất
      .limit(Number(limit) || 0); // Giới hạn số lượng sản phẩm trả về
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/products/best-sellers
// @desc Retrieve the produuct with the highest rating
// @access Public

router.get("/best-sellers", async (req, res) => {
  try {
    const bestSellers = await Product.findOne().sort({ rating: -1 });
    if (bestSellers) {
      res.json(bestSellers);
    }else {
      res.status(404).json({ message: "No best sellers found" });
    }

  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: "Server error" });
  }
})

//@route GET /api/products/new-arrivals
//@desc Retrieve latest 8 products - creation date
//@access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find({})
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(8); // Limit to 8 products

    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/products/:id
//@desc Get a single product by ID
//@access Public

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/products/similar/:id
//@desc Retrieve similar products based on category and flavors
//@access Public 

router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id }, // Exclude the current product
      category: product.category, // Same category
      flavors: { $in: product.flavors }, // At least one matching flavor
    }).limit(4); // Limit to 4 similar products
    
    res.json(similarProducts);
    
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Server error" });
  }
})

module.exports = router;
