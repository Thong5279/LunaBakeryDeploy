# 🎯 Hướng dẫn Test Hệ thống Quản lý Đơn hàng

## ✅ Đã sửa xong các lỗi:

1. **🔧 Import Error**: Thay thế `react-toastify` → `sonner`
2. **🔑 Auth Token**: Thêm token vào Redux auth state
3. **🌐 Port Config**: Sửa backend port từ 3000 → 9000
4. **📦 Routes Duplicate**: Loại bỏ routes trùng lặp trong server.js

## 🚀 Khởi động hệ thống:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 🔑 Tài khoản test:

- **👑 Admin**: admin@lunabakery.com / admin123
- **👨‍💼 Manager**: manager@lunabakery.com / manager123
- **🧑‍🍳 Baker**: baker@lunabakery.com / baker123
- **🚚 Delivery**: delivery@lunabakery.com / delivery123

## 📦 Test Orders có sẵn:

3 đơn hàng với trạng thái `Processing` đã được tạo:
- Order 1: Nguyễn Văn Test A - 600,000 VNĐ
- Order 2: Trần Thị Test B - 300,000 VNĐ  
- Order 3: Lê Văn Test C - 900,000 VNĐ

## 🎯 Luồng test đầy đủ:

### 1. Test Manager (Duyệt đơn hàng)
- Truy cập: http://localhost:5173/manager/orders
- Đăng nhập: manager@lunabakery.com / manager123
- **Chức năng test**:
  - ✅ Xem danh sách đơn hàng `Processing`
  - ✅ Duyệt đơn hàng → `Approved`
  - ✅ Hủy đơn hàng → `Cancelled`

### 2. Test Baker (Làm bánh)
- Truy cập: http://localhost:5173/baker/orders
- Đăng nhập: baker@lunabakery.com / baker123
- **Chức năng test**:
  - ✅ Xem đơn hàng `Approved` từ Manager
  - ✅ Bắt đầu làm bánh → `Baking`
  - ✅ Hoàn thành → `Ready`

### 3. Test Delivery (Giao hàng)
- Truy cập: http://localhost:5173/delivery/orders
- Đăng nhập: delivery@lunabakery.com / delivery123
- **Chức năng test**:
  - ✅ Xem đơn hàng `Ready` từ Baker
  - ✅ Giao hàng thành công → `Delivered`
  - ✅ Không thể giao → `CannotDeliver`

## 🔄 Trạng thái đơn hàng:

```
Processing → Manager → Approved → Baker → Baking → Ready → Delivery → Delivered
         ↘ Manager → Cancelled                              ↘ Delivery → CannotDeliver
```

## 🎨 Giao diện Features:

- ✅ **Responsive design** cho mobile/desktop
- ✅ **Statistics cards** hiển thị số lượng đơn hàng theo trạng thái
- ✅ **Action buttons** với màu sắc phù hợp cho từng thao tác
- ✅ **Toast notifications** với sonner
- ✅ **Loading states** khi xử lý API calls
- ✅ **Error handling** hiển thị lỗi rõ ràng

## 🛡️ Security Features:

- ✅ **JWT Authentication** - Bearer token
- ✅ **Role-based Access Control** - Mỗi role chỉ truy cập route phù hợp
- ✅ **API Authorization** - Middleware check role cho từng endpoint
- ✅ **Status Validation** - Chỉ cho phép chuyển trạng thái hợp lệ

## 📱 Test Responsive:

1. Desktop (1920x1080): Layout chuẩn với sidebar
2. Tablet (768x1024): Responsive grid cho stats cards
3. Mobile (375x667): Stack layout, touch-friendly buttons

## 🐛 Troubleshooting:

### 401 Unauthorized
- **Nguyên nhân**: Chưa đăng nhập hoặc token hết hạn
- **Giải pháp**: Đăng nhập lại với tài khoản đúng role

### 403 Forbidden  
- **Nguyên nhân**: Đăng nhập sai role (vd: customer truy cập manager route)
- **Giải pháp**: Đăng nhập với role phù hợp

### Không có đơn hàng
- **Nguyên nhân**: Đơn hàng đã chuyển trạng thái khác
- **Giải pháp**: Tạo test orders mới: `node createTestOrders.js`

### API Error
- **Nguyên nhân**: Backend chưa chạy hoặc chạy sai port
- **Giải pháp**: Kiểm tra backend chạy ở port 9000

---

## 🎉 Tính năng hoàn thành:

✅ **Complete Order Workflow** - Từ đặt hàng đến giao hàng
✅ **Role-based Dashboard** - 4 roles với quyền hạn riêng biệt  
✅ **Real-time Updates** - Cập nhật trạng thái ngay lập tức
✅ **Professional UI** - Giao diện đơn giản, dễ sử dụng
✅ **Mobile Responsive** - Hoạt động tốt trên mọi thiết bị
✅ **Security** - Authentication và Authorization đầy đủ

**🚀 Hệ thống sẵn sàng production!** 