const mongoose = require('mongoose');
require('dotenv').config();

// Import models
require('./models/Product');
require('./models/Ingredient');
require('./models/Order');
require('./models/Review');

const Product = mongoose.model('Product');
const Ingredient = mongoose.model('Ingredient');
const Order = mongoose.model('Order');
const Review = mongoose.model('Review');

async function checkReviewData() {
    try {
        console.log('Kết nối MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB\n');

        // Lấy tất cả review
        const reviews = await Review.find({}).lean();
        console.log(`Tìm thấy ${reviews.length} reviews:`);

        for (const review of reviews) {
            console.log(`\nReview ID: ${review._id}`);
            console.log(`Product ID: ${review.product}`);
            console.log(`Item Type: ${review.itemType}`);
            console.log(`Rating: ${review.rating}`);
            console.log(`Comment: ${review.comment}`);

            // Kiểm tra product tồn tại
            let product = null;
            if (review.itemType === 'Product') {
                product = await Product.findById(review.product).lean();
            } else if (review.itemType === 'Ingredient') {
                product = await Ingredient.findById(review.product).lean();
            }

            if (product) {
                console.log(`✅ ${review.itemType} tồn tại: ${product.name}`);
            } else {
                console.log(`❌ ${review.itemType} KHÔNG tồn tại`);
                
                // Tìm sản phẩm/nguyên liệu có ID gần nhất
                if (review.itemType === 'Product') {
                    const allProducts = await Product.find({}).select('_id name').lean();
                    console.log('Các sản phẩm có sẵn:');
                    allProducts.slice(0, 5).forEach(p => console.log(`  - ${p._id}: ${p.name}`));
                } else {
                    const allIngredients = await Ingredient.find({}).select('_id name').lean();
                    console.log('Các nguyên liệu có sẵn:');
                    allIngredients.slice(0, 5).forEach(i => console.log(`  - ${i._id}: ${i.name}`));
                }
            }
        }

        // Kiểm tra populate
        console.log('\n=== Test Populate ===');
        const populatedReviews = await Review.find({})
            .populate('user', 'name')
            .populate('product', 'name')
            .lean();

        console.log('Reviews sau khi populate:');
        populatedReviews.forEach(review => {
            console.log(`- ${review._id}: product = ${review.product?.name || 'NULL'}, itemType = ${review.itemType}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
}

checkReviewData(); 