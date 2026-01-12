require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const { HfInference } = require('@huggingface/inference');

async function checkGemini() {
    console.log('\n--- Checking Gemini ---');
    if (!process.env.GEMINI_API_KEY) {
        console.log('Skipping: GEMINI_API_KEY not found in .env');
        return;
    }
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Note: list_models is not always straightforward in client SDKs, we might simulate or just check known ones.
        // For now we will try to get a model to verify key.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log('✅ Success! Gemini-1.5-flash is working.');
        console.log('  Response preview:', result.response.text().substring(0, 50) + '...');
    } catch (error) {
        console.log('❌ Error connecting to Gemini:', error.message);
    }
}

async function checkGroq() {
    console.log('\n--- Checking Groq ---');
    if (!process.env.GROQ_API_KEY) {
        console.log('Skipping: GROQ_API_KEY not found in .env');
        return;
    }
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const models = await groq.models.list();
        console.log('✅ Success! Available Groq Models:');
        models.data.forEach(m => console.log(`  - ${m.id}`));
    } catch (error) {
        console.log('❌ Error connecting to Groq:', error.message);
    }
}

async function checkHuggingFace() {
    console.log('\n--- Checking Hugging Face ---');
    if (!process.env.HUGGINGFACE_API_KEY) {
        console.log('Skipping: HUGGINGFACE_API_KEY not found in .env');
        return;
    }
    try {
        const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
        // Just test a simple text generation on a popular model to verify key
        console.log('Testing access to "mistralai/Mistral-7B-Instruct-v0.2"...');
        const result = await hf.textGeneration({
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            inputs: 'Hello!',
            parameters: { max_new_tokens: 10 }
        });
        console.log('✅ Success! Hugging Face Inference is working.');
        console.log('  Response preview:', result.generated_text.substring(0, 50) + '...');
    } catch (error) {
        console.log('❌ Error connecting to Hugging Face:', error.message);
    }
}

async function main() {
    console.log('Checking AI Providers configuration...');
    await checkGemini();
    await checkGroq();
    await checkHuggingFace();
    console.log('\nDone.');
}

main();
