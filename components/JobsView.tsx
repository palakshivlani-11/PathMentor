
import React from 'react';
import { AnalysisReport } from '../types';

interface JobsViewProps {
  report: AnalysisReport;
  onTriggerInterview: () => void;
}

const JobsView: React.FC<JobsViewProps> = ({ report, onTriggerInterview }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="border-b border-slate-900 pb-10">
        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Neural <span className="text-indigo-500">Matches</span></h1>
        <p className="text-slate-400 font-medium text-lg">High-compatibility real-world opportunities identified through deep asset cross-referencing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {report.jobMatches?.map((job, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-12 hover:border-indigo-500/40 transition-all group relative overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 rounded-full group-hover:bg-indigo-500/10 transition-colors blur-3xl"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12 relative">
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight leading-[0.9]">{job.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-indigo-500 font-black text-[11px] uppercase tracking-[0.4em]">{job.company}</span>
                  <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                  <span className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">Verified Match</span>
                </div>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-[2rem] border border-slate-800 text-center min-w-[110px] shadow-2xl group-hover:scale-105 transition-transform">
                <span className="text-[10px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Score</span>
                <span className="text-4xl font-black text-indigo-500">{job.matchScore}%</span>
              </div>
            </div>

            <div className="space-y-10 relative">
              <div className="space-y-5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                  <i className="fas fa-dna text-indigo-500/50"></i> Alignment Matrix
                </h4>
                <p className="text-[15px] text-slate-300 leading-relaxed font-medium line-clamp-3">{job.description}</p>
              </div>

              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800/50 shadow-inner group-hover:border-indigo-500/20 transition-all">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Neural Logic</h4>
                <p className="text-[14px] text-slate-400 italic leading-relaxed">{job.reason}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <button 
                  onClick={onTriggerInterview}
                  className="flex-grow py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-4"
                >
                  <i className="fas fa-headset text-sm"></i> Launch Prep
                </button>
                {job.url ? (
                  <a 
                    href={job.url}
                    target="_blank"
                    className="px-10 py-5 bg-white text-slate-950 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-200 flex items-center justify-center gap-3 shadow-2xl shadow-white/5"
                  >
                    View Job <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                ) : (
                  <button className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                    Archive Job
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {(!report.jobMatches || report.jobMatches.length === 0) && (
          <div className="col-span-full py-20 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem] text-slate-600 italic font-black uppercase tracking-widest text-xs">
            Scanning job boards for matches...
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsView;
