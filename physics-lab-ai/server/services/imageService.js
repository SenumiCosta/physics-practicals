import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const IMAGE_PROMPT = `You are reading a photo or scan of a physics practical / experiment sheet. Extract ALL the text content from this image exactly as written. Include:
- Experiment title
- Theory and equations
- Procedure steps
- Apparatus list
- Any tables, data, or diagrams described in text
- Any handwritten notes if legible

Return the extracted text as plain text. If the image shows a diagram with labels, describe the diagram and list all labels. Be thorough — do not skip any visible text.`;

export async function extractTextFromImage(filePath, mimeType) {
  const imageData = fs.readFileSync(filePath);
  const base64 = imageData.toString('base64');

  // Clean up temp file
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [
        { text: IMAGE_PROMPT },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64,
          },
        },
      ],
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
    },
  });

  const text = result.response.text().trim();

  if (!text || text.length < 20) {
    throw new Error('Could not extract meaningful text from the image. Please upload a clearer photo.');
  }

  console.log(`[Image] Extracted ${text.length} characters via Gemini Vision`);
  return text;
}
