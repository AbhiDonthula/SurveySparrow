import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('surveysparrow_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('surveysparrow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('surveysparrow_theme', 'light');
    }
  }, [isDark]);

  return (
    <div className={`App min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 via-indigo-50/40 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:via-slate-900 dark:to-slate-900 transition-all duration-500 relative overflow-hidden`}>
      {/* Animated background elements - Rich premium colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-400/30 dark:bg-brand-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-royal-400/30 dark:bg-royal-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-300/20 dark:bg-accent-600/15 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-10 text-center relative fade-in">
          <div className="absolute top-0 right-0 slide-in">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-600 via-royal-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform ring-2 ring-brand-400/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-brand-600 via-royal-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
              SurveySparrow
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Calendar
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Your smart calendar for managing events and schedules with style
          </p>
          
          {/* Stats bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="glass px-6 py-3 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">📅</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Smart Events</div>
            </div>
            <div className="glass px-6 py-3 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">🎨</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Beautiful UI</div>
            </div>
            <div className="glass px-6 py-3 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">⚡</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fast & Smooth</div>
            </div>
          </div>
        </header>
        
        <div className="fade-in">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default App;

