const mongoose = require('mongoose');
const FlashSale = require('./models/FlashSale');

// Kết nối database
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://phamhuynhthong192:9ZxBbJzObQkMsPEG@cluster0.atfobpb.mongodb.net/lunabakery?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixFlashSales = async () => {
  try {
    console.log('🔧 Bắt đầu kiểm tra và sửa chữa Flash Sales...');
    
    const now = new Date();
    console.log('🕐 Thời gian hiện tại:', now.toISOString());
    
    // Lấy tất cả flash sales
    const allFlashSales = await FlashSale.find({});
    console.log(`📊 Tổng số Flash Sales: ${allFlashSales.length}`);
    
    for (const flashSale of allFlashSales) {
      console.log(`\n🔍 Kiểm tra Flash Sale: ${flashSale.name} (ID: ${flashSale._id})`);
      console.log(`   Start Date: ${flashSale.startDate.toISOString()}`);
      console.log(`   End Date: ${flashSale.endDate.toISOString()}`);
      console.log(`   Current Status: ${flashSale.status}`);
      
      // Kiểm tra và cập nhật status
      let newStatus = flashSale.status;
      
      if (flashSale.endDate < now) {
        newStatus = 'expired';
        console.log(`   ⚠️  Flash Sale đã hết hạn, cập nhật status thành 'expired'`);
      } else if (flashSale.startDate <= now && flashSale.endDate >= now) {
        newStatus = 'active';
        console.log(`   ✅ Flash Sale đang hoạt động, cập nhật status thành 'active'`);
      } else if (flashSale.startDate > now) {
        newStatus = 'inactive';
        console.log(`   ⏳ Flash Sale chưa bắt đầu, cập nhật status thành 'inactive'`);
      }
      
      if (newStatus !== flashSale.status) {
        await FlashSale.findByIdAndUpdate(flashSale._id, { status: newStatus });
        console.log(`   🔄 Đã cập nhật status từ '${flashSale.status}' thành '${newStatus}'`);
      } else {
        console.log(`   ✅ Status đã đúng: ${newStatus}`);
      }
    }
    
    // Kiểm tra active flash sales
    const activeFlashSales = await FlashSale.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: 'active',
      isActive: true
    });
    
    console.log(`\n🎉 Kết quả: Có ${activeFlashSales.length} Flash Sales đang hoạt động`);
    
    for (const flashSale of activeFlashSales) {
      console.log(`   - ${flashSale.name} (${flashSale.products.length} sản phẩm, ${flashSale.ingredients.length} nguyên liệu)`);
    }
    
    console.log('\n✅ Hoàn thành kiểm tra và sửa chữa Flash Sales!');
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    mongoose.connection.close();
  }
};

fixFlashSales(); 