const mongoose = require("mongoose");

const flashSaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'inactive',
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    soldQuantity: {
      type: Number,
      default: 0,
    },
  }],
  ingredients: [{
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    soldQuantity: {
      type: Number,
      default: 0,
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index để tối ưu query
flashSaleSchema.index({ startDate: 1, endDate: 1, status: 1 });
flashSaleSchema.index({ 'products.productId': 1 });
flashSaleSchema.index({ 'ingredients.ingredientId': 1 });

// Middleware để tự động cập nhật status
flashSaleSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.startDate <= now && this.endDate >= now) {
    this.status = 'active';
  } else if (this.endDate < now) {
    this.status = 'expired';
  } else {
    this.status = 'inactive';
  }
  
  next();
});

// Method để kiểm tra flash sale có đang hoạt động không
flashSaleSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now && this.status === 'active';
};

// Method để tính giá sau khi giảm giá
flashSaleSchema.methods.calculateSalePrice = function(originalPrice) {
  if (this.discountType === 'percentage') {
    return originalPrice * (1 - this.discountValue / 100);
  } else {
    return Math.max(0, originalPrice - this.discountValue);
  }
};

module.exports = mongoose.model("FlashSale", flashSaleSchema); 