/**
 * Cardio Guard Backend Server
 * Node.js + Express + MongoDB
 */

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/config');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [config.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/health', require('./routes/health'));
app.use('/api/therapy', require('./routes/therapy'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cardio Guard Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health'
    },
    mlService: config.ML_SERVICE_URL
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('  CARDIO GUARD BACKEND SERVER');
  console.log('='.repeat(60));
  console.log(`  Status: Running in ${config.NODE_ENV} mode`);
  console.log(`  Server: http://localhost:${PORT}`);
  console.log(`  ML Service: ${config.ML_SERVICE_URL}`);
  console.log('='.repeat(60));
  console.log('');
  console.log('  Available Routes:');
  console.log(`    GET  /                     - API info`);
  console.log(`    GET  /health               - Health check`);
  console.log(`    POST /api/auth/register    - Register user`);
  console.log(`    POST /api/auth/login       - Login user`);
  console.log(`    POST /api/health/assessment - Complete health assessment`);
  console.log(`    POST /api/health/predict   - Heart risk prediction`);
  console.log(`    GET  /api/health/history   - Get assessment history`);
  console.log(`    POST /api/therapy/generate - Generate AI therapy plan`);
  console.log(`    GET  /api/therapy/templates - Get therapy templates`);
  console.log('='.repeat(60));
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit
  process.exit(1);
});
module.exports = app;

