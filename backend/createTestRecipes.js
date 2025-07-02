const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./models/Recipe');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const sampleRecipes = [
  {
    name: 'Bánh kem dâu tây',
    description: 'Bánh kem mềm mịn với hương vị dâu tây tự nhiên, thích hợp cho sinh nhật và các dịp đặc biệt.',
    instructions: `Bước 1: Chuẩn bị nguyên liệu và làm nóng lò nướng ở 180°C
Bước 2: Đánh bông bơ và đường cho đến khi có màu trắng
Bước 3: Thêm trứng từng quả một, đánh đều
Bước 4: Rây bột mì và baking powder, trộn nhẹ tay
Bước 5: Đổ hỗn hợp vào khuôn, nướng 25-30 phút
Bước 6: Làm kem tươi và dâu tây trang trí
Bước 7: Lắp ráp bánh và trang trí hoàn thiện`,
    image: {
      url: 'https://example.com/strawberry-cake.jpg',
      altText: 'Bánh kem dâu tây'
    },
    category: 'Bánh kem',
    difficulty: 'Trung bình',
    preparationTime: 45,
    cookingTime: 30,
    servings: 8,
    ingredients: [
      { name: 'Bột mì đa dụng', quantity: 250, unit: 'g' },
      { name: 'Đường cát trắng', quantity: 200, unit: 'g' },
      { name: 'Bơ lạt', quantity: 150, unit: 'g' },
      { name: 'Trứng gà', quantity: 4, unit: 'quả' },
      { name: 'Baking powder', quantity: 2, unit: 'tsp' },
      { name: 'Sữa tươi', quantity: 120, unit: 'ml' },
      { name: 'Kem tươi', quantity: 300, unit: 'ml' },
      { name: 'Dâu tây tươi', quantity: 200, unit: 'g' },
      { name: 'Vanilla extract', quantity: 1, unit: 'tsp' }
    ],
    tags: ['sinh nhật', 'dâu tây', 'kem tươi', 'tráng miệng'],
    status: 'active',
    isPublished: true
  },
  {
    name: 'Bánh mì ngọt hạnh nhân',
    description: 'Bánh mì ngọt thơm phức với hạnh nhân rang, hoàn hảo cho bữa sáng hoặc trà chiều.',
    instructions: `Bước 1: Hòa men với sữa ấm và đường, để 10 phút
Bước 2: Trộn bột mì, muối trong tô lớn
Bước 3: Thêm hỗn hợp men, trứng và bơ, nhào bột 10 phút
Bước 4: Để bột nghỉ 1 giờ cho nở đôi
Bước 5: Chia bột thành các phần nhỏ, tạo hình
Bước 6: Phủ hạnh nhân lên mặt bánh
Bước 7: Nướng ở 180°C trong 20-25 phút`,
    image: {
      url: 'https://example.com/almond-bread.jpg',
      altText: 'Bánh mì ngọt hạnh nhân'
    },
    category: 'Bánh ngọt',
    difficulty: 'Dễ',
    preparationTime: 90,
    cookingTime: 25,
    servings: 12,
    ingredients: [
      { name: 'Bột mì bánh mì', quantity: 500, unit: 'g' },
      { name: 'Men nướng tươi', quantity: 10, unit: 'g' },
      { name: 'Đường trắng', quantity: 80, unit: 'g' },
      { name: 'Sữa tươi ấm', quantity: 200, unit: 'ml' },
      { name: 'Bơ lạt', quantity: 60, unit: 'g' },
      { name: 'Trứng gà', quantity: 2, unit: 'quả' },
      { name: 'Muối', quantity: 1, unit: 'tsp' },
      { name: 'Hạnh nhân bào', quantity: 100, unit: 'g' }
    ],
    tags: ['bánh mì', 'hạnh nhân', 'bữa sáng', 'ngọt'],
    status: 'active',
    isPublished: true
  },
  {
    name: 'Bánh cupcake chocolate',
    description: 'Bánh cupcake chocolate đậm đà với frosting kem tươi, hoàn hảo cho mọi dịp.',
    instructions: `Bước 1: Làm nóng lò nướng 175°C, lót giấy cupcake
Bước 2: Trộn bột mì, bột ca cao, baking powder và muối
Bước 3: Đánh bông bơ và đường, thêm trứng từng quả
Bước 4: Thêm hỗn hợp bột và sữa luân phiên
Bước 5: Đổ vào khuôn cupcake, nướng 18-20 phút
Bước 6: Làm frosting chocolate
Bước 7: Trang trí bánh khi đã nguội`,
    image: {
      url: 'https://example.com/chocolate-cupcake.jpg',
      altText: 'Bánh cupcake chocolate'
    },
    category: 'Bánh cupcake',
    difficulty: 'Dễ',
    preparationTime: 30,
    cookingTime: 20,
    servings: 12,
    ingredients: [
      { name: 'Bột mì đa dụng', quantity: 200, unit: 'g' },
      { name: 'Bột ca cao', quantity: 30, unit: 'g' },
      { name: 'Đường cát', quantity: 150, unit: 'g' },
      { name: 'Bơ lạt', quantity: 100, unit: 'g' },
      { name: 'Trứng gà', quantity: 2, unit: 'quả' },
      { name: 'Sữa tươi', quantity: 120, unit: 'ml' },
      { name: 'Baking powder', quantity: 1.5, unit: 'tsp' },
      { name: 'Muối', quantity: 0.5, unit: 'tsp' },
      { name: 'Kem tươi (frosting)', quantity: 200, unit: 'ml' },
      { name: 'Đường bột (frosting)', quantity: 100, unit: 'g' }
    ],
    tags: ['chocolate', 'cupcake', 'frosting', 'tiệc'],
    status: 'active',
    isPublished: true
  },
  {
    name: 'Bánh tart trứng',
    description: 'Bánh tart trứng kiểu Bồ Đào Nha với lớp custard mềm mịn và vỏ bánh giòn.',
    instructions: `Bước 1: Làm vỏ bánh tart với bột mì, bơ và nước
Bước 2: Cán mỏng, lót vào khuôn tart nhỏ
Bước 3: Nướng sơ vỏ bánh ở 200°C trong 10 phút
Bước 4: Pha custard với trứng, sữa, đường và vanilla
Bước 5: Đổ custard vào vỏ bánh
Bước 6: Nướng tiếp 15-18 phút cho đến khi custard đông
Bước 7: Để nguội và trang trí bột quế`,
    image: {
      url: 'https://example.com/egg-tart.jpg',
      altText: 'Bánh tart trứng'
    },
    category: 'Bánh tart',
    difficulty: 'Khó',
    preparationTime: 60,
    cookingTime: 25,
    servings: 16,
    ingredients: [
      { name: 'Bột mì đa dụng (vỏ)', quantity: 200, unit: 'g' },
      { name: 'Bơ lạt (vỏ)', quantity: 100, unit: 'g' },
      { name: 'Đường (vỏ)', quantity: 30, unit: 'g' },
      { name: 'Nước lạnh', quantity: 3, unit: 'tbsp' },
      { name: 'Trứng gà (custard)', quantity: 4, unit: 'quả' },
      { name: 'Sữa tươi (custard)', quantity: 200, unit: 'ml' },
      { name: 'Kem tươi (custard)', quantity: 100, unit: 'ml' },
      { name: 'Đường (custard)', quantity: 60, unit: 'g' },
      { name: 'Vanilla extract', quantity: 1, unit: 'tsp' },
      { name: 'Bột quế', quantity: 1, unit: 'tsp' }
    ],
    tags: ['tart', 'custard', 'Bồ Đào Nha', 'trứng'],
    status: 'active',
    isPublished: true
  },
  {
    name: 'Bánh cookies bơ',
    description: 'Bánh cookies bơ giòn tan, thơm ngon, hoàn hảo để thưởng thức cùng trà hoặc cà phê.',
    instructions: `Bước 1: Làm nóng lò nướng 180°C
Bước 2: Đánh bông bơ và đường cho đến khi nhạt màu
Bước 3: Thêm trứng và vanilla, đánh đều
Bước 4: Trộn bột mì, baking soda và muối
Bước 5: Thêm hỗn hợp bột vào bơ, trộn nhẹ
Bước 6: Tạo hình cookies tròn trên khay nướng
Bước 7: Nướng 12-15 phút cho đến khi vàng nhạt`,
    image: {
      url: 'https://example.com/butter-cookies.jpg',
      altText: 'Bánh cookies bơ'
    },
    category: 'Bánh cookies',
    difficulty: 'Dễ',
    preparationTime: 20,
    cookingTime: 15,
    servings: 24,
    ingredients: [
      { name: 'Bơ lạt', quantity: 200, unit: 'g' },
      { name: 'Đường cát trắng', quantity: 150, unit: 'g' },
      { name: 'Trứng gà', quantity: 1, unit: 'quả' },
      { name: 'Bột mì đa dụng', quantity: 300, unit: 'g' },
      { name: 'Baking soda', quantity: 0.5, unit: 'tsp' },
      { name: 'Muối', quantity: 0.25, unit: 'tsp' },
      { name: 'Vanilla extract', quantity: 1, unit: 'tsp' }
    ],
    tags: ['cookies', 'bơ', 'giòn', 'trà chiều'],
    status: 'active',
    isPublished: true
  }
];

const createTestRecipes = async () => {
  try {
    await connectDB();
    
    // Tìm một admin user để làm người tạo
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('⚠️ Không tìm thấy admin user. Cần tạo admin trước.');
      process.exit(1);
    }

    // Xóa tất cả recipes cũ
    await Recipe.deleteMany({});
    console.log('🗑️ Đã xóa tất cả công thức cũ');

    // Thêm createdBy và updatedBy cho tất cả recipes
    const recipesWithCreator = sampleRecipes.map(recipe => ({
      ...recipe,
      createdBy: adminUser._id,
      updatedBy: adminUser._id
    }));

    // Tạo recipes mới
    const recipes = await Recipe.insertMany(recipesWithCreator);
    console.log(`✅ Đã tạo ${recipes.length} công thức mẫu`);

    recipes.forEach(recipe => {
      console.log(`📝 ${recipe.name} - ${recipe.category} (${recipe.difficulty})`);
    });

    console.log('\n🎉 Hoàn thành tạo dữ liệu công thức mẫu!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo công thức mẫu:', error);
    process.exit(1);
  }
};

createTestRecipes(); 