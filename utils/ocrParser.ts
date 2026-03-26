import { createWorker } from 'tesseract.js';

function normalizeOcrText(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .trim();
}

type OcrCandidate = {
  label: string;
  text: string;
  confidence: number;
  score: number;
};

let workerPromise: Promise<any> | null = null;

function getWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const worker = await createWorker('eng+hin');
      return worker;
    })();
  }
  return workerPromise;
}

async function buildImageVariants(file: File): Promise<string[]> {
  try {
    const imageBitmap = await createImageBitmap(file);

    const variants: string[] = [];
    const scale = 2;

    const buildVariant = (mode: 'grayscale' | 'adaptive' | 'high-contrast') => {
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width * scale;
      canvas.height = imageBitmap.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

        if (mode === 'grayscale') {
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
          continue;
        }

        if (mode === 'high-contrast') {
          const contrasted = gray > 140 ? 255 : gray < 90 ? 0 : gray;
          data[i] = contrasted;
          data[i + 1] = contrasted;
          data[i + 2] = contrasted;
          continue;
        }

        // Adaptive-ish threshold based on local intensity bands.
        const threshold = gray > 180 ? 170 : gray < 110 ? 95 : 130;
        const value = gray > threshold ? 255 : 0;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
      }

      ctx.putImageData(imageData, 0, 0);
      variants.push(canvas.toDataURL('image/png'));
    };

    buildVariant('grayscale');
    buildVariant('high-contrast');
    buildVariant('adaptive');

    return variants;
  } catch {
    return [];
  }
}

function scoreOcrText(text: string, confidence: number): number {
  if (!text) return 0;

  const lengthScore = Math.min(text.length, 1200) / 12;
  const medicalTokenHits = (text.match(/\b(rx|tab|cap|tablet|capsule|mg|ml|od|bd|tid|hs|sos|pain|fever|knee|advice|diagnosis|follow\s*up)\b/gi) || []).length;
  const lineCount = text.split('\n').filter(Boolean).length;
  const confidenceScore = Math.max(0, confidence) * 1.5;

  return lengthScore + medicalTokenHits * 15 + Math.min(lineCount, 20) * 2 + confidenceScore;
}

async function runOcr(imageSource: string, psm: string, label: string): Promise<OcrCandidate> {
  const worker = await getWorker();

  await worker.setParameters({
    tessedit_pageseg_mode: psm,
    preserve_interword_spaces: '1'
  });

  const response = await worker.recognize(imageSource);
  const text = normalizeOcrText(response?.data?.text || '');
  const confidence = Number(response?.data?.confidence || 0);

  return {
    label,
    text,
    confidence,
    score: scoreOcrText(text, confidence)
  };
}

function mergeCandidateTexts(candidates: OcrCandidate[]): string {
  const top = [...candidates]
    .filter((item) => item.text)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const seen = new Set<string>();
  const mergedLines: string[] = [];

  for (const candidate of top) {
    const lines = candidate.text.split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const key = line.toLowerCase().replace(/\s+/g, ' ');
      if (!seen.has(key)) {
        seen.add(key);
        mergedLines.push(line);
      }
    }
  }

  return mergedLines.join('\n').trim();
}

export async function parseImage(file: File): Promise<string> {
  const imageUrl = URL.createObjectURL(file);

  try {
    const enhancedVariants = await buildImageVariants(file);
    const sources: Array<{ src: string; name: string }> = [
      { src: imageUrl, name: 'original' },
      ...enhancedVariants.map((src, idx) => ({ src, name: `enhanced-${idx + 1}` }))
    ];

    const candidates: OcrCandidate[] = [];

    // Fast first pass: common block-text mode.
    for (const source of sources) {
      candidates.push(await runOcr(source.src, '6', `${source.name}-psm6`));
    }

    let best = candidates.sort((a, b) => b.score - a.score)[0];

    // Only run slower sparse-text pass when confidence is weak.
    if (!best || best.confidence < 65 || best.text.length < 120) {
      for (const source of sources) {
        candidates.push(await runOcr(source.src, '11', `${source.name}-psm11`));
      }
      best = candidates.sort((a, b) => b.score - a.score)[0];
    }

    const mergedText = mergeCandidateTexts(candidates);
    return mergedText || best?.text || '';

  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}