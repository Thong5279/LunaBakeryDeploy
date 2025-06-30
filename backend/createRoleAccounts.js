const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

const createTestAccounts = async () => {
    try {
        // Kiểm tra và tạo tài khoản baker test
        const existingBaker = await User.findOne({ email: 'baker@lunabakery.com' });
        if (!existingBaker) {
            const hashedPassword = await bcrypt.hash('baker123', 10);
            const baker = new User({
                name: 'Thợ làm bánh Test',
                email: 'baker@lunabakery.com',
                password: hashedPassword,
                role: 'baker'
            });
            await baker.save();
            console.log('✅ Tài khoản baker test đã được tạo');
        } else {
            console.log('ℹ️ Tài khoản baker test đã tồn tại');
        }

        // Kiểm tra và tạo tài khoản delivery test
        const existingDelivery = await User.findOne({ email: 'delivery@lunabakery.com' });
        if (!existingDelivery) {
            const hashedPassword = await bcrypt.hash('delivery123', 10);
            const delivery = new User({
                name: 'Nhân viên giao hàng Test',
                email: 'delivery@lunabakery.com',
                password: hashedPassword,
                role: 'shipper'
            });
            await delivery.save();
            console.log('✅ Tài khoản delivery test đã được tạo');
        } else {
            console.log('ℹ️ Tài khoản delivery test đã tồn tại');
        }

        console.log('\n🎯 Tóm tắt tài khoản test:');
        console.log('----------------------------------------');
        console.log('👑 Admin: admin@lunabakery.com / admin123');
        console.log('👨‍💼 Manager: manager@lunabakery.com / manager123');
        console.log('🧑‍🍳 Baker: baker@lunabakery.com / baker123');
        console.log('🚚 Delivery: delivery@lunabakery.com / delivery123');
        console.log('----------------------------------------');

    } catch (error) {
        console.error('❌ Lỗi khi tạo tài khoản test:', error.message);
    }
};

const main = async () => {
    await connectDB();
    await createTestAccounts();
    await mongoose.connection.close();
    console.log('\n✅ Hoàn thành! Database connection đã đóng.');
};

main(); 