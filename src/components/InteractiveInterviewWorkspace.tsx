import React, { useState, useEffect } from 'react';
import { 
  InterviewSession, 
  Question, 
  AnswerEvaluation, 
  UserSettings 
} from '../types';
import { AnswerEvaluator } from '../services/evaluator';
import { AudioService } from '../services/audioService';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  HelpCircle, 
  SkipForward, 
  LogOut, 
  Volume2, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface InteractiveInterviewWorkspaceProps {
  session: InterviewSession;
  settings: UserSettings;
  onUpdateSession: (session: InterviewSession) => void;
  onCompleteSession: (session: InterviewSession) => void;
  onExitInterview: () => void;
}

export const InteractiveInterviewWorkspace: React.FC<InteractiveInterviewWorkspaceProps> = ({
  session,
  settings,
  onUpdateSession,
  onCompleteSession,
  onExitInterview
}) => {
  const currentIndex = session.currentQuestionIndex;
  const currentQuestion: Question | undefined = session.questions[currentIndex];
  
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  
  // Follow-up interaction state
  const [followUpAnswer, setFollowUpAnswer] = useState<string>('');
  const [followUpSubmitted, setFollowUpSubmitted] = useState<boolean>(false);

  // Audio / Speech State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Timer State (in seconds)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(
    session.config.durationMinutes * 60
  );
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Check if current question was already answered
  useEffect(() => {
    const existing = session.answers.find(a => a.questionId === currentQuestion?.id);
    if (existing) {
      setUserAnswer(existing.userAnswer);
      setCurrentEvaluation(existing.evaluation || null);
    } else {
      setUserAnswer('');
      setCurrentEvaluation(null);
      setShowHint(false);
      setFollowUpAnswer('');
      setFollowUpSubmitted(false);
      setQuestionStartTime(Date.now());
    }

    // Auto-read question aloud if TTS enabled in settings
    if (settings.enableTextToSpeech && currentQuestion && !existing) {
      AudioService.speak(
        currentQuestion.questionText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        settings.voiceRate,
        settings.voicePitch
      );
    }

    return () => {
      AudioService.stopSpeaking();
      AudioService.stopListening();
    };
  }, [currentIndex, currentQuestion]);

  // Countdown timer effect
  useEffect(() => {
    if (timeRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle Voice Input (Speech-to-Text)
  const toggleListening = () => {
    if (isListening) {
      AudioService.stopListening();
      setIsListening(false);
    } else {
      const started = AudioService.startListening(
        (transcript) => {
          setUserAnswer(prev => (prev ? `${prev} ${transcript}` : transcript));
        },
        (error) => {
          console.warn('STT Error:', error);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  // Speak text with Text-to-Speech
  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      AudioService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      AudioService.speak(
        text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        settings.voiceRate,
        settings.voicePitch
      );
    }
  };

  // Submit Answer for Rubric Evaluation
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    setIsEvaluating(true);
    AudioService.stopListening();
    setIsListening(false);

    try {
      const evalResult = await AnswerEvaluator.evaluateAnswer(
        currentQuestion,
        userAnswer,
        settings
      );
      setCurrentEvaluation(evalResult);

      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

      // Save answer in session
      const existingAnswerIdx = session.answers.findIndex(a => a.questionId === currentQuestion.id);
      const newAnswers = [...session.answers];
      const answerRecord = {
        questionId: currentQuestion.id,
        userAnswer,
        evaluation: evalResult,
        timeSpentSeconds: timeSpent
      };

      if (existingAnswerIdx >= 0) {
        newAnswers[existingAnswerIdx] = answerRecord;
      } else {
        newAnswers.push(answerRecord);
      }

      // Compute updated overall session score
      const evaluated = newAnswers.filter(a => a.evaluation && !a.skipped);
      const avgScore = evaluated.length > 0 
        ? evaluated.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) / evaluated.length 
        : 0;

      const updatedSession: InterviewSession = {
        ...session,
        answers: newAnswers,
        overallScore: Math.round(avgScore * 10) / 10
      };

      StorageService.saveSession(updatedSession);
      onUpdateSession(updatedSession);

      // Speak feedback summary if TTS enabled
      if (settings.enableTextToSpeech) {
        AudioService.speak(
          `Your score is ${evalResult.score} out of 10. ${evalResult.rubricBreakdown.technicalCorrectness.feedback}`,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } catch (err) {
      console.error('Answer evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Skip Question
  const handleSkipQuestion = () => {
    if (!currentQuestion) return;

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const newAnswers = [...session.answers];
    const existingIdx = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
    
    const record = {
      questionId: currentQuestion.id,
      userAnswer: '(Skipped by candidate)',
      timeSpentSeconds: timeSpent,
      skipped: true
    };

    if (existingIdx >= 0) newAnswers[existingIdx] = record;
    else newAnswers.push(record);

    goToNextQuestion(newAnswers);
  };

  // Next Question or Complete Interview
  const goToNextQuestion = (answersList = session.answers) => {
    if (currentIndex < session.questions.length - 1) {
      const nextSession: InterviewSession = {
        ...session,
        currentQuestionIndex: currentIndex + 1,
        answers: answersList
      };
      StorageService.saveSession(nextSession);
      onUpdateSession(nextSession);
    } else {
      // Completed all questions
      finishInterview(answersList);
    }
  };

  // Finalize Interview Session
  const finishInterview = (finalAnswers = session.answers) => {
    const topicScores: Record<string, number[]> = {};
    
    session.questions.forEach(q => {
      const ans = finalAnswers.find(a => a.questionId === q.id);
      if (ans?.evaluation && !ans.skipped) {
        if (!topicScores[q.topic]) topicScores[q.topic] = [];
        topicScores[q.topic].push(ans.evaluation.score);
      }
    });

    const topicAverages: Record<string, number> = {};
    const weakTopics: string[] = [];
    const strongTopics: string[] = [];

    Object.entries(topicScores).forEach(([topic, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      topicAverages[topic] = Math.round(avg * 10) / 10;
      if (avg >= 7.5) strongTopics.push(topic);
      else if (avg < 6.0) weakTopics.push(topic);
    });

    const evaluated = finalAnswers.filter(a => a.evaluation && !a.skipped);
    const overall = evaluated.length > 0 
      ? evaluated.reduce((sum, a) => sum + (a.evaluation?.score || 0), 0) / evaluated.length 
      : 0;

    const completedSession: InterviewSession = {
      ...session,
      status: 'completed',
      answers: finalAnswers,
      overallScore: Math.round(overall * 10) / 10,
      topicScores: topicAverages,
      weakTopics: weakTopics.length > 0 ? weakTopics : ['SQL & Data Handling'],
      strongTopics: strongTopics.length > 0 ? strongTopics : ['Python']
    };

    StorageService.saveSession(completedSession);
    StorageService.generateRoadmapForSession(completedSession);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    onCompleteSession(completedSession);
  };

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center text-slate-300">
        <p>No questions found for this session configuration.</p>
        <button onClick={onExitInterview} className="mt-4 px-4 py-2 bg-brand-teal text-white rounded-xl">
          Return to Setup
        </button>
      </div>
    );
  }

  const isLastQuestion = currentIndex === session.questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      {/* Top Status Bar: Progress, Time, Controls */}
      <div className="bg-navy-900/90 rounded-2xl p-4 border border-navy-800 flex flex-wrap items-center justify-between gap-4">
        {/* Progress Stepper */}
        <div className="flex items-center space-x-3">
          <div className="text-xs">
            <span className="text-slate-400">Question</span>{' '}
            <span className="text-white font-bold text-sm">{currentIndex + 1}</span>{' '}
            <span className="text-slate-500">of {session.questions.length}</span>
          </div>
          <div className="w-32 bg-navy-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-teal to-brand-lightblue h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / session.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-navy-850 border border-navy-750">
          <Clock className={`w-3.5 h-3.5 ${timeRemainingSeconds < 300 ? 'text-rose-400 animate-pulse' : 'text-brand-teal-light'}`} />
          <span className={timeRemainingSeconds < 300 ? 'text-rose-400' : 'text-slate-200'}>
            {formatTime(timeRemainingSeconds)} remaining
          </span>
        </div>

        {/* Actions: Skip & Exit */}
        <div className="flex items-center space-x-2">
          {!currentEvaluation && (
            <button
              onClick={handleSkipQuestion}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-750 border border-navy-700 flex items-center space-x-1.5 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the current interview?')) {
                finishInterview();
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Round</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
        {/* Badges: Topic, Difficulty, Type */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-teal/20 text-brand-teal-accent border border-brand-teal/30">
              {currentQuestion.topic}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-navy-800 text-slate-300 border border-navy-700">
              {currentQuestion.difficulty}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-navy-800 text-brand-lightblue border border-navy-700">
              {currentQuestion.type}
            </span>
          </div>

          {/* Text-to-speech speaker button */}
          <button
            onClick={() => handleSpeak(currentQuestion.questionText)}
            title="Listen to question"
            className={`p-2 rounded-lg border text-xs transition-colors ${
              isSpeaking
                ? 'bg-brand-lightblue/20 border-brand-lightblue text-brand-lightblue animate-pulse'
                : 'bg-navy-850 border-navy-700 text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Question Prompt */}
        <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
          {currentQuestion.questionText}
        </h2>

        {/* Optional Hint Drawer */}
        <div className="pt-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-lightblue hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Need a hint? (Does not reveal answer)'}</span>
          </button>

          {showHint && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-navy-850 border border-brand-lightblue/30 text-xs text-brand-lightblue-subtle leading-relaxed flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-brand-lightblue flex-shrink-0 mt-0.5" />
              <span>{currentQuestion.hint}</span>
            </div>
          )}
        </div>
      </div>

      {/* Answer Input Section (Active when not yet evaluated) */}
      {!currentEvaluation ? (
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <span>Your Technical Answer</span>
            </label>

            {/* Voice Input STT Button */}
            <button
              onClick={toggleListening}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isListening
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-navy-800 text-slate-300 border-navy-700 hover:text-white'
              }`}
            >
              {isListening ? <Mic className="w-3.5 h-3.5 text-rose-400" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isListening ? 'Listening (Speak now)...' : 'Voice Input'}</span>
            </button>
          </div>

          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Type your explanation here. Be clear about mechanisms, trade-offs, metrics, and production constraints..."
            className="w-full h-44 bg-navy-950 text-slate-100 rounded-xl p-4 border border-navy-800 focus:outline-none focus:border-brand-teal text-sm leading-relaxed resize-y font-sans"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              {userAnswer.trim().split(/\s+/).filter(Boolean).length} words • Rubric evaluated on 4 criteria
            </span>

            <button
              onClick={handleSubmitAnswer}
              disabled={isEvaluating || userAnswer.trim().length < 5}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-lightblue text-navy-950 font-bold text-xs shadow-lg shadow-brand-teal/20 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Rubric...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Evaluation Results Card */
        <div className="space-y-6 animate-fadeIn">
          {/* Header Score Banner */}
          <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-navy-800">
              <div>
                <span className="text-xs font-semibold text-brand-lightblue">Coaching Assessment</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Answer Evaluation & Feedback</h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">Estimated Score</span>
                  <span className={`text-2xl font-black ${
                    currentEvaluation.score >= 8 ? 'text-emerald-400' : currentEvaluation.score >= 6 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {currentEvaluation.score} <span className="text-xs font-normal text-slate-400">/ 10</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 4-Pillar Rubric Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
              {/* Technical Correctness */}
              <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Technical Accuracy</span>
                  <span className="text-xs font-bold text-brand-teal-accent">
                    {currentEvaluation.rubricBreakdown.technicalCorrectness.score}/10
                  </span>
                </div>
                <div className="w-full bg-navy-950 h-1.5 rounded-full mb-2">
                  <div
                    className="bg-brand-teal h-full rounded-full"
                    style={{ width: `${(currentEvaluation.rubricBreakdown.technicalCorrectness.score / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {currentEvaluation.rubricBreakdown.technicalCorrectness.feedback}
                </p>
              </div>

              {/* Depth of Understanding */}
              <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Depth & Nuance</span>
                  <span className="text-xs font-bold text-brand-lightblue">
                    {currentEvaluation.rubricBreakdown.depthOfUnderstanding.score}/10
                  </span>
                </div>
                <div className="w-full bg-navy-950 h-1.5 rounded-full mb-2">
                  <div
                    className="bg-brand-lightblue h-full rounded-full"
                    style={{ width: `${(currentEvaluation.rubricBreakdown.depthOfUnderstanding.score / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {currentEvaluation.rubricBreakdown.depthOfUnderstanding.feedback}
                </p>
              </div>

              {/* Practical Application */}
              <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Practical Real-World</span>
                  <span className="text-xs font-bold text-teal-400">
                    {currentEvaluation.rubricBreakdown.practicalApplication.score}/10
                  </span>
                </div>
                <div className="w-full bg-navy-950 h-1.5 rounded-full mb-2">
                  <div
                    className="bg-teal-400 h-full rounded-full"
                    style={{ width: `${(currentEvaluation.rubricBreakdown.practicalApplication.score / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {currentEvaluation.rubricBreakdown.practicalApplication.feedback}
                </p>
              </div>

              {/* Clarity */}
              <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Clarity & Flow</span>
                  <span className="text-xs font-bold text-sky-400">
                    {currentEvaluation.rubricBreakdown.clarityOfExplanation.score}/10
                  </span>
                </div>
                <div className="w-full bg-navy-950 h-1.5 rounded-full mb-2">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${(currentEvaluation.rubricBreakdown.clarityOfExplanation.score / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {currentEvaluation.rubricBreakdown.clarityOfExplanation.feedback}
                </p>
              </div>
            </div>

            {/* Strengths & Missing Concepts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Correctly Answered */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>What You Answered Correctly</span>
                </h4>
                <ul className="space-y-1.5">
                  {currentEvaluation.correctPoints.map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start space-x-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Concepts */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Missing Concepts or Improvement Points</span>
                </h4>
                <ul className="space-y-1.5">
                  {currentEvaluation.missingConcepts.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start space-x-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Exemplary Model Answer */}
            <div className="mt-5 p-4 rounded-xl bg-navy-850/90 border border-navy-750">
              <h4 className="text-xs font-bold text-brand-lightblue flex items-center space-x-1.5 mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Example Strong Interview Answer</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {currentEvaluation.modelAnswer}
              </p>
            </div>

            {/* Practical Improvement Tip */}
            <div className="mt-4 p-3 rounded-xl bg-brand-teal/10 border border-brand-teal/30 flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-brand-teal-light flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-200 leading-tight">
                <span className="font-bold text-brand-teal-light">Coach's Pro Tip: </span>
                {currentEvaluation.practicalTip}
              </div>
            </div>

            {/* Suggested Follow-up Question */}
            {currentEvaluation.suggestedFollowUp && (
              <div className="mt-5 p-4 rounded-xl bg-navy-950 border border-navy-800">
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 mb-1.5">
                  <Sparkles className="w-4 h-4 text-brand-lightblue" />
                  <span>Suggested Follow-up Challenge</span>
                </h4>
                <p className="text-xs text-slate-300 mb-3">
                  {currentEvaluation.suggestedFollowUp}
                </p>

                {!followUpSubmitted ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={followUpAnswer}
                      onChange={e => setFollowUpAnswer(e.target.value)}
                      placeholder="Try a quick 1-2 sentence response to this follow-up..."
                      className="w-full bg-navy-900 text-white text-xs rounded-lg px-3 py-2 border border-navy-750 focus:outline-none focus:border-brand-teal"
                    />
                    <button
                      onClick={() => setFollowUpSubmitted(true)}
                      disabled={!followUpAnswer.trim()}
                      className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
                    >
                      Check Follow-up
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-brand-teal/10 border border-brand-teal/30 text-xs text-brand-teal-light">
                    Follow-up logged! Excellent practice on handling technical drill-downs under pressure.
                  </div>
                )}
              </div>
            )}

            {/* Navigation CTA: Next Question */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => goToNextQuestion()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-teal to-brand-lightblue text-navy-950 font-bold text-xs shadow-xl shadow-brand-teal/20 hover:brightness-110 transition-all flex items-center space-x-2"
              >
                <span>{isLastQuestion ? 'Complete Interview & View Report' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
