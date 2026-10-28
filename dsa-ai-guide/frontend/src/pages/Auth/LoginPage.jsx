import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Sparkles, Mail, Lock, ArrowRight, Info } from 'lucide-react';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email');
  const [email, setEmail] = useState(emailParam || 'student@dsa-ai.guide');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      const msg = Array.isArray(err.response?.data?.errors)
        ? err.response.data.errors.join(' ')
        : (err.response?.data?.message || err.message || 'Login failed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gray-900/90 border-gray-800 shadow-2xl">
        <div className="text-center mb-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-gray-950" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-gray-400">Log in to resume your adaptive DSA learning roadmap</p>
        </div>

        {emailParam && !error && (
          <div className="p-3 bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs rounded-lg mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Pre-filled existing account email. Please enter your password to sign in.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-brand-500 transition"
                placeholder="name@college.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-brand-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-lg text-[11px] text-gray-400 space-y-2">
            <div className="font-semibold text-gray-300">Default Demo Credentials:</div>
            <div className="flex items-center justify-between">
              <div>Student: <span className="text-brand-400 font-mono">student@dsa-ai.guide</span> / <span className="text-brand-400 font-mono">Password123!</span></div>
              <button
                type="button"
                onClick={() => {
                  setEmail('student@dsa-ai.guide');
                  setPassword('Password123!');
                  setError('');
                }}
                className="px-2 py-0.5 text-[10px] bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 rounded border border-brand-500/30 transition cursor-pointer"
              >
                Use
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>Admin: <span className="text-purple-400 font-mono">admin@dsa-ai.guide</span> / <span className="text-purple-400 font-mono">AdminSecret123!</span></div>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@dsa-ai.guide');
                  setPassword('AdminSecret123!');
                  setError('');
                }}
                className="px-2 py-0.5 text-[10px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded border border-purple-500/30 transition cursor-pointer"
              >
                Use
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full py-2.5">
            Log In <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline font-semibold">
            Create account
          </Link>
        </div>
      </Card>
    </div>
  );
};
