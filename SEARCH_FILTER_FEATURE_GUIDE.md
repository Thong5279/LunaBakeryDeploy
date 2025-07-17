# Hướng dẫn sử dụng tính năng tìm kiếm và lọc người dùng

## Tổng quan
Tính năng tìm kiếm và lọc cho phép Admin và Manager dễ dàng tìm kiếm và lọc danh sách người dùng theo nhiều tiêu chí khác nhau.

## Tính năng chính

### 1. Tìm kiếm
- **Tìm theo tên**: Nhập tên người dùng để tìm kiếm
- **Tìm theo email**: Nhập email để tìm kiếm
- **Tìm kiếm thông minh**: Hỗ trợ tìm kiếm không phân biệt hoa thường
- **Debounced search**: Tự động tìm kiếm sau 500ms khi người dùng ngừng gõ

### 2. Lọc theo quyền
- **Tất cả quyền**: Hiển thị tất cả người dùng
- **Khách hàng**: Chỉ hiển thị user có role customer
- **Admin**: Chỉ hiển thị user có role admin
- **Quản lý**: Chỉ hiển thị user có role manager
- **Nhân viên làm bánh**: Chỉ hiển thị user có role baker
- **Nhân viên giao bánh**: Chỉ hiển thị user có role shipper

### 3. Lọc theo trạng thái
- **Tất cả trạng thái**: Hiển thị cả user hoạt động và bị khoá
- **Hoạt động**: Chỉ hiển thị user chưa bị khoá
- **Đã khoá**: Chỉ hiển thị user đã bị khoá

### 4. Phân trang
- **Hiển thị 10 user/trang**: Mặc định
- **Điều hướng trang**: Nút trước/sau và số trang
- **Thông tin trang**: Hiển thị trang hiện tại và tổng số trang

## Cách sử dụng

### Tìm kiếm
1. Nhập từ khóa vào ô tìm kiếm
2. Hệ thống sẽ tự động tìm kiếm sau 500ms
3. Kết quả sẽ hiển thị user có tên hoặc email chứa từ khóa
4. Nhấn nút X để xóa từ khóa tìm kiếm

### Lọc
1. Nhấn nút "Bộ lọc" để mở panel lọc
2. Chọn quyền tài khoản từ dropdown
3. Chọn trạng thái từ dropdown
4. Kết quả sẽ được lọc theo tiêu chí đã chọn
5. Nhấn "Xóa lọc" để reset về trạng thái ban đầu

### Phân trang
1. Sử dụng nút "Trước"/"Sau" để điều hướng
2. Nhấn vào số trang để chuyển trực tiếp
3. Hệ thống hiển thị tối đa 5 số trang

## Cấu trúc Backend

### API Endpoint
```
GET /api/admin/users?search=&role=&status=&page=&limit=
```

### Query Parameters
- `search`: Từ khóa tìm kiếm (tên hoặc email)
- `role`: Lọc theo quyền (all, customer, admin, manager, baker, shipper)
- `status`: Lọc theo trạng thái (all, active, locked)
- `page`: Số trang (mặc định: 1)
- `limit`: Số item/trang (mặc định: 10)

### Response Format
```json
{
  "users": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Cấu trúc Frontend

### Redux State
```javascript
{
  users: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    role: 'all',
    status: 'all',
    page: 1,
    limit: 10
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  }
}
```

### Components

#### SearchFilter Component
- Tái sử dụng cho các trang khác
- Hỗ trợ nhiều loại filter
- Responsive design
- Debounced search

#### Pagination Component
- Tái sử dụng cho các trang khác
- Hiển thị thông minh (tối đa 5 trang)
- Disabled state cho nút điều hướng

## Tính năng nâng cao

### 1. Debounced Search
- Tránh gọi API quá nhiều khi user đang gõ
- Tự động tìm kiếm sau 500ms
- Cải thiện performance

### 2. Responsive Design
- Mobile-friendly
- Collapsible filter panel
- Adaptive layout

### 3. Loading States
- Hiển thị loading khi đang tải dữ liệu
- Disabled buttons khi đang xử lý
- Skeleton loading (có thể thêm sau)

### 4. Error Handling
- Hiển thị thông báo lỗi
- Retry mechanism
- Graceful degradation

## Performance Optimization

### 1. Database Indexing
```javascript
// Đảm bảo có index cho các trường tìm kiếm
db.users.createIndex({ "name": 1 });
db.users.createIndex({ "email": 1 });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "isLocked": 1 });
```

### 2. Query Optimization
- Sử dụng MongoDB aggregation cho complex queries
- Limit kết quả trả về
- Sử dụng projection để giảm data transfer

### 3. Caching
- Cache kết quả tìm kiếm
- Cache filter options
- Implement Redis cache (tương lai)

## Testing

### Unit Tests
```javascript
// Test search functionality
test('should filter users by search term', () => {
  // Test implementation
});

// Test filter functionality
test('should filter users by role', () => {
  // Test implementation
});

// Test pagination
test('should handle pagination correctly', () => {
  // Test implementation
});
```

### Integration Tests
```javascript
// Test API endpoints
test('GET /api/admin/users should return filtered results', () => {
  // Test implementation
});
```

## Troubleshooting

### Vấn đề thường gặp

1. **Tìm kiếm không hoạt động**
   - Kiểm tra database indexes
   - Kiểm tra query parameters
   - Kiểm tra frontend state

2. **Lọc không chính xác**
   - Kiểm tra filter values
   - Kiểm tra backend logic
   - Kiểm tra Redux state

3. **Phân trang không đúng**
   - Kiểm tra total count
   - Kiểm tra page calculation
   - Kiểm tra limit parameter

### Debug Commands
```bash
# Kiểm tra database indexes
db.users.getIndexes()

# Kiểm tra query performance
db.users.find({name: /test/i}).explain("executionStats")

# Kiểm tra total count
db.users.countDocuments({role: "customer"})
```

## Cập nhật tương lai

### Tính năng có thể thêm
1. **Advanced Search**
   - Tìm kiếm theo ngày tạo
   - Tìm kiếm theo địa chỉ
   - Tìm kiếm theo số điện thoại

2. **Export Data**
   - Export danh sách user
   - Export theo filter
   - Multiple format (CSV, Excel)

3. **Bulk Actions**
   - Khoá nhiều user cùng lúc
   - Thay đổi role hàng loạt
   - Delete multiple users

4. **Real-time Search**
   - Live search suggestions
   - Auto-complete
   - Search history

5. **Advanced Filters**
   - Date range filter
   - Custom field filters
   - Saved filter presets 