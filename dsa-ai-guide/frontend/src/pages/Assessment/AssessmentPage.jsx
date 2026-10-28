import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Clock, CheckCircle2, ChevronRight, ChevronLeft, Send, Sparkles } from 'lucide-react';

export const AssessmentPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await assessmentAPI.getQuestions();
        setQuestions(res.data.data);
      } catch (err) {
        console.error('Failed to load assessment:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const selectOption = (optionIndex) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentIndex]._id]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = Object.entries(responses).map(([qId, optIdx]) => ({
        questionId: qId,
        selectedOptionIndex: optIdx,
        timeTakenSeconds: 30
      }));

      await assessmentAPI.submit({ responses: payload });
      navigate('/assessment/result');
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Synthesizing 21-Topic Diagnostic Test Bank..." />;
  if (questions.length === 0) return <div className="text-center py-20 text-gray-400">No questions available.</div>;

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(responses).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Top Header & Timer Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Diagnostic DSA Assessment</h2>
            <p className="text-[11px] text-gray-400">
              Question {currentIndex + 1} of {questions.length} • {answeredCount} answered
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-amber-400 font-mono text-sm font-bold">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Badge variant="brand">{currentQ.topicSlug.replace(/-/g, ' ').toUpperCase()}</Badge>
          <Badge variant="purple">{currentQ.type.replace('_', ' ').toUpperCase()}</Badge>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-gray-100 leading-relaxed">
          {currentQ.question}
        </h3>

        {currentQ.codeSnippet && (
          <pre className="p-4 bg-gray-950 border border-gray-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">
            <code>{currentQ.codeSnippet}</code>
          </pre>
        )}

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options?.map((opt, idx) => {
            const isSelected = responses[currentQ._id] === idx;
            return (
              <div
                key={idx}
                onClick={() => selectOption(idx)}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-brand-500/15 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                    : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:border-gray-700 hover:bg-gray-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      isSelected
                        ? 'bg-brand-500 text-gray-950'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm font-medium">{opt.text}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-400" />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Navigation & Submit Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button
            variant="primary"
            onClick={() => setCurrentIndex(prev => prev + 1)}
          >
            Next Question <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            variant="accent"
            loading={submitting}
            onClick={handleSubmit}
            className="px-6 font-bold"
          >
            Submit Assessment <Send className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
