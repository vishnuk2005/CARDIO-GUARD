/**
 * Therapy Routes
 * AI-powered therapy generation using Gemini API
 */

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

// Fallback therapy plan generator
function generateFallbackTherapyPlan(heartRisk, lifestyleScore, bmi, userData) {
  const riskLevel = heartRisk.risk;
  const lifestyleScoreValue = typeof lifestyleScore === 'number' ? lifestyleScore : lifestyleScore.lifestyle_score;
  const bmiValue = bmi.bmi;
  const bmiCategory = bmi.category;
  
  let therapyPlan = `# Personalized Health Therapy Plan\n\n`;
  
  // Risk Assessment
  therapyPlan += `## Risk Assessment\n`;
  therapyPlan += `- **Heart Disease Risk**: ${riskLevel} (${(heartRisk.probability * 100).toFixed(1)}%)\n`;
  therapyPlan += `- **Lifestyle Score**: ${lifestyleScoreValue}/100\n`;
  therapyPlan += `- **BMI**: ${bmiValue} (${bmiCategory})\n\n`;
  
  // Cardiovascular Therapy
  therapyPlan += `## Cardiovascular Therapy\n`;
  if (riskLevel === 'High') {
    therapyPlan += `### Immediate Actions (Week 1-2)\n`;
    therapyPlan += `- **Consult a cardiologist immediately**\n`;
    therapyPlan += `- Monitor blood pressure daily\n`;
    therapyPlan += `- Start low-intensity walking (10-15 minutes, 3x/week)\n`;
    therapyPlan += `- Eliminate processed foods and reduce sodium\n\n`;
  } else if (riskLevel === 'Medium') {
    therapyPlan += `### Moderate Risk Management (Week 1-4)\n`;
    therapyPlan += `- Schedule cardiology consultation within 2 weeks\n`;
    therapyPlan += `- Begin moderate exercise routine (30 minutes, 5x/week)\n`;
    therapyPlan += `- Focus on heart-healthy diet\n`;
    therapyPlan += `- Stress management techniques\n\n`;
  } else {
    therapyPlan += `### Low Risk Maintenance (Ongoing)\n`;
    therapyPlan += `- Continue current healthy habits\n`;
    therapyPlan += `- Regular exercise (150 minutes/week)\n`;
    therapyPlan += `- Annual health checkups\n`;
    therapyPlan += `- Maintain balanced diet\n\n`;
  }
  
  // Lifestyle Therapy
  therapyPlan += `## Lifestyle Therapy\n`;
  if (lifestyleScoreValue < 50) {
    therapyPlan += `### Lifestyle Improvement Plan\n`;
    therapyPlan += `- **Exercise**: Start with 20-30 minutes daily walking\n`;
    therapyPlan += `- **Sleep**: Aim for 7-9 hours nightly\n`;
    therapyPlan += `- **Diet**: Increase fruits, vegetables, whole grains\n`;
    therapyPlan += `- **Stress**: Practice meditation or deep breathing\n\n`;
  } else if (lifestyleScoreValue < 80) {
    therapyPlan += `### Lifestyle Optimization\n`;
    therapyPlan += `- **Exercise**: Increase intensity gradually\n`;
    therapyPlan += `- **Sleep**: Maintain consistent sleep schedule\n`;
    therapyPlan += `- **Diet**: Fine-tune nutrition choices\n`;
    therapyPlan += `- **Stress**: Advanced stress management\n\n`;
  } else {
    therapyPlan += `### Lifestyle Maintenance\n`;
    therapyPlan += `- Continue excellent habits\n`;
    therapyPlan += `- Monitor and adjust as needed\n`;
    therapyPlan += `- Share knowledge with others\n\n`;
  }
  
  // Weight Management
  therapyPlan += `## Weight Management\n`;
  if (bmiCategory === 'Obese' || bmiCategory === 'Overweight') {
    therapyPlan += `### Weight Reduction Plan\n`;
    therapyPlan += `- **Target**: 1-2 lbs weight loss per week\n`;
    therapyPlan += `- **Diet**: Calorie deficit of 500-750 calories/day\n`;
    therapyPlan += `- **Exercise**: 45-60 minutes daily\n`;
    therapyPlan += `- **Support**: Consider nutritionist consultation\n\n`;
  } else if (bmiCategory === 'Underweight') {
    therapyPlan += `### Healthy Weight Gain\n`;
    therapyPlan += `- **Target**: 0.5-1 lb weight gain per week\n`;
    therapyPlan += `- **Diet**: Nutrient-dense foods\n`;
    therapyPlan += `- **Exercise**: Strength training focus\n`;
    therapyPlan += `- **Support**: Medical consultation if needed\n\n`;
  } else {
    therapyPlan += `### Weight Maintenance\n`;
    therapyPlan += `- **Goal**: Maintain current healthy weight\n`;
    therapyPlan += `- **Diet**: Balanced nutrition\n`;
    therapyPlan += `- **Exercise**: Regular physical activity\n`;
    therapyPlan += `- **Monitoring**: Monthly weight checks\n\n`;
  }
  
  // Timeline
  therapyPlan += `## Timeline & Goals\n`;
  therapyPlan += `### Week 1-2: Foundation\n`;
  therapyPlan += `- Establish baseline measurements\n`;
  therapyPlan += `- Begin basic exercise routine\n`;
  therapyPlan += `- Implement dietary changes\n\n`;
  therapyPlan += `### Week 3-4: Building Habits\n`;
  therapyPlan += `- Increase exercise intensity\n`;
  therapyPlan += `- Refine nutrition plan\n`;
  therapyPlan += `- Monitor progress\n\n`;
  therapyPlan += `### Month 2-3: Optimization\n`;
  therapyPlan += `- Advanced exercise routines\n`;
  therapyPlan += `- Fine-tune lifestyle habits\n`;
  therapyPlan += `- Regular health monitoring\n\n`;
  
  // Warning Signs
  therapyPlan += `## Warning Signs to Watch For\n`;
  therapyPlan += `- Chest pain or discomfort\n`;
  therapyPlan += `- Shortness of breath\n`;
  therapyPlan += `- Dizziness or fainting\n`;
  therapyPlan += `- Irregular heartbeat\n`;
  therapyPlan += `- Severe fatigue\n\n`;
  therapyPlan += `**If you experience any of these symptoms, seek immediate medical attention.**\n\n`;
  
  // Motivation
  therapyPlan += `## Motivation & Progress Tracking\n`;
  therapyPlan += `- Keep a daily health journal\n`;
  therapyPlan += `- Set weekly and monthly goals\n`;
  therapyPlan += `- Celebrate small victories\n`;
  therapyPlan += `- Join support groups if helpful\n`;
  therapyPlan += `- Regular check-ins with healthcare provider\n\n`;
  
  therapyPlan += `*This therapy plan is generated based on your health assessment. Always consult with healthcare professionals before making significant lifestyle changes.*`;
  
  return therapyPlan;
}

