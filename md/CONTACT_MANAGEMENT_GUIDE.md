# Hướng Dẫn Quản Lý Tin Nhắn Liên Hệ

## Tổng Quan

Chức năng quản lý tin nhắn liên hệ cho phép admin xem và quản lý các tin nhắn mà khách hàng gửi đến thông qua form liên hệ trên website.

## Tính Năng Chính

### 1. Tự Động Điền Thông Tin Người Dùng
- Khi người dùng đã đăng nhập, form liên hệ sẽ tự động điền:
  - Họ và tên
  - Email
  - Số điện thoại
- Người dùng có thể chỉnh sửa thông tin này trước khi gửi

### 2. Quản Lý Tin Nhắn (Admin)
- **Xem danh sách tin nhắn**: Hiển thị tất cả tin nhắn với thông tin chi tiết
- **Thống kê**: Hiển thị số lượng tin nhắn theo trạng thái
- **Lọc và tìm kiếm**: Tìm kiếm theo tên, email, số điện thoại, chủ đề
- **Cập nhật trạng thái**: 
  - Mới (new)
  - Đã đọc (read)
  - Đã trả lời (replied)
- **Xem chi tiết**: Modal hiển thị đầy đủ thông tin tin nhắn
- **Xóa tin nhắn**: Xóa tin nhắn không cần thiết

## Cách Sử Dụng

### Cho Khách Hàng

1. **Truy cập trang liên hệ**: `/contact`
2. **Điền thông tin** (tự động điền nếu đã đăng nhập)
3. **Gửi tin nhắn**: Nhấn nút "Gửi tin nhắn"

### Cho Admin

1. **Truy cập trang quản lý**: `/admin/contacts`
2. **Xem thống kê**: 5 thẻ thống kê ở đầu trang
3. **Lọc tin nhắn**: Sử dụng bộ lọc để tìm tin nhắn cụ thể
4. **Quản lý trạng thái**: 
   - Nhấn icon mắt để xem chi tiết
   - Nhấn icon check để đánh dấu đã đọc
   - Nhấn icon reply để đánh dấu đã trả lời
   - Nhấn icon thùng rác để xóa

## Cấu Trúc Dữ Liệu

### Model Contact
```javascript
{
  name: String,        // Họ và tên
  email: String,       // Email
  phone: String,       // Số điện thoại
  subject: String,     // Chủ đề
  message: String,     // Nội dung tin nhắn
  status: String,      // Trạng thái: 'new', 'read', 'replied'
  createdAt: Date      // Ngày tạo
}
```

## API Endpoints

### Backend Routes
- `POST /api/contact` - Gửi tin nhắn liên hệ
- `GET /api/contact/admin` - Lấy danh sách tin nhắn (admin)
- `PUT /api/contact/admin/:id/status` - Cập nhật trạng thái
- `DELETE /api/contact/admin/:id` - Xóa tin nhắn
- `GET /api/contact/admin/stats` - Lấy thống kê

### Frontend Components
- `Contact.jsx` - Trang liên hệ cho khách hàng
- `ContactManagement.jsx` - Trang quản lý cho admin
- `adminContactSlice.js` - Redux slice quản lý state

## Tạo Dữ Liệu Mẫu

Để tạo dữ liệu mẫu cho testing:

```bash
cd backend
node createTestContacts.js
```

Script này sẽ tạo 10 tin nhắn mẫu với các trạng thái khác nhau.

## Tính Năng Bổ Sung

### Responsive Design
- Giao diện tương thích với mobile và desktop
- Bảng dữ liệu có thể scroll ngang trên mobile

### Real-time Updates
- Tự động cập nhật thống kê khi có thay đổi
- Toast notifications cho các hành động

### Security
- Chỉ admin mới có thể truy cập trang quản lý
- Middleware bảo vệ các API endpoints

## Lưu Ý Quan Trọng

1. **Bảo mật**: Tất cả API admin đều yêu cầu authentication và admin role
2. **Validation**: Form liên hệ có validation đầy đủ
3. **Performance**: Pagination để tối ưu hiệu suất với dữ liệu lớn
4. **UX**: Tự động điền thông tin giúp người dùng tiết kiệm thời gian

## Troubleshooting

### Lỗi Thường Gặp

1. **Không hiển thị thông tin tự động điền**
   - Kiểm tra user đã đăng nhập chưa
   - Kiểm tra Redux state auth.user

2. **Admin không thể truy cập trang quản lý**
   - Kiểm tra role của user có phải "admin" không
   - Kiểm tra token authentication

3. **API trả về lỗi 401/403**
   - Kiểm tra token trong localStorage
   - Kiểm tra middleware authMiddleware

### Debug

1. Mở Developer Tools
2. Kiểm tra Network tab cho API calls
3. Kiểm tra Console cho error messages
4. Kiểm tra Redux DevTools cho state management 