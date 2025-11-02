import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, history } = await req.json();

  const prompt = `
You are an AI chat assistant specialized in helping someone write their next chat message.
Conversation so far:
${history.map((m: any) => `${m.sender}: ${m.message}`).join("\n")}

They are currently typing: "${text}"
Suggest a natural, friendly, short continuation for their message (no quotes, no explanations).
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 15,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return NextResponse.json(
        { suggestion: "", error: "Failed to fetch suggestion" },
        { status: response.status }
      );
    }

    const suggestion = data?.choices?.[0]?.message?.content?.trim() || "";
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Error fetching suggestion:", error);
    return NextResponse.json(
      { suggestion: "", error: "Internal server error" },
      { status: 500 }
    );
  }
}
