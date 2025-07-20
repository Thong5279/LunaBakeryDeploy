# 🎤 Hướng Dẫn Sử Dụng Chức Năng Tìm Kiếm Bằng Giọng Nói

## Tổng Quan

Chức năng tìm kiếm bằng giọng nói cho phép người dùng tìm kiếm sản phẩm và nguyên liệu bằng cách nói thay vì gõ từ khóa. Tính năng này sử dụng Web Speech API của trình duyệt để nhận diện giọng nói tiếng Việt.

## Các Tính Năng Chính

### 1. Voice Search trong Searchbar
- **Vị trí**: Trong thanh tìm kiếm chính (navbar)
- **Cách sử dụng**: 
  - Click vào icon microphone trong thanh tìm kiếm
  - Nói từ khóa tìm kiếm
  - Kết quả sẽ tự động được tìm kiếm

### 2. Voice Search Banner
- **Vị trí**: Trang chủ, ngay sau Flash Sale Banner
- **Cách sử dụng**:
  - Click vào nút microphone lớn
  - Nói từ khóa tìm kiếm
  - Xem kết quả nhận diện và tự động tìm kiếm

### 3. Voice Search Modal
- **Vị trí**: Mở từ nút microphone trong navbar
- **Cách sử dụng**:
  - Click vào icon microphone trong navbar
  - Modal sẽ mở ra với giao diện tìm kiếm bằng giọng nói
  - Có thể nhập từ khóa thủ công hoặc sử dụng voice search

### 4. Voice Search Floating Button
- **Vị trí**: Góc dưới bên phải màn hình
- **Cách sử dụng**:
  - Click vào nút floating màu hồng
  - Nói từ khóa tìm kiếm
  - Tự động chuyển đến trang kết quả tìm kiếm

## Hướng Dẫn Sử Dụng

### Bước 1: Cho phép quyền microphone
Khi lần đầu sử dụng, trình duyệt sẽ yêu cầu quyền truy cập microphone:
- Click "Cho phép" để bật tính năng voice search
- Click "Chặn" nếu không muốn sử dụng

### Bước 2: Sử dụng voice search
1. **Chọn phương thức voice search**:
   - Thanh tìm kiếm chính
   - Banner trên trang chủ
   - Modal từ navbar
   - Nút floating

2. **Bắt đầu nhận diện**:
   - Click vào nút microphone
   - Nút sẽ chuyển sang màu đỏ và có hiệu ứng pulse
   - Hiển thị "Đang nghe..." 

3. **Nói từ khóa tìm kiếm**:
   - Nói rõ ràng và chậm rãi
   - Ví dụ: "bánh chocolate", "nguyên liệu bột mì", "bánh sinh nhật"

4. **Xem kết quả**:
   - Kết quả nhận diện sẽ hiển thị
   - Tự động chuyển đến trang tìm kiếm sau 1 giây

## Các Từ Khóa Gợi Ý

### Sản phẩm bánh:
- "bánh chocolate"
- "bánh sinh nhật"
- "bánh kem"
- "bánh cupcake"
- "bánh mousse"
- "bánh tiramisu"

### Nguyên liệu:
- "bột mì"
- "đường"
- "trứng"
- "sữa"
- "bơ"
- "vanilla"

### Danh mục:
- "bánh ngọt"
- "bánh mặn"
- "bánh trái cây"
- "bánh kem"

## Xử Lý Lỗi

### Lỗi thường gặp:

1. **"Trình duyệt không hỗ trợ"**
   - Giải pháp: Sử dụng Chrome, Edge, hoặc Safari phiên bản mới
   - Firefox có thể không hỗ trợ đầy đủ

2. **"Không thể nhận diện giọng nói"**
   - Kiểm tra microphone có hoạt động không
   - Thử nói to và rõ ràng hơn
   - Kiểm tra kết nối internet

3. **"Không thể bắt đầu nhận diện"**
   - Kiểm tra quyền truy cập microphone
   - Refresh trang và thử lại
   - Đóng và mở lại trình duyệt

## Tính Năng Nâng Cao

### Responsive Design
- Tự động điều chỉnh kích thước trên mobile
- Tối ưu hóa cho màn hình nhỏ

### Accessibility
- Hỗ trợ keyboard navigation
- Screen reader friendly
- Focus indicators

### Performance
- Debounced search suggestions
- Lazy loading components
- Optimized animations

## Cấu Trúc Code

### Components:
- `VoiceSearch.jsx` - Component cơ bản cho voice search
- `VoiceSearchBanner.jsx` - Banner trên trang chủ
- `VoiceSearchModal.jsx` - Modal tìm kiếm
- `VoiceSearchFloatingButton.jsx` - Nút floating

### Hooks:
- `useVoiceSearch.js` - Custom hook quản lý logic voice search

### Styles:
- `VoiceSearch.css` - CSS animations và styles

## Browser Support

### Hỗ trợ đầy đủ:
- Chrome 25+
- Edge 79+
- Safari 14.1+

### Hỗ trợ một phần:
- Firefox (có thể cần cấu hình thêm)

### Không hỗ trợ:
- Internet Explorer
- Các trình duyệt cũ

## Troubleshooting

### Nếu voice search không hoạt động:

1. **Kiểm tra trình duyệt**:
   - Sử dụng Chrome hoặc Edge
   - Cập nhật lên phiên bản mới nhất

2. **Kiểm tra microphone**:
   - Test microphone trong Settings
   - Kiểm tra quyền truy cập

3. **Kiểm tra kết nối**:
   - Đảm bảo có kết nối internet ổn định
   - Thử refresh trang

4. **Kiểm tra console**:
   - Mở Developer Tools (F12)
   - Xem có lỗi JavaScript không

## Tương Lai

### Tính năng dự kiến:
- Hỗ trợ đa ngôn ngữ
- Voice commands nâng cao
- Integration với AI assistant
- Offline voice recognition

### Cải tiến:
- Tăng độ chính xác nhận diện
- Thêm voice feedback
- Custom voice commands
- Voice search history 