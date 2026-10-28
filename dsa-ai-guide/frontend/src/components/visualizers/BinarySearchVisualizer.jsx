import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export const BinarySearchVisualizer = () => {
  const array = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];
  const [target, setTarget] = useState(23);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(array.length - 1);
  const [mid, setMid] = useState(Math.floor((0 + array.length - 1) / 2));
  const [found, setFound] = useState(false);
  const [stepLog, setStepLog] = useState('Initialized search space [0, 10]. Target = 23.');
  const [completed, setCompleted] = useState(false);

  const reset = () => {
    setLow(0);
    setHigh(array.length - 1);
    const m = Math.floor((0 + array.length - 1) / 2);
    setMid(m);
    setFound(false);
    setCompleted(false);
    setStepLog(`Reset search. Target = ${target}. Range [0, ${array.length - 1}].`);
  };

  const nextStep = () => {
    if (completed || low > high) return;

    const currentMid = Math.floor((low + high) / 2);
    setMid(currentMid);

    if (array[currentMid] === target) {
      setFound(true);
      setCompleted(true);
      setStepLog(`🎉 Target ${target} found at index ${currentMid}! nums[${currentMid}] == ${target}`);
      return;
    }

    if (array[currentMid] < target) {
      setStepLog(`nums[${currentMid}] = ${array[currentMid]} < ${target}. Eliminate left half: low = ${currentMid + 1}.`);
      setLow(currentMid + 1);
      if (currentMid + 1 > high) {
        setCompleted(true);
        setStepLog(`Target ${target} not in array. Search terminated.`);
      }
    } else {
      setStepLog(`nums[${currentMid}] = ${array[currentMid]} > ${target}. Eliminate right half: high = ${currentMid - 1}.`);
      setHigh(currentMid - 1);
      if (low > currentMid - 1) {
        setCompleted(true);
        setStepLog(`Target ${target} not in array. Search terminated.`);
      }
    }
  };

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-100">Binary Search Step-by-Step Visualizer</h4>
          <p className="text-xs text-gray-400">Watch the O(log N) search space halve in each iteration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={reset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
          <Button size="sm" variant="primary" onClick={nextStep} disabled={completed}>
            <SkipForward className="w-3.5 h-3.5 mr-1" /> Next Step
          </Button>
        </div>
      </div>

      {/* Array Elements Visual Bar */}
      <div className="flex flex-wrap gap-2 py-4 justify-center">
        {array.map((val, idx) => {
          const isMid = idx === mid && !completed;
          const isLow = idx === low;
          const isHigh = idx === high;
          const isFoundElement = found && idx === mid;
          const isOutOfRange = idx < low || idx > high;

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                  isFoundElement
                    ? 'bg-emerald-500 text-gray-950 scale-110 ring-4 ring-emerald-400/40 shadow-lg'
                    : isMid
                    ? 'bg-amber-500 text-gray-950 scale-105 ring-2 ring-amber-400'
                    : isOutOfRange
                    ? 'bg-gray-950/40 text-gray-600 border border-gray-850 opacity-40'
                    : 'bg-gray-800 text-gray-200 border border-gray-700'
                }`}
              >
                {val}
              </div>
              <span className="text-[10px] font-mono text-gray-500">[{idx}]</span>
              <div className="flex flex-col gap-0.5 text-[9px] font-bold tracking-tight">
                {isLow && <span className="text-blue-400">LOW</span>}
                {isMid && <span className="text-amber-400">MID</span>}
                {isHigh && <span className="text-rose-400">HIGH</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Explanation Log */}
      <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono text-gray-300">
        <span className="text-brand-400 font-bold">Status: </span>
        {stepLog}
      </div>
    </div>
  );
};
