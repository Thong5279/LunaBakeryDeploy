const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const FlashSale = require('./models/FlashSale');
const Cart = require('./models/Cart');

async function testDirectCleanup() {
  try {
    console.log('🧪 Testing Direct Flash Sale Cleanup');
    
    // Tìm flash sale để test
    let flashSale;
    const flashSaleId = '6873d8dedc4311a81507de4b'; // Thay bằng ID thật từ test trước
    flashSale = await FlashSale.findById(flashSaleId);
    
    if (!flashSale) {
      console.log('❌ Flash sale not found, trying to find any flash sale...');
      const allFlashSales = await FlashSale.find({});
      if (allFlashSales.length > 0) {
        flashSale = allFlashSales[0];
        console.log(`✅ Found flash sale: ${flashSale.name} (${flashSale._id})`);
      } else {
        console.log('❌ No flash sales found');
        return;
      }
    }
    
    console.log(`🔍 Testing Flash Sale: ${flashSale.name}`);
    console.log(`   Status: ${flashSale.status}`);
    console.log(`   Products: ${flashSale.products.length}`);
    console.log(`   Ingredients: ${flashSale.ingredients.length}`);
    
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

    console.log(`📦 Found ${cartsWithFlashSaleItems.length} carts with flash sale items`);

    if (cartsWithFlashSaleItems.length === 0) {
      console.log('✅ No carts to cleanup');
      return;
    }

    let cleanedCarts = 0;
    let removedItems = 0;

    for (const cart of cartsWithFlashSaleItems) {
      console.log(`\n🛒 Processing Cart ${cart._id}:`);
      console.log(`   User: ${cart.user || 'Guest'}`);
      console.log(`   Items before: ${cart.products.length}`);
      console.log(`   Total Price before: ${cart.totalPrice}`);
      
      let cartUpdated = false;
      const originalProducts = [...cart.products];
      
      cart.products = cart.products.filter(item => {
        const itemProductId = item.productId.toString();
        const isFlashSaleProduct = flashSaleProductIds.includes(itemProductId);
        const isFlashSaleIngredient = flashSaleIngredientIds.includes(itemProductId);
        
        if (isFlashSaleProduct || isFlashSaleIngredient) {
          console.log(`   🗑️ Removing item: ${item.name} (${itemProductId})`);
          removedItems++;
          cartUpdated = true;
          return false;
        }
        return true;
      });

      if (cartUpdated) {
        cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        cleanedCarts++;
        console.log(`   ✅ Updated cart: ${originalProducts.length - cart.products.length} items removed`);
        console.log(`   Items after: ${cart.products.length}`);
        console.log(`   Total Price after: ${cart.totalPrice}`);
      } else {
        console.log(`   ⏭️ No changes needed`);
      }
    }

    console.log(`\n🧹 Cleanup completed: ${cleanedCarts} carts, ${removedItems} items`);

  } catch (error) {
    console.error('❌ Error during direct cleanup test:', error);
  } finally {
    console.log('\n🔌 Disconnected from MongoDB');
    mongoose.disconnect();
  }
}

// Chạy test
testDirectCleanup(); 