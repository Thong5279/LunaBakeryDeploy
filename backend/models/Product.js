const mongoose = require("mongoose");
const { PRODUCT_CATEGORIES, PRODUCT_FLAVORS, PRODUCT_SIZES } = require('../constants/productConstants');

// Hàm helper để tự động tạo sizePricing
const generateSizePricing = (sizes, basePrice) => {
  if (!sizes || sizes.length === 0) {
      return [];
  }

  // Hàm xác định increment cho từng loại size
  const getSizeIncrement = (size) => {
      const sizeStr = size.toLowerCase();
      
      // Size nhỏ, vừa, lớn - cách nhau 10,000
      if (sizeStr.includes('nhỏ') || sizeStr.includes('vừa') || sizeStr.includes('lớn')) {
          return 10000;
      }
      
      // Size S, M, L - cách nhau 5,000
      if (sizeStr === 's' || sizeStr === 'm' || sizeStr === 'l' || 
          sizeStr === 'size s' || sizeStr === 'size m' || sizeStr === 'size l') {
          return 5000;
      }
      
      // Các size khác (18cm, 20cm, 22cm...) - cách nhau 50,000
      return 50000;
  };

  const increment = getSizeIncrement(sizes[0]);
  const sizePricing = [];

  sizes.forEach((size, index) => {
      sizePricing.push({
          size: size,
          price: basePrice + (index * increment),
          discountPrice: basePrice + (index * increment)
      });
  });

  return sizePricing;
};

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

// Pre-save hook để tự động tạo sizePricing
productSchema.pre('save', function(next) {
  // Chỉ tạo sizePricing nếu có sizes và chưa có sizePricing hoặc sizePricing rỗng
  if (this.sizes && this.sizes.length > 0 && 
      (!this.sizePricing || this.sizePricing.length === 0)) {
    
    const basePrice = this.discountPrice || this.price;
    this.sizePricing = generateSizePricing(this.sizes, basePrice);
    
    console.log(`✅ [Model] Tự động tạo sizePricing cho: ${this.name}`);
    console.log(`   Sizes: ${this.sizes.join(', ')}`);
    console.log(`   Prices: ${this.sizePricing.map(sp => `${sp.size}: ${sp.price.toLocaleString()}₫`).join(', ')}`);
  }
  
  next();
});

module.exports = mongoose.model("Product", productSchema);