# 🔥 Hướng Dẫn Sử Dụng Flash Sale - Luna Bakery

## 📋 Tổng Quan
Chức năng Flash Sale cho phép admin và quản trị viên tạo các chương trình giảm giá nhanh với thời gian giới hạn, giúp tăng doanh số và thu hút khách hàng.

## 🎯 Tính Năng Chính

### ✅ Đã Hoàn Thành
- **Tạo Flash Sale**: Admin/Manager có thể tạo flash sale mới
- **Chọn Sản Phẩm/Nguyên Liệu**: Tìm kiếm và chọn items để giảm giá
- **Cấu Hình Giảm Giá**: Hỗ trợ giảm theo % hoặc số tiền cố định
- **Thời Gian**: Đặt ngày bắt đầu và kết thúc
- **Hiển Thị Trên Trang Chủ**: Banner flash sale cho người dùng
- **Quản Lý**: Xem danh sách, xóa flash sale

## 🚀 Cách Sử Dụng

### 1. Truy Cập Flash Sale Management
```
Đăng nhập Admin/Manager → Menu "Flash Sale" → /admin/flash-sales
```

### 2. Tạo Flash Sale Mới
1. **Nhấn "Tạo Flash Sale"**
2. **Điền thông tin cơ bản:**
   - Tên flash sale
   - Mô tả (tùy chọn)
   - Ngày bắt đầu và kết thúc
   - Loại giảm giá (% hoặc số tiền)
   - Giá trị giảm giá

3. **Chọn sản phẩm/nguyên liệu:**
   - Nhấn "Tìm kiếm"
   - Sử dụng bộ lọc (danh mục, loại)
   - Chọn items muốn giảm giá
   - Xác nhận lựa chọn

4. **Hoàn thành:**
   - Nhấn "Tạo Flash Sale"
   - Hệ thống sẽ hiển thị thông báo thành công

### 3. Quản Lý Flash Sale
- **Xem danh sách**: Tất cả flash sale đã tạo
- **Trạng thái**: Sắp diễn ra / Đang diễn ra / Đã kết thúc
- **Xóa**: Nhấn icon thùng rác để xóa

## 🎨 Giao Diện Người Dùng

### Trang Chủ
- **Flash Sale Banner**: Hiển thị tự động khi có flash sale đang hoạt động
- **Đếm ngược**: Thời gian còn lại của flash sale
- **Hiển thị giá**: Giá gốc và giá sau giảm
- **Phần trăm giảm**: Hiển thị % giảm giá

### Responsive Design
- **Desktop**: Grid layout với nhiều cột
- **Tablet**: Grid layout tối ưu
- **Mobile**: Stack layout dễ sử dụng

## 🔧 Cấu Trúc Kỹ Thuật

### Backend
```
📁 Models
├── FlashSale.js (Model chính)
├── Product.js (Liên kết sản phẩm)
└── Ingredient.js (Liên kết nguyên liệu)

📁 Routes
└── flashSaleRoutes.js (API endpoints)

📁 Middleware
└── authMiddleware.js (Bảo mật)
```

### Frontend
```
📁 Components/Admin
└── FlashSaleManagement.jsx (Giao diện quản lý)

📁 Components/Common
└── FlashSaleBanner.jsx (Banner hiển thị)

📁 Redux
└── flashSaleSlice.js (State management)
```

## 📊 API Endpoints

### Admin/Manager Only
```
POST   /api/flash-sales              # Tạo flash sale
GET    /api/flash-sales              # Lấy danh sách
GET    /api/flash-sales/:id          # Chi tiết flash sale
PUT    /api/flash-sales/:id          # Cập nhật
DELETE /api/flash-sales/:id          # Xóa
GET    /api/flash-sales/items/available  # Lấy items có sẵn
```

### Public
```
GET    /api/flash-sales/active/active  # Flash sale đang hoạt động
```

## 🛡️ Bảo Mật

### Phân Quyền
- **Admin**: Toàn quyền tạo, sửa, xóa
- **Manager**: Có thể tạo và quản lý
- **User**: Chỉ xem flash sale đang hoạt động

### Validation
- ✅ Kiểm tra ngày tháng hợp lệ
- ✅ Validate giá trị giảm giá
- ✅ Kiểm tra items tồn tại
- ✅ Xác thực JWT token

## 🎯 Tính Năng Nâng Cao (Tương Lai)

### Đang Phát Triển
- [ ] Chỉnh sửa flash sale
- [ ] Thống kê hiệu quả flash sale
- [ ] Email thông báo cho khách hàng
- [ ] Flash sale theo danh mục
- [ ] Giới hạn số lượng mua

### Đã Hoàn Thành
- ✅ Tạo flash sale cơ bản
- ✅ Hiển thị trên trang chủ
- ✅ Quản lý danh sách
- ✅ Responsive design
- ✅ Real-time countdown

## 🐛 Xử Lý Lỗi

### Lỗi Thường Gặp
1. **"Thiếu thông tin bắt buộc"**
   - Kiểm tra đã điền đầy đủ tên, ngày, giá trị

2. **"Ngày kết thúc phải sau ngày bắt đầu"**
   - Điều chỉnh ngày kết thúc

3. **"Vui lòng chọn ít nhất một sản phẩm"**
   - Chọn items trước khi tạo

4. **"Giá trị giảm giá phải lớn hơn 0"**
   - Nhập giá trị hợp lệ

### Debug
```javascript
// Kiểm tra console để xem logs
console.log('Flash Sale Data:', flashSaleData);
console.log('Selected Items:', selectedItems);
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Features
- ✅ Touch-friendly buttons
- ✅ Swipe gestures
- ✅ Optimized images
- ✅ Readable text sizes

## 🎨 UI/UX Guidelines

### Colors
- **Primary**: Pink (#ec4899)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Icons
- **Fire**: Flash sale indicator
- **Clock**: Time remaining
- **Tag**: Discount percentage
- **Search**: Item search
- **Filter**: Category filter

## 📈 Performance

### Optimization
- ✅ Lazy loading images
- ✅ Debounced search
- ✅ Memoized components
- ✅ Efficient state management

### Monitoring
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications
- ✅ Real-time updates

---

## 🎉 Kết Luận

Chức năng Flash Sale đã được triển khai thành công với:
- ✅ Giao diện thân thiện người dùng
- ✅ Tính năng đầy đủ cho admin/manager
- ✅ Hiển thị tự động trên trang chủ
- ✅ Responsive design
- ✅ Bảo mật và validation
- ✅ Performance tối ưu

Hệ thống sẵn sàng cho việc sử dụng trong production! 🚀 