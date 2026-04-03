import { extractTextFromPDF } from '../services/pdfService.js';
import { extractTextFromImage } from '../services/imageService.js';
import { analyzeExperiment, generateSimulation } from '../services/geminiService.js';
import { BUILTIN_PRACTICALS } from '../data/builtinPracticals.js';
import * as store from '../config/store.js';

const IMAGE_MIMES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

async function extractTextFromFile(file) {
  if (IMAGE_MIMES.includes(file.mimetype)) {
    return await extractTextFromImage(file.path, file.mimetype);
  }
  return await extractTextFromPDF(file.path);
}

export async function generateFromPDF(req, res) {
  const totalStart = Date.now();
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const language = req.body?.language || 'en';
  const filenames = files.map((f) => f.originalname).join(', ');
  console.log(`\n========================================`);
  console.log(`[Pipeline] New request: ${files.length} file(s) -- ${filenames} [lang: ${language}]`);
  console.log(`========================================`);

  try {
    console.log(`[Pipeline] Step 1/3: Extracting text from ${files.length} file(s)...`);
    const textParts = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = IMAGE_MIMES.includes(file.mimetype);
      console.log(`[Pipeline]   File ${i + 1}/${files.length}: ${file.originalname} (${isImage ? 'image' : 'PDF'})`);
      textParts.push(await extractTextFromFile(file));
    }
    const extractedText = textParts.join('\n\n--- Next Page/Image ---\n\n');
    console.log(`[Pipeline] Total extracted: ${extractedText.length} characters`);

    console.log('[Pipeline] Step 2/3: AI Analysis...');
    const metadata = await analyzeExperiment(extractedText);

    console.log('[Pipeline] Step 3/3: AI Code Generation...');
    const generatedHtml = await generateSimulation(metadata, language);

    // Save to history
    const saved = store.saveSimulation({
      title: metadata.title || 'Untitled Experiment',
      originalFilename: filenames,
      extractedText,
      metadata,
      html: generatedHtml,
      domain: metadata.domain || 'mechanics',
    });

    const totalElapsed = ((Date.now() - totalStart) / 1000).toFixed(1);
    console.log(`[Pipeline] Complete in ${totalElapsed}s`);
    console.log(`========================================\n`);

    res.json({
      id: saved.id,
      title: metadata.title,
      domain: metadata.domain,
      metadata,
      html: generatedHtml,
      created_at: saved.created_at,
    });
  } catch (err) {
    console.error('[Pipeline] Error:', err.message);

    for (const file of files) {
      if (file.path) {
        try { (await import('fs')).unlinkSync(file.path); } catch { /* ignore */ }
      }
    }

    res.status(500).json({
      error: err.message || 'Failed to generate simulation. Please try again.',
    });
  }
}

export async function generateFromBuiltin(req, res) {
  const totalStart = Date.now();
  const { slug, language = 'en' } = req.body;

  const practical = BUILTIN_PRACTICALS[slug];
  if (!practical) {
    return res.status(404).json({ error: `Built-in practical "${slug}" not found` });
  }

  console.log(`\n========================================`);
  console.log(`[Pipeline] Built-in: ${slug} [lang: ${language}]`);
  console.log(`========================================`);

  try {
    console.log('[Pipeline] Step 1/2: AI Analysis...');
    const metadata = await analyzeExperiment(practical.text);

    console.log('[Pipeline] Step 2/2: AI Code Generation...');
    const generatedHtml = await generateSimulation(metadata, language);

    // Save to history
    const saved = store.saveSimulation({
      title: practical.title[language] || practical.title.en,
      originalFilename: `builtin:${slug}`,
      extractedText: practical.text,
      metadata,
      html: generatedHtml,
      domain: metadata.domain || 'mechanics',
    });

    const totalElapsed = ((Date.now() - totalStart) / 1000).toFixed(1);
    console.log(`[Pipeline] Complete in ${totalElapsed}s`);
    console.log(`========================================\n`);

    res.json({
      id: saved.id,
      title: practical.title[language] || practical.title.en,
      domain: metadata.domain,
      metadata,
      html: generatedHtml,
      created_at: saved.created_at,
    });
  } catch (err) {
    console.error('[Pipeline] Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate simulation.' });
  }
}

export async function getAllSimulationsHandler(req, res) {
  try {
    res.json(store.getAllSimulations());
  } catch (err) {
    console.error('[Store] Error:', err.message);
    res.json([]);
  }
}

export async function getSimulationByIdHandler(req, res) {
  try {
    const sim = store.getSimulationById(req.params.id);
    if (!sim) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    res.json(sim);
  } catch (err) {
    console.error('[Store] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch simulation' });
  }
}
