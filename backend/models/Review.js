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
        required: false,
        maxlength: [500, 'Nội dung đánh giá không được quá 500 ký tự']
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        altText: String
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Đảm bảo mỗi user chỉ đánh giá một sản phẩm một lần trong một đơn hàng
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

// Middleware để validate đơn hàng trước khi cho phép đánh giá
reviewSchema.pre('save', async function(next) {
    try {
        // Kiểm tra đơn hàng có tồn tại và đã giao thành công
        const order = await mongoose.model('Order').findById(this.order);
        if (!order) {
            throw new Error('Đơn hàng không tồn tại');
        }
        if (order.status !== 'delivered') {
            throw new Error('Chỉ được đánh giá sau khi đơn hàng đã giao thành công');
        }

        // Kiểm tra sản phẩm có trong đơn hàng
        const productInOrder = order.orderItems.some(item => 
            item.productId.toString() === this.product.toString()
        );
        if (!productInOrder) {
            throw new Error('Sản phẩm không có trong đơn hàng này');
        }

        // Kiểm tra thời gian đánh giá (trong vòng 30 ngày sau khi giao hàng)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (order.deliveredAt < thirtyDaysAgo) {
            throw new Error('Thời gian đánh giá đã hết hạn (30 ngày sau khi giao hàng)');
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Middleware để cập nhật rating trung bình của sản phẩm
reviewSchema.post('save', async function() {
    try {
        const Product = mongoose.model('Product');
        
        // Tính rating trung bình mới
        const stats = await this.constructor.aggregate([
            {
                $match: { product: this.product, status: 'approved' }
            },
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
                rating: Math.round(stats[0].avgRating * 10) / 10, // Làm tròn 1 chữ số thập phân
                numReviews: stats[0].numReviews
            });
        } else {
            await Product.findByIdAndUpdate(this.product, {
                rating: 0,
                numReviews: 0
            });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật rating:', error);
    }
});

// Middleware để xóa rating khi xóa review
reviewSchema.post('remove', async function() {
    try {
        await this.constructor.post('save').apply(this);
    } catch (error) {
        console.error('Lỗi khi cập nhật rating sau khi xóa review:', error);
    }
});

module.exports = mongoose.model('Review', reviewSchema); 