import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Explicitly pass the Gemini API key so we can keep using the workspace `.env`
// entry (`GOOGLE_GENAI_API_KEY`) that traces back to the "Gemini Project" key.
const geminiApiKey =
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

// Models in fallback order: Gemini 3 Flash → 2.5 Flash → 2.5 Flash Lite
export const GEMINI_MODELS = [
  'googleai/gemini-3-flash-preview',
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.5-flash-lite',
] as const;

export type GeminiModel = typeof GEMINI_MODELS[number];

// Helper to check if an error is a rate limit error
export function isRateLimitError(error: any): boolean {
  const message = error?.message?.toLowerCase?.() ?? '';
  return (
    message.includes('quota') ||
    message.includes('limit') ||
    message.includes('429') ||
    message.includes('rate') ||
    message.includes('resource_exhausted')
  );
}

// Generate with automatic model fallback and robust retries
// Tries each model in order. If all fail (rate limited), waits and tries the set again.
export async function generateWithFallback<T>(
  generateFn: (model: GeminiModel) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any;
  const baseDelay = 2000; // 2 seconds

  // Outer loop: Retry rounds (e.g. 3 rounds of trying all models)
  for (let attempt = 1; attempt <= maxRetries; attempt++) {

    // Inner loop: Try each model in the fallback chain
    for (const model of GEMINI_MODELS) {
      try {
        console.log(`Attempt ${attempt}: Trying model: ${model}`);
        return await generateFn(model);
      } catch (error: any) {
        lastError = error;

        if (isRateLimitError(error)) {
          console.warn(`Model ${model} rate limited.`);
          continue; // Try next model immediately
        }

        // For non-rate-limit errors (like invalid input), throw immediately
        throw error;
      }
    }

    // If we're here, ALL models in this round were rate limited.
    if (attempt < maxRetries) {
      const delay = baseDelay * attempt; // Linear backoff: 2s, 4s, 6s...
      console.warn(`All models rate limited in round ${attempt}. Waiting ${delay}ms before retrying...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All rounds failed
  console.error('All models and retries exhausted:', lastError);
  throw lastError;
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: geminiApiKey })],
  // Default model (first in the fallback chain)
  model: process.env.GENKIT_MODEL || GEMINI_MODELS[0],
});
