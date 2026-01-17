
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import InputCard from './components/InputCard';
import ReportView from './components/ReportView';
import CareerPathView from './components/CareerPathView';
import JobsView from './components/JobsView';
import ApplicationView from './components/ApplicationView';
import AIPulseView from './components/AIPulseView';
import InterviewView from './components/InterviewView';
import NetworkView from './components/NetworkView';
import { AppState, ProfileData, AnalysisReport, ViewTab } from './types';
import { 
  analyzeCoreProfile, 
  analyzeGrowth, 
  analyzeInterview, 
  fetchMentors, 
  fetchAIPulse, 
  generateStudioMaterials 
} from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loadingTabs, setLoadingTabs] = useState<Set<ViewTab>>(new Set());

  const loadTabData = useCallback(async (tab: ViewTab, currentData: ProfileData, currentReport: AnalysisReport) => {
    if (tab === 'growth' && currentReport.careerRoadmap && currentReport.skillPlaylist) return;
    if (tab === 'interview' && currentReport.interviewPrep) return;
    if (tab === 'network' && currentReport.mentors) return;
    if (tab === 'pulse' && currentReport.aiInsights) return;
    if (tab === 'studio' && currentReport.applicationTailoring) return;
    if (tab === 'studio' && !currentData.targetJob) return;

    setLoadingTabs(prev => new Set(prev).add(tab));

    try {
      let dataToMerge: Partial<AnalysisReport> = {};
      
      if (tab === 'growth') {
        const { roadmap, playlist } = await analyzeGrowth(currentData);
        dataToMerge = { careerRoadmap: roadmap, skillPlaylist: playlist };
      } else if (tab === 'interview') {
        const interviewPrep = await analyzeInterview(currentData);
        dataToMerge = { interviewPrep };
      } else if (tab === 'network') {
        const mentors = await fetchMentors(currentData);
        dataToMerge = { mentors };
      } else if (tab === 'pulse') {
        const aiInsights = await fetchAIPulse(currentData);
        dataToMerge = { aiInsights };
      } else if (tab === 'studio' && currentData.targetJob) {
        const applicationTailoring = await generateStudioMaterials(currentData);
        dataToMerge = { applicationTailoring };
      }

      setReport(prev => prev ? { ...prev, ...dataToMerge } : null);
    } catch (err) {
      console.error(`Error background loading data for ${tab}:`, err);
    } finally {
      setLoadingTabs(prev => {
        const next = new Set(prev);
        next.delete(tab);
        return next;
      });
    }
  }, []);

  const handleAnalysis = async (data: ProfileData) => {
    setState(AppState.ANALYZING);
    setError(null);
    setProfileData(data);
    setActiveTab('dashboard');
    
    try {
      const coreResult = await analyzeCoreProfile(data);
      setReport(coreResult);
      setState(AppState.RESULT);

      const secondaryTabs: ViewTab[] = ['network', 'growth', 'interview', 'pulse', 'studio'];
      secondaryTabs.forEach(tab => {
        loadTabData(tab, data, coreResult);
      });
      
    } catch (err: any) {
      setError(err.message || 'The analysis engine encountered an unexpected error.');
      setState(AppState.ERROR);
    }
  };

  const handleUpdateStudioMaterials = (materials: AnalysisReport['applicationTailoring']) => {
    if (report) {
      setReport({ ...report, applicationTailoring: materials });
    }
  };

  const reset = () => {
    setState(AppState.IDLE);
    setReport(null);
    setError(null);
    setProfileData(null);
    setActiveTab('dashboard');
    setLoadingTabs(new Set());
  };

  const isDataMissing = (tab: ViewTab) => {
    if (!report) return true;
    switch (tab) {
      case 'growth': return !report.careerRoadmap || !report.skillPlaylist;
      case 'interview': return !report.interviewPrep;
      case 'network': return !report.mentors;
      case 'pulse': return !report.aiInsights;
      case 'studio': return false; // Studio now has its own internal empty state/form
      default: return false;
    }
  };

  const renderContent = () => {
    if (state === AppState.RESULT && report && profileData) {
      const isLoading = loadingTabs.has(activeTab) || (activeTab !== 'dashboard' && isDataMissing(activeTab));

      if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center py-48 space-y-8 animate-in fade-in duration-500">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fas fa-microchip text-indigo-400 text-xs animate-pulse"></i>
               </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-white font-black text-xs uppercase tracking-[0.4em]">Finishing {activeTab} Synthesis</p>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Parallel Processing Engaged...</p>
            </div>
          </div>
        );
      }

      switch (activeTab) {
        case 'growth':
          return <CareerPathView report={report} />;
        case 'jobs':
          return <JobsView report={report} onTriggerInterview={() => setActiveTab('interview')} />;
        case 'interview':
          return <InterviewView report={report} />;
        case 'network':
          return <NetworkView report={report} />;
        case 'studio':
          return <ApplicationView 
            report={report} 
            profileData={profileData} 
            onUpdateReport={handleUpdateStudioMaterials}
          />;
        case 'pulse':
          return <AIPulseView report={report} />;
        default:
          return <ReportView report={report} onReset={reset} onNavigate={setActiveTab} />;
      }
    }

    if (state === AppState.IDLE) {
      return (
        <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-1000">
          <div className="text-center mb-20 space-y-8">
            <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Neural Benchmarking v3.6 ACTIVE
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-white">
              Optimize Your <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Career Path.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed mt-10">
              Aggregated profile synthesis. FAANG-level gap analysis, LinkedIn networking, and targeted Application Studio.
            </p>
          </div>
          
          <InputCard onAnalyze={handleAnalysis} isLoading={false} />
          
          <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center border-t border-slate-900/80 pt-20">
            {[
              { icon: 'fa-microchip', label: 'Parallel Sync', color: 'text-indigo-400', desc: 'All modules start synthesizing immediately on scan.' },
              { icon: 'fa-wand-magic-sparkles', label: 'App Studio', color: 'text-cyan-400', desc: 'Job-specific resume reviews and cover letters.' },
              { icon: 'fa-people-arrows', label: 'Dual-Platform', color: 'text-emerald-400', desc: 'Verified Topmate and LinkedIn mentor discovery.' },
              { icon: 'fa-bolt-lightning', label: 'Zero Latency', color: 'text-amber-400', desc: 'Pre-fetched assets ready as soon as you click.' },
            ].map((feature, i) => (
              <div key={i} className="group space-y-5 px-4">
                <div className={`w-14 h-14 bg-slate-900 border border-slate-800 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-indigo-500/50 transition-all duration-500 shadow-xl group-hover:-translate-y-2`}>
                  <i className={`fas ${feature.icon} text-xl`}></i>
                </div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest">{feature.label}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (state === AppState.ANALYZING) {
      return (
        <div className="flex flex-col items-center justify-center py-60 space-y-20 max-w-xl mx-auto text-center animate-in zoom-in-95 duration-500">
          <div className="relative">
            <div className="w-48 h-48 border-[6px] border-slate-900 rounded-full absolute inset-0"></div>
            <div className="w-48 h-48 border-t-[6px] border-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-satellite-dish text-5xl text-indigo-400 animate-pulse"></i>
            </div>
          </div>
          <div className="space-y-8 w-full">
            <h2 className="text-4xl font-black text-white tracking-tighter">Initializing Neural Link</h2>
            <p className="text-slate-500 text-sm font-medium">Crunching core metrics. Parallel synthesis of LinkedIn profiles and App Studio assets beginning.</p>
          </div>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.6em]">Distributed Synthesis Engaged • Gemini Flash</p>
        </div>
      );
    }

    if (state === AppState.ERROR) {
      return (
        <div className="max-lg mx-auto py-40 text-center animate-in shake duration-500">
          <div className="w-24 h-24 bg-red-500/5 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-red-500/20">
            <i className="fas fa-triangle-exclamation text-4xl"></i>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">System Error</h2>
          <p className="text-slate-400 mb-12 text-lg leading-relaxed">{error}</p>
          <button onClick={reset} className="px-10 py-4 bg-white text-[#020617] rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-4 mx-auto">
            <i className="fas fa-undo"></i> Retry Scan
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      showNav={state === AppState.RESULT}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
