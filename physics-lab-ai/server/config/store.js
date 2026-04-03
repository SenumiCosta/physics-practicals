import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, '..', 'data', 'history.json');

function readStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    }
  } catch {
    // corrupted file, start fresh
  }
  return { nextId: 1, simulations: [] };
}

function writeStore(data) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function saveSimulation({ title, originalFilename, extractedText, metadata, html, domain }) {
  const store = readStore();
  const id = store.nextId++;
  const record = {
    id,
    title,
    original_filename: originalFilename,
    extracted_text: extractedText,
    ai_extracted_metadata: metadata,
    generated_html: html,
    physics_domain: domain,
    created_at: new Date().toISOString(),
  };
  store.simulations.unshift(record); // newest first
  writeStore(store);
  console.log(`[Store] Saved simulation ID: ${id}`);
  return record;
}

export function getAllSimulations() {
  const store = readStore();
  return store.simulations.map(({ id, title, physics_domain, original_filename, created_at }) => ({
    id,
    title,
    physics_domain,
    original_filename,
    created_at,
  }));
}

export function getSimulationById(id) {
  const store = readStore();
  const sim = store.simulations.find((s) => s.id === Number(id));
  if (!sim) return null;
  return {
    id: sim.id,
    title: sim.title,
    domain: sim.physics_domain,
    metadata: sim.ai_extracted_metadata,
    html: sim.generated_html,
    original_filename: sim.original_filename,
    created_at: sim.created_at,
  };
}
