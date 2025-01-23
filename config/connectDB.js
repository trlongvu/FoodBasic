const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Kết nối database thành công');
  } catch (error) {
    console.log(`Kết nối database thất bại ${error}`);
  }
}

module.exports = connectDB;
