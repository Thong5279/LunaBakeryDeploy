const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const FlashSale = require("../models/FlashSale");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//helper function to get cart by userId or guestId . hàm trợ giúp để lấy giỏ hàng theo userId hoặc guestId
const getCart = async (userId, guestId) => {
  if (userId) {
    // If user is logged in, find cart by user ID
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    // If guest, find cart by guest ID
    return await Cart.findOne({ guestId });
  } else {
    // If neither, return null
    return null;
  }
};

// Helper function to find product or ingredient
const findProductOrIngredient = async (productId) => {
  // Try to find as a product first
  let item = await Product.findById(productId);
  let itemType = 'Product';
  
  // If not found as product, try as ingredient
  if (!item) {
    item = await Ingredient.findById(productId);
    itemType = 'Ingredient';
  }
  
  return { item, itemType };
};

// Helper function to calculate price based on size and flash sale
const calculatePriceBySize = async (product, size) => {
  let basePrice;
  
  // Nguyên liệu không có size pricing, chỉ có giá cố định
  if (!product.sizePricing) {
    basePrice = product.discountPrice || product.price;
  } else {
    // Nếu có sizePricing và size được chọn (chỉ cho sản phẩm)
    if (product.sizePricing && product.sizePricing.length > 0 && size) {
      const sizePrice = product.sizePricing.find(sp => sp.size === size);
      if (sizePrice) {
        // Ưu tiên discountPrice nếu có, không thì lấy price
        basePrice = sizePrice.discountPrice || sizePrice.price;
      } else {
        basePrice = product.discountPrice || product.price;
      }
    } else {
      // Fallback về giá gốc - ưu tiên discountPrice
      basePrice = product.discountPrice || product.price;
    }
  }

  // Kiểm tra flash sale
  const activeFlashSales = await FlashSale.find({
    status: 'active',
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });

  for (const flashSale of activeFlashSales) {
    // Kiểm tra sản phẩm trong flash sale
    if (flashSale.products) {
      const flashSaleProduct = flashSale.products.find(fp => 
        fp.productId.toString() === product._id.toString()
      );
      
      if (flashSaleProduct && flashSaleProduct.soldQuantity < flashSaleProduct.quantity) {
        // Có flash sale cho sản phẩm này
        // Nếu có size, tính giá flash sale dựa trên giá size
        if (product.sizePricing && size) {
          const sizePrice = product.sizePricing.find(sp => sp.size === size);
          if (sizePrice) {
            const sizeBasePrice = sizePrice.discountPrice || sizePrice.price;
            
            // Tính toán giá flash sale cho size được chọn
            if (flashSale.discountType === 'percentage') {
              // Giảm giá theo % - áp dụng % giảm cho giá size
              const discountPercent = (flashSaleProduct.originalPrice - flashSaleProduct.salePrice) / flashSaleProduct.originalPrice;
              return Math.round(sizeBasePrice * (1 - discountPercent));
            } else {
              // Giảm giá theo số tiền cố định - trừ trực tiếp số tiền giảm
              const discountAmount = flashSaleProduct.originalPrice - flashSaleProduct.salePrice;
              return Math.max(0, sizeBasePrice - discountAmount);
            }
          }
        }
        // Không có size hoặc không tìm thấy size, trả về giá flash sale gốc
        return flashSaleProduct.salePrice;
      }
    }

    // Kiểm tra nguyên liệu trong flash sale
    if (flashSale.ingredients) {
      const flashSaleIngredient = flashSale.ingredients.find(fi => 
        fi.ingredientId.toString() === product._id.toString()
      );
      
      if (flashSaleIngredient && flashSaleIngredient.soldQuantity < flashSaleIngredient.quantity) {
        // Có flash sale cho nguyên liệu này, trả về giá flash sale
        return flashSaleIngredient.salePrice;
      }
    }
  }

  // Không có flash sale, trả về giá thường
  return basePrice;
};

