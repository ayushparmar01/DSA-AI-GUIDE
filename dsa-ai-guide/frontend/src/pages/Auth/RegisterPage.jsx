import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsDuplicate(false);
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, 'student');
      navigate('/onboarding');
    } catch (err) {
      const msg = Array.isArray(err.response?.data?.errors)
        ? err.response.data.errors.join(' ')
        : (err.response?.data?.message || err.message || 'Registration failed');
      setError(msg);
      if (
        msg.toLowerCase().includes('already registered') ||
        msg.toLowerCase().includes('duplicate') ||
        (err.response?.status === 400 && msg.toLowerCase().includes('email'))
      ) {
        setIsDuplicate(true);
      }
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
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-xs text-gray-400">Join DSA AI Guide and start your adaptive learning trajectory</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg mb-4 space-y-2">
            <div>{error}</div>
            {isDuplicate && (
              <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between">
                <span className="text-gray-300">Account already exists?</span>
                <Link
                  to={`/login?email=${encodeURIComponent(email.trim())}`}
                  className="inline-flex items-center text-brand-400 hover:text-brand-300 font-semibold underline"
                >
                  Log in now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-brand-500 transition"
                placeholder="Alex Johnson"
              />
            </div>
          </div>

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
                placeholder="alex@college.edu"
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
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full py-2.5">
            Continue to Profile Setup <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:underline font-semibold">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
};
