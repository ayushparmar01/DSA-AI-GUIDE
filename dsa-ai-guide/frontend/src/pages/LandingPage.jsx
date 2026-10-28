import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { BinarySearchVisualizer } from '../components/visualizers/BinarySearchVisualizer';
import {
  Sparkles,
  Compass,
  BotMessageSquare,
  RotateCcw,
  BarChart3,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Code2,
  Terminal,
  Zap
} from 'lucide-react';

export const LandingPage = () => {
  const featureList = [
    {
      title: '21-Topic Diagnostic Assessment',
      desc: 'Evaluates your baseline cognitive model, coding speed, and pattern recognition before you start.',
      icon: Compass,
      color: 'text-brand-400 bg-brand-500/10'
    },
    {
      title: 'Dynamic Adaptive Roadmap',
      desc: '18-Phase personalized curriculum that non-linearly adapts based on your mistakes and solve times.',
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10'
    },
    {
      title: '5-Stage Socratic AI Hints',
      desc: 'Progressive clues (Concept -> Pattern -> Approach -> Pseudo-code -> Solution) without spoiling the answer.',
      icon: BotMessageSquare,
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      title: 'AI Code Review & Complexity',
      desc: 'Instant line-by-line big-O analysis, bug detection, unhandled edge cases, and interview readiness scores.',
      icon: Code2,
      color: 'text-purple-400 bg-purple-500/10'
    },
    {
      title: 'SuperMemo SM-2 Spaced Repetition',
      desc: 'Prevents the forgetting curve by scheduling optimal interval revisions for solved problems.',
      icon: RotateCcw,
      color: 'text-rose-400 bg-rose-500/10'
    },
    {
      title: 'AI Mock Technical Interviews',
      desc: 'Interactive interviewer evaluating communication, edge-case analysis, and algorithmic optimality.',
      icon: Terminal,
      color: 'text-cyan-400 bg-cyan-500/10'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Next-Generation AI DSA Mentorship Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Master DSA Patterns. <br />
            <span className="bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
              Guided by Personal AI.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Stop grinding random questions. DSA AI Guide analyzes your mistakes, determines your exact skill level, and continuously synthesizes an adaptive learning roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base font-semibold px-8 py-4 glow-brand">
                Take Diagnostic Assessment <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/problems">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 py-4">
                Explore Problem Bank
              </Button>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">21 Topics</div>
              <div className="text-xs text-gray-400 mt-0.5">Foundations to Advanced DP</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-brand-400">16 Patterns</div>
              <div className="text-xs text-gray-400 mt-0.5">Algorithmic Invariants</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-amber-400">SM-2 Spaced</div>
              <div className="text-xs text-gray-400 mt-0.5">Automated Active Recall</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-indigo-400">0.941 AUC</div>
              <div className="text-xs text-gray-400 mt-0.5">Predictive ML Model</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visualizer Live Teaser */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge variant="brand" className="mb-2">Visual Algorithm Mechanics</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Interactive Visual Learning</h2>
          <p className="text-sm text-gray-400 mt-1">Experience logarithmic time complexity in action with our step-by-step visualizer.</p>
        </div>
        <BinarySearchVisualizer />
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <Badge variant="purple">Architecture & Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Deep Retention</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Not a generic chatbot or static sheet. A fully integrated algorithmic learning OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition-all hover:bg-gray-850/80 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-gray-900 via-brand-950 to-gray-900 border border-brand-500/30 text-center space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to elevate your DSA mastery?</h2>
            <p className="text-gray-300 max-w-xl mx-auto text-sm">
              Take the 15-minute diagnostic assessment today and get your custom AI DSA roadmap.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <Button size="lg" variant="primary" className="font-bold px-8">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
