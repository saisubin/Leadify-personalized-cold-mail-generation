export interface AiGenerationResult {
    content: string;
    modelUsed: string;
    provider: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface AiProvider {
    generate(prompt: string, modelId: string, systemInstruction?: string): Promise<AiGenerationResult>;
}

export enum ProviderType {
    GEMINI = 'GEMINI',
    GROQ = 'GROQ',
    HUGGINGFACE = 'HUGGINGFACE',
}

export interface ModelConfig {
    id: string; // The model ID sent to the API
    provider: ProviderType;
    priority: number; // 1 = Highest, 2 = Medium, etc.
    contextWindow: number;
}
