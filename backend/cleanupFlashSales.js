// Script tự động cleanup flash sale đã kết thúc
const mongoose = require('mongoose');
require('dotenv').config();

const cleanupFlashSales = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const FlashSale = require('./models/FlashSale');
    const Cart = require('./models/Cart');

    const now = new Date();
    console.log('🕐 Current time:', now.toISOString());
    
    // Tìm tất cả flash sale đã kết thúc
    const expiredFlashSales = await FlashSale.find({
      endDate: { $lt: now },
      status: { $ne: 'expired' }
    });

    console.log(`🕐 Found ${expiredFlashSales.length} expired flash sales`);

    if (expiredFlashSales.length === 0) {
      console.log('✅ No expired flash sales to cleanup');
      return;
    }

    let totalCleanedCarts = 0;
    let totalRemovedItems = 0;

    for (const flashSale of expiredFlashSales) {
      console.log(`🧹 Processing flash sale: ${flashSale.name}`);
      
      // Cập nhật status thành expired
      flashSale.status = 'expired';
      await flashSale.save();
      console.log(`✅ Updated status to expired for: ${flashSale.name}`);

      // Lấy danh sách sản phẩm và nguyên liệu trong flash sale
      const flashSaleProductIds = flashSale.products.map(p => p.productId.toString());
      const flashSaleIngredientIds = flashSale.ingredients.map(i => i.ingredientId.toString());

      // Tìm tất cả giỏ hàng có chứa sản phẩm flash sale
      const cartsWithFlashSaleItems = await Cart.find({
        $or: [
          { 'products.productId': { $in: flashSaleProductIds } },
          { 'products.ingredientId': { $in: flashSaleIngredientIds } }
        ]
      });

      console.log(`🛒 Found ${cartsWithFlashSaleItems.length} carts with flash sale items`);

      for (const cart of cartsWithFlashSaleItems) {
        let cartUpdated = false;
        
        // Lọc ra các item không phải flash sale
        cart.products = cart.products.filter(item => {
          const isFlashSaleProduct = flashSaleProductIds.includes(item.productId?.toString());
          const isFlashSaleIngredient = flashSaleIngredientIds.includes(item.ingredientId?.toString());
          
          if (isFlashSaleProduct || isFlashSaleIngredient) {
            totalRemovedItems++;
            cartUpdated = true;
            console.log(`🗑️ Removed item from cart: ${item.name || 'Unknown'}`);
            return false;
          }
          return true;
        });

        // Cập nhật tổng giá
        if (cartUpdated) {
          cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
          await cart.save();
          totalCleanedCarts++;
          console.log(`✅ Updated cart for user: ${cart.user}`);
        }
      }
    }

    console.log(`🧹 Cleanup completed:`);
    console.log(`  - Expired flash sales: ${expiredFlashSales.length}`);
    console.log(`  - Cleaned carts: ${totalCleanedCarts}`);
    console.log(`  - Removed items: ${totalRemovedItems}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Chạy cleanup
cleanupFlashSales(); 