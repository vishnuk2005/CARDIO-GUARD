/**
 * Health Assessment Model
 * Stores user health assessments and predictions
 */

const mongoose = require('mongoose');

const healthAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Heart Risk Prediction Data
  heartRiskData: {
    age: Number,
    sex: Number,
    cp: Number,
    trtbps: Number,
    chol: Number,
    fbs: Number,
    restecg: Number,
    thalachh: Number,
    exng: Number,
    oldpeak: Number,
    slp: Number,
    caa: Number,
    thall: Number
  },
  
  // Heart Risk Results
  heartRisk: {
    probability: Number,
    risk: String  // Low, Medium, High
  },
  
  // Lifestyle Score Data
  lifestyleData: {
    smoking: String,
    exercise_minutes_week: Number,
    diet_rating: Number,
    sleep_hours: Number
  },
  
  // Lifestyle Score Result
  lifestyleScore: Number,
  
  // BMI Data
  bmiData: {
    weight_kg: Number,
    height_cm: Number
  },
  
  // BMI Result
  bmi: {
    value: Number,
    category: String  // Underweight, Normal, Overweight, Obese
  },
  
  // Overall Assessment
  overallScore: Number,  // Composite score
  recommendations: [String],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
healthAssessmentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('HealthAssessment', healthAssessmentSchema);

