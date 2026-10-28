const DSA_TOPICS = [
  { slug: 'programming-basics', name: 'Programming Basics', category: 'Fundamentals', order: 1 },
  { slug: 'arrays', name: 'Arrays', category: 'Linear Data Structures', order: 2 },
  { slug: 'strings', name: 'Strings', category: 'Linear Data Structures', order: 3 },
  { slug: 'hashing', name: 'Hashing', category: 'Data Structures', order: 4 },
  { slug: 'sorting', name: 'Sorting', category: 'Algorithms', order: 5 },
  { slug: 'searching', name: 'Searching', category: 'Algorithms', order: 6 },
  { slug: 'two-pointers', name: 'Two Pointers', category: 'Techniques', order: 7 },
  { slug: 'sliding-window', name: 'Sliding Window', category: 'Techniques', order: 8 },
  { slug: 'binary-search', name: 'Binary Search', category: 'Algorithms', order: 9 },
  { slug: 'recursion', name: 'Recursion', category: 'Algorithmic Paradigms', order: 10 },
  { slug: 'backtracking', name: 'Backtracking', category: 'Algorithmic Paradigms', order: 11 },
  { slug: 'linked-list', name: 'Linked List', category: 'Linear Data Structures', order: 12 },
  { slug: 'stack', name: 'Stack', category: 'Linear Data Structures', order: 13 },
  { slug: 'queue', name: 'Queue', category: 'Linear Data Structures', order: 14 },
  { slug: 'trees', name: 'Trees', category: 'Hierarchical Data Structures', order: 15 },
  { slug: 'binary-search-tree', name: 'Binary Search Tree', category: 'Hierarchical Data Structures', order: 16 },
  { slug: 'heap-priority-queue', name: 'Heap / Priority Queue', category: 'Data Structures', order: 17 },
  { slug: 'greedy', name: 'Greedy Algorithms', category: 'Algorithmic Paradigms', order: 18 },
  { slug: 'graphs', name: 'Graphs', category: 'Non-Linear Data Structures', order: 19 },
  { slug: 'dynamic-programming', name: 'Dynamic Programming', category: 'Advanced Paradigms', order: 20 },
  { slug: 'bit-manipulation', name: 'Bit Manipulation', category: 'Low-Level Techniques', order: 21 }
];

const DSA_PATTERNS = [
  { slug: 'two-sum-hashing', name: 'Two Sum / Direct Hashing' },
  { slug: 'two-pointer', name: 'Two Pointer Technique' },
  { slug: 'sliding-window', name: 'Fixed & Dynamic Sliding Window' },
  { slug: 'prefix-sum', name: 'Prefix Sum / Running Cumulative' },
  { slug: 'binary-search-space', name: 'Binary Search On Answer Space' },
  { slug: 'fast-slow-pointer', name: 'Fast & Slow Pointers (Floyd Tortoise & Hare)' },
  { slug: 'merge-intervals', name: 'Merge & Overlapping Intervals' },
  { slug: 'monotonic-stack', name: 'Monotonic Stack / Queue' },
  { slug: 'top-k-heap', name: 'Top K Elements / Min-Max Heap' },
  { slug: 'bfs-graph-tree', name: 'Breadth First Search (BFS)' },
  { slug: 'dfs-graph-tree', name: 'Depth First Search (DFS)' },
  { slug: 'backtracking-state', name: 'Backtracking with State Pruning' },
  { slug: 'greedy-interval', name: 'Greedy Choice Property' },
  { slug: 'dp-memoization-tabulation', name: 'DP (1D / 2D / Knapsack / Subsequences)' },
  { slug: 'bit-masking', name: 'Bit Masking & XOR Properties' },
  { slug: 'divide-and-conquer', name: 'Divide and Conquer' }
];

const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin'
};

const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
};

const PROBLEM_STATUS = {
  NOT_STARTED: 'Not Started',
  ATTEMPTED: 'Attempted',
  SOLVED: 'Solved',
  NEED_REVISION: 'Need Revision',
  MASTERED: 'Mastered'
};

const MASTERY_WEIGHTS = {
  ACCURACY: 0.25,
  DIFFICULTY_COVERAGE: 0.25,
  TIME_EFFICIENCY: 0.15,
  SPACED_RECALL: 0.15,
  DIAGNOSTIC_ASSESSMENT: 0.10,
  PATTERN_COMPREHENSION: 0.10
};

const RECOMMENDATION_WEIGHTS = {
  WEAKNESS_SCORE: 0.30,
  PREREQUISITE_SCORE: 0.20,
  DIFFICULTY_FIT: 0.15,
  RECENCY: 0.15,
  PATTERN_GAP: 0.10,
  REVISION_NEED: 0.10
};

module.exports = {
  DSA_TOPICS,
  DSA_PATTERNS,
  USER_ROLES,
  DIFFICULTY_LEVELS,
  PROBLEM_STATUS,
  MASTERY_WEIGHTS,
  RECOMMENDATION_WEIGHTS
};
