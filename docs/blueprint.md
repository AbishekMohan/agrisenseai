# **App Name**: AgriSense AI

## Core Features:

- Sensor Monitoring: Real-time display of soil moisture, temperature, pH, and nutrient levels from IoT sensors. Values automatically updated every few seconds.
- AI Recommendations: Provides personalized farming recommendations based on sensor data and weather forecasts using generative AI, such as irrigation advice and pest control.
- AI Chat Advisor: A chat interface powered by a generative AI tool, allowing farmers to ask questions about farming, crops, and farm management.  Relies on a Gemini API key for full functionality.
- Weather Forecasts: Displays a 7-day weather forecast, including temperature, conditions, rain probability, and wind speed. Highlights best days for farming activities.
- Market Prices: Shows current market prices for key crops (Wheat, Rice, Cotton, Maize) based on the user's selected location (Punjab, Uttar Pradesh, Maharashtra, Andhra Pradesh). Displays price trends and identifies best buying/selling opportunities.
- Settings Configuration: Allows users to configure farm information (crop type, farm size, location), language (English/Hindi), AI configuration (Gemini API key), and notification preferences. Stores Gemini API Key in local storage.
- Data Persistence: Uses local storage to persist user settings such as the Gemini API key, language preference and notification settings.

## Style Guidelines:

- Primary color: A deep green (#386641) to represent growth and agriculture.
- Background color: A light, desaturated green (#E5E8E3), providing a subtle backdrop.
- Accent color: A vibrant yellow-orange (#ECAA53), drawing attention to calls to action and important information.
- Body and headline font: 'PT Sans', a modern and legible sans-serif font, suitable for both headlines and body text.
- Use consistent and clear icons from Lucide React, colored to match the data they represent (e.g., blue for moisture, orange for temperature).
- Utilize a mobile-responsive layout with a bottom tab navigation for easy access to the main pages. Cards and graphs should adapt to different screen sizes.
- Incorporate subtle animations for loading states and data updates to enhance the user experience without being distracting.