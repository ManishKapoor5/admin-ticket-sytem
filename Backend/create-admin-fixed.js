// Create: Backend/create-admin-fixed.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Simple User schema - adjust if your schema is different
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'developer', 'client_management', 'client'], default: 'client' },
  level: { type: String, enum: ['L1', 'L2', 'L3'], default: 'L1' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    // Use the same database name as your server
    await mongoose.connect('mongodb://localhost:27017/ticket_management', {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@company.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('Email: admin@company.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin',
      level: 'L3',
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@company.com');
    console.log('🔑 Password: admin123');
    
    // Also create a developer user for testing
    const devPassword = await bcrypt.hash('dev123', 10);
    const devUser = new User({
      username: 'developer',
      email: 'developer@company.com',
      password: devPassword,
      role: 'developer',
      level: 'L2',
      isActive: true
    });

    await devUser.save();
    console.log('✅ Developer user created!');
    console.log('📧 Email: developer@company.com');
    console.log('🔑 Password: dev123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();