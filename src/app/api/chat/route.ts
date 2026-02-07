import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define schemas locally
const AnswerFarmingQuestionsInputSchema = z.object({
  question: z.string().describe('The farming-related question to be answered.'),
  language: z.string().optional().describe('The preferred language for the answer (e.g., Hindi, Punjabi, Tamil).'),
});

const AnswerFarmingQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the farming-related question.'),
});

// Define the prompt inline
const answerFarmingQuestionsPrompt = ai.definePrompt({
  name: 'answerFarmingQuestionsPrompt',
  input: { schema: AnswerFarmingQuestionsInputSchema },
  output: { schema: AnswerFarmingQuestionsOutputSchema },
  system: 'You are a helpful AI assistant for farmers in India. Provide precise, helpful, and empathetic answers to agricultural queries in the requested language.',
  prompt: `You are a helpful AI assistant for farmers in India. 
  Answer the following question about farming, crops, and farm management.
  
  IMPORTANT: You must provide the answer in the following language: {{language}}. 
  If no language is specified, default to English. 
  Use a supportive, expert tone suitable for rural agricultural contexts.

  Question: {{{question}}}`,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, language } = body;

    // Validate input
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Call the AI prompt directly
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
    const maxAttempts = 3;
    const baseDelay = 2000; // ms

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const { output } = await answerFarmingQuestionsPrompt({
          question,
          language: language || 'English',
        });

        if (!output) {
          throw new Error('AI failed to generate a response.');
        }

        return NextResponse.json(output);
      } catch (aiError: any) {
        const message = aiError?.message?.toLowerCase?.() ?? '';
        const isRateLimit =
          message.includes('quota') ||
          message.includes('limit') ||
          message.includes('429') ||
          message.includes('rate');

        if (isRateLimit && attempt < maxAttempts) {
          const delay = baseDelay * attempt; // 2s, 4s
          console.warn(`Chat API rate-limited; retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
          await sleep(delay);
          continue;
        }

        console.error('AI error:', aiError);
        // Return a safe conversational fallback
        return NextResponse.json({
          answer: "I'm a bit busy right now. Please try again in a minute or contact your local Krishi Vigyan Kendra for urgent help."
        });
      }
    }

    // Should not reach here, but return fallback just in case
    return NextResponse.json({
      answer: "I'm a bit busy right now. Please try again shortly."
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Chat API is running' 
  });
}
