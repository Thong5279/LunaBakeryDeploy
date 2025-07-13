const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'items.itemType',
      required: true
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Product', 'Ingredient']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index để tối ưu query
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ 'items.productId': 1 });

// Middleware để đảm bảo không có item trùng lặp
wishlistSchema.pre('save', function(next) {
  const seen = new Set();
  this.items = this.items.filter(item => {
    const key = `${item.productId}-${item.itemType}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema); 