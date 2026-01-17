
import React from 'react';
import { AnalysisReport } from '../types';

interface NetworkViewProps {
  report: AnalysisReport;
}

const NetworkView: React.FC<NetworkViewProps> = ({ report }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="border-b border-slate-900 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20 mb-4 inline-block">
            Verified Network
          </span>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">
            Mentor <span className="text-emerald-500">Beacon</span>
          </h1>
          <p className="text-slate-500 font-medium">Direct access to industry veterans via Topmate and LinkedIn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {report.mentors?.map((mentor, i) => (
          <div key={i} className="group bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10 hover:border-emerald-500/40 transition-all relative overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors leading-none">{mentor.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{mentor.role} @ {mentor.company}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-xl relative z-10">
                <i className="fas fa-user-tie"></i>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
                <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3">Expertise Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise?.map((exp, j) => (
                    <span key={j} className="px-3 py-1.5 bg-slate-900 text-slate-400 border border-slate-800 rounded-xl text-[10px] font-bold">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={mentor.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  <i className="fas fa-calendar-check text-[11px]"></i> Topmate
                </a>
                <a 
                  href={mentor.linkedinLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="py-4 bg-[#0077b5] hover:bg-[#00a0dc] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  <i className="fab fa-linkedin-in text-[11px]"></i> LinkedIn
                </a>
              </div>
              <div className="text-center">
                <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">Profiles verified by Gemini Pro Search</span>
              </div>
            </div>
          </div>
        ))}

        {(!report.mentors || report.mentors.length === 0) && (
          <div className="col-span-full py-20 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
            <i className="fas fa-users-slash text-slate-700 text-4xl mb-4"></i>
            <p className="text-slate-500 font-medium italic uppercase tracking-widest text-xs">No mentor signals detected in this sector.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkView;
