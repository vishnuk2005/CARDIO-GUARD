# 🫀 Cardio Guard - AI-Powered Heart Health Analytics Platform


> **A comprehensive health analytics platform that combines machine learning, AI, and modern web technologies to provide personalized heart disease risk assessment and therapy recommendations.**

## 🌟 Overview

Cardio Guard is a full-stack health analytics application that leverages advanced machine learning algorithms and AI to provide personalized heart health insights. Users can take comprehensive health assessments, receive AI-powered risk predictions, and get personalized therapy recommendations.

## ✨ Key Features

### 🧠 AI-Powered Health Analytics
- **Heart Disease Risk Prediction**: Advanced ML models (Random Forest, XGBoost, LightGBM)
- **Lifestyle Health Scoring**: Comprehensive lifestyle assessment (0-100 scale)
- **BMI Calculation**: Automatic body mass index computation with categorization
- **AI Therapy Plans**: Personalized recommendations using Google Gemini AI

### 📊 Comprehensive Health Assessment
- **Multi-Step Form**: 3-step assessment covering heart health, lifestyle, and body metrics
- **Real-Time Validation**: Smart form validation with realistic input ranges
- **Professional UI**: Medical-grade interface with clean, professional design
- **Data Persistence**: All assessments saved to MongoDB for progress tracking

### 📈 Advanced Analytics & Visualization
- **Interactive Charts**: Recharts-powered data visualization
- **Risk Assessment**: Color-coded risk levels (Low/Medium/High)
- **Progress Tracking**: Historical data analysis and trend monitoring
- **Assessment History**: Complete history with expandable details

### 🔐 Secure User Management
- **JWT Authentication**: Secure user registration and login
- **Protected Routes**: Dashboard and assessments require authentication
- **Password Security**: bcrypt hashing for secure password storage
- **User-Specific Data**: Personalized health tracking per user

### 📱 Modern User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Professional UI**: Material-UI components with medical-grade styling
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Download Options**: Save therapy plans as text files

## 🏗️ Architecture

### Full-Stack Technology Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   ML Service    │
│   React.js      │◄──►│   Node.js       │◄──►│   Python        │
│   Material-UI   │    │   Express.js    │    │   FastAPI       │
│   Recharts      │    │   MongoDB       │    │   scikit-learn  │
│   Framer Motion │    │   JWT Auth      │    │   XGBoost       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │   Data Storage  │    │   AI Integration│
│   & Experience  │    │   & Management  │    │   & Analysis    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🎯 System Components

#### Frontend (React.js)
- **Framework**: React 18 with Vite
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **HTTP Client**: Axios

#### Backend (Node.js)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt
- **API**: RESTful API design
- **CORS**: Cross-origin resource sharing
- **Environment**: dotenv for configuration

#### ML Service (Python)
- **Framework**: FastAPI for high-performance API
- **ML Libraries**: scikit-learn, XGBoost, LightGBM
- **Model Training**: Advanced model comparison and selection
- **Model Serving**: Real-time prediction API
- **Explainability**: SHAP for model interpretation
- **Experiment Tracking**: MLflow for model versioning

#### AI Integration
- **AI Service**: Google Gemini API
- **Therapy Generation**: Personalized health recommendations
- **Fallback System**: Works even when AI is unavailable
- **Structured Output**: Medical-grade therapy plans

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **MongoDB** (local or cloud)
- **Google Gemini API Key** (optional, for AI therapy)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cardio-guard
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp ENV_VARIABLES_TEMPLATE.txt .env

# Edit .env file with your configuration
# - MongoDB connection string
# - JWT secret key
# - Google Gemini API key (optional)

# Start the backend server
npm start
```

**Backend will run on**: `http://localhost:5000`

### 3. ML Service Setup

```bash
# Navigate to ML service directory
cd ml-service

# Create and activate virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
OR
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the ML model (first time only)
python train_model_advanced.py

# Start the ML service
uvicorn app.api:app --host 0.0.0.0 --port 8000 --reload
OR
python -m uvicorn app.api:app --host 0.0.0.0 --port 8000 --reload
```

**ML Service will run on**: `http://localhost:8000`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Frontend will run on**: `http://localhost:5173`

