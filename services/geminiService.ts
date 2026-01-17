
import { GoogleGenAI, Type } from "@google/genai";
import { ProfileData, AnalysisReport, CareerRoadmapStep, SkillQuestion, InterviewQuestion, TopmateMentor, AIInsight } from "../types";

const safeParseJSON = (text: string | undefined): any => {
  if (!text) return null;
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error. Snippet:", cleaned.substring(0, 100));
    return null;
  }
};

const getContext = (data: ProfileData) => {
  let ctx = "";
  if (data.githubUsername) ctx += `- GitHub: ${data.githubUsername}\n`;
  if (data.leetcodeUsername) ctx += `- LeetCode: ${data.leetcodeUsername}\n`;
  if (data.collegeName) ctx += `- College: ${data.collegeName}\n`;
  if (data.targetJob) {
    ctx += `\nJob: ${data.targetJob.role} @ ${data.targetJob.company}\nJD Snippet: ${data.targetJob.description.substring(0, 300)}...\n`;
  }
  return ctx;
};

const getResumePart = (resume: ProfileData['resume']) => {
  return typeof resume === 'string' 
    ? { text: `Resume:\n${resume}` }
    : { inlineData: resume };
};

// COST OPTIMIZED: Using gemini-3-flash-preview for speed and efficiency
export const analyzeCoreProfile = async (data: ProfileData): Promise<AnalysisReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = getContext(data);
  const prompt = `
    Analyze this dev profile. Context:
    ${context}
    
    1. Pro summary.
    2. 5 Strengths/Improvements (Big Tech bar).
    3. Benchmarks: Google, Meta, Amazon.
    4. 3 specializations.
    5. CP stats evaluation.
    6. 4 REAL job matches with HTTPS URLs.
    
    Output JSON. Keep text concise.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [ { text: prompt }, getResumePart(data.resume) ] },
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          bigTechAlignment: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                requirement: { type: Type.STRING },
                gap: { type: Type.STRING },
                recommendation: { type: Type.STRING }
              }
            }
          },
          skills: {
            type: Type.OBJECT,
            properties: {
              technical: { type: Type.ARRAY, items: { type: Type.STRING } },
              soft: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          },
          suggestedRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
          competitiveProgramming: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                rating: { type: Type.STRING },
                rank: { type: Type.STRING },
                percentile: { type: Type.STRING },
              }
            }
          },
          jobMatches: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                description: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                reason: { type: Type.STRING },
                url: { type: Type.STRING }
              }
            }
          }
        },
        required: ["summary", "strengths", "improvements", "bigTechAlignment", "skills", "suggestedRoles", "competitiveProgramming", "jobMatches"]
      }
    }
  });

  const res: AnalysisReport = safeParseJSON(response.text);
  if (!res) throw new Error("Failed core report.");
  
  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  res.groundingSources = grounding.filter(c => c.web).map(c => ({ 
    title: c.web?.title || 'Source', 
    uri: c.web?.uri || '' 
  }));
  
  return res;
};

// COST OPTIMIZED: Reduced to 20 targeted items + using Flash
export const analyzeGrowth = async (data: ProfileData): Promise<{ roadmap: CareerRoadmapStep[], playlist: SkillQuestion[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Create:
    1. 6-month roadmap (3 stages).
    2. 15-20 item "Mastery Playlist" of coding challenges (LeetCode, HackerRank links) specifically targeting areas for improvement identified in their profile.
    Output JSON. Include valid platform links where possible.
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, getResumePart(data.resume)] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roadmap: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { period: { type: Type.STRING }, goal: { type: Type.STRING }, topics: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
          playlist: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                category: { type: Type.STRING }, 
                question: { type: Type.STRING }, 
                difficulty: { type: Type.STRING }, 
                link: { type: Type.STRING },
                reason: { type: Type.STRING } 
              } 
            } 
          }
        }
      }
    }
  });
  return safeParseJSON(response.text) || { roadmap: [], playlist: [] };
};

export const analyzeInterview = async (data: ProfileData): Promise<InterviewQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate 10 specific interview questions (Technical, System Design, Behavioral). JSON only.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, getResumePart(data.resume)] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            category: { type: Type.STRING },
            answerHint: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          }
        }
      }
    }
  });
  return safeParseJSON(response.text) || [];
};

// COST OPTIMIZED: Flash for mentor search is sufficient
export const fetchMentors = async (data: ProfileData): Promise<TopmateMentor[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Find 4 real Topmate.io and LinkedIn profiles of senior engineers or managers relevant to this user's stack and goals. JSON only.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, getResumePart(data.resume)] },
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            company: { type: Type.STRING },
            link: { type: Type.STRING },
            linkedinLink: { type: Type.STRING },
            expertise: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    }
  });
  return safeParseJSON(response.text) || [];
};

export const generateStudioMaterials = async (data: ProfileData): Promise<{ coverLetter: string, resumeSuggestions: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate cover letter and resume improvements for this specific job. JSON only.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, getResumePart(data.resume)] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coverLetter: { type: Type.STRING },
          resumeSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return safeParseJSON(response.text) || { coverLetter: "", resumeSuggestions: [] };
};

export const fetchAIPulse = async (data: ProfileData): Promise<AIInsight[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Latest 5 AI tools for this dev stack. JSON only.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, getResumePart(data.resume)] },
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            tool: { type: Type.STRING },
            relevance: { type: Type.STRING },
            useCase: { type: Type.STRING },
            link: { type: Type.STRING }
          }
        }
      }
    }
  });
  return safeParseJSON(response.text) || [];
};
