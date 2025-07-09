const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const session = require("express-session");
const passport = require("./config/passport");
const connectDB = require("./config/db")
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoutes");
const ingredientRoute = require("./routes/ingredientRoutes");
const cartRoute = require("./routes/cartRoutes");
const checkoutRoute = require("./routes/checkoutRoutes");
const orderRoute = require("./routes/orderroutes");
const uploadRoute = require("./routes/uploadRoutes");
const subscriberRoute = require("./routes/subscribeRoute");
const adminRoute = require("./routes/adminRoutes");
const productAdminRoute = require("./routes/productAdminRoutes");
const adminOrderRoute = require("./routes/adminOrderRoutes");
const adminIngredientRoute = require("./routes/adminIngredientRoutes");
const adminRecipeRoute = require("./routes/adminRecipeRoutes");
const analyticsRoute = require("./routes/analyticsRoutes");
const authRoute = require("./routes/authRoutes");
const paymentRoute = require("./routes/paymentRoutes");
const inventoryRoute = require("./routes/inventoryRoutes");
const managerOrderRoute = require("./routes/managerOrderRoutes");
const bakerOrderRoute = require("./routes/bakerOrderRoutes");
const bakerRecipeRoute = require("./routes/bakerRecipeRoutes");
const deliveryOrderRoute = require("./routes/deliveryOrderRoutes");


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join room for order updates
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`Client ${socket.id} joined room: order_${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to our router
app.set('io', io);

app.use(express.json());
app.use(cors());

// Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

//kết nối với MongoDB 
connectDB();

app.get("/",(req, res) => {
    res.send("XIN CHAO Api Lunabakery!");
});

//API Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/ingredients", ingredientRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/subscribe", subscriberRoute);
//admin routes
app.use("/api/admin/users", adminRoute);
app.use("/api/admin/products", productAdminRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/admin/ingredients", adminIngredientRoute);
app.use("/api/admin/recipes", adminRecipeRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/auth", authRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/inventory", inventoryRoute);
//role-based order routes
app.use("/api/manager/orders", managerOrderRoute);
app.use("/api/baker/orders", bakerOrderRoute);
app.use("/api/baker/recipes", bakerRecipeRoute);
app.use("/api/delivery/orders", deliveryOrderRoute);

server.listen(PORT, () => {
    console.log(`Server chay tren http://localhost:${PORT}`);
});
