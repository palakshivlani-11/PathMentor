
import React from 'react';
import { ViewTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: ViewTab;
  onTabChange?: (tab: ViewTab) => void;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, showNav = true }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <nav className="border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group flex-shrink-0" 
            onClick={() => onTabChange?.('dashboard')}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all shadow-lg shadow-indigo-500/20 border border-indigo-400/20">
              <i className="fas fa-microchip text-white text-sm md:text-lg"></i>
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-white">
              Dev<span className="text-indigo-500">Pulse</span>
            </span>
          </div>
          
          {showNav && onTabChange && (
            <div className="flex-grow overflow-x-auto no-scrollbar py-2">
              <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-800/50 p-1 rounded-xl w-max mx-auto lg:mx-0">
                {[
                  { id: 'dashboard', label: 'Report', icon: 'fa-chart-pie' },
                  { id: 'growth', label: 'Growth', icon: 'fa-arrow-trend-up' },
                  { id: 'jobs', label: 'Jobs', icon: 'fa-briefcase' },
                  { id: 'interview', label: 'Prep', icon: 'fa-comments-question' },
                  { id: 'network', label: 'Mentors', icon: 'fa-users-gear' },
                  { id: 'studio', label: 'Studio', icon: 'fa-pen-to-square' },
                  { id: 'pulse', label: 'Pulse', icon: 'fa-bolt' },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => onTabChange(tab.id as ViewTab)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <i className={`fas ${tab.icon}`}></i>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
             <button className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl shadow-black/20">
              v3.6
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {children}
      </main>
      <footer className="border-t border-slate-900/50 py-12 bg-[#0f172a]/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">DevPulse Intelligence Labs</span>
            <span className="text-[9px] text-slate-700 font-medium">Neuro-Powered Career Analysis Engine v3.6</span>
          </div>
          <div className="flex gap-6 md:gap-10">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-400">Privacy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-400">Security</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-400">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
