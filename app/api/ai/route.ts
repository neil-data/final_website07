import { NextResponse } from "next/server";

const schema = {
  type: "object",
  properties: {
    familySummary: { type: "string", description: "A one-line summary of the diagnosis for family members." },
    diagnosis: { type: "string", description: "Plain language diagnosis as a short paragraph. No bullet points." },
    medications: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          dosage: { type: "string" },
          timing: { type: "string", description: "e.g., Morning, Afternoon, Night, Bedtime" },
          days: { type: "string" },
        },
      },
    },
    sideEffects: { type: "array", items: { type: "string" }, description: "2 to 3 side effects to watch for." },
    doctorCallWarnings: { type: "array", items: { type: "string" }, description: "Urgent warnings to call the doctor." },
    followUp: {
      type: "object",
      properties: {
        tests: { type: "array", items: { type: "string" } },
        diet: { type: "array", items: { type: "string" } },
        activity: { type: "array", items: { type: "string" } },
      },
    },
    jargonMap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string", description: "The hard medical word found in the text." },
          explanation: { type: "string", description: "Plain meaning of the word." },
        },
      },
    },
  },
  required: ["familySummary", "diagnosis", "medications", "sideEffects", "doctorCallWarnings", "followUp", "jargonMap"],
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getGroqApiKey() {
  const raw = process.env.GROQ_API_KEY || process.env.groq_api_key;
  const apiKey = raw?.trim().replace(/^['\"]|['\"]$/g, "");

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY (or groq_api_key). Set it in your environment variables.");
  }

  if (!/^gsk_[A-Za-z0-9]+$/.test(apiKey)) {
    throw new Error("Invalid GROQ_API_KEY format. It should start with 'gsk_'.");
  }

  return apiKey;
}

function safeJsonParse(input: string) {
  const cleaned = input
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

async function callGroq(messages: any[], temperature: number, maxTokens: number, responseAsJson: boolean) {
  const apiKey = getGroqApiKey();
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(responseAsJson ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  const responseText = await response.text();
  let parsed: any = null;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    const providerError = parsed?.error?.message || responseText || "Unknown Groq error";

    if (response.status === 401) {
      throw new Error(
        "Groq API error (401): Invalid API Key. Generate a new key at https://console.groq.com/keys, update GROQ_API_KEY in .env.local, then restart the Next.js server."
      );
    }

    throw new Error(`Groq API error (${response.status}): ${providerError}`);
  }

  const content = parsed?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Groq returned an empty response.");
  }

  return content;
}

async function handleAnalyze(data: any) {
  const prompt = `Analyze this medical document and return ONLY valid JSON.
  Patient Age: ${data?.age || "Not provided"}
  Target Language for output: ${data?.language || "English"}

  Use this schema exactly:
  ${JSON.stringify(schema)}

  If text is provided, use it.
  If no text is provided, infer a safe best-effort summary and leave unknown fields as empty strings or empty arrays.
  Text: ${data?.text || "None provided"}
  `;

  const content = await callGroq([{ role: "user", content: prompt }], 0.2, 4096, true);
  return safeJsonParse(content);
}

async function handleChat(data: any) {
  const prompt = `You are a helpful medical assistant explaining a prescription/report to a patient.
  Answer the user's question based ONLY on the provided document context.
  Keep it simple, empathetic, and easy to understand.

  Document Context:
  ${JSON.stringify(data?.contextJson, null, 2)}

  Question: ${data?.question || ""}
  `;

  const history = Array.isArray(data?.history) ? data.history : [];
  const messages = [
    ...history.map((item: any) => ({
      role: item?.role === "ai" ? "assistant" : "user",
      content: String(item?.text || ""),
    })),
    { role: "user", content: prompt },
  ];

  return callGroq(messages, 0.3, 1024, false);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body?.action;
    const data = body?.data;

    if (action === "analyze") {
      const result = await handleAnalyze(data);
      return NextResponse.json({ data: result });
    }

    if (action === "chat") {
      const result = await handleChat(data);
      return NextResponse.json({ data: result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("AI route error:", error);
    const message = error?.message || "AI request failed";
    const normalized = message.toLowerCase();
    const status =
      normalized.includes("missing groq_api_key") || normalized.includes("invalid groq_api_key format")
        ? 400
        : normalized.includes("groq api error (401)")
          ? 401
          : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
