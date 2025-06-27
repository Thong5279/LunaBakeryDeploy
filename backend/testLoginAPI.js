const axios = require('axios');

const BASE_URL = 'http://localhost:9000';

async function testLoginAPI() {
  console.log('\n🚀 Testing Login API...\n');

  // Test accounts
  const testAccounts = [
    { email: 'admin@lunabakery.com', password: 'admin123', role: 'admin' },
    { email: 'manager@lunabakery.com', password: 'manager123', role: 'manager' }
  ];

  for (const account of testAccounts) {
    try {
      console.log(`🔐 Testing login for: ${account.email}`);
      
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        email: account.email,
        password: account.password
      });

      if (response.status === 200) {
        console.log(`✅ Login SUCCESS!`);
        console.log(`   User: ${response.data.user.name}`);
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Token: ${response.data.token ? 'Generated' : 'Missing'}`);
        
        // Test protected route with token
        if (response.data.token) {
          try {
            const profileResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
              headers: {
                'Authorization': `Bearer ${response.data.token}`
              }
            });
            console.log(`✅ Profile access: SUCCESS`);
          } catch (profileError) {
            console.log(`❌ Profile access: FAILED - ${profileError.response?.data?.message || profileError.message}`);
          }
        }
      }

    } catch (error) {
      console.log(`❌ Login FAILED!`);
      console.log(`   Status: ${error.response?.status || 'No response'}`);
      console.log(`   Message: ${error.response?.data?.message || error.message}`);
    }
    
    console.log('');
  }

  // Test invalid credentials
  console.log('🚫 Testing invalid credentials...');
  try {
    await axios.post(`${BASE_URL}/api/users/login`, {
      email: 'admin@lunabakery.com',
      password: 'wrongpassword'
    });
  } catch (error) {
    console.log(`✅ Invalid credentials properly rejected: ${error.response?.data?.message}`);
  }

  console.log('\n✨ Login API test completed!\n');
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/api/users/profile`, {
      headers: { 'Authorization': 'Bearer invalid' }
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running! Please start the backend server first.');
      console.log('Run: npm start or node server.js in backend directory');
      process.exit(1);
    }
    // Other errors are fine (like 401 unauthorized)
  }
}

async function main() {
  await checkServer();
  await testLoginAPI();
}

main().catch(console.error); 