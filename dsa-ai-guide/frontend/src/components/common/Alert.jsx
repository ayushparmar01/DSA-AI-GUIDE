import React from 'react';

export const Alert = ({ type = 'info', title, message, className = '' }) => {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-300'
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type] || styles.info} ${className}`}>
      {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
      <p className="text-xs leading-relaxed">{message}</p>
    </div>
  );
};

export default Alert;