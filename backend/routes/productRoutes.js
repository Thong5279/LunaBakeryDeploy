const express = require("express");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const { protect, admin } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

// Hàm helper để tự động tạo sizePricing (giống với productAdminRoutes.js)
const generateSizePricing = (sizes, basePrice) => {
  if (!sizes || sizes.length === 0) {
      return [];
  }

  // Hàm xác định increment cho từng loại size
  const getSizeIncrement = (size) => {
      const sizeStr = size.toLowerCase();
      
      // Size nhỏ, vừa, lớn - cách nhau 10,000
      if (sizeStr.includes('nhỏ') || sizeStr.includes('vừa') || sizeStr.includes('lớn')) {
          return 10000;
      }
      
      // Size S, M, L - cách nhau 5,000
      if (sizeStr === 's' || sizeStr === 'm' || sizeStr === 'l' || 
          sizeStr === 'size s' || sizeStr === 'size m' || sizeStr === 'size l') {
          return 5000;
      }
      
      // Các size khác (18cm, 20cm, 22cm...) - cách nhau 50,000
      return 50000;
  };

  const increment = getSizeIncrement(sizes[0]);
  const sizePricing = [];

  sizes.forEach((size, index) => {
      sizePricing.push({
          size: size,
          price: basePrice + (index * increment),
          discountPrice: basePrice + (index * increment)
      });
  });

  return sizePricing;
};

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
      sizePricing,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice: discountPrice || price,
      countInStock,
      sku,
      category,
      sizes,
      flavors,
      images,
      isFeatured,
      isPublished,
      sizePricing,
      user: req.user._id, // id của admin người tạo sản phẩm
    });

    // Tự động tạo sizePricing nếu có sizes và chưa có sizePricing
    if (sizes && sizes.length > 0 && (!sizePricing || sizePricing.length === 0)) {
      const basePrice = discountPrice || price;
      product.sizePricing = generateSizePricing(sizes, basePrice);
      console.log(`✅ Tự động tạo sizePricing cho sản phẩm mới: ${name}`);
      console.log(`   Prices: ${product.sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
    }

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
      sizePricing,
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
      product.sizePricing = sizePricing || product.sizePricing;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;

      // Tự động tạo sizePricing nếu có sizes và chưa có sizePricing hoặc sizePricing rỗng
      if (product.sizes && product.sizes.length > 0 && 
          (!product.sizePricing || product.sizePricing.length === 0)) {
          const basePrice = product.discountPrice || product.price;
          product.sizePricing = generateSizePricing(product.sizes, basePrice);
          console.log(`✅ Tự động tạo sizePricing cho sản phẩm: ${product.name}`);
          console.log(`   Prices: ${product.sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
      }

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

// ... existing code ...

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
    let query = {
      $or: [
        { status: 'active' }, // Sản phẩm có status active
        { status: { $exists: false } } // Sản phẩm cũ không có status field (backward compatibility)
      ],
      isPublished: true // Chỉ hiển thị sản phẩm đã publish
    };

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
    
    console.log(`✅ Fetched ${products.length} active products`);
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
    const bestSellers = await Product.findOne({
      $or: [
        { status: 'active' },
        { status: { $exists: false } }
      ],
      isPublished: true
    }).sort({ rating: -1 });
    
    if (bestSellers) {
      res.json(bestSellers);
    }else {
      res.status(404).json({ message: "No best sellers found" });
    }

  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: "Server error" ,error: error.message });

  }
})

//@route GET /api/products/new-arrivals
//@desc Retrieve latest 8 products - creation date
//@access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find({
      $or: [
        { status: 'active' },
        { status: { $exists: false } }
      ],
      isPublished: true
    })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(8); // Limit to 8 products

    console.log(`✅ Fetched ${newArrivals.length} new arrival products`);
    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/products/price-range
// @desc Get price range (min/max) from all active products
// @access Public
router.get("/price-range", async (req, res) => {
  try {
    // Get min and max prices from products using aggregation
    const priceStats = await Product.aggregate([
      {
        $match: {
          $or: [
            { status: 'active' },
            { status: { $exists: false } }
          ],
          isPublished: true,
          price: { $exists: true, $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          minDiscountPrice: { $min: "$discountPrice" },
          maxDiscountPrice: { $max: "$discountPrice" }
        }
      }
    ]);

    if (priceStats.length === 0) {
      return res.json({
        minPrice: 0,
        maxPrice: 1000000
      });
    }

    const stats = priceStats[0];
    
    // Use the absolute minimum and maximum between price and discountPrice
    const absoluteMin = Math.min(
      stats.minPrice || 0,
      stats.minDiscountPrice || 0
    );
    
    const absoluteMax = Math.max(
      stats.maxPrice || 1000000,
      stats.maxDiscountPrice || 1000000
    );

    res.json({
      minPrice: Math.floor(absoluteMin / 1000) * 1000, // Round down to nearest thousand
      maxPrice: Math.ceil(absoluteMax / 1000) * 1000   // Round up to nearest thousand
    });

  } catch (error) {
    console.error("Error fetching price range:", error);
    res.status(500).json({ 
      message: "Lỗi server khi tải khoảng giá",
      minPrice: 0,
      maxPrice: 1000000
    });
  }
});

// @route GET /api/products/search-suggestions
// @desc Get search suggestions for products and ingredients
// @access Public
router.get("/search-suggestions", async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }
    
    const searchTerm = q.trim();
    const searchRegex = { $regex: searchTerm, $options: "i" };
    
    // Search products (limit to 3)
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ],
      $and: [
        {
          $or: [
            { status: 'active' },
            { status: { $exists: false } }
          ]
        },
        { isPublished: true }
      ]
    })
    .select('name category images price discountPrice')
    .limit(3);
    
    // Search ingredients (limit to 2)
    const ingredients = await Ingredient.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ],
      status: 'active'
    })
    .select('name category images price discountPrice')
    .limit(2);
    
    // Format suggestions
    const suggestions = [
      ...products.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        image: product.images && product.images.length > 0 ? product.images[0].url : null,
        price: product.discountPrice || product.price,
        type: 'product',
        url: `/product/${product._id}`
      })),
      ...ingredients.map(ingredient => ({
        id: ingredient._id,
        name: ingredient.name,
        category: ingredient.category,
        image: ingredient.images && ingredient.images.length > 0 ? ingredient.images[0] : null,
        price: ingredient.price,
        type: 'ingredient',
        url: `/ingredients?search=${encodeURIComponent(ingredient.name)}`
      }))
    ];
    
    res.json(suggestions);
    
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    res.status(500).json({ message: "Lỗi server khi tải gợi ý tìm kiếm" });
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const similarProducts = await Product.find({
      category: product.category,
      $or: [
        { status: 'active' },
        { status: { $exists: false } }
      ],
      isPublished: true,
      _id: { $ne: product._id }, // Exclude the current product
    }).limit(4);

    console.log(`✅ Fetched ${similarProducts.length} similar products for category: ${product.category}`);
    res.json(similarProducts);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

//@route PUT /api/products/:id/add-size-pricing
//@desc Add sizePricing to existing product
//@access Private (Admin)
router.put("/:id/add-size-pricing", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product) {
      // Sử dụng hàm generateSizePricing mới
      const basePrice = product.discountPrice || product.price;
      
      if (product.sizes && product.sizes.length > 0) {
        product.sizePricing = generateSizePricing(product.sizes, basePrice);
      }

      const updatedProduct = await product.save();
      
      res.json({
        message: "SizePricing added successfully",
        product: updatedProduct
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error adding sizePricing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
