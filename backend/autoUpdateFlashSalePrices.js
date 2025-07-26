const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const FlashSale = require('./models/FlashSale');
const Cart = require('./models/Cart');
const Product = require('./models/Product');
const Ingredient = require('./models/Ingredient');

async function autoUpdateFlashSalePrices() {
  try {
    console.log('🔄 Auto Updating Flash Sale Prices in Carts');
    
    const now = new Date();
    
    // Tìm tất cả flash sales đang active
    const activeFlashSales = await FlashSale.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: 'active'
    });

    console.log(`🔥 Found ${activeFlashSales.length} active flash sales`);

    let totalUpdatedCarts = 0;
    let totalUpdatedItems = 0;

    for (const flashSale of activeFlashSales) {
      console.log(`\n🔍 Processing Flash Sale: ${flashSale.name}`);
      
      // Lấy danh sách sản phẩm và nguyên liệu trong flash sale
      const flashSaleProductIds = flashSale.products.map(p => p.productId.toString());
      const flashSaleIngredientIds = flashSale.ingredients.map(i => i.ingredientId.toString());

      // Tìm tất cả giỏ hàng có chứa sản phẩm flash sale
      const cartsWithFlashSaleItems = await Cart.find({
        'products.productId': { 
          $in: [...flashSaleProductIds, ...flashSaleIngredientIds] 
        }
      });

      console.log(`📦 Found ${cartsWithFlashSaleItems.length} carts for flash sale: ${flashSale.name}`);

      let updatedCarts = 0;
      let updatedItems = 0;

      for (const cart of cartsWithFlashSaleItems) {
        let cartUpdated = false;
        
        for (let i = 0; i < cart.products.length; i++) {
          const item = cart.products[i];
          const itemProductId = item.productId.toString();
          const isFlashSaleProduct = flashSaleProductIds.includes(itemProductId);
          const isFlashSaleIngredient = flashSaleIngredientIds.includes(itemProductId);
          
          if (isFlashSaleProduct || isFlashSaleIngredient) {
            // Tìm flash sale item để lấy giá flash sale
            let flashSaleItem;
            if (isFlashSaleProduct) {
              flashSaleItem = flashSale.products.find(p => p.productId.toString() === itemProductId);
            } else {
              flashSaleItem = flashSale.ingredients.find(i => i.ingredientId.toString() === itemProductId);
            }

            if (flashSaleItem) {
              // Tính giá flash sale dựa trên size nếu có
              let flashSalePrice = flashSaleItem.salePrice;
              if (item.size && flashSaleItem.originalPrice) {
                // Tính tỷ lệ giảm giá
                const discountRatio = flashSaleItem.salePrice / flashSaleItem.originalPrice;
                
                // Tìm sản phẩm gốc để lấy giá size
                let originalItem;
                if (isFlashSaleProduct) {
                  originalItem = await Product.findById(itemProductId);
                } else {
                  originalItem = await Ingredient.findById(itemProductId);
                }

                if (originalItem && originalItem.sizePricing) {
                  const sizePrice = originalItem.sizePricing.find(sp => sp.size === item.size);
                  if (sizePrice) {
                    const originalSizePrice = sizePrice.discountPrice || sizePrice.price;
                    flashSalePrice = Math.round(originalSizePrice * discountRatio);
                  }
                }
              }

              // Cập nhật giá flash sale nếu khác
              if (item.price !== flashSalePrice) {
                console.log(`💰 Updating flash sale price for ${item.name}: ${item.price} → ${flashSalePrice}`);
                item.price = flashSalePrice;
                cartUpdated = true;
                updatedItems++;
              }
            }
          }
        }

        // Cập nhật tổng giá
        if (cartUpdated) {
          cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
          await cart.save();
          updatedCarts++;
          console.log(`✅ Updated cart ${cart._id}: updated prices for ${updatedItems} items`);
        }
      }

      totalUpdatedCarts += updatedCarts;
      totalUpdatedItems += updatedItems;
      
      console.log(`📊 Flash Sale "${flashSale.name}": ${updatedCarts} carts, ${updatedItems} items updated`);
    }

    console.log(`\n🎉 Auto update completed: ${totalUpdatedCarts} carts, ${totalUpdatedItems} items total`);

  } catch (error) {
    console.error('❌ Error during auto update:', error);
  } finally {
    console.log('\n🔌 Disconnected from MongoDB');
    mongoose.disconnect();
  }
}

// Chạy auto update
autoUpdateFlashSalePrices(); 