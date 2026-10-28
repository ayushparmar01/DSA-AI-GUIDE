import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/endpoints';
import { Card, CardHeader } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { User, Award, Flame, Shield, Snowflake, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export const ProfilePage = () => {
  const { user, profile } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await authAPI.getAchievements();
        setAchievements(res.data.data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Student Profile & Gamification Badges..." />;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
      {/* Profile Overview Card */}
      <Card className="p-8 bg-gradient-to-r from-gray-900 via-gray-900 to-brand-950/30 border-brand-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/20 border-2 border-brand-500/40 flex items-center justify-center text-3xl font-extrabold text-brand-400 shadow-xl">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
              <Badge variant="brand">Level {user?.level || 1} Apprentice</Badge>
              {user?.role === 'admin' && <Badge variant="purple">Admin</Badge>}
            </div>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-300 font-medium pt-1">
              {profile?.college || 'National Institute of Technology'} • {profile?.degree} ({profile?.graduationYear})
            </p>
          </div>

          <div className="flex sm:flex-col gap-3">
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
                <Flame className="w-4 h-4 fill-amber-400" /> {user?.streakCurrent || 1} Days
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-mono">Streak</span>
            </div>

            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 text-center">
              <div className="flex items-center justify-center gap-1 text-brand-400 font-bold text-sm">
                <Award className="w-4 h-4" /> {user?.xp || 0} XP
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-mono">Total XP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-800 text-xs font-mono">
          <div>
            <span className="text-gray-500 block">Target:</span>
            <span className="text-gray-200 font-bold font-sans">{profile?.targetGoal}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Preferred Lang:</span>
            <span className="text-brand-400 uppercase font-bold">{profile?.preferredLanguage}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Daily Budget:</span>
            <span className="text-amber-400 font-bold">{profile?.dailyStudyMinutes} min/day</span>
          </div>
          <div>
            <span className="text-gray-500 block">Streak Freezes:</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Snowflake className="w-3.5 h-3.5" /> {user?.streakFreezeCount || 1} Active
            </span>
          </div>
        </div>
      </Card>

      {/* Gamification Achievements & Milestone Badges */}
      <Card className="p-6 space-y-6">
        <CardHeader
          title="Professional Milestone Badges"
          subtitle="Earn XP rewards by reaching algorithmic mastery milestones"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.slug}
              className={`p-4 rounded-xl border flex items-center justify-between transition ${
                ach.isUnlocked
                  ? 'bg-brand-500/10 border-brand-500/30 text-white shadow-sm'
                  : 'bg-gray-950/60 border-gray-800 text-gray-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    ach.isUnlocked ? 'bg-brand-500 text-gray-950 shadow-md' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {ach.isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-200">{ach.title}</h4>
                  <p className="text-xs text-gray-400">{ach.description}</p>
                </div>
              </div>

              <Badge variant={ach.isUnlocked ? 'easy' : 'default'} size="sm">
                +{ach.xpReward} XP
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
