const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
const AI_ENDPOINT = BACKEND_URL ? `${BACKEND_URL.replace(/\/$/, "")}/api/ai` : "/api/ai";

async function callAi(action: "analyze" | "chat", data: Record<string, unknown>) {
  let response: Response;

  try {
    response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, data }),
    });
  } catch {
    throw new Error("Unable to reach the AI service. Please check your connection and server status.");
  }

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || "AI request failed.");
  }

  return payload?.data;
}

export async function analyzeDocument(text: string, age: string, language: string) {
  return callAi("analyze", { text, age, language });
}

export async function chatWithDocument(question: string, result: any, history: any[]) {
  return callAi("chat", { question, contextJson: result, history });
}