# 📋 Hướng dẫn sử dụng chức năng Quản lý Công thức (Recipe Management)

## 🎯 Tổng quan
Chức năng Quản lý Công thức cho phép Admin tạo, chỉnh sửa và quản lý các công thức làm bánh để chia sẻ với nhân viên làm bánh (Baker).

## 🚀 Cách truy cập
1. Đăng nhập với tài khoản Admin
2. Từ sidebar admin, click vào **"Công thức"**
3. URL: `/admin/recipes`

## ✨ Các tính năng chính

### 1. 📋 Xem danh sách công thức
- Hiển thị tất cả công thức dạng card grid
- Thông tin hiển thị:
  - Hình ảnh công thức
  - Tên và mô tả
  - Danh mục (bánh ngọt, bánh kem, v.v.)
  - Độ khó (Dễ, Trung bình, Khó)
  - Thời gian (chuẩn bị + nướng)
  - Số phần ăn
  - Trạng thái (Hoạt động/Tạm ngưng)
  - Trạng thái công khai

### 2. 🔍 Tìm kiếm và lọc
- **Tìm kiếm**: Theo tên công thức
- **Lọc theo danh mục**: Bánh ngọt, bánh mặn, bánh kem, v.v.
- **Lọc theo trạng thái**: Hoạt động hoặc Tạm ngưng
- Có thể kết hợp nhiều bộ lọc

### 3. ➕ Thêm công thức mới
Click nút **"Thêm công thức mới"** để mở form với các trường:

#### Thông tin cơ bản
- **Tên công thức** (bắt buộc)
- **Danh mục** (bắt buộc)
- **Mô tả** (bắt buộc)

#### Hình ảnh
- **URL hình ảnh** (bắt buộc)
- **Alt text** (tùy chọn, cho accessibility)
- Có preview hình ảnh real-time

#### Chi tiết công thức
- **Độ khó**: Dễ, Trung bình, Khó
- **Thời gian chuẩn bị** (phút)
- **Thời gian nướng** (phút)
- **Số phần ăn**

#### Nguyên liệu
- Danh sách nguyên liệu với:
  - Tên nguyên liệu
  - Số lượng
  - Đơn vị (g, kg, ml, lít, v.v.)
- Có thể thêm/xóa nguyên liệu

#### Hướng dẫn làm bánh
- Textarea lớn để nhập chi tiết từng bước
- Hỗ trợ xuống dòng và format

#### Tags (từ khóa)
- Chọn từ danh sách gợi ý
- Thêm tags tùy chỉnh
- Giúp tìm kiếm và phân loại

#### Cài đặt trạng thái
- **Trạng thái**: Hoạt động/Tạm ngưng
- **Công khai**: Có hiển thị cho nhân viên làm bánh không

### 4. ✏️ Chỉnh sửa công thức
- Click icon **Edit** (bút chì) trên card công thức
- Form tương tự thêm mới, đã điền sẵn thông tin
- Lưu thay đổi

### 5. 🗑️ Xóa công thức
- Click icon **Delete** (thùng rác) trên card công thức
- Hiện modal xác nhận đẹp (không dùng `window.confirm`)
- Xác nhận để xóa vĩnh viễn

### 6. 🔄 Thay đổi trạng thái nhanh
- **Toggle Status**: Click icon toggle để bật/tắt trạng thái
- **Toggle Publish**: Click icon mắt để công khai/ẩn công thức

## 🎨 Thiết kế UI/UX

### Màu sắc chủ đạo
- **Pink/Rose**: `#ec4899` cho các elements chính
- **Gray**: Các tone xám cho text và borders
- **Green**: Cho trạng thái active/success
- **Red**: Cho trạng thái inactive/danger
- **Blue**: Cho trạng thái published

### Responsive Design
- **Desktop**: Grid 3 cột
- **Tablet**: Grid 2 cột  
- **Mobile**: Grid 1 cột
- Form modal responsive với scroll

