import React from 'react';
import { JobRole, ExperienceLevel, CandidateMode } from '../types';
import { Volume2, VolumeX, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeRole: JobRole;
  experienceLevel: ExperienceLevel;
  candidateMode: CandidateMode;
  onOpenSettings: () => void;
  onQuickStart: () => void;
  isAudioMuted: boolean;
  onToggleAudioMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  experienceLevel,
  candidateMode,
  onOpenSettings,
  onQuickStart,
  isAudioMuted,
  onToggleAudioMute
}) => {
  return (
    <header className="h-16 border-b border-navy-800 bg-navy-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Current Configuration Summary */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-navy-850 px-3 py-1.5 rounded-lg border border-navy-700/60 text-xs">
          <span className="text-slate-400">Role:</span>
          <span className="font-semibold text-white">{activeRole}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 bg-navy-850 px-2.5 py-1.5 rounded-lg border border-navy-700/60 text-xs">
          <UserCheck className="w-3.5 h-3.5 text-brand-teal-light" />
          <span className="text-slate-300 font-medium">{experienceLevel}</span>
          <span className="text-slate-500">•</span>
          <span className="text-brand-lightblue font-medium">{candidateMode}</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        {/* Audio Mute / Unmute Toggle */}
        <button
          onClick={onToggleAudioMute}
          title={isAudioMuted ? 'Voice Coach Muted (Click to Unmute)' : 'Voice Coach Active (Click to Mute)'}
          className={`p-2 rounded-lg border transition-colors ${
            isAudioMuted 
              ? 'bg-navy-850 border-navy-700 text-slate-400 hover:text-white' 
              : 'bg-brand-teal/20 border-brand-teal/40 text-brand-teal-light'
          }`}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Quick Start CTA */}
        <button
          onClick={onQuickStart}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-teal to-brand-lightblue text-navy-950 font-semibold text-xs shadow-md shadow-brand-teal/20 hover:brightness-110 transition-all duration-150"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>New Interview</span>
        </button>
      </div>
    </header>
  );
};
