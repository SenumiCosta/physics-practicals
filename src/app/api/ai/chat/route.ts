import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT: Record<string, string> = {
  en: `You are a friendly and knowledgeable physics tutor specializing in Sri Lankan Advanced Level (A/L) Physics. Explain concepts clearly at the A/L level. Use LaTeX notation for formulas ($ for inline, $$ for display). Give step-by-step explanations. Be encouraging and patient. Respond in English.`,
  si: `You are a friendly physics tutor for Sri Lankan A/L students. Respond in Sinhala. Use English for technical terms and formulas. Use LaTeX for math notation.`,
  ta: `You are a friendly physics tutor for Sri Lankan A/L students. Respond in Tamil. Use English for technical terms and formulas. Use LaTeX for math notation.`,
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { messages, locale = "en" } = body;

  const systemPrompt = SYSTEM_PROMPT[locale] || SYSTEM_PROMPT.en;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          const userFriendly = message.includes("429") || message.includes("quota")
            ? "API quota exceeded. Please wait a few minutes and try again."
            : `Something went wrong: ${message}`;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: userFriendly })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const userFriendly = message.includes("429") || message.includes("quota")
      ? "API quota exceeded. Please wait a few minutes and try again."
      : "Something went wrong. Please try again.";
    return NextResponse.json({ error: userFriendly }, { status: 500 });
  }
}
