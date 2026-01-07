/**
 * Configuration settings for Cardio Guard Backend
 * Copy this to .env file and update values
 */

require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cardio_guard',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'cardio_guard_secret_key_change_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // ML Service
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  
  // Gemini AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyAPq1xlQHJv8ROJrW8WowzNXA6RdWMg2HA',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  
  // CORS
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};

/*
Create a .env file with:

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cardio_guard
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:3000
*/

