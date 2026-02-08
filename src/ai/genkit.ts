import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Explicitly pass the Gemini API key so we can keep using the workspace `.env`
// entry (`GOOGLE_GENAI_API_KEY`) that traces back to the "Gemini Project" key.
const geminiApiKey =
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

// Available Gemini models for rotation to distribute API calls
export const GEMINI_MODELS = [
  'googleai/gemini-2.5-flash-lite',
  'googleai/gemini-3-flash-preview',
  'googleai/gemini-2.5-flash',
] as const;

// Simple round-robin model selector
let modelIndex = 0;
export function getNextModel(): string {
  const model = GEMINI_MODELS[modelIndex];
  modelIndex = (modelIndex + 1) % GEMINI_MODELS.length;
  return model;
}

// Get a specific model by name
export function getModel(name: 'flash-lite' | 'flash-3' | 'flash-2.5'): string {
  switch (name) {
    case 'flash-lite':
      return 'googleai/gemini-2.5-flash-lite';
    case 'flash-3':
      return 'googleai/gemini-3-flash-preview';
    case 'flash-2.5':
      return 'googleai/gemini-2.5-flash';
  }
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: geminiApiKey })],
  // Allow overriding model via env; default to rotating between all three models
  model: process.env.GENKIT_MODEL || getNextModel(),
});
