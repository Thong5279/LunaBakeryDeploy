const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('🧪 Testing login API...');
    
    // Test server connection first
    try {
      const healthCheck = await axios.get('http://localhost:9000/api/products');
      console.log('✅ Server is running and reachable');
    } catch (error) {
      console.log('❌ Server is not running or not reachable');
      console.log('   Please start the backend server with: npm start');
      return;
    }

    // Test login with admin account (assuming it exists)
    console.log('\n📝 Testing admin login...');
    try {
      const adminResponse = await axios.post('http://localhost:9000/api/users/login', {
        email: 'admin@lunabakery.com',
        password: 'admin123'
      });
      console.log('✅ Admin login successful');
      console.log(`👤 Admin user: ${adminResponse.data.user.name} (${adminResponse.data.user.role})`);
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    }

    // Test login with manager account
    console.log('\n📝 Testing manager login...');
    try {
      const managerResponse = await axios.post('http://localhost:9000/api/users/login', {
        email: 'manager@lunabakery.com',
        password: 'manager123'
      });
      console.log('✅ Manager login successful');
      console.log(`👤 Manager user: ${managerResponse.data.user.name} (${managerResponse.data.user.role})`);
    } catch (error) {
      console.log('❌ Manager login failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ General error:', error.message);
  }
};

testLogin(); 