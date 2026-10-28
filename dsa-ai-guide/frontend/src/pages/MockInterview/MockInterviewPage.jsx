import React, { useState } from 'react';
import { interviewAPI } from '../../api/endpoints';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Mic, Send, Bot, User, Award, CheckCircle2, AlertOctagon, Terminal, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MockInterviewPage = () => {
  const [interviewId, setInterviewId] = useState(null);
  const [problem, setProblem] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scorecard, setScorecard] = useState(null);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.start({ topicSlug: 'two-pointers' });
      const { interviewId: id, problem: prob, transcript: trans } = res.data.data;
      setInterviewId(id);
      setProblem(prob);
      setTranscript(trans);
      setIsCompleted(false);
      setScorecard(null);
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (isFinish = false) => {
    if (!inputText.trim() && !isFinish) return;

    setLoading(true);
    try {
      const res = await interviewAPI.respond(interviewId, {
        message: inputText || 'I have completed my explanation and would like to conclude the interview.',
        isFinishRequest: isFinish
      });

      if (isFinish) {
        setIsCompleted(true);
        setScorecard(res.data.data);
        confetti({ particleCount: 80, spread: 70 });
      } else {
        setTranscript(res.data.data.transcript);
        setInputText('');
      }
    } catch (err) {
      console.error('Interview turn failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-400" />
            <h1 className="text-2xl font-extrabold text-white">AI Technical Mock Interview</h1>
          </div>
          <p className="text-xs text-gray-400">
            Interactive interview simulator grading problem clarification, approach optimality, and communication.
          </p>
        </div>

        {!interviewId ? (
          <Button variant="primary" onClick={startInterview} loading={loading} className="font-bold">
            <Mic className="w-4 h-4 mr-1.5" /> Start New Interview
          </Button>
        ) : (
          <Button variant="danger" size="sm" onClick={() => handleRespond(true)} loading={loading}>
            Finish & Generate Scorecard
          </Button>
        )}
      </div>

      {!interviewId ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
            <Mic className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Simulate a Real SWE Interview</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            The AI acts as an interviewer at a top tech company. Discuss edge cases, formulate your algorithm, and explain time/space trade-offs.
          </p>
          <div className="pt-2">
            <Button size="lg" variant="primary" onClick={startInterview} loading={loading} className="px-8 font-bold">
              Begin Interview Simulation
            </Button>
          </div>
        </Card>
      ) : isCompleted && scorecard ? (
        /* Final Scorecard View */
        <div className="space-y-6 animate-fade-in">
          <Card className="p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-brand-950/40 border-brand-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="brand">Evaluation Complete</Badge>
              <span className="text-2xl font-extrabold text-brand-400">
                Score: {scorecard.scores?.overallInterviewScore || 82} / 100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Problem Understanding', score: scorecard.scores?.problemUnderstanding || 85 },
                { label: 'Approach Optimality', score: scorecard.scores?.approachOptimality || 80 },
                { label: 'Coding Proficiency', score: scorecard.scores?.codingProficiency || 82 },
                { label: 'Complexity Analysis', score: scorecard.scores?.complexityExplanation || 88 },
                { label: 'Communication', score: scorecard.scores?.communicationClarity || 85 }
              ].map((rubric, idx) => (
                <div key={idx} className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-center space-y-1">
                  <span className="text-[10px] text-gray-400 block leading-tight">{rubric.label}</span>
                  <span className="text-base font-bold text-white font-mono">{rubric.score}%</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-gray-200">Interviewer Review & Feedback:</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {scorecard.interviewerFeedback?.detailedReview || 'Great communication throughout the session.'}
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="primary" onClick={startInterview}>
                Practice Another Problem
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* Live Interview Dialogue */
        <div className="space-y-4">
          <Card className="p-4 bg-gray-900/90 border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Problem:</span>
              <span className="text-sm font-bold text-white">{problem?.title}</span>
            </div>
            <Badge variant="purple">Live Session</Badge>
          </Card>

          <Card className="h-[420px] overflow-y-auto p-6 space-y-4 bg-gray-950/60 border-gray-800">
            {transcript.map((t, idx) => {
              const isAi = t.speaker === 'ai';
              return (
                <div key={idx} className={`flex items-start gap-3 ${!isAi ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isAi ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none'
                        : 'bg-brand-500/15 border border-brand-500/30 text-white rounded-tr-none'
                    }`}
                  >
                    {t.message}
                  </div>
                </div>
              );
            })}
          </Card>

          <div className="flex items-center gap-2 p-2 bg-gray-900 border border-gray-800 rounded-2xl">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRespond(false)}
              placeholder="Explain your approach, ask clarifying questions, or discuss time complexity..."
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
            />
            <Button variant="primary" onClick={() => handleRespond(false)} loading={loading} className="rounded-xl px-4">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
