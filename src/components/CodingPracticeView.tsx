import React, { useState } from 'react';
import { CODING_CHALLENGES } from '../data/codingChallenges';
import { CodingChallenge } from '../types';
import { CodeRunner, ExecutionResult } from '../services/codeRunner';
import { 
  Play, 
  Send, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Terminal, 
  Clock, 
  Database, 
  Cpu, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const CodingPracticeView: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge>(CODING_CHALLENGES[0]);
  const [code, setCode] = useState<string>(selectedChallenge.starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tests' | 'terminal' | 'explanation'>('tests');

  const handleSelectChallenge = (ch: CodingChallenge) => {
    setSelectedChallenge(ch);
    setCode(ch.starterCode);
    setResult(null);
    setShowHint(false);
  };

  const handleReset = () => {
    setCode(selectedChallenge.starterCode);
    setResult(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const execResult = await CodeRunner.executeChallenge(selectedChallenge, code);
      setResult(execResult);
      setActiveTab('tests');
    } catch (err) {
      console.error('Code execution failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-teal text-xs font-bold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>AI/ML Hands-on Coding Round</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Algorithmic & Query Challenges
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Client-side sandboxed execution for metric calculations, geometry, vector similarity, and window SQL.
          </p>
        </div>

        {/* Challenge Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {CODING_CHALLENGES.map(ch => (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(ch)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedChallenge.id === ch.id
                  ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20'
                  : 'bg-navy-900 text-slate-300 border-navy-800 hover:border-navy-700'
              }`}
            >
              {ch.title.split(' ')[0]} {ch.title.split(' ')[1]} ({ch.language.toUpperCase()})
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Statement & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
            {/* Title & Badges */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-navy-800 text-brand-lightblue border border-navy-700 uppercase">
                {selectedChallenge.language}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                selectedChallenge.difficulty === 'Easy' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {selectedChallenge.difficulty}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {selectedChallenge.topic}
              </span>
            </div>

            <h2 className="text-base font-bold text-white">
              {selectedChallenge.title}
            </h2>

            {/* Description */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
              {selectedChallenge.description}
            </div>

            {/* Examples */}
            {selectedChallenge.examples.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white block">Example:</span>
                {selectedChallenge.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-xl bg-navy-950 border border-navy-850 space-y-1 text-xs font-mono">
                    <p className="text-slate-400"><span className="text-brand-lightblue">Input:</span> {ex.input}</p>
                    <p className="text-emerald-300"><span className="text-brand-teal-light">Output:</span> {ex.output}</p>
                    {ex.explanation && (
                      <p className="text-slate-400 font-sans text-[11px] pt-1">
                        <span className="text-slate-500">Note:</span> {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hint Accordion */}
            <div className="pt-2 border-t border-navy-800">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-semibold text-brand-lightblue hover:text-white flex items-center space-x-1.5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hints' : 'View Hints & Implementation Advice'}</span>
              </button>

              {showHint && (
                <ul className="mt-2.5 p-3 rounded-xl bg-navy-850 border border-navy-750 text-xs text-slate-300 space-y-1.5">
                  {selectedChallenge.hints.map((h, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-brand-teal-light font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Test Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="bg-navy-900 rounded-2xl border border-navy-800 shadow-xl overflow-hidden flex flex-col">
            {/* Editor Top Bar */}
            <div className="bg-navy-950 px-4 py-3 border-b border-navy-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  solution.{selectedChallenge.language === 'python' ? 'py' : 'sql'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  title="Reset to starter template"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold shadow-md shadow-brand-teal/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run & Test'}</span>
                </button>
              </div>
            </div>

            {/* Editor Textarea */}
            <div className="relative">
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-80 bg-navy-950 p-4 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-brand-teal/40"
              />
            </div>

            {/* Test Results & Output Panel */}
            <div className="bg-navy-900 border-t border-navy-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('tests')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === 'tests' ? 'bg-navy-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Test Cases ({result ? `${result.passedTests}/${result.totalTests}` : '3'})
                  </button>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === 'terminal' ? 'bg-navy-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sandbox Console
                  </button>
                  <button
                    onClick={() => setActiveTab('explanation')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === 'explanation' ? 'bg-navy-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Complexity & Solution
                  </button>
                </div>

                {result && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    result.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {result.success ? 'All Tests Passed' : `${result.passedTests}/${result.totalTests} Passed`}
                  </span>
                )}
              </div>

              {/* Tab: Test Cases */}
              {activeTab === 'tests' && (
                <div className="space-y-2">
                  {result ? (
                    result.testDetails.map((td, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs flex items-start justify-between ${
                          td.passed 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' 
                            : 'bg-rose-950/20 border-rose-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {td.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-white block">{td.description}</span>
                            {td.error && <span className="text-rose-400 text-[11px]">{td.error}</span>}
                          </div>
                        </div>
                        <div className="text-right font-mono text-[11px] text-slate-400">
                          {td.passed ? 'PASSED' : 'FAILED'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      Click "Run & Test" to execute your code against automated test cases.
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Terminal Console */}
              {activeTab === 'terminal' && (
                <div className="p-3 bg-navy-950 rounded-xl font-mono text-xs text-slate-300 space-y-1">
                  {result?.outputLogs.map((log, i) => (
                    <div key={i} className="text-brand-lightblue-light font-mono text-[11px]">
                      {log}
                    </div>
                  )) || (
                    <p className="text-slate-500">No execution logs yet.</p>
                  )}
                </div>
              )}

              {/* Tab: Complexity & Solution */}
              {activeTab === 'explanation' && (
                <div className="p-4 bg-navy-850 rounded-xl space-y-3 text-xs text-slate-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg bg-navy-900 border border-navy-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Complexity</span>
                      <span className="font-mono text-brand-teal-light font-semibold">{selectedChallenge.timeComplexity}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-navy-900 border border-navy-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Space Complexity</span>
                      <span className="font-mono text-brand-lightblue font-semibold">{selectedChallenge.spaceComplexity}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedChallenge.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
