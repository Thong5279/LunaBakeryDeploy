const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  name: String,
  image: String,
  price: Number,
    
  quantity: {
    type: Number,
    default: 1,
  },
  size: String,      // Nếu sản phẩm có size
  flavor: String     // Nếu sản phẩm có hương vị
},
    {_id: false} // Không tạo _id riêng cho từng item
);

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestId: { //khách vãn lai
    type: String, // Dùng cho khách hàng không đăng nhập
  },
  products: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
},
{timestamps: true, } // Tự động thêm createdAt và updatedAt

);
module.exports = mongoose.model('Cart', cartSchema);
