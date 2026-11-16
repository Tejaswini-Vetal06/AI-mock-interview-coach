import React from 'react';
import { RoleDefinition } from '../data/roles';
import { 
  BrainCircuit, 
  Cpu, 
  LineChart, 
  BarChart3, 
  Sparkles, 
  Layers, 
  Eye, 
  MessageSquareCode, 
  Boxes, 
  GraduationCap, 
  Terminal,
  Check
} from 'lucide-react';

interface RoleCardProps {
  role: RoleDefinition;
  isSelected: boolean;
  onSelect: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BrainCircuit,
  Cpu,
  LineChart,
  BarChart3,
  Sparkles,
  Layers,
  Eye,
  MessageSquareCode,
  Boxes,
  GraduationCap,
  Terminal
};

export const RoleCard: React.FC<RoleCardProps> = ({ role, isSelected, onSelect }) => {
  const IconComponent = ICON_MAP[role.icon] || BrainCircuit;

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative group flex flex-col justify-between ${
        isSelected
          ? 'bg-gradient-to-b from-navy-800 to-navy-850 border-brand-teal shadow-lg shadow-brand-teal/10 ring-2 ring-brand-teal/30'
          : 'bg-navy-900/90 border-navy-800 hover:border-navy-700 hover:bg-navy-850/80'
      }`}
    >
      {/* Selection indicator pill */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center shadow">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      )}

      <div>
        <div className="flex items-center space-x-3 mb-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/30'
                : 'bg-navy-800 text-brand-lightblue group-hover:bg-navy-700'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug tracking-tight">
            {role.title}
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
          {role.shortDesc}
        </p>
      </div>

      <div>
        {/* Key skills tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-navy-800/80">
          {role.keySkills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-navy-800 text-slate-300 border border-navy-700/50"
            >
              {skill}
            </span>
          ))}
          {role.keySkills.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{role.keySkills.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
