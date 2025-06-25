const mongoose = require("mongoose");
const { PRODUCT_CATEGORIES, PRODUCT_FLAVORS, PRODUCT_SIZES } = require('../constants/productConstants');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    // Đây sẽ là giá base, giá theo size sẽ được tính từ đây
  },
  discountPrice: {
    type: Number,
  },
  sizePricing: [{
    size: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    discountPrice: {
      type: Number
    }
  }],
  countInStock: {
    //kiểm tra hàng còn hay không
    type: Number,
    required: true,
    default: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: PRODUCT_CATEGORIES,
  },
  sizes: {
    type: [String],
    validate: {
      validator: function(sizes) {
        // Cho phép custom sizes ngoài danh sách có sẵn
        return true;
      }
    }
  },
  flavors: {
    type: [String],
    validate: {
      validator: function(flavors) {
        // Cho phép custom flavors ngoài danh sách có sẵn
        return true;
      }
    }
  },
  images: [
    {
     url: {
        type: String,
        required: true,
     },
     altText: {
        type: String,
        
     },
    },
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },
  tags:[String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  metaTitle: {
    type: String,
    required: false,
  },
  metaKeywords: {
    type: String,
    required: false,
  },

},
    { timestamps: true,} // Thêm trường createdAt và updatedAt}
);

module.exports = mongoose.model("Product", productSchema);