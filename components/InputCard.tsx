
import React, { useState } from 'react';
import { ProfileData } from '../types';

interface InputCardProps {
  onAnalyze: (data: ProfileData) => void;
  isLoading: boolean;
}

const InputCard: React.FC<InputCardProps> = ({ onAnalyze, isLoading }) => {
  const [github, setGithub] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [codechef, setCodechef] = useState('');
  const [college, setCollege] = useState('');
  const [resumeContent, setResumeContent] = useState<string | { data: string; mimeType: string }>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    const isTextFile = file.type === 'text/plain' || file.name.endsWith('.md');

    if (isTextFile) {
      reader.onload = (event) => setResumeContent(event.target?.result as string);
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setResumeContent({ data: result.split(',')[1], mimeType: file.type || 'application/octet-stream' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeContent) {
      alert("Please upload or paste your resume.");
      return;
    }
    
    onAnalyze({
      githubUsername: github || undefined,
      leetcodeUsername: leetcode || undefined,
      codeforcesUsername: codeforces || undefined,
      codechefUsername: codechef || undefined,
      collegeName: college || undefined,
      resume: resumeContent
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <i className="fas fa-microchip text-8xl text-indigo-500"></i>
      </div>
      
      <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20 shadow-inner">
          <i className="fas fa-user-gear text-indigo-500 text-xl"></i>
        </div>
        Profile Integration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Optional Profiles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Step 1: Coding Profiles (Optional)</h3>
            <span className="text-[9px] text-slate-600 font-bold italic">Leave blank if not applicable</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <i className="fab fa-github text-slate-400"></i> GitHub
              </label>
              <input
                type="text"
                placeholder="Username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-code text-slate-400"></i> LeetCode
              </label>
              <input
                type="text"
                placeholder="Username"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full py-2.5 bg-slate-800/30 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-800 hover:text-slate-200 transition-all"
          >
            {showAdvanced ? 'Collapse Platforms' : 'Add Codeforces / CodeChef / College'}
            <i className={`fas fa-chevron-${showAdvanced ? 'up' : 'down'} text-[10px]`}></i>
          </button>

          {showAdvanced && (
            <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Codeforces Handle"
                  value={codeforces}
                  onChange={(e) => setCodeforces(e.target.value)}
                  className="w-full bg-slate-800/20 border border-slate-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono text-sm"
                />
                <input
                  type="text"
                  placeholder="CodeChef Handle"
                  value={codechef}
                  onChange={(e) => setCodechef(e.target.value)}
                  className="w-full bg-slate-800/20 border border-slate-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-mono text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="University or Current Organization"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-800/20 border border-slate-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          )}
        </div>

        {/* Step 2: Mandatory Resume */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Step 2: Base Resume (Required)</h3>
          <div className="relative group">
            <textarea
              rows={5}
              placeholder="Paste your resume content or upload a file..."
              value={typeof resumeContent === 'string' ? resumeContent : `[Selected File: ${fileName}]`}
              onChange={(e) => { setResumeContent(e.target.value); setFileName(null); }}
              readOnly={typeof resumeContent !== 'string'}
              className={`w-full bg-slate-800/40 border border-slate-700 rounded-2xl px-5 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none ${typeof resumeContent !== 'string' ? 'text-indigo-400 font-bold' : ''}`}
              required
            ></textarea>
            <input type="file" accept=".pdf,.doc,.docx,.txt" id="res-up" onChange={handleFileUpload} className="hidden" />
            <label htmlFor="res-up" className="absolute bottom-5 right-5 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95">
              <i className="fas fa-cloud-upload-alt mr-2"></i> {fileName ? 'Change File' : 'Upload File'}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4 ${
            isLoading ? 'bg-slate-800 cursor-not-allowed text-slate-500' : 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700'
          }`}
        >
          {isLoading ? <><i className="fas fa-circle-notch animate-spin"></i> Processing Assets</> : <><i className="fas fa-bolt-lightning"></i> Initialize Deep Scan</>}
        </button>
      </form>
    </div>
  );
};

export default InputCard;
