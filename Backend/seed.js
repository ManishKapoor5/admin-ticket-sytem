const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust path to your User model

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@company.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin',
      level: 'L3',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@company.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();