import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/endpoints';
import { Card, CardHeader, StatCard } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Shield, Users, Code2, CheckCircle2, Activity, Plus } from 'lucide-react';

export const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [sRes, uRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers()
        ]);
        setStats(sRes.data.data);
        setUsers(uRes.data.data);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner text="Accessing Enterprise Admin Telemetry..." />;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gray-900 border border-purple-500/30 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-extrabold text-white">Admin Management Portal</h1>
          </div>
          <p className="text-xs text-gray-400">
            Platform-wide student telemetry, content management, and AI prompt controls.
          </p>
        </div>
        <Badge variant="purple">Admin Authorization Active</Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Problems in DB"
          value={stats?.totalProblems || 0}
          icon={Code2}
          color="brand"
        />
        <StatCard
          title="Total Submissions"
          value={stats?.totalSubmissions || 0}
          icon={CheckCircle2}
          color="purple"
        />
        <StatCard
          title="Telemetry Events"
          value={stats?.totalEvents || 0}
          icon={Activity}
          color="amber"
        />
      </div>

      {/* Registered Users Table */}
      <Card className="p-6 space-y-4">
        <CardHeader
          title="Registered Student Accounts"
          subtitle="Real-time roster and active diagnostic levels"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-gray-400 uppercase font-mono border-b border-gray-800">
              <tr>
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Level / XP</th>
                <th className="pb-3 font-semibold">Diagnostic Done</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-850/50">
                  <td className="py-3 font-bold text-gray-200 font-sans">{u.name}</td>
                  <td className="py-3 text-gray-400">{u.email}</td>
                  <td className="py-3">
                    <Badge variant={u.role === 'admin' ? 'purple' : 'default'} size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 text-brand-400">Lvl {u.level} ({u.xp} XP)</td>
                  <td className="py-3">
                    {u.isAssessmentCompleted ? (
                      <span className="text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
