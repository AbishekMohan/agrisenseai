"use server";

import { diagnoseCropDisease as diagnoseCropFlow, type DiagnoseCropOutput } from '@/ai/flows/diagnose-crop-disease';



export async function diagnoseCrop(
    input: { photoDataUri: string; cropType: string }
): Promise<DiagnoseCropOutput> {
    return diagnoseCropFlow(input);
}
