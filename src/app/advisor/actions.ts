"use server";

import { generatePersonalizedRecommendations as generateRecsFlow, type GeneratePersonalizedRecommendationsInput, type GeneratePersonalizedRecommendationsOutput } from '@/ai/flows/generate-personalized-recommendations';
import { answerFarmingQuestionsViaChat as chatFlow, type AnswerFarmingQuestionsInput, type AnswerFarmingQuestionsOutput } from '@/ai/flows/answer-farming-questions-via-chat';

export async function getPersonalizedRecommendations(
    input: GeneratePersonalizedRecommendationsInput
): Promise<GeneratePersonalizedRecommendationsOutput> {
    return generateRecsFlow(input);
}

export async function askFarmingQuestion(
    input: AnswerFarmingQuestionsInput
): Promise<AnswerFarmingQuestionsOutput> {
    return chatFlow(input);
}
