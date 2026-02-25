const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  company: String,
  role: String,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saas-app');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users
    const users = [
      {
        name: 'Demo Admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        company: 'SaaS Inc.',
        role: 'admin',
        isActive: true,
      },
      {
        name: 'John Manager',
        email: 'manager@example.com',
        password: await bcrypt.hash('password123', 10),
        company: 'SaaS Inc.',
        role: 'manager',
        isActive: true,
      },
      {
        name: 'Jane User',
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
        company: 'SaaS Inc.',
        role: 'user',
        isActive: true,
      },
    ];

    await User.insertMany(users);
    console.log('Users created successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Manager: manager@example.com / password123');
    console.log('User: user@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();
