import React, { useState } from 'react';
import { Button } from '../common/Button';
import { RotateCcw, SkipForward } from 'lucide-react';

export const TwoPointerVisualizer = () => {
  const nums = [1, 3, 4, 7, 11, 15, 18, 22];
  const target = 18;
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(nums.length - 1);
  const [found, setFound] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [log, setLog] = useState('Two Sum on Sorted Array: Find pair summing to 18.');

  const reset = () => {
    setLeft(0);
    setRight(nums.length - 1);
    setFound(false);
    setCompleted(false);
    setLog('Reset pointers. Target = 18.');
  };

  const nextStep = () => {
    if (completed || left >= right) return;

    const currentSum = nums[left] + nums[right];

    if (currentSum === target) {
      setFound(true);
      setCompleted(true);
      setLog(`🎉 Match found! nums[${left}] (${nums[left]}) + nums[${right}] (${nums[right]}) == ${target}`);
      return;
    }

    if (currentSum < target) {
      setLog(`Current sum ${nums[left]} + ${nums[right]} = ${currentSum} < ${target}. Increment left pointer (${left} -> ${left + 1}) to increase sum.`);
      setLeft(left + 1);
    } else {
      setLog(`Current sum ${nums[left]} + ${nums[right]} = ${currentSum} > ${target}. Decrement right pointer (${right} -> ${right - 1}) to decrease sum.`);
      setRight(right - 1);
    }
  };

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-100">Two Pointer Converging Invariant Visualizer</h4>
          <p className="text-xs text-gray-400">Target Sum = 18 on Sorted Array</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={reset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
          <Button size="sm" variant="primary" onClick={nextStep} disabled={completed}>
            <SkipForward className="w-3.5 h-3.5 mr-1" /> Step
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 py-4 justify-center">
        {nums.map((val, idx) => {
          const isLeft = idx === left;
          const isRight = idx === right;
          const isMatchPair = found && (isLeft || isRight);

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                  isMatchPair
                    ? 'bg-emerald-500 text-gray-950 scale-110 ring-4 ring-emerald-400/40'
                    : isLeft
                    ? 'bg-blue-500 text-white ring-2 ring-blue-400'
                    : isRight
                    ? 'bg-purple-500 text-white ring-2 ring-purple-400'
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                }`}
              >
                {val}
              </div>
              <span className="text-[10px] font-mono text-gray-500">[{idx}]</span>
              <div className="flex flex-col gap-0.5 text-[9px] font-bold">
                {isLeft && <span className="text-blue-400">L (Ptr 1)</span>}
                {isRight && <span className="text-purple-400">R (Ptr 2)</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono text-gray-300">
        <span className="text-brand-400 font-bold">Trace: </span>
        {log}
      </div>
    </div>
  );
};
