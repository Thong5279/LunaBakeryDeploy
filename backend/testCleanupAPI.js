const axios = require('axios');

const API_BASE_URL = 'http://localhost:9000/api';

async function testCleanupAPI() {
  try {
    console.log('🧪 Testing Flash Sale Cleanup API');
    
    // Test cleanup expired flash sales
    console.log('\n1️⃣ Testing cleanup expired flash sales...');
    const cleanupResponse = await axios.post(`${API_BASE_URL}/flash-sales/cleanup-expired`);
    console.log('✅ Cleanup Response:', cleanupResponse.data);
    
    // Test sync cart prices for a specific flash sale
    console.log('\n2️⃣ Testing sync cart prices...');
    const flashSaleId = '6873d8dedc4311a81507de4b'; // Flash sale ID từ test trước
    const syncResponse = await axios.post(`${API_BASE_URL}/flash-sales/${flashSaleId}/sync-cart-prices`);
    console.log('✅ Sync Response:', syncResponse.data);
    
    // Test cleanup specific flash sale
    console.log('\n3️⃣ Testing cleanup specific flash sale...');
    const specificCleanupResponse = await axios.post(`${API_BASE_URL}/flash-sales/${flashSaleId}/cleanup-cart`);
    console.log('✅ Specific Cleanup Response:', specificCleanupResponse.data);
    
  } catch (error) {
    console.error('❌ API Test Error:', error.response?.data || error.message);
  }
}

// Chạy test
testCleanupAPI(); 