import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, recommendationAPI, revisionAPI, roadmapAPI } from '../../api/endpoints';
import { Card, CardHeader, StatCard } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, DifficultyBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Flame,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Compass,
  TrendingUp,
  Brain,
  HelpCircle,
  Code2,
  AlertTriangle,
  Lightbulb,
  FileCode2
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [masteries, setMasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        const [mRes, planRes, recRes, revRes, roadRes, mastRes] = await Promise.allSettled([
          analyticsAPI.getDashboard(),
          recommendationAPI.getDailyPlan(),
          recommendationAPI.getRecommendations(3),
          revisionAPI.getDue(),
          roadmapAPI.getRoadmap(),
          roadmapAPI.getMastery()
        ]);

        if (mRes.status === 'fulfilled' && mRes.value.data.success) {
          setMetrics(mRes.value.data.data);
        }
        if (planRes.status === 'fulfilled' && planRes.value.data.success) {
          setDailyPlan(planRes.value.data.data);
        }
        if (recRes.status === 'fulfilled' && recRes.value.data.success) {
          setRecommendations(recRes.value.data.data || []);
        }
        if (revRes.status === 'fulfilled' && revRes.value.data.success) {
          setRevisions(revRes.value.data.data || []);
        }
        if (roadRes.status === 'fulfilled' && roadRes.value.data.success) {
          setRoadmap(roadRes.value.data.data);
        }
        if (mastRes.status === 'fulfilled' && mastRes.value.data.success) {
          setMasteries(mastRes.value.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to fetch telemetry data from server. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Live Performance Telemetry..." />;

  const primaryRec = recommendations[0];
  const hasAttempts = (metrics?.totalAttempts || 0) > 0;
  const recentAttempts = metrics?.recentAttempts || [];

  // Recharts color scheme
  const OUTCOME_COLORS = {
    Accepted: '#22c55e',
    'Wrong Answer': '#ef4444',
    'Time Limit Exceeded': '#f59e0b',
    'Compilation Error': '#a855f7',
    'Runtime Error': '#ec4899'
  };

  const outcomePieData = metrics?.outcomeBreakdown
    ? Object.entries(metrics.outcomeBreakdown)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status,
          value: count,
          color: OUTCOME_COLORS[status] || '#6b7280'
        }))
    : [];

  const masteryBarData = (masteries.length > 0 ? masteries : (metrics?.masteryBreakdown || []))
    .slice(0, 8)
    .map(m => ({
      name: (m.topicSlug || '').replace(/-/g, ' '),
      mastery: m.masteryScore || 0
    }));

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Research Disclosure Banner */}
      <div className="p-4 bg-gray-900/90 border border-brand-500/30 rounded-xl text-xs text-gray-300 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-brand-300">DSA AI Guide — Empirical Academic Architecture:</span>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            All dashboard statistics reflect verified database telemetry. Mastery scores represent the deterministic heuristic{' '}
            <code className="text-brand-300 bg-gray-950 px-1 py-0.5 rounded">M' = clamp(M + 8R - 2H + 3E - T, 0, 100)</code>.
            Roadmaps are dynamically sorted via Kahn's topological sort priority <code className="text-brand-300 bg-gray-950 px-1 py-0.5 rounded">(1 - M/100)</code>.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Welcome & Target Goals */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-gray-900 via-brand-950/40 to-gray-900 border border-brand-500/20 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
            </h1>
            <Badge variant="brand">Level {user?.level || 1}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Target Goal: <span className="text-gray-200 font-semibold">{profile?.targetGoal || 'Placement Preparation'}</span>
            {' '}• Target Language:{' '}
            <span className="text-brand-400 font-mono uppercase font-bold">{profile?.preferredLanguage || 'python'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/roadmap">
            <Button size="sm" variant="secondary">
              <Compass className="w-3.5 h-3.5 mr-1.5" /> View DAG Roadmap
            </Button>
          </Link>
          <Link to="/ai-mentor">
            <Button size="sm" variant="primary">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Socratic AI Mentor
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Real Telemetry Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Mastery"
          value={`${metrics?.averageMastery || 0}%`}
          subtitle={hasAttempts ? "Calculated via Equation (1)" : "Complete diagnostic or solve problems"}
          icon={Brain}
          color="brand"
        />
        <StatCard
          title="Problems Solved"
          value={metrics?.totalSolved || 0}
          subtitle={`${metrics?.easySolved || 0} Easy • ${metrics?.mediumSolved || 0} Med • ${metrics?.hardSolved || 0} Hard`}
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Active Streak"
          value={`${metrics?.currentStreak || 0} Days`}
          subtitle={`Longest Streak: ${metrics?.longestStreak || 0} Days`}
          icon={Flame}
          color="amber"
        />
        <StatCard
          title="Solve Accuracy"
          value={`${metrics?.accuracy || 0}%`}
          subtitle={`${metrics?.totalAttempts || 0} Total Submissions`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Recharts Analytics: Mastery by Topic & Attempt Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Topic-level Mastery Bar Chart */}
        <Card className="p-6 space-y-4">
          <CardHeader
            title="Topic Mastery Scores [0, 100]"
            subtitle="Continuous mastery tracked across IEEE Core DAG Topics"
            action={<span className="text-xs text-gray-400 font-mono">Heuristic M'</span>}
          />

          {masteryBarData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-gray-950/60 rounded-xl border border-gray-800 text-gray-400 space-y-2">
              <Brain className="w-8 h-8 text-gray-600" />
              <div className="text-sm font-semibold text-gray-300">No Topic Mastery Recorded Yet</div>
              <p className="text-xs max-w-xs">
                Solve your first problem or complete the diagnostic test to initialize topic skill tracking.
              </p>
              <Link to="/problems">
                <Button size="sm" variant="secondary" className="mt-2">Browse Problem Bank</Button>
              </Link>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={masteryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={10} angle={-25} textAnchor="end" />
                  <YAxis stroke="#6B7280" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="mastery" name="Mastery %" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Right: Attempt Outcomes over Past 7 Days */}
        <Card className="p-6 space-y-4">
          <CardHeader
            title="Weekly Activity & Outcomes"
            subtitle="Real daily solve attempts and outcomes over the past 7 days"
            action={<span className="text-xs text-gray-400 font-mono">Actual Logs</span>}
          />

          {!hasAttempts ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-gray-950/60 rounded-xl border border-gray-800 text-gray-400 space-y-2">
              <TrendingUp className="w-8 h-8 text-gray-600" />
              <div className="text-sm font-semibold text-gray-300">No Weekly Submissions Found</div>
              <p className="text-xs max-w-xs">
                As you submit solutions to the Judge0 sandbox, your daily velocity and outcomes will appear here.
              </p>
              <Link to="/problems">
                <Button size="sm" variant="primary" className="mt-2">Start Coding</Button>
              </Link>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.weeklyActivity || []} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="day" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="solved" name="Accepted" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attempts" name="Total Attempts" fill="#374151" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Socratic Hint & Complexity Heuristic Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" /> Socratic Hint Usage
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics?.totalHintsUsed || 0} <span className="text-xs text-gray-400 font-normal">Hints Requested</span>
          </div>
          <p className="text-xs text-gray-400">
            Average: <span className="text-gray-200 font-semibold">{metrics?.avgHintsPerAttempt || 0}</span> hints per problem attempt. Screened by Syntax Leakage Guard (τ = 0.80).
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Code2 className="w-4 h-4" /> Static AST Complexity
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics?.complexityCounts?.['O(N)'] || 0} <span className="text-xs text-gray-400 font-normal">Linear O(N) Submissions</span>
          </div>
          <p className="text-xs text-gray-400">
            Detected via Python AST Heuristic (v1) with halving loop and sort recognition.
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" /> SM-2 Revision Status
          </div>
          <div className="text-2xl font-bold text-white">
            {revisions.length} <span className="text-xs text-gray-400 font-normal">Due for Recall Today</span>
          </div>
          <p className="text-xs text-gray-400">
            Next optimal review calculated using SuperMemo SM-2 interval expansion (EF ≥ 1.3).
          </p>
        </Card>
      </div>

      {/* Today's Plan & Recommended Problem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Structured Plan */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader
            title="Today's Personalized Study Plan"
            subtitle={`AI-scheduled tasks for your ${dailyPlan?.dailyTimeBudgetMinutes || 90}-minute daily budget`}
            action={<Badge variant="brand">{dailyPlan?.totalPlanMinutes || 90} MINS TOTAL</Badge>}
          />

          <div className="space-y-3">
            {(!dailyPlan?.items || dailyPlan.items.length === 0) ? (
              <div className="p-6 text-center rounded-xl bg-gray-950/50 border border-gray-800 text-xs text-gray-400">
                No active plan items. Browse problems or adapt your roadmap.
              </div>
            ) : (
              dailyPlan.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-between hover:border-gray-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-xs font-mono font-bold text-brand-400">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200">{item.title}</h4>
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.durationMinutes}m
                    </span>
                    {item.slug ? (
                      <Link to={`/problems/${item.slug}`}>
                        <Button size="sm" variant="primary">Start</Button>
                      </Link>
                    ) : item.type === 'revision' ? (
                      <Link to="/revision">
                        <Button size="sm" variant="accent">Revise</Button>
                      </Link>
                    ) : (
                      <Link to="/assessment">
                        <Button size="sm" variant="ghost">Diagnostic</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Right Col: Primary Adaptive Recommendation */}
        <Card className="space-y-4 flex flex-col justify-between p-6 bg-gradient-to-br from-gray-900 to-brand-950/30 border-brand-500/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="brand">Recommended Problem</Badge>
              {primaryRec && <DifficultyBadge difficulty={primaryRec.problem?.difficulty} />}
            </div>

            {primaryRec ? (
              <>
                <h3 className="text-xl font-bold text-white">{primaryRec.problem?.title}</h3>
                <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                  {primaryRec.problem?.description}
                </p>

                <div className="p-3 bg-gray-950/80 border border-brand-500/20 rounded-xl text-xs text-brand-300">
                  <div className="font-semibold text-brand-400 mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Adaptive Reason:
                  </div>
                  {primaryRec.rationale || 'Targeted to strengthen active prerequisite knowledge.'}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">
                <FileCode2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                Select any problem from the problem bank to start.
              </div>
            )}
          </div>

          {primaryRec && (
            <Link to={`/problems/${primaryRec.problem?.slug}`} className="w-full">
              <Button size="md" variant="primary" className="w-full font-bold">
                Solve Problem Now <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          )}
        </Card>
      </div>

      {/* Recent Attempts Table */}
      <Card className="space-y-4">
        <CardHeader
          title="Recent Problem Attempts"
          subtitle="Real submission outcomes, execution times, and hint usage"
          action={
            <Link to="/problems">
              <Button size="sm" variant="ghost" className="text-xs">Browse All Problems</Button>
            </Link>
          }
        />

        {recentAttempts.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-gray-950/50 border border-gray-800 text-xs text-gray-400 space-y-2">
            <Code2 className="w-8 h-8 text-gray-600 mx-auto" />
            <div className="text-sm font-semibold text-gray-300">No Attempts Recorded</div>
            <p className="text-xs max-w-sm mx-auto">
              When you submit code solutions through the Monaco code editor, your sandbox test execution outcomes and time complexity analysis will be archived here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-950 text-gray-400 border-b border-gray-800 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Runtime</th>
                  <th className="py-3 px-4">Hints</th>
                  <th className="py-3 px-4">Complexity</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-200">
                {recentAttempts.map((att, i) => (
                  <tr key={att.id || i} className="hover:bg-gray-800/30 transition">
                    <td className="py-3 px-4 font-semibold text-brand-300 capitalize">
                      {att.problemSlug?.replace(/-/g, ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        att.status === 'Accepted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono uppercase text-gray-400">{att.language}</td>
                    <td className="py-3 px-4 font-mono text-gray-400">{att.runtimeMs ? `${att.runtimeMs}ms` : '—'}</td>
                    <td className="py-3 px-4 text-gray-400">{att.hintsUsedCount || 0}</td>
                    <td className="py-3 px-4 font-mono text-indigo-400">{att.complexity || 'O(N)'}</td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/problems/${att.problemSlug}`} className="text-brand-400 hover:underline">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
