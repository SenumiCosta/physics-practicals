import { useState, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import UploadZone from '../components/UploadZone';
import LoadingState from '../components/LoadingState';
import SimulationViewer from '../components/SimulationViewer';

export default function Simulate() {
  const { t, lang } = useLanguage();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('extracting');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const topRef = useRef(null);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setStage('extracting');

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    formData.append('language', lang);

    const stageTimer1 = setTimeout(() => setStage('analyzing'), 3000);
    const stageTimer2 = setTimeout(() => setStage('generating'), 12000);

    try {
      const response = await axios.post('/api/simulations/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      });

      setResult(response.data);
      setLoading(false);
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Failed to generate simulation.';
      setError(message);
      setLoading(false);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  if (result && !loading) {
    return (
      <div ref={topRef} className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">
            {result.title || 'Simulation'}
          </h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-colors"
          >
            {t('newSimulation')}
          </button>
        </div>
        <SimulationViewer
          html={result.html}
          title={result.title}
          metadata={result.metadata}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <LoadingState stage={stage} t={t} />
      </div>
    );
  }

  return (
    <div ref={topRef} className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('generateTitle')}</h1>
        <p className="text-gray-400">{t('generateSubtitle')}</p>
      </div>

      <UploadZone onFilesSelect={handleFilesSelect} disabled={loading} />

      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-red-400 font-medium">{t('genFailed')}</p>
              <p className="text-red-400/80 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      )}

      {files.length > 0 && !error && (
        <button
          onClick={handleGenerate}
          className="w-full mt-6 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-lg"
        >
          {t('generateBtn')} ({files.length})
        </button>
      )}
    </div>
  );
}
