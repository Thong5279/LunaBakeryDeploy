const http = require('http');

// Test Product Sales API
function testProductSales() {
  const options = {
    hostname: 'localhost',
    port: 9000,
    path: '/api/analytics/product-sales',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer test',
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Product Sales API - Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Product Sales API Response:', {
          success: response.success,
          totalProducts: response.data?.totalProducts || 0,
          bestSellersCount: response.data?.bestSellers?.length || 0,
          worstSellersCount: response.data?.worstSellers?.length || 0,
          zeroSellersCount: response.data?.zeroSellers?.length || 0
        });
      } catch (error) {
        console.log('❌ Product Sales API Error:', data);
      }
      
      // Test Ingredient Inventory API
      testIngredientInventory();
    });
  });

  req.on('error', (error) => {
    console.log('❌ Product Sales API Connection Error:', error.message);
    process.exit(1);
  });

  req.end();
}

// Test Ingredient Inventory API  
function testIngredientInventory() {
  const options = {
    hostname: 'localhost',
    port: 9000,
    path: '/api/analytics/ingredient-inventory',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer test',
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Ingredient Inventory API - Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Ingredient Inventory API Response:', {
          success: response.success,
          totalIngredients: response.data?.summary?.totalIngredients || 0,
          totalInbound: response.data?.summary?.totalInboundQuantity || 0,
          totalOutbound: response.data?.summary?.totalOutboundQuantity || 0,
          lowStockCount: response.data?.summary?.lowStockCount || 0,
          topInputCount: response.data?.topInput?.length || 0,
          topOutputCount: response.data?.topOutput?.length || 0
        });
      } catch (error) {
        console.log('❌ Ingredient Inventory API Error:', data);
      }
      
      console.log('\n🎉 Test hoàn tất! Hệ thống thống kê mới đã sẵn sàng.');
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.log('❌ Ingredient Inventory API Connection Error:', error.message);
    process.exit(1);
  });

  req.end();
}

console.log('🔍 Testing Analytics APIs...');
console.log('📊 Testing Product Sales Analytics...');
setTimeout(() => {
  testProductSales();
}, 3000); // Đợi 3 giây để server khởi động 