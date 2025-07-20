# Hướng Dẫn Quản Lý Đánh Giá (Review Management)

## Tổng Quan

Chức năng quản lý đánh giá cho phép Admin và Manager xem, quản lý và xử lý tất cả đánh giá từ khách hàng trên website Luna Bakery.

## Tính Năng Chính

### 1. Xem Danh Sách Đánh Giá
- **Đường dẫn**: `/admin/reviews` (Admin) hoặc `/manager/reviews` (Manager)
- **Chức năng**: 
  - Hiển thị tất cả đánh giá với thông tin chi tiết
  - Phân trang (10 đánh giá/trang)
  - Sắp xếp theo ngày, đánh giá
  - Lọc theo loại sản phẩm, trạng thái, đánh giá

### 2. Bộ Lọc Nâng Cao
- **Loại sản phẩm**: Product (Bánh) / Ingredient (Nguyên liệu)
- **Trạng thái**: Pending (Chờ duyệt) / Approved (Đã duyệt) / Rejected (Từ chối)
- **Đánh giá**: 1-5 sao
- **Tìm kiếm**: Theo nội dung đánh giá
- **Khoảng thời gian**: Từ ngày - Đến ngày

### 3. Thống Kê Tổng Quan
- **Tổng đánh giá**: Số lượng đánh giá trong khoảng thời gian
- **Đánh giá trung bình**: Rating trung bình
- **Chờ duyệt**: Số đánh giá đang chờ xử lý
- **Đã duyệt**: Số đánh giá đã được chấp nhận

### 4. Quản Lý Đánh Giá
- **Xem chi tiết**: Click vào đánh giá để xem thông tin đầy đủ
- **Duyệt đánh giá**: Chuyển trạng thái từ Pending sang Approved
- **Từ chối đánh giá**: Chuyển trạng thái sang Rejected
- **Xóa đánh giá**: Xóa hoàn toàn đánh giá khỏi hệ thống

## Cách Sử Dụng

### Đăng Nhập
1. Truy cập website với tài khoản Admin hoặc Manager
2. Đăng nhập vào hệ thống
3. Vào menu "Đánh giá" trong sidebar

### Xem Danh Sách
1. Trang sẽ hiển thị tất cả đánh giá
2. Sử dụng bộ lọc để tìm kiếm đánh giá cụ thể
3. Click "Lọc" để áp dụng bộ lọc
4. Click "Xóa lọc" để reset bộ lọc

### Quản Lý Đánh Giá
1. **Xem chi tiết**: Click vào icon "Xem" bên cạnh đánh giá
2. **Duyệt/Từ chối**: 
   - Click vào dropdown "Hành động"
   - Chọn "Duyệt" hoặc "Từ chối"
3. **Xóa đánh giá**:
   - Click vào icon "Xóa" (thùng rác)
   - Xác nhận trong modal

### Thống Kê
- Thống kê được hiển thị ở đầu trang
- Có thể chọn khoảng thời gian: Tuần, Tháng, Quý, Năm
- Dữ liệu được cập nhật real-time

## API Endpoints

### Backend Routes
- `GET /api/admin/reviews` - Lấy danh sách đánh giá
- `GET /api/admin/reviews/:id` - Lấy chi tiết đánh giá
- `PUT /api/admin/reviews/:id/status` - Cập nhật trạng thái
- `DELETE /api/admin/reviews/:id` - Xóa đánh giá
- `GET /api/admin/reviews/stats/overview` - Lấy thống kê

### Frontend Components
- `ReviewManagement.jsx` - Component chính
- `adminReviewSlice.js` - Redux slice quản lý state
- `AdminSidebar.jsx` - Menu navigation

## Bảo Mật

### Quyền Truy Cập
- **Admin**: Có toàn quyền quản lý đánh giá
- **Manager**: Có quyền xem và quản lý đánh giá
- **User thường**: Không có quyền truy cập

### Middleware Bảo Vệ
- `protect`: Kiểm tra token authentication
- `adminOrManager`: Kiểm tra role Admin hoặc Manager

## Xử Lý Lỗi

### Lỗi Thường Gặp
1. **500 Internal Server Error**: Lỗi server, kiểm tra log backend
2. **401 Unauthorized**: Token không hợp lệ hoặc hết hạn
3. **403 Forbidden**: Không có quyền truy cập
4. **404 Not Found**: Đánh giá không tồn tại

### Cách Khắc Phục
1. **Lỗi 500**: Restart server backend
2. **Lỗi 401**: Đăng nhập lại
3. **Lỗi 403**: Kiểm tra role user
4. **Lỗi 404**: Kiểm tra ID đánh giá

## Responsive Design

### Desktop (>= 1024px)
- Hiển thị đầy đủ thông tin
- Bộ lọc nằm ngang
- Bảng dữ liệu đầy đủ

### Tablet (768px - 1023px)
- Bộ lọc có thể thu gọn
- Bảng có thể scroll ngang
- Modal responsive

### Mobile (< 768px)
- Bộ lọc dạng dropdown
- Bảng dạng card
- Modal fullscreen

## Tối Ưu Hóa

### Performance
- Lazy loading cho danh sách đánh giá
- Pagination để giảm tải
- Caching thống kê
- Debounce cho tìm kiếm

### UX/UI
- Loading states
- Error handling
- Success notifications
- Confirmation dialogs

## Monitoring

### Logs
- Backend: Console logs cho API calls
- Frontend: Redux DevTools cho state changes

### Metrics
- Số lượng đánh giá theo thời gian
- Tỷ lệ đánh giá được duyệt/từ chối
- Thời gian xử lý đánh giá trung bình

## Troubleshooting

### Vấn Đề Thường Gặp
1. **Không hiển thị đánh giá**: Kiểm tra kết nối database
2. **Lỗi filter**: Kiểm tra query parameters
3. **Không cập nhật được**: Kiểm tra quyền user
4. **Lỗi pagination**: Kiểm tra page/limit parameters

### Debug Steps
1. Kiểm tra Network tab trong DevTools
2. Xem Console logs
3. Kiểm tra Redux state
4. Test API endpoints trực tiếp

## Tương Lai

### Tính Năng Dự Kiến
- Export dữ liệu đánh giá
- Báo cáo chi tiết
- Auto-moderation
- Email notifications
- Dashboard analytics

### Cải Tiến
- Real-time updates
- Advanced filtering
- Bulk actions
- Review templates
- Sentiment analysis 