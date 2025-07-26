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

async function testSyncCartPrices() {
  try {
    console.log('🧪 Testing Cart Price Sync Functionality');
    
    // Lấy tất cả flash sales
    const flashSales = await FlashSale.find({});
    console.log(`📊 Found ${flashSales.length} flash sales`);
    
    for (const flashSale of flashSales) {
      console.log(`\n🔍 Testing Flash Sale: ${flashSale.name}`);
      console.log(`   Status: ${flashSale.status}`);
      console.log(`   Start: ${flashSale.startDate.toISOString()}`);
      console.log(`   End: ${flashSale.endDate.toISOString()}`);
      
      // Lấy danh sách sản phẩm và nguyên liệu trong flash sale
      const flashSaleProductIds = flashSale.products.map(p => p.productId.toString());
      const flashSaleIngredientIds = flashSale.ingredients.map(i => i.ingredientId.toString());

      console.log(`   Products: ${flashSaleProductIds.length}`);
      console.log(`   Ingredients: ${flashSaleIngredientIds.length}`);

      // Tìm tất cả giỏ hàng có chứa sản phẩm flash sale
      const cartsWithFlashSaleItems = await Cart.find({
        'products.productId': { 
          $in: [...flashSaleProductIds, ...flashSaleIngredientIds] 
        }
      });

      console.log(`   📦 Found ${cartsWithFlashSaleItems.length} carts with flash sale items`);

      if (cartsWithFlashSaleItems.length > 0) {
        for (const cart of cartsWithFlashSaleItems) {
          console.log(`   🛒 Cart ${cart._id}:`);
          console.log(`      User: ${cart.user || 'Guest'}`);
          console.log(`      Items: ${cart.products.length}`);
          console.log(`      Total Price: ${cart.totalPrice}`);
          
          // Kiểm tra từng item trong giỏ hàng
          for (const item of cart.products) {
            const itemProductId = item.productId.toString();
            const isFlashSaleProduct = flashSaleProductIds.includes(itemProductId);
            const isFlashSaleIngredient = flashSaleIngredientIds.includes(itemProductId);
            
            if (isFlashSaleProduct || isFlashSaleIngredient) {
              console.log(`      ⭐ Flash Sale Item: ${item.name} - Price: ${item.price}`);
              
              // Tìm giá gốc
              let originalItem;
              if (isFlashSaleProduct) {
                originalItem = await Product.findById(itemProductId);
              } else {
                originalItem = await Ingredient.findById(itemProductId);
              }

              if (originalItem) {
                let originalPrice = originalItem.price;
                if (item.size && originalItem.sizePricing) {
                  const sizePrice = originalItem.sizePricing.find(sp => sp.size === item.size);
                  if (sizePrice) {
                    originalPrice = sizePrice.discountPrice || sizePrice.price;
                  }
                }
                
                console.log(`         Original Price: ${originalPrice}`);
                console.log(`         Current Price: ${item.price}`);
                console.log(`         Price Difference: ${item.price - originalPrice}`);
              }
            } else {
              console.log(`      📦 Regular Item: ${item.name} - Price: ${item.price}`);
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    console.log('\n🔌 Disconnected from MongoDB');
    mongoose.disconnect();
  }
}

// Chạy test
testSyncCartPrices(); 