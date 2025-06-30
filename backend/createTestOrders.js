const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
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
        // Xóa các đơn hàng test cũ
        await Order.deleteMany({ 'user.name': /Test/i });
        console.log('🗑️ Đã xóa đơn hàng test cũ');

        // Tìm user admin để test
        let adminUser = await User.findOne({ email: 'admin@lunabakery.com' });
        let testUser = await User.findOne({ email: 'test@example.com' });
        
        // Nếu không có test user, tạo mới
        if (!testUser) {
            testUser = new User({
                name: 'Test Customer',
                email: 'test@example.com',
                password: 'test123',
                role: 'customer'
            });
            await testUser.save();
            console.log('👤 Đã tạo test customer');
        }

        const testOrders = [
            // 1. Processing - chờ quản lý duyệt
            {
                user: testUser._id,
                orderItems: [
                    {
                        name: 'Bánh sinh nhật vani',
                        quantity: 1,
                        price: 250000,
                        size: 'Nhỏ',
                        flavor: 'Vani'
                    }
                ],
                shippingAddress: {
                    name: 'Nguyễn Văn A',
                    address: '123 Đường ABC',
                    city: 'TP.HCM',
                    phonenumber: '0123456789'
                },
                totalPrice: 250000,
                status: 'Processing',
                createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 phút trước
            },

            // 2. Approved - chờ nhân viên làm bánh
            {
                user: testUser._id,
                orderItems: [
                    {
                        name: 'Bánh chocolate cao cấp',
                        quantity: 1,
                        price: 450000,
                        size: 'Vừa',
                        flavor: 'Chocolate'
                    },
                    {
                        name: 'Cupcake mix',
                        quantity: 6,
                        price: 120000,
                    }
                ],
                shippingAddress: {
                    name: 'Trần Thị B',
                    address: '456 Đường XYZ',
                    city: 'TP.HCM',
                    phonenumber: '0987654321'
                },
                totalPrice: 570000,
                status: 'Approved',
                createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 phút trước
            },

            // 3. Baking - đang làm bánh
            {
                user: testUser._id,
                orderItems: [
                    {
                        name: 'Bánh red velvet',
                        quantity: 1,
                        price: 380000,
                        size: 'Lớn',
                        flavor: 'Red Velvet'
                    }
                ],
                shippingAddress: {
                    name: 'Lê Văn C',
                    address: '789 Đường DEF',
                    city: 'TP.HCM',
                    phonenumber: '0369258147'
                },
                totalPrice: 380000,
                status: 'Baking',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 giờ trước
            },

            // 4. Ready - sẵn sàng giao hàng
            {
                user: testUser._id,
                orderItems: [
                    {
                        name: 'Bánh tiramisu',
                        quantity: 1,
                        price: 320000,
                        size: 'Vừa',
                        flavor: 'Tiramisu'
                    },
                    {
                        name: 'Bánh macaron',
                        quantity: 12,
                        price: 240000,
                    }
                ],
                shippingAddress: {
                    name: 'Phạm Thị D',
                    address: '321 Đường GHI',
                    city: 'TP.HCM',
                    phonenumber: '0741852963'
                },
                totalPrice: 560000,
                status: 'Ready',
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 giờ trước
            },

            // 5. Delivered - đã giao hàng thành công
            {
                user: testUser._id,
                orderItems: [
                    {
                        name: 'Bánh sinh nhật chocolate',
                        quantity: 1,
                        price: 350000,
                        size: 'Lớn',
                        flavor: 'Chocolate'
                    }
                ],
                shippingAddress: {
                    name: 'Hoàng Văn E',
                    address: '654 Đường JKL',
                    city: 'TP.HCM',
                    phonenumber: '0159753486'
                },
                totalPrice: 350000,
                status: 'Delivered',
                isDelivered: true,
                deliveredAt: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 ngày trước
            },

            // 6. Cancelled - đã hủy
            {
                user: testUser._id,
                orderItems: [
                    {
                        name: 'Bánh opera',
                        quantity: 1,
                        price: 280000,
                        size: 'Nhỏ',
                        flavor: 'Opera'
                    }
                ],
                shippingAddress: {
                    name: 'Vũ Thị F',
                    address: '987 Đường MNO',
                    city: 'TP.HCM',
                    phonenumber: '0852741963'
                },
                totalPrice: 280000,
                status: 'Cancelled',
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 giờ trước
            },

            // 7. CannotDeliver - không thể giao hàng
            {
                user: testUser._id,
                orderItems: [
                    {
                        name: 'Bánh cheesecake',
                        quantity: 1,
                        price: 300000,
                        size: 'Vừa',
                        flavor: 'Blueberry'
                    }
                ],
                shippingAddress: {
                    name: 'Đỗ Văn G',
                    address: '147 Đường PQR (địa chỉ không chính xác)',
                    city: 'TP.HCM',
                    phonenumber: '0963852741'
                },
                totalPrice: 300000,
                status: 'CannotDeliver',
                createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 giờ trước
            }
        ];

        // Tạo orders
        const createdOrders = await Order.insertMany(testOrders);
        
        console.log('\n🎉 ĐÃ TẠO THÀNH CÔNG CÁC ĐỚN HÀNG TEST:');
        console.log('════════════════════════════════════════════');
        
        createdOrders.forEach((order, index) => {
            const statusEmoji = {
                'Processing': '⏳',
                'Approved': '✅', 
                'Baking': '👨‍🍳',
                'Ready': '📦',
                'Delivered': '🚚',
                'Cancelled': '❌',
                'CannotDeliver': '🚫'
            };
            
            console.log(`${statusEmoji[order.status]} #${order._id.toString().slice(-8)} - ${order.status} - ${order.totalPrice.toLocaleString()} VNĐ`);
        });

        console.log('\n📊 THỐNG KÊ THEO TRẠNG THÁI:');
        console.log('════════════════════════════════════════════');
        const statusCount = createdOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        Object.entries(statusCount).forEach(([status, count]) => {
            const statusText = {
                'Processing': 'Đang xử lý',
                'Approved': 'Đã duyệt',
                'Baking': 'Đang làm bánh', 
                'Ready': 'Sẵn sàng giao hàng',
                'Delivered': 'Đã giao hàng',
                'Cancelled': 'Đã hủy',
                'CannotDeliver': 'Không thể giao hàng'
            };
            console.log(`${statusText[status]}: ${count} đơn hàng`);
        });

        console.log('\n🔗 TRUY CẬP ADMIN PANEL:');
        console.log('════════════════════════════════════════════');
        console.log('URL: http://localhost:5173/admin/orders');
        console.log('Login: admin@lunabakery.com / admin123');
        console.log('\n✨ Test data sẵn sàng cho demo!');

    } catch (error) {
        console.error('❌ Lỗi khi tạo test orders:', error);
    } finally {
        mongoose.connection.close();
    }
};

const main = async () => {
    await connectDB();
    await createTestOrders();
    await mongoose.connection.close();
    console.log('\n✅ Hoàn thành! Database connection đã đóng.');
};

main(); 