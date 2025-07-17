const mongoose = require('mongoose');
const User = require('./models/User');

// Kết nối database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateUserSchema = async () => {
  try {
    console.log('🔄 Đang cập nhật schema user...');
    
    // Cập nhật tất cả user hiện tại để thêm trường isLocked = false
    const result = await User.updateMany(
      { isLocked: { $exists: false } },
      { $set: { isLocked: false } }
    );
    
    console.log(`✅ Đã cập nhật ${result.modifiedCount} user với trường isLocked = false`);
    
    // Kiểm tra kết quả
    const totalUsers = await User.countDocuments();
    const usersWithIsLocked = await User.countDocuments({ isLocked: { $exists: true } });
    
    console.log(`📊 Tổng số user: ${totalUsers}`);
    console.log(`📊 Số user có trường isLocked: ${usersWithIsLocked}`);
    
    if (totalUsers === usersWithIsLocked) {
      console.log('✅ Tất cả user đã được cập nhật thành công!');
    } else {
      console.log('⚠️ Có một số user chưa được cập nhật');
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật schema:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối database');
  }
};

// Chạy script
updateUserSchema(); 