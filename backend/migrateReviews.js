const mongoose = require('mongoose');
require('dotenv').config();

// Import models
require('./models/Product');
require('./models/Ingredient');
require('./models/Order');
require('./models/Review');

const Order = mongoose.model('Order');
const Review = mongoose.model('Review');

async function migrateReviews() {
    try {
        console.log('Kết nối MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB');

        // Lấy tất cả đơn hàng
        const orders = await Order.find({});
        console.log(`Tìm thấy ${orders.length} đơn hàng`);

        // Thêm itemType cho các orderItems chưa có
        for (const order of orders) {
            let modified = false;
            for (const item of order.orderItems) {
                if (!item.itemType) {
                    item.itemType = 'Product';
                    modified = true;
                }
            }
            if (modified) {
                await order.save();
                console.log(`Đã cập nhật itemType cho đơn hàng ${order._id}`);
            }
        }

        // Lấy tất cả review
        const reviews = await Review.find({});
        console.log(`Tìm thấy ${reviews.length} đánh giá`);

        // Cập nhật itemType cho các review
        for (const review of reviews) {
            const order = await Order.findById(review.order);
            if (order) {
                const orderItem = order.orderItems.find(item => 
                    item.productId.toString() === review.product.toString()
                );
                if (orderItem && !review.itemType) {
                    review.itemType = orderItem.itemType || 'Product';
                    await review.save();
                    console.log(`Đã cập nhật itemType cho review ${review._id}`);
                }
            }
        }

        console.log('Migration hoàn tất');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi migrate:', error);
        process.exit(1);
    }
}

migrateReviews(); 