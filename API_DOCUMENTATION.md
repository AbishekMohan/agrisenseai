# API Documentation

This document describes the API endpoints available in the AgriSense farming advisor application.

## Base URL
When running locally: `http://localhost:9002/api`

## Endpoints

### 1. Chat API - Answer Farming Questions

**Endpoint:** `/api/chat`  
**Method:** `POST`  
**Description:** Get answers to farming-related questions using AI

#### Request Body
```json
{
  "question": "How do I improve soil fertility?",
  "language": "English"  // Optional, defaults to English
}
```

#### Response
```json
{
  "answer": "To improve soil fertility, you can..."
}
```

#### Example cURL
```bash
curl -X POST http://localhost:9002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the best time to plant wheat?", "language": "English"}'
```

#### Supported Languages
- English
- Hindi
- Punjabi
- Tamil
- Telugu
- Marathi
- Kannada
- Bengali
- Gujarati

---

### 2. Recommendations API - Get Personalized Farming Recommendations

**Endpoint:** `/api/recommendations`  
**Method:** `POST`  
**Description:** Generate personalized farming recommendations based on sensor data

#### Request Body
```json
{
  "soilMoisture": 45,
  "soilTemperature": 25,
  "soilPh": 6.5,
  "nutrientLevel": 70,
  "weatherForecast": "Mostly sunny for the next 3 days",
  "cropType": "Wheat",
  "location": "Punjab, India",
  "language": "English"
}
```

#### Response
```json
[
  {
    "icon": "💧",
    "title": "Irrigation Recommendation",
    "action": "Your soil moisture is optimal. Continue current watering schedule.",
    "priority": "Medium"
  },
  {
    "icon": "🌡️",
    "title": "Temperature Alert",
    "action": "Temperature is ideal for wheat growth.",
    "priority": "Low"
  }
]
```

#### Example cURL
```bash
curl -X POST http://localhost:9002/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "soilMoisture": 45,
    "soilTemperature": 25,
    "soilPh": 6.5,
    "nutrientLevel": 70,
    "weatherForecast": "Sunny",
    "cropType": "Wheat",
    "location": "Punjab",
    "language": "English"
  }'
```

---

### 3. Diagnose API - Crop Disease Diagnosis

**Endpoint:** `/api/diagnose`  
**Method:** `POST`  
**Description:** Analyze a crop image to identify diseases, pests, or nutrient deficiencies

#### Request Body
```json
{
  "photoDataUri": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "cropType": "Tomato"
}
```

#### Response
```json
{
  "identification": "Early Blight (Alternaria solani)",
  "confidence": 0.85,
  "description": "Dark brown spots with concentric rings visible on lower leaves",
  "organicTreatment": "Remove affected leaves, spray with neem oil solution (5ml per liter) weekly",
  "severity": "Medium"
}
```

#### Example cURL
```bash
# First, convert your image to base64
# Then send the request
curl -X POST http://localhost:9002/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "photoDataUri": "data:image/jpeg;base64,YOUR_BASE64_IMAGE_DATA",
    "cropType": "Tomato"
  }'
```

---

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Request successful
- `400 Bad Request` - Invalid input parameters
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Health Check

All endpoints support a `GET` request for health checking:

```bash
curl http://localhost:9002/api/chat
curl http://localhost:9002/api/recommendations
curl http://localhost:9002/api/diagnose
```

Response:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

---

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
   ```

3. **Get Google AI API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env` file

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Test the API:**
   The server will run on `http://localhost:9002`
   You can test endpoints using the cURL examples above or tools like Postman.

---

## Integration with Frontend

The frontend (`src/app/advisor/page.tsx`) already uses these flows directly via server actions. If you want to switch to using the API endpoints instead, update the chat handler:

```typescript
// Current implementation (server action)
const response = await answerFarmingQuestionsViaChat({ 
  question: userMsg,
  language: languageNames[settings.language]
});

// Alternative: Using API endpoint
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: userMsg,
    language: languageNames[settings.language]
  })
}).then(res => res.json());
```

---

## Notes

- All AI operations require a valid Google AI API key
- Image uploads for diagnosis should be base64 encoded
- The chatbot supports multi-language responses
- Recommendations are personalized based on real-time sensor data
