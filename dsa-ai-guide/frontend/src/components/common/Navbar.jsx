import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Badge } from './Badge';
import { Sparkles, Flame, Award, LogOut, User, Shield, Compass, BookOpen, Code, Brain } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-gray-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              DSA <span className="text-brand-400">AI</span> Guide
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase -mt-1">Adaptive Mentor</span>
          </div>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* Streak & XP Widget */}
            <div className="hidden sm:flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold" title="Active Streak">
                <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
                <span>{user?.streakCurrent || 1}d Streak</span>
              </div>
              <div className="h-3 w-px bg-gray-700" />
              <div className="flex items-center gap-1.5 text-brand-400 text-xs font-semibold" title="Learner Level">
                <Award className="w-4 h-4" />
                <span>Lvl {user?.level || 1} ({user?.xp || 0} XP)</span>
              </div>
            </div>

            {isAdmin && (
              <Link to="/admin">
                <Badge variant="purple" size="md" className="cursor-pointer hover:bg-purple-500/20">
                  <Shield className="w-3.5 h-3.5" /> Admin
                </Badge>
              </Link>
            )}

            <Link to="/profile" className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800 transition">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started Free</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
