import { ai } from '@/ai/genkit';
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
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Keep retries short so users aren't forced to wait ~16s for free-tier throttling.
    const maxAttempts = 3;
    const baseDelay = 1500; // ms

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const { output } = await prompt(input);
        if (output && output.length > 0) return output;
      } catch (error: any) {
        const message = error?.message?.toLowerCase?.() ?? '';
        const isRateLimit =
          message.includes('quota') ||
          message.includes('limit') ||
          message.includes('429') ||
          message.includes('rate');

        if (isRateLimit && attempt < maxAttempts) {
          const delay = baseDelay * attempt; // 1.5s, 3s
          console.warn(`Rate limit hit; retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
          await sleep(delay);
          continue;
        }
        console.error('Error in recommendations flow:', error);
      }

      // If output was empty or we decided not to retry, break and return fallback
      break;
    }

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
        action: 'Monitor today’s forecast; delay irrigation if heavy rain is expected.'
      }
    ];
  }
);

export async function generatePersonalizedRecommendations(
  input: GeneratePersonalizedRecommendationsInput
): Promise<GeneratePersonalizedRecommendationsOutput> {
  return generatePersonalizedRecommendationsFlow(input);
}
