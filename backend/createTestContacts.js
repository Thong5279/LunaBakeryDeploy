const mongoose = require('mongoose');
const Contact = require('./models/Contact');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://phamhuynhthong192:9ZxBbJzObQkMsPEG@cluster0.atfobpb.mongodb.net/lunabakery?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testContacts = [
  {
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0912345678',
    subject: 'Hỏi về bánh sinh nhật',
    message: 'Chào Luna Bakery, tôi muốn đặt bánh sinh nhật cho con gái. Bánh có thể tùy chỉnh theo yêu cầu không?',
    status: 'new',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 ngày trước
  },
  {
    name: 'Trần Thị Bình',
    email: 'tranthibinh@yahoo.com',
    phone: '0987654321',
    subject: 'Đặt bánh cưới',
    message: 'Tôi cần đặt bánh cưới cho đám cưới vào cuối tháng. Có thể tư vấn về mẫu bánh và giá cả không?',
    status: 'read',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 ngày trước
  },
  {
    name: 'Lê Văn Cường',
    email: 'levancuong@hotmail.com',
    phone: '0901234567',
    subject: 'Phản hồi về dịch vụ',
    message: 'Cảm ơn Luna Bakery đã cung cấp dịch vụ tuyệt vời. Bánh rất ngon và giao hàng đúng giờ. Sẽ ủng hộ thường xuyên!',
    status: 'replied',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 ngày trước
  },
  {
    name: 'Phạm Thị Dung',
    email: 'phamthidung@gmail.com',
    phone: '0976543210',
    subject: 'Hỏi về nguyên liệu',
    message: 'Tôi muốn mua nguyên liệu làm bánh. Có thể tư vấn về các loại bột và kem không?',
    status: 'new',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 giờ trước
  },
  {
    name: 'Hoàng Văn Em',
    email: 'hoangvanem@yahoo.com',
    phone: '0961234567',
    subject: 'Đặt bánh theo yêu cầu',
    message: 'Tôi muốn đặt bánh theo thiết kế riêng. Có thể gửi hình ảnh mẫu để tham khảo không?',
    status: 'read',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 giờ trước
  },
  {
    name: 'Vũ Thị Phương',
    email: 'vuthiphuong@gmail.com',
    phone: '0951234567',
    subject: 'Hỏi về thời gian giao hàng',
    message: 'Tôi đặt bánh cho sự kiện vào ngày mai. Có thể giao hàng vào buổi sáng không?',
    status: 'new',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 giờ trước
  },
  {
    name: 'Đặng Văn Giang',
    email: 'dangvangiang@hotmail.com',
    phone: '0941234567',
    subject: 'Phản hồi tích cực',
    message: 'Bánh của Luna Bakery rất ngon! Đặc biệt là bánh tiramisu. Cảm ơn đội ngũ nhân viên nhiệt tình.',
    status: 'replied',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 ngày trước
  },
  {
    name: 'Ngô Thị Hoa',
    email: 'ngothihoa@gmail.com',
    phone: '0931234567',
    subject: 'Đặt bánh cho công ty',
    message: 'Công ty chúng tôi muốn đặt bánh cho sự kiện team building. Cần khoảng 50 phần bánh nhỏ.',
    status: 'read',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 giờ trước
  },
  {
    name: 'Lý Văn Inh',
    email: 'lyvaninh@yahoo.com',
    phone: '0921234567',
    subject: 'Hỏi về bánh chay',
    message: 'Tôi cần đặt bánh chay cho gia đình. Có những loại bánh chay nào?',
    status: 'new',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 giờ trước
  },
  {
    name: 'Bùi Thị Kim',
    email: 'buithikim@gmail.com',
    phone: '0911234567',
    subject: 'Đặt bánh online',
    message: 'Tôi muốn đặt bánh qua website. Có thể thanh toán online không?',
    status: 'new',
    createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 phút trước
  }
];

async function createTestContacts() {
  try {
    // Xóa dữ liệu cũ
    await Contact.deleteMany({});
    console.log('✅ Đã xóa dữ liệu tin nhắn cũ');

    // Tạo dữ liệu mới
    const createdContacts = await Contact.insertMany(testContacts);
    console.log(`✅ Đã tạo ${createdContacts.length} tin nhắn mẫu`);

    // Hiển thị thống kê
    const total = await Contact.countDocuments();
    const newMessages = await Contact.countDocuments({ status: 'new' });
    const readMessages = await Contact.countDocuments({ status: 'read' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });

    console.log('\n📊 Thống kê tin nhắn:');
    console.log(`- Tổng tin nhắn: ${total}`);
    console.log(`- Tin mới: ${newMessages}`);
    console.log(`- Đã đọc: ${readMessages}`);
    console.log(`- Đã trả lời: ${repliedMessages}`);

    mongoose.connection.close();
    console.log('\n✅ Hoàn thành tạo dữ liệu mẫu!');
  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', error);
    mongoose.connection.close();
  }
}

createTestContacts(); 