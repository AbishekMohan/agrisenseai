import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Explicitly pass the Gemini API key so we can keep using the workspace `.env`
// entry (`GOOGLE_GENAI_API_KEY`) that traces back to the "Gemini Project" key.
const geminiApiKey =
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

export const ai = genkit({
  plugins: [googleAI({ apiKey: geminiApiKey })],
  // Allow overriding model via env; default to a known-available model id.
  model: process.env.GENKIT_MODEL || 'googleai/gemini-3-flash-preview',
});
