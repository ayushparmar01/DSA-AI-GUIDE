import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemsAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { BookOpen, Clock, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const TopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await problemsAPI.getTopics();
        setTopics(res.data.data);
      } catch (err) {
        console.error('Failed to load topics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (loading) return <LoadingSpinner text="Loading 21 DSA Topic Catalog..." />;

  // Group by category
  const categories = {};
  topics.forEach(t => {
    if (!categories[t.category]) categories[t.category] = [];
    categories[t.category].push(t);
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">DSA Topic Master Catalog</h1>
        <p className="text-sm text-gray-400">
          Explore all 21 foundational and advanced Data Structures & Algorithmic Paradigms.
        </p>
      </div>

      {Object.entries(categories).map(([catName, catTopics], i) => (
        <div key={i} className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <h2 className="text-lg font-bold text-gray-200">{catName}</h2>
            <Badge variant="default" size="sm">{catTopics.length} Topics</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catTopics.map(topic => (
              <Link key={topic.slug} to={`/topics/${topic.slug}`}>
                <Card hover className="h-full flex flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-brand-400">#{topic.order}</span>
                      <Badge variant="purple" size="sm">{topic.importanceLevel || 'High'}</Badge>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800/80 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{topic.estimatedHours}h
                    </span>
                    <span className="text-brand-400 font-semibold flex items-center gap-1">
                      View Topic <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
