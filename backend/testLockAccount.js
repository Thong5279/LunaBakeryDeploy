require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testLockAccount = async () => {
  try {
    console.log('🧪 Đang test tính năng khoá tài khoản...');
    
    // Tìm một user để test
    const testUser = await User.findOne({ role: 'customer' });
    
    if (!testUser) {
      console.log('❌ Không tìm thấy user để test');
      return;
    }
    
    console.log(`📋 User test: ${testUser.name} (${testUser.email})`);
    console.log(`🔒 Trạng thái hiện tại: ${testUser.isLocked ? 'Đã khoá' : 'Hoạt động'}`);
    
    // Khoá tài khoản
    testUser.isLocked = true;
    await testUser.save();
    console.log('🔒 Đã khoá tài khoản test');
    
    // Kiểm tra lại
    const updatedUser = await User.findById(testUser._id);
    console.log(`🔒 Trạng thái sau khi khoá: ${updatedUser.isLocked ? 'Đã khoá' : 'Hoạt động'}`);
    
    // Mở khoá tài khoản
    updatedUser.isLocked = false;
    await updatedUser.save();
    console.log('🔓 Đã mở khoá tài khoản test');
    
    // Kiểm tra lại
    const finalUser = await User.findById(testUser._id);
    console.log(`🔓 Trạng thái sau khi mở khoá: ${finalUser.isLocked ? 'Đã khoá' : 'Hoạt động'}`);
    
    console.log('✅ Test tính năng khoá tài khoản thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi khi test:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối database');
  }
};

testLockAccount(); 