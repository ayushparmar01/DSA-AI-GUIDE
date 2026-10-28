import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problemsAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, DifficultyBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { BinarySearchVisualizer } from '../../components/visualizers/BinarySearchVisualizer';
import { TwoPointerVisualizer } from '../../components/visualizers/TwoPointerVisualizer';
import { SlidingWindowVisualizer } from '../../components/visualizers/SlidingWindowVisualizer';
import { StackVisualizer } from '../../components/visualizers/StackVisualizer';
import { TreeVisualizer } from '../../components/visualizers/TreeVisualizer';
import { BookOpen, Code2, Sparkles, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

export const TopicDetailPage = () => {
  const { id: topicSlug } = useParams();
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const [topicsRes, problemsRes, patternsRes] = await Promise.all([
          problemsAPI.getTopics(),
          problemsAPI.getProblems({ topic: topicSlug }),
          problemsAPI.getPatterns()
        ]);

        const currentTopic = topicsRes.data.data.find(t => t.slug === topicSlug);
        setTopic(currentTopic);
        setProblems(problemsRes.data.data);
        setPatterns(patternsRes.data.data.filter(p => p.topicSlug === topicSlug));
      } catch (err) {
        console.error('Failed to load topic details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicData();
  }, [topicSlug]);

  if (loading) return <LoadingSpinner text="Loading Topic Curriculum & Visualizers..." />;
  if (!topic) return <div className="text-center py-20 text-gray-400">Topic not found.</div>;

  const renderVisualizer = () => {
    if (topicSlug === 'binary-search') return <BinarySearchVisualizer />;
    if (topicSlug === 'two-pointers') return <TwoPointerVisualizer />;
    if (topicSlug === 'sliding-window') return <SlidingWindowVisualizer />;
    if (topicSlug === 'stack') return <StackVisualizer />;
    if (topicSlug === 'trees' || topicSlug === 'binary-search-tree') return <TreeVisualizer />;
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
      {/* Topic Header Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-gray-900 via-gray-900 to-brand-950/30 border-brand-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="brand">{topic.category}</Badge>
          <span className="text-xs font-mono text-gray-400">Phase Order #{topic.order}</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white">{topic.name}</h1>
        <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
          {topic.description}
        </p>

        {topic.prerequisites?.length > 0 && (
          <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
            <span className="font-semibold text-gray-300">Prerequisites:</span>
            {topic.prerequisites.map((p, i) => (
              <Badge key={i} variant="default" size="sm">{p}</Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Embedded Visualizer (if applicable) */}
      {renderVisualizer() && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" /> Interactive Algorithmic Simulator
          </h2>
          {renderVisualizer()}
        </div>
      )}

      {/* Core Patterns Taught */}
      {patterns.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" /> Core Algorithmic Patterns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map(pat => (
              <Card key={pat.slug} className="p-4 space-y-2 bg-gray-950/70 border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{pat.name}</h3>
                  <Badge variant="purple" size="sm">{pat.timeComplexity}</Badge>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{pat.description}</p>
                <div className="text-[11px] text-brand-400 font-mono pt-1">
                  💡 Invariant: {pat.conceptGuide}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Curated Problem Bank for this Topic */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" /> Topic Practice Problems ({problems.length})
          </h2>
        </div>

        {problems.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-400">
            No specific practice problems mapped yet. Check back shortly.
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map(prob => (
              <Link key={prob.slug} to={`/problems/${prob.slug}`}>
                <Card hover className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-200 group-hover:text-brand-400 transition">
                        {prob.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <DifficultyBadge difficulty={prob.difficulty} />
                        <span className="text-[11px] text-gray-500 font-mono">{prob.source}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={prob.userStatus === 'Solved' ? 'easy' : 'default'} size="sm">
                      {prob.userStatus || 'Not Started'}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
