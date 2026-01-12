import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiProvider, AiGenerationResult, ProviderType } from './aiTypes';

export class GeminiProvider implements AiProvider {
    private client: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.client = new GoogleGenerativeAI(apiKey);
    }

    async generate(prompt: string, modelId: string, systemInstruction?: string): Promise<AiGenerationResult> {
        try {
            const model = this.client.getGenerativeModel({
                model: modelId,
                systemInstruction: systemInstruction
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                content: text,
                modelUsed: modelId,
                provider: ProviderType.GEMINI,
                // Gemini usage metadata is not always simple in the basic response, can extract if needed
            };
        } catch (error: any) {
            console.error(`Gemini Error (${modelId}):`, error);
            throw new Error(`Gemini generation failed: ${error.message}`);
        }
    }
}
