import React, { useState } from 'react';
import { 
  FileText, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  Settings, 
  Mic, 
  PlayCircle, 
  Cpu, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  UserCheck,
  PieChart,
  Search
} from 'lucide-react';

// --- MOCK DATA FOR DEMO ---
const DEMO_RESUME = `
John Doe
Software Engineer

Summary:
Passionate developer with 3 years of experience in React and JavaScript. 
Love building responsive UI and working with REST APIs. 
Familiar with Agile methodologies and Git version control.

Experience:
Frontend Developer at TechCorp (2021-Present)
- Built dashboard using React and Redux.
- Improved site performance by 20%.
- Collaborated with UX team.

Skills: React, JavaScript, CSS, HTML, Git, Redux, Tailwind.
`;

const DEMO_JOB_DESC = `
Job Title: Senior Frontend Engineer

We are looking for a Senior Frontend Engineer to join our team.
The ideal candidate will have:
- 5+ years of experience with React and TypeScript.
- Strong understanding of Node.js and backend integration.
- Experience with cloud platforms (AWS or GCP).
- Ability to lead code reviews and mentor junior devs.
- Knowledge of CI/CD pipelines.

Skills Required: React, TypeScript, Node.js, AWS, CI/CD, Leadership.
`;

const DEMO_TRANSCRIPT = `
Interviewer: Tell me about a time you faced a technical challenge.
Candidate: In my last project, we had a memory leak in our React app. The dashboard would crash after 30 minutes. I used Chrome DevTools to profile the memory usage and found an uncleared interval in a component. I fixed it by adding a cleanup function in useEffect.
Interviewer: That's great. How do you handle disagreements with team members?
Candidate: I usually try to listen to their perspective first. Recently, a designer wanted an animation that would hurt performance. I explained the technical trade-offs and we found a middle ground that looked good but was performant.
Interviewer: Do you have experience with Python?
Candidate: No, I haven't used Python professionally, mostly JavaScript.
`;

// --- MOCK ANALYSIS RESULTS (Fallback) ---
const MOCK_ANALYSIS = {
  score: 65,
  matchStatus: "Moderate Match",
  matchingSkills: ["React", "Frontend Experience"],
  missingSkills: ["TypeScript", "Node.js", "AWS", "5+ years experience (has 3)", "CI/CD"],
  summary: "Candidate has a strong foundation in React but lacks the seniority and backend/cloud specific skills required for this role.",
  recommendation: "Consider for a Mid-level role instead of Senior."
};

const MOCK_TRANSCRIPT_ANALYSIS = {
  sentiment: "Positive",
  strengths: ["Problem Solving (Memory Leak)", "Communication", "Collaboration"],
  weaknesses: ["Lack of Python experience"],
  summary: "The candidate demonstrated strong technical debugging skills and a diplomatic approach to conflict. However, they lack the specific backend language requirement requested."
};

export default function TalentScoutAI() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('matcher'); // matcher | interview
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Matcher State
  const [resumeText, setResumeText] = useState(DEMO_RESUME);
  const [jobDesc, setJobDesc] = useState(DEMO_JOB_DESC);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Interview State
  const [transcript, setTranscript] = useState(DEMO_TRANSCRIPT);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [interviewResult, setInterviewResult] = useState(null);

  // --- ACTIONS ---

  const handleAnalyzeResume = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    if (!apiKey) {
      // Simulation Mode
      await new Promise(r => setTimeout(r, 2000));
      setAnalysisResult(MOCK_ANALYSIS);
      setIsAnalyzing(false);
      return;
    }

    try {
      const prompt = `
        Act as an expert Technical Recruiter. Analyze the following Resume against the Job Description.
        
        RESUME:
        ${resumeText}

        JOB DESCRIPTION:
        ${jobDesc}

        Return a JSON object with this structure (no markdown):
        {
          "score": number (0-100),
          "matchStatus": string (e.g., "High Match", "Low Match"),
          "matchingSkills": string[],
          "missingSkills": string[],
          "summary": string (brief analysis),
          "recommendation": string (hiring advice)
        }
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      setAnalysisResult(JSON.parse(jsonStr));

    } catch (error) {
      console.error("Error:", error);
      alert("Analysis failed. Check API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSummarizeInterview = async () => {
    setIsSummarizing(true);
    setInterviewResult(null);

    if (!apiKey) {
      await new Promise(r => setTimeout(r, 2000));
      setInterviewResult(MOCK_TRANSCRIPT_ANALYSIS);
      setIsSummarizing(false);
      return;
    }

    try {
      const prompt = `
        Analyze this interview transcript. Extract key insights.

        TRANSCRIPT:
        ${transcript}

        Return JSON:
        {
          "sentiment": string (Positive/Neutral/Negative),
          "strengths": string[],
          "weaknesses": string[],
          "summary": string (executive summary)
        }
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      setInterviewResult(JSON.parse(jsonStr));

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  // --- UI COMPONENTS ---

  const renderScoreDial = (score) => {
    const color = score > 80 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500';
    const strokeColor = score > 80 ? '#22c55e' : score > 50 ? '#eab308' : '#ef4444';
    
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            className="animate-[spin_1s_ease-out_reverse]"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-bold ${color}`}>{score}%</span>
          <span className="text-xs text-slate-400 font-medium">MATCH</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-lg tracking-wide">TalentScout</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-2">
          <button 
            onClick={() => setActiveTab('matcher')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'matcher' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Briefcase className="w-5 h-5 mx-auto lg:mx-0" />
            <span className="hidden lg:block font-medium">Resume Matcher</span>
          </button>
          <button 
            onClick={() => setActiveTab('interview')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'interview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Mic className="w-5 h-5 mx-auto lg:mx-0" />
            <span className="hidden lg:block font-medium">Interview Insights</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5 mx-auto lg:mx-0" />
            <span className="hidden lg:block font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-20 lg:ml-64 p-4 lg:p-8 transition-all duration-300">
        
        {/* Settings Modal/Panel */}
        {showSettings && (
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in slide-in-from-top-2">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" /> API Configuration
            </h3>
            <div className="flex gap-3">
              <input 
                type="password" 
                placeholder="Enter Google Gemini API Key" 
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button 
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Leave blank to use Demo Mode with mock data.</p>
          </div>
        )}

        {/* CONTENT: RESUME MATCHER */}
        {activeTab === 'matcher' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Smart Resume Analyzer</h1>
              <p className="text-slate-500">Detect skill gaps and match candidates using Semantic AI analysis.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
              {/* INPUT COLUMN */}
              <div className="space-y-6 h-full flex flex-col">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Candidate Resume
                  </label>
                  <textarea 
                    className="flex-1 w-full p-3 bg-slate-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm font-mono text-slate-600"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume text here..."
                  />
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Job Description
                  </label>
                  <textarea 
                    className="flex-1 w-full p-3 bg-slate-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm font-mono text-slate-600"
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste JD here..."
                  />
                </div>

                <button 
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
                  {isAnalyzing ? 'Analyzing Semantic Match...' : 'Analyze Match & Detect Gaps'}
                </button>
              </div>

              {/* OUTPUT COLUMN */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 overflow-y-auto">
                {!analysisResult ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <BarChart3 className="w-16 h-16 mb-4 text-slate-200" />
                    <p>Run analysis to see detailed breakdown</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-right-4">
                    {/* Top Score Section */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{analysisResult.matchStatus}</h2>
                        <p className="text-sm text-slate-500 mt-1 max-w-xs">{analysisResult.summary}</p>
                      </div>
                      {renderScoreDial(analysisResult.score)}
                    </div>

                    {/* Recommendation */}
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
                      <UserCheck className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-indigo-900 text-sm">AI Recommendation</h4>
                        <p className="text-indigo-700 text-sm">{analysisResult.recommendation}</p>
                      </div>
                    </div>

                    {/* Skills Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Matches Found
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.matchingSkills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Critical Gaps
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missingSkills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CONTENT: INTERVIEW INSIGHTS */}
        {activeTab === 'interview' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Interview Summarizer</h1>
              <p className="text-slate-500">Turn raw interview audio transcripts into actionable hiring insights.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
               <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex justify-between items-center">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" /> Transcript Input
                 </label>
                 <button 
                   onClick={handleSummarizeInterview}
                   disabled={isSummarizing}
                   className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                 >
                   {isSummarizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mic className="w-3 h-3" />}
                   Generate Summary
                 </button>
               </div>
               <textarea 
                 className="w-full h-48 p-6 text-slate-600 text-sm leading-relaxed focus:outline-none resize-y"
                 value={transcript}
                 onChange={(e) => setTranscript(e.target.value)}
                 placeholder="Paste interview transcript here..."
               />
            </div>

            {interviewResult && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                {/* Sentiment Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="text-slate-400 text-xs font-bold uppercase mb-4">Sentiment</h4>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${
                      interviewResult.sentiment === 'Positive' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <PieChart className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-slate-800">{interviewResult.sentiment}</span>
                  </div>
                </div>

                {/* Strengths Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="text-slate-400 text-xs font-bold uppercase mb-4 text-green-600">Key Strengths</h4>
                  <ul className="space-y-2">
                    {interviewResult.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="text-slate-400 text-xs font-bold uppercase mb-4 text-red-500">Red Flags / Gaps</h4>
                  <ul className="space-y-2">
                    {interviewResult.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Full Summary - Spans Full Width */}
                <div className="md:col-span-3 bg-slate-900 text-slate-300 p-6 rounded-2xl shadow-lg">
                  <h4 className="text-white text-sm font-bold uppercase mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Executive Summary
                  </h4>
                  <p className="leading-relaxed text-sm">{interviewResult.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
