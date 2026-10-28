import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export const DifficultyBadge = ({ difficulty }) => {
  const dLower = (difficulty || '').toLowerCase();
  if (dLower === 'easy') return <Badge variant="easy">Easy</Badge>;
  if (dLower === 'medium') return <Badge variant="medium">Medium</Badge>;
  if (dLower === 'hard') return <Badge variant="hard">Hard</Badge>;
  return <Badge>{difficulty}</Badge>;
};
