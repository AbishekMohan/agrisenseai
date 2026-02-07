/**
 * @fileOverview AI agent for diagnosing crop diseases from photos.
 *
 * - diagnoseCropDisease - Analyzes a crop image and provides a diagnosis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnoseCropInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the crop as a base64 data URI."),
  cropType: z.string().describe("The type of crop being scanned."),
});

const DiagnoseCropOutputSchema = z.object({
  identification: z.string().describe("The identified condition or disease."),
  confidence: z.number().describe("Confidence level (0-1)."),
  description: z.string().describe("Description of the symptoms observed."),
  organicTreatment: z.string().describe("Recommended organic treatment."),
  severity: z.enum(['Low', 'Medium', 'High']).describe("Urgency of the issue."),
});

export type DiagnoseCropOutput = z.infer<typeof DiagnoseCropOutputSchema>;

const prompt = ai.definePrompt({
  name: 'diagnoseCropDiseasePrompt',
  input: { schema: DiagnoseCropInputSchema },
  output: { schema: DiagnoseCropOutputSchema },
  prompt: `You are an expert plant pathologist. 
  Analyze the image of the {{cropType}} provided. 
  
  Identify any diseases, pests, or nutrient deficiencies.
  Be precise and provide an organic treatment plan suitable for a small-scale farmer.
  
  Image: {{media url=photoDataUri}}`,
});

const diagnoseCropDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseCropDiseaseFlow',
    inputSchema: DiagnoseCropInputSchema,
    outputSchema: DiagnoseCropOutputSchema,
  },
  async input => {
    try {
      const { output } = await prompt(input);
      if (!output) throw new Error('AI could not analyze the image.');
      return output;
    } catch (error) {
      console.error('Error in diagnoseCropDiseaseFlow:', error);
      // Fallback for demo/error cases to prevent crash
      return {
        identification: 'Analysis Unavailable',
        confidence: 0,
        description: 'Unable to analyze image at this time due to service connectivity. Please ensure the image is clear and try again.',
        organicTreatment: 'Consult a local expert.',
        severity: 'Low' as const
      };
    }
  }
);

export async function diagnoseCropDisease(input: { photoDataUri: string; cropType: string }): Promise<DiagnoseCropOutput> {
  return diagnoseCropDiseaseFlow(input);
}
