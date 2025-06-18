// ! USE WITH CAUTION: This script will drop the entire database.

// dropDatabase.js
const mongoose = require('mongoose');

// Change this to your actual connection string
const MONGO_URI = 'mongodb://localhost:27017/eth-monitor'; 

async function dropDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop the entire database
    await db.dropDatabase();
    console.log('✅ Database dropped successfully');

  } catch (err) {
    console.error('❌ Failed to drop database:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

dropDatabase();
