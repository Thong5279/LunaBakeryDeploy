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

## 🔐 Access Dashboard

| Portal | URL | Login Credentials |
|--------|-----|-------------------|
| **Manager Portal** | [http://localhost:5173/manager/orders](http://localhost:5173/manager/orders) | manager@lunabakery.com / manager123 |
| **Baker Portal** | [http://localhost:5173/baker/orders](http://localhost:5173/baker/orders) | baker@lunabakery.com / baker123 |
| **Delivery Portal** | [http://localhost:5173/delivery/orders](http://localhost:5173/delivery/orders) | delivery@lunabakery.com / delivery123 |

## 📊 Test Data Available

**Pre-loaded Orders (Processing Status):**
- Order A: ₫600,000 (Ready for manager approval)
- Order B: ₫300,000 (Ready for manager approval)  
- Order C: ₫900,000 (Ready for manager approval)

## ✅ System Health Check

1. **Backend API**: http://localhost:9000 (Should return server status)
2. **Frontend App**: http://localhost:5173 (Should load Luna Bakery homepage)
3. **Database**: MongoDB connection auto-verified on backend startup

## 🔄 Workflow Test Sequence

1. **Login as Manager** → Approve orders → Orders move to Baker queue
2. **Login as Baker** → Start baking → Complete baking → Orders move to Delivery
3. **Login as Delivery** → Mark as delivered → Complete order lifecycle

## 🚨 Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Port 9000 busy | Kill process: `npx kill-port 9000` |
| Port 5173 busy | Kill process: `npx kill-port 5173` |
| Authentication error | Clear browser cache + localStorage |
| No orders visible | Run: `cd backend && node createTestOrders.js` |

---

## 📖 Complete Documentation
- **Technical Guide**: `/backend/PROFESSIONAL_GUIDE.md`
- **Project Overview**: `/README.md`

**System Ready for Production Testing** ✅ 