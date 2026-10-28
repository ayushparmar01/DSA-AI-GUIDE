/**
 * Demonstration / MVP Seed Data: 16 Core DSA Topics
 * Strictly matching the Prerequisite DAG specified in:
 * - DSA AI Guide IEEE-Style Research Paper (Section 4.2)
 * - Progress Report 03 (Section 11, Milestone M8)
 * - ai-service/app/core/roadmap.py (DEFAULT_TOPIC_GRAPH)
 */

const topics = [
  {
    slug: 'complexity-analysis',
    name: 'Complexity Analysis',
    category: 'Fundamentals',
    order: 1,
    icon: 'clock',
    prerequisites: [],
    estimatedHours: 6,
    importanceLevel: 'Critical',
    description: 'Asymptotic notation, Big-O, Omega, Theta, worst/average/best cases, recurrence relations, and space analysis.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'arrays',
    name: 'Arrays',
    category: 'Linear Data Structures',
    order: 2,
    icon: 'layout-grid',
    prerequisites: ['complexity-analysis'],
    estimatedHours: 12,
    importanceLevel: 'Critical',
    description: 'Contiguous memory storage, traversals, rotation, prefix sums, Kadane algorithm, and subarray problems.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'recursion',
    name: 'Recursion',
    category: 'Algorithmic Paradigms',
    order: 3,
    icon: 'repeat',
    prerequisites: ['complexity-analysis'],
    estimatedHours: 10,
    importanceLevel: 'High',
    description: 'Base cases, recursive call stack, recursion trees, and divide-and-conquer strategy.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'linked-lists',
    name: 'Linked Lists',
    category: 'Linear Data Structures',
    order: 4,
    icon: 'link-2',
    prerequisites: ['arrays'],
    estimatedHours: 12,
    importanceLevel: 'High',
    description: 'Singly, doubly, and circular linked lists, pointer manipulation, Floyd cycle detection, and reversal.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'stacks',
    name: 'Stacks',
    category: 'Linear Data Structures',
    order: 5,
    icon: 'layers',
    prerequisites: ['arrays'],
    estimatedHours: 10,
    importanceLevel: 'High',
    description: 'LIFO principle, balanced parentheses, monotonic stack (Next Greater Element), and histogram areas.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'queues',
    name: 'Queues',
    category: 'Linear Data Structures',
    order: 6,
    icon: 'align-justify',
    prerequisites: ['stacks'],
    estimatedHours: 8,
    importanceLevel: 'Medium',
    description: 'FIFO principle, circular queues, deques, sliding window maximums, and BFS queues.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'hashing',
    name: 'Hashing',
    category: 'Data Structures',
    order: 7,
    icon: 'hash',
    prerequisites: ['arrays'],
    estimatedHours: 8,
    importanceLevel: 'Critical',
    description: 'Direct addressing, hash maps, hash sets, collision resolution, frequency counting, and two-sum patterns.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'two-pointers',
    name: 'Two Pointers',
    category: 'Techniques',
    order: 8,
    icon: 'git-merge',
    prerequisites: ['arrays'],
    estimatedHours: 10,
    importanceLevel: 'Critical',
    description: 'Converging pointers, parallel pointers, 3-sum, container with most water, and trapping rainwater.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'sliding-window',
    name: 'Sliding Window',
    category: 'Techniques',
    order: 9,
    icon: 'maximize-2',
    prerequisites: ['arrays', 'two-pointers'],
    estimatedHours: 12,
    importanceLevel: 'Critical',
    description: 'Fixed-size and dynamically expanding/contracting windows for substring and subarray metrics.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'binary-search',
    name: 'Binary Search',
    category: 'Algorithms',
    order: 10,
    icon: 'crosshair',
    prerequisites: ['arrays', 'recursion'],
    estimatedHours: 14,
    importanceLevel: 'Critical',
    description: 'Lower/Upper bounds, rotated sorted arrays, search on answer space (Koko Bananas, Aggressive Cows).',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'trees',
    name: 'Trees',
    category: 'Hierarchical Data Structures',
    order: 11,
    icon: 'git-branch',
    prerequisites: ['recursion', 'queues'],
    estimatedHours: 16,
    importanceLevel: 'Critical',
    description: 'Binary trees, traversals (Inorder, Preorder, Postorder, Level Order), diameter, LCA, and views.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'binary-search-trees',
    name: 'Binary Search Trees',
    category: 'Hierarchical Data Structures',
    order: 12,
    icon: 'binary',
    prerequisites: ['trees', 'binary-search'],
    estimatedHours: 10,
    importanceLevel: 'High',
    description: 'BST property, search, insert, delete, validation, Kth smallest element, and LCA in BST.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'heaps',
    name: 'Heaps',
    category: 'Data Structures',
    order: 13,
    icon: 'mountain',
    prerequisites: ['trees', 'arrays'],
    estimatedHours: 10,
    importanceLevel: 'High',
    description: 'Min-heap, max-heap, heapify algorithm, Top K elements, median from data stream, and task scheduler.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'graphs',
    name: 'Graphs',
    category: 'Non-Linear Data Structures',
    order: 14,
    icon: 'network',
    prerequisites: ['trees', 'queues', 'hashing'],
    estimatedHours: 20,
    importanceLevel: 'Critical',
    description: 'Adjacency list/matrix, BFS, DFS, cycle detection, topological sort, Dijkstra, Bellman-Ford, Disjoint Set.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'dynamic-programming',
    name: 'Dynamic Programming',
    category: 'Advanced Paradigms',
    order: 15,
    icon: 'cpu',
    prerequisites: ['recursion', 'arrays'],
    estimatedHours: 24,
    importanceLevel: 'Critical',
    description: 'Memoization, tabulation, 1D DP, 2D Grid DP, 0/1 Knapsack, Longest Common Subsequence, and DP on Trees.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  },
  {
    slug: 'backtracking',
    name: 'Backtracking',
    category: 'Algorithmic Paradigms',
    order: 16,
    icon: 'undo-2',
    prerequisites: ['recursion', 'arrays'],
    estimatedHours: 12,
    importanceLevel: 'High',
    description: 'State-space exploration, N-Queens, Sudoku solver, subsets, permutations, and word search.',
    tags: ['Demonstration / MVP Seed', 'Core DAG']
  }
];

module.exports = topics;