// Initialize Gemini AI
let genAI, model;

if (config.GEMINI_API_KEY && config.GEMINI_MODEL) {
  genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  // Try different model names
  try {
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  } catch (error) {
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error2) {
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      } catch (error3) {
        console.error('Failed to initialize any Gemini model:', error3);
        model = null;
      }
    }
  }
} else {
  console.warn('Gemini API key or model not configured. Therapy generation will not work.');
}

/**
 * Generate AI-powered therapy plan
 * POST /api/therapy/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { heartRisk, lifestyleScore, bmi, userData } = req.body;

    // Check if Gemini AI is configured
    if (!genAI || !model) {
      return res.status(500).json({
        success: false,
        message: 'AI therapy service is not configured. Please contact support.'
      });
    }

    // Validate required data
    if (!heartRisk || !lifestyleScore || !bmi) {
      return res.status(400).json({
        success: false,
        message: 'Missing required assessment data'
      });
    }

    // Prepare therapy prompt for Gemini AI
    const therapyPrompt = `
You are a medical AI assistant specializing in cardiovascular health and lifestyle therapy. 
Generate a comprehensive, personalized therapy plan based on the following health assessment:

HEALTH ASSESSMENT DATA:
- Heart Disease Risk: ${heartRisk.risk} (Probability: ${(heartRisk.probability * 100).toFixed(1)}%)
- Lifestyle Score: ${typeof lifestyleScore === 'number' ? lifestyleScore : lifestyleScore.lifestyle_score}/100
- BMI: ${bmi.bmi} (Category: ${bmi.category})
- Age: ${userData?.heartData?.age || 'Not provided'}
- Sex: ${userData?.heartData?.sex === 1 ? 'Male' : 'Female'}
- Exercise: ${userData?.lifestyleData?.exercise_minutes_week || 0} minutes/week
- Sleep: ${userData?.lifestyleData?.sleep_hours || 0} hours/night
- Diet Rating: ${userData?.lifestyleData?.diet_rating || 0}/5
- Smoking: ${userData?.lifestyleData?.smoking ? 'Yes' : 'No'}

THERAPY REQUIREMENTS:
1. Create a personalized therapy plan with specific, actionable recommendations
2. Focus on cardiovascular health improvement
3. Include exercise, nutrition, lifestyle, and medical recommendations
4. Provide timeline-based goals (Week 1-4, Month 2-3, etc.)
5. Include specific metrics and targets
6. Address the most critical risk factors first
7. Make recommendations evidence-based and medically sound
8. Use encouraging, supportive tone
9. Include warning signs to watch for
10. Provide motivation and progress tracking tips

FORMAT THE RESPONSE AS:
- Clear sections with headers
- Bullet points for easy reading
- Specific numbers and targets
- Timeline-based approach
- Professional medical language but accessible

Generate a comprehensive therapy plan now:
`;

    // Generate therapy plan using Gemini AI or fallback
    let therapyPlan;
    
    if (model) {
      try {
        const result = await model.generateContent(therapyPrompt);
        const response = await result.response;
        therapyPlan = response.text();
      } catch (error) {
        console.error('Gemini API error, using fallback:', error);
        therapyPlan = generateFallbackTherapyPlan(heartRisk, lifestyleScore, bmi, userData);
      }
    } else {
      therapyPlan = generateFallbackTherapyPlan(heartRisk, lifestyleScore, bmi, userData);
    }

    // Return the generated therapy plan
    res.json({
      success: true,
      data: {
        therapyPlan: therapyPlan,
        generatedAt: new Date().toISOString(),
        riskLevel: heartRisk.risk,
        lifestyleScore: typeof lifestyleScore === 'number' ? lifestyleScore : lifestyleScore.lifestyle_score,
        bmi: bmi.bmi,
        bmiCategory: bmi.category
      },
      message: 'AI therapy plan generated successfully'
    });

  } catch (error) {
    console.error('Therapy generation error:', error);
    
    // Handle specific Gemini API errors
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error. Please contact support.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate therapy plan. Please try again.',
      error: config.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Get therapy plan templates
 * GET /api/therapy/templates
 */
router.get('/templates', async (req, res) => {
  try {
    const templates = {
      lowRisk: {
        title: "Low Risk Health Maintenance",
        description: "Maintain your healthy lifestyle with these optimization tips",
        focus: ["Exercise optimization", "Nutrition refinement", "Stress management", "Preventive care"]
      },
      mediumRisk: {
        title: "Moderate Risk Improvement Plan",
        description: "Structured plan to reduce cardiovascular risk factors",
        focus: ["Lifestyle modifications", "Exercise program", "Dietary changes", "Regular monitoring"]
      },
      highRisk: {
        title: "High Risk Intervention Plan",
        description: "Comprehensive plan requiring immediate lifestyle changes and medical consultation",
        focus: ["Medical consultation", "Aggressive lifestyle changes", "Medication consideration", "Close monitoring"]
      }
    };

    res.json({
      success: true,
      data: templates,
      message: 'Therapy templates retrieved successfully'
    });

  } catch (error) {
    console.error('Templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve therapy templates'
    });
  }
});

module.exports = router;
