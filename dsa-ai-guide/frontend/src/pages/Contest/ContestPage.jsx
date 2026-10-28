import React, { useState, useEffect } from 'react';
import { contestAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Trophy, Clock, Users, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export const ContestPage = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await contestAPI.getContests();
        setContests(res.data.data);
      } catch (err) {
        console.error('Failed to load contests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Weekly Contest Schedules & Leaderboards..." />;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between p-6 bg-gray-900 border border-gray-800 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white">Weekly Algorithmic Contests</h1>
          </div>
          <p className="text-xs text-gray-400">
            Timed 5-problem sprints simulating online coding assessments with live penalty leaderboards.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {contests.map((contest) => (
          <Card key={contest._id} className="p-6 space-y-4 bg-gray-900/90 border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{contest.title}</h3>
                  <Badge variant="brand">LIVE</Badge>
                </div>
                <p className="text-xs text-gray-400 max-w-xl">{contest.description}</p>
              </div>

              <Button variant="primary" className="font-bold shrink-0">
                Enter Contest Arena <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-3 border-t border-gray-800 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" /> Duration: {contest.durationMinutes}m
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-500" /> {contest.leaderboard?.length || 1} Participants
              </span>
              <span>Problems: {contest.problemSlugs?.length || 5}</span>
            </div>

            {/* Sample Leaderboard Top 3 */}
            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-semibold text-gray-300">Current Leaderboard Top Rankers:</h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950 border border-gray-800">
                  <span className="text-amber-400 font-bold">🥇 Rank 1: Alex Chen</span>
                  <span className="text-brand-400">5/5 Solved • 42m 15s</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950 border border-gray-800">
                  <span className="text-gray-300 font-bold">🥈 Rank 2: Priya Sharma</span>
                  <span className="text-brand-400">5/5 Solved • 58m 00s</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
