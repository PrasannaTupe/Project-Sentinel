
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    }
  }

  async askAssistant(prompt: string, context?: string): Promise<string> {
    if (!this.ai) return "AI service is currently unavailable. (API Key missing)";

    try {
      const systemInstruction = `
        You are "Sentinel", the JARVIS-style team intelligence assistant for Project Sentinel.
        You have deep institutional memory of meetings, decisions, and tasks.
        Your tone is professional, helpful, futuristic, and proactive.
        Context: ${context || 'General team intelligence'}
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return response.text || "I'm having trouble thinking right now.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Something went wrong in my neural network.";
    }
  }

  async summarizeMeeting(meetingText: string): Promise<string> {
    if (!this.ai) return "Summarization unavailable.";
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize this meeting transcript: ${meetingText}`,
        config: {
          systemInstruction: "You are a concise business analyst extracting decisions and action items."
        }
      });
      return response.text || "Summary failed.";
    } catch (error) {
       return "Error generating summary.";
    }
  }
}

export const gemini = new GeminiService();
