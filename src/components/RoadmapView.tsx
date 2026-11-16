import React, { useState, useEffect } from 'react';
import { RoadmapDay, JobRole } from '../types';
import { StorageService } from '../services/storageService';
import { 
  CalendarRange, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface RoadmapViewProps {
  activeRole: JobRole;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ activeRole }) => {
  const [roadmap, setRoadmap] = useState<RoadmapDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    let current = StorageService.getRoadmap();
    if (current.length === 0) {
      // Generate default roadmap for current active role
      const dummySession: any = {
        config: { role: activeRole },
        weakTopics: ['Machine Learning', 'SQL & Data Handling'],
        strongTopics: ['Python']
      };
      current = StorageService.generateRoadmapForSession(dummySession);
    }
    setRoadmap(current);
  }, [activeRole]);

  const handleToggleTask = (dayNum: number, taskId: string) => {
    const updated = StorageService.toggleRoadmapTask(dayNum, taskId);
    setRoadmap([...updated]);
  };

  // Calculate completion percentage
  const totalTasks = roadmap.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = roadmap.reduce(
    (acc, d) => acc + d.tasks.filter(t => t.completed).length,
    0
  );
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeDayPlan = roadmap.find(d => d.day === selectedDay) || roadmap[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header & Overall Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-teal text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarRange className="w-4 h-4" />
            <span>Structured Interview Readiness Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized 7-Day Interview Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeted for <span className="text-white font-semibold">{activeRole}</span> based on rubric scores and detected knowledge gaps.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4 flex items-center space-x-4 shadow-xl">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-navy-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-teal"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{completionPercentage}%</span>
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Readiness Progress</span>
            <span className="text-[11px] text-slate-400">
              {completedTasks} of {totalTasks} milestones achieved
            </span>
          </div>
        </div>
      </div>

      {/* 7 Days Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {roadmap.map(d => {
          const isSelected = d.day === selectedDay;
          const dayCompleted = d.tasks.length > 0 && d.tasks.every(t => t.completed);

          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-navy-850 to-navy-900 border-brand-teal shadow-lg shadow-brand-teal/10 ring-2 ring-brand-teal/40'
                  : 'bg-navy-900/90 border-navy-800 hover:border-navy-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-black ${isSelected ? 'text-brand-teal-light' : 'text-slate-400'}`}>
                  DAY {d.day}
                </span>
                {dayCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[11px] font-semibold text-white line-clamp-1">
                {d.title.split(' ')[0]} {d.title.split(' ')[1]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail Card */}
      {activeDayPlan && (
        <div className="bg-navy-900 rounded-2xl p-6 sm:p-8 border border-navy-800 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-navy-800">
            <div>
              <span className="text-xs font-bold text-brand-teal-light uppercase tracking-wider">
                Day {activeDayPlan.day} Curriculum
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {activeDayPlan.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeDayPlan.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeDayPlan.topics.map((topic, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-navy-800 text-brand-lightblue border border-navy-700 text-xs font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Actionable Milestones & Checkboxes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Actionable Study Milestones (Check off as you complete)
            </h3>

            <div className="space-y-2.5">
              {activeDayPlan.tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(activeDayPlan.day, task.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    task.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                      : 'bg-navy-850 border-navy-750 hover:border-navy-600 text-white'
                  }`}
                >
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-brand-teal" />
                    )}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                    <span className={task.completed ? 'line-through text-slate-400' : ''}>
                      {task.task}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Questions to Master */}
          <div className="p-5 rounded-xl bg-navy-950 border border-navy-800 space-y-3">
            <h4 className="text-xs font-bold text-brand-lightblue flex items-center space-x-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Key Interview Questions to Master for Day {activeDayPlan.day}</span>
            </h4>

            <div className="space-y-2">
              {activeDayPlan.keyQuestionsToReview.map((q, i) => (
                <div key={i} className="text-xs text-slate-200 p-3 rounded-lg bg-navy-900 border border-navy-850 flex items-start space-x-2">
                  <span className="text-brand-teal-light font-bold">Q{i + 1}.</span>
                  <span className="leading-relaxed">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
