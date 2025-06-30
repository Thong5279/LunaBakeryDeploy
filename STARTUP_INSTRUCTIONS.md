# 🚀 Luna Bakery - Quick Start Guide

## ⚡ Instant Deployment

### Step 1: Backend Service
```powershell
cd backend
npm start
```
**Expected Output**: `🚀 Server running on port 9000`

### Step 2: Frontend Application (New Terminal)
```powershell
cd frontend
npm run dev
```
**Expected Output**: `🎯 Local: http://localhost:5173`

### Step 3: Create Test Data (Optional)
```powershell
cd backend
node createTestOrders.js
```
**Expected Output**: 7 test orders with all workflow statuses

## 🔐 Access Dashboard

| Portal | URL | Login Credentials | Description |
|--------|-----|-------------------|-------------|
| **Admin Portal** | [http://localhost:5173/admin/orders](http://localhost:5173/admin/orders) | admin@lunabakery.com / admin123 | Tổng quan tất cả đơn hàng trong hệ thống |
| **Manager Portal** | [http://localhost:5173/manager/orders](http://localhost:5173/manager/orders) | manager@lunabakery.com / manager123 | Duyệt/hủy đơn hàng |
| **Baker Portal** | [http://localhost:5173/baker/orders](http://localhost:5173/baker/orders) | baker@lunabakery.com / baker123 | Quản lý sản xuất bánh |
| **Delivery Portal** | [http://localhost:5173/delivery/orders](http://localhost:5173/delivery/orders) | delivery@lunabakery.com / delivery123 | Quản lý giao hàng |

## 📊 System Overview - Admin Panel Features

### 🎯 **Trang Quản Lý Admin** - NEW!
**URL**: http://localhost:5173/admin/orders

**Features:**
- ✅ **Stats Overview**: 8 cards thống kê theo từng trạng thái
- ✅ **Full Workflow Visibility**: Xem tất cả đơn hàng và trạng thái hiện tại
- ✅ **Status Management**: Cập nhật trạng thái trực tiếp từ admin panel
- ✅ **Workflow Legend**: Hiểu rõ quy trình xử lý đơn hàng
- ✅ **Real-time Data**: Tự động refresh khi có thay đổi

**Workflow Stages:**
1. **Processing** (⏳): Chờ quản lý duyệt
2. **Approved** (✅): Chờ nhân viên làm bánh  
3. **Baking** (👨‍🍳): Đang sản xuất
4. **Ready** (📦): Sẵn sàng giao hàng
5. **Delivered** (🚚): Đã giao thành công
6. **Cancelled** (❌): Đã hủy bởi quản lý
7. **CannotDeliver** (🚫): Giao hàng thất bại

## 📊 Test Data Available

**Pre-loaded Orders (7 orders with different statuses):**
- ⏳ **Processing**: 1 order - ₫250,000 (Bánh sinh nhật vani)
- ✅ **Approved**: 1 order - ₫570,000 (Bánh chocolate + Cupcake)
- 👨‍🍳 **Baking**: 1 order - ₫380,000 (Bánh red velvet)
- 📦 **Ready**: 1 order - ₫560,000 (Bánh tiramisu + Macaron)
- 🚚 **Delivered**: 1 order - ₫350,000 (Bánh chocolate)
- ❌ **Cancelled**: 1 order - ₫280,000 (Bánh opera)
- 🚫 **CannotDeliver**: 1 order - ₫300,000 (Bánh cheesecake)

## ✅ System Health Check

1. **Backend API**: http://localhost:9000 (Should return server status)
2. **Frontend App**: http://localhost:5173 (Should load Luna Bakery homepage)
3. **Database**: MongoDB connection auto-verified on backend startup
4. **Admin Panel**: Admin can see all order statuses and workflow stages
5. **Role-based Access**: Each role only sees relevant orders

## 🔄 Complete Workflow Test Sequence

### **Option 1: Admin Overview Testing**
1. **Login as Admin** → View all orders across all statuses
2. **Check Stats Cards** → Verify counts match actual orders
3. **Update Status** → Change order status directly from admin panel
4. **View Workflow Legend** → Understand process flow

### **Option 2: Role-based Workflow Testing**
1. **Login as Manager** → Approve Processing orders → Orders move to Baker
2. **Login as Baker** → Start baking → Complete baking → Orders move to Delivery  
3. **Login as Delivery** → Mark as delivered → Complete order lifecycle
4. **Login as Admin** → Verify all status changes in overview

## 🚨 Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Port 9000 busy | Kill process: `npx kill-port 9000` |
| Port 5173 busy | Kill process: `npx kill-port 5173` |
| Authentication error | Clear browser cache + localStorage |
| No orders visible | Run: `cd backend && node createTestOrders.js` |
| Admin stats not updating | Refresh page or click "Thử lại" button |
| Status update fails | Check backend logs and ensure admin role |

## 🎯 Key Testing Scenarios

### **Admin Dashboard Testing**
- ✅ View comprehensive order statistics
- ✅ Monitor workflow progression  
- ✅ Update order statuses manually
- ✅ Track problematic orders (Cancelled/CannotDeliver)
- ✅ Verify role-based data accuracy

### **Workflow Integration Testing**  
- ✅ Manager actions reflect in admin dashboard
- ✅ Baker progress visible to admin
- ✅ Delivery status updates show in overview
- ✅ Real-time synchronization across all portals

---

## 📖 Complete Documentation
- **Technical Guide**: `/backend/PROFESSIONAL_GUIDE.md`
- **Project Overview**: `/README.md`
- **Order Management**: All roles integrated with admin oversight

**🏢 Enterprise Order Management System Ready for Production** ✅ 