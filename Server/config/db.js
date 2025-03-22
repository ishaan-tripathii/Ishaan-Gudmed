import mongoose from 'mongoose';

const connectDB = async (retries = 5) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });
    console.log('Connected to MongoDB successfully');
    console.log('Database:', conn.connection.name);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }
    console.error('Failed to connect to MongoDB after multiple attempts');
    process.exit(1);
  }
};

export default connectDB;