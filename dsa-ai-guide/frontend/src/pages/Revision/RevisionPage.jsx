import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { revisionAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Brain,
  ArrowRight,
  Calendar,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';

export const RevisionPage = () => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingSlug, setSubmittingSlug] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    fetchRevisions();
  }, []);

  const fetchRevisions = async () => {
    setLoading(true);
    try {
      const res = await revisionAPI.getDue();
      setRevisions(res.data.data || []);
    } catch (err) {
      console.error('Failed to load due revisions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (problemSlug, quality) => {
    setSubmittingSlug(problemSlug);
    try {
      const res = await revisionAPI.submit({
        problemSlug,
        quality,
        timeTakenSeconds: 300
      });

      const updated = res.data.data;
      setFeedback(prev => ({
        ...prev,
        [problemSlug]: {
          quality,
          intervalDays: updated.intervalDays,
          easeFactor: updated.easeFactor,
          nextDueDate: updated.dueDate
        }
      }));

      // Remove from due list after short transition
      setTimeout(() => {
        setRevisions(prev => prev.filter(r => r.problem?.slug !== problemSlug));
      }, 1500);
    } catch (err) {
      console.error('Failed to submit revision rating:', err);
    } finally {
      setSubmittingSlug(null);
    }
  };

  if (loading) return <LoadingSpinner text="Querying SuperMemo SM-2 Spaced Repetition Queue..." />;

  const qualityOptions = [
    { rating: 0, label: '0 - Blackout', desc: 'Complete blackout; reset interval to 1 day', color: 'hover:bg-rose-500/20 text-rose-400' },
    { rating: 2, label: '2 - Wrong Approach', desc: 'Incorrect approach recalled', color: 'hover:bg-rose-500/20 text-rose-400' },
    { rating: 3, label: '3 - Recalled with Hints', desc: 'Remembered with significant difficulty', color: 'hover:bg-amber-500/20 text-amber-400' },
    { rating: 4, label: '4 - Good Recall', desc: 'Correct approach with minor hesitation', color: 'hover:bg-blue-500/20 text-blue-400' },
    { rating: 5, label: '5 - Perfect Recall', desc: 'Instant recall of optimal algorithm & big-O', color: 'hover:bg-emerald-500/20 text-emerald-400' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white">Spaced Repetition & Revision Center</h1>
          </div>
          <p className="text-xs text-gray-400">
            SuperMemo SM-2 active recall scheduling preventing cognitive decay along the Ebbinghaus forgetting curve.
          </p>
        </div>
        <Badge variant={revisions.length > 0 ? 'medium' : 'easy'}>
          {revisions.length} Due Today
        </Badge>
      </div>

      {/* SM-2 Academic Disclaimer */}
      <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl space-y-1.5 text-xs text-gray-400">
        <div className="flex items-center gap-1.5 font-bold text-gray-200">
          <Brain className="w-4 h-4 text-brand-400" />
          Canonical SuperMemo SM-2 Engine
        </div>
        <p className="text-[11px] leading-relaxed">
          Intervals and ease factors are computed strictly by the backend microservice: for recall quality $q \ge 3$, intervals expand as $I(1)=1, I(2)=6, I(n) = \lceil I(n-1) \times EF \rceil$ with minimum $EF \ge 1.30$. For $q &lt; 3$, interval resets to 1 day. No conflicting math runs in the browser.
        </p>
      </div>

      {/* Due Problems Queue */}
      {revisions.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-100">All Today's Revisions Complete! 🎉</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            You have no pending SM-2 revision tasks due right now. Solved problems are automatically scheduled for spaced recall (1 day after first solve, expanding to 6 days upon success).
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/problems">
              <Button variant="primary">Practice New Problems</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {revisions.map((item, idx) => {
            const { problem, schedule } = item;
            const probSlug = problem?.slug || schedule.problemSlug;
            const probTitle = problem?.title || probSlug.replace(/-/g, ' ');
            const currentFeedback = feedback[probSlug];

            return (
              <Card key={idx} className="p-6 space-y-4 border-gray-800 bg-gray-900/90">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                      #{schedule.repetitionNumber || 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white capitalize">{probTitle}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono mt-0.5">
                        <span className="capitalize">Topic: {schedule.topicSlug?.replace(/-/g, ' ')}</span>
                        <span>•</span>
                        <span>Ease Factor: <b className="text-gray-200">{schedule.easeFactor?.toFixed(2) || '2.50'}</b></span>
                        <span>•</span>
                        <span>Current Interval: <b className="text-gray-200">{schedule.intervalDays || 1}d</b></span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/problems/${probSlug}`}>
                    <Button size="sm" variant="secondary" className="text-xs">
                      Re-Solve in IDE <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>

                {/* Feedback Toast if just rated */}
                {currentFeedback ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-fade-in font-mono">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>
                      Revision logged! Next repetition scheduled in <b>{currentFeedback.intervalDays} days</b> (New Ease Factor: {currentFeedback.easeFactor?.toFixed(2)}).
                    </span>
                  </div>
                ) : (
                  /* Self-Rating SM-2 Quality Buttons */
                  <div className="pt-2 border-t border-gray-800">
                    <div className="text-xs font-semibold text-gray-400 mb-2.5 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                      Rate Recall Quality (q &isin; [0, 5]) to advance SM-2 interval:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {qualityOptions.map(opt => (
                        <button
                          key={opt.rating}
                          disabled={submittingSlug === probSlug}
                          onClick={() => handleRate(probSlug, opt.rating)}
                          className={`p-2.5 rounded-xl border border-gray-800 bg-gray-950 text-left transition disabled:opacity-50 ${opt.color}`}
                        >
                          <div className="text-xs font-bold">{opt.label}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
