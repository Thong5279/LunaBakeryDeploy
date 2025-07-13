# Hướng dẫn tính năng Ẩn đánh giá

## 🎯 Tổng quan

Tính năng **Ẩn đánh giá** cho phép admin và manager ẩn các đánh giá tiêu cực hoặc không phù hợp thay vì xóa chúng hoàn toàn. Đánh giá bị ẩn sẽ không hiển thị trên website nhưng vẫn được lưu trữ trong database.

## ✨ Các tính năng mới

### 1. Trạng thái "Hidden"
- **Trạng thái mới**: `hidden` được thêm vào enum status
- **Đánh giá ẩn**: Không hiển thị trên website nhưng vẫn lưu trong database
- **Có thể khôi phục**: Có thể hiện lại đánh giá bất cứ lúc nào

### 2. API mới
- **PUT `/api/admin/reviews/:id/hide`**: Ẩn đánh giá
- **PUT `/api/admin/reviews/:id/show`**: Hiện lại đánh giá
- **Validation**: Cập nhật để chấp nhận status `hidden`

### 3. Redux Actions
- **`hideReview`**: Action để ẩn đánh giá
- **`showReview`**: Action để hiện lại đánh giá
- **State management**: Tự động cập nhật UI khi thay đổi trạng thái

### 4. UI Components
- **Nút Ẩn/Hiện**: Trong bảng quản lý và modal chi tiết
- **Filter**: Thêm option "Đã ẩn" trong bộ lọc trạng thái
- **Thống kê**: Hiển thị số lượng đánh giá đã ẩn
- **Status badge**: Hiển thị trạng thái "Đã ẩn" với icon mắt

## 🔧 Cách sử dụng

### Ẩn đánh giá
1. **Trong bảng quản lý**: Nhấn nút mắt (👁️) bên cạnh đánh giá
2. **Trong modal chi tiết**: Nhấn nút "Ẩn đánh giá"
3. **Xác nhận**: Đánh giá sẽ chuyển sang trạng thái "Đã ẩn"

### Hiện lại đánh giá
1. **Trong bảng quản lý**: Nhấn nút mắt (👁️) bên cạnh đánh giá đã ẩn
2. **Trong modal chi tiết**: Nhấn nút "Hiện lại"
3. **Xác nhận**: Đánh giá sẽ chuyển về trạng thái "Đã duyệt"

### Lọc đánh giá đã ẩn
1. **Mở bộ lọc**: Nhấn nút "Lọc"
2. **Chọn trạng thái**: Chọn "Đã ẩn" từ dropdown
3. **Xem kết quả**: Chỉ hiển thị các đánh giá đã ẩn

## 📊 Thống kê

### Thống kê mới
- **Đã ẩn**: Hiển thị số lượng đánh giá đã ẩn
- **Icon**: Mắt (👁️) màu xám
- **Vị trí**: Cạnh thống kê "Đã duyệt"

### Backend Stats
```javascript
// Thêm vào aggregation pipeline
hiddenReviews: { $sum: { $cond: [{ $eq: ['$status', 'hidden'] }, 1, 0] } }
```

## 🎨 UI/UX

### Status Badge
- **Màu sắc**: Xám (text-gray-600, bg-gray-100)
- **Icon**: Mắt (FaEye)
- **Text**: "Đã ẩn"

### Action Buttons
- **Ẩn**: Nút mắt màu xám
- **Hiện lại**: Nút mắt màu xanh
- **Tooltip**: "Ẩn đánh giá" / "Hiện lại đánh giá"

### Modal Actions
- **Ẩn**: Nút "Ẩn đánh giá" màu xám
- **Hiện lại**: Nút "Hiện lại" màu xanh
- **Disabled**: Khi đang loading

## 🔒 Bảo mật

### Middleware
- **`protect`**: Yêu cầu đăng nhập
- **`adminOrManager`**: Chỉ admin/manager mới được phép

### Validation
- **Status enum**: Bao gồm `hidden`
- **Review existence**: Kiểm tra review tồn tại
- **Error handling**: Xử lý lỗi đầy đủ

## 📁 Files đã cập nhật

### Backend
1. **`backend/models/Review.js`**
   - Thêm `hidden` vào enum status

2. **`backend/routes/adminReviewRoutes.js`**
   - Thêm API `/hide` và `/show`
   - Cập nhật validation
   - Thêm thống kê hidden reviews

### Frontend
1. **`frontend/src/redux/slices/adminReviewSlice.js`**
   - Thêm `hideReview` và `showReview` actions
   - Cập nhật extraReducers

2. **`frontend/src/components/Admin/ReviewManagement.jsx`**
   - Thêm handlers cho ẩn/hiện
   - Cập nhật UI với nút ẩn/hiện
   - Thêm filter cho hidden status
   - Thêm thống kê hidden reviews

## 🚀 Workflow

### Khi ẩn đánh giá
1. User nhấn nút ẩn
2. Frontend gọi API `PUT /hide`
3. Backend cập nhật status = 'hidden'
4. Frontend cập nhật UI
5. Đánh giá không hiển thị trên website

### Khi hiện lại đánh giá
1. User nhấn nút hiện lại
2. Frontend gọi API `PUT /show`
3. Backend cập nhật status = 'approved'
4. Frontend cập nhật UI
5. Đánh giá hiển thị lại trên website

## ⚠️ Lưu ý quan trọng

### Khác biệt với Xóa
- **Ẩn**: Chỉ ẩn khỏi website, vẫn lưu trong database
- **Xóa**: Xóa hoàn toàn khỏi database
- **Khôi phục**: Ẩn có thể khôi phục, xóa không thể

### Rating Calculation
- **Ẩn reviews**: Không tính vào rating trung bình
- **Approved reviews**: Chỉ tính những review đã duyệt
- **Pending reviews**: Không tính vào rating

### Performance
- **Filter**: Có thể lọc theo status hidden
- **Search**: Vẫn tìm kiếm được đánh giá đã ẩn
- **Pagination**: Hoạt động bình thường với hidden reviews

## 🎉 Kết quả

✅ **Tính năng hoàn chỉnh**: Ẩn/hiện đánh giá
✅ **UI/UX tốt**: Nút rõ ràng, tooltip đầy đủ
✅ **Bảo mật**: Chỉ admin/manager mới được phép
✅ **Thống kê**: Hiển thị số lượng đánh giá đã ẩn
✅ **Filter**: Có thể lọc theo trạng thái ẩn
✅ **Responsive**: Hoạt động tốt trên mọi thiết bị 