import React, { useState, useEffect } from 'react';
import { 
  JobRole, 
  InterviewConfig, 
  InterviewSession, 
  UserSettings 
} from './types';
import { StorageService } from './services/storageService';
import { QuestionSelector } from './services/questionSelector';
import { AudioService } from './services/audioService';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { PerformanceDashboardView } from './components/PerformanceDashboardView';
import { InterviewSetupView } from './components/InterviewSetupView';
import { InteractiveInterviewWorkspace } from './components/InteractiveInterviewWorkspace';
import { CodingPracticeView } from './components/CodingPracticeView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { RoadmapView } from './components/RoadmapView';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('setup');
  const [activeRole, setActiveRole] = useState<JobRole>('AI/ML Engineer');
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Load existing sessions on mount
  useEffect(() => {
    const loadedSessions = StorageService.getSessions();
    setSessions(loadedSessions);

    // If there is an in-progress session, restore it
    const inProgress = loadedSessions.find(s => s.status === 'in-progress');
    if (inProgress) {
      setActiveSession(inProgress);
      setActiveRole(inProgress.config.role);
    }
  }, []);

  const handleStartInterview = (config: InterviewConfig) => {
    setActiveRole(config.role);
    const selectedQuestions = QuestionSelector.selectQuestionsForSession(config);

    const newSession: InterviewSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      config,
      status: 'in-progress',
      currentQuestionIndex: 0,
      questions: selectedQuestions,
      answers: [],
      overallScore: 0,
      topicScores: {},
      weakTopics: [],
      strongTopics: []
    };

    StorageService.saveSession(newSession);
    setActiveSession(newSession);
    setSessions(StorageService.getSessions());
    setCurrentTab('interview');
  };

  const handleQuickStart = () => {
    const defaultConfig: InterviewConfig = {
      role: activeRole,
      experienceLevel: 'Intermediate',
      candidateMode: 'Fresher',
      interviewType: 'Mixed',
      difficulty: 'Medium',
      numQuestions: 5,
      durationMinutes: 20,
      selectedTopics: ['Machine Learning', 'Deep Learning', 'NLP & Generative AI', 'Python']
    };
    handleStartInterview(defaultConfig);
  };

  const handleUpdateSession = (updated: InterviewSession) => {
    setActiveSession(updated);
    setSessions(StorageService.getSessions());
  };

  const handleCompleteSession = (completed: InterviewSession) => {
    setActiveSession(completed);
    setSessions(StorageService.getSessions());
    // Navigate to roadmap or dashboard
    setCurrentTab('dashboard');
  };

  const handleToggleAudioMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (nextMuted) {
      AudioService.stopSpeaking();
    }
  };

  const handleStartFromResumeAnalysis = (role: JobRole, resumeText: string, jd: string) => {
    setActiveRole(role);
    const config: InterviewConfig = {
      role,
      experienceLevel: 'Intermediate',
      candidateMode: 'Fresher',
      interviewType: 'Mixed',
      difficulty: 'Medium',
      numQuestions: 5,
      durationMinutes: 25,
      selectedTopics: ['Machine Learning', 'Deep Learning', 'NLP & Generative AI', 'Project-Based'],
      resumeText,
      jobDescription: jd
    };
    handleStartInterview(config);
  };

  return (
    <div className="flex min-h-screen bg-navy-950 text-slate-100 font-sans selection:bg-brand-teal selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeRole={activeRole}
        isInterviewActive={activeSession?.status === 'in-progress'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <Header
          activeRole={activeRole}
          experienceLevel={activeSession?.config.experienceLevel || 'Intermediate'}
          candidateMode={activeSession?.config.candidateMode || 'Fresher'}
          onOpenSettings={() => setCurrentTab('settings')}
          onQuickStart={handleQuickStart}
          isAudioMuted={isAudioMuted}
          onToggleAudioMute={handleToggleAudioMute}
        />

        <main className="flex-1 pb-16">
          {currentTab === 'dashboard' && (
            <PerformanceDashboardView
              sessions={sessions}
              onStartNewInterview={() => setCurrentTab('setup')}
              onNavigateToCoding={() => setCurrentTab('coding')}
              onSelectRole={setActiveRole}
            />
          )}

          {currentTab === 'setup' && (
            <InterviewSetupView
              initialRole={activeRole}
              onStartInterview={handleStartInterview}
            />
          )}

          {currentTab === 'interview' && (
            activeSession && activeSession.status === 'in-progress' ? (
              <InteractiveInterviewWorkspace
                session={activeSession}
                settings={{
                  ...settings,
                  enableTextToSpeech: !isAudioMuted && settings.enableTextToSpeech
                }}
                onUpdateSession={handleUpdateSession}
                onCompleteSession={handleCompleteSession}
                onExitInterview={() => setCurrentTab('setup')}
              />
            ) : (
              <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-navy-900 border border-navy-800 text-center space-y-4">
                <h3 className="text-lg font-bold text-white">No Active Interview Session</h3>
                <p className="text-xs text-slate-400">
                  Configure a mock round or quick-start to begin your interactive technical interview.
                </p>
                <button
                  onClick={() => setCurrentTab('setup')}
                  className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold transition-colors"
                >
                  Configure New Interview
                </button>
              </div>
            )
          )}

          {currentTab === 'coding' && (
            <CodingPracticeView />
          )}

          {currentTab === 'resume' && (
            <ResumeAnalyzerView
              activeRole={activeRole}
              onNavigateToSetupWithSkills={handleStartFromResumeAnalysis}
            />
          )}

          {currentTab === 'roadmap' && (
            <RoadmapView activeRole={activeRole} />
          )}

          {currentTab === 'settings' && (
            <SettingsModal
              settings={settings}
              onUpdateSettings={setSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
