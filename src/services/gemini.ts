import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getChatResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = []) {
  if (!ai) return "AI service is not configured. Please check your API key.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are MindEase AI, a supportive and empathetic mental health assistant. 
        Your goal is to provide psychological support, stress management tips, and a listening ear. 
        Always be kind, non-judgmental, and encourage professional help for serious issues. 
        Keep responses concise but meaningful. Use professional but warm language.`,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my cognitive centers right now. Please try again in a moment.";
  }
}
