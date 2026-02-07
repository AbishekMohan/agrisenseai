import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  input: {schema: AnswerFarmingQuestionsInputSchema},
  output: {schema: AnswerFarmingQuestionsOutputSchema},
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
    // Small retry loop to smooth over transient 429/quota throttles.
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
    const maxAttempts = 3;
    const baseDelay = 2000; // ms

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const {output} = await prompt(input);
        if (!output) throw new Error('AI failed to generate a response.');
        return output;
      } catch (error: any) {
        const message = error?.message?.toLowerCase?.() ?? '';
        const isRateLimit =
          message.includes('quota') ||
          message.includes('limit') ||
          message.includes('429') ||
          message.includes('rate');

        if (isRateLimit && attempt < maxAttempts) {
          const delay = baseDelay * attempt; // 2s, 4s
          console.warn(`Chat flow rate-limited; retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
          await sleep(delay);
          continue;
        }

        console.error('Error in answerFarmingQuestionsViaChatFlow:', error);
        break;
      }
    }

    // Safe fallback so the UI keeps moving.
    return {
      answer: "I'm a bit busy right now. Please try again in a minute or contact your local Krishi Vigyan Kendra for urgent help."
    };
  }
);

export async function answerFarmingQuestionsViaChat(input: AnswerFarmingQuestionsInput): Promise<AnswerFarmingQuestionsOutput> {
  return answerFarmingQuestionsViaChatFlow(input);
}
