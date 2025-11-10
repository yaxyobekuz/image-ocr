import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

let isConnected = false;

export const connectDB = async (mongoUri) => {
  if (isConnected) {
    logger.info('Using existing MongoDB connection');
    return;
  }

  try {
    const options = {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) || 10,
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE, 10) || 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoUri, options);
    
    isConnected = true;
    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      isConnected = false;
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const getConnectionStatus = () => isConnected;
