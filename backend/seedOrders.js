const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const seedOrders = async () => {
  try {
    await connectDB();

    // Lấy một user và product từ database để tạo order
    const users = await User.find({});
    const products = await Product.find({});

    if (users.length === 0 || products.length === 0) {
      console.log("Cần có ít nhất 1 user và 1 product trong database để tạo orders");
      process.exit(1);
    }

    // Xóa orders cũ
    await Order.deleteMany({});
    console.log("Đã xóa orders cũ");

    const testOrders = [];
    const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Tạo orders cho 30 ngày qua
    for (let i = 0; i < 20; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
      
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = randomProduct.price || 100000;
      const totalPrice = price * quantity;
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      const order = {
        user: randomUser._id,
        orderItems: [{
          productId: randomProduct._id,
          name: randomProduct.name,
          image: randomProduct.images?.[0] || "default.jpg",
          price: price,
          size: randomProduct.sizes?.[0] || "M",
          flavor: randomProduct.flavors?.[0] || "Original",
          quantity: quantity
        }],
        shippingAddress: {
          name: `Khách hàng ${i + 1}`,
          address: `123 Đường ABC ${i + 1}`,
          city: "TP.HCM",
          phonenumber: "0123456789"
        },
        paymentMethod: "PayPal",
        totalPrice: totalPrice,
        isPaid: randomStatus === 'Delivered' || Math.random() > 0.5,
        isDelivered: randomStatus === 'Delivered',
        status: randomStatus,
        paidAt: randomStatus === 'Delivered' ? randomDate : null,
        deliveredAt: randomStatus === 'Delivered' ? randomDate : null,
        createdAt: randomDate,
        updatedAt: randomDate
      };

      testOrders.push(order);
    }

    await Order.insertMany(testOrders);
    console.log(`Đã tạo thành công ${testOrders.length} orders test`);

    // Hiển thị thống kê
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const totalRevenue = await Order.aggregate([
      { $match: { $or: [{ status: 'Delivered' }, { isPaid: true }] } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    console.log("\n=== THỐNG KÊ ===");
    console.log(`Tổng số orders: ${totalOrders}`);
    console.log(`Orders đã giao: ${deliveredOrders}`);
    console.log(`Tổng doanh thu: ${totalRevenue[0]?.total || 0} VND`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding orders:", error);
    process.exit(1);
  }
};

// Chạy script
if (require.main === module) {
  seedOrders();
}

module.exports = { seedOrders }; 