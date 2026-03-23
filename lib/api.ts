const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function analyzeDocument(text: string, age: string, language: string) {
  const response = await fetch(`${BACKEND_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, age, language }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error || "AI request failed.");
  }

  return result;
}

export async function chatWithDocument(question: string, result: any, history: any[]) {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, result, history }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Chat request failed.");
  }

  return data.answer;
}