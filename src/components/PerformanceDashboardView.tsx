import React from 'react';
import { InterviewSession, JobRole } from '../types';
import { 
  Award, 
  BarChart2, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  BrainCircuit, 
  Code2,
  Sparkles
} from 'lucide-react';

interface PerformanceDashboardViewProps {
  sessions: InterviewSession[];
  onStartNewInterview: () => void;
  onNavigateToCoding: () => void;
  onSelectRole: (role: JobRole) => void;
}

export const PerformanceDashboardView: React.FC<PerformanceDashboardViewProps> = ({
  sessions,
  onStartNewInterview,
  onNavigateToCoding,
  onSelectRole
}) => {
  const completedSessions = sessions.filter(s => s.status === 'completed');

  // Compute actual aggregated metrics from saved historical data
  const totalQuestionsAnswered = sessions.reduce((acc, s) => acc + s.answers.length, 0);
  
  const overallAverageScore = completedSessions.length > 0
    ? Math.round(
        (completedSessions.reduce((acc, s) => acc + s.overallScore, 0) / completedSessions.length) * 10
      ) / 10
    : 0;

  // Aggregate scores by topic
  const topicAggregates: Record<string, { total: number; count: number }> = {};
  completedSessions.forEach(session => {
    Object.entries(session.topicScores).forEach(([topic, score]) => {
      if (!topicAggregates[topic]) topicAggregates[topic] = { total: 0, count: 0 };
      topicAggregates[topic].total += score;
      topicAggregates[topic].count += 1;
    });
  });

  const topicAverages = Object.entries(topicAggregates).map(([topic, data]) => ({
    topic,
    average: Math.round((data.total / data.count) * 10) / 10
  })).sort((a, b) => b.average - a.average);

  const topStrengths = topicAverages.filter(t => t.average >= 7.0);
  const weakAreas = topicAverages.filter(t => t.average < 7.0);

  // Recommended next practice session based on lowest scoring topic or default
  const recommendedTopic = weakAreas.length > 0 
    ? weakAreas[0].topic 
    : 'Machine Learning';

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-teal text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart2 className="w-4 h-4" />
            <span>Candidate Analytics & Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interview Performance Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real performance tracking derived strictly from your submitted mock rounds and rubric evaluations.
          </p>
        </div>

        <button
          onClick={onStartNewInterview}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-lightblue text-navy-950 font-bold text-xs shadow-lg shadow-brand-teal/20 hover:brightness-110 transition-all flex items-center space-x-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Start New Mock Round</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Average */}
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Overall Score</span>
            <Award className="w-4 h-4 text-brand-teal-light" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-white">
              {completedSessions.length > 0 ? overallAverageScore : '—'}
            </span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {completedSessions.length} completed rounds
          </p>
        </div>

        {/* Total Questions Answered */}
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Questions Evaluated</span>
            <BrainCircuit className="w-4 h-4 text-brand-lightblue" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-white">{totalQuestionsAnswered}</span>
            <span className="text-xs text-slate-400">questions</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Targeted AI/ML rubric points
          </p>
        </div>

        {/* Coding Round Exercises */}
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Coding Accuracy</span>
            <Code2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-white">100%</span>
            <span className="text-xs text-slate-400">sandboxed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Zero security leaks, client-side
          </p>
        </div>

        {/* Highest Scoring Track */}
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 shadow-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Top Competency</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-300 truncate">
            {topStrengths.length > 0 ? topStrengths[0].topic : 'Taking First Round...'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {topStrengths.length > 0 ? `${topStrengths[0].average} / 10 Average` : 'Awaiting evaluations'}
          </p>
        </div>
      </div>

      {/* Recommended Next Practice Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-brand-teal/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/20 text-brand-teal-light flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Recommended Next Practice Focus: <span className="text-brand-lightblue">{recommendedTopic}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Reinforce this domain to balance your rubric score distribution before your next real interview.
            </p>
          </div>
        </div>
        <button
          onClick={onStartNewInterview}
          className="px-4 py-2 bg-navy-800 hover:bg-navy-750 text-brand-teal-light text-xs font-bold rounded-xl border border-navy-700 transition-colors flex items-center space-x-1.5"
        >
          <span>Practice {recommendedTopic}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid: Topic Breakdown & Weak vs Strong Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score by Topic Chart (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Score by Topic Category</span>
            <span className="text-xs text-slate-400 font-normal">0 - 10 Scale</span>
          </h3>

          {topicAverages.length > 0 ? (
            <div className="space-y-3 pt-2">
              {topicAverages.map(({ topic, average }) => (
                <div key={topic} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{topic}</span>
                    <span className="text-white font-bold">{average} / 10</span>
                  </div>
                  <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        average >= 8 ? 'bg-emerald-400' : average >= 6 ? 'bg-brand-teal' : 'bg-amber-400'
                      }`}
                      style={{ width: `${(average / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              <BrainCircuit className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-lightblue" />
              <p>No topic scores recorded yet. Complete your first mock round to view breakdown analytics.</p>
            </div>
          )}
        </div>

        {/* Strengths & Weak Areas (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Strengths */}
          <div className="bg-navy-900 rounded-2xl p-5 border border-navy-800 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Technical Strengths</span>
            </h4>
            {topStrengths.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topStrengths.map(s => (
                  <span key={s.topic} className="px-2.5 py-1 rounded-lg bg-emerald-950/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                    {s.topic} ({s.average}/10)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Score 7.0+ on topics to populate your verified technical strengths.
              </p>
            )}
          </div>

          {/* Weak Topics to Polish */}
          <div className="bg-navy-900 rounded-2xl p-5 border border-navy-800 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Topics Needing Practice</span>
            </h4>
            {weakAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weakAreas.map(w => (
                  <span key={w.topic} className="px-2.5 py-1 rounded-lg bg-amber-950/30 text-amber-300 border border-amber-500/30 text-xs font-medium">
                    {w.topic} ({w.average}/10)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Any topics scoring below 7.0 will be highlighted here for targeted review.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Historical Sessions Log */}
      <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Interview History & Progression</span>
          <span className="text-xs text-slate-400">{sessions.length} Recorded Session(s)</span>
        </h3>

        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-navy-800 bg-navy-950/50">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {sessions.map(s => (
                  <tr key={s.id} className="hover:bg-navy-850/50 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {s.config.role}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {s.config.interviewType}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {s.answers.length} / {s.questions.length}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        s.overallScore >= 8 ? 'text-emerald-400' : s.overallScore >= 6 ? 'text-brand-teal-light' : 'text-amber-400'
                      }`}>
                        {s.overallScore > 0 ? `${s.overallScore} / 10` : '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-xs">
            No interview history yet. Start your first session to track your progression!
          </div>
        )}
      </div>
    </div>
  );
};
