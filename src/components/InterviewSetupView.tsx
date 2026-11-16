import React, { useState } from 'react';
import { 
  JobRole, 
  ExperienceLevel, 
  CandidateMode, 
  InterviewType, 
  Difficulty, 
  TopicCategory, 
  InterviewConfig 
} from '../types';
import { JOB_ROLES, TOPIC_DISPLAY_NAMES } from '../data/roles';
import { RoleCard } from './RoleCard';
import { ResumeParser } from '../services/resumeParser';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  Sliders, 
  AlertCircle 
} from 'lucide-react';

interface InterviewSetupViewProps {
  initialRole: JobRole;
  onStartInterview: (config: InterviewConfig) => void;
}

export const InterviewSetupView: React.FC<InterviewSetupViewProps> = ({
  initialRole,
  onStartInterview
}) => {
  const [selectedRole, setSelectedRole] = useState<JobRole>(initialRole);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');
  const [candidateMode, setCandidateMode] = useState<CandidateMode>('Fresher');
  const [interviewType, setInterviewType] = useState<InterviewType>('Mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  
  const allTopics: TopicCategory[] = [
    'Machine Learning',
    'Deep Learning',
    'NLP & Generative AI',
    'Python',
    'SQL & Data Handling',
    'MLOps & Deployment',
    'Project-Based',
    'Behavioral & HR'
  ];

  const [selectedTopics, setSelectedTopics] = useState<TopicCategory[]>([
    'Machine Learning',
    'Deep Learning',
    'NLP & Generative AI',
    'Python'
  ]);

  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [isParsingPDF, setIsParsingPDF] = useState<boolean>(false);
  const [resumeSkillsCount, setResumeSkillsCount] = useState<number>(0);

  const toggleTopic = (topic: TopicCategory) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter(t => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF format resume.');
      return;
    }

    setIsParsingPDF(true);
    try {
      const extracted = await ResumeParser.extractTextFromPDF(file);
      setResumeFileName(file.name);
      setResumeText(extracted);

      const analysis = ResumeParser.analyze(extracted, selectedRole, jobDescription);
      setResumeSkillsCount(analysis.identifiedSkills.length);
    } catch (err) {
      console.error('Failed to parse resume PDF:', err);
    } finally {
      setIsParsingPDF(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: InterviewConfig = {
      role: selectedRole,
      experienceLevel,
      candidateMode,
      interviewType,
      difficulty,
      numQuestions,
      durationMinutes,
      selectedTopics,
      jobDescription: jobDescription.trim() || undefined,
      resumeFileName: resumeFileName || undefined,
      resumeText: resumeText || undefined
    };

    onStartInterview(config);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-brand-lightblue text-xs font-semibold uppercase tracking-wider mb-1.5">
          <Sliders className="w-4 h-4" />
          <span>Interactive Simulation Setup</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Configure Your Mock Interview
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Select your target role, experience level, and practice domains. Add your resume or a target job description for customized question generation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Target Job Role Cards */}
        <section className="bg-navy-900/60 p-6 rounded-2xl border border-navy-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs font-black">1</span>
                <span>Select Target Job Role</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Questions will be heavily weighted toward role-specific algorithms and architectures.
              </p>
            </div>
            <span className="text-xs text-brand-teal-light font-semibold hidden sm:inline-block">
              {JOB_ROLES.length} Specialized Tracks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {JOB_ROLES.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                isSelected={selectedRole === role.id}
                onSelect={() => setSelectedRole(role.id)}
              />
            ))}
          </div>
        </section>

        {/* Step 2: Experience Level & Candidate Mode */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience Level */}
          <div className="bg-navy-900/60 p-6 rounded-2xl border border-navy-800">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-[10px] font-black">2</span>
              <span>Experience Level</span>
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    experienceLevel === lvl
                      ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20'
                      : 'bg-navy-850 text-slate-300 border-navy-700/80 hover:border-navy-600'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5">
              {experienceLevel === 'Beginner' && 'Focuses on core definitions, intuition, and standard library syntax.'}
              {experienceLevel === 'Intermediate' && 'Tests trade-offs, architecture decisions, and real-world failure modes.'}
              {experienceLevel === 'Advanced' && 'Pushes deep into mathematical derivations, scale bottlenecks, and novel papers.'}
            </p>
          </div>

          {/* Candidate Mode */}
          <div className="bg-navy-900/60 p-6 rounded-2xl border border-navy-800">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-[10px] font-black">3</span>
              <span>Candidate Track Mode</span>
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Internship', 'Fresher', 'Experienced'] as CandidateMode[]).map(mode => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setCandidateMode(mode)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    candidateMode === mode
                      ? 'bg-brand-lightblue text-navy-950 border-brand-lightblue shadow-md shadow-brand-lightblue/20'
                      : 'bg-navy-850 text-slate-300 border-navy-700/80 hover:border-navy-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5">
              Tailors behavioral questions and expects academic vs production project scope.
            </p>
          </div>
        </section>

        {/* Step 3: Interview Type, Difficulty, Questions & Duration */}
        <section className="bg-navy-900/60 p-6 rounded-2xl border border-navy-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs font-black">4</span>
            <span>Interview Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Interview Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Interview Type
              </label>
              <select
                value={interviewType}
                onChange={e => setInterviewType(e.target.value as InterviewType)}
                className="w-full bg-navy-850 text-white text-xs rounded-xl px-3 py-2.5 border border-navy-700 focus:outline-none focus:border-brand-teal"
              >
                <option value="Mixed">Mixed (Comprehensive Round)</option>
                <option value="Technical">Technical & Architectural</option>
                <option value="Coding">Live Coding & Algorithms</option>
                <option value="Project-Based">Project & Experience Defense</option>
                <option value="HR">Behavioral & Situational</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-navy-850 text-white text-xs rounded-xl px-3 py-2.5 border border-navy-700 focus:outline-none focus:border-brand-teal"
              >
                <option value="Easy">Easy (Fundamentals)</option>
                <option value="Medium">Medium (Industry Standard)</option>
                <option value="Hard">Hard (Senior / Complex Edge Cases)</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Questions Count
              </label>
              <select
                value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                className="w-full bg-navy-850 text-white text-xs rounded-xl px-3 py-2.5 border border-navy-700 focus:outline-none focus:border-brand-teal"
              >
                <option value={5}>5 Questions (Quick Check)</option>
                <option value={10}>10 Questions (Standard Round)</option>
                <option value={15}>15 Questions (Thorough Assessment)</option>
                <option value={20}>20 Questions (Full Marathon)</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Total Duration
              </label>
              <select
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-navy-850 text-white text-xs rounded-xl px-3 py-2.5 border border-navy-700 focus:outline-none focus:border-brand-teal"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>

          {/* Topics to Practice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              Specific Topics to Cover (Select at least one)
            </label>
            <div className="flex flex-wrap gap-2">
              {allTopics.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    type="button"
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-brand-teal/20 text-brand-teal-accent border-brand-teal/40'
                        : 'bg-navy-850 text-slate-400 border-navy-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{topic}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Step 4: Optional Resume & Job Description Personalization */}
        <section className="bg-navy-900/60 p-6 rounded-2xl border border-navy-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs font-black">5</span>
              <span>Personalization (Optional)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload your PDF resume or paste a target Job Description to simulate tailored project questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PDF Resume Uploader */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Upload Resume (PDF format)
              </label>
              <div className="border-2 border-dashed border-navy-750 hover:border-brand-teal/50 rounded-2xl p-5 text-center bg-navy-850/50 transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-brand-teal">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {isParsingPDF ? 'Extracting text...' : resumeFileName ? resumeFileName : 'Click to upload your PDF resume'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Safe client-side extraction. No resume required to start.
                    </p>
                  </div>
                </label>
                {resumeFileName && !isParsingPDF && (
                  <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Identified {resumeSkillsCount} skills from resume</span>
                  </div>
                )}
              </div>
            </div>

            {/* Target Job Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Paste Job Description (Optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste role responsibilities or required qualifications (e.g. 'Must have experience with LangChain, Pinecone, PyTorch, and deploying models to Kubernetes')..."
                className="w-full h-32 bg-navy-850 text-white text-xs rounded-xl p-3 border border-navy-700 focus:outline-none focus:border-brand-teal placeholder-slate-500 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Submit & Start CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-navy-800">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-brand-teal" />
            <span>Ready to practice: {numQuestions} questions • ~{durationMinutes} minutes • {selectedRole}</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-lightblue text-navy-950 font-bold text-sm shadow-xl shadow-brand-teal/20 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
          >
            <span>Begin Mock Interview</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </form>
    </div>
  );
};
