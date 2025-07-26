const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const FlashSale = require('./models/FlashSale');
const Product = require('./models/Product');
const Ingredient = require('./models/Ingredient');

async function createTestFlashSale() {
  try {
    console.log('🧪 Creating Test Flash Sale with Real Discount');
    
    // Tìm một sản phẩm để test
    const testProduct = await Product.findOne({});
    if (!testProduct) {
      console.log('❌ No products found');
      return;
    }
    
    console.log(`📦 Using product: ${testProduct.name} - Price: ${testProduct.price}`);
    
    // Tạo flash sale với giảm giá 20%
    const now = new Date();
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 giờ sau
    
    const flashSale = new FlashSale({
      name: 'Test Flash Sale - 20% OFF',
      description: 'Flash sale test với giảm giá 20%',
      startDate: now,
      endDate: endTime,
      discountType: 'percentage',
      discountValue: 20,
      products: [{
        productId: testProduct._id,
        originalPrice: testProduct.price,
        salePrice: Math.round(testProduct.price * 0.8), // Giảm 20%
        quantity: testProduct.countInStock || 100,
        soldQuantity: 0
      }],
      ingredients: [],
      status: 'active',
      isActive: true,
      createdBy: '68754b2ab39b8233d6770697' // Admin user ID
    });
    
    const savedFlashSale = await flashSale.save();
    console.log(`✅ Created flash sale: ${savedFlashSale.name}`);
    console.log(`   Product: ${testProduct.name}`);
    console.log(`   Original Price: ${testProduct.price}`);
    console.log(`   Sale Price: ${Math.round(testProduct.price * 0.8)}`);
    console.log(`   Discount: 20%`);
    console.log(`   Start: ${now.toISOString()}`);
    console.log(`   End: ${endTime.toISOString()}`);
    
    // Tạo flash sale thứ 2 với giảm giá cố định
    const testProduct2 = await Product.findOne({ _id: { $ne: testProduct._id } });
    if (testProduct2) {
      const flashSale2 = new FlashSale({
        name: 'Test Flash Sale - Fixed Discount',
        description: 'Flash sale test với giảm giá cố định 10,000₫',
        startDate: now,
        endDate: endTime,
        discountType: 'fixed',
        discountValue: 10000,
        products: [{
          productId: testProduct2._id,
          originalPrice: testProduct2.price,
          salePrice: Math.max(0, testProduct2.price - 10000),
          quantity: testProduct2.countInStock || 100,
          soldQuantity: 0
        }],
        ingredients: [],
        status: 'active',
        isActive: true,
        createdBy: '68754b2ab39b8233d6770697' // Admin user ID
      });
      
      const savedFlashSale2 = await flashSale2.save();
      console.log(`✅ Created flash sale 2: ${savedFlashSale2.name}`);
      console.log(`   Product: ${testProduct2.name}`);
      console.log(`   Original Price: ${testProduct2.price}`);
      console.log(`   Sale Price: ${Math.max(0, testProduct2.price - 10000)}`);
      console.log(`   Discount: 10,000₫`);
    }
    
  } catch (error) {
    console.error('❌ Error creating test flash sale:', error);
  } finally {
    console.log('\n🔌 Disconnected from MongoDB');
    mongoose.disconnect();
  }
}

// Chạy tạo test
createTestFlashSale(); 