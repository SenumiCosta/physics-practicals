const domainColors = {
  mechanics: 'bg-blue-500/20 text-blue-400',
  optics: 'bg-purple-500/20 text-purple-400',
  thermodynamics: 'bg-red-500/20 text-red-400',
  electricity: 'bg-yellow-500/20 text-yellow-400',
  waves: 'bg-green-500/20 text-green-400',
  fluid: 'bg-cyan-500/20 text-cyan-400',
};

function GearIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function LensIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ThermIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
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

function WaveIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    </svg>
  );
}

function DropIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function FlaskIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M10 3v7.4a2 2 0 0 1-.5 1.3L4 19a2 2 0 0 0 1.6 3.2h12.8A2 2 0 0 0 20 19l-5.5-7.3a2 2 0 0 1-.5-1.3V3" />
    </svg>
  );
}

const domainIconComponents = {
  mechanics: GearIcon,
  optics: LensIcon,
  thermodynamics: ThermIcon,
  electricity: BoltIcon,
  waves: WaveIcon,
  fluid: DropIcon,
};

export default function SimulationHistory({ simulations, onSelect }) {
  if (simulations.length === 0) {
    return (
      <div className="text-center py-20">
        <FlaskIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No simulations yet</p>
        <p className="text-gray-600 text-sm mt-1">Upload a PDF to create your first simulation</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {simulations.map((sim) => {
        const domain = sim.physics_domain || 'mechanics';
        const colorClass = domainColors[domain] || domainColors.mechanics;
        const IconComponent = domainIconComponents[domain] || GearIcon;
        const date = new Date(sim.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <button
            key={sim.id}
            onClick={() => onSelect(sim.id)}
            className="text-left bg-dark-800 rounded-2xl p-5 border border-white/5 hover:border-primary/30 hover:bg-dark-700 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <IconComponent className="w-6 h-6 text-gray-400" />
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {domain}
              </span>
            </div>
            <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
              {sim.title || 'Untitled Experiment'}
            </h3>
            <p className="text-xs text-gray-500 mt-2">{date}</p>
            <p className="text-xs text-gray-600 mt-1 truncate">{sim.original_filename}</p>
          </button>
        );
      })}
    </div>
  );
}
