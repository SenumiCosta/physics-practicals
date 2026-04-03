import fs from 'fs';
import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  // Clean up the temp file
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore cleanup errors
  }

  const text = data.text.trim();

  if (!text || text.length < 20) {
    throw new Error('Could not extract meaningful text from the PDF. Please ensure the PDF contains readable text (not scanned images).');
  }

  return text;
}
