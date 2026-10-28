import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problemsAPI, aiAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, DifficultyBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { CodeEditor } from '../../components/editor/CodeEditor';
import { TestRunnerPanel } from '../../components/editor/TestRunnerPanel';
import { ProgressiveHintDrawer } from '../../components/hints/ProgressiveHintDrawer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Play,
  Send,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Award,
  BookOpen,
  ArrowLeft,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProblemDetailPage = () => {
  const { slug } = useParams();
  const [problemData, setProblemData] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [execResult, setExecResult] = useState(null);
  const [hintsCount, setHintsCount] = useState(0);

  // AI Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [aiReviewData, setAiReviewData] = useState(null);
  const [analyzingCode, setAnalyzingCode] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await problemsAPI.getBySlug(slug);
        const p = res.data.data.problem;
        setProblemData(res.data.data);
        // Set starter code for default language
        setCode(p.starterCode?.[language] || '// Write your solution here');
      } catch (err) {
        console.error('Failed to load problem:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [slug]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problemData?.problem?.starterCode?.[newLang]) {
      setCode(problemData.problem.starterCode[newLang]);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setExecResult(null);
    try {
      const res = await problemsAPI.runCode(slug, { code, language });
      setExecResult(res.data.data);
    } catch (err) {
      console.error('Run failed:', err);
      setExecResult({
        status: 'Service Error',
        isAvailable: false,
        message: err.response?.data?.message || err.message || 'Judge0 execution sandbox connection failed.'
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setExecResult(null);
    try {
      const res = await problemsAPI.submit(slug, {
        code,
        language,
        hintsUsedCount: hintsCount,
        timeTakenSeconds: 300
      });

      const { execution, attempt, mastery } = res.data.data;
      setExecResult({
        ...execution,
        complexityAnalysis: attempt?.complexityAnalysis,
        mastery
      });

      if (execution.status === 'Accepted') {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }

      if (attempt?.complexityAnalysis) {
        setAiReviewData({
          patternDetected: problemData?.problem?.patternSlug || 'Algorithmic Structure',
          timeComplexity: attempt.complexityAnalysis.complexity,
          abstained: attempt.complexityAnalysis.abstained,
          confidence: attempt.complexityAnalysis.confidence,
          critique: attempt.complexityAnalysis.explanation,
          rulesTriggered: attempt.complexityAnalysis.rules_triggered
        });
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setExecResult({
        status: 'Service Error',
        isAvailable: false,
        message: err.response?.data?.message || err.message || 'Submission evaluation failed.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAIAnalyze = async () => {
    setAnalyzingCode(true);
    setReviewModalOpen(true);
    try {
      const res = await aiAPI.analyzeComplexity({ code, version: 'v1' });
      const comp = res.data.data;
      setAiReviewData({
        patternDetected: problemData?.problem?.patternSlug || 'Algorithmic Pattern',
        timeComplexity: comp.complexity,
        abstained: comp.abstained,
        confidence: comp.confidence,
        critique: comp.explanation,
        rulesTriggered: comp.rules_triggered || []
      });
    } catch (err) {
      console.error('AST Complexity analysis failed:', err);
      setAiReviewData({
        patternDetected: 'Analysis Unavailable',
        timeComplexity: 'N/A',
        abstained: true,
        confidence: 0,
        critique: 'FastAPI microservice unreachable or returned error: ' + (err.response?.data?.message || err.message)
      });
    } finally {
      setAnalyzingCode(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading IDE Workspace & Test Harness..." />;
  if (!problemData) return <div className="text-center py-20 text-gray-400">Problem not found.</div>;

  const { problem, userStatus } = problemData;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link to="/problems">
            <Button size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
          <Badge variant="brand" size="sm">{problem.topicSlug?.replace(/-/g, ' ')}</Badge>
          {(problem.source === 'Demonstration' || problem.isDemonstration || problem.tags?.includes('demo')) && (
            <Badge variant="warning" size="sm">Demonstration / MVP Seed</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="accent" onClick={handleAIAnalyze}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Code Review
          </Button>
        </div>
      </div>

      {/* Main IDE Layout: Left (Problem Statement), Right (Editor & Test Runner & Hints) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1">
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Problem Description</h3>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>

            {/* Constraints */}
            {problem.constraints?.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Constraints</h4>
                <ul className="list-disc list-inside text-xs text-gray-300 font-mono space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expected Complexities */}
            <div className="flex items-center gap-4 pt-2 text-xs font-mono text-gray-400 border-t border-gray-800">
              <span>Optimal Time: <b className="text-emerald-400">{problem.optimalTimeComplexity}</b></span>
              <span>Optimal Space: <b className="text-emerald-400">{problem.optimalSpaceComplexity}</b></span>
            </div>
          </Card>

          {/* Progressive Hint Drawer Component */}
          <ProgressiveHintDrawer
            problemSlug={problem.slug}
            staticHints={problem.hints || []}
            onHintUsed={(lvl) => setHintsCount(Math.max(hintsCount, lvl))}
          />
        </div>

        {/* Right Column: Code Editor & Execution Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <CodeEditor
            code={code}
            onChange={(val) => setCode(val || '')}
            language={language}
            onLanguageChange={handleLanguageChange}
            height="440px"
          />

          {/* Action Button Bar */}
          <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded-xl">
            <span className="text-xs text-gray-400 font-mono">
              Status: <b className="text-gray-200">{userStatus}</b>
            </span>

            <div className="flex items-center gap-3">
              <Button
                size="md"
                variant="secondary"
                loading={running}
                onClick={handleRun}
                className="font-semibold"
              >
                <Play className="w-4 h-4 mr-1.5 text-brand-400" /> Run Tests
              </Button>

              <Button
                size="md"
                variant="primary"
                loading={submitting}
                onClick={handleSubmit}
                className="font-bold px-6 glow-brand"
              >
                <Send className="w-4 h-4 mr-1.5" /> Submit Solution
              </Button>
            </div>
          </div>

          {/* Test Runner Output Panel */}
          <TestRunnerPanel
            executionResult={execResult}
            sampleTestCases={problem.sampleTestCases || []}
            complexityAnalysis={execResult?.complexityAnalysis}
            masteryUpdate={execResult?.mastery}
            hintsUsedCount={hintsCount}
            previousAttemptsCount={problemData.submissions?.length || 0}
          />
        </div>
      </div>

      {/* AI Code Review & Static Analysis Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="AST Static Complexity Analysis & Pedagogical Review"
      >
        {analyzingCode ? (
          <LoadingSpinner text="Analyzing abstract syntax tree (AST) patterns and recurrence depth..." />
        ) : aiReviewData ? (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="flex items-center justify-between p-3 bg-gray-950 rounded-xl border border-gray-800">
              <div>
                <span className="text-gray-400">Detected Pattern: </span>
                <span className="text-brand-400 font-bold">{aiReviewData.patternDetected || 'Algorithmic Pattern'}</span>
              </div>
              <div className="flex gap-2">
                {aiReviewData.abstained ? (
                  <Badge variant="medium">Heuristic Abstained</Badge>
                ) : (
                  <Badge variant="brand">Time: {aiReviewData.timeComplexity}</Badge>
                )}
                {aiReviewData.confidence > 0 && (
                  <Badge variant="purple">Confidence: {Math.round(aiReviewData.confidence * 100)}%</Badge>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
              <h4 className="font-bold text-gray-200 text-sm flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-brand-400" /> AST Parser Diagnostics & Explanation
              </h4>
              <p className="text-gray-300 whitespace-pre-line">{aiReviewData.critique}</p>
            </div>

            {aiReviewData.rulesTriggered?.length > 0 && (
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-1">
                <h4 className="font-bold text-indigo-300">Parser Rules Evaluated:</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aiReviewData.rulesTriggered.map((rule, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-indigo-900/40 text-indigo-200 rounded font-mono text-[10px]">
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-gray-400 text-[11px]">
              <span className="text-amber-400 font-semibold">Note:</span> Complexity estimation is performed by a deterministic AST pattern matching heuristic. When non-linear loop boundaries or dynamic recurrences are detected, the analyzer explicitly abstains.
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setReviewModalOpen(false)}>
                Close Review
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">No review data available.</div>
        )}
      </Modal>
    </div>
  );
};
