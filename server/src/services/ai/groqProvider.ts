import Groq from 'groq-sdk';
import { AiProvider, AiGenerationResult, ProviderType } from './aiTypes';

export class GroqProvider implements AiProvider {
    private client: Groq;

    constructor(apiKey: string) {
        this.client = new Groq({ apiKey });
    }

    async generate(prompt: string, modelId: string, systemInstruction?: string): Promise<AiGenerationResult> {
        try {
            const messages: any[] = [];

            if (systemInstruction) {
                messages.push({ role: 'system', content: systemInstruction });
            }

            messages.push({ role: 'user', content: prompt });

            const completion = await this.client.chat.completions.create({
                messages: messages,
                model: modelId,
            });

            const content = completion.choices[0]?.message?.content || '';

            return {
                content: content,
                modelUsed: modelId,
                provider: ProviderType.GROQ,
                usage: {
                    promptTokens: completion.usage?.prompt_tokens || 0,
                    completionTokens: completion.usage?.completion_tokens || 0,
                    totalTokens: completion.usage?.total_tokens || 0
                }
            };
        } catch (error: any) {
            console.error(`Groq Error (${modelId}):`, error);
            throw new Error(`Groq generation failed: ${error.message}`);
        }
    }
}
