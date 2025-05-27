import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Remove your custom SafetySetting interface and use the library's types instead
interface GeminiRequest {
  contents: {
    role: "user" | "model";
    parts: { text: string }[];
  }[];
  safetySettings?: {
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }[];
  generationConfig?: {
    maxOutputTokens?: number;
    temperature?: number;
  };
}
