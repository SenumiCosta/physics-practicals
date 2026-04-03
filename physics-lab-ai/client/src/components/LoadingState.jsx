function FileIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ScanIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function BoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

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

export default function LoadingState({ stage, t }) {
  const stages = [
    { key: 'extracting', label: t ? t('extracting') : 'Extracting text...', Icon: FileIcon },
    { key: 'analyzing', label: t ? t('analyzing') : 'Analyzing your practical...', Icon: ScanIcon },
    { key: 'generating', label: t ? t('generating') : 'Generating simulation...', Icon: BoltIcon },
  ];

  const currentIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="flex flex-col items-center py-16">
      {/* Animated atom */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-accent-cyan/30 animate-ping [animation-delay:0.5s]" />
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <AtomIcon className="w-12 h-12 text-primary" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 w-full max-w-sm">
        {stages.map((s, i) => {
          const isActive = i === currentIndex;
          const isDone = i < currentIndex;

          return (
            <div
              key={s.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-primary/10 border border-primary/30'
                  : isDone
                    ? 'bg-accent-green/10 border border-accent-green/20'
                    : 'bg-white/5 border border-transparent'
              }`}
            >
              {isDone ? (
                <CheckIcon className="w-5 h-5 text-accent-green" />
              ) : (
                <s.Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
              )}
              <span className={`text-sm font-medium ${
                isActive ? 'text-white' : isDone ? 'text-accent-green' : 'text-gray-500'
              }`}>
                {s.label}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-gray-500 text-sm mt-8">{t ? t('waitMessage') : 'This usually takes 15-30 seconds'}</p>
    </div>
  );
}
