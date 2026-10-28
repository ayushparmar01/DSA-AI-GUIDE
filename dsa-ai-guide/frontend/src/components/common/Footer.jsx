import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-[#0B0F17] py-8 text-center text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="font-semibold text-gray-300">DSA AI Guide</span> — Production AI DSA Mentor
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          Built with precision for 7th Sem Major Project & Technical Placements
        </div>
        <div className="text-gray-500">
          MIT License &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
