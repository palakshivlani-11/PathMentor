
import React, { useState } from 'react';
import { AnalysisReport } from '../types';

interface InterviewViewProps {
  report: AnalysisReport;
}

const InterviewView: React.FC<InterviewViewProps> = ({ report }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="border-b border-slate-900 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20 mb-4 inline-block">
            Combat Readiness
          </span>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">
            Interview <span className="text-indigo-500">Forge</span>
          </h1>
          <p className="text-slate-500 font-medium">Simulated high-pressure questions curated for your specific profile gaps.</p>
        </div>
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
             <i className="fas fa-brain-circuit text-indigo-500"></i> {report.interviewPrep?.length || 0} Questions Generated
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {report.interviewPrep?.map((item, i) => (
          <div 
            key={i} 
            className={`bg-slate-900/40 border transition-all duration-500 rounded-[2rem] overflow-hidden ${openIndex === i ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/10' : 'border-slate-800 hover:border-slate-700'}`}
          >
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left p-8 flex items-start gap-6 group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${openIndex === i ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}`}>
                {i + 1}
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    item.category === 'Technical' ? 'bg-blue-500/10 text-blue-400' :
                    item.category === 'System Design' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.difficulty}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                  {item.question}
                </h3>
              </div>
              <div className={`mt-4 transition-transform duration-500 ${openIndex === i ? 'rotate-180 text-indigo-400' : 'text-slate-600'}`}>
                <i className="fas fa-chevron-down"></i>
              </div>
            </button>

            {openIndex === i && (
              <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-500">
                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    <i className="fas fa-lightbulb"></i> Response Strategy
                  </div>
                  <div className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800 text-slate-300 text-sm leading-relaxed font-medium">
                    {item.answerHint}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewView;
