const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb+srv://phamhuynhthong192:9ZxBbJzObQkMsPEG@cluster0.atfobpb.mongodb.net/lunabakery?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function createTestAccounts() {
  try {
    console.log('\n🔧 Creating/Updating test accounts...\n');

    // Test accounts to create/update
    const testAccounts = [
      {
        name: 'Admin Luna Bakery',
        email: 'admin@lunabakery.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Manager Luna Bakery',
        email: 'manager@lunabakery.com', 
        password: 'manager123',
        role: 'manager'
      }
    ];

    for (const account of testAccounts) {
      console.log(`Processing: ${account.email}`);
      
      // Check if user exists
      let user = await User.findOne({ email: account.email });
      
      if (user) {
        console.log(`✅ User exists, updating password...`);
        // Update password (will be hashed automatically by pre-save middleware)
        user.password = account.password;
        user.name = account.name; // Also update name to be consistent
        await user.save();
        console.log(`🔄 Updated existing user: ${user.name} (${user.role})`);
      } else {
        console.log(`➕ Creating new user...`);
        // Create new user
        user = new User({
          name: account.name,
          email: account.email,
          password: account.password,
          role: account.role
        });
        await user.save();
        console.log(`✅ Created new user: ${user.name} (${user.role})`);
      }
      
      // Test the password immediately after creation/update
      const isMatch = await user.matchPassword(account.password);
      console.log(`🔐 Password test: ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
      console.log('');
    }

    console.log('\n🎉 All test accounts processed successfully!\n');

    // Show all admin/manager users
    console.log('📋 Current admin/manager users:');
    const adminUsers = await User.find({ role: { $in: ['admin', 'manager'] } });
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n📊 Database connection closed. You can now test login!');
    process.exit(0);
  }
}

createTestAccounts(); 