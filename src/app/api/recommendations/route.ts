import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define schemas locally
const GeneratePersonalizedRecommendationsInputSchema = z.object({
  soilMoisture: z.number(),
  soilTemperature: z.number(),
  soilPh: z.number(),
  nutrientLevel: z.number(),
  weatherForecast: z.string(),
  cropType: z.string(),
  location: z.string(),
  language: z.string().optional(),
});

const RecommendationSchema = z.object({
  icon: z.string(),
  title: z.string(),
  action: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
});

const GeneratePersonalizedRecommendationsOutputSchema = z.array(RecommendationSchema);

// Define the prompt inline
const generatePersonalizedRecommendationsPrompt = ai.definePrompt({
  name: 'generatePersonalizedRecommendationsPrompt',
  input: { schema: GeneratePersonalizedRecommendationsInputSchema },
  output: { schema: GeneratePersonalizedRecommendationsOutputSchema },
  prompt: `You are an expert agronomist analyzing farm sensor data for a farmer in {{location}}.

Current conditions:
- Soil Moisture: {{soilMoisture}}%
- Soil Temperature: {{soilTemperature}}°C
- Soil pH: {{soilPh}}
- Nutrient Level: {{nutrientLevel}}%
- Weather Forecast: {{weatherForecast}}
- Crop Type: {{cropType}}

Provide 3-5 actionable, farm-specific recommendations in {{language}} language. Each recommendation should:
1. Use an emoji icon that represents the topic
2. Have a clear title
3. Include a specific action the farmer should take
4. Be prioritized as High, Medium, or Low based on urgency

Focus on practical advice for small-scale farmers.`,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      soilMoisture,
      soilTemperature,
      soilPh,
      nutrientLevel,
      weatherForecast,
      cropType,
      location,
      language,
    } = body;

    // Basic validation
    if (
      soilMoisture === undefined ||
      soilTemperature === undefined ||
      soilPh === undefined ||
      nutrientLevel === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required sensor data (soilMoisture, soilTemperature, soilPh, nutrientLevel)' },
        { status: 400 }
      );
    }

    // Call the AI prompt directly
    try {
      const { output } = await generatePersonalizedRecommendationsPrompt({
        soilMoisture,
        soilTemperature,
        soilPh,
        nutrientLevel,
        weatherForecast: weatherForecast || 'No forecast available',
        cropType: cropType || 'General',
        location: location || 'Unknown',
        language: language || 'English',
      });

      if (!output) {
        throw new Error('AI failed to generate recommendations.');
      }

      return NextResponse.json(output);
    } catch (aiError) {
      console.error('AI error:', aiError);
      // Return fallback recommendations
      return NextResponse.json([
        {
          icon: '💧',
          title: 'Check Irrigation',
          action: 'Monitor your soil moisture levels regularly and adjust watering as needed.',
          priority: 'Medium' as const,
        }
      ]);
    }
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Recommendations API is running' 
  });
}
