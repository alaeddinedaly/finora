import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

type Transaction = {
  date: string;
  amount: number | string; // allow string input as well
  category: string;
  description?: string;
};

export const getFinoraAIResponse = async (
  prompt: string,
  transactions?: Transaction[],
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const instructions = `
      You are Finora AI, a helpful financial assistant. Help the user based on their recent financial activity.
      
      Use the transaction data if helpful. Otherwise, provide general advice. Follow these rules:
      1. Be concise (1-2 sentences)
      2. Speak naturally
      3. Ask for clarification if needed
      4. Don't fabricate financial advice
    `;

    const transactionSummary =
      transactions && transactions.length > 0
        ? `Here are some recent transactions:\n${transactions
            .slice(0, 10)
            .map((tx) => {
              // convert amount to number safely
              const amountNum =
                typeof tx.amount === "number" ? tx.amount : Number(tx.amount);
              const safeAmount = isNaN(amountNum) ? 0 : amountNum;

              return `- ${tx.date}: $${safeAmount.toFixed(2)} on ${tx.category}${
                tx.description ? ` (${tx.description})` : ""
              }`;
            })
            .join("\n")}`
        : "";

    const userInput = `User: ${prompt}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${instructions}\n\n${transactionSummary}\n\n${userInput}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I'm having trouble understanding. Could you rephrase your question about Finora's services?";
  }
};
