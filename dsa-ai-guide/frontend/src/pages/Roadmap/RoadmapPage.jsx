import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roadmapAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Compass,
  CheckCircle2,
  Lock,
  Sparkles,
  Clock,
  ArrowRight,
  RotateCw,
  GitBranch,
  Info,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';

// Canonical 16-node Prerequisite Graph from ai-service/app/core/roadmap.py
const PREREQUISITE_GRAPH = {
  'complexity-analysis': { name: 'Complexity Analysis', prereqs: [] },
  'arrays': { name: 'Arrays', prereqs: ['complexity-analysis'] },
  'recursion': { name: 'Recursion', prereqs: ['complexity-analysis'] },
  'linked-lists': { name: 'Linked Lists', prereqs: ['arrays'] },
  'stacks': { name: 'Stacks', prereqs: ['arrays'] },
  'queues': { name: 'Queues', prereqs: ['stacks'] },
  'hashing': { name: 'Hashing', prereqs: ['arrays'] },
  'two-pointers': { name: 'Two Pointers', prereqs: ['arrays'] },
  'sliding-window': { name: 'Sliding Window', prereqs: ['arrays', 'two-pointers'] },
  'binary-search': { name: 'Binary Search', prereqs: ['arrays', 'recursion'] },
  'trees': { name: 'Trees', prereqs: ['recursion', 'queues'] },
  'binary-search-trees': { name: 'Binary Search Trees', prereqs: ['trees', 'binary-search'] },
  'heaps': { name: 'Heaps', prereqs: ['trees', 'arrays'] },
  'graphs': { name: 'Graphs', prereqs: ['trees', 'queues', 'hashing'] },
  'dynamic-programming': { name: 'Dynamic Programming', prereqs: ['recursion', 'arrays'] },
  'backtracking': { name: 'Backtracking', prereqs: ['recursion', 'arrays'] }
};

