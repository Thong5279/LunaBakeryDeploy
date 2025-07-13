const mongoose = require('mongoose');

// Đảm bảo các model được load
require('./Product');
require('./Ingredient');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Product', 'Ingredient'],
        default: 'Product'
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
        enum: ['pending', 'approved', 'rejected', 'hidden'],
        default: 'approved'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Thêm options để đảm bảo populate hoạt động đúng
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Tạo index cho việc tìm kiếm review
reviewSchema.index({ product: 1, itemType: 1, status: 1 });
reviewSchema.index({ order: 1 });

// Tạo index unique để đảm bảo mỗi sản phẩm chỉ được đánh giá một lần trong một đơn hàng
reviewSchema.index({ user: 1, product: 1, order: 1, itemType: 1 }, { 
    unique: true,
    name: 'unique_review_per_order'
});

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

        // Kiểm tra sản phẩm có trong đơn hàng, xét cả productId và itemType
        const orderItem = order.orderItems.find(item => {
            const itemType = item.itemType || 'Product';
            return item.productId.toString() === this.product.toString() && 
                   itemType === this.itemType;
        });

        if (!orderItem) {
            throw new Error(`${this.itemType === 'Product' ? 'Sản phẩm' : 'Nguyên liệu'} không có trong đơn hàng này`);
        }

        // Kiểm tra sản phẩm/nguyên liệu tồn tại
        const Model = mongoose.model(this.itemType);
        const product = await Model.findById(this.product);
        if (!product) {
            throw new Error(`${this.itemType === 'Product' ? 'Sản phẩm' : 'Nguyên liệu'} không tồn tại`);
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Middleware để cập nhật rating trung bình của sản phẩm/nguyên liệu
reviewSchema.post('save', async function() {
    try {
        const Model = mongoose.model(this.itemType);
        
        // Tính rating trung bình mới
        const stats = await this.constructor.aggregate([
            {
                $match: { 
                    product: this.product, 
                    status: 'approved',
                    itemType: this.itemType
                }
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
            await Model.findByIdAndUpdate(this.product, {
                rating: Math.round(stats[0].avgRating * 10) / 10,
                numReviews: stats[0].numReviews
            });
        } else {
            await Model.findByIdAndUpdate(this.product, {
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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 