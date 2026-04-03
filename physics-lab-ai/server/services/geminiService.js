import { GoogleGenerativeAI } from '@google/generative-ai';
import { ANALYSIS_PROMPT, GENERATION_PROMPT } from '../prompts/systemPrompt.js';

const MODEL_NAME = 'gemini-2.5-flash';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanJsonResponse(text) {
  let cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  // Extract the outermost JSON object
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }
  return cleaned;
}

function cleanHtmlResponse(text) {
  let cleaned = text.replace(/```html\n?/gi, '').replace(/```\n?/g, '').trim();
  // Ensure it starts with <!DOCTYPE or <html
  const doctypeIndex = cleaned.indexOf('<!DOCTYPE');
  const htmlIndex = cleaned.indexOf('<html');
  const startIndex = doctypeIndex !== -1 ? doctypeIndex : htmlIndex;
  if (startIndex > 0) {
    cleaned = cleaned.substring(startIndex);
  }
  // Ensure it ends at </html>
  const endIndex = cleaned.lastIndexOf('</html>');
  if (endIndex !== -1) {
    cleaned = cleaned.substring(0, endIndex + '</html>'.length);
  }
  return cleaned;
}

function validateHtml(html) {
  const checks = {
    hasDoctype: /<!DOCTYPE\s+html/i.test(html),
    hasCanvas: html.includes('<canvas'),
    hasScript: html.includes('<script'),
    hasClosingHtml: html.includes('</html>'),
    hasAnimationLoop: html.includes('requestAnimationFrame') || html.includes('setInterval'),
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;

  if (passed < 3) {
    console.error('[Validate] HTML failed checks:', checks);
    return false;
  }

  console.log(`[Validate] HTML passed ${passed}/${total} checks`);
  return true;
}

export async function analyzeExperiment(extractedText) {
  const startTime = Date.now();
  console.log(`[Gemini] Pass 1: Analyzing experiment (model: ${MODEL_NAME})...`);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${ANALYSIS_PROMPT}\n\n${extractedText}` }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
    },
  });

  const responseText = result.response.text();
  const cleaned = cleanJsonResponse(responseText);

  let metadata;
  try {
    metadata = JSON.parse(cleaned);
  } catch (err) {
    console.error('[Gemini] JSON parse failed. Raw (first 500 chars):', cleaned.substring(0, 500));
    throw new Error('AI returned invalid JSON during analysis. Please try again with a clearer PDF.');
  }

  // Validate required fields
  if (!metadata.title || !metadata.parameters || !metadata.governing_equations) {
    throw new Error('AI analysis is incomplete. Missing title, parameters, or equations.');
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[Gemini] Pass 1 done in ${elapsed}s | "${metadata.title}" | domain: ${metadata.domain} | ${metadata.parameters.length} params | ${metadata.observables?.length || 0} observables`);

  return metadata;
}

const LANGUAGE_INSTRUCTIONS = {
  en: '',
  si: '\n\nLANGUAGE: All UI text in the simulation (title bar, slider labels, button text, observable names, axis labels, measurement annotations) MUST be in Sinhala (Unicode). Keep variable symbols and units in English. Example: "වේගය (v)" instead of "Velocity (v)", "නැවත සකසන්න" instead of "Reset".',
  ta: '\n\nLANGUAGE: All UI text in the simulation (title bar, slider labels, button text, observable names, axis labels, measurement annotations) MUST be in Tamil (Unicode). Keep variable symbols and units in English. Example: "வேகம் (v)" instead of "Velocity (v)", "மீட்டமை" instead of "Reset".',
};

export async function generateSimulation(metadata, language = 'en') {
  const startTime = Date.now();
  console.log(`[Gemini] Pass 2: Generating simulation HTML (model: ${MODEL_NAME}, lang: ${language})...`);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || '';
  const prompt = `${GENERATION_PROMPT}${langInstruction}\n\n${JSON.stringify(metadata, null, 2)}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 65536,
    },
  });

  const responseText = result.response.text();
  const html = cleanHtmlResponse(responseText);

  if (!validateHtml(html)) {
    throw new Error('AI generated invalid simulation code. The output did not contain required HTML elements. Please try again.');
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[Gemini] Pass 2 done in ${elapsed}s | HTML: ${html.length} chars | has canvas: ${html.includes('<canvas')} | has rAF: ${html.includes('requestAnimationFrame')}`);

  return html;
}
