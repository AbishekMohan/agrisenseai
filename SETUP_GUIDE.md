# AgriSense API Setup Guide

This guide will help you set up and run the chatbot API for your AgriSense farming advisor application.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google AI API key (for Gemini)

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Google AI API key:
```
GOOGLE_GENAI_API_KEY=your_actual_api_key_here
```

### Step 3: Get Your Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

### Step 4: Run the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:9002`

### Step 5: Test the API

Open a new terminal and run the test script:

```bash
node test-api.js
```

Or test manually with curl:

```bash
# Test chat endpoint
curl -X POST http://localhost:9002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I improve soil fertility?", "language": "English"}'
```

## 📡 API Endpoints

Your chatbot API now has three main endpoints:

### 1. `/api/chat` - Chat with AI Advisor
- **Method:** POST
- **Purpose:** Answer farming questions in multiple languages
- **Request:**
  ```json
  {
    "question": "What is crop rotation?",
    "language": "English"
  }
  ```

### 2. `/api/recommendations` - Get Farming Recommendations
- **Method:** POST
- **Purpose:** Generate personalized recommendations based on sensor data
- **Request:**
  ```json
  {
    "soilMoisture": 45,
    "soilTemperature": 25,
    "soilPh": 6.5,
    "nutrientLevel": 70,
    "cropType": "Wheat",
    "location": "Punjab"
  }
  ```

### 3. `/api/diagnose` - Diagnose Crop Diseases
- **Method:** POST
- **Purpose:** Analyze crop images for diseases
- **Request:**
  ```json
  {
    "photoDataUri": "data:image/jpeg;base64,...",
    "cropType": "Tomato"
  }
  ```

See `API_DOCUMENTATION.md` for detailed documentation.

## 🏗️ Project Structure

```
studio-main/
├── src/
│   ├── app/
│   │   ├── api/              # ✨ NEW: API routes
│   │   │   ├── chat/         # Chat endpoint
│   │   │   ├── recommendations/  # Recommendations endpoint
│   │   │   └── diagnose/     # Diagnosis endpoint
│   │   ├── advisor/          # Frontend chat UI
│   │   └── ...
│   ├── ai/
│   │   ├── flows/            # AI flow definitions
│   │   └── genkit.ts         # Genkit configuration
│   └── ...
├── .env                       # Your environment variables
├── .env.example              # Template for environment variables
├── API_DOCUMENTATION.md      # Detailed API docs
└── test-api.js               # API testing script
```

## 🔧 How It Works

The application uses **Google Genkit** for AI capabilities:

1. **Frontend** (`src/app/advisor/page.tsx`):
   - Chat UI where users type questions
   - Currently uses server actions directly
   - Can be modified to use API endpoints

2. **AI Flows** (`src/ai/flows/`):
   - `answer-farming-questions-via-chat.ts` - Chatbot logic
   - `generate-personalized-recommendations.ts` - Recommendations
   - `diagnose-crop-disease.ts` - Image analysis

3. **API Routes** (`src/app/api/`):
   - REST endpoints that call the AI flows
   - Handle validation and error handling
   - Return JSON responses

## 🌐 Using the API in Frontend

The current implementation uses server actions. To switch to API calls:

**Current (Server Actions):**
```typescript
const response = await answerFarmingQuestionsViaChat({ 
  question: userMsg,
  language: 'English'
});
```

**Alternative (API Endpoint):**
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: userMsg,
    language: 'English'
  })
});
const data = await response.json();
```

## 🌍 Supported Languages

The chatbot supports:
- English
- Hindi (हिंदी)
- Punjabi (ਪੰਜਾਬੀ)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Marathi (मराठी)
- Kannada (ಕನ್ನಡ)
- Bengali (বাংলা)
- Gujarati (ગુજરાતી)

## 🐛 Troubleshooting

### Issue: "GOOGLE_GENAI_API_KEY not found"
**Solution:** Make sure you've created a `.env` file with your API key

### Issue: API returns 500 errors
**Solution:** Check that your Google AI API key is valid and has quota available

### Issue: Port 9002 already in use
**Solution:** Kill the process using the port or change the port in `package.json`

```bash
# Kill process on port 9002
lsof -ti:9002 | xargs kill -9

# Or change port in package.json
"dev": "next dev --turbopack -p 3000"
```

### Issue: Module not found errors
**Solution:** Run `npm install` again to ensure all dependencies are installed

## 📚 Additional Resources

- [Google Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Google AI Studio](https://makersuite.google.com/)

## 🤝 Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify your `.env` file is set up correctly
3. Make sure your API key is valid
4. Run the test script to identify which endpoint is failing

## 🎉 You're All Set!

Your chatbot API is now ready to use. The AI advisor can:
- Answer farming questions in multiple languages
- Generate personalized recommendations
- Diagnose crop diseases from images

Happy farming! 🌾
