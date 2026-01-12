import { AiProvider, ModelConfig, ProviderType, AiGenerationResult } from './aiTypes';
import { GeminiProvider } from './geminiProvider';
import { GroqProvider } from './groqProvider';
import { HuggingFaceProvider } from './huggingFaceProvider';
import dotenv from 'dotenv';

dotenv.config();

// Define the Models & Priorities
// Priority 1: High speed/performance (Groq)
// Priority 2: High quality/window (Gemini)
// Priority 3: Fallbacks
export const AVAILABLE_MODELS: ModelConfig[] = [
    // Priority List
    { id: 'gemini-1.5-pro', provider: ProviderType.GEMINI, priority: 1, contextWindow: 2000000 },
    { id: 'llama-3.1-8b-instant', provider: ProviderType.GROQ, priority: 2, contextWindow: 8192 },
    { id: 'mixtral-8x7b-32768', provider: ProviderType.GROQ, priority: 3, contextWindow: 32768 },
    { id: 'llama-3.3-70b-versatile', provider: ProviderType.GROQ, priority: 4, contextWindow: 32768 },
    { id: 'Qwen/Qwen2.5-7B-Instruct', provider: ProviderType.HUGGINGFACE, priority: 5, contextWindow: 32768 },

    // Backup List
    { id: 'gemini-1.5-flash', provider: ProviderType.GEMINI, priority: 6, contextWindow: 1000000 },
    { id: 'gemma2-9b-it', provider: ProviderType.GROQ, priority: 7, contextWindow: 8192 },
    { id: 'microsoft/DialoGPT-medium', provider: ProviderType.HUGGINGFACE, priority: 8, contextWindow: 1024 },
    { id: 'gpt2', provider: ProviderType.HUGGINGFACE, priority: 9, contextWindow: 1024 },
];

export class ModelRegistry {
    private gemini: GeminiProvider;
    private groq: GroqProvider;
    private hf: HuggingFaceProvider;

    constructor() {
        this.gemini = new GeminiProvider(process.env.GEMINI_API_KEY || '');
        this.groq = new GroqProvider(process.env.GROQ_API_KEY || '');
        this.hf = new HuggingFaceProvider(process.env.HUGGINGFACE_API_KEY || '');
    }

    private getProvider(type: ProviderType): AiProvider {
        switch (type) {
            case ProviderType.GEMINI: return this.gemini;
            case ProviderType.GROQ: return this.groq;
            case ProviderType.HUGGINGFACE: return this.hf;
            default: throw new Error(`Unknown provider type: ${type}`);
        }
    }

    /**
     * Tries to generate content using models in order of priority.
     * If a model drains/fails, it moves to the next one.
     */
    async generateWithFallback(prompt: string, systemInstruction?: string): Promise<AiGenerationResult> {
        // Sort models by priority
        const sortedModels = [...AVAILABLE_MODELS].sort((a, b) => a.priority - b.priority);

        const errors: string[] = [];

        for (const modelConfig of sortedModels) {
            try {
                // console.log(`Attempting generation with ${modelConfig.provider}:${modelConfig.id} (Priority ${modelConfig.priority})...`);
                const provider = this.getProvider(modelConfig.provider);
                const result = await provider.generate(prompt, modelConfig.id, systemInstruction);
                return result; // Success! Return immediately.
            } catch (error: any) {
                // console.warn(`Model ${modelConfig.id} failed: ${error.message}. Switching to next...`);
                errors.push(`${modelConfig.id}: ${error.message}`);
                continue; // Try next model
            }
        }

        // If we get here, ALL models failed
        throw new Error(`All AI models failed. Errors: ${errors.join('; ')}`);
    }
}

export const aiRegistry = new ModelRegistry();
