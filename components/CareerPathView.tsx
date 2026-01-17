
import React, { useState, useEffect, useMemo } from 'react';
import { AnalysisReport, SkillQuestion } from '../types';

interface CareerPathViewProps {
  report: AnalysisReport;
}

type SortOption = 'none' | 'difficulty-asc' | 'difficulty-desc' | 'category';

const CareerPathView: React.FC<CareerPathViewProps> = ({ report }) => {
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  useEffect(() => {
    const saved = localStorage.getItem('devprofile_progress');
    if (saved) {
      setCompletedQuestions(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleQuestion = (index: number) => {
    const newSet = new Set(completedQuestions);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setCompletedQuestions(newSet);
    localStorage.setItem('devprofile_progress', JSON.stringify(Array.from(newSet)));
  };

  const difficultyValue = (diff: string) => {
    const d = diff.toLowerCase();
    if (d.includes('easy')) return 1;
    if (d.includes('medium')) return 2;
    if (d.includes('hard')) return 3;
    return 0;
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    report.skillPlaylist?.forEach(q => cats.add(q.category));
    return Array.from(cats);
  }, [report.skillPlaylist]);

  const sortedPlaylist = useMemo(() => {
    let list = [...(report.skillPlaylist || [])].map((q, originalIndex) => ({ ...q, originalIndex }));
    
    if (filterCategory !== 'All') {
      list = list.filter(q => q.category === filterCategory);
    }

    list.sort((a, b) => {
      if (sortBy === 'difficulty-asc') return difficultyValue(a.difficulty) - difficultyValue(b.difficulty);
      if (sortBy === 'difficulty-desc') return difficultyValue(b.difficulty) - difficultyValue(a.difficulty);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

    return list;
  }, [report.skillPlaylist, sortBy, filterCategory]);

  const totalQuestions = report.skillPlaylist?.length || 0;
  const progressPercent = totalQuestions > 0 
    ? Math.round((completedQuestions.size / totalQuestions) * 100) 
    : 0;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="border-b border-slate-900 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20 mb-4 inline-block">
              Skill Acquisition
            </span>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">Growth <span className="text-indigo-500">Hub</span></h1>
            <p className="text-slate-500 font-medium">Your personalized roadmap and targeted challenge playlist.</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 w-full md:w-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery Level</span>
              <span className="text-lg font-black text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="w-full md:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
            <i className="fas fa-map-signs text-indigo-500"></i>
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Strategic Roadmap</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {report.careerRoadmap?.map((step, i) => (
            <div key={i} className="group relative bg-slate-900/30 border border-slate-800 p-8 rounded-[2.5rem] hover:bg-slate-900/50 transition-all hover:border-indigo-500/30">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl shadow-indigo-600/20 transition-transform group-hover:scale-110">
                {i + 1}
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{step.period}</span>
                <h3 className="text-xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors leading-tight">{step.goal}</h3>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Key Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {step.topics?.map((topic, j) => (
                      <span key={j} className="px-3 py-1.5 bg-slate-950 text-slate-400 border border-slate-800 rounded-xl text-[10px] font-bold group-hover:border-indigo-500/20 group-hover:text-slate-200 transition-all">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <i className="fas fa-layer-group text-amber-500"></i>
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Mastery Playlist</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase">Sort:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[10px] font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="none">Default</option>
                <option value="difficulty-asc">Difficulty (Low-High)</option>
                <option value="difficulty-desc">Difficulty (High-Low)</option>
                <option value="category">Category</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase">Filter:</label>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[10px] font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/80 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6 w-24 text-center">Status</th>
                  <th className="px-6 py-6">Focus Area / Concept</th>
                  <th className="px-6 py-6">Domain</th>
                  <th className="px-6 py-6 w-32">Difficulty</th>
                  <th className="px-6 py-6 w-24">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sortedPlaylist.map((item) => (
                  <tr key={item.originalIndex} className={`group transition-all duration-300 ${completedQuestions.has(item.originalIndex) ? 'bg-indigo-600/5' : 'hover:bg-slate-900/40'}`}>
                    <td className="px-10 py-6 text-center">
                      <button 
                        onClick={() => toggleQuestion(item.originalIndex)}
                        className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                          completedQuestions.has(item.originalIndex) 
                            ? 'bg-indigo-600 border-indigo-500 text-white rotate-[360deg]' 
                            : 'border-slate-800 text-transparent hover:border-slate-600'
                        }`}
                      >
                        <i className="fas fa-check text-xs"></i>
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`font-black text-sm tracking-tight transition-all ${completedQuestions.has(item.originalIndex) ? 'text-indigo-300' : 'text-slate-100'}`}>
                        {item.question}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium group-hover:text-slate-400">{item.reason}</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[9px] font-black text-slate-400 border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-900 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${
                        difficultyValue(item.difficulty) === 1 ? 'text-emerald-500' :
                        difficultyValue(item.difficulty) === 2 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      {item.link ? (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                        >
                          <i className="fas fa-external-link-alt text-[10px]"></i>
                        </a>
                      ) : (
                        <span className="text-slate-700">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalQuestions === 0 && (
            <div className="p-20 text-center text-slate-500 italic">No playlist concepts synthesized for this profile yet.</div>
          )}
        </div>
        
        <div className="text-center">
           <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
             Cost Optimized Engine: Targeting High-Impact Challenges only.
           </p>
        </div>
      </section>
    </div>
  );
};

export default CareerPathView;
