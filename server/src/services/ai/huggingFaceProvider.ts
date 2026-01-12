import { HfInference } from '@huggingface/inference';
import { AiProvider, AiGenerationResult, ProviderType } from './aiTypes';

export class HuggingFaceProvider implements AiProvider {
    private client: HfInference;

    constructor(apiKey: string) {
        this.client = new HfInference(apiKey);
    }

    async generate(prompt: string, modelId: string, systemInstruction?: string): Promise<AiGenerationResult> {
        try {
            // Using chatCompletion designed for instruction/chat models
            let finalPrompt = prompt;
            const messages = [];

            if (systemInstruction) {
                messages.push({ role: 'system', content: systemInstruction });
            }
            messages.push({ role: 'user', content: prompt });

            // Note: chatCompletion is the modern standard for HF Inference API for most models
            const result = await this.client.chatCompletion({
                model: modelId,
                messages: messages,
                max_tokens: 500, // Limit to prevent timeouts on free tier
            });

            const content = result.choices[0].message.content || '';

            return {
                content: content,
                modelUsed: modelId,
                provider: ProviderType.HUGGINGFACE,
            };
        } catch (error: any) {
            console.error(`HuggingFace Error (${modelId}):`, error);
            throw new Error(`HuggingFace generation failed: ${error.message}`);
        }
    }
}
