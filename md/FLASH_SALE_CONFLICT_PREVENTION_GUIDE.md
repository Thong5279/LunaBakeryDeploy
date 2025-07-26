# 🚀 Flash Sale Conflict Prevention & Auto Cleanup Guide

## 📋 Tổng Quan

Hệ thống flash sale đã được nâng cấp với các tính năng mới để đảm bảo tính nhất quán và tránh xung đột:

1. **Ngăn chặn xung đột sản phẩm**: Một sản phẩm chỉ được phép sale trong một khung thời gian nhất định
2. **Tự động cleanup**: Xóa sản phẩm flash sale khỏi giỏ hàng khi flash sale kết thúc
3. **Kiểm tra thời gian**: Đảm bảo không có flash sale trùng lặp

## 🔧 Các Tính Năng Mới

### 1. Kiểm Tra Xung Đột Sản Phẩm

**Backend Route**: `POST /api/flash-sales`
- Kiểm tra sản phẩm đã có flash sale trong khoảng thời gian
- Trả về lỗi chi tiết nếu có xung đột
- Ngăn chặn tạo flash sale trùng lặp

**Logic Kiểm Tra**:
```javascript
// Kiểm tra flash sale hiện tại hoặc sắp diễn ra
const existingFlashSale = await FlashSale.findOne({
  'products.productId': product.productId,
  $or: [
    { status: 'active' },
    { 
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) }
    }
  ]
});
```

### 2. Lọc Sản Phẩm Khả Dụng

**Backend Route**: `GET /api/flash-sales/items/available`
- Tự động loại bỏ sản phẩm đã có flash sale
- Chỉ hiển thị sản phẩm có thể chọn
- Tham số: `startDate`, `endDate`

**Frontend Validation**:
- Yêu cầu chọn thời gian trước khi tìm kiếm sản phẩm
- Hiển thị thông báo lỗi chi tiết nếu có xung đột

### 3. Tự Động Cleanup Giỏ Hàng

**Backend Routes**:
- `POST /api/flash-sales/:id/cleanup-cart`: Cleanup cho flash sale cụ thể
- `POST /api/flash-sales/cleanup-expired`: Cleanup tất cả flash sale đã kết thúc

**Logic Cleanup**:
```javascript
// Tìm giỏ hàng có sản phẩm flash sale
const cartsWithFlashSaleItems = await Cart.find({
  $or: [
    { 'items.productId': { $in: flashSaleProductIds } },
    { 'items.ingredientId': { $in: flashSaleIngredientIds } }
  ]
});

// Xóa sản phẩm flash sale khỏi giỏ hàng
cart.items = cart.items.filter(item => {
  const isFlashSaleProduct = flashSaleProductIds.includes(item.productId?.toString());
  const isFlashSaleIngredient = flashSaleIngredientIds.includes(item.ingredientId?.toString());
  
  if (isFlashSaleProduct || isFlashSaleIngredient) {
    return false; // Xóa item này
  }
  return true; // Giữ lại item này
});
```

### 4. Script Tự Động Cleanup

**File**: `backend/cleanupFlashSales.js`
- Chạy tự động để cleanup flash sale đã kết thúc
- Cập nhật status thành 'expired'
- Xóa sản phẩm flash sale khỏi giỏ hàng

## 🎯 Cách Sử Dụng

### 1. Tạo Flash Sale Mới

1. **Chọn thời gian**: Điền thời gian bắt đầu và kết thúc
2. **Tìm kiếm sản phẩm**: Hệ thống chỉ hiển thị sản phẩm có thể chọn
3. **Tạo flash sale**: Nếu có xung đột, hệ thống sẽ hiển thị lỗi chi tiết

### 2. Cleanup Thủ Công

1. **Vào Admin Panel**: Flash Sale Management
2. **Click nút "Cleanup Flash Sale"**: Xóa sản phẩm flash sale khỏi giỏ hàng
3. **Xem kết quả**: Thông báo số lượng đã cleanup

### 3. Cleanup Tự Động

**Chạy script**:
```bash
cd backend
node cleanupFlashSales.js
```

**Hoặc thêm vào cron job**:
```bash
# Chạy mỗi giờ
0 * * * * cd /path/to/backend && node cleanupFlashSales.js
```

## 🔍 Debug & Monitoring

### 1. Debug Flash Sale

**Route**: `/admin/flash-sales-debug`
- Xem thông tin chi tiết tất cả flash sale
- Kiểm tra timezone và thời gian
- Theo dõi status của flash sale

### 2. Console Logs

**Backend Logs**:
```
🕐 Found 2 expired flash sales
🧹 Processing flash sale: Flash Sale Test
✅ Updated status to expired for: Flash Sale Test
🛒 Found 5 carts with flash sale items
🗑️ Removed item from cart: Bánh Chocolate
✅ Updated cart for user: 507f1f77bcf86cd799439011
🧹 Cleanup completed:
  - Expired flash sales: 2
  - Cleaned carts: 5
  - Removed items: 8
```

### 3. Error Handling

**Xung đột sản phẩm**:
```
❌ Flash Sale Creation Error: {
  message: "Một số sản phẩm/nguyên liệu đã có flash sale trong khoảng thời gian này",
  conflictingProducts: [...],
  conflictingIngredients: [...]
}
```

## ✅ Lợi Ích

1. **Tránh xung đột**: Một sản phẩm chỉ được sale trong một thời điểm
2. **Tự động cleanup**: Không cần can thiệp thủ công
3. **Tính nhất quán**: Đảm bảo giá cả chính xác
4. **Trải nghiệm người dùng tốt**: Không bị lỗi khi flash sale kết thúc

## 🚀 Deployment

1. **Push code lên GitHub**
2. **Vercel sẽ tự động deploy**
3. **Test các tính năng mới**
4. **Setup cron job cho cleanup tự động** (tùy chọn)

## 📝 Lưu Ý

- **Timezone**: Hệ thống đã được cập nhật để xử lý timezone đúng cách
- **Performance**: Cleanup được tối ưu để không ảnh hưởng hiệu suất
- **Backup**: Luôn backup database trước khi chạy cleanup
- **Monitoring**: Theo dõi logs để đảm bảo hoạt động bình thường 