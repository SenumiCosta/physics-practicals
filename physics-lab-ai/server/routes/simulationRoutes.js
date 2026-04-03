import { Router } from 'express';
import upload from '../middleware/upload.js';
import {
  generateFromPDF,
  generateFromBuiltin,
  getAllSimulationsHandler,
  getSimulationByIdHandler,
} from '../controllers/simulationController.js';
import { BUILTIN_PRACTICALS } from '../data/builtinPracticals.js';

const router = Router();

router.post('/generate', upload.array('files', 10), generateFromPDF);
router.post('/generate-builtin', generateFromBuiltin);

router.get('/builtins', (req, res) => {
  const lang = req.query.lang || 'en';
  const list = Object.entries(BUILTIN_PRACTICALS).map(([slug, p]) => ({
    slug,
    title: p.title[lang] || p.title.en,
    description: p.description[lang] || p.description.en,
    domain: p.domain,
  }));
  res.json(list);
});

router.get('/', getAllSimulationsHandler);
router.get('/:id', getSimulationByIdHandler);

export default router;
