import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are CampusAI, a friendly AI study companion for college students. Help students with:
- Academic questions across subjects
- Simple, clear explanations of complex topics
- Summaries of concepts, chapters, or articles
- Generating structured study notes
- Programming help with code examples
Keep answers concise, accurate, and educational. Use markdown formatting when helpful. If a question is outside academic scope, gently steer back to studying.`;

const MODEL = "gemini-3.6-flash";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          reply:
            "The AI assistant isn't configured yet. An administrator needs to add a Gemini API key. In the meantime, try creating notes or organizing your subjects!",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error", res.status, errText);
      return new Response(
        JSON.stringify({ error: "The AI service is unavailable. Please try again shortly." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I couldn't generate a response. Could you rephrase your question?";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-chat error", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
