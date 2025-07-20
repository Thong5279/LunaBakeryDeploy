# Hướng dẫn tính năng quản lý sản phẩm

## Các tính năng mới được thêm vào

### 1. Tìm kiếm sản phẩm
- **Tìm kiếm theo từ khóa**: Nhập từ khóa vào ô tìm kiếm để tìm sản phẩm theo:
  - Tên sản phẩm
  - Mã SKU
  - Mô tả sản phẩm
- **Tìm kiếm real-time**: Kết quả được cập nhật ngay lập tức khi nhập

### 2. Lọc sản phẩm
- **Lọc theo danh mục**: Chọn danh mục cụ thể hoặc "Tất cả danh mục"
- **Lọc theo trạng thái**: 
  - Đang bán (active)
  - Ngừng bán (inactive)
  - Hoặc "Tất cả trạng thái"

### 3. Sắp xếp sản phẩm
Có thể sắp xếp theo nhiều tiêu chí:
- **Tên sản phẩm**: A-Z hoặc Z-A
- **Giá**: Thấp-cao hoặc cao-thấp
- **Mã SKU**: A-Z hoặc Z-A
- **Danh mục**: A-Z hoặc Z-A
- **Trạng thái**: A-Z hoặc Z-A

### 4. Hiển thị thông tin
- **Thống kê kết quả**: Hiển thị số lượng sản phẩm đã lọc / tổng số
- **Cột danh mục mới**: Hiển thị danh mục sản phẩm với badge màu xanh
- **Hover effect**: Di chuột qua hàng để highlight

### 5. Đặt lại bộ lọc
- Nút "Đặt lại bộ lọc" để xóa tất cả bộ lọc và trở về trạng thái ban đầu

## Cách sử dụng

### Tìm kiếm nhanh
1. Nhập từ khóa vào ô "Tìm kiếm"
2. Hệ thống sẽ tìm kiếm trong tên, SKU và mô tả sản phẩm

### Lọc theo danh mục
1. Chọn danh mục từ dropdown "Danh mục"
2. Chọn "Tất cả danh mục" để xem tất cả

### Lọc theo trạng thái
1. Chọn trạng thái từ dropdown "Trạng thái"
2. Chọn "Tất cả trạng thái" để xem tất cả

### Sắp xếp
1. Chọn tiêu chí sắp xếp từ dropdown "Sắp xếp theo"
2. Có thể sắp xếp theo nhiều trường khác nhau

### Kết hợp các bộ lọc
- Có thể kết hợp tìm kiếm + lọc + sắp xếp cùng lúc
- Ví dụ: Tìm "bánh" + Lọc "Bánh kem" + Sắp xếp theo giá cao-thấp

## Responsive Design
- **Desktop**: Hiển thị 4 cột (Tìm kiếm, Danh mục, Trạng thái, Sắp xếp)
- **Tablet**: Hiển thị 2 cột
- **Mobile**: Hiển thị 1 cột

## Hiệu suất
- Sử dụng `useMemo` để tối ưu hiệu suất lọc và sắp xếp
- Chỉ tính toán lại khi các bộ lọc thay đổi
- Không gọi API lại khi thay đổi bộ lọc

## Tương thích
- Hoạt động với cả Admin và Manager
- Tương thích với tất cả trình duyệt hiện đại
- Hỗ trợ đầy đủ các tính năng hiện có (thêm, sửa, xóa sản phẩm) 