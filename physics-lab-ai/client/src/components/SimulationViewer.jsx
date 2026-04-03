import { useMemo } from 'react';
import { useLanguage } from '../LanguageContext';

export default function SimulationViewer({ html, title, metadata }) {
  const { t } = useLanguage();

  // Use a blob URL instead of srcDoc to avoid sandbox restrictions on input events
  const blobUrl = useMemo(() => {
    if (!html) return null;
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    return URL.createObjectURL(blob);
  }, [html]);

  return (
    <div className="space-y-4">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {metadata?.domain && (
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
                {metadata.domain}
              </span>
            )}
          </div>
          {metadata?.governing_equations && (
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500 mb-1">{t('govEquations')}</p>
              {metadata.governing_equations.slice(0, 2).map((eq, i) => (
                <p key={i} className="text-sm text-gray-300 font-mono">{eq}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Simulation iframe */}
      <div className="rounded-2xl overflow-hidden border-2 border-primary/30 bg-dark-700 shadow-lg shadow-primary/5">
        {blobUrl && (
          <iframe
            src={blobUrl}
            title={title || 'Physics Simulation'}
            className="w-full border-0"
            style={{ height: '80vh', minHeight: '600px' }}
          />
        )}
      </div>

      {/* Metadata details */}
      {metadata && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metadata.parameters && (
            <div className="bg-dark-800 rounded-xl p-4 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">{t('parameters')}</h3>
              <div className="space-y-2">
                {metadata.parameters.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {p.name} <span className="text-gray-500">({p.symbol})</span>
                    </span>
                    <span className="text-gray-400 font-mono">
                      {p.min} - {p.max} {p.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {metadata.observables && (
            <div className="bg-dark-800 rounded-xl p-4 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">{t('observables')}</h3>
              <div className="space-y-2">
                {metadata.observables.map((obs, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                    {typeof obs === 'string' ? obs : obs.name}
                    {obs.unit && <span className="text-gray-500">({obs.unit})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
