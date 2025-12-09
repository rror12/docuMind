
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an answer using the Gemini model based on provided context and a question.
 * @param context The text content extracted from the user's documents.
 * @param question The user's question.
 * @returns A promise that resolves to the model's generated answer.
 */
export const generateAnswer = async (context: string, question: string): Promise<string> => {
  if (!context.trim()) {
    return "I can't answer questions without any documents. Please upload one or more files first.";
  }

  const model = 'gemini-2.5-flash';

  // This prompt structure is crucial for effective Retrieval-Augmented Generation.
  // It instructs the model on how to behave and provides the necessary data.
  const prompt = `You are an expert AI assistant named DocuMind. Your task is to answer questions based exclusively on the provided document context.
- Analyze the context thoroughly.
- Provide a clear, concise, and accurate answer based only on the information within the documents.
- If the answer cannot be found in the context, you must explicitly state: "I could not find the answer in the provided documents."
- Do not use any external knowledge or make assumptions.

CONTEXT:
---
${context}
---

QUESTION:
${question}

ANSWER:
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    // Using response.text for direct text output, which is the recommended approach.
    return response.text.trim();
  } catch (error) {
    console.error("Error generating answer from Gemini API:", error);
    return "I'm sorry, but I encountered an unexpected error while trying to generate a response. Please check the console for more details and try again.";
  }
};
