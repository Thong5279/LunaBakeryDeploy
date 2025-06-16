const mongoose = require("mongoose");

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
  },
  discountPrice: {
    type: Number,
  },
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
  },
  sizes: {
    type: [String],
  },
  flavors: {
    type: [String],
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