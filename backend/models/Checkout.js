const mongoose = require('mongoose');

const checkoutItemSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'checkoutItems.itemType' // Dynamic reference
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    size: String,      // Nếu sản phẩm có size
    flavor: String,    // Nếu sản phẩm có hương vị
    itemType: {        // Phân biệt Product vs Ingredient  
        type: String,
        enum: ['Product', 'Ingredient'],
        default: 'Product'
    }

},
{ _id: false } // Không tạo _id riêng cho từng item
);

const checkoutSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    checkoutItems: [checkoutItemSchema],
    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phonenumber: {
            type: String,
        },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,       
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed, // Lưu thông tin thanh toán tùy chỉnh (ví dụ: từ Stripe, PayPal, v.v.)
        default: {}
    },
    isFinalized: {
        type: Boolean,
        default: false
    },
    isFinalizedAt: {
        type: Date,
    },
},
{ timestamps: true } // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model('Checkout', checkoutSchema);