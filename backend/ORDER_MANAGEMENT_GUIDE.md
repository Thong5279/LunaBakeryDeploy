# 🛍️ Hệ thống quản lý đơn hàng Luna Bakery

## 📋 Tổng quan

Hệ thống quản lý đơn hàng được thiết kế với luồng công việc phân quyền rõ ràng, đảm bảo mỗi role chỉ có thể thực hiện các thao tác phù hợp với chức năng của mình.

## 🔄 Luồng xử lý đơn hàng

```
Khách hàng đặt hàng → Đang xử lý (Processing)
                              ↓
                    Manager duyệt/hủy đơn hàng
                    ↙                    ↘
            Đã duyệt (Approved)     Đã hủy (Cancelled)
                    ↓
        Baker nhận và làm bánh
        ↙                    ↘
Đang làm bánh (Baking)    Đã làm xong (Ready)
                              ↓
                    Delivery giao hàng
                    ↙                    ↘
        Đã giao hàng (Delivered)    Không thể giao (CannotDeliver)
```

## 👥 Phân quyền Role

### 🔑 Tài khoản Test
- **Admin**: admin@lunabakery.com / admin123
- **Manager**: manager@lunabakery.com / manager123  
- **Baker**: baker@lunabakery.com / baker123
- **Delivery**: delivery@lunabakery.com / delivery123

### 📝 Quyền hạn từng Role

#### 👑 Admin
- **URL**: `/admin`
- **Quyền hạn**: Toàn quyền quản lý
- **Chức năng đơn hàng**: Xem tất cả đơn hàng, thay đổi trạng thái bất kỳ

#### 👨‍💼 Manager  
- **URL**: `/manager/orders`
- **Quyền hạn**: Duyệt và hủy đơn hàng
- **Chức năng**:
  - Xem đơn hàng có trạng thái `Processing`
  - Duyệt đơn hàng: `Processing` → `Approved`
  - Hủy đơn hàng: `Processing` → `Cancelled`

#### 🧑‍🍳 Baker (Thợ làm bánh)
- **URL**: `/baker/orders`  
- **Quyền hạn**: Quản lý sản xuất bánh
- **Chức năng**:
  - Xem đơn hàng có trạng thái `Approved`, `Baking`, `Ready`
  - Bắt đầu làm bánh: `Approved` → `Baking`
  - Hoàn thành làm bánh: `Baking` → `Ready`

#### 🚚 Delivery (Nhân viên giao hàng)
- **URL**: `/delivery/orders`
- **Quyền hạn**: Quản lý giao hàng  
- **Chức năng**:
  - Xem đơn hàng có trạng thái `Ready`, `CannotDeliver`, `Delivered`
  - Giao hàng thành công: `Ready` → `Delivered`
  - Không thể giao hàng: `Ready` → `CannotDeliver`

## 🏗️ Cấu trúc kỹ thuật

### Backend

#### Models
- **Order.js**: Cập nhật với 7 trạng thái mới
- **User.js**: Hỗ trợ roles: admin, customer, manager, baker, shipper

#### Middleware
- **authMiddleware.js**: Thêm middleware cho manager, baker, delivery

#### Routes
- `/api/manager/orders` - Routes cho manager
- `/api/baker/orders` - Routes cho baker  
- `/api/delivery/orders` - Routes cho delivery

#### Endpoints

##### Manager Routes
```
GET    /api/manager/orders           - Lấy đơn hàng Processing
PUT    /api/manager/orders/:id/approve  - Duyệt đơn hàng
PUT    /api/manager/orders/:id/cancel   - Hủy đơn hàng
```

##### Baker Routes  
```
GET    /api/baker/orders               - Lấy đơn hàng Approved/Baking/Ready
PUT    /api/baker/orders/:id/start-baking  - Bắt đầu làm bánh
PUT    /api/baker/orders/:id/complete     - Hoàn thành làm bánh
```