export const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [masteries, setMasteries] = useState({});
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [viewMode, setViewMode] = useState('sequence'); // 'sequence' or 'dag'

  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    setLoading(true);
    try {
      const [rRes, mRes] = await Promise.all([
        roadmapAPI.getRoadmap(),
        roadmapAPI.getMastery().catch(() => ({ data: { data: [] } }))
      ]);

      setRoadmap(rRes.data.data);

      const mMap = {};
      (mRes.data?.data || []).forEach(m => {
        mMap[m.topicSlug] = m.masteryScore;
      });
      setMasteries(mMap);
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await roadmapAPI.regenerate();
      setRoadmap(res.data.data);
    } catch (err) {
      console.error('Regeneration failed:', err);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Computing Kahn Topological Roadmap from Prerequisite DAG..." />;
  if (!roadmap) return <div className="text-center py-20 text-gray-400">No roadmap found.</div>;

  const phases = roadmap.phases || [];
  const completedCount = phases.filter(p => p.status === 'completed').length;
  const overallProgress = phases.length > 0 ? Math.round((completedCount / phases.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-400" />
            <h1 className="text-2xl font-extrabold text-white">Personalized Prerequisite Roadmap</h1>
          </div>
          <p className="text-xs text-gray-400">
            Kahn's topological sort dynamically sequencing topics by lowest mastery priority: priority = (1 - M/100).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-mono text-gray-400">Roadmap Progress</div>
            <div className="text-lg font-bold text-brand-400">{overallProgress}%</div>
          </div>
          <Button size="sm" variant="secondary" onClick={handleRegenerate} loading={regenerating}>
            <RotateCw className="w-3.5 h-3.5 mr-1.5" /> Re-Adapt Roadmap
          </Button>
        </div>
      </div>

      {/* Academic Methodology Callout */}
      <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl space-y-2 text-xs leading-relaxed text-gray-300">
        <div className="flex items-center gap-2 text-brand-400 font-bold">
          <Info className="w-4 h-4" />
          <span>Algorithmic Sequencing Principle (Progress Report 03, Section 11)</span>
        </div>
        <p className="text-gray-400 text-[11px]">
          The roadmap distinguishes between <b>structural prerequisite constraints</b> (directed edges in the 16-node DAG) and the <b>recommended study sequence</b> (topological ordering). At each step, all topics with unsatisfied prerequisites are locked; available nodes are prioritized by lowest mastery score ($1 - M/100$) with alphabetical tie-breaking.
        </p>
      </div>

      {/* View Switcher: Linear Sequence vs DAG Dependencies */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('sequence')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              viewMode === 'sequence'
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Recommended Sequence ({phases.length})
          </button>
          <button
            onClick={() => setViewMode('dag')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              viewMode === 'dag'
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> Prerequisite DAG Dependencies
          </button>
        </div>

        <span className="text-xs text-gray-500 font-mono">
          {completedCount} / {phases.length} Phases Mastered
        </span>
      </div>

      {/* View 1: Kahn Recommended Linear Sequence */}
      {viewMode === 'sequence' && (
        <div className="space-y-4 relative">
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-800 hidden md:block" />

          {phases.map((phase, idx) => {
            const isCompleted = phase.status === 'completed';
            const isActive = phase.status === 'active';
            const isLocked = phase.status === 'locked';

            const dagNode = PREREQUISITE_GRAPH[phase.topicSlug] || { prereqs: [] };
            const prereqs = dagNode.prereqs;

            return (
              <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center gap-6 group">
                {/* Timeline Node Badge */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm z-10 shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20'
                      : isActive
                      ? 'bg-brand-500 text-gray-950 ring-4 ring-brand-400/30 shadow-lg shadow-brand-500/30 scale-105'
                      : 'bg-gray-950 text-gray-500 border border-gray-800'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    phase.phaseNumber
                  )}
                </div>

                {/* Phase Card */}
                <Card
                  className={`flex-1 p-5 transition-all ${
                    isActive
                      ? 'border-brand-500/40 bg-gradient-to-r from-gray-900 via-gray-900 to-brand-950/20 shadow-lg'
                      : isLocked
                      ? 'opacity-65 bg-gray-950/40'
                      : 'hover:border-gray-700 bg-gray-900'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-100">{phase.title}</h3>
                        <Badge variant={isCompleted ? 'easy' : isActive ? 'brand' : 'default'}>
                          {phase.status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Mastery & Hours Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" /> ~{phase.estimatedHours}h
                        </span>
                        <span>
                          Mastery Score:{' '}
                          <b className={phase.masteryScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                            {phase.masteryScore}%
                          </b>
                        </span>
                        <span>
                          Solved:{' '}
                          <b className="text-gray-200">
                            {phase.completedProblemSlugs?.length || 0} / {phase.problemSlugs?.length || 0}
                          </b>
                        </span>
                      </div>

                      {/* Explicit Prerequisite Dependencies Display */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                        <span className="text-gray-500">Prerequisites:</span>
                        {prereqs.length === 0 ? (
                          <span className="text-gray-400 font-mono italic">None (Foundation Root)</span>
                        ) : (
                          prereqs.map((prereqSlug) => {
                            const prereqMastery = masteries[prereqSlug] || 0;
                            const isMet = prereqMastery >= 70 || isCompleted;
                            const pName = PREREQUISITE_GRAPH[prereqSlug]?.name || prereqSlug;

                            return (
                              <span
                                key={prereqSlug}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] ${
                                  isMet
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {isMet ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                {pName} ({prereqMastery}%)
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to={`/problems?topic=${phase.topicSlug}`}>
                        <Button size="sm" variant={isActive ? 'primary' : 'secondary'}>
                          Practice Topic <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Prerequisite DAG Structural Table */}
      {viewMode === 'dag' && (
        <Card className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">16-Node Prerequisite Directed Acyclic Graph</h3>
            <p className="text-xs text-gray-400">
              Structural prerequisite constraints defined in the research paper. A topic cannot be mastered until all in-degree prerequisites are satisfied.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Topic Node</th>
                  <th className="py-2.5 px-3">Direct Prerequisites (In-Degree)</th>
                  <th className="py-2.5 px-3">Your Mastery</th>
                  <th className="py-2.5 px-3">Prerequisites Satisfied?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {Object.entries(PREREQUISITE_GRAPH).map(([slug, node]) => {
                  const currentM = masteries[slug] || 0;
                  const unmetPrereqs = node.prereqs.filter(p => (masteries[p] || 0) < 70);
                  const isAllMet = unmetPrereqs.length === 0;

                  return (
                    <tr key={slug} className="hover:bg-gray-850/50">
                      <td className="py-3 px-3 font-bold text-gray-200">
                        {node.name}
                      </td>
                      <td className="py-3 px-3">
                        {node.prereqs.length === 0 ? (
                          <span className="text-gray-500 italic">None (Root Topic)</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {node.prereqs.map(p => (
                              <span key={p} className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
                                {PREREQUISITE_GRAPH[p]?.name || p}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={currentM >= 70 ? 'text-emerald-400 font-bold' : 'text-gray-300'}>
                          {currentM}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {isAllMet ? (
                          <Badge variant="easy" size="sm">Satisfied</Badge>
                        ) : (
                          <Badge variant="hard" size="sm">{unmetPrereqs.length} Pending</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
