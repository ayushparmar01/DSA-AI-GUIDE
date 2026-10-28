import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Target, Clock, Code, Building, GraduationCap, ArrowRight } from 'lucide-react';

export const OnboardingPage = () => {
  const { profile, updateProfileData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    college: profile?.college || 'National Institute of Technology',
    degree: profile?.degree || 'B.Tech',
    branch: profile?.branch || 'Computer Science & Engineering',
    graduationYear: profile?.graduationYear || 2026,
    targetGoal: profile?.targetGoal || 'Placement preparation',
    preferredLanguage: profile?.preferredLanguage || 'cpp',
    dailyStudyMinutes: profile?.dailyStudyMinutes || 90,
    targetCompanies: profile?.targetCompanies?.length ? profile.targetCompanies : ['Google', 'Microsoft', 'Amazon'],
    codingExperience: profile?.codingExperience || '6-12 months',
    weeklyAvailabilityDays: 6
  });

  const goals = [
    { id: 'Placement preparation', label: 'Placement Preparation', desc: 'On-campus & off-campus SWE hiring' },
    { id: 'FAANG / Product Companies', label: 'FAANG / Top Product Firms', desc: 'Deep pattern mastery & hard graph/DP problems' },
    { id: 'Competitive programming', label: 'Competitive Programming', desc: 'Speed, math invariants & advanced contest techniques' },
    { id: 'DSA Fundamentals', label: 'DSA Fundamentals', desc: 'Strong conceptual base from scratch' }
  ];

  const timeOptions = [30, 60, 90, 120, 180];
  const languages = [
    { id: 'cpp', label: 'C++ (STL)' },
    { id: 'python', label: 'Python 3' },
    { id: 'java', label: 'Java' },
    { id: 'javascript', label: 'JavaScript' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfileData(formData);
      navigate('/assessment');
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Configure Your Learning Profile</h1>
        <p className="text-sm text-gray-400">
          Personalize your daily time budget and target goal so our AI can calibrate your roadmap.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Goal */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
            <Target className="w-4 h-4 text-brand-400" /> Primary Target Goal
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {goals.map(g => (
              <div
                key={g.id}
                onClick={() => setFormData({ ...formData, targetGoal: g.id })}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  formData.targetGoal === g.id
                    ? 'bg-brand-500/10 border-brand-500/50 text-white shadow-sm'
                    : 'bg-gray-950/50 border-gray-800 text-gray-300 hover:border-gray-700'
                }`}
              >
                <div className="text-sm font-bold">{g.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{g.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Time Budget & Preferred Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
              <Clock className="w-4 h-4 text-amber-400" /> Daily Time Budget
            </div>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map(mins => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setFormData({ ...formData, dailyStudyMinutes: mins })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    formData.dailyStudyMinutes === mins
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-gray-950/50 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {mins} mins / day
                </button>
              ))}
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
              <Code className="w-4 h-4 text-purple-400" /> Preferred Language
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map(lang => (
                <button
                  type="button"
                  key={lang.id}
                  onClick={() => setFormData({ ...formData, preferredLanguage: lang.id })}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                    formData.preferredLanguage === lang.id
                      ? 'bg-purple-500/15 border-purple-500/50 text-purple-300'
                      : 'bg-gray-950/50 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Academic Details */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
            <GraduationCap className="w-4 h-4 text-blue-400" /> College & Academic Background
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Graduation Year</label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" variant="primary" loading={loading} className="px-8">
            Start Initial DSA Assessment <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};
