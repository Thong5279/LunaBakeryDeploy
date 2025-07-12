const mongoose = require('mongoose');
require('dotenv').config();

async function fixReviewItemTypeSimple() {
    try {
        console.log('Kết nối MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB\n');

        // Cập nhật trực tiếp bằng updateMany
        const ingredientIds = [
            '686d2db5f536995f0bcda744',
            '686d2eccf536995f0bcda777'
        ];

        for (const id of ingredientIds) {
            const result = await mongoose.connection.db.collection('reviews').updateMany(
                { product: new mongoose.Types.ObjectId(id) },
                { $set: { itemType: 'Ingredient' } }
            );
            console.log(`Cập nhật ${result.modifiedCount} review cho nguyên liệu ${id}`);
        }

        // Kiểm tra kết quả
        const reviews = await mongoose.connection.db.collection('reviews').find({}).toArray();
        console.log('\nDanh sách reviews sau khi cập nhật:');
        reviews.forEach(review => {
            console.log(`- ${review._id}: itemType = ${review.itemType}, product = ${review.product}`);
        });

        console.log('\nHoàn tất!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
}

fixReviewItemTypeSimple(); 