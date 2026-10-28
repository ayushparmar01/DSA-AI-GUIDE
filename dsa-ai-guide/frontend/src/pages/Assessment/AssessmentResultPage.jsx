import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressRing } from '../../components/common/ProgressRing';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Sparkles, ArrowRight, CheckCircle, AlertOctagon, Brain, Compass, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssessmentResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await assessmentAPI.getResult();
        setResult(res.data.data);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        console.error('Failed to load result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, []);

  if (loading) return <LoadingSpinner text="AI Synthesizing Granular Skill Breakdown..." />;
  if (!result) return <div className="text-center py-20 text-gray-400">Assessment results not found.</div>;

  const scoreCategories = [
    { label: 'Concept Mastery', score: result.conceptScore, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Coding Implementation', score: result.codingScore, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Time & Space Complexity', score: result.complexityScore, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Pattern Recognition', score: result.patternScore, color: 'text-purple-400 bg-purple-500/10' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Diagnostic Evaluation Complete
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Your AI-Synthesized Skill Profile</h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Here is how you benchmark across algorithmic complexity, pattern recognition, and data structure fundamentals.
        </p>
      </div>

      {/* Main Scorecard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Overall Score Ring */}
        <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <ProgressRing percentage={result.overallScore} size={140} strokeWidth={12}>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-white">{result.overallScore}</span>
              <span className="text-[10px] text-gray-400 font-mono uppercase">DSA SCORE</span>
            </div>
          </ProgressRing>
          <div>
            <div className="text-lg font-bold text-gray-100">{result.determinedLevel}</div>
            <p className="text-xs text-gray-400 mt-0.5">Calculated Baseline Placement Level</p>
          </div>
        </Card>

        {/* Middle & Right: Multi-Dimensional Breakdown */}
        <Card className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
          <h3 className="text-base font-bold text-gray-200 flex items-center gap-2">
            <Brain className="w-4 h-4 text-brand-400" /> Multi-Dimensional Cognitive Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scoreCategories.map((cat, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-300">{cat.label}</span>
                  <span className="font-mono font-bold text-white">{cat.score}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: `${cat.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-500" /> Est. Completion: {result.estimatedCompletionWeeks} Weeks
            </span>
            <span className="flex items-center gap-1.5 text-brand-400 font-semibold">
              <Award className="w-4 h-4" /> +150 XP Awarded
            </span>
          </div>
        </Card>
      </div>

      {/* AI Qualitative Rationale */}
      <Card className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-gray-900 via-gray-900 to-brand-950/40 border-brand-500/30">
        <div className="flex items-center gap-2 text-brand-400 text-sm font-bold">
          <Sparkles className="w-4 h-4" /> AI Mentor Pedagogical Rationale
        </div>

        <p className="text-sm text-gray-200 leading-relaxed font-sans">
          {result.aiSummary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Strengths */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" /> Identified Strengths
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.strengths?.map((s, i) => (
                <Badge key={i} variant="easy">{s}</Badge>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertOctagon className="w-3.5 h-3.5" /> Core Weaknesses & Remediation Priorities
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.weaknesses?.map((w, i) => (
                <Badge key={i} variant="hard">{w}</Badge>
              ))}
            </div>
          </div>
        </div>

        {result.aiRecommendationRationale && (
          <div className="p-3.5 bg-gray-950/80 border border-gray-800 rounded-xl text-xs text-gray-300">
            <span className="text-amber-400 font-bold">Next Curriculum Phase: </span>
            {result.aiRecommendationRationale}
          </div>
        )}
      </Card>

      {/* Action CTA */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          variant="primary"
          onClick={() => navigate('/dashboard')}
          className="px-10 py-4 font-bold text-base glow-brand"
        >
          Launch Personalized Dashboard & Roadmap <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
