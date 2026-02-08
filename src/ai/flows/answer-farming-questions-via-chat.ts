import { ai, generateWithFallback, type GeminiModel } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerFarmingQuestionsInputSchema = z.object({
  question: z.string().describe('The farming-related question to be answered.'),
  language: z.string().optional().describe('The preferred language for the answer (e.g., Hindi, Punjabi, Tamil).'),
});
export type AnswerFarmingQuestionsInput = z.infer<typeof AnswerFarmingQuestionsInputSchema>;

const AnswerFarmingQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the farming-related question.'),
});
export type AnswerFarmingQuestionsOutput = z.infer<typeof AnswerFarmingQuestionsOutputSchema>;

const prompt = ai.definePrompt({
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

const answerFarmingQuestionsViaChatFlow = ai.defineFlow(
  {
    name: 'answerFarmingQuestionsViaChatFlow',
    inputSchema: AnswerFarmingQuestionsInputSchema,
    outputSchema: AnswerFarmingQuestionsOutputSchema,
  },
  async input => {
    try {
      // Use generateWithFallback to automatically try different models on rate limits
      // Fallback order: Gemini 3 Flash → 2.5 Flash → 2.5 Flash Lite
      return await generateWithFallback(async (model: GeminiModel) => {
        const { output } = await prompt(input, { model });
        if (!output) throw new Error('AI failed to generate a response.');
        return output as AnswerFarmingQuestionsOutput;
      });
    } catch (error: any) {
      console.error('Error in answerFarmingQuestionsViaChatFlow:', error);
      // Propagate error so the UI shows a proper error state instead of a fake "I'm busy" message
      throw error;
    }
  }
);

export async function answerFarmingQuestionsViaChat(input: AnswerFarmingQuestionsInput): Promise<AnswerFarmingQuestionsOutput> {
  return answerFarmingQuestionsViaChatFlow(input);
}
