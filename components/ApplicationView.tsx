
import React, { useState } from 'react';
import { AnalysisReport, ProfileData } from '../types';
import { generateStudioMaterials } from '../services/geminiService';

interface ApplicationViewProps {
  report: AnalysisReport;
  profileData: ProfileData;
  onUpdateReport: (newMaterials: AnalysisReport['applicationTailoring']) => void;
}

const ApplicationView: React.FC<ApplicationViewProps> = ({ report, profileData, onUpdateReport }) => {
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Local form state for refining the JD
  const [company, setCompany] = useState(profileData.targetJob?.company || '');
  const [role, setRole] = useState(profileData.targetJob?.role || '');
  const [description, setDescription] = useState(profileData.targetJob?.description || '');

  const handleRunAnalysis = async () => {
    if (!company || !role || !description) {
      alert("Please provide Company, Role, and Job Description.");
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const updatedData: ProfileData = {
        ...profileData,
        targetJob: { company, role, description }
      };
      const materials = await generateStudioMaterials(updatedData);
      onUpdateReport(materials);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (report.applicationTailoring?.coverLetter) {
      navigator.clipboard.writeText(report.applicationTailoring.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (report.applicationTailoring?.coverLetter) {
      const element = document.createElement("a");
      const file = new Blob([report.applicationTailoring.coverLetter], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${company}_Cover_Letter.doc`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header */}
      <div className="border-b border-slate-900 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-cyan-500/20 inline-block">
            FAANG Optimizer Engine
          </span>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Application <span className="text-cyan-500">Studio</span></h1>
          <p className="text-slate-500 font-medium">Neuro-Powered Resume Review & Cover Letter Generator for specific target roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Pane: Job Input Console */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-10 flex items-center gap-4">
              <i className="fas fa-terminal text-cyan-500"></i> Optimization Console
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Company</label>
                <input 
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Meta"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Target Role</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Job Description</label>
                <textarea 
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste the target JD here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
                />
              </div>
              
              <button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-600/10 active:scale-95 flex items-center justify-center gap-3"
              >
                {isAnalyzing ? (
                  <>
                    <i className="fas fa-circle-notch animate-spin"></i> Synthesizing Assets...
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt-lightning"></i> Start Job Optimization
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: AI Analysis Outputs */}
        <div className="xl:col-span-8 space-y-12">
          {!report.applicationTailoring && !isAnalyzing ? (
            <div className="h-full bg-slate-900/20 border border-dashed border-slate-800 rounded-[4rem] flex flex-col items-center justify-center p-20 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 text-slate-700">
                <i className="fas fa-wand-magic-sparkles text-3xl"></i>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-white tracking-tight">Awaiting JD Input</h4>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">Provide job details in the console to unlock personalized resume reviews and cover letters.</p>
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="h-full bg-slate-900/40 border border-slate-800 rounded-[4rem] flex flex-col items-center justify-center p-20 space-y-8">
               <div className="w-16 h-16 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
               <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Running Recursive Recruiter Analysis</p>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-700">
              {/* Resume Suggestions */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                    <i className="fas fa-file-pen"></i>
                  </div>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Resume Optimization Review</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.applicationTailoring?.resumeSuggestions.map((suggestion, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] group hover:border-indigo-500/30 transition-all relative overflow-hidden backdrop-blur-sm">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500/5 group-hover:bg-indigo-500 transition-colors"></div>
                      <div className="text-[10px] font-black text-slate-600 mb-4 uppercase tracking-widest">Recruiter Note {i+1}</div>
                      <p className="text-[14px] text-slate-300 leading-relaxed font-medium group-hover:text-slate-100 transition-colors">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cover Letter */}
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                      <i className="fas fa-scroll"></i>
                    </div>
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Neural-Forged Cover Letter</h2>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleCopy}
                      className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="px-5 py-3 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Export
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-inner relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500/20"></div>
                   <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-loose font-medium selection:bg-cyan-500/30">
                     {report.applicationTailoring?.coverLetter}
                   </pre>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationView;
