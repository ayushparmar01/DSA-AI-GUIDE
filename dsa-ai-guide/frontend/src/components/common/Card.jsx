import React from 'react';

export const Card = ({ children, className = '', hover = false, glow = false, ...props }) => {
  return (
    <div
      className={`bg-gray-900/80 border border-gray-800 rounded-xl p-5 backdrop-blur-sm ${
        hover ? 'transition-all duration-200 hover:border-gray-700 hover:bg-gray-800/80' : ''
      } ${glow ? 'border-brand-500/30 shadow-lg shadow-brand-500/5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    <div>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'brand' }) => {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

  return (
    <Card className="flex items-center gap-4">
      {Icon && (
        <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.brand}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-bold text-gray-100">{value}</p>
          {trend && <span className="text-xs font-semibold text-brand-400">{trend}</span>}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
      </div>
    </Card>
  );
};
