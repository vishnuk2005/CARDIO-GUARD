/**
 * ML Service Controller
 * Integrates with FastAPI ML Service
 */

const axios = require('axios');
const config = require('../config/config');
const HealthAssessment = require('../models/HealthAssessment');

const ML_SERVICE_URL = config.ML_SERVICE_URL;

/**
 * Get comprehensive health assessment
 * Calls all ML endpoints and combines results
 */
exports.getHealthAssessment = async (req, res) => {
  try {
    const { heartRiskData, lifestyleData, bmiData } = req.body;
    
    // Validate required data
    if (!heartRiskData || !lifestyleData || !bmiData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required data: heartRiskData, lifestyleData, or bmiData'
      });
    }

    // Call ML Service endpoints
    const [heartRiskResponse, lifestyleResponse, bmiResponse] = await Promise.all([
      axios.post(`${ML_SERVICE_URL}/predict`, heartRiskData),
      axios.post(`${ML_SERVICE_URL}/lifestyle_score`, lifestyleData),
      axios.post(`${ML_SERVICE_URL}/bmi`, bmiData)
    ]);

    // Extract results
    const heartRisk = heartRiskResponse.data;
    const lifestyleScore = lifestyleResponse.data.lifestyle_score;
    const bmi = bmiResponse.data;

    // Calculate overall score (weighted average)
    // Heart risk contributes negatively, lifestyle and BMI positively
    const heartRiskScore = (1 - heartRisk.probability) * 100;
    const bmiScore = bmi.category === 'Normal' ? 100 : 
                     bmi.category === 'Overweight' ? 70 :
                     bmi.category === 'Underweight' ? 60 : 40;
    
    const overallScore = (
      heartRiskScore * 0.5 +  // 50% weight
      lifestyleScore * 0.3 +  // 30% weight
      bmiScore * 0.2          // 20% weight
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      heartRisk,
      lifestyleScore,
      bmi,
      lifestyleData
    );

    // Save assessment to database if user is authenticated
    if (req.user) {
      const assessment = await HealthAssessment.create({
        user: req.user.id,
        heartRiskData,
        heartRisk: {
          probability: heartRisk.probability,
          risk: heartRisk.risk
        },
        lifestyleData,
        lifestyleScore,
        bmiData,
        bmi: {
          value: bmi.bmi,
          category: bmi.category
        },
        overallScore: Math.round(overallScore),
        recommendations
      });

      return res.status(200).json({
        success: true,
        data: {
          assessmentId: assessment._id,
          heartRisk,
          lifestyleScore,
          bmi,
          overallScore: Math.round(overallScore),
          recommendations
        }
      });
    }

    // Return results for non-authenticated users
    res.status(200).json({
      success: true,
      data: {
        heartRisk,
        lifestyleScore,
        bmi,
        overallScore: Math.round(overallScore),
        recommendations
      }
    });

  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    if (error.response) {
      // ML service returned an error
      return res.status(error.response.status).json({
        success: false,
        message: 'ML Service error',
        error: error.response.data
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'ML Service is not available. Please ensure it is running on ' + ML_SERVICE_URL
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during health assessment',
      error: error.message
    });
  }
};

/**
 * Get heart risk prediction only
 */
exports.predictHeartRisk = async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, req.body);
    
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    handleMLServiceError(error, res, 'Heart risk prediction');
  }
};

/**
 * Calculate lifestyle score only
 */
exports.calculateLifestyleScore = async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/lifestyle_score`, req.body);
    
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    handleMLServiceError(error, res, 'Lifestyle score calculation');
  }
};

/**
 * Calculate BMI only
 */
exports.calculateBMI = async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/bmi`, req.body);
    
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    handleMLServiceError(error, res, 'BMI calculation');
  }
};

/**
 * Get user's assessment history
 */
exports.getAssessmentHistory = async (req, res) => {
  try {
    const assessments = await HealthAssessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment history',
      error: error.message
    });
  }
};

/**
 * Get specific assessment by ID
 */
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await HealthAssessment.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment',
      error: error.message
    });
  }
};

// Helper Functions

/**
 * Generate personalized recommendations
 */
function generateRecommendations(heartRisk, lifestyleScore, bmi, lifestyleData) {
  const recommendations = [];

  // Heart risk recommendations
  if (heartRisk.risk === 'High') {
    recommendations.push('⚠️ High heart disease risk detected. Consult a cardiologist immediately.');
    recommendations.push('📊 Schedule regular checkups and monitoring.');
  } else if (heartRisk.risk === 'Medium') {
    recommendations.push('⚠️ Moderate heart disease risk. Schedule a checkup within 1-2 months.');
    recommendations.push('💊 Discuss preventive measures with your doctor.');
  } else {
    recommendations.push('✅ Low heart disease risk. Maintain your healthy lifestyle.');
  }

  // Lifestyle recommendations
  if (lifestyleScore < 40) {
    recommendations.push('🚨 Lifestyle score is low. Significant changes needed.');
  } else if (lifestyleScore < 60) {
    recommendations.push('📈 Lifestyle score is fair. Room for improvement.');
  } else {
    recommendations.push('🌟 Great lifestyle score! Keep up the good work.');
  }

  // Smoking recommendations
  if (lifestyleData.smoking.toLowerCase() === 'current') {
    recommendations.push('🚭 Quit smoking immediately. Consider cessation programs.');
  } else if (lifestyleData.smoking.toLowerCase() === 'former') {
    recommendations.push('👍 Great job quitting smoking! Stay smoke-free.');
  }

  // Exercise recommendations
  if (lifestyleData.exercise_minutes_week < 150) {
    const needed = 150 - lifestyleData.exercise_minutes_week;
    recommendations.push(`🏃 Increase exercise by ${Math.round(needed)} minutes/week to meet WHO guidelines.`);
  } else {
    recommendations.push('💪 Excellent exercise routine! Meeting WHO recommendations.');
  }

  // Diet recommendations
  if (lifestyleData.diet_rating < 3) {
    recommendations.push('🥗 Improve diet quality. Focus on fruits, vegetables, and whole grains.');
  }

  // Sleep recommendations
  if (lifestyleData.sleep_hours < 7) {
    recommendations.push(`😴 Get more sleep. Aim for ${Math.round(8 - lifestyleData.sleep_hours)} more hours per night.`);
  }

  // BMI recommendations
  if (bmi.category === 'Obese') {
    recommendations.push('⚖️ BMI indicates obesity. Consider a structured weight loss program.');
  } else if (bmi.category === 'Overweight') {
    recommendations.push('⚖️ BMI indicates overweight. Aim for gradual weight loss.');
  } else if (bmi.category === 'Underweight') {
    recommendations.push('⚖️ BMI indicates underweight. Consult a nutritionist.');
  } else {
    recommendations.push('✅ Healthy BMI. Maintain your current weight.');
  }

  return recommendations;
}

/**
 * Handle ML service errors
 */
function handleMLServiceError(error, res, operation) {
  console.error(`${operation} Error:`, error.message);
  
  if (error.response) {
    return res.status(error.response.status).json({
      success: false,
      message: `${operation} failed`,
      error: error.response.data
    });
  }
  
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'ML Service is not available'
    });
  }

  res.status(500).json({
    success: false,
    message: `${operation} failed`,
    error: error.message
  });
}

