const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect('mongodb+srv://phamhuynhthong192:9ZxBbJzObQkMsPEG@cluster0.atfobpb.mongodb.net/lunabakery?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function checkUsers() {
  try {
    console.log('\n🔍 Checking all users in database...\n');
    
    const users = await User.find({});
    console.log(`Total users found: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password (hashed): ${user.password.substring(0, 20)}...`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Test login for specific accounts
    console.log('\n🔐 Testing login...\n');
    
    // Test accounts
    const testAccounts = [
      { email: 'admin@lunabakery.com', password: 'admin123' },
      { email: 'manager@lunabakery.com', password: 'manager123' }
    ];

    for (const account of testAccounts) {
      console.log(`Testing login for: ${account.email}`);
      
      const user = await User.findOne({ email: account.email });
      if (user) {
        console.log(`✅ User found: ${user.name} (${user.role})`);
        
        const isMatch = await user.matchPassword(account.password);
        console.log(`🔑 Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
        
        // Also test direct bcrypt compare
        const directCompare = await bcrypt.compare(account.password, user.password);
        console.log(`🔐 Direct bcrypt compare: ${directCompare ? '✅ YES' : '❌ NO'}`);
        
        // Show first few chars of both
        console.log(`   Plain password: "${account.password}"`);
        console.log(`   Hashed password: ${user.password}`);
      } else {
        console.log(`❌ User not found!`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

checkUsers(); 