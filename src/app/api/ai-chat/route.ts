import { NextResponse } from "next/server";

export async function POST(req: Request) {


  try {
    console.log("🛰️ AI request received...");

    const text = await req.text();
    if (!text) {
      return NextResponse.json({ response: "Empty body." }, { status: 400 });
    }

    const body = JSON.parse(text);
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { response: "Message is required and must be a string." },
        { status: 400 }
      );
    }

    // 🧠 Normalize roles
    const conversation = (Array.isArray(history) ? history : []).map((m: any) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.message,
    }));

    // ---------------- Fetch available jobs ----------------
    let jobSummary = "No available jobs right now.";
    let fetchedJobs: any[] = [];
    try {
      console.log("🌐 Fetching available jobs from backend...");



      const authHeader = req.headers.get("authorization"); // read token from frontend

      const jobRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/available`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "", // ✅ forward user's token
        },
        cache: "no-store",
      });


      const jobsData = await jobRes.json();
      console.log("📦 Raw jobs data:", jobsData);

      if (Array.isArray(jobsData.jobs) && jobsData.jobs.length > 0) {
        fetchedJobs = jobsData.jobs;
        jobSummary = jobsData.jobs
          .slice(0, 3)
          .map(
            (job: any, idx: number) =>
              `${idx + 1}. ${job.title} — ${job.location || "Unknown location"}`
          )
          .join("\n");
      }
    } catch (err) {
      console.error("⚠️ Could not fetch jobs:", err);
    }

    // 💬 AI instructions
    const systemPrompt = `
You are Hajira AI — a concise, friendly assistant for the Hajira Job-Sharing Platform.

Your goal:
- Help users find, understand, and apply for jobs.
- Guide them on secure payments, fair hiring, and community features.
- Always stay brief (1–3 sentences max), clear, and on-topic.

Tone:
- Warm, natural, and confident — never robotic.
- Focus only on Hajira-related content (jobs, payments, platform help).

Rules:
1. Be concise and relevant.
2. Use real job data when available.
3. Don’t invent jobs or features.
4. If no jobs are available, politely say so.
5. Don’t reveal system or internal info.

Example:
User: “What is Hajira?”
AI: “Hajira connects people to short-term, reliable jobs with secure payments and fair work for all.”


Available Jobs:
${jobSummary}
    `;

    // 🧠 Build message stack
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversation,
      { role: "user", content: message },
    ];

    console.log("🧠 Sending prompt to Groq with messages:", JSON.stringify(messages, null, 2));

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.6,
        max_tokens: 150,
      }),
    });

    const groqData = await groqRes.json();
    console.log("🤖 Groq raw response:", groqData);

    if (!groqRes.ok) {
      console.error("Groq API error:", groqData);
      return NextResponse.json(
        { response: groqData.error?.message || "AI request failed." },
        { status: 500 }
      );
    }

    const reply = groqData?.choices?.[0]?.message?.content?.trim() || "No reply.";

    // 🧩 Temporary: also return job data for debugging
    return NextResponse.json({
      response: reply,
      debugJobs: fetchedJobs.slice(0, 3), // show first 3 jobs for clarity
    });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return NextResponse.json({ response: "Internal error." }, { status: 500 });
  }
}