## 📋 Detailed Setup Instructions

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/cardioguard

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# AI Integration (Optional)
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-pro

# Server
PORT=5000
NODE_ENV=development
```

### ML Service Configuration

The ML service uses the following key files:

- **`train_model_advanced.py`**: Trains and compares multiple ML models
- **`app/api.py`**: FastAPI application with prediction endpoints
- **`models/`**: Contains trained models and metadata
- **`data/heart.csv`**: Heart disease dataset for training

### Frontend Configuration

The frontend is configured with:

- **Vite**: Fast build tool and dev server
- **Material-UI**: Professional component library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

## 🎯 API Endpoints

### Backend API (Port 5000)

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### Health Assessment
- `POST /api/health/assessment` - Submit health assessment
- `GET /api/health/history` - Get assessment history
- `GET /api/health/trends` - Get health trends

#### AI Therapy
- `POST /api/therapy/generate` - Generate AI therapy plan

### ML Service API (Port 8000)

#### Predictions
- `POST /predict` - Heart disease risk prediction
- `POST /lifestyle_score` - Lifestyle health scoring
- `POST /bmi` - BMI calculation

#### Model Information
- `GET /model_info` - Model version and metrics
- `GET /feature_importance` - Feature importance analysis

## 📊 Machine Learning Models

### Model Comparison

The system trains and compares multiple algorithms:

1. **Random Forest**: Ensemble method with good interpretability
2. **XGBoost**: Gradient boosting with high performance
3. **LightGBM**: Fast gradient boosting framework

### Model Performance

- **Accuracy**: ~89%
- **ROC-AUC**: ~92%
- **Cross-Validation**: 5-fold CV for robust evaluation
- **Feature Importance**: SHAP analysis for interpretability

### Features Used

The model uses 13 key features:
- Age, Sex, Chest Pain Type
- Blood Pressure, Cholesterol, Fasting Blood Sugar
- Resting ECG, Max Heart Rate, Exercise Induced Angina
- ST Depression, Slope, Number of Vessels, Thallium Test

## 🎨 User Interface

### Design Principles

- **Medical-Grade**: Professional, trustworthy appearance
- **Clean & Simple**: Easy to understand and navigate
- **Responsive**: Works on all device sizes
- **Accessible**: Clear typography and color contrast

### Key Pages

1. **Home Page**: Landing page with feature overview
2. **Login/Register**: Secure authentication
3. **Assessment**: Multi-step health form
4. **Results**: Visual analytics and insights
5. **Dashboard**: Health tracking and history
6. **Assessment History**: Detailed historical data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Comprehensive data validation
- **Protected Routes**: Authentication-required pages

## 📈 Performance & Scalability

### Frontend
- **Vite**: Lightning-fast build and dev server
- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient data caching strategies

### Backend
- **Express.js**: High-performance web framework
- **MongoDB**: Scalable NoSQL database
- **Connection Pooling**: Efficient database connections
- **Error Handling**: Comprehensive error management

### ML Service
- **FastAPI**: High-performance async API
- **Model Caching**: Pre-loaded models for fast predictions
- **Batch Processing**: Efficient bulk predictions
- **Async Operations**: Non-blocking request handling

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# ML service tests
cd ml-service
python -m pytest
```

## 🚀 Deployment

### Production Deployment

#### Backend
```bash
cd backend
npm run build
NODE_ENV=production npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

#### ML Service
```bash
cd ml-service
# Use production ASGI server
gunicorn app.api:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📚 Documentation

### Additional Resources

- **API Documentation**: Available at `http://localhost:8000/docs` (ML Service)
- **Component Documentation**: Material-UI docs
- **Model Documentation**: MLflow tracking interface

### File Structure

```
cardio-guard/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── package.json
├── backend/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Main server file
├── ml-service/             # Python ML service
│   ├── app/               # FastAPI application
│   ├── models/            # Trained ML models
│   ├── data/              # Training data
│   └── train_model_advanced.py
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- **Heart Disease Dataset**: UCI Machine Learning Repository
- **Material-UI**: React component library
- **FastAPI**: Modern Python web framework
- **Google Gemini**: AI-powered therapy recommendations
- **Recharts**: React charting library



**Cardio Guard** - Empowering heart health through AI and modern technology 🫀✨
