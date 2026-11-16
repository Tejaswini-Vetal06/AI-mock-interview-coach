import React from 'react';
import { 
  LayoutDashboard, 
  PlayCircle, 
  Code2, 
  FileText, 
  CalendarRange, 
  Settings as SettingsIcon,
  BrainCircuit,
  Sparkles,
  Award
} from 'lucide-react';
import { JobRole } from '../types';

export type NavigationTab = 
  | 'dashboard' 
  | 'setup' 
  | 'interview' 
  | 'coding' 
  | 'resume' 
  | 'roadmap' 
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeRole: JobRole;
  isInterviewActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  isInterviewActive
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'setup' as NavigationTab, label: 'Interview Setup', icon: PlayCircle },
    { 
      id: 'interview' as NavigationTab, 
      label: 'Live Interview', 
      icon: BrainCircuit,
      badge: isInterviewActive ? 'Active' : undefined 
    },
    { id: 'coding' as NavigationTab, label: 'Coding Practice', icon: Code2 },
    { id: 'resume' as NavigationTab, label: 'Resume & JD Analyzer', icon: FileText },
    { id: 'roadmap' as NavigationTab, label: '7-Day Roadmap', icon: CalendarRange },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-navy-900 border-r border-navy-800 flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      {/* Brand Logo & Header */}
      <div>
        <div className="p-5 border-b border-navy-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-lightblue flex items-center justify-center shadow-lg shadow-brand-teal/20">
            <BrainCircuit className="w-6 h-6 text-navy-950 font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight tracking-tight">AI Coach</h1>
            <p className="text-xs text-brand-lightblue font-medium">Mock Interview System</p>
          </div>
        </div>

        {/* Current Active Role Badge */}
        <div className="mx-4 my-4 p-3 bg-navy-850/80 rounded-xl border border-navy-700/60 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Target Role</span>
            <span className="flex items-center text-brand-teal-accent text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 mr-1" /> Ready
            </span>
          </div>
          <p className="text-sm font-semibold text-white truncate" title={activeRole}>
            {activeRole}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-teal/20 to-brand-lightblue/10 text-white border-l-4 border-brand-teal shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-teal-accent' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Portfolio Badge */}
      <div className="p-4 border-t border-navy-800">
        <div className="p-3 bg-navy-950/60 rounded-xl border border-navy-800 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-brand-lightblue">
            <Award className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200">Portfolio Edition</p>
            <p className="text-[11px] text-slate-400 truncate">Senior AI/ML Coaching</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
