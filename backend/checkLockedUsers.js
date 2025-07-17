require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkLockedUsers = async () => {
  try {
    console.log('🔍 Đang kiểm tra user bị khoá...');
    
    // Kiểm tra tất cả user
    const allUsers = await User.find({});
    console.log(`📊 Tổng số user: ${allUsers.length}`);
    
    // Kiểm tra user có trường isLocked
    const usersWithIsLocked = await User.find({ isLocked: { $exists: true } });
    console.log(`📊 Số user có trường isLocked: ${usersWithIsLocked.length}`);
    
    // Kiểm tra user bị khoá
    const lockedUsers = await User.find({ isLocked: true });
    console.log(`🔒 Số user bị khoá: ${lockedUsers.length}`);
    
    if (lockedUsers.length > 0) {
      console.log('\n📋 Danh sách user bị khoá:');
      lockedUsers.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    } else {
      console.log('\n✅ Không có user nào bị khoá');
    }
    
    // Kiểm tra user không có trường isLocked
    const usersWithoutIsLocked = await User.find({ isLocked: { $exists: false } });
    console.log(`⚠️ Số user chưa có trường isLocked: ${usersWithoutIsLocked.length}`);
    
    if (usersWithoutIsLocked.length > 0) {
      console.log('\n📋 Danh sách user chưa có trường isLocked:');
      usersWithoutIsLocked.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối database');
  }
};

checkLockedUsers(); 