const axios = require('axios');

const API_URL = 'http://localhost:9000';

async function testReviewAPI() {
    try {
        console.log('Testing Review API...\n');

        // Test 1: Lấy tất cả reviews
        console.log('1. Lấy tất cả reviews:');
        const allReviews = await axios.get(`${API_URL}/api/reviews`);
        console.log('Count:', allReviews.data.length);
        allReviews.data.forEach(review => {
            console.log(`  - ${review.product?.name || 'NULL'} (${review.itemType}) - ${review.rating} sao`);
        });

        // Test 2: Lấy reviews theo sản phẩm Coffee
        console.log('\n2. Lấy reviews theo sản phẩm Coffee:');
        const productReviews = await axios.get(`${API_URL}/api/reviews?product=686582309835660226449e74&itemType=Product&status=approved`);
        console.log('Count:', productReviews.data.length);
        productReviews.data.forEach(review => {
            console.log(`  - ${review.product?.name || 'NULL'} - ${review.rating} sao: ${review.comment}`);
        });

        // Test 3: Lấy reviews theo nguyên liệu Đường mía
        console.log('\n3. Lấy reviews theo nguyên liệu Đường mía:');
        const ingredientReviews = await axios.get(`${API_URL}/api/reviews?product=686d2eccf536995f0bcda777&itemType=Ingredient&status=approved`);
        console.log('Count:', ingredientReviews.data.length);
        ingredientReviews.data.forEach(review => {
            console.log(`  - ${review.product?.name || 'NULL'} - ${review.rating} sao: ${review.comment}`);
        });

        // Test 4: Lấy reviews theo nguyên liệu Bơ đậu phộng
        console.log('\n4. Lấy reviews theo nguyên liệu Bơ đậu phộng:');
        const ingredientReviews2 = await axios.get(`${API_URL}/api/reviews?product=686d2db5f536995f0bcda744&itemType=Ingredient&status=approved`);
        console.log('Count:', ingredientReviews2.data.length);
        ingredientReviews2.data.forEach(review => {
            console.log(`  - ${review.product?.name || 'NULL'} - ${review.rating} sao: ${review.comment}`);
        });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testReviewAPI(); 