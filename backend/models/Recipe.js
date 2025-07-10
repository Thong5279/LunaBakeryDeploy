const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên công thức là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên công thức không được quá 100 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Mô tả công thức là bắt buộc'],
    trim: true,
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  instructions: {
    type: String,
    required: [true, 'Hướng dẫn làm bánh là bắt buộc'],
    trim: true
  },
  image: {
    url: {
      type: String,
      required: [true, 'Hình ảnh công thức là bắt buộc']
    },
    altText: {
      type: String,
      default: ''
    }
  },
  category: {
    type: String,
    enum: [
      'Bánh ngọt',
      'Bánh mặn', 
      'Bánh kem',
      'Bánh cupcake',
      'Bánh tart',
      'Bánh cookies',
      'Bánh muffin',
      'Bánh tiramisu',
      'Bánh cheesecake',
      'Khác'
    ],
    default: 'Khác'
  },
  difficulty: {
    type: String,
    required: [true, 'Độ khó là bắt buộc'],
    enum: ['Dễ', 'Trung bình', 'Khó'],
    default: 'Trung bình'
  },
  preparationTime: {
    type: Number,
    min: [1, 'Thời gian chuẩn bị phải ít nhất 1 phút'],
    default: 30
  },
  cookingTime: {
    type: Number,
    required: [true, 'Thời gian nướng là bắt buộc'],
    min: [1, 'Thời gian nướng phải ít nhất 1 phút']
  },
  servings: {
    type: Number,
    required: [true, 'Số phần ăn là bắt buộc'],
    min: [1, 'Số phần ăn phải ít nhất 1']
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      required: true,
      trim: true
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index để tối ưu truy vấn
recipeSchema.index({ name: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ status: 1 });
recipeSchema.index({ createdBy: 1 });
recipeSchema.index({ createdAt: -1 });

// Virtual để tính tổng thời gian
recipeSchema.virtual('totalTime').get(function() {
  return (this.preparationTime || 0) + this.cookingTime;
});

// Middleware để cập nhật publishedAt khi isPublished thay đổi
recipeSchema.pre('save', function(next) {
  if (this.isModified('isPublished')) {
    if (this.isPublished && !this.publishedAt) {
      this.publishedAt = new Date();
    } else if (!this.isPublished) {
      this.publishedAt = null;
    }
  }
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema); 