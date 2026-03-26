type AnalyzePayload = {
  fileBase64: string;
  mimeType: string;
  text: string;
  age: string;
  language: string;
};

type ChatPayload = {
  question: string;
  contextJson: any;
  history: any[];
};

async function postAI<T>(payload: { action: "analyze"; data: AnalyzePayload } | { action: "chat"; data: ChatPayload }): Promise<T> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error || "AI request failed.");
  }

  return result.data as T;
}

export async function analyzeDocument(fileBase64: string, mimeType: string, text: string, age: string, language: string) {
  return postAI<any>({
    action: "analyze",
    data: { fileBase64, mimeType, text, age, language },
  });
}

export async function chatWithDocument(question: string, contextJson: any, history: any[]) {
  return postAI<string>({
    action: "chat",
    data: { question, contextJson, history },
  });
}
