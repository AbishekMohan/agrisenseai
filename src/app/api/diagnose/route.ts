import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define schemas locally
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

// Define the prompt inline
const diagnoseCropDiseasePrompt = ai.definePrompt({
  name: 'diagnoseCropDiseasePrompt',
  input: { schema: DiagnoseCropInputSchema },
  output: { schema: DiagnoseCropOutputSchema },
  prompt: `You are an expert plant pathologist. 
  Analyze the image of the {{cropType}} provided. 
  
  Identify any diseases, pests, or nutrient deficiencies.
  Be precise and provide an organic treatment plan suitable for a small-scale farmer.
  
  Image: {{media url=photoDataUri}}`,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photoDataUri, cropType } = body;

    // Validate input
    if (!photoDataUri || typeof photoDataUri !== 'string') {
      return NextResponse.json(
        { error: 'photoDataUri is required and must be a base64 data URI string' },
        { status: 400 }
      );
    }

    if (!cropType || typeof cropType !== 'string') {
      return NextResponse.json(
        { error: 'cropType is required and must be a string' },
        { status: 400 }
      );
    }

    // Call the AI prompt directly
    try {
      const { output } = await diagnoseCropDiseasePrompt({
        photoDataUri,
        cropType,
      });

      if (!output) {
        throw new Error('AI could not analyze the image.');
      }

      return NextResponse.json(output);
    } catch (aiError) {
      console.error('AI error:', aiError);
      throw aiError; // Re-throw for outer catch to handle
    }
  } catch (error) {
    console.error('Diagnose API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to diagnose crop disease', 
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Make sure your image is a valid base64 data URI (data:image/jpeg;base64,...)'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Diagnose API is running' 
  });
}
