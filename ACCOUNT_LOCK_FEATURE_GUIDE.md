# Hướng dẫn sử dụng tính năng khoá tài khoản

## Tổng quan
Tính năng khoá tài khoản cho phép Admin và Manager có thể khoá/mở khoá tài khoản người dùng để ngăn họ đăng nhập vào hệ thống.

## Tính năng chính

### 1. Khoá tài khoản
- **Quyền truy cập**: Admin và Manager
- **Vị trí**: Trang quản lý người dùng (`/admin/users` hoặc `/manager/users`)
- **Cách thực hiện**: 
  - Vào trang quản lý người dùng
  - Tìm user cần khoá
  - Nhấn nút "Khoá" (màu vàng)
  - Xác nhận hành động

### 2. Mở khoá tài khoản
- **Quyền truy cập**: Admin và Manager
- **Vị trí**: Trang quản lý người dùng
- **Cách thực hiện**:
  - Vào trang quản lý người dùng
  - Tìm user đã bị khoá (có badge "Đã khoá")
  - Nhấn nút "Mở khoá" (màu xanh)
  - Xác nhận hành động

### 3. Hiển thị trạng thái
- **Hoạt động**: Badge màu xanh "Hoạt động"
- **Đã khoá**: Badge màu đỏ "Đã khoá"

## Hạn chế và quy tắc

### 1. Không thể khoá tài khoản Admin
- Hệ thống sẽ từ chối yêu cầu khoá tài khoản có role "admin"
- Chỉ có thể khoá tài khoản customer, manager, baker, shipper

### 2. Ảnh hưởng khi bị khoá
- **Đăng nhập thông thường**: Hiển thị thông báo "Tài khoản của bạn đã bị khoá"
- **Đăng nhập Google**: Hiển thị thông báo tương tự và chuyển về trang login
- **Truy cập API**: Tất cả API calls sẽ bị từ chối với status 403

### 3. Các tài khoản bị khoá vẫn có thể:
- Xem thông tin tài khoản (nếu đã đăng nhập trước đó)
- Nhận thông báo về trạng thái bị khoá

## Cấu trúc Database

### User Schema
```javascript
{
  // ... các trường khác
  isLocked: {
    type: Boolean,
    default: false
  }
}
```

## API Endpoints

### Khoá tài khoản
```
PATCH /api/admin/users/:id/lock
Authorization: Bearer <token>
```

### Mở khoá tài khoản
```
PATCH /api/admin/users/:id/unlock
Authorization: Bearer <token>
```

## Frontend Components

### UserManagement Component
- Hiển thị danh sách tất cả user
- Nút khoá/mở khoá cho từng user
- Badge hiển thị trạng thái
- Responsive design

### Error Handling
- Hiển thị thông báo lỗi khi tài khoản bị khoá
- Xử lý lỗi từ Google OAuth
- Toast notifications cho user feedback

## Testing

### Scripts có sẵn
1. `checkLockedUsers.js` - Kiểm tra user bị khoá
2. `testLockAccount.js` - Test tính năng khoá/mở khoá
3. `updateUserSchema.js` - Cập nhật schema cho user hiện tại

### Cách test
```bash
# Kiểm tra user bị khoá
node checkLockedUsers.js

# Test tính năng khoá
node testLockAccount.js

# Cập nhật schema (chạy một lần)
node updateUserSchema.js
```

## Troubleshooting

### Vấn đề thường gặp

1. **User vẫn đăng nhập được sau khi khoá**
   - Kiểm tra xem user có phải là admin không
   - Kiểm tra database có cập nhật trường isLocked không
   - Kiểm tra cache của browser

2. **Google OAuth vẫn hoạt động**
   - Đảm bảo đã cập nhật authRoutes.js
   - Kiểm tra callback URL có đúng không
   - Clear browser cache

3. **UI không hiển thị đúng trạng thái**
   - Refresh trang admin
   - Kiểm tra Redux state
   - Kiểm tra API response

### Debug Commands
```bash
# Kiểm tra user trong database
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./models/User'); mongoose.connect(process.env.MONGO_URI).then(async () => { const users = await User.find({isLocked: true}); console.log('Locked users:', users.length); mongoose.connection.close(); });"
```

## Bảo mật

### Logging
- Tất cả hành động khoá/mở khoá được log
- Thông báo console khi user bị khoá cố gắng đăng nhập

### Validation
- Kiểm tra quyền truy cập trước khi thực hiện
- Validate user ID trước khi thao tác
- Sanitize input data

## Cập nhật tương lai

### Tính năng có thể thêm
1. Lý do khoá tài khoản
2. Thời gian khoá tự động
3. Thông báo email khi bị khoá
4. Lịch sử khoá/mở khoá
5. Auto-unlock sau thời gian nhất định 