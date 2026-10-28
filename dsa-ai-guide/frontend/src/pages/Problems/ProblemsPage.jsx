import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemsAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, DifficultyBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Code2, Search, Filter, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [probRes, topRes] = await Promise.all([
          problemsAPI.getProblems({
            search,
            topic: selectedTopic,
            difficulty: selectedDifficulty,
            source: selectedSource
          }),
          problemsAPI.getTopics()
        ]);
        setProblems(probRes.data.data);
        setTopics(topRes.data.data);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, selectedTopic, selectedDifficulty, selectedSource]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">DSA Problem Bank</h1>
          <p className="text-xs text-gray-400">
            Curated Striver A2Z Sheet & LeetCode Top 150 categorized by patterns.
          </p>
        </div>
        <Badge variant="brand" size="md">{problems.length} Problems Available</Badge>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-gray-900 border-gray-800 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search problems by name or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Topic Filter */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Topics ({topics.length})</option>
          {topics.map(t => (
            <option key={t.slug} value={t.slug}>{t.name}</option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Source Filter */}
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Sources</option>
          <option value="Striver A2Z">Striver A2Z</option>
          <option value="LeetCode Top 150">LeetCode Top 150</option>
        </select>
      </Card>

      {/* Problems Table / List */}
      {loading ? (
        <LoadingSpinner text="Filtering Problem Repository..." />
      ) : problems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-gray-900 border border-gray-800 text-xs text-gray-400">
          No problems match your current filter parameters.
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((prob) => {
            const isSolved = prob.userStatus === 'Solved';
            const isAttempted = prob.userStatus === 'Attempted';

            return (
              <Card
                key={prob.slug}
                hover
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSolved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : isAttempted
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-gray-950 text-gray-500 border border-gray-800'
                    }`}
                  >
                    {isSolved ? <CheckCircle2 className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/problems/${prob.slug}`}
                        className="text-sm font-bold text-gray-100 hover:text-brand-400 transition"
                      >
                        {prob.title}
                      </Link>
                      {(prob.source === 'Demonstration' || prob.isDemonstration || prob.tags?.includes('demo')) && (
                        <span className="text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          Demonstration / MVP Seed
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-400 font-mono">
                      <DifficultyBadge difficulty={prob.difficulty} />
                      <span className="text-gray-500">•</span>
                      <span className="capitalize">{prob.topicSlug?.replace(/-/g, ' ')}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{prob.source}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <Badge variant={isSolved ? 'easy' : isAttempted ? 'medium' : 'default'} size="sm">
                    {prob.userStatus || 'Not Started'}
                  </Badge>

                  <Link to={`/problems/${prob.slug}`}>
                    <Button size="sm" variant={isSolved ? 'secondary' : 'primary'} className="text-xs">
                      {isSolved ? 'Re-Solve' : 'Solve IDE'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
