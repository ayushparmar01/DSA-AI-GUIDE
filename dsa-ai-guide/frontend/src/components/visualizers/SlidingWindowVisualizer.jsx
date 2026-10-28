import React, { useState } from 'react';
import { Button } from '../common/Button';
import { RotateCcw, SkipForward } from 'lucide-react';

export const SlidingWindowVisualizer = () => {
  const nums = [2, 1, 5, 1, 3, 2];
  const k = 3;
  const [windowStart, setWindowStart] = useState(0);
  const [maxSum, setMaxSum] = useState(8);
  const [currSum, setCurrSum] = useState(8);
  const [step, setStep] = useState(0);

  const reset = () => {
    setWindowStart(0);
    setMaxSum(nums[0] + nums[1] + nums[2]);
    setCurrSum(nums[0] + nums[1] + nums[2]);
    setStep(0);
  };

  const nextStep = () => {
    if (windowStart >= nums.length - k) return;
    const nextStart = windowStart + 1;
    const newSum = currSum - nums[windowStart] + nums[nextStart + k - 1];
    setWindowStart(nextStart);
    setCurrSum(newSum);
    setMaxSum(prev => Math.max(prev, newSum));
    setStep(prev => prev + 1);
  };

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-100">Fixed Sliding Window Visualizer (k = 3)</h4>
          <p className="text-xs text-gray-400">Maximum sum subarray of fixed length k in O(N) time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={reset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
          <Button size="sm" variant="primary" onClick={nextStep} disabled={windowStart >= nums.length - k}>
            <SkipForward className="w-3.5 h-3.5 mr-1" /> Slide Window
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 py-4 justify-center">
        {nums.map((val, idx) => {
          const inWindow = idx >= windowStart && idx < windowStart + k;

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                  inWindow
                    ? 'bg-brand-500 text-gray-950 scale-105 ring-4 ring-brand-400/40'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 opacity-50'
                }`}
              >
                {val}
              </div>
              <span className="text-[10px] font-mono text-gray-500">[{idx}]</span>
              {inWindow && <span className="text-[9px] font-bold text-brand-400">IN WINDOW</span>}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono">
        <div>
          <span className="text-gray-400">Current Window Sum: </span>
          <span className="text-amber-400 font-bold">{currSum}</span>
        </div>
        <div>
          <span className="text-gray-400">Max Sum Seen: </span>
          <span className="text-brand-400 font-bold text-sm">{maxSum}</span>
        </div>
      </div>
    </div>
  );
};
