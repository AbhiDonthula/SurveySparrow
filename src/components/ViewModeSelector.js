import React from 'react';

const VIEW_MODES = [
  { value: 'month', label: 'Month', icon: '📅' },
  { value: 'week', label: 'Week', icon: '📆' },
  { value: 'day', label: 'Day', icon: '📋' },
];

const ViewModeSelector = ({ currentView, onViewChange }) => {
  return (
    <div className="flex gap-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-1.5 border border-white/20">
      {VIEW_MODES.map(mode => (
        <button
          key={mode.value}
          onClick={() => onViewChange(mode.value)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
            ${currentView === mode.value
              ? 'bg-white text-brand-700 dark:bg-gray-700 dark:text-brand-400 shadow-lg font-semibold scale-105'
              : 'text-white/80 hover:text-white hover:bg-white/10 dark:hover:bg-gray-700/50'
            }
          `}
        >
          <span className="text-lg">{mode.icon}</span>
          <span className="hidden sm:inline text-sm">{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewModeSelector;

