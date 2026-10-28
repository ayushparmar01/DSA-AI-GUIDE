import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export const StackVisualizer = () => {
  const [stack, setStack] = useState([15, 28, 42]);
  const [inputValue, setInputValue] = useState(50);
  const [actionLog, setActionLog] = useState('Initialized stack with 3 elements.');

  const push = () => {
    if (stack.length >= 7) {
      setActionLog('Stack Overflow! Maximum visualizer depth reached.');
      return;
    }
    const val = inputValue || Math.floor(Math.random() * 90 + 10);
    setStack(prev => [...prev, val]);
    setActionLog(`PUSH(${val}): Added element to top of stack. (LIFO)`);
    setInputValue(prev => prev + 5);
  };

  const pop = () => {
    if (stack.length === 0) {
      setActionLog('Stack Underflow! Stack is empty.');
      return;
    }
    const popped = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    setActionLog(`POP(): Removed ${popped} from top of stack.`);
  };

  const clear = () => {
    setStack([]);
    setActionLog('Cleared stack.');
  };

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-100">LIFO Stack Data Structure Visualizer</h4>
          <p className="text-xs text-gray-400">Last-In-First-Out Push & Pop Operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={push}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Push
          </Button>
          <Button size="sm" variant="danger" onClick={pop} disabled={stack.length === 0}>
            <Minus className="w-3.5 h-3.5 mr-1" /> Pop
          </Button>
          <Button size="sm" variant="secondary" onClick={clear}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        </div>
      </div>

      {/* Stack Tube Representation */}
      <div className="flex flex-col-reverse items-center justify-start min-h-[220px] max-h-[260px] p-4 bg-gray-950/70 border-2 border-dashed border-gray-800 rounded-2xl w-48 mx-auto gap-2">
        {stack.length === 0 ? (
          <span className="text-xs text-gray-600 font-mono py-12">Stack is Empty</span>
        ) : (
          stack.map((item, index) => {
            const isTop = index === stack.length - 1;
            return (
              <div
                key={index}
                className={`w-full py-2.5 rounded-lg text-center font-mono font-bold text-sm transition-all duration-300 animate-slide-down ${
                  isTop
                    ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20 ring-2 ring-amber-300'
                    : 'bg-gray-800 text-gray-200 border border-gray-700'
                }`}
              >
                {item} {isTop && <span className="text-[10px] uppercase ml-1">(TOP)</span>}
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono text-gray-300">
        <span className="text-brand-400 font-bold">Action: </span>
        {actionLog}
      </div>
    </div>
  );
};
