const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
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
    size : String,      // Nếu sản phẩm có size
    flavor : String,    // Nếu sản phẩm có hương vị
    quantity: {
        type: Number,
       required: true
    }
},
{ _id: false } // Không tạo _id riêng cho từng item
);

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [orderItemSchema],  
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
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: 'Pending'
    },
    status : {
        type: String,
        enum: [ 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing',
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);