import { ai, generateWithFallback, type GeminiModel } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePersonalizedRecommendationsInputSchema = z.object({
  soilMoisture: z.number(),
  soilTemperature: z.number(),
  soilPh: z.number(),
  nutrientLevel: z.enum(['High', 'Medium', 'Low']),
  weatherForecast: z.string(),
  cropType: z.string(),
  location: z.string(),
  language: z.string().optional(),
});
export type GeneratePersonalizedRecommendationsInput = z.infer<
  typeof GeneratePersonalizedRecommendationsInputSchema
>;

const RecommendationSchema = z.object({
  priority: z.enum(['High', 'Medium', 'Low']),
  icon: z.string(),
  title: z.string(),
  action: z.string(),
});

const GeneratePersonalizedRecommendationsOutputSchema = z.array(RecommendationSchema);
export type GeneratePersonalizedRecommendationsOutput = z.infer<
  typeof GeneratePersonalizedRecommendationsOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generatePersonalizedRecommendationsPrompt',
  input: { schema: GeneratePersonalizedRecommendationsInputSchema },
  output: { schema: GeneratePersonalizedRecommendationsOutputSchema },
  system: 'You are an expert AI agronomist for Indian agriculture. Your goal is to provide high-impact, practical advice based on sensor data. Always respond in the requested language. If the AI service is busy, return a standard set of stable farming guidelines.',
  prompt: `Based on these conditions, provide 3 prioritized recommendations for a {{cropType}} farm in {{location}}.
  Language: {{language}}

  Sensor Data:
  - Soil Moisture: {{soilMoisture}}%
  - Temperature: {{soilTemperature}}°C
  - pH: {{soilPh}}
  - Nutrients: {{nutrientLevel}}

  Weather: {{weatherForecast}}`,
});

const generatePersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedRecommendationsFlow',
    inputSchema: GeneratePersonalizedRecommendationsInputSchema,
    outputSchema: GeneratePersonalizedRecommendationsOutputSchema,
  },
  async input => {
    try {
      // Use generateWithFallback to automatically try different models on rate limits
      // Fallback order: Gemini 3 Flash → 2.5 Flash → 2.5 Flash Lite
      return await generateWithFallback(async (model: GeminiModel) => {
        const { output } = await prompt(input, { model });
        if (!output || output.length === 0) throw new Error('AI failed to generate recommendations.');
        return output as GeneratePersonalizedRecommendationsOutput;
      });
    } catch (error: any) {
      console.error('Error in recommendations flow:', error);

      // Safe, fast fallback so the UI keeps working without long waits
      return [
        {
          priority: 'High' as const,
          icon: '💧',
          title: 'Manual Moisture Check',
          action: 'Quickly check soil moisture near roots and water if under 65%.'
        },
        {
          priority: 'Medium' as const,
          icon: '🌾',
          title: 'Routine Check',
          action: 'Sensor data looks typical. Continue standard irrigation cycles.'
        },
        {
          priority: 'Low' as const,
          icon: '☀️',
          title: 'Weather Watch',
          action: 'Monitor forecast; delay irrigation if heavy rain is expected.'
        }
      ];
    }
  }
);

export async function generatePersonalizedRecommendations(
  input: GeneratePersonalizedRecommendationsInput
): Promise<GeneratePersonalizedRecommendationsOutput> {
  return generatePersonalizedRecommendationsFlow(input);
}
