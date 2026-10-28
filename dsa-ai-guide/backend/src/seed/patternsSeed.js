const patterns = [
  {
    slug: 'two-sum-hashing',
    name: 'Two Sum / Direct Hashing',
    description: 'Using hash map lookup to check if complement (target - current) exists in O(1) time.',
    conceptGuide: 'Store visited elements in a map keyed by value. For each element x, query if target - x is in map.',
    visualType: 'hash',
    topicSlug: 'hashing',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)'
  },
  {
    slug: 'two-pointer',
    name: 'Two Pointer Technique',
    description: 'Pointers moving inward or in parallel to prune search space on sorted sequences.',
    conceptGuide: 'Initialize left and right boundaries. Conditionally advance pointers based on comparison.',
    visualType: 'pointers',
    topicSlug: 'two-pointers',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    slug: 'sliding-window',
    name: 'Fixed & Dynamic Sliding Window',
    description: 'Maintaining a valid window state while expanding right and shrinking left.',
    conceptGuide: 'Track window metrics (frequency, sum). Expand right until invalid, then contract left until valid.',
    visualType: 'window',
    topicSlug: 'sliding-window',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)'
  },
  {
    slug: 'prefix-sum',
    name: 'Prefix Sum / Running Cumulative',
    description: 'Precomputing prefix sums to answer range query sums in O(1) time.',
    conceptGuide: 'prefix[i] = prefix[i-1] + arr[i]. Sum(L..R) = prefix[R] - prefix[L-1].',
    visualType: 'array',
    topicSlug: 'arrays',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)'
  },
  {
    slug: 'binary-search-space',
    name: 'Binary Search On Answer Space',
    description: 'Binary searching across a monotonic boolean predicate range [low, high].',
    conceptGuide: 'Define isPossible(mid) function. Binary search between minimal and maximal possible answer.',
    visualType: 'binary-search',
    topicSlug: 'binary-search',
    timeComplexity: 'O(N log(range))',
    spaceComplexity: 'O(1)'
  },
  {
    slug: 'fast-slow-pointer',
    name: 'Fast & Slow Pointers (Floyd Cycle Detection)',
    description: 'Two pointers moving at different speeds (1x vs 2x) to find cycles or midpoints.',
    conceptGuide: 'If slow and fast pointers meet, a cycle exists. To find cycle start, reset one pointer to head.',
    visualType: 'linked-list',
    topicSlug: 'linked-list',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    slug: 'monotonic-stack',
    name: 'Monotonic Stack / Queue',
    description: 'Maintaining elements in strictly increasing or decreasing order in a stack.',
    conceptGuide: 'Pop elements from stack that violate the monotonic invariant to find Next Greater / Smaller Element in O(N).',
    visualType: 'stack',
    topicSlug: 'stack',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)'
  },
  {
    slug: 'top-k-heap',
    name: 'Top K Elements / Min-Max Heap',
    description: 'Using a heap of size K to find Kth largest or smallest elements efficiently.',
    conceptGuide: 'Maintain a min-heap of size K for K largest elements. New elements pushed if greater than root.',
    visualType: 'heap',
    topicSlug: 'heap-priority-queue',
    timeComplexity: 'O(N log K)',
    spaceComplexity: 'O(K)'
  },
  {
    slug: 'bfs-graph-tree',
    name: 'Breadth First Search (BFS)',
    description: 'Level by level exploration using a FIFO queue to compute shortest paths in unweighted graphs.',
    conceptGuide: 'Push source node to queue. While queue not empty, pop current and push unvisited neighbors.',
    visualType: 'tree',
    topicSlug: 'graphs',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)'
  },
  {
    slug: 'dfs-graph-tree',
    name: 'Depth First Search (DFS)',
    description: 'Deep recursive traversal exploring branches to leaf nodes before backtracking.',
    conceptGuide: 'Explore deeply along each branch using recursion or an explicit stack. Useful for component counting.',
    visualType: 'tree',
    topicSlug: 'graphs',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)'
  },
  {
    slug: 'backtracking-state',
    name: 'Backtracking with State Pruning',
    description: 'Building candidate solutions incrementally and undoing choices that fail constraints.',
    conceptGuide: 'Choose -> Explore -> Unchoose pattern to search combinatorial solution spaces.',
    visualType: 'tree',
    topicSlug: 'backtracking',
    timeComplexity: 'O(2^N) / O(N!)',
    spaceComplexity: 'O(N)'
  },
  {
    slug: 'dp-memoization-tabulation',
    name: 'DP (1D / 2D / Knapsack / Subsequences)',
    description: 'Solving complex problems by breaking them down into overlapping subproblems with optimal substructure.',
    conceptGuide: 'Define state dp[i], identify base case, write transition relation, and memoize/tabulate.',
    visualType: 'grid',
    topicSlug: 'dynamic-programming',
    timeComplexity: 'O(N) or O(N*M)',
    spaceComplexity: 'O(N) or O(N*M)'
  }
];

module.exports = patterns;
