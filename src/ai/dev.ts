import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-recommendations.ts';
import '@/ai/flows/answer-farming-questions-via-chat.ts';
import '@/ai/flows/diagnose-crop-disease.ts';
