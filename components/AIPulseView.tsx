
import React from 'react';
import { AnalysisReport } from '../types';

interface AIPulseViewProps {
  report: AnalysisReport;
}

const AIPulseView: React.FC<AIPulseViewProps> = ({ report }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="border-b border-slate-900 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-500/20 mb-4 inline-block">
            Neural Feed Active
          </span>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">
            AI <span className="text-amber-500">Pulse</span>
          </h1>
          <p className="text-slate-500 font-medium">Curated intelligence mapped to your unique tech stack.</p>
        </div>
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <i className="fas fa-clock text-amber-500"></i> Last Refreshed: Just Now
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {report.aiInsights?.map((insight, i) => (
          <div key={i} className="group relative bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-10 hover:bg-slate-900/50 transition-all hover:border-amber-500/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
            
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors leading-none">{insight.tool}</h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Recommendation</span>
              </div>
              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-xl">
                <i className="fas fa-bolt-lightning"></i>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
                <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">Why it matters for you</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">{insight.relevance}</p>
              </div>
              
              <div className="space-y-2">
                 <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Targeted Use Case</h4>
                 <p className="text-xs text-slate-400 italic">"{insight.useCase}"</p>
              </div>

              {insight.link && (
                <a 
                  href={insight.link} 
                  target="_blank" 
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-amber-400 hover:text-amber-300 transition-colors pt-4"
                >
                  Explore Implementation <i className="fas fa-arrow-right text-[8px]"></i>
                </a>
              )}
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
          <div className="relative space-y-6">
            <i className="fas fa-newspaper text-indigo-400 text-4xl mb-2"></i>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Global Research</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">Access the latest papers impacting Big Tech engineering standards.</p>
            <button className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-xl">
              Open Research Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPulseView;
