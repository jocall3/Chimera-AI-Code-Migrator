import { GoogleGenAI } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || ''; 

// We initialize client lazily or check availability in calls
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
} else {
    console.warn("Missing API_KEY environment variable for Gemini service.");
}

export const generateMigration = async (
    prompt: string,
    modelName: string = 'gemini-3-flash-preview',
    temperature: number = 0.7,
    maxTokens: number = 4096,
    topP: number = 0.95
): Promise<string> => {
    if (!aiClient) {
        // Fallback for demo purposes if no key provided, though strictly we should error
        // But for a functional "demo" UI, we might return a mock if key is missing to avoid crashing.
        // However, standard instruction says "Assume this variable is pre-configured".
        // I will throw error to prompt user to set it if missing.
        if (!process.env.API_KEY) {
             throw new Error("Gemini API Key not configured.");
        }
        aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    try {
        const response = await aiClient.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                temperature,
                maxOutputTokens: maxTokens,
                topP,
            }
        });

        return response.text || "// No output generated";
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw new Error(`Gemini API Error: ${error.message || error}`);
    }
};