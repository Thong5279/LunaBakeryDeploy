// Script tự động cleanup flash sale đã kết thúc
const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const FlashSale = require('./models/FlashSale');
const Cart = require('./models/Cart');

async function cleanupExpiredFlashSales() {
  try {
    const now = new Date();
    console.log('🕐 Current time:', now.toISOString());
    
    // Tìm tất cả flash sale đã kết thúc
    const expiredFlashSales = await FlashSale.find({
      endDate: { $lt: now },
      status: { $ne: 'expired' }
    });

    console.log(`🕐 Found ${expiredFlashSales.length} expired flash sales`);

    let totalCleanedCarts = 0;
    let totalRemovedItems = 0;

    for (const flashSale of expiredFlashSales) {
      console.log(`🔄 Processing expired flash sale: ${flashSale.name}`);
      
      // Cập nhật status thành expired
      flashSale.status = 'expired';
      await flashSale.save();

      // Lấy danh sách sản phẩm và nguyên liệu trong flash sale
      const flashSaleProductIds = flashSale.products.map(p => p.productId.toString());
      const flashSaleIngredientIds = flashSale.ingredients.map(i => i.ingredientId.toString());

      console.log('🔍 Flash Sale Products:', flashSaleProductIds);
      console.log('🔍 Flash Sale Ingredients:', flashSaleIngredientIds);

      // Tìm tất cả giỏ hàng có chứa sản phẩm flash sale
      const cartsWithFlashSaleItems = await Cart.find({
        'products.productId': { 
          $in: [...flashSaleProductIds, ...flashSaleIngredientIds] 
        }
      });

      console.log(`📦 Found ${cartsWithFlashSaleItems.length} carts for flash sale: ${flashSale.name}`);

      for (const cart of cartsWithFlashSaleItems) {
        let cartUpdated = false;
        
        const originalProducts = [...cart.products];
        cart.products = cart.products.filter(item => {
          const itemProductId = item.productId.toString();
          const isFlashSaleProduct = flashSaleProductIds.includes(itemProductId);
          const isFlashSaleIngredient = flashSaleIngredientIds.includes(itemProductId);
          
          if (isFlashSaleProduct || isFlashSaleIngredient) {
            console.log(`🗑️ Removing expired item: ${item.name} (${itemProductId}) from cart ${cart._id}`);
            totalRemovedItems++;
            cartUpdated = true;
            return false;
          }
          return true;
        });

        if (cartUpdated) {
          cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
          await cart.save();
          totalCleanedCarts++;
          console.log(`✅ Updated cart ${cart._id}: removed ${originalProducts.length - cart.products.length} items`);
        }
      }
    }

    console.log(`🧹 Cleanup completed: ${totalCleanedCarts} carts, ${totalRemovedItems} items`);

    if (expiredFlashSales.length === 0) {
      console.log('✅ No expired flash sales to cleanup');
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    console.log('🔌 Disconnected from MongoDB');
    mongoose.disconnect();
  }
}

// Chạy cleanup
cleanupExpiredFlashSales(); 