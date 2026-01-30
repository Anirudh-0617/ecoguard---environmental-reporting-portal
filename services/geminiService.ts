
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeComplaint = async (
  description: string,
  language: string,
  imageBase64?: string
): Promise<AIAnalysis> => {
  if (!ai) {
    console.error("Gemini AI not initialized (missing API key)");
    return {
      category: "Pending Review",
      priority: "Medium",
      department: "General Administration",
      actionPlan: ["Review complaint text manually", "Dispatch assessment team"]
    };
  }
  try {
    const prompt = `
      You are an environmental expert analyzing citizen complaints.
      Complaint Language: ${language}
      Complaint Text: "${description}"

      Analyze this and provide:
      1. Category (Solid Waste, Water Pollution, Air Quality, etc.)
      2. Priority (High, Medium, Low)
      3. Responsible Department (Sanitation Dept, Pollution Board, etc.)
      4. A structured 5-step Action Plan for officials.

      Return the data strictly in JSON format.
    `;

    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64.split(',')[1] || imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            department: { type: Type.STRING },
            actionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["category", "priority", "department", "actionPlan"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      category: result.category || "Unclassified",
      priority: (result.priority as any) || "Medium",
      department: result.department || "General Municipal",
      actionPlan: result.actionPlan || ["Assess the situation", "Notify responsible team", "Take corrective action"]
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      category: "Pending Review",
      priority: "Medium",
      department: "General Administration",
      actionPlan: ["Review complaint text manually", "Dispatch assessment team"]
    };
  }
};

export interface MapsResult {
  text: string;
  links: { title: string; uri: string }[];
}

export const searchNearbyServices = async (
  query: string,
  lat: number,
  lng: number
): Promise<MapsResult> => {
  if (!ai) {
    return {
      text: "Nearby services search unavailable (AI not initialized).",
      links: []
    };
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const links: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.maps) {
        links.push({
          title: chunk.maps.title || "View on Maps",
          uri: chunk.maps.uri
        });
      }
    });

    return {
      text: response.text || "Here are some results near you.",
      links
    };
  } catch (error) {
    console.error("Maps grounding failed:", error);
    return {
      text: "Unable to find nearby services at this time.",
      links: []
    };
  }
};
