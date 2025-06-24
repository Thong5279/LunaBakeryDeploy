const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoutes");
const cartRoute = require("./routes/cartRoutes");
const checkoutRoute = require("./routes/checkoutRoutes");
const orderRoute = require("./routes/orderroutes");
const uploadRoute = require("./routes/uploadRoutes");
const subscriberRoute = require("./routes/subscribeRoute");
const adminRoute = require("./routes/adminRoutes");
const productAdminRoute = require("./routes/productAdminRoutes");
const adminOrderRoute = require("./routes/adminOrderRoutes");
const analyticsRoute = require("./routes/analyticsRoutes");


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

//kết nối với MongoDB 
connectDB();

app.get("/",(req, res) => {
    res.send("XIN CHAO Api Lunabakery!");
});

//API Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/subscribe", subscriberRoute);
//admin routes
app.use("/api/admin/users", adminRoute);
app.use("/api/admin/products", productAdminRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/analytics", analyticsRoute);





app.listen(PORT, () => {
    console.log(`Server chay tren http://localhost:${PORT}`);
});