##### Delivery Routes
```
GET    /api/delivery/orders              - Lấy đơn hàng Ready/CannotDeliver/Delivered  
PUT    /api/delivery/orders/:id/delivered    - Đánh dấu đã giao hàng
PUT    /api/delivery/orders/:id/cannot-deliver - Đánh dấu không thể giao
```

### Frontend

#### Redux Slices
- **managerOrderSlice.js** - Quản lý state cho manager orders
- **bakerOrderSlice.js** - Quản lý state cho baker orders
- **deliveryOrderSlice.js** - Quản lý state cho delivery orders

#### Components
- **ManagerOrderManagement.jsx** - Giao diện quản lý đơn hàng cho manager
- **BakerOrderManagement.jsx** - Giao diện quản lý đơn hàng cho baker
- **DeliveryOrderManagement.jsx** - Giao diện quản lý đơn hàng cho delivery

#### Routes
```
/manager/orders   - Trang quản lý đơn hàng của manager
/baker/orders     - Trang quản lý đơn hàng của baker  
/delivery/orders  - Trang quản lý đơn hàng của delivery
```

## 🚀 Hướng dẫn sử dụng

### 1. Khởi động hệ thống
```bash
# Backend
cd backend
npm install
npm start

# Frontend  
cd frontend
npm install
npm run dev
```

### 2. Tạo tài khoản test (chỉ chạy 1 lần)
```bash
cd backend
node createTestRoleAccounts.js
```

### 3. Test luồng công việc

#### Bước 1: Tạo đơn hàng test
- Đăng nhập với tài khoản customer bất kỳ
- Thêm sản phẩm vào giỏ và đặt hàng
- Đơn hàng sẽ có trạng thái `Processing`

#### Bước 2: Manager duyệt đơn hàng  
- Đăng nhập: `manager@lunabakery.com` / `manager123`
- Vào `/manager/orders`
- Duyệt hoặc hủy đơn hàng

#### Bước 3: Baker làm bánh
- Đăng nhập: `baker@lunabakery.com` / `baker123`  
- Vào `/baker/orders`
- Bắt đầu làm bánh → Hoàn thành làm bánh

#### Bước 4: Delivery giao hàng
- Đăng nhập: `delivery@lunabakery.com` / `delivery123`
- Vào `/delivery/orders`  
- Đánh dấu đã giao hàng hoặc không thể giao

## 🎯 Tính năng chính

### ✅ Đã hoàn thành
- ✅ Hệ thống phân quyền role-based
- ✅ Luồng xử lý đơn hàng rõ ràng
- ✅ Giao diện quản lý đơn hàng cho từng role
- ✅ API endpoints đầy đủ
- ✅ Validation và error handling
- ✅ Real-time cập nhật trạng thái
- ✅ Responsive design

### 🔮 Có thể mở rộng trong tương lai
- 📊 Báo cáo thống kê theo role
- 📱 Notifications real-time
- 📧 Email thông báo  
- 🕒 Tracking thời gian xử lý
- 📋 Chi tiết đơn hàng với modal
- 🖨️ In đơn hàng cho baker/delivery

## 🛡️ Bảo mật

- ✅ JWT Authentication
- ✅ Role-based authorization  
- ✅ API route protection
- ✅ Input validation
- ✅ Error handling

## 📞 Lỗi thường gặp

### 403 Forbidden
- Kiểm tra role user có đúng không
- Kiểm tra token JWT có hợp lệ không

### Redux không hoạt động  
- Kiểm tra store.js đã import đúng slices chưa
- Kiểm tra useSelector sử dụng đúng state key

### Đơn hàng không hiển thị
- Kiểm tra trạng thái đơn hàng có phù hợp với role không
- Kiểm tra API endpoints có hoạt động không

---

**📝 Lưu ý**: Đây là hệ thống demo, trong production cần thêm nhiều tính năng bảo mật và validation khác. 