### Thông báo
- ✅ **Success**: Màu xanh lá với icon check
- ❌ **Error**: Màu đỏ với icon warning
- ⏳ **Loading**: Spinner với text
- 🔄 **Auto dismiss**: Thông báo tự động ẩn sau 3-5 giây

## 🔧 Chi tiết kỹ thuật

### Backend API Endpoints
```
GET    /api/admin/recipes                 - Lấy danh sách công thức
GET    /api/admin/recipes/:id             - Lấy chi tiết công thức
POST   /api/admin/recipes                 - Tạo công thức mới
PUT    /api/admin/recipes/:id             - Cập nhật công thức
DELETE /api/admin/recipes/:id             - Xóa công thức
PATCH  /api/admin/recipes/:id/toggle-status    - Đổi trạng thái
PATCH  /api/admin/recipes/:id/toggle-publish   - Đổi trạng thái công khai
GET    /api/admin/recipes/stats/overview  - Thống kê công thức
```

### Database Schema (MongoDB)
```javascript
{
  name: String (required),
  description: String (required),
  instructions: String (required),
  image: {
    url: String (required),
    altText: String
  },
  category: String (enum),
  difficulty: String (enum: Dễ, Trung bình, Khó),
  preparationTime: Number (minutes),
  cookingTime: Number (minutes),
  servings: Number,
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  tags: [String],
  status: String (enum: active, inactive),
  isPublished: Boolean,
  publishedAt: Date,
  createdBy: ObjectId (ref: User),
  updatedBy: ObjectId (ref: User),
  views: Number,
  rating: Number,
  totalRatings: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Frontend Technology Stack
- **React 18** với Hooks
- **Redux Toolkit** cho state management
- **React Router v6** cho routing
- **Tailwind CSS** cho styling
- **React Icons** cho icons
- **Axios** cho API calls

## 🛡️ Bảo mật và Phân quyền
- Chỉ **Admin** có quyền truy cập
- Middleware `protect` và `admin` kiểm tra authentication/authorization
- Validate dữ liệu ở cả frontend và backend
- Sanitize input để tránh XSS

## 📱 Responsive và Accessibility
- **Mobile-first** design
- **Screen reader** friendly với proper labels
- **Keyboard navigation** support
- **High contrast** colors cho người khuyết tật
- **Loading states** và error handling

## 🚀 Tương lai mở rộng

### Tính năng có thể thêm
- 📊 **Analytics**: Xem công thức được sử dụng nhiều nhất
- 🔍 **Advanced Search**: Tìm theo nguyên liệu, thời gian
- 📄 **Export**: Xuất PDF công thức để in
- 🏷️ **Categories Management**: Quản lý danh mục
- 💬 **Comments**: Nhân viên comment feedback
- ⭐ **Rating System**: Đánh giá công thức
- 📋 **Recipe Templates**: Mẫu công thức có sẵn
- 🔄 **Version Control**: Lưu lịch sử thay đổi

### Tích hợp với Baker Interface
- Hiển thị công thức published cho Baker
- Baker có thể xem, tìm kiếm công thức
- Đánh dấu công thức đã sử dụng
- Feedback về công thức

## 🐛 Troubleshooting

### Lỗi thường gặp
1. **Không load được hình ảnh**: Kiểm tra URL hợp lệ
2. **Lỗi validation**: Đảm bảo điền đủ trường required
3. **Lỗi network**: Kiểm tra kết nối backend
4. **Lỗi permission**: Đảm bảo đăng nhập với quyền Admin

### Debug Steps
1. Mở Developer Tools (F12)
2. Check Console tab cho errors
3. Check Network tab cho API calls
4. Verify localStorage có token không

## 📞 Hỗ trợ
Nếu gặp vấn đề, liên hệ team development hoặc tạo issue trên repository.

---
**🏠 Luna Bakery Management System**  
*Phiên bản: 1.0.0*  
*Cập nhật cuối: [Current Date]* 