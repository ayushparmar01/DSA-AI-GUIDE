import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Code2,
  RotateCcw,
  BarChart3,
  BotMessageSquare,
  Mic2,
  Trophy,
  UploadCloud,
  FileCheck,
  Award
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Adaptive Roadmap', path: '/roadmap', icon: Compass },
    { label: 'DSA Topics', path: '/topics', icon: BookOpen },
    { label: 'Problem Bank', path: '/problems', icon: Code2 },
    { label: 'Today’s Revision', path: '/revision', icon: RotateCcw },
    { label: 'AI Socratic Mentor', path: '/ai-mentor', icon: BotMessageSquare },
    { label: 'Mock Interview', path: '/mock-interview', icon: Mic2 },
    { label: 'Weekly Contest', path: '/contest', icon: Trophy },
    { label: 'Learning Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Import LeetCode', path: '/leetcode-import', icon: UploadCloud },
    { label: 'Diagnostic Assessment', path: '/assessment', icon: FileCheck },
    { label: 'Profile & Badges', path: '/profile', icon: Award }
  ];

  return (
    <aside className="w-64 border-r border-gray-800 bg-[#0B0F17]/95 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Learning Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-850 border border-gray-800 rounded-xl mt-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          AI Engine Active
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Dynamic sequencing adjusting to your solve times and error telemetry.
        </p>
      </div>
    </aside>
  );
};
