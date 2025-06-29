const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  // Thông tin sản phẩm
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productType: {
    type: String,
    enum: ['product', 'ingredient'],
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  
  // Thông tin kho
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    default: 10
  },
  maximumStock: {
    type: Number,
    required: true,
    default: 1000
  },
  
  // Giá nhập và bán
  purchasePrice: {
    type: Number,
    required: true,
    default: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Lịch sử giao dịch kho
  transactions: [{
    type: {
      type: String,
      enum: ['import', 'export', 'adjustment', 'return'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Thông tin cảnh báo
  alertLowStock: {
    type: Boolean,
    default: true
  },
  alertExpiry: {
    type: Boolean,
    default: true
  },
  
  // Thông tin hạn sử dụng (nếu có)
  expiryDate: {
    type: Date,
    default: null
  },
  
  // Ngày nhập cuối cùng và bán cuối cùng
  lastImportDate: {
    type: Date,
    default: Date.now
  },
  lastSaleDate: {
    type: Date,
    default: null
  },
  
  // Tính toán số ngày tồn kho
  daysInStock: {
    type: Number,
    default: 0
  },
  
  // Trạng thái
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  
  // Vị trí trong kho
  location: {
    type: String,
    default: ''
  },
  
  // Nhà cung cấp
  supplier: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index để tối ưu truy vấn
inventorySchema.index({ productId: 1, productType: 1 });
inventorySchema.index({ currentStock: 1 });
inventorySchema.index({ lastSaleDate: 1 });
inventorySchema.index({ status: 1 });

// Middleware tính toán daysInStock trước khi lưu
inventorySchema.pre('save', function(next) {
  if (this.lastImportDate) {
    const now = new Date();
    const importDate = new Date(this.lastImportDate);
    this.daysInStock = Math.floor((now - importDate) / (1000 * 60 * 60 * 24));
  }
  next();
});

// Method để thêm giao dịch kho
inventorySchema.methods.addTransaction = function(transactionData) {
  this.transactions.push(transactionData);
  
  // Cập nhật stock dựa trên loại giao dịch
  if (transactionData.type === 'import' || transactionData.type === 'return') {
    this.currentStock += transactionData.quantity;
    this.lastImportDate = new Date();
  } else if (transactionData.type === 'export') {
    this.currentStock -= transactionData.quantity;
    this.lastSaleDate = new Date();
  } else if (transactionData.type === 'adjustment') {
    this.currentStock = transactionData.quantity;
  }
  
  // Đảm bảo stock không âm
  if (this.currentStock < 0) {
    this.currentStock = 0;
  }
};

// Method để kiểm tra cần cảnh báo
inventorySchema.methods.needsAlert = function() {
  const alerts = [];
  
  // Cảnh báo hết hàng
  if (this.alertLowStock && this.currentStock <= this.minimumStock) {
    alerts.push({
      type: 'low_stock',
      message: `Sản phẩm ${this.productName} sắp hết hàng (còn ${this.currentStock})`
    });
  }
  
  // Cảnh báo tồn kho lâu (trên 30 ngày không bán)
  if (this.lastSaleDate) {
    const daysSinceLastSale = Math.floor((new Date() - new Date(this.lastSaleDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceLastSale > 30) {
      alerts.push({
        type: 'slow_moving',
        message: `Sản phẩm ${this.productName} tồn kho ${daysSinceLastSale} ngày không bán`
      });
    }
  }
  
  // Cảnh báo hạn sử dụng (nếu có)
  if (this.expiryDate && this.alertExpiry) {
    const daysToExpiry = Math.floor((new Date(this.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysToExpiry <= 7 && daysToExpiry > 0) {
      alerts.push({
        type: 'expiring_soon',
        message: `Sản phẩm ${this.productName} sắp hết hạn trong ${daysToExpiry} ngày`
      });
    } else if (daysToExpiry <= 0) {
      alerts.push({
        type: 'expired',
        message: `Sản phẩm ${this.productName} đã hết hạn`
      });
    }
  }
  
  return alerts;
};

// Static method để lấy thống kê tổng quan
inventorySchema.statics.getStatistics = async function() {
  const totalItems = await this.countDocuments({ status: 'active' });
  const lowStockItems = await this.countDocuments({ 
    status: 'active',
    $expr: { $lte: ['$currentStock', '$minimumStock'] }
  });
  
  const slowMovingItems = await this.countDocuments({
    status: 'active',
    lastSaleDate: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });
  
  const expiredItems = await this.countDocuments({
    status: 'active',
    expiryDate: { $lt: new Date() }
  });
  
  const totalValue = await this.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: null, total: { $sum: { $multiply: ['$currentStock', '$sellingPrice'] } } } }
  ]);
  
  return {
    totalItems,
    lowStockItems,
    slowMovingItems,
    expiredItems,
    totalValue: totalValue[0]?.total || 0
  };
};

module.exports = mongoose.model('Inventory', inventorySchema); 