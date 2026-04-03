import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import LoadingState from '../components/LoadingState';
import SimulationViewer from '../components/SimulationViewer';

function AtomIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

function ArrowIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const PRACTICALS = [
  {
    slug: 'simple-pendulum',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="24" y1="4" x2="24" y2="4" strokeWidth="4" strokeLinecap="round" />
        <line x1="14" y1="4" x2="34" y2="4" strokeWidth="3" />
        <line x1="24" y1="4" x2="32" y2="32" stroke="#4361ee" strokeWidth="2" />
        <circle cx="32" cy="35" r="5" fill="#4361ee" stroke="#4361ee" />
        <line x1="24" y1="4" x2="24" y2="36" strokeDasharray="3,3" opacity="0.3" />
      </svg>
    ),
    titleKey: { en: 'Simple Pendulum', si: 'සරල පැන්ඩුලමය', ta: 'எளிய ஊசல்' },
    descKey: {
      en: 'Explore how length affects the period of oscillation. Adjust length, angle, and gravity.',
      si: 'දිග දෝලන කාලයට බලපාන ආකාරය ගවේෂණය කරන්න. දිග, කෝණය සහ ගුරුත්වාකර්ෂණය සකසන්න.',
      ta: 'நீளம் அலைவு காலத்தை எவ்வாறு பாதிக்கிறது என்பதை ஆராயுங்கள்.',
    },
    domain: 'mechanics',
    color: '#4361ee',
  },
  {
    slug: 'projectile-motion',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="40" x2="44" y2="40" stroke="#666" strokeWidth="2" />
        <path d="M 6 38 Q 20 2 42 38" stroke="#06d6a0" strokeWidth="2" fill="none" strokeDasharray="4,2" />
        <circle cx="24" cy="10" r="4" fill="#e63946" stroke="#e63946" />
        <line x1="6" y1="38" x2="12" y2="28" stroke="#4361ee" strokeWidth="2.5" />
      </svg>
    ),
    titleKey: { en: 'Projectile Motion', si: 'ප්‍රක්ෂේපක චලිතය', ta: 'எறிபொருள் இயக்கம்' },
    descKey: {
      en: 'Launch projectiles at different angles and velocities. Observe range, height, and trajectory.',
      si: 'විවිධ කෝණ සහ ප්‍රවේග වලින් ප්‍රක්ෂේපක දියත් කරන්න. පරාසය, උස සහ ගමන් මාර්ගය නිරීක්ෂණය කරන්න.',
      ta: 'பல்வேறு கோணங்கள் மற்றும் வேகங்களில் எறிபொருட்களை ஏவுங்கள்.',
    },
    domain: 'mechanics',
    color: '#e63946',
  },
];

export default function Home() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('analyzing');
  const [result, setResult] = useState(null);
  const [loadingSlug, setLoadingSlug] = useState(null);

  const handleLaunch = async (slug) => {
    setLoading(true);
    setLoadingSlug(slug);
    setResult(null);
    setStage('analyzing');

    const timer = setTimeout(() => setStage('generating'), 8000);

    try {
      const response = await axios.post('/api/simulations/generate-builtin', {
        slug,
        language: lang,
      }, { timeout: 300000 });

      setResult(response.data);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.error || 'Failed to generate. Please try again.');
    } finally {
      clearTimeout(timer);
      setLoadingSlug(null);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  // Show result
  if (result && !loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{result.title}</h1>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-colors"
          >
            {t('home')}
          </button>
        </div>
        <SimulationViewer html={result.html} title={result.title} metadata={result.metadata} />
      </div>
    );
  }

  // Show loading
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <LoadingState stage={stage} t={t} />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-cyan/5" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-6">
            <AtomIcon className="w-4 h-4" />
            {t('poweredBy')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t('heroTitle')}{' '}
            <span className="bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
              {t('heroHighlight')}
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('heroDesc')}
          </p>
        </div>
      </section>

      {/* Built-in Practicals */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-2">{t('tryPracticals')}</h2>
        <p className="text-gray-500 mb-8">{t('tryPracticalsDesc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRACTICALS.map((p) => (
            <button
              key={p.slug}
              onClick={() => handleLaunch(p.slug)}
              disabled={loading}
              className="text-left bg-dark-800 rounded-2xl p-6 border border-white/5 hover:border-primary/40 hover:bg-dark-700 transition-all duration-200 group disabled:opacity-50"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: p.color + '15' }}>
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {p.titleKey[lang] || p.titleKey.en}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {p.descKey[lang] || p.descKey.en}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                      style={{ backgroundColor: p.color + '20', color: p.color }}>
                      {t(p.domain)}
                    </span>
                    <span className="text-xs text-primary font-medium group-hover:underline flex items-center gap-1">
                      {t('launchSim')}
                      <ArrowIcon className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Upload your own */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-2">{t('orUploadOwn')}</h2>
        <p className="text-gray-500 mb-6">{t('orUploadOwnDesc')}</p>
        <Link
          to="/simulate"
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 12 15 15" />
          </svg>
          {t('startSimulating')}
          <ArrowIcon className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
