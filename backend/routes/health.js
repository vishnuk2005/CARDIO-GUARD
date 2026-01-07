/**
 * Health Assessment Routes
 * Integrates with ML Service
 */

const express = require('express');
const router = express.Router();
const {
  getHealthAssessment,
  predictHeartRisk,
  calculateLifestyleScore,
  calculateBMI,
  getAssessmentHistory,
  getAssessmentById
} = require('../controllers/mlController');
const { protect, optionalAuth } = require('../middleware/auth');

// Comprehensive health assessment
router.post('/assessment', optionalAuth, getHealthAssessment);

// Individual ML endpoints
router.post('/predict', optionalAuth, predictHeartRisk);
router.post('/lifestyle-score', optionalAuth, calculateLifestyleScore);
router.post('/bmi', optionalAuth, calculateBMI);

// Assessment history (protected routes)
router.get('/history', protect, getAssessmentHistory);
router.get('/history/:id', protect, getAssessmentById);

module.exports = router;

