const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Đảm bảo mỗi user chỉ đánh giá một sản phẩm một lần trong một đơn hàng
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

// Middleware để cập nhật rating trung bình của sản phẩm
reviewSchema.post('save', async function() {
    const Review = this.constructor;
    const Product = mongoose.model('Product');
    
    // Tính rating trung bình
    const stats = await Review.aggregate([
        { $match: { product: this.product } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.product, {
            rating: Math.round(stats[0].avgRating * 10) / 10, // Làm tròn đến 1 chữ số thập phân
            numReviews: stats[0].numReviews
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema); 