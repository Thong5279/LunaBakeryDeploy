// Script test timezone cho flash sale
const mongoose = require('mongoose');
require('dotenv').config();

const testTimezone = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const now = new Date();
    console.log('🕐 Current Time Debug:');
    console.log('  - ISO String:', now.toISOString());
    console.log('  - Local String:', now.toLocaleString('vi-VN'));
    console.log('  - UTC String:', now.toUTCString());
    console.log('  - Timezone Offset:', now.getTimezoneOffset(), 'minutes');
    console.log('  - Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Test tạo thời gian từ string
    const testDateString = '2024-01-15T18:30:00';
    const parsedDate = new Date(testDateString);
    
    console.log('\n📅 Test Date Parsing:');
    console.log('  - Original String:', testDateString);
    console.log('  - Parsed ISO:', parsedDate.toISOString());
    console.log('  - Parsed Local:', parsedDate.toLocaleString('vi-VN'));
    console.log('  - Parsed UTC:', parsedDate.toUTCString());

    // Test với thời gian hiện tại
    const currentTimeString = now.toISOString().slice(0, 16); // Format cho datetime-local
    console.log('\n🕐 Current Time for datetime-local:');
    console.log('  - Formatted:', currentTimeString);
    console.log('  - Parsed:', new Date(currentTimeString).toISOString());

    console.log('\n✅ Timezone test completed');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testTimezone(); 