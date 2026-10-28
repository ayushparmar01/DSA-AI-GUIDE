import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Play, RotateCcw } from 'lucide-react';

export const TreeVisualizer = () => {
  // Tree Structure: 4 -> (2 -> (1, 3)), (6 -> (5, 7))
  const [traversalType, setTraversalType] = useState('inorder');
  const [activeNode, setActiveNode] = useState(null);
  const [visitedSequence, setVisitedSequence] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const sequences = {
    inorder: [1, 2, 3, 4, 5, 6, 7], // Left, Root, Right
    preorder: [4, 2, 1, 3, 6, 5, 7], // Root, Left, Right
    postorder: [1, 3, 2, 5, 7, 6, 4] // Left, Right, Root
  };

  const startTraversal = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisitedSequence([]);

    const seq = sequences[traversalType];
    for (let i = 0; i < seq.length; i++) {
      setActiveNode(seq[i]);
      setVisitedSequence(prev => [...prev, seq[i]]);
      await new Promise(r => setTimeout(r, 600));
    }
    setActiveNode(null);
    setIsRunning(false);
  };

  const reset = () => {
    setActiveNode(null);
    setVisitedSequence([]);
    setIsRunning(false);
  };

  const renderNode = (val) => {
    const isActive = activeNode === val;
    const isVisited = visitedSequence.includes(val);

    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
          isActive
            ? 'bg-amber-400 text-gray-950 scale-125 ring-4 ring-amber-400/50 shadow-lg'
            : isVisited
            ? 'bg-emerald-500 text-gray-950'
            : 'bg-gray-800 text-gray-200 border border-gray-700'
        }`}
      >
        {val}
      </div>
    );
  };

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-gray-100">Binary Tree Traversal Visualizer</h4>
          <p className="text-xs text-gray-400">Inorder, Preorder & Postorder recursive traversals</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={traversalType}
            onChange={(e) => {
              setTraversalType(e.target.value);
              reset();
            }}
            disabled={isRunning}
            className="bg-gray-800 text-gray-200 text-xs px-2.5 py-1.5 rounded-lg border border-gray-700"
          >
            <option value="inorder">Inorder (L, Root, R)</option>
            <option value="preorder">Preorder (Root, L, R)</option>
            <option value="postorder">Postorder (L, R, Root)</option>
          </select>

          <Button size="sm" variant="primary" onClick={startTraversal} disabled={isRunning}>
            <Play className="w-3.5 h-3.5 mr-1" /> Run Traversal
          </Button>
          <Button size="sm" variant="secondary" onClick={reset} disabled={isRunning}>
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Visual Tree Node Graph */}
      <div className="flex flex-col items-center gap-6 py-4 bg-gray-950/60 rounded-xl border border-gray-800/80">
        {/* Level 0 */}
        <div>{renderNode(4)}</div>

        {/* Level 1 */}
        <div className="flex gap-24">
          <div>{renderNode(2)}</div>
          <div>{renderNode(6)}</div>
        </div>

        {/* Level 2 */}
        <div className="flex gap-8">
          <div>{renderNode(1)}</div>
          <div>{renderNode(3)}</div>
          <div>{renderNode(5)}</div>
          <div>{renderNode(7)}</div>
        </div>
      </div>

      {/* Traversal Output Sequence */}
      <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono">
        <span className="text-brand-400 font-bold uppercase">{traversalType} Output: </span>
        <span className="text-gray-200">
          [{visitedSequence.join(', ')}]
        </span>
      </div>
    </div>
  );
};
