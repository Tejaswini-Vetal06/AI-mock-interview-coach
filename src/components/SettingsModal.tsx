import React, { useState } from 'react';
import { UserSettings } from '../types';
import { StorageService } from '../services/storageService';
import { 
  Sliders, 
  Key, 
  Volume2, 
  Mic, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [rubricWeights, setRubricWeights] = useState(settings.rubricWeights);
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [enableSTT, setEnableSTT] = useState(settings.enableSpeechRecognition);
  const [enableTTS, setEnableTTS] = useState(settings.enableTextToSpeech);
  const [voiceRate, setVoiceRate] = useState(settings.voiceRate);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newSettings: UserSettings = {
      ...settings,
      rubricWeights,
      geminiApiKey: apiKey.trim(),
      enableSpeechRecognition: enableSTT,
      enableTextToSpeech: enableTTS,
      voiceRate
    };

    StorageService.saveSettings(newSettings);
    onUpdateSettings(newSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetWeights = () => {
    setRubricWeights({
      technicalCorrectness: 0.40,
      depthOfUnderstanding: 0.25,
      practicalApplication: 0.20,
      clarityOfExplanation: 0.15
    });
  };

  const totalWeightPercent = Math.round(
    (rubricWeights.technicalCorrectness +
      rubricWeights.depthOfUnderstanding +
      rubricWeights.practicalApplication +
      rubricWeights.clarityOfExplanation) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-brand-lightblue text-xs font-semibold uppercase tracking-wider mb-1.5">
          <Sliders className="w-4 h-4" />
          <span>System & Evaluation Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Settings & Evaluation Weights
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Customize the 4-pillar interview rubric weights, voice simulation parameters, and optional Gemini API integration.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Rubric Weights Configuration */}
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>4-Pillar Coaching Rubric Weights</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total sum must equal 100%. (Current total: <span className={totalWeightPercent === 100 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{totalWeightPercent}%</span>)
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetWeights}
              className="text-xs text-brand-lightblue hover:text-white flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Technical Correctness */}
            <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">Technical Correctness</span>
                <span className="text-brand-teal-light font-bold">
                  {Math.round(rubricWeights.technicalCorrectness * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.70"
                step="0.05"
                value={rubricWeights.technicalCorrectness}
                onChange={e => setRubricWeights({ ...rubricWeights, technicalCorrectness: parseFloat(e.target.value) })}
                className="w-full accent-brand-teal cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Factual precision, algorithm correctness, and key concept presence.
              </p>
            </div>

            {/* Depth of Understanding */}
            <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">Depth of Understanding</span>
                <span className="text-brand-lightblue font-bold">
                  {Math.round(rubricWeights.depthOfUnderstanding * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.60"
                step="0.05"
                value={rubricWeights.depthOfUnderstanding}
                onChange={e => setRubricWeights({ ...rubricWeights, depthOfUnderstanding: parseFloat(e.target.value) })}
                className="w-full accent-brand-lightblue cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Mathematical foundations, internal mechanics, and nuance.
              </p>
            </div>

            {/* Practical Application */}
            <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">Practical Application</span>
                <span className="text-teal-400 font-bold">
                  {Math.round(rubricWeights.practicalApplication * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={rubricWeights.practicalApplication}
                onChange={e => setRubricWeights({ ...rubricWeights, practicalApplication: parseFloat(e.target.value) })}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Production failure modes, latency, memory, and scalability trade-offs.
              </p>
            </div>

            {/* Clarity of Explanation */}
            <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">Clarity of Explanation</span>
                <span className="text-sky-400 font-bold">
                  {Math.round(rubricWeights.clarityOfExplanation * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                value={rubricWeights.clarityOfExplanation}
                onChange={e => setRubricWeights({ ...rubricWeights, clarityOfExplanation: parseFloat(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Conciseness, structured delivery, and communication professionalism.
              </p>
            </div>
          </div>
        </div>

        {/* Audio & Voice Mode Settings */}
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-brand-teal" />
            <span>Voice & Audio Mode</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="p-4 rounded-xl bg-navy-850 border border-navy-750 flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Speech-to-Text Microphone</span>
                <span className="text-[11px] text-slate-400">Speak answers directly into the browser.</span>
              </div>
              <input
                type="checkbox"
                checked={enableSTT}
                onChange={e => setEnableSTT(e.target.checked)}
                className="w-4 h-4 accent-brand-teal"
              />
            </label>

            <label className="p-4 rounded-xl bg-navy-850 border border-navy-750 flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Text-to-Speech Interviewer</span>
                <span className="text-[11px] text-slate-400">Read questions and tips aloud via browser voice.</span>
              </div>
              <input
                type="checkbox"
                checked={enableTTS}
                onChange={e => setEnableTTS(e.target.checked)}
                className="w-4 h-4 accent-brand-teal"
              />
            </label>
          </div>
        </div>

        {/* Optional Gemini API Integration */}
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-brand-lightblue">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">
              Optional Google Gemini API Integration
            </h2>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-teal/10 border border-brand-teal/20 text-xs text-brand-lightblue flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-brand-teal-light flex-shrink-0 mt-0.5" />
            <span>
              The application comes with a high-fidelity built-in local rubric evaluation engine that works 100% offline. Providing an API key is completely optional and unlocks real-time conversational follow-ups.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Gemini API Key (Stored securely in local browser storage only)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-navy-950 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-navy-750 focus:outline-none focus:border-brand-teal font-mono"
              />
            </div>
          </div>
        </div>

        {/* Clear Data & Save Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-navy-800">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all recorded interview sessions from local history?')) {
                StorageService.clearSessions();
                window.location.reload();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            Clear All Saved Session Data
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-brand-teal to-brand-lightblue text-navy-950 font-bold text-xs shadow-lg shadow-brand-teal/20 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
