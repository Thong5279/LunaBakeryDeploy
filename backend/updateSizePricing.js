const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const updateAllProductsSizePricing = async () => {
    try {
        console.log('🔄 Đang cập nhật sizePricing cho tất cả sản phẩm...');
        
        // Lấy tất cả sản phẩm chưa có sizePricing hoặc sizePricing rỗng
        const products = await Product.find({
            $or: [
                { sizePricing: { $exists: false } },
                { sizePricing: { $size: 0 } }
            ]
        });

        console.log(`📦 Tìm thấy ${products.length} sản phẩm cần cập nhật sizePricing`);

        let updatedCount = 0;

        for (const product of products) {
            if (product.sizes && product.sizes.length > 0) {
                const basePrice = product.discountPrice || product.price;
                const sizePricing = [];
                
                product.sizes.forEach((size, index) => {
                    sizePricing.push({
                        size: size,
                        price: basePrice + (index * 50000), // Mỗi size tăng 50k
                        discountPrice: basePrice + (index * 50000)
                    });
                });

                product.sizePricing = sizePricing;
                await product.save();
                
                console.log(`✅ Đã cập nhật sizePricing cho: ${product.name} (${product.sku})`);
                console.log(`   Sizes: ${product.sizes.join(', ')}`);
                console.log(`   Prices: ${sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
                updatedCount++;
            } else {
                console.log(`⚠️  Bỏ qua ${product.name} - không có sizes`);
            }
        }

        console.log(`\n🎉 Hoàn thành! Đã cập nhật ${updatedCount}/${products.length} sản phẩm`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi cập nhật sizePricing:', error);
        process.exit(1);
    }
};

updateAllProductsSizePricing(); 