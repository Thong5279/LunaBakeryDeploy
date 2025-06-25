const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

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

const updateAllProductsSizePricing = async () => {
    try {
        console.log('🔄 Đang cập nhật sizePricing cho tất cả sản phẩm...');
        
        // Lấy tất cả sản phẩm có sizePricing (để cập nhật lại)
        const products = await Product.find({
            sizes: { $exists: true, $ne: [] }
        });

        console.log(`📦 Tìm thấy ${products.length} sản phẩm cần cập nhật sizePricing`);

        let updatedCount = 0;

        for (const product of products) {
            if (product.sizes && product.sizes.length > 0) {
                const basePrice = product.discountPrice || product.price;
                const sizePricing = [];
                
                // Xác định increment cho sản phẩm này dựa vào size đầu tiên
                const increment = getSizeIncrement(product.sizes[0]);
                
                product.sizes.forEach((size, index) => {
                    sizePricing.push({
                        size: size,
                        price: basePrice + (index * increment),
                        discountPrice: basePrice + (index * increment)
                    });
                });

                product.sizePricing = sizePricing;
                await product.save();
                
                console.log(`✅ Đã cập nhật sizePricing cho: ${product.name} (${product.sku})`);
                console.log(`   Sizes: ${product.sizes.join(', ')}`);
                console.log(`   Increment: ${increment.toLocaleString()}₫`);
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