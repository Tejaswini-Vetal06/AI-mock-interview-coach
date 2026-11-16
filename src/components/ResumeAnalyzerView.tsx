import React, { useState } from 'react';
import { JobRole, ResumeAnalysisResult } from '../types';
import { ResumeParser } from '../services/resumeParser';
import { JOB_ROLES } from '../data/roles';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Search,
  Check,
  FileCheck
} from 'lucide-react';

interface ResumeAnalyzerViewProps {
  activeRole: JobRole;
  onNavigateToSetupWithSkills: (role: JobRole, resumeText: string, jd: string) => void;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  activeRole,
  onNavigateToSetupWithSkills
}) => {
  const [selectedRole, setSelectedRole] = useState<JobRole>(activeRole);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const text = await ResumeParser.extractTextFromPDF(file);
      setResumeText(text);
      setResumeFileName(file.name);

      const result = ResumeParser.analyze(text, selectedRole, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing resume:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleRunAnalysis = () => {
    if (!resumeText.trim()) return;
    const result = ResumeParser.analyze(resumeText, selectedRole, jobDescription);
    setAnalysisResult(result);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-brand-lightblue text-xs font-semibold uppercase tracking-wider mb-1.5">
          <FileText className="w-4 h-4" />
          <span>Resume & JD Gap Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Resume & Job Description Analyzer
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Evaluate your resume against target AI/ML industry benchmarks and job descriptions. Identify technical gaps, get project interview talking points, and receive a focused revision checklist.
        </p>
      </div>

      {/* Input Section: Upload & JD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Uploader Card */}
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-[10px] font-black">1</span>
            <span>Upload Resume (PDF) or Paste Plaintext</span>
          </h2>

          <div className="border-2 border-dashed border-navy-750 hover:border-brand-teal/50 rounded-2xl p-6 text-center bg-navy-850/40 transition-colors">
            <input
              type="file"
              id="analyzer-pdf-upload"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="analyzer-pdf-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-brand-teal">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-white">
                {isParsing ? 'Extracting text...' : resumeFileName ? resumeFileName : 'Upload your PDF resume'}
              </p>
              <p className="text-[11px] text-slate-400">
                100% private & client-side parsed.
              </p>
            </label>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
              Or paste resume text directly:
            </span>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your education, skills, and project descriptions..."
              className="w-full h-32 bg-navy-950 text-slate-200 text-xs rounded-xl p-3 border border-navy-800 focus:outline-none focus:border-brand-teal resize-none"
            />
          </div>
        </div>

        {/* Target Role & Job Description Card */}
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-[10px] font-black">2</span>
            <span>Target Benchmark & Job Description</span>
          </h2>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Target Role Benchmark
            </label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as JobRole)}
              className="w-full bg-navy-850 text-white text-xs rounded-xl px-3 py-2.5 border border-navy-700 focus:outline-none focus:border-brand-teal"
            >
              {JOB_ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Paste Target Job Description (Optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste job posting requirements (e.g. 'Must have experience with LangChain, PyTorch, RAG architectures, and Kubernetes')..."
              className="w-full h-40 bg-navy-950 text-slate-200 text-xs rounded-xl p-3 border border-navy-800 focus:outline-none focus:border-brand-teal resize-none"
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={!resumeText.trim()}
            className="w-full py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-xs shadow-md shadow-brand-teal/20 disabled:opacity-40 transition-all flex items-center justify-center space-x-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Analyze Resume & JD Match</span>
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Metric Strip */}
          <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-lightblue flex items-center justify-center shadow-lg shadow-brand-teal/20">
                <FileCheck className="w-7 h-7 text-navy-950 font-bold" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {analysisResult.candidateName ? `${analysisResult.candidateName}'s Profile` : 'Candidate Profile Analysis'}
                </h3>
                <p className="text-xs text-slate-400">
                  Benchmarked against {selectedRole}
                </p>
              </div>
            </div>

            {/* Match Score Gauge */}
            <div className="flex items-center space-x-3 bg-navy-850 px-4 py-2.5 rounded-xl border border-navy-750">
              <span className="text-xs font-semibold text-slate-300">Role Match:</span>
              <span className={`text-xl font-black ${
                analysisResult.matchScore >= 80 ? 'text-emerald-400' : analysisResult.matchScore >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {analysisResult.matchScore}%
              </span>
            </div>

            <button
              onClick={() => onNavigateToSetupWithSkills(selectedRole, resumeText, jobDescription)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-lightblue text-navy-950 font-bold text-xs shadow-md shadow-brand-teal/20 hover:brightness-110 transition-all flex items-center space-x-1.5"
            >
              <span>Practice With These Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid: Identified Skills & Skill Preparation Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills Checklist (Matched vs Missing) */}
            <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Skill Preparation Checklist</span>
                <span className="text-xs text-brand-teal-light font-normal">
                  {analysisResult.matchedRoleSkills.length} Matched / {analysisResult.missingSkills.length} Gap(s)
                </span>
              </h4>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {analysisResult.skillChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      item.matched 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' 
                        : 'bg-navy-850 border-navy-750 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {item.matched ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-500" />
                      )}
                      <span className={`font-medium ${item.matched ? 'text-white' : 'text-slate-300'}`}>
                        {item.skill}
                      </span>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.priority === 'High' 
                        ? 'bg-rose-500/20 text-rose-300' 
                        : item.priority === 'Medium' 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Revision Topics & Project Prompts */}
            <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-brand-teal-light" />
                <span>Recommended Revision Plan</span>
              </h4>

              <div className="space-y-2">
                {analysisResult.recommendedTopicsToRevise.map((topic, i) => (
                  <div key={i} className="p-3 rounded-xl bg-navy-850 border border-brand-teal/30 text-xs text-brand-lightblue flex items-start space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-teal-light flex-shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-navy-800">
                <h5 className="text-xs font-bold text-white mb-2">Detected Project Highlights to Defend</h5>
                <div className="space-y-1.5">
                  {analysisResult.projectSummaries.map((p, i) => (
                    <p key={i} className="text-xs text-slate-400 p-2 rounded-lg bg-navy-950 border border-navy-850">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
