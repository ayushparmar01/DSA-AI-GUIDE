import React, { useState } from 'react';
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Lock,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { aiAPI } from '../../api/endpoints';

export const ProgressiveHintDrawer = ({ problemSlug, staticHints = [], onHintUsed }) => {
  const [unlockedLevel, setUnlockedLevel] = useState(0);
  const [loadingLevel, setLoadingLevel] = useState(null);
  const [hintsContent, setHintsContent] = useState({});
  const [openLevel, setOpenLevel] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const hintLevels = [
    { level: 1, name: 'Conceptual Clue', desc: 'High-level intuition & physical problem analogy' },
    { level: 2, name: 'Pattern Identifier', desc: 'Core algorithmic pattern classification & data structures' },
    { level: 3, name: 'Algorithmic Invariant', desc: 'Step-by-step invariant, pointer rules & state transitions' },
    { level: 4, name: 'Pseudo-Code Blueprint', desc: 'Structured language-agnostic logic blueprint' },
    { level: 5, name: 'Optimal Reference Analysis', desc: 'Comprehensive implementation & big-O complexity analysis' }
  ];

  const unlockHint = async (level) => {
    if (level <= unlockedLevel) {
      setOpenLevel(openLevel === level ? null : level);
      return;
    }

    setLoadingLevel(level);
    setErrorMessage(null);

    try {
      // Call backend Socratic hint endpoint which evaluates Python Leakage Guard
      const res = await aiAPI.getHint(problemSlug, { level });
      const hintData = res.data.data;

      setHintsContent(prev => ({
        ...prev,
        [level]: {
          text: hintData.hint,
          wasBlocked: hintData.wasBlocked,
          leakageScore: hintData.leakageScore,
          leakageDetails: hintData.leakageDetails
        }
      }));

      setUnlockedLevel(level);
      setOpenLevel(level);
      if (onHintUsed) onHintUsed(level);
    } catch (err) {
      console.warn('Backend Socratic hint request failed, checking static fallback:', err.message);
      // Fallback to static hint if backend service is unreachable
      const staticH = staticHints.find(h => h.level === level);
      if (staticH) {
        setHintsContent(prev => ({
          ...prev,
          [level]: {
            text: staticH.hintText,
            wasBlocked: false,
            leakageScore: 0.0,
            isFallback: true
          }
        }));
        setUnlockedLevel(level);
        setOpenLevel(level);
        if (onHintUsed) onHintUsed(level);
      } else {
        setErrorMessage(
          err.response?.data?.message ||
            'Unable to generate hint at this time. Please check AI service connectivity.'
        );
      }
    } finally {
      setLoadingLevel(null);
    }
  };

  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
      {/* Drawer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-gray-100">Socratic 5-Stage Progressive Hints</h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          {unlockedLevel} / 5 Unlocked
        </span>
      </div>

      {/* Pedagogical Disclaimer */}
      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 text-[11px] text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <span>
          Try solving independently first! Requesting deeper hints applies a small heuristic penalty (-2H) to topic mastery calculations.
        </span>
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Accordion Stages */}
      <div className="space-y-2 mt-3">
        {hintLevels.map(h => {
          const isUnlocked = h.level <= unlockedLevel;
          const isOpen = openLevel === h.level;
          const isNextToUnlock = h.level === unlockedLevel + 1;
          const hintPayload = hintsContent[h.level];

          return (
            <div
              key={h.level}
              className={`border rounded-lg overflow-hidden transition-all ${
                isUnlocked
                  ? 'border-gray-700 bg-gray-950/80'
                  : 'border-gray-800/80 bg-gray-950/40 opacity-75'
              }`}
            >
              <div
                onClick={() => isUnlocked && setOpenLevel(isOpen ? null : h.level)}
                className={`flex items-center justify-between p-3 select-none ${
                  isUnlocked ? 'cursor-pointer hover:bg-gray-850' : 'cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {h.level}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-200">{h.name}</h4>
                    <p className="text-[10px] text-gray-400">{h.desc}</p>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )
                  ) : isNextToUnlock ? (
                    <Button
                      size="sm"
                      variant="outline"
                      loading={loadingLevel === h.level}
                      onClick={(e) => {
                        e.stopPropagation();
                        unlockHint(h.level);
                      }}
                      className="text-[11px] py-1 px-3"
                    >
                      <Sparkles className="w-3 h-3 mr-1 text-brand-400" /> Reveal Tier {h.level}
                    </Button>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-600" />
                  )}
                </div>
              </div>

              {/* Unlocked Hint Content & Leakage Guard Badging */}
              {isUnlocked && isOpen && (
                <div className="p-3.5 bg-gray-900 border-t border-gray-800 space-y-3">
                  {/* Solution Leakage Guard Status Banner */}
                  {hintPayload?.wasBlocked ? (
                    <div className="p-2.5 bg-rose-950/30 border border-rose-900/40 rounded-lg flex items-start gap-2 text-[11px] text-rose-300">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        <div className="font-bold text-rose-300">
                          Solution Leakage Guard Active (Similarity: {((hintPayload.leakageScore || 0) * 100).toFixed(1)}% &gt; 80% threshold)
                        </div>
                        <p className="text-rose-200/90 mt-0.5">
                          Direct code was withheld to prevent solution spoiler. Conceptual guidance delivered.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pb-1 border-b border-gray-800/60">
                      <span className="flex items-center gap-1 text-emerald-400/90">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Leakage Guard Passed (Similarity: {((hintPayload?.leakageScore || 0) * 100).toFixed(1)}% &le; 80% threshold)
                      </span>
                      <span>Tier {h.level} Socratic Guidance</span>
                    </div>
                  )}

                  {/* Delivered Hint Text */}
                  <div className="text-xs text-gray-200 font-mono whitespace-pre-wrap leading-relaxed bg-gray-950 p-3 rounded-lg border border-gray-800">
                    {hintPayload?.text || 'Loading hint...'}
                  </div>

                  {/* Research Disclosure Footer */}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 italic">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>
                      Syntactic leakage detection verifies token & AST similarity against reference solutions (threshold &tau; = 0.80), but cannot guarantee semantic safety.
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
