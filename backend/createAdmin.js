const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Adjust path if needed

const MONGODB_URI = 'mongodb+srv://greatland:Greatland2044@cluster0.gkt7na9.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);

  const username = 'mike.greatland@gmail.com'; // Set your desired admin username
  const password = 'Gr8land#'; // Set your desired admin password

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    username,
    password: hashedPassword,
    role: 'admin'
  });

  await admin.save();
  console.log('Admin user created!');
  mongoose.disconnect();
}

createAdmin();