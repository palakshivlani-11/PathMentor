
export interface ProfileData {
  githubUsername?: string;
  leetcodeUsername?: string;
  codeforcesUsername?: string;
  codechefUsername?: string;
  collegeName?: string;
  resume: string | { data: string; mimeType: string };
  targetJob?: {
    company: string;
    role: string;
    description: string;
  };
}

export interface CompetitiveStats {
  platform: string;
  rating: string;
  rank: string;
  percentile: string;
}

export interface BigTechBenchmark {
  company: string;
  requirement: string;
  gap: string;
  recommendation: string;
}

export interface AIInsight {
  tool: string;
  relevance: string;
  useCase: string;
  link?: string;
}

export interface CareerRoadmapStep {
  period: string;
  goal: string;
  topics: string[];
}

export interface SkillQuestion {
  category: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link?: string;
  reason: string;
}

export interface InterviewQuestion {
  question: string;
  category: 'Technical' | 'Behavioral' | 'System Design';
  answerHint: string;
  difficulty: string;
}

export interface TopmateMentor {
  name: string;
  role: string;
  company: string;
  link: string;
  linkedinLink?: string;
  expertise: string[];
}

export interface AnalysisReport {
  summary: string;
  strengths: string[];
  improvements: string[];
  bigTechAlignment: BigTechBenchmark[];
  skills: {
    technical: string[];
    soft: string[];
  };
  suggestedRoles: string[];
  competitiveProgramming: CompetitiveStats[];
  jobMatches: Array<{
    title: string;
    company: string;
    description: string;
    matchScore: number;
    reason: string;
    url?: string;
  }>;
  groundingSources: Array<{
    title: string;
    uri: string;
  }>;
  // Dynamic Tab Data
  careerRoadmap?: CareerRoadmapStep[];
  skillPlaylist?: SkillQuestion[];
  aiInsights?: AIInsight[];
  interviewPrep?: InterviewQuestion[];
  mentors?: TopmateMentor[];
  applicationTailoring?: {
    coverLetter: string;
    resumeSuggestions: string[];
  };
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export type ViewTab = 'dashboard' | 'growth' | 'jobs' | 'interview' | 'network' | 'studio' | 'pulse';
