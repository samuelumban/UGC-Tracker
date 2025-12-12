import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeTikTokVideo = async (videoUrl: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the following TikTok video URL: ${videoUrl}

    Simulate a content ingestion worker extracting metadata for a UGC rights management system.
    
    Tasks:
    1. Extract Author and Description.
    2. Detect audio/music used.
    3. Estimate typical engagement metrics for this content.
    4. Provide a "match confidence" score (0.0 - 1.0) indicating how likely this audio matches a known copyright database.
    
    User Context:
    - If URL contains "7567176948867255559", this is a viral hit using the user's song. High views (1.2M+), High Confidence (0.99).
    - Otherwise generate realistic mock data.
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.OBJECT,
              properties: {
                views: { type: Type.INTEGER },
                likes: { type: Type.INTEGER },
                comments: { type: Type.INTEGER },
                shares: { type: Type.INTEGER },
              },
            },
            author: { type: Type.STRING },
            description: { type: Type.STRING },
            detectedSongUrl: { type: Type.STRING },
            matchConfidence: { type: Type.NUMBER, description: "Float between 0 and 1" },
          },
          required: ["metrics", "author", "detectedSongUrl"],
        },
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      metrics: { views: 0, likes: 0, comments: 0, shares: 0 },
      author: "@unknown",
      description: "Failed to analyze content",
      detectedSongUrl: "",
      matchConfidence: 0
    };
  }
};