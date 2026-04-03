import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import SimulationHistory from '../components/SimulationHistory';
import SimulationViewer from '../components/SimulationViewer';

export default function History() {
  const { t } = useLanguage();
  const [simulations, setSimulations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/simulations');
      setSimulations(res.data);
    } catch {
      setError('Failed to load simulation history');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`/api/simulations/${id}`);
      setSelected(res.data);
    } catch {
      setError('Failed to load simulation');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {selected ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors"
          >
            {t('backToHistory')}
          </button>
          <SimulationViewer
            html={selected.html}
            title={selected.title}
            metadata={selected.metadata}
          />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('simHistory')}</h1>
            <p className="text-gray-400">
              {simulations.length} simulation{simulations.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && (
            <SimulationHistory simulations={simulations} onSelect={handleSelect} t={t} />
          )}
        </>
      )}
    </div>
  );
}