// @route POST /api/cart
// @desc Add product to cart for a guest or logged-in user
// @access Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, flavor, guestId, userId } = req.body;

  try {
    const { item, itemType } = await findProductOrIngredient(productId);
    
    if (!item) {
      return res.status(404).json({ message: "Sản phẩm hoặc nguyên liệu không tìm thấy" });
    }

    // Kiểm tra số lượng tồn kho
    if (quantity > item.quantity) {
      return res.status(400).json({ 
        message: `Số lượng yêu cầu (${quantity}) vượt quá số lượng tồn kho (${item.quantity})` 
      });
    }

    // Tính giá theo size đã chọn và flash sale
    const priceBySize = await calculatePriceBySize(item, size);

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (e) =>
          e.productId.toString() === productId.toString() &&
          e.size === size &&
          e.flavor === flavor
      );

      if (productIndex > -1) {
        // Kiểm tra tổng số lượng sau khi cộng thêm
        const newQuantity = cart.products[productIndex].quantity + quantity;
        if (newQuantity > item.quantity) {
          return res.status(400).json({ 
            message: `Tổng số lượng trong giỏ hàng (${newQuantity}) vượt quá số lượng tồn kho (${item.quantity})` 
          });
        }
        cart.products[productIndex].quantity = newQuantity;
      } else {
        cart.products.push({
          productId: item._id,
          name: item.name,
          image: (item.images && item.images.length > 0) ? 
                 (typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url) : "",
          price: priceBySize,
          quantity,
          size: size || "Mặc định",
          flavor: flavor || "Mặc định",
          itemType,
          stockQuantity: item.quantity // Thêm thông tin số lượng tồn kho
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: item.name,
            image: (item.images && item.images.length > 0) ? 
                   (typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url) : "",
            price: priceBySize,
            quantity,
            size: size || "Mặc định",
            flavor: flavor || "Mặc định",
            itemType,
            stockQuantity: item.quantity // Thêm thông tin số lượng tồn kho
          }
        ],
        totalPrice: priceBySize * quantity
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/cart
// @desc Update product quantity in cart
// @access Private
router.put("/", async (req, res) => {
  const { productId, quantity, size, flavor, guestId, userId } = req.body;

  try {
    // Kiểm tra số lượng tồn kho
    const { item } = await findProductOrIngredient(productId);
    if (!item) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
    }

    if (quantity > item.quantity) {
      return res.status(400).json({ 
        message: `Số lượng yêu cầu (${quantity}) vượt quá số lượng tồn kho (${item.quantity})` 
      });
    }

    // Tính giá theo size đã chọn và flash sale
    const priceBySize = await calculatePriceBySize(item, size);

    const cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const productIndex = cart.products.findIndex(
      (e) =>
        e.productId.toString() === productId &&
        e.size === size &&
        e.flavor === flavor
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
        cart.products[productIndex].price = priceBySize; // Cập nhật giá theo flash sale
        cart.products[productIndex].stockQuantity = item.quantity; // Cập nhật số lượng tồn kho
      } else {
        cart.products.splice(productIndex, 1);
      }
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }
  } catch (error) {
    console.error("Error updating product quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route DELETE /api/cart
//@desc Remove a product from cart
//@access public
router.delete("/", async (req, res) => {
  const { productId, size, flavor, guestId, userId } = req.body;
  try {
    const cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (e) =>
        e.productId.toString() === productId &&
        e.size === size &&
        e.flavor === flavor
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1); // Remove product from cart
      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/cart
//@desc Get logged-in user's or guest's cart
//@access Public

router.get("/", protect, async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      // Lấy thông tin số lượng tồn kho cho từng sản phẩm
      const updatedProducts = await Promise.all(cart.products.map(async (product) => {
        const { item } = await findProductOrIngredient(product.productId);
        return {
          ...product.toObject(),
          stockQuantity: item ? item.quantity || 0 : 0
        };
      }));

      // Cập nhật lại cart với thông tin số lượng tồn kho
      const cartResponse = {
        ...cart.toObject(),
        products: updatedProducts
      };

      return res.status(200).json(cartResponse);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    //Find the guest cart and user's cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });
    
    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(404).json({ message: "Guest cart is empty" });
      }
      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.flavor === guestItem.flavor
          );
          if (productIndex > -1) {
            // If product already exists in user's cart, update quantity
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // If product does not exist, add it to user's cart
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();
        //remove the guest cart after merging
        try {
            await Cart.findOneAndDelete({ guestId });
        } catch (error) {
            console.log("Error deleting guest cart:", error);
        }
        res.status(200).json(userCart);
      }else {
        //if the user has no existing cart, just assign the guest cart to the user
        guestCart.user = req.user._id; // Assign user ID to the cart
        guestCart.guestId = undefined; // Remove guest ID
        await guestCart.save();

        res.status(200).json(guestCart);
      } 
    }else{
        if (userCart) {
            // If user already has a cart, just return it
            return res.status(200).json(userCart);
        }
        res.status(404).json({ message: "No guest cart found to merge" });
    }
  } catch (error) {
    console.error("Error merging carts:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
