# Hướng dẫn sử dụng chức năng Sổ tay công thức cho Nhân viên làm bánh

## Tổng quan
Chức năng "Sổ tay công thức" cho phép nhân viên làm bánh xem các công thức đã được phê duyệt và xuất bản bởi Admin. Đây là công cụ hỗ trợ quan trọng để nhân viên thực hiện đúng quy trình làm bánh.

## Tính năng chính

### 1. Xem danh sách công thức
- **Đường dẫn**: `/baker/recipes`
- **Quyền truy cập**: Chỉ dành cho nhân viên có role `baker`
- **Hiển thị**: Grid layout responsive (3 cột → 2 cột → 1 cột)

### 2. Tìm kiếm và lọc
- **Tìm kiếm realtime**: Theo tên công thức, mô tả, tags
- **Lọc theo danh mục**: Bánh ngọt, Bánh kem, Bánh cupcake, v.v.
- **Lọc theo độ khó**: Dễ, Trung bình, Khó
- **Sắp xếp**: Mới nhất, Tên A-Z, Độ khó, Thời gian, Phổ biến

### 3. Xem chi tiết công thức
- **Modal hiển thị**: Thông tin đầy đủ về công thức
- **2 tab chính**: 
  - Nguyên liệu (với số lượng và đơn vị)
  - Hướng dẫn thực hiện (từng bước chi tiết)
- **Chức năng in**: In công thức để sử dụng trong bếp

### 4. Thống kê tổng quan
- Tổng số công thức
- Số lượng theo từng danh mục
- Số công thức dễ thực hiện

## Cấu trúc hệ thống

### Backend API Routes
```
GET /api/baker/recipes - Lấy danh sách công thức (có phân trang, lọc)
GET /api/baker/recipes/:id - Lấy chi tiết công thức
GET /api/baker/recipes/categories/list - Lấy danh sách danh mục
GET /api/baker/recipes/search/quick - Tìm kiếm nhanh
```

### Frontend Components
```
components/Baker/
├── BakerRecipeManagement.jsx - Component chính
├── BakerRecipeModal.jsx - Modal chi tiết công thức
└── BakerSidebar.jsx - Menu điều hướng (đã cập nhật)
```

### Redux Store
```
redux/slices/bakerRecipeSlice.js - Quản lý state cho công thức Baker
```

## Chi tiết chức năng

### 1. Bảo mật
- **Authentication**: Yêu cầu đăng nhập với token JWT
- **Authorization**: Chỉ cho phép role `baker` truy cập
- **Dữ liệu**: Chỉ hiển thị công thức đã được xuất bản (`isPublished: true`) và đang hoạt động (`status: 'active'`)

### 2. Performance
- **Phân trang**: Mặc định 12 công thức/trang
- **Lazy loading**: Chỉ tải chi tiết khi cần
- **Debounced search**: Giảm thiểu request API
- **Caching**: State được lưu trong Redux

### 3. UI/UX
- **Màu sắc**: Theo theme pink (#ec4899) giống các chức năng khác
- **Responsive**: Tối ưu cho tablet và mobile
- **Loading states**: Spinner và skeleton loading
- **Error handling**: Toast notifications thân thiện

### 4. Tính năng nâng cao
- **Quick search dropdown**: Hiển thị kết quả tìm kiếm ngay khi gõ
- **Recipe cards**: Hiển thị hình ảnh, thông tin cơ bản
- **Print function**: In công thức với layout tối ưu
- **View counter**: Theo dõi lượt xem công thức

## Cách sử dụng

### Dành cho Baker
1. **Đăng nhập** vào hệ thống với tài khoản Baker
2. **Truy cập menu** "Sổ tay công thức" từ sidebar
3. **Duyệt công thức** qua grid view hoặc sử dụng bộ lọc
4. **Tìm kiếm** công thức cần thiết
5. **Xem chi tiết** bằng cách click "Xem chi tiết"
6. **In công thức** nếu cần sử dụng trong bếp

### Dành cho Admin
1. **Quản lý công thức** tại `/admin/recipes`
2. **Tạo/Chỉnh sửa** công thức mới
3. **Xuất bản** (`isPublished: true`) để Baker có thể xem
4. **Kích hoạt** (`status: 'active'`) để hiển thị

## Dữ liệu mẫu
Hệ thống đã có 5 công thức mẫu:
1. **Bánh kem dâu tây** - Trung bình (75 phút)
2. **Bánh mì ngọt hạnh nhân** - Dễ (115 phút)
3. **Bánh cupcake chocolate** - Dễ (50 phút)
4. **Bánh tart trứng** - Khó (85 phút)
5. **Bánh cookies bơ** - Dễ (35 phút)

## Troubleshooting

### Lỗi thường gặp
1. **"Không có công thức nào"**
   - Kiểm tra Admin đã xuất bản công thức chưa
   - Thử thay đổi bộ lọc

2. **"Lỗi khi tải danh sách công thức"**
   - Kiểm tra kết nối mạng
   - Kiểm tra token đăng nhập còn hạn

3. **"Không có quyền truy cập"**
   - Đảm bảo tài khoản có role `baker`
   - Liên hệ Admin để cấp quyền

### Performance Issues
1. **Tải chậm**: Giảm số lượng công thức/trang
2. **Search lag**: Đã có debounce 300ms
3. **Modal lag**: Optimize image loading

## Tương lai phát triển

### Planned Features
1. **Favorite recipes**: Lưu công thức yêu thích
2. **Recipe rating**: Đánh giá công thức
3. **Notes system**: Ghi chú cá nhân
4. **Recipe scaling**: Tính toán nguyên liệu theo số lượng
5. **Ingredient substitution**: Gợi ý thay thế nguyên liệu
6. **Video tutorials**: Hướng dẫn video
7. **Recipe history**: Lịch sử xem công thức
8. **Offline access**: Xem công thức khi offline

### Technical Improvements
1. **PWA support**: Progressive Web App
2. **Voice commands**: Điều khiển bằng giọng nói
3. **QR codes**: Chia sẻ công thức qua QR
4. **Multi-language**: Hỗ trợ đa ngôn ngữ
5. **Advanced analytics**: Phân tích usage patterns

## Liên hệ hỗ trợ
- **Technical Issues**: Liên hệ IT Support
- **Recipe Content**: Liên hệ Head Chef/Admin
- **Feature Requests**: Gửi feedback qua hệ thống

---
**Cập nhật lần cuối**: Ngày tạo tài liệu
**Phiên bản**: 1.0
**Người tạo**: AI Assistant 