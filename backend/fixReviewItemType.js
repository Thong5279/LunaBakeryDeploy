const mongoose = require('mongoose');
require('dotenv').config();

// Import models
require('./models/Product');
require('./models/Ingredient');
require('./models/Order');
require('./models/Review');

const Product = mongoose.model('Product');
const Ingredient = mongoose.model('Ingredient');
const Review = mongoose.model('Review');

async function fixReviewItemType() {
    try {
        console.log('Kết nối MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB\n');

        // Lấy tất cả review
        const reviews = await Review.find({});
        console.log(`Tìm thấy ${reviews.length} reviews`);

        for (const review of reviews) {
            console.log(`\nXử lý Review ID: ${review._id}`);
            console.log(`Product ID: ${review.product}`);
            console.log(`Item Type hiện tại: ${review.itemType}`);

            // Kiểm tra xem product ID có tồn tại trong Product collection không
            const productExists = await Product.findById(review.product).lean();
            
            // Kiểm tra xem product ID có tồn tại trong Ingredient collection không
            const ingredientExists = await Ingredient.findById(review.product).lean();

            if (productExists && !ingredientExists) {
                // Là sản phẩm
                if (review.itemType !== 'Product') {
                    review.itemType = 'Product';
                    await review.save();
                    console.log(`✅ Cập nhật itemType thành 'Product' cho ${productExists.name}`);
                } else {
                    console.log(`✅ Đã đúng itemType 'Product' cho ${productExists.name}`);
                }
            } else if (ingredientExists && !productExists) {
                // Là nguyên liệu
                if (review.itemType !== 'Ingredient') {
                    review.itemType = 'Ingredient';
                    await review.save();
                    console.log(`✅ Cập nhật itemType thành 'Ingredient' cho ${ingredientExists.name}`);
                } else {
                    console.log(`✅ Đã đúng itemType 'Ingredient' cho ${ingredientExists.name}`);
                }
            } else if (productExists && ingredientExists) {
                console.log(`⚠️ ID ${review.product} tồn tại ở cả Product và Ingredient`);
            } else {
                console.log(`❌ ID ${review.product} không tồn tại ở cả Product và Ingredient`);
                
                // Tìm ID tương tự
                const similarProducts = await Product.find({
                    _id: { $regex: review.product.toString().substring(0, 10) }
                }).limit(3).lean();
                
                const similarIngredients = await Ingredient.find({
                    _id: { $regex: review.product.toString().substring(0, 10) }
                }).limit(3).lean();

                if (similarProducts.length > 0) {
                    console.log('Sản phẩm tương tự:');
                    similarProducts.forEach(p => console.log(`  - ${p._id}: ${p.name}`));
                }
                
                if (similarIngredients.length > 0) {
                    console.log('Nguyên liệu tương tự:');
                    similarIngredients.forEach(i => console.log(`  - ${i._id}: ${i.name}`));
                }
            }
        }

        console.log('\n=== Kiểm tra lại sau khi sửa ===');
        const updatedReviews = await Review.find({})
            .populate('user', 'name')
            .populate('product', 'name');

        updatedReviews.forEach(review => {
            console.log(`- ${review._id}: ${review.product?.name || 'NULL'} (${review.itemType})`);
        });

        console.log('\nHoàn tất sửa lỗi!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
}

fixReviewItemType(); 