const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

const createTestOrders = async () => {
    try {
        // Lấy user bất kỳ (không cần phải là customer)
        const user = await User.findOne();
        if (!user) {
            console.log('❌ Không tìm thấy user nào trong database.');
            return;
        }

        // Lấy sản phẩm đầu tiên
        const product = await Product.findOne();
        if (!product) {
            console.log('❌ Không tìm thấy sản phẩm nào. Hãy thêm sản phẩm trước.');
            return;
        }

        console.log(`👤 Sử dụng user: ${user.name} (${user.email})`);
        console.log(`📦 Sử dụng sản phẩm: ${product.name} - ${product.price} VNĐ`);

        // Tạo 3 test orders
        const testOrders = [
            {
                user: user._id,
                orderItems: [
                    {
                        productId: product._id,
                        name: product.name,
                        image: product.image || '/default-product.jpg',
                        price: product.price,
                        quantity: 2,
                        size: product.sizes?.[0]?.size || '',
                        flavor: product.flavors?.[0] || ''
                    }
                ],
                shippingAddress: {
                    name: 'Nguyễn Văn Test A',
                    address: '123 Đường Test, Quận Test',
                    city: 'TP.HCM',
                    phonenumber: '0123456789'
                },
                paymentMethod: 'cash',
                totalPrice: product.price * 2,
                isPaid: false,
                status: 'Processing'
            },
            {
                user: user._id,
                orderItems: [
                    {
                        productId: product._id,
                        name: product.name,
                        image: product.image || '/default-product.jpg',
                        price: product.price,
                        quantity: 1,
                        size: product.sizes?.[0]?.size || '',
                        flavor: product.flavors?.[0] || ''
                    }
                ],
                shippingAddress: {
                    name: 'Trần Thị Test B',
                    address: '456 Đường Test, Quận Test',
                    city: 'TP.HCM',
                    phonenumber: '0987654321'
                },
                paymentMethod: 'cash',
                totalPrice: product.price,
                isPaid: false,
                status: 'Processing'
            },
            {
                user: user._id,
                orderItems: [
                    {
                        productId: product._id,
                        name: product.name,
                        image: product.image || '/default-product.jpg',
                        price: product.price,
                        quantity: 3,
                        size: product.sizes?.[0]?.size || '',
                        flavor: product.flavors?.[0] || ''
                    }
                ],
                shippingAddress: {
                    name: 'Lê Văn Test C',
                    address: '789 Đường Test, Quận Test',  
                    city: 'TP.HCM',
                    phonenumber: '0111222333'
                },
                paymentMethod: 'cash',
                totalPrice: product.price * 3,
                isPaid: false,
                status: 'Processing'
            }
        ];

        // Xóa các test orders cũ nếu có
        await Order.deleteMany({ 
            'shippingAddress.name': { $regex: /Test/i }
        });
        console.log('🗑️ Đã xóa các test orders cũ');

        // Tạo test orders mới
        const createdOrders = await Order.insertMany(testOrders);
        
        console.log('✅ Đã tạo thành công các test orders:');
        createdOrders.forEach((order, index) => {
            console.log(`   📦 Order ${index + 1}: ${order._id.toString().slice(-8)} - ${order.shippingAddress.name} - ${order.totalPrice.toLocaleString()} VNĐ`);
        });

        console.log('\n🎯 Hướng dẫn test luồng công việc:');
        console.log('1. Đăng nhập manager@lunabakery.com để duyệt đơn hàng');
        console.log('2. Đăng nhập baker@lunabakery.com để làm bánh');
        console.log('3. Đăng nhập delivery@lunabakery.com để giao hàng');

    } catch (error) {
        console.error('❌ Lỗi khi tạo test orders:', error.message);
    }
};

const main = async () => {
    await connectDB();
    await createTestOrders();
    await mongoose.connection.close();
    console.log('\n✅ Hoàn thành! Database connection đã đóng.');
};

main(); 