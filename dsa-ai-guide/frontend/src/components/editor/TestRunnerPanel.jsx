import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  AlertTriangle,
  ServerCrash,
  Code2,
  FileCode,
  Sparkles,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const TestRunnerPanel = ({
  executionResult,
  sampleTestCases = [],
  complexityAnalysis,
  masteryUpdate,
  hintsUsedCount = 0,
  previousAttemptsCount = 0
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // If no execution yet, display problem sample test cases
  if (!executionResult) {
    return (
      <div className="p-4 bg-gray-900/80 border border-gray-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sample Test Cases ({sampleTestCases.length})
          </h4>
          <span className="text-[11px] text-gray-500 font-mono">
            {previousAttemptsCount} Previous Attempt{previousAttemptsCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex gap-2">
          {sampleTestCases.map((tc, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                activeTab === idx
                  ? 'bg-gray-800 text-gray-100 border border-gray-700'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Case {idx + 1}
            </button>
          ))}
        </div>

        {sampleTestCases[activeTab] && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-gray-400 block mb-1">Input:</span>
              <span className="text-gray-200 select-all">{sampleTestCases[activeTab].input}</span>
            </div>
            <div className="p-2.5 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-gray-400 block mb-1">Expected Output:</span>
              <span className="text-brand-400 select-all">{sampleTestCases[activeTab].output}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isAccepted = executionResult.status === 'Accepted';
  const isSandboxDown = executionResult.isAvailable === false || executionResult.status === 'Service Error';
  const isCompileError = executionResult.status === 'Compilation Error';
  const isTLE = executionResult.status === 'Time Limit Exceeded';

  const compAnalysis = complexityAnalysis || executionResult.complexityAnalysis;
  const mastery = masteryUpdate || executionResult.mastery;

  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
      {/* Sandbox Offline Honest Status Banner */}
      {isSandboxDown && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200">
          <ServerCrash className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300">Isolated Judge0 Sandbox Offline</div>
            <p className="text-amber-200/90 leading-relaxed">
              {executionResult.message ||
                'Judge0 sandbox is unreachable at http://localhost:2358. In compliance with security principles, user code is never evaluated with local shell exec() or eval().'}
            </p>
          </div>
        </div>
      )}

      {/* Execution Result Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {isAccepted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isSandboxDown ? (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400" />
          )}
          <span
            className={`text-base font-bold ${
              isAccepted
                ? 'text-emerald-400'
                : isSandboxDown
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {executionResult.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            {executionResult.runtimeMs || 0} ms
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {Math.round((executionResult.memoryKb || 0) / 1024)} MB
          </span>
          <Badge variant={isAccepted ? 'easy' : 'hard'}>
            {executionResult.testCasesPassed || 0} / {executionResult.totalTestCases || 0} Passed
          </Badge>
          {hintsUsedCount > 0 && (
            <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {hintsUsedCount} Hint{hintsUsedCount === 1 ? '' : 's'} Used
            </span>
          )}
        </div>
      </div>

      {/* Compilation Error or Runtime Stderr Output */}
      {(executionResult.compileOutput || executionResult.error || executionResult.stderr) && (
        <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-400">
            <FileCode className="w-4 h-4" />
            <span>Diagnostics & Compiler Output:</span>
          </div>
          <pre className="p-2.5 bg-gray-950 rounded-lg text-rose-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {executionResult.compileOutput || executionResult.stderr || executionResult.error}
          </pre>
        </div>
      )}

      {/* Test Cases Results Breakdown */}
      {executionResult.results && executionResult.results.length > 0 && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {executionResult.results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  activeTab === idx
                    ? 'bg-gray-800 text-gray-100 border border-gray-700'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    res.passed ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                Case {idx + 1}
              </button>
            ))}
          </div>

          {executionResult.results[activeTab] && (
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-gray-950 rounded-lg border border-gray-800">
                <span className="text-gray-400 block mb-1">Input:</span>
                <span className="text-gray-200 select-all">
                  {executionResult.results[activeTab].input}
                </span>
              </div>
              <div className="p-2.5 bg-gray-950 rounded-lg border border-gray-800">
                <span className="text-gray-400 block mb-1">Expected Output:</span>
                <span className="text-emerald-400 select-all">
                  {executionResult.results[activeTab].expectedOutput}
                </span>
              </div>
              <div className="p-2.5 bg-gray-950 rounded-lg border border-gray-800">
                <span className="text-gray-400 block mb-1">Your Output:</span>
                <span
                  className={`select-all ${
                    executionResult.results[activeTab].passed
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {executionResult.results[activeTab].actualOutput || '<No output returned>'}
                </span>
              </div>
              {executionResult.results[activeTab].error && (
                <div className="p-2.5 bg-rose-950/20 rounded-lg border border-rose-900/40 text-rose-300">
                  <span className="text-rose-400 font-bold block mb-1">Error:</span>
                  <span>{executionResult.results[activeTab].error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AST Static Complexity Analysis Card */}
      {compAnalysis && (
        <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-gray-200">
              <Code2 className="w-4 h-4 text-brand-400" />
              AST Complexity Analysis
            </span>
            {compAnalysis.abstained ? (
              <Badge variant="medium">Heuristic Abstained</Badge>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="brand">{compAnalysis.complexity}</Badge>
                <span className="text-[11px] text-gray-400 font-mono">
                  {Math.round((compAnalysis.confidence || 0) * 100)}% Confidence
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            {compAnalysis.abstained
              ? 'AST heuristic detected ambiguous control-flow patterns or non-linear recursion and returned an explicit abstention rather than an unreliable estimate.'
              : compAnalysis.explanation ||
                `Static AST pattern-matching classified loop nesting and recurrence depth as ${compAnalysis.complexity}.`}
          </p>
        </div>
      )}

      {/* Deterministic Mastery Delta Card */}
      {mastery && (
        <div className="p-3.5 bg-brand-950/20 border border-brand-500/20 rounded-xl flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-brand-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Topic Mastery Updated
            </div>
            <div className="text-[11px] text-gray-400 font-mono">
              Formula: M' = clamp(M + 8R - 2H + 3E - T, 0, 100)
              {mastery.timePenalty > 0 && ` (Time penalty: -${mastery.timePenalty})`}
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-sm font-bold font-mono ${
                mastery.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {mastery.delta >= 0 ? `+${mastery.delta}` : mastery.delta} pts
            </div>
            <div className="text-[11px] text-gray-400">
              Score: <b className="text-white">{mastery.newScore}</b> / 100
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
