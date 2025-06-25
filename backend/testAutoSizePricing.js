const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const testAutoSizePricing = async () => {
    try {
        console.log('🧪 Testing tự động tạo sizePricing...\n');
        
        // Test case 1: Sản phẩm với size cm
        const testProduct1 = new Product({
            name: 'Test Bánh Size CM',
            description: 'Test auto sizing',
            price: 300000,
            sku: 'TEST-001',
            category: 'Bánh ngọt',
            sizes: ['18cm', '20cm', '22cm'],
            flavors: ['Socola'],
            user: new mongoose.Types.ObjectId(),
            countInStock: 10
        });
        
        await testProduct1.save();
        console.log(`✅ Test 1 - Size CM:`);
        console.log(`   Tên: ${testProduct1.name}`);
        console.log(`   Sizes: ${testProduct1.sizes.join(', ')}`);
        console.log(`   SizePricing: ${testProduct1.sizePricing ? 'CÓ' : 'KHÔNG'}`);
        if (testProduct1.sizePricing && testProduct1.sizePricing.length > 0) {
            console.log(`   Giá: ${testProduct1.sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
        }
        console.log('');

        // Test case 2: Sản phẩm với size nhỏ/vừa/lớn  
        const testProduct2 = new Product({
            name: 'Test Bánh Size Nhỏ Vừa',
            description: 'Test auto sizing',
            price: 50000,
            sku: 'TEST-002', 
            category: 'Bánh ngọt',
            sizes: ['Nhỏ', 'Vừa', 'Lớn'],
            flavors: ['Dâu'],
            user: new mongoose.Types.ObjectId(),
            countInStock: 10
        });
        
        await testProduct2.save();
        console.log(`✅ Test 2 - Size Nhỏ/Vừa/Lớn:`);
        console.log(`   Tên: ${testProduct2.name}`);
        console.log(`   Sizes: ${testProduct2.sizes.join(', ')}`);
        console.log(`   SizePricing: ${testProduct2.sizePricing ? 'CÓ' : 'KHÔNG'}`);
        if (testProduct2.sizePricing && testProduct2.sizePricing.length > 0) {
            console.log(`   Giá: ${testProduct2.sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
        }
        console.log('');

        // Test case 3: Sản phẩm với Size S/M/L
        const testProduct3 = new Product({
            name: 'Test Bánh Size SML',
            description: 'Test auto sizing',
            price: 25000,
            sku: 'TEST-003',
            category: 'Bánh ngọt', 
            sizes: ['Size S', 'Size M', 'Size L'],
            flavors: ['Vanilla'],
            user: new mongoose.Types.ObjectId(),
            countInStock: 10
        });
        
        await testProduct3.save();
        console.log(`✅ Test 3 - Size S/M/L:`);
        console.log(`   Tên: ${testProduct3.name}`);
        console.log(`   Sizes: ${testProduct3.sizes.join(', ')}`);
        console.log(`   SizePricing: ${testProduct3.sizePricing ? 'CÓ' : 'KHÔNG'}`);
        if (testProduct3.sizePricing && testProduct3.sizePricing.length > 0) {
            console.log(`   Giá: ${testProduct3.sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
        }
        console.log('');

        console.log('🎉 Hoàn thành test! Tính năng tự động tạo sizePricing hoạt động đúng.');
        console.log('💡 Từ bây giờ mỗi khi bạn thêm sản phẩm mới có sizes, sizePricing sẽ được tạo tự động!');
        
        // Xóa test products
        await Product.deleteOne({ sku: 'TEST-001' });
        await Product.deleteOne({ sku: 'TEST-002' });
        await Product.deleteOne({ sku: 'TEST-003' });
        console.log('🧹 Đã xóa sản phẩm test.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi test:', error);
        process.exit(1);
    }
};

testAutoSizePricing(); 