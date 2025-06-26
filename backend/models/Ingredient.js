const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên nguyên liệu là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tên nguyên liệu không được quá 100 ký tự']
    },
    description: {
      type: String,
      required: [true, 'Mô tả nguyên liệu là bắt buộc'],
      trim: true,
      maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
    },
    category: {
      type: String,
      required: [true, 'Danh mục là bắt buộc'],
      enum: [
        'Bột các loại',
        'Đường và chất ngọt',
        'Sữa và kem',
        'Trứng và sản phẩm từ trứng',
        'Trái cây tươi và đông lạnh',
        'Chocolate và cacao',
        'Hương liệu và phẩm màu',
        'Dụng cụ nướng bánh',
        'Khuôn bánh và dụng cụ tạo hình',
        'Hộp đựng và bao bì',
        'Nguyên liệu trang trí',
        'Chất bảo quản và phụ gia'
      ]
    },
    price: {
      type: Number,
      required: [true, 'Giá bán là bắt buộc'],
      min: [0, 'Giá bán không được âm']
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Giá giảm không được âm'],
      validate: {
        validator: function(value) {
          return value <= this.price;
        },
        message: 'Giá giảm không được lớn hơn giá gốc'
      }
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng là bắt buộc'],
      min: [0, 'Số lượng không được âm'],
      default: 0
    },
    unit: {
      type: String,
      required: [true, 'Đơn vị đo lường là bắt buộc'],
      enum: ['kg', 'g', 'lít', 'ml', 'hộp', 'túi', 'chai', 'chiếc', 'bộ', 'gói', 'thùng', 'tá']
    },
    sku: {
      type: String,
      required: [true, 'Mã sản phẩm (SKU) là bắt buộc'],
      unique: true,
      trim: true,
      uppercase: true
    },
    images: [{
      type: String,
      validate: {
        validator: function(url) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        },
        message: 'URL hình ảnh không hợp lệ'
      }
    }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    supplier: {
      type: String,
      trim: true,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Ghi chú không được quá 500 ký tự'],
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual để tính toán trạng thái hết hàng
ingredientSchema.virtual('isOutOfStock').get(function() {
  return this.quantity === 0;
});

// Virtual để tính toán trạng thái sắp hết hàng (còn ít hơn 10 đơn vị)
ingredientSchema.virtual('isLowStock').get(function() {
  return this.quantity > 0 && this.quantity <= 10;
});

// Virtual để hiển thị giá có định dạng
ingredientSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('vi-VN').format(this.price);
});

// Virtual để hiển thị giá giảm có định dạng
ingredientSchema.virtual('formattedDiscountPrice').get(function() {
  return this.discountPrice > 0 ? new Intl.NumberFormat('vi-VN').format(this.discountPrice) : null;
});

// Index để tìm kiếm nhanh
ingredientSchema.index({ name: 'text', description: 'text', category: 1 });
ingredientSchema.index({ sku: 1 });
ingredientSchema.index({ category: 1, status: 1 });

// Middleware để tạo SKU tự động nếu không có
ingredientSchema.pre('save', function(next) {
  if (!this.sku) {
    const categoryPrefix = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `${categoryPrefix}${timestamp}`;
  }
  next();
});

module.exports = mongoose.model('Ingredient', ingredientSchema); 