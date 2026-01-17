
import React from 'react';
import { AnalysisReport, ViewTab } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ReportViewProps {
  report: AnalysisReport;
  onReset: () => void;
  onNavigate: (tab: ViewTab) => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, onReset, onNavigate }) => {
  const skillData = [
    { subject: 'Algorithms', A: 85 },
    { subject: 'Consistency', A: 70 },
    { subject: 'System Design', A: 65 },
    { subject: 'Open Source', A: 90 },
    { subject: 'Experience', A: 75 },
    { subject: 'Efficiency', A: 80 },
  ];

  const shareOnTwitter = () => {
    const text = `🚀 My tech profile benchmark with DevPulse!
🔥 Best Match: ${report.jobMatches?.[0]?.company || 'N/A'} (${report.jobMatches?.[0]?.matchScore || 0}%)
🧠 Targeting: ${report.suggestedRoles?.[0] || 'N/A'}
Check yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-900 pb-10">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Neural Link Status: Verified</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Intelligence <span className="text-indigo-500">Scan</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">Comprehensive profile synthesis and multi-platform benchmarking.</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex bg-slate-900/50 border border-slate-800 rounded-2xl p-1.5">
            <button onClick={shareOnTwitter} className="p-3 hover:bg-slate-800 text-slate-400 hover:text-white transition-all rounded-xl">
              <i className="fab fa-x-twitter"></i>
            </button>
            <button className="p-3 hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-all rounded-xl">
              <i className="fab fa-linkedin"></i>
            </button>
          </div>
          <button
            onClick={onReset}
            className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95 flex items-center gap-3 border border-slate-700"
          >
            <i className="fas fa-rotate"></i> Re-Scan
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-2xl rotate-3 group-hover:rotate-6 transition-transform">
            <i className="fas fa-brain text-2xl"></i>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest">Core Narrative</h4>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium italic">
              "{report.summary}"
            </p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Skill Stature</span>
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">Global L5</div>
            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Target Tier</span>
        </div>
      </div>

      {/* Grounding Sources (Search Results) */}
      {report.groundingSources && report.groundingSources.length > 0 && (
        <section className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <i className="fas fa-link text-indigo-500"></i> Grounding Sources
          </h3>
          <div className="flex flex-wrap gap-4">
            {report.groundingSources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 transition-all hover:border-indigo-500/30 active:scale-95"
              >
                {source.title} <i className="fas fa-external-link-alt text-[8px]"></i>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Module Quick-Access Hub */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 ml-2">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
          <h3 className="text-lg font-black text-white uppercase tracking-widest">Intelligence Hub</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { id: 'growth', label: 'Growth Hub', icon: 'fa-arrow-trend-up', color: 'text-purple-400', desc: 'Roadmap & Playlist' },
            { id: 'jobs', label: 'Neural Jobs', icon: 'fa-briefcase', color: 'text-blue-400', desc: 'Real-world Matches' },
            { id: 'interview', label: 'Interview Forge', icon: 'fa-comments-question', color: 'text-indigo-400', desc: 'Deep Q&A Prep' },
            { id: 'network', label: 'Mentor Beacon', icon: 'fa-users-gear', color: 'text-emerald-400', desc: 'Topmate Network' },
            { id: 'studio', label: 'Application Studio', icon: 'fa-pen-to-square', color: 'text-cyan-400', desc: 'Resume & Cover Letter' },
            { id: 'pulse', label: 'AI Pulse', icon: 'fa-bolt', color: 'text-amber-400', desc: 'Tool Discovery' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewTab)}
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all text-center group active:scale-95"
            >
              <div className={`w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                <i className={`fas ${item.icon} text-lg`}></i>
              </div>
              <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item.label}</div>
              <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{item.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Benchmarks */}
          <section className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-8 md:p-10 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-500">
                <i className="fas fa-chart-simple"></i>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Big Tech Benchmarks</h3>
            </div>
            <div className="space-y-6">
              {report.bigTechAlignment?.map((benchmark, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50 hover:border-indigo-500/20 transition-all">
                  <div className="md:w-32 flex-shrink-0">
                    <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{benchmark.company}</span>
                  </div>
                  <div className="flex-grow space-y-2">
                    <h4 className="text-sm font-bold text-white">{benchmark.requirement}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <span className="text-amber-500 font-black uppercase text-[10px] mr-2">Gap:</span> {benchmark.gap}
                    </p>
                    <div className="pt-2">
                      <span className="text-[10px] text-emerald-400 font-medium italic">" {benchmark.recommendation} "</span>
                    </div>
                  </div>
                </div>
              ))}
              {(!report.bigTechAlignment || report.bigTechAlignment.length === 0) && (
                <div className="text-center py-10 text-slate-600 italic text-sm uppercase tracking-widest font-black">Synthesizing Benchmarks...</div>
              )}
            </div>
          </section>
        </div>

        {/* Performance Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10 shadow-3xl">
            <h3 className="text-[10px] font-black text-center text-slate-600 uppercase tracking-[0.4em] mb-10">Neural performance Map</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#1e293b" strokeDasharray="4 4" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 9, fontWeight: 900 }} />
                  <Radar name="Metrics" dataKey="A" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-4">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center border-b border-slate-900 pb-3">Recommended Specializations</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {report.suggestedRoles?.map((role, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-indigo-400 text-[9px] font-black uppercase rounded-lg">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('jobs')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 p-8 rounded-[2.5rem] text-center transition-all group active:scale-95 shadow-2xl shadow-emerald-600/10"
          >
             <i className="fas fa-sparkles text-white text-2xl mb-4 group-hover:scale-125 transition-transform"></i>
             <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">View Job Matches</h4>
             <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest">{report.jobMatches?.length || 0} Verified Roles Found</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
