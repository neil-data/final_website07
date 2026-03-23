import Tesseract from 'tesseract.js';

export async function parseImage(file: File): Promise<string> {
  const imageUrl = URL.createObjectURL(file);

  try {
    const result = await Tesseract.recognize(imageUrl, 'eng+hin', {
      logger: () => {}, // suppress logs
    });

    return result.data.text.trim();
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}