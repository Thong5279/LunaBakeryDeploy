const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const User = require('./models/User');

const products = require('./data/products');

dotenv.config();

//connect to database
mongoose.connect(process.env.MONGO_URI);

// Function to seed the database

const seedDatabase = async () => {
    try {
        //clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        //create a default admin user
        const createdUser = await User.create({
            name: 'Admin User',
            email: "admin@exampale.com",
            password: '123456',
            role: "admin"
        });

        // Assign the default user ID to each product
        const userID = createdUser._id;
        const sampleProducts = products.map(product => {
            return { ...product,user: userID };
        });

        // Insert products into the database
        await Product.insertMany(sampleProducts);

        console.log('Product Data seeded successfully');
        process.exit();
    } catch (error) {
        console.log("Error seeding data:", error);
        process.exit(1);
    }
};

seedDatabase()