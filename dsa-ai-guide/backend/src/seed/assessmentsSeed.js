/**
 * Comprehensive Assessment and Quiz Seed Bank (145 Questions Total)
 * Structure:
 * - 5 Topic-wise Quizzes (10 questions each = 50 Qs):
 *   1. quiz-arrays-hashing: Arrays and Hashing Quiz (15 mins, passing score 70%)
 *   2. quiz-pointers-window: Two Pointers and Sliding Window Quiz (15 mins, passing score 70%)
 *   3. quiz-binary-search-sorting: Binary Search and Sorting Quiz (15 mins, passing score 70%)
 *   4. quiz-trees-graphs: Trees, BST and Graph Traversals Quiz (20 mins, passing score 70%)
 *   5. quiz-dp-greedy: Dynamic Programming and Greedy Algorithms Quiz (20 mins, passing score 70%)
 *
 * - 3 Mixed-Topic Assessments (15 questions each = 45 Qs):
 *   6. assessment-foundation-dsa: Foundation DSA Assessment (30 mins, passing score 70%)
 *   7. assessment-intermediate-patterns: Intermediate Algorithmic Patterns (35 mins, passing score 70%)
 *   8. assessment-advanced-synthesis: Advanced Algorithmic Synthesis (40 mins, passing score 75%)
 *
 * - 2 Timed Mock Assessments (20 questions each = 40 Qs):
 *   9. mock-faang-screening-1: FAANG Technical Screening Mock 1 (60 mins, passing score 75%)
 *   10. mock-faang-screening-2: FAANG Technical Screening Mock 2 (60 mins, passing score 75%)
 *
 * - 1 Diagnostic Benchmark Bank (10 Qs):
 *   11. diagnostic-dsa: Comprehensive Diagnostic Assessment (20 mins, passing score 60%)
 */

const assessments = [
  // =========================================================================
  // QUIZ 1: Arrays & Hashing (10 Qs) [quiz-arrays-hashing]
  // =========================================================================
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'What is the average time complexity of accessing an element in an array by its index, and why?',
    options: [
      { text: 'O(1) because contiguous memory allows direct pointer arithmetic base + index * size' },
      { text: 'O(log N) because CPU registers perform binary search on addresses' },
      { text: 'O(N) because memory bus must scan from the base address' },
      { text: 'O(1) only if the array is sorted' }
    ],
    correctOptionIndex: 0,
    explanation: 'Arrays allocate contiguous memory blocks. Element address is computed directly via Address = Base + Index * ElementSize in O(1) time.',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'hashing',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which collision resolution strategy stores collided elements in linked lists outside the primary hash table bucket array?',
    options: [
      { text: 'Linear Probing' },
      { text: 'Separate Chaining' },
      { text: 'Quadratic Probing' },
      { text: 'Double Hashing' }
    ],
    correctOptionIndex: 1,
    explanation: 'Separate chaining stores colliding entries in an external data structure (such as a linked list or balanced tree) at the corresponding bucket.',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is the maximum subarray sum produced by Kadane algorithm on nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]?',
    codeSnippet: 'cur = max_s = nums[0]\nfor x in nums[1:]:\n    cur = max(x, cur + x)\n    max_s = max(max_s, cur)',
    options: [
      { text: '4' },
      { text: '5' },
      { text: '6' },
      { text: '7' }
    ],
    correctOptionIndex: 2,
    explanation: 'The subarray [4, -1, 2, 1] sums to 4 + (-1) + 2 + 1 = 6, which is the global maximum.',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'hashing',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'To find two numbers in an unsorted array summing to target in O(N) time and O(N) space, which pattern is optimal?',
    options: [
      { text: 'Sort array and use two converging pointers' },
      { text: 'Hash Map storing complement = target - nums[i]' },
      { text: 'Prefix XOR table' },
      { text: 'Nested loops checking all index pairs' }
    ],
    correctOptionIndex: 1,
    explanation: 'A Hash Map allows O(1) average lookup for target - nums[i], yielding O(N) overall time without mutating array order.',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Easy',
    type: 'debugging',
    question: 'When resizing a dynamic array from capacity N to 2N, what is the amortized cost per append operation?',
    codeSnippet: 'if size == capacity:\n    reallocate(2 * capacity)',
    options: [
      { text: 'O(N)' },
      { text: 'O(1)' },
      { text: 'O(log N)' },
      { text: 'O(N^2)' }
    ],
    correctOptionIndex: 1,
    explanation: 'Doubling capacity occurs exponentially infrequently. Summing copying work across N appends gives 2N operations, yielding O(1) amortized cost per append.',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'hashing',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'In a hash table of size M containing N keys, what is the definition and expected effect of load factor lambda = N / M?',
    options: [
      { text: 'Higher lambda decreases memory usage but increases collision frequency' },
      { text: 'Higher lambda speeds up lookups to O(1/N)' },
      { text: 'Load factor has no effect when using open addressing' },
      { text: 'Lambda must always strictly equal 1.0' }
    ],
    correctOptionIndex: 0,
    explanation: 'Load factor lambda = N/M measures bucket density. When lambda exceeds a threshold (typically 0.7-0.75), collisions rise sharply, requiring rehashing.',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'code_completion',
    question: 'In the Dutch National Flag 3-way partition, what operation should follow when nums[mid] == 0?',
    codeSnippet: 'if nums[mid] == 0:\n    swap(nums[low], nums[mid])\n    # Missing statement',
    options: [
      { text: 'low++; mid++;' },
      { text: 'high--;' },
      { text: 'low++;' },
      { text: 'mid++;' }
    ],
    correctOptionIndex: 0,
    explanation: 'Because nums[low] is guaranteed to be 1 (already verified by mid), swapping it to mid allows both low and mid to increment safely.',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'hashing',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'Given nums = [1, 1, 1] and k = 2, how many contiguous subarrays have sum equal to k?',
    codeSnippet: 'ans = 0, cur = 0, freq = {0: 1}\nfor x in nums:\n    cur += x\n    ans += freq.get(cur - k, 0)\n    freq[cur] = freq.get(cur, 0) + 1',
    options: [
      { text: '1' },
      { text: '2' },
      { text: '3' },
      { text: '0' }
    ],
    correctOptionIndex: 1,
    explanation: 'Prefix sums are 1, 2, 3. At index 1, cur=2, diff=0 (found, ans=1). At index 2, cur=3, diff=1 (found, ans=2). Subarrays are nums[0..1] and nums[1..2].',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'How can an array of size N be rotated right by K positions in-place using O(1) auxiliary space?',
    options: [
      { text: 'Reverse entire array, reverse first k elements, then reverse remaining n-k elements' },
      { text: 'Cyclic bit shifts using bitwise operators' },
      { text: 'Push all elements to a queue and pop back' },
      { text: 'Sort the array using quicksort' }
    ],
    correctOptionIndex: 0,
    explanation: 'The 3-step reversal algorithm (reverse all, reverse 0..k-1, reverse k..n-1) achieves in-place rotation in O(N) time and O(1) space.',
    points: 10
  },
  {
    assessmentId: 'quiz-arrays-hashing',
    assessmentTitle: 'Arrays & Hashing Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'hashing',
    difficulty: 'Hard',
    type: 'complexity',
    question: 'What is the worst-case time complexity of hash table lookups under adversarial hash collisions?',
    options: [
      { text: 'O(N)' },
      { text: 'O(1)' },
      { text: 'O(log N)' },
      { text: 'O(N^2)' }
    ],
    correctOptionIndex: 0,
    explanation: 'If all keys hash to the same bucket, lookups degenerate into linear search through an N-length linked list in O(N) time.',
    points: 10
  },

  // =========================================================================
  // QUIZ 2: Two Pointers & Sliding Window (10 Qs) [quiz-pointers-window]
  // =========================================================================
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'two-pointers',
    difficulty: 'Easy',
    type: 'pattern_id',
    question: 'Which technique is ideal for checking if a string is a palindrome without allocating new string memory?',
    options: [
      { text: 'Converging Two Pointers starting at index 0 and index N-1' },
      { text: 'Fast and Slow Pointers' },
      { text: 'Dynamic Programming LCS' },
      { text: 'Monotonic Stack' }
    ],
    correctOptionIndex: 0,
    explanation: 'Two pointers converging inward compare characters symmetrically, using O(1) extra space and terminating in N/2 steps.',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'two-pointers',
    difficulty: 'Medium',
    type: 'debugging',
    question: 'In Container With Most Water, why do we increment left pointer when height[left] < height[right]?',
    codeSnippet: 'if height[l] < height[r]:\n    l += 1\nelse:\n    r -= 1',
    options: [
      { text: 'The shorter bar is the bottleneck; keeping it while decreasing width can never yield greater area' },
      { text: 'Because right pointer is always larger by index' },
      { text: 'To ensure pointers meet at the exact center' },
      { text: 'It prevents integer overflow' }
    ],
    correctOptionIndex: 0,
    explanation: 'Area is width * min(h[l], h[r]). If h[l] is shorter, moving r inward decreases width without possibility of increasing height past h[l].',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'sliding-window',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'What is the time complexity of sliding a fixed window of size K across an array of length N when updating window sum in O(1)?',
    options: [
      { text: 'O(N)' },
      { text: 'O(N * K)' },
      { text: 'O(N log K)' },
      { text: 'O(K)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Adding the incoming element and subtracting the outgoing element takes O(1) per step. Moving across N elements takes O(N) total time.',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'sliding-window',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is the length of the longest substring without repeating characters in s = "pwwkew"?',
    options: [
      { text: '3 ("wke")' },
      { text: '4 ("wkew")' },
      { text: '2 ("pw")' },
      { text: '5 ("pwwke")' }
    ],
    correctOptionIndex: 0,
    explanation: '"wke" has length 3 and contains no repeating characters. "pwke" is not a contiguous substring.',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'two-pointers',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the time complexity of the standard 3Sum algorithm using sorting and two pointers?',
    options: [
      { text: 'O(N^2)' },
      { text: 'O(N^3)' },
      { text: 'O(N log N)' },
      { text: 'O(N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Sorting takes O(N log N). For each of N fixed elements, two pointers scan the remainder in O(N), yielding O(N^2) total.',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'sliding-window',
    difficulty: 'Medium',
    type: 'code_completion',
    question: 'In dynamic sliding window, when a duplicate character is encountered at right, how should the left pointer advance?',
    codeSnippet: 'if ch in seen and seen[ch] >= left:\n    left = # Complete line',
    options: [
      { text: 'seen[ch] + 1' },
      { text: 'seen[ch]' },
      { text: 'right' },
      { text: 'left + 1' }
    ],
    correctOptionIndex: 0,
    explanation: 'The left pointer jumps directly past the previous occurrence of that character (seen[ch] + 1), avoiding step-by-step increments.',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'two-pointers',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'How many units of water can be trapped by elevation map [0,1,0,2,1,0,1,3,2,1,2,1]?',
    options: [
      { text: '6' },
      { text: '5' },
      { text: '7' },
      { text: '8' }
    ],
    correctOptionIndex: 0,
    explanation: 'Water trapped: index 2: 1 unit, index 4: 1 unit, index 5: 2 units, index 6: 1 unit, index 9: 1 unit. Total = 1 + 1 + 2 + 1 + 1 = 6.',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'sliding-window',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'In Minimum Window Substring, when is the left pointer contracted?',
    options: [
      { text: 'Only when the current window contains all required characters with required frequencies' },
      { text: 'Whenever a character not in string T is found' },
      { text: 'After every single step of the right pointer' },
      { text: 'When window size exceeds length of string T' }
    ],
    correctOptionIndex: 0,
    explanation: 'Once a valid window satisfies all character counts of T, left contracts to find the minimal valid window starting at that position.',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'two-pointers',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which of the following requires sorted input before Two Pointers can be applied directly?',
    options: [
      { text: 'Two Sum II (target pair in sorted array)' },
      { text: 'Valid Palindrome string check' },
      { text: 'Reverse string array' },
      { text: 'Remove duplicates from Linked List' }
    ],
    correctOptionIndex: 0,
    explanation: 'Two Sum II relies on the monotonic ordering of sums when moving left (sum increases) or right (sum decreases) pointers.',
    points: 10
  },
  {
    assessmentId: 'quiz-pointers-window',
    assessmentTitle: 'Two Pointers & Sliding Window Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'sliding-window',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'In variable sliding window with left and right pointers, why is the total time complexity O(N) even with nested while loops?',
    options: [
      { text: 'Both left and right pointers only move forward, visiting each element at most once' },
      { text: 'Because inner loops execute at compile time' },
      { text: 'Because window size is bounded by K' },
      { text: 'Because the string is converted to a hash set' }
    ],
    correctOptionIndex: 0,
    explanation: 'Amortized analysis: right pointer increments N times and left pointer increments at most N times. Total operations <= 2N = O(N).',
    points: 10
  },

  // =========================================================================
  // QUIZ 3: Binary Search & Sorting (10 Qs) [quiz-binary-search-sorting]
  // =========================================================================
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'binary-search',
    difficulty: 'Easy',
    type: 'debugging',
    question: 'Why is `mid = low + (high - low) / 2` preferred over `mid = (low + high) / 2` in typed languages like C++ and Java?',
    codeSnippet: 'int mid = (low + high) / 2;',
    options: [
      { text: 'It prevents integer overflow when low + high exceeds 2^31 - 1' },
      { text: 'It runs faster on modern x86 CPU architectures' },
      { text: 'It handles negative indices automatically' },
      { text: 'It rounds towards positive infinity' }
    ],
    correctOptionIndex: 0,
    explanation: 'If low and high are large positive numbers (e.g., INT_MAX - 10), low + high overflows into a negative value, causing out-of-bounds memory access.',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'binary-search',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'In Search in Rotated Sorted Array, what key invariant ensures O(log N) search?',
    options: [
      { text: 'At least one half [low, mid] or [mid, high] is guaranteed to be strictly sorted' },
      { text: 'The array must be unrotated before searching' },
      { text: 'The minimum element is always at index N/2' },
      { text: 'Target is always in the left half' }
    ],
    correctOptionIndex: 0,
    explanation: 'Any single rotation cuts a sorted array into two sorted pieces. Comparing nums[low] with nums[mid] identifies the uniformly sorted subarray.',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the worst-case time complexity of QuickSort when choosing the first element as pivot on already sorted input?',
    options: [
      { text: 'O(N^2)' },
      { text: 'O(N log N)' },
      { text: 'O(N)' },
      { text: 'O(log N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'With a bad pivot on sorted input, partitions degenerate into size 0 and size N-1, leading to an arithmetic sum 1 + 2 + ... + N = O(N^2).',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which sorting algorithm is stable and guarantees O(N log N) worst-case time complexity at the cost of O(N) extra space?',
    options: [
      { text: 'Merge Sort' },
      { text: 'Quick Sort' },
      { text: 'Heap Sort' },
      { text: 'Selection Sort' }
    ],
    correctOptionIndex: 0,
    explanation: 'Merge Sort divides arrays recursively and merges sorted halves with stability, maintaining O(N log N) worst case with O(N) auxiliary buffer.',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'After merging intervals [[1,3],[2,6],[8,10],[15,18]], how many disjoint intervals remain?',
    options: [
      { text: '3: [[1,6],[8,10],[15,18]]' },
      { text: '4' },
      { text: '2' },
      { text: '1' }
    ],
    correctOptionIndex: 0,
    explanation: '[1,3] and [2,6] overlap since 2 <= 3, merging into [1,6]. [8,10] and [15,18] are disjoint. Remaining count is 3.',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'binary-search',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In Binary Search on Answer Space (e.g. Koko Eating Bananas, Painter Partition), what property must the predicate function satisfy?',
    options: [
      { text: 'Monotonicity (boolean values change from False to True or True to False exactly once)' },
      { text: 'Linearity with slope 1' },
      { text: 'Periodicity' },
      { text: 'Strict positivity' }
    ],
    correctOptionIndex: 0,
    explanation: 'Binary search on answer requires monotonicity: if eating speed S is feasible, all speeds > S are also feasible (FFFFTTTT), allowing halving search space.',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'binary-search',
    difficulty: 'Hard',
    type: 'complexity',
    question: 'What is the optimal time complexity of finding the median of two sorted arrays of lengths M and N?',
    options: [
      { text: 'O(log(min(M, N)))' },
      { text: 'O(M + N)' },
      { text: 'O((M + N) log(M + N))' },
      { text: 'O(log M * log N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Binary searching the partition cut of the smaller array binary cuts search space in O(log(min(M, N))) steps with O(1) extra space.',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'code_completion',
    question: 'In Dutch National Flag sort, what operation is performed when nums[mid] == 2?',
    codeSnippet: 'elif nums[mid] == 2:\n    swap(nums[mid], nums[high])\n    # Missing line',
    options: [
      { text: 'high -= 1 (do not advance mid because swapped element at mid is uninspected)' },
      { text: 'high -= 1; mid += 1;' },
      { text: 'low += 1;' },
      { text: 'mid += 1;' }
    ],
    correctOptionIndex: 0,
    explanation: 'The element swapped from high has not yet been processed, so mid must NOT increment until the new value at mid is inspected.',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'binary-search',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'Given sorted nums = [1, 3, 5, 6], what index does standard lower_bound return for target = 5?',
    options: [
      { text: '2' },
      { text: '1' },
      { text: '3' },
      { text: '-1' }
    ],
    correctOptionIndex: 0,
    explanation: 'nums[2] is 5. Lower bound returns the first index where element >= target, which is 2.',
    points: 10
  },
  {
    assessmentId: 'quiz-binary-search-sorting',
    assessmentTitle: 'Binary Search & Sorting Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 15,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the auxiliary space complexity of In-Place HeapSort?',
    options: [
      { text: 'O(1)' },
      { text: 'O(N)' },
      { text: 'O(log N)' },
      { text: 'O(N log N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'HeapSort converts the input array into a max-heap in-place via heapify and repeatedly swaps the root with the end, using O(1) auxiliary space.',
    points: 10
  },

  // =========================================================================
  // QUIZ 4: Trees, BST & Graphs (10 Qs) [quiz-trees-graphs]
  // =========================================================================
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'trees',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which tree traversal visits the root node between visiting its left and right subtrees?',
    options: [
      { text: 'Inorder Traversal' },
      { text: 'Preorder Traversal' },
      { text: 'Postorder Traversal' },
      { text: 'Level Order Traversal' }
    ],
    correctOptionIndex: 0,
    explanation: 'Inorder traversal processes Left Subtree -> Root -> Right Subtree. On a valid BST, inorder traversal yields sorted ascending order.',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'binary-search-trees',
    difficulty: 'Medium',
    type: 'debugging',
    question: 'Why is checking `node.left.val < node.val < node.right.val` locally insufficient to validate a Binary Search Tree?',
    options: [
      { text: 'A node in a left subtree might be greater than an ancestor node higher up in the tree' },
      { text: 'It fails when tree height exceeds 10' },
      { text: 'It creates a cyclic dependency' },
      { text: 'BST property only applies to leaf nodes' }
    ],
    correctOptionIndex: 0,
    explanation: 'All descendants in the left subtree must be strictly less than the root ancestor. Top-down min/max boundary intervals are required.',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'Which algorithm is optimal for finding the shortest path in an unweighted directed graph from source S to target T?',
    options: [
      { text: 'Breadth-First Search (BFS)' },
      { text: 'Depth-First Search (DFS)' },
      { text: 'Dijkstra Algorithm' },
      { text: 'Bellman-Ford Algorithm' }
    ],
    correctOptionIndex: 0,
    explanation: 'Because all edge weights are identical (weight 1), BFS explores nodes layer-by-layer in increasing order of distance in O(V + E) time.',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'How many connected islands exist in grid [["1","1","0"],["1","0","0"],["0","0","1"]]?',
    options: [
      { text: '2' },
      { text: '1' },
      { text: '3' },
      { text: '4' }
    ],
    correctOptionIndex: 0,
    explanation: 'The top-left land cells (0,0), (0,1), (1,0) form one connected island. Cell (2,2) at bottom-right forms the second island. Total = 2.',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the time complexity of Kahn topological sort on a graph with V vertices and E edges?',
    options: [
      { text: 'O(V + E)' },
      { text: 'O(V * E)' },
      { text: 'O(V^2)' },
      { text: 'O(E log V)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Each vertex is queued and dequeued once, and each directed edge is traversed exactly once to decrement destination in-degrees: O(V + E).',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'trees',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'What is the maximum depth of a binary tree with root = [3, 9, 20, null, null, 15, 7]?',
    options: [
      { text: '3' },
      { text: '2' },
      { text: '4' },
      { text: '5' }
    ],
    correctOptionIndex: 0,
    explanation: 'Path 3 -> 20 -> 15 (or 7) has 3 nodes, yielding maximum depth 3.',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'graphs',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What does a cycle in a directed graph represent in Course Schedule?',
    options: [
      { text: 'Deadlock circular dependency preventing all courses from being completed' },
      { text: 'An isolated prerequisite' },
      { text: 'An optimal course schedule' },
      { text: 'Disconnected graph components' }
    ],
    correctOptionIndex: 0,
    explanation: 'If course A depends on B and B depends on A, neither can be taken first. A topological order exists if and only if the graph is a DAG (acyclic).',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'trees',
    difficulty: 'Hard',
    type: 'code_completion',
    question: 'In Binary Tree Maximum Path Sum, when computing branch gain to return to parent, why do we take max(0, gain)?',
    codeSnippet: 'left_gain = max(0, dfs(node.left))\nright_gain = max(0, dfs(node.right))',
    options: [
      { text: 'Negative subpath sums degrade total path sum, so negative branches are omitted' },
      { text: 'To prevent infinite recursion' },
      { text: 'Because node values are guaranteed positive' },
      { text: 'To handle null leaf pointers' }
    ],
    correctOptionIndex: 0,
    explanation: 'If a subtree sum is negative, including it in the path would decrease the path sum. Clamping with 0 represents choosing not to include that branch.',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'binary-search-trees',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the worst-case time complexity of searching in an unbalanced Binary Search Tree of N nodes?',
    options: [
      { text: 'O(N)' },
      { text: 'O(log N)' },
      { text: 'O(1)' },
      { text: 'O(N log N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'If elements are inserted in sorted order, the BST degenerates into a singly linked list with depth N, resulting in O(N) search time.',
    points: 10
  },
  {
    assessmentId: 'quiz-trees-graphs',
    assessmentTitle: 'Trees & Graphs Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which graph representation is most space-efficient for a sparse graph with V = 10^5 vertices and E = 2 * 10^5 edges?',
    options: [
      { text: 'Adjacency List (O(V + E) memory)' },
      { text: 'Adjacency Matrix (O(V^2) memory)' },
      { text: 'Incidence Matrix (O(V * E) memory)' },
      { text: 'Distance Table' }
    ],
    correctOptionIndex: 0,
    explanation: 'An Adjacency Matrix would require 10^10 entries (~10 GB), whereas an Adjacency List stores only existing edges: O(V + E) ~ 300,000 entries.',
    points: 10
  },

  // =========================================================================
  // QUIZ 5: Dynamic Programming & Greedy (10 Qs) [quiz-dp-greedy]
  // =========================================================================
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Easy',
    type: 'pattern_id',
    question: 'What two properties must a computational problem exhibit to be solvable using Dynamic Programming?',
    options: [
      { text: 'Optimal Substructure and Overlapping Subproblems' },
      { text: 'Greedy Choice Property and Divide-and-Conquer' },
      { text: 'Monotonicity and Convexity' },
      { text: 'Linear Independence and Acyclicity' }
    ],
    correctOptionIndex: 0,
    explanation: 'Optimal substructure means optimal solutions to subproblems combine into the overall optimal solution; overlapping subproblems means recursive solutions repeatedly solve identical subproblems.',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'In how many distinct ways can you climb a staircase of n = 4 steps taking 1 or 2 steps at a time?',
    options: [
      { text: '5' },
      { text: '3' },
      { text: '4' },
      { text: '8' }
    ],
    correctOptionIndex: 0,
    explanation: 'Fibonacci recurrence: f(1)=1, f(2)=2, f(3)=3, f(4)=5. Ways: 1111, 112, 121, 211, 22.',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'debugging',
    question: 'Why does greedy choice fail for Coin Change with coins = [1, 3, 4] and target amount = 6?',
    options: [
      { text: 'Greedy picks 4 + 1 + 1 (3 coins), but optimal is 3 + 3 (2 coins)' },
      { text: 'Greedy causes an infinite recursion loop' },
      { text: 'Coins must be sorted in descending order' },
      { text: 'Amounts greater than 5 require negative numbers' }
    ],
    correctOptionIndex: 0,
    explanation: 'Greedy greedily takes the largest coin <= 6 (which is 4), leaving remainder 2, solved by 1+1 (3 coins total). Optimal is two 3-cent coins (2 coins).',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In Jump Game, what invariant does the greedy state maintain?',
    codeSnippet: 'max_reach = max(max_reach, i + nums[i])',
    options: [
      { text: 'The farthest reachable array index from any visited index' },
      { text: 'The minimum jump count to the current index' },
      { text: 'The average jump capacity' },
      { text: 'The index with the largest value' }
    ],
    correctOptionIndex: 0,
    explanation: 'At each position i <= max_reach, the greedy choice expands the frontier to max(max_reach, i + nums[i]). If i > max_reach, unreachable.',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the optimal time complexity to find the Longest Increasing Subsequence length using patience sorting with binary search?',
    options: [
      { text: 'O(N log N)' },
      { text: 'O(N^2)' },
      { text: 'O(N)' },
      { text: 'O(2^N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Maintaining tails array and replacing elements via binary search (bisect_left) runs in O(log N) per element, taking O(N log N) total.',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Hard',
    type: 'complexity',
    question: 'What is the time and space complexity of the 2D Levenshtein Edit Distance table for strings of lengths M and N?',
    options: [
      { text: 'O(M * N) time and O(M * N) space (optimizable to O(min(M, N)) space)' },
      { text: 'O(M + N) time and O(1) space' },
      { text: 'O(3^(M+N)) time and O(M) space' },
      { text: 'O(M log N) time and O(N) space' }
    ],
    correctOptionIndex: 0,
    explanation: 'Filling the (M+1) x (N+1) table takes constant work per cell: O(M * N) time. Using two rows reduces space to O(min(M, N)).',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'Given gas = [1,2,3,4,5] and cost = [3,4,5,1,2], at which station index should the journey start?',
    options: [
      { text: 'Index 3' },
      { text: 'Index 0' },
      { text: 'Index 4' },
      { text: '-1' }
    ],
    correctOptionIndex: 0,
    explanation: 'Station 3 gives net gas: +3, +3, -2, -2, -2. Running sum never drops below zero, successfully completing the cycle.',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'code_completion',
    question: 'In 0/1 Knapsack problem with 1D DP array, why must the capacity loop run backwards from W down to weight[i]?',
    codeSnippet: 'for w in range(W, weight[i] - 1, -1):\n    dp[w] = max(dp[w], dp[w - weight[i]] + value[i])',
    options: [
      { text: 'To ensure each item is used at most once (prevents item from being counted multiple times in same step)' },
      { text: 'To process items in decreasing order of value' },
      { text: 'To prevent index out-of-bounds errors' },
      { text: 'It avoids dividing by zero' }
    ],
    correctOptionIndex: 0,
    explanation: 'In 0/1 Knapsack, iterating backwards ensures dp[w - weight[i]] comes from the previous item iteration, not the current one.',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'Why does the Candy distribution problem require two passes (left-to-right and right-to-left)?',
    options: [
      { text: 'Pass 1 satisfies the left neighbor condition; Pass 2 satisfies the right neighbor condition while preserving Pass 1 via max()' },
      { text: 'It sorts the array in O(N)' },
      { text: 'Because candies must alternate even and odd' },
      { text: 'It prevents using extra memory' }
    ],
    correctOptionIndex: 0,
    explanation: 'A child can have higher rating than both neighbors. Pass 1 handles left neighbor constraints. Pass 2 handles right neighbors using max(c[i], c[i+1]+1).',
    points: 10
  },
  {
    assessmentId: 'quiz-dp-greedy',
    assessmentTitle: 'DP & Greedy Mastery Quiz',
    assessmentType: 'topic_quiz',
    timeLimitMinutes: 20,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the time complexity of top-down memoized DP compared to bottom-up tabular DP for Coin Change?',
    options: [
      { text: 'Both have identical asymptotic time complexity O(amount * N), but bottom-up avoids recursion overhead' },
      { text: 'Top-down is exponential while bottom-up is linear' },
      { text: 'Top-down is always faster because it skips all subproblems' },
      { text: 'Bottom-up requires O(2^N) memory' }
    ],
    correctOptionIndex: 0,
    explanation: 'Both fill the same state space of size (amount). Top-down incurs function call stack overhead, while bottom-up uses cache-friendly array iteration.',
    points: 10
  },

  // =========================================================================
  // ASSESSMENT 1: Foundation DSA Assessment (15 Qs) [assessment-foundation-dsa]
  // =========================================================================
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'complexity-analysis',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'Which of the following asymptotic bounds represents the strictly fastest growing function as N approaches infinity?',
    options: [
      { text: 'O(2^N)' },
      { text: 'O(N^3)' },
      { text: 'O(N log N)' },
      { text: 'O(N^2)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Exponential growth O(2^N) strictly dominates all polynomial functions O(N^k) for large N.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the space complexity of reversing an array in-place using two pointers?',
    options: [
      { text: 'O(1)' },
      { text: 'O(N)' },
      { text: 'O(log N)' },
      { text: 'O(N^2)' }
    ],
    correctOptionIndex: 0,
    explanation: 'In-place two-pointer swap requires only two index variables, consuming constant O(1) auxiliary space.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'linked-lists',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the time complexity of deleting the first node (head) of a singly linked list when given the head pointer?',
    options: [
      { text: 'O(1)' },
      { text: 'O(N)' },
      { text: 'O(log N)' },
      { text: 'O(N^2)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Setting head = head.next removes the initial node in O(1) time without shifting any elements.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'linked-lists',
    difficulty: 'Easy',
    type: 'pattern_id',
    question: 'Which algorithm detects a cycle in a linked list using two pointers without extra memory?',
    options: [
      { text: 'Floyd Tortoise and Hare (Fast & Slow Pointers)' },
      { text: 'Dijkstra Shortest Path' },
      { text: 'Binary Search' },
      { text: 'Kadane Algorithm' }
    ],
    correctOptionIndex: 0,
    explanation: 'Floyd cycle detection advances slow by 1 and fast by 2. If a cycle exists, fast will lap and meet slow inside the cycle in O(N) time and O(1) space.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'stacks',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which fundamental principle defines the operation of a Stack data structure?',
    options: [
      { text: 'LIFO (Last-In, First-Out)' },
      { text: 'FIFO (First-In, First-Out)' },
      { text: 'LILO (Last-In, Last-Out)' },
      { text: 'Priority-based ordering' }
    ],
    correctOptionIndex: 0,
    explanation: 'Stacks operate under LIFO: the most recently pushed element is the first one popped.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'queues',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'How can a FIFO Queue be implemented using two LIFO Stacks with amortized O(1) performance?',
    options: [
      { text: 'Push to in-stack; when popping, transfer all elements to out-stack if out-stack is empty' },
      { text: 'Alternate pushing between stack 1 and stack 2' },
      { text: 'Sort the stack on every pop' },
      { text: 'Use a circular buffer in memory' }
    ],
    correctOptionIndex: 0,
    explanation: 'Transferring in-stack to out-stack reverses order to FIFO. Each element is moved at most twice, yielding amortized O(1) pop and push.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'recursion',
    difficulty: 'Easy',
    type: 'debugging',
    question: 'What critical bug occurs if a recursive function does not define or reach a valid base case?',
    codeSnippet: 'def countdown(n):\n    print(n)\n    return countdown(n - 1)',
    options: [
      { text: 'RecursionError: maximum recursion depth exceeded (Stack Overflow)' },
      { text: 'ZeroDivisionError' },
      { text: 'Compilation syntax error' },
      { text: 'Memory Leak without crash' }
    ],
    correctOptionIndex: 0,
    explanation: 'Without a base case, recursive stack frames continuously consume call stack memory until the runtime stack limit is exceeded.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'binary-search',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'How many comparisons does standard Binary Search perform in the worst case on an array of 1,024 sorted elements?',
    options: [
      { text: '11 (since ceil(log2(1024)) + 1 = 11)' },
      { text: '1024' },
      { text: '512' },
      { text: '32' }
    ],
    correctOptionIndex: 0,
    explanation: 'log2(1024) = 10. At most 10 or 11 comparisons are performed to locate the target or verify absence.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'hashing',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'What is returned by twoSum([2, 7, 11, 15], 9)?',
    options: [
      { text: '[0, 1]' },
      { text: '[1, 2]' },
      { text: '[0, 3]' },
      { text: '[]' }
    ],
    correctOptionIndex: 0,
    explanation: 'nums[0] + nums[1] = 2 + 7 = 9. Indices [0, 1] are returned.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'two-pointers',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'Is s = "race a car" a valid palindrome after removing non-alphanumeric characters and lowercase conversion?',
    options: [
      { text: 'False ("raceacar" is not equal to "racaecar")' },
      { text: 'True' },
      { text: 'None' },
      { text: 'Runtime Error' }
    ],
    correctOptionIndex: 0,
    explanation: 'Removing spaces yields "raceacar". Comparing from ends: \'r\'==\'r\', \'a\'==\'a\', \'c\'!=\'a\'. Return False.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'trees',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'In a complete binary tree of height H (root at height 0), what is the maximum number of nodes it can contain?',
    options: [
      { text: '2^(H + 1) - 1' },
      { text: '2^H' },
      { text: 'H^2' },
      { text: '2^(H - 1)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Sum of geometric series 2^0 + 2^1 + ... + 2^H = 2^(H+1) - 1 nodes.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'stacks',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'What is the validation result of string s = "([)]" using a stack?',
    options: [
      { text: 'Invalid (False) because \']\' does not match top of stack \'(\'' },
      { text: 'Valid (True)' },
      { text: 'Empty String' },
      { text: 'Stack Overflow' }
    ],
    correctOptionIndex: 0,
    explanation: 'Stack receives \'(\', then \'[\'. Next is \')\', which does not match stack top \'[\'. The brackets are incorrectly interleaved.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'What is the time complexity of finding the minimum element in an unsorted array of size N?',
    options: [
      { text: 'O(N)' },
      { text: 'O(1)' },
      { text: 'O(log N)' },
      { text: 'O(N log N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Every element must be inspected at least once in an unsorted array to guarantee finding the minimum, taking O(N) operations.',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'complexity-analysis',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'What is the solution to recurrence relation T(N) = 2 T(N/2) + O(N) by the Master Theorem?',
    options: [
      { text: 'O(N log N)' },
      { text: 'O(N)' },
      { text: 'O(N^2)' },
      { text: 'O(log N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Case 2 of Master Theorem: a = 2, b = 2, f(N) = O(N^1). log_b(a) = 1. Since f(N) = Theta(N^(log_b a)), T(N) = O(N log N) (Merge Sort).',
    points: 10
  },
  {
    assessmentId: 'assessment-foundation-dsa',
    assessmentTitle: 'Foundation DSA Comprehensive Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 30,
    passingScore: 70,
    topicSlug: 'linked-lists',
    difficulty: 'Easy',
    type: 'debugging',
    question: 'When reversing a linked list iteratively, what temporary reference must be preserved before changing curr.next?',
    codeSnippet: 'nxt = curr.next\ncurr.next = prev\nprev = curr\ncurr = nxt',
    options: [
      { text: 'curr.next must be saved in nxt before overwriting, or the remaining list is lost' },
      { text: 'prev must be cloned to deep memory' },
      { text: 'curr.val must be set to 0' },
      { text: 'head pointer must be deleted' }
    ],
    correctOptionIndex: 0,
    explanation: 'Reassigning curr.next to prev destroys the pointer to the rest of the list unless saved in a temporary variable first.',
    points: 10
  },

  // =========================================================================
  // ASSESSMENT 2: Intermediate Algorithmic Patterns (15 Qs) [assessment-intermediate-patterns]
  // =========================================================================
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'sliding-window',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'Which pattern solves "Longest Substring with At Most K Distinct Characters" in O(N) time?',
    options: [
      { text: 'Dynamic Sliding Window with frequency map' },
      { text: 'Binary Search on answer' },
      { text: 'Prefix Sum modulo K' },
      { text: 'Kadane algorithm' }
    ],
    correctOptionIndex: 0,
    explanation: 'Expanding right increments character counts. When len(counts) > K, left contracts until len(counts) <= K.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'stacks',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'For temperatures = [73, 74, 75, 71, 69, 72, 76, 73], what wait day count is computed for index 0 (temp 73)?',
    options: [
      { text: '1 day (74 is at index 1)' },
      { text: '2 days' },
      { text: '6 days' },
      { text: '0' }
    ],
    correctOptionIndex: 0,
    explanation: 'The very next day at index 1 has temperature 74 > 73, so the wait time is 1 - 0 = 1 day.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'binary-search',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'In rotated sorted array [4, 5, 6, 7, 0, 1, 2], what index is returned for target = 0?',
    options: [
      { text: '4' },
      { text: '3' },
      { text: '5' },
      { text: '-1' }
    ],
    correctOptionIndex: 0,
    explanation: 'Element 0 resides at index 4 in the array.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'heaps',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the time complexity of finding the Kth largest element in an array of size N using a min-heap of size K?',
    options: [
      { text: 'O(N log K)' },
      { text: 'O(N log N)' },
      { text: 'O(K log N)' },
      { text: 'O(N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Each of the N elements is pushed into a heap of capacity K, where heap operations cost O(log K). Total: O(N log K).',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'backtracking',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'How many total leaf states are visited when generating all subsets of an array containing N unique elements?',
    options: [
      { text: '2^N' },
      { text: 'N!' },
      { text: 'N^2' },
      { text: '2^(N - 1)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Each element has a binary choice (include or exclude), yielding 2^N total subsets.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What data structure is used to implement Breadth-First Search (BFS) graph traversal?',
    options: [
      { text: 'FIFO Queue' },
      { text: 'LIFO Stack' },
      { text: 'Min-Heap' },
      { text: 'Binary Search Tree' }
    ],
    correctOptionIndex: 0,
    explanation: 'BFS discovers vertices in increasing order of distance from the source using a FIFO queue.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'For coins = [1, 2, 5] and amount = 11, what is the minimum coin count computed by dynamic programming?',
    options: [
      { text: '3 (5 + 5 + 1)' },
      { text: '4 (5 + 2 + 2 + 2)' },
      { text: '2' },
      { text: '11' }
    ],
    correctOptionIndex: 0,
    explanation: 'Optimal combination is 5 + 5 + 1 = 11, using exactly 3 coins.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'hashing',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'To group anagrams together, what canonical representation can serve as the hash map key?',
    options: [
      { text: 'Sorted version of the string or tuple of 26 character frequency counts' },
      { text: 'Length of the string' },
      { text: 'First character of the string' },
      { text: 'Sum of ASCII values only (without frequency)' }
    ],
    correctOptionIndex: 0,
    explanation: 'All anagrams have identical character frequencies, producing the same sorted string or 26-element frequency tuple.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'two-pointers',
    difficulty: 'Medium',
    type: 'debugging',
    question: 'In 3Sum, why is sorting the array beneficial over a pure hash set approach?',
    options: [
      { text: 'It allows O(1) duplicate skipping and eliminates O(N^2) hash set collision overhead' },
      { text: 'Sorting changes the problem from O(N^2) to O(N)' },
      { text: 'Two pointers only works on trees' },
      { text: 'It prevents integer overflow' }
    ],
    correctOptionIndex: 0,
    explanation: 'When sorted, duplicate values appear consecutively, allowing simple while loops (`while nums[l] == nums[l-1]: l++`) to skip duplicate triplets.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'binary-search-trees',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'How do you find the Kth smallest element in a Binary Search Tree in O(H + K) time?',
    options: [
      { text: 'Inorder DFS traversal stopping at the Kth visited node' },
      { text: 'Postorder DFS traversal' },
      { text: 'Preorder DFS traversal' },
      { text: 'Sort all nodes with MergeSort' }
    ],
    correctOptionIndex: 0,
    explanation: 'Inorder traversal visits BST nodes in non-decreasing sorted order. Halting at step K yields the Kth smallest element.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'backtracking',
    difficulty: 'Medium',
    type: 'debugging',
    question: 'In Word Search DFS grid traversal, why must cell `board[r][c]` be restored after exploring neighboring paths?',
    codeSnippet: 'tmp = board[r][c]\nboard[r][c] = "#"\nres = dfs(r+1,c) or dfs(r-1,c) ...\nboard[r][c] = tmp',
    options: [
      { text: 'To unmark the cell so alternative search paths originating from different cells can use it' },
      { text: 'To release CPU cache lines' },
      { text: 'It prevents stack overflow' },
      { text: 'Python dictionaries require string values' }
    ],
    correctOptionIndex: 0,
    explanation: 'Backtracking invariant: cell state must be restored upon return so subsequent exploration branches see the original unaltered board.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is the maximum subarray sum in nums = [5, 4, -1, 7, 8]?',
    options: [
      { text: '23' },
      { text: '24' },
      { text: '15' },
      { text: '18' }
    ],
    correctOptionIndex: 0,
    explanation: 'Sum of all elements is 5 + 4 - 1 + 7 + 8 = 23.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'Can all courses be finished if numCourses = 2 and prerequisites = [[1, 0], [0, 1]]?',
    options: [
      { text: 'False (mutual dependency creates directed cycle [0 -> 1 -> 0])' },
      { text: 'True' },
      { text: 'None' },
      { text: 'Runtime Error' }
    ],
    correctOptionIndex: 0,
    explanation: 'Course 1 requires Course 0, and Course 0 requires Course 1. A directed cycle exists, making topological sort impossible.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is the length of Longest Increasing Subsequence in nums = [10, 9, 2, 5, 3, 7, 101, 18]?',
    options: [
      { text: '4 ([2, 3, 7, 101] or [2, 5, 7, 101])' },
      { text: '3' },
      { text: '5' },
      { text: '6' }
    ],
    correctOptionIndex: 0,
    explanation: 'Longest strictly increasing subsequence length is 4.',
    points: 10
  },
  {
    assessmentId: 'assessment-intermediate-patterns',
    assessmentTitle: 'Intermediate Algorithmic Patterns Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 35,
    passingScore: 70,
    topicSlug: 'heaps',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is the binary heap index formula for the left child and right child of node at index i (0-indexed array)?',
    options: [
      { text: 'Left = 2*i + 1, Right = 2*i + 2' },
      { text: 'Left = 2*i, Right = 2*i + 1' },
      { text: 'Left = i/2, Right = i/2 + 1' },
      { text: 'Left = i + 1, Right = i + 2' }
    ],
    correctOptionIndex: 0,
    explanation: 'In a 0-indexed complete binary tree stored in an array: Left Child = 2i + 1, Right Child = 2i + 2, Parent = floor((i - 1)/2).',
    points: 10
  },

  // =========================================================================
  // ASSESSMENT 3: Advanced Algorithmic Synthesis (15 Qs) [assessment-advanced-synthesis]
  // =========================================================================
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Hard',
    type: 'pattern_id',
    question: 'How can First Missing Positive be solved in O(N) time and strictly O(1) auxiliary space without extra arrays or hash sets?',
    options: [
      { text: 'Cyclic sort placing each positive number X into index X - 1 in-place' },
      { text: 'Bitwise XOR reduction' },
      { text: 'Merge sort with in-place linked lists' },
      { text: 'Dynamic programming memoization' }
    ],
    correctOptionIndex: 0,
    explanation: 'Using the array indices themselves as hash buckets (swapping nums[i] to nums[nums[i]-1]) places numbers 1..N at indices 0..N-1 in O(1) space.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'sliding-window',
    difficulty: 'Hard',
    type: 'complexity',
    question: 'In Minimum Window Substring, what is the exact time complexity in terms of string lengths |S| and |T|?',
    options: [
      { text: 'O(|S| + |T|)' },
      { text: 'O(|S| * |T|)' },
      { text: 'O(|S|^2)' },
      { text: 'O(|S| log |T|)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Building the frequency table of T takes O(|T|). Sliding the window over S moves each pointer at most |S| times, taking O(|S|). Total: O(|S| + |T|).',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'queues',
    difficulty: 'Hard',
    type: 'pattern_id',
    question: 'Which data structure finds the Sliding Window Maximum in O(N) total time across an array of length N and window size K?',
    options: [
      { text: 'Monotonic Decreasing Deque storing element indices' },
      { text: 'Max-Heap Priority Queue' },
      { text: 'Balanced Binary Search Tree (AVL)' },
      { text: 'Doubly Linked List without monotonicity' }
    ],
    correctOptionIndex: 0,
    explanation: 'A monotonic decreasing deque preserves indices of candidates in decreasing order of value. Each element is pushed and popped at most once: O(N) amortized.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'linked-lists',
    difficulty: 'Hard',
    type: 'complexity',
    question: 'What is the time complexity of merging K sorted linked lists with total N nodes using a Min-Heap?',
    options: [
      { text: 'O(N log K)' },
      { text: 'O(N * K)' },
      { text: 'O(N log N)' },
      { text: 'O(K log N)' }
    ],
    correctOptionIndex: 0,
    explanation: 'The min-heap holds at most K nodes (one per list). For all N nodes, extracting min and inserting next node costs O(log K), totaling O(N log K).',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'backtracking',
    difficulty: 'Hard',
    type: 'complexity',
    question: 'In the N-Queens problem, how do diagonal constraint sets prevent queen attacks in O(1) lookup time?',
    options: [
      { text: 'Positive diagonals share (row + col) and negative diagonals share (row - col)' },
      { text: 'By computing slope derivatives' },
      { text: 'By running BFS between queens' },
      { text: 'Through modular arithmetic mod N' }
    ],
    correctOptionIndex: 0,
    explanation: 'Along any \ diagonal, row - col is constant. Along any / diagonal, row + col is constant. Two sets provide instant O(1) conflict validation.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'heaps',
    difficulty: 'Hard',
    type: 'pattern_id',
    question: 'How does MedianFinder achieve O(log N) insertion and O(1) median query in a dynamic data stream?',
    options: [
      { text: 'Two balanced heaps: Max-Heap for lower half and Min-Heap for upper half' },
      { text: 'Dynamic array with insertion sort' },
      { text: 'Binary Search Tree without balancing' },
      { text: 'Sliding window queue' }
    ],
    correctOptionIndex: 0,
    explanation: 'Balancing small_half (max-heap) and large_half (min-heap) such that their sizes differ by at most 1 allows O(1) median retrieval from root values.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'graphs',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'Why does Bidirectional BFS drastically outperform standard BFS on large branching factor search spaces like Word Ladder?',
    options: [
      { text: 'It reduces the search frontier from O(b^d) to O(2 * b^(d/2)), exponentially shrinking state expansion' },
      { text: 'It sorts words alphabetically' },
      { text: 'It runs in parallel threads automatically' },
      { text: 'It eliminates cycles completely' }
    ],
    correctOptionIndex: 0,
    explanation: 'Searching simultaneously from start and target meets in the middle at depth d/2, reducing the volume of explored states by orders of magnitude.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'dynamic-programming',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'What is the minimum edit distance to convert word1 = "horse" to word2 = "ros"?',
    options: [
      { text: '3' },
      { text: '2' },
      { text: '4' },
      { text: '5' }
    ],
    correctOptionIndex: 0,
    explanation: 'Operations: replace \'h\' with \'r\' ("rorse"), remove \'r\' ("rose"), remove \'e\' ("ros"). Total 3 edits.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'trees',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'What is the maximum path sum in tree root = [-10, 9, 20, null, null, 15, 7]?',
    options: [
      { text: '42 (15 -> 20 -> 7)' },
      { text: '35' },
      { text: '20' },
      { text: '41' }
    ],
    correctOptionIndex: 0,
    explanation: 'The optimal path passes through 15 + 20 + 7 = 42, omitting the root (-10) and left child (9).',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'binary-search',
    difficulty: 'Hard',
    type: 'debugging',
    question: 'When partitioning two sorted arrays A and B to find the median, what condition confirms that the partition cut is optimal?',
    options: [
      { text: 'maxLeftA <= minRightB and maxLeftB <= minRightA' },
      { text: 'maxLeftA == minRightB' },
      { text: 'minRightA <= maxLeftB' },
      { text: 'A[mid] == B[mid]' }
    ],
    correctOptionIndex: 0,
    explanation: 'All elements in the left partition must be <= all elements in the right partition. Hence maxLeftA <= minRightB and maxLeftB <= minRightA.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'In Candy distribution for ratings = [1, 0, 2], what is the minimum total candy count?',
    options: [
      { text: '5 ([2, 1, 2])' },
      { text: '4' },
      { text: '6' },
      { text: '3' }
    ],
    correctOptionIndex: 0,
    explanation: 'Child 1 has rating 0 (gets 1 candy). Child 0 has rating 1 > 0 (gets 2 candies). Child 2 has rating 2 > 0 (gets 2 candies). Total = 2 + 1 + 2 = 5.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'two-pointers',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'In Trapping Rain Water two-pointer solution, why is it valid to compute trapped water using left_max when height[left] < height[right]?',
    options: [
      { text: 'Because right_max is guaranteed to be >= height[right] > height[left], so left_max is the true limiting boundary' },
      { text: 'Because left pointer has priority' },
      { text: 'Because rain falls from left to right' },
      { text: 'It ignores the right boundary completely' }
    ],
    correctOptionIndex: 0,
    explanation: 'Water height is min(left_max, right_max). When height[l] < height[r], right_max is guaranteed >= height[r] > height[l] >= left_max, so left_max is the bottleneck.',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'dynamic-programming',
    difficulty: 'Hard',
    type: 'pattern_id',
    question: 'Which DP state definition solves Longest Common Subsequence of strings s1 and s2?',
    options: [
      { text: 'dp[i][j] = length of LCS of prefixes s1[0..i-1] and s2[0..j-1]' },
      { text: 'dp[i] = length of LCS ending at index i' },
      { text: 'dp[i][j] = sum of ASCII values' },
      { text: 'dp[k] = hash value of common string' }
    ],
    correctOptionIndex: 0,
    explanation: 'If s1[i-1] == s2[j-1], dp[i][j] = 1 + dp[i-1][j-1]. Otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'graphs',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is the time complexity of Dijkstra algorithm implemented with a Min-Heap (Priority Queue)?',
    options: [
      { text: 'O((V + E) log V)' },
      { text: 'O(V^2)' },
      { text: 'O(V * E)' },
      { text: 'O(V + E)' }
    ],
    correctOptionIndex: 0,
    explanation: 'Each vertex is extracted from the min-heap in O(log V), and each edge relaxation updates the heap in O(log V), totaling O((V + E) log V).',
    points: 10
  },
  {
    assessmentId: 'assessment-advanced-synthesis',
    assessmentTitle: 'Advanced Algorithmic Synthesis Assessment',
    assessmentType: 'mixed_assessment',
    timeLimitMinutes: 40,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Hard',
    type: 'debugging',
    question: 'In Largest Rectangle in Histogram using monotonic stack, what width is computed when popping bar at index i?',
    codeSnippet: 'h = heights[stack.pop()]\nw = i if not stack else i - stack[-1] - 1\nmax_area = max(max_area, h * w)',
    options: [
      { text: 'Width extends between current index i (right smaller) and stack[-1] (left smaller): w = i - stack[-1] - 1' },
      { text: 'Width is simply i - stack.pop()' },
      { text: 'Width is fixed to 1' },
      { text: 'Width is length of heights array' }
    ],
    correctOptionIndex: 0,
    explanation: 'The monotonic increasing stack ensures all bars between stack[-1] + 1 and i - 1 are at least as tall as height h, giving width i - stack[-1] - 1.',
    points: 10
  },

  // =========================================================================
  // MOCK 1: FAANG Technical Screening Mock 1 (20 Qs) [mock-faang-screening-1]
  // =========================================================================
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'What is the time complexity of searching for an element in an unsorted array of size N?',
    options: [{ text: 'O(N)' }, { text: 'O(log N)' }, { text: 'O(1)' }, { text: 'O(N^2)' }],
    correctOptionIndex: 0,
    explanation: 'Linear scan requires inspecting up to N elements.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'hashing',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'What does twoSum([3, 2, 4], 6) return?',
    options: [{ text: '[1, 2]' }, { text: '[0, 1]' }, { text: '[0, 2]' }, { text: '[]' }],
    correctOptionIndex: 0,
    explanation: 'nums[1] + nums[2] = 2 + 4 = 6.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'two-pointers',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) in Container With Most Water?',
    options: [{ text: '49' }, { text: '48' }, { text: '56' }, { text: '40' }],
    correctOptionIndex: 0,
    explanation: 'Between index 1 (height 8) and index 8 (height 7): min(8,7) * (8 - 1) = 7 * 7 = 49.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'sliding-window',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is the length of the longest substring without repeating characters in "abcabcbb"?',
    options: [{ text: '3' }, { text: '4' }, { text: '2' }, { text: '1' }],
    correctOptionIndex: 0,
    explanation: '"abc" has length 3.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'binary-search',
    difficulty: 'Medium',
    type: 'debugging',
    question: 'In binary search, what update is made when target < nums[mid]?',
    options: [{ text: 'high = mid - 1' }, { text: 'low = mid + 1' }, { text: 'high = mid' }, { text: 'low = mid' }],
    correctOptionIndex: 0,
    explanation: 'Target must lie in the left half, so the upper bound contracts to mid - 1.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'Which algorithm partitions an array with 0s, 1s, and 2s in-place in a single pass?',
    options: [{ text: 'Dutch National Flag (3-way partition)' }, { text: 'Merge Sort' }, { text: 'Bubble Sort' }, { text: 'Binary Search' }],
    correctOptionIndex: 0,
    explanation: 'Dijkstra Dutch National Flag algorithm uses low, mid, and high pointers to sort 3 colors in O(N) time and O(1) space.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'linked-lists',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'How do you detect a cycle in a linked list in O(1) memory?',
    options: [{ text: 'Floyd cycle detection (slow and fast pointers)' }, { text: 'Hash set of node pointers' }, { text: 'Reverse the list' }, { text: 'Count nodes' }],
    correctOptionIndex: 0,
    explanation: 'Fast pointer moves 2 steps, slow moves 1. Meeting confirms a cycle in O(1) space.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'stacks',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'Is "()[]{}" valid parentheses?',
    options: [{ text: 'True' }, { text: 'False' }, { text: 'None' }, { text: 'Error' }],
    correctOptionIndex: 0,
    explanation: 'Every open bracket is correctly closed in matching order.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'queues',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the amortized time complexity of deque operations in Sliding Window Maximum?',
    options: [{ text: 'O(1) amortized per element' }, { text: 'O(N)' }, { text: 'O(K)' }, { text: 'O(log K)' }],
    correctOptionIndex: 0,
    explanation: 'Each element enters and leaves the deque at most once across the whole array.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'backtracking',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'How many subsets does nums = [1, 2, 3] have?',
    options: [{ text: '8' }, { text: '6' }, { text: '7' }, { text: '9' }],
    correctOptionIndex: 0,
    explanation: '2^3 = 8 subsets including empty set.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'trees',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the maximum depth of a tree with only a root node?',
    options: [{ text: '1' }, { text: '0' }, { text: '2' }, { text: '-1' }],
    correctOptionIndex: 0,
    explanation: 'By convention, a single node tree has depth 1 (or 0 edges). In LeetCode/IEEE standard it is 1 node.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'binary-search-trees',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What order do BST nodes appear in during Inorder Traversal?',
    options: [{ text: 'Strictly ascending sorted order' }, { text: 'Descending order' }, { text: 'Level order' }, { text: 'Reverse postorder' }],
    correctOptionIndex: 0,
    explanation: 'Inorder (Left, Node, Right) on a valid BST outputs keys in sorted order.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'heaps',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the time complexity to build a binary heap from an array of size N using Floyd heapify?',
    options: [{ text: 'O(N)' }, { text: 'O(N log N)' }, { text: 'O(log N)' }, { text: 'O(N^2)' }],
    correctOptionIndex: 0,
    explanation: 'Bottom-up heapify runs in linear O(N) time due to converging geometric series sum of node heights.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'How many connected islands exist in grid [["1","0"],["0","1"]] (diagonal adjacency not allowed)?',
    options: [{ text: '2' }, { text: '1' }, { text: '0' }, { text: '4' }],
    correctOptionIndex: 0,
    explanation: 'Since diagonal connections do not count, (0,0) and (1,1) are distinct islands.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'dynamic-programming',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'How many ways to climb n = 3 stairs taking 1 or 2 steps?',
    options: [{ text: '3' }, { text: '2' }, { text: '4' }, { text: '5' }],
    correctOptionIndex: 0,
    explanation: '1+1+1, 1+2, 2+1: exactly 3 distinct ways.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In unbounded knapsack (Coin Change), why do we iterate capacity forward from coin to amount?',
    options: [{ text: 'Because each coin denomination can be reused unlimited times' }, { text: 'To prevent using coins more than once' }, { text: 'To sort coins' }, { text: 'To save memory' }],
    correctOptionIndex: 0,
    explanation: 'Forward iteration allows an updated state dp[i - c] to be reused within the same pass, modeling infinite coin supply.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In Jump Game, if current index i > max_reach, what should be returned?',
    options: [{ text: 'False (stuck at unreachable index)' }, { text: 'True' }, { text: 'Reset max_reach' }, { text: 'Jump to end' }],
    correctOptionIndex: 0,
    explanation: 'If the current index exceeds the farthest reach possible from all previous steps, the end is unreachable.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'two-pointers',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'What is the trapped rain water for height = [4, 2, 0, 3, 2, 5]?',
    options: [{ text: '9' }, { text: '6' }, { text: '8' }, { text: '10' }],
    correctOptionIndex: 0,
    explanation: 'Between left wall 4 and right wall 5: index 1 traps 2, index 2 traps 4, index 3 traps 1, index 4 traps 2. 2+4+1+2 = 9.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'What is the first missing positive in nums = [3, 4, -1, 1]?',
    options: [{ text: '2' }, { text: '1' }, { text: '0' }, { text: '5' }],
    correctOptionIndex: 0,
    explanation: '1 is present, but 2 is absent. Smallest missing positive is 2.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-1',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #1',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'graphs',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'What is the length of shortest transformation sequence from "hit" to "cog" using ["hot","dot","dog","lot","log","cog"]?',
    options: [{ text: '5' }, { text: '4' }, { text: '6' }, { text: '0' }],
    correctOptionIndex: 0,
    explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog" has length 5.',
    points: 5
  },

  // =========================================================================
  // MOCK 2: FAANG Technical Screening Mock 2 (20 Qs) [mock-faang-screening-2]
  // =========================================================================
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'complexity-analysis',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the Big-O time complexity of nested loops where outer runs N times and inner runs 1, 2, ..., N times?',
    options: [{ text: 'O(N^2)' }, { text: 'O(N log N)' }, { text: 'O(N)' }, { text: 'O(2^N)' }],
    correctOptionIndex: 0,
    explanation: 'Sum = 1 + 2 + ... + N = N(N + 1)/2 = O(N^2).',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'After rotating [1, 2, 3, 4, 5, 6, 7] right by k = 3, what is the first element?',
    options: [{ text: '5' }, { text: '1' }, { text: '4' }, { text: '7' }],
    correctOptionIndex: 0,
    explanation: 'Rotated array is [5, 6, 7, 1, 2, 3, 4]. First element is 5.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'hashing',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What data structure provides O(1) average time lookups for key-value pairs?',
    options: [{ text: 'Hash Table / Map' }, { text: 'Binary Search Tree' }, { text: 'Skip List' }, { text: 'Array' }],
    correctOptionIndex: 0,
    explanation: 'Hash functions map keys to bucket indices, providing O(1) average insertion, lookup, and deletion.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'two-pointers',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'How many unique triplets sum to 0 in nums = [-1, 0, 1, 2, -1, -4]?',
    options: [{ text: '2: [[-1, -1, 2], [-1, 0, 1]]' }, { text: '1' }, { text: '3' }, { text: '4' }],
    correctOptionIndex: 0,
    explanation: 'The unique triplets summing to 0 are [-1, -1, 2] and [-1, 0, 1].',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'sliding-window',
    difficulty: 'Easy',
    type: 'output_prediction',
    question: 'What is the maximum average of subarray of size k = 4 in [1, 12, -5, -6, 50, 3]?',
    options: [{ text: '12.75' }, { text: '11.0' }, { text: '14.25' }, { text: '10.5' }],
    correctOptionIndex: 0,
    explanation: 'Subarray [12, -5, -6, 50] sums to 51. 51 / 4 = 12.75.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'binary-search',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'In rotated sorted array [4, 5, 6, 7, 0, 1, 2], what index contains target = 3?',
    options: [{ text: '-1' }, { text: '0' }, { text: '3' }, { text: '6' }],
    correctOptionIndex: 0,
    explanation: '3 is not in the array, so -1 is returned.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'After merging intervals [[1,4],[4,5]], what is the output?',
    options: [{ text: '[[1, 5]]' }, { text: '[[1, 4], [4, 5]]' }, { text: '[[4, 5]]' }, { text: '[[1, 4]]' }],
    correctOptionIndex: 0,
    explanation: 'Since 4 <= 4, they overlap and merge into [1, 5].',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'linked-lists',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'When reversing a linked list, what should the head.next point to initially?',
    options: [{ text: 'None / nullptr' }, { text: 'Head itself' }, { text: 'Tail' }, { text: 'Undefined' }],
    correctOptionIndex: 0,
    explanation: 'The original head becomes the new tail, so its next pointer must point to None.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'stacks',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'Which data structure finds the Next Greater Element for all array indices in O(N) time?',
    options: [{ text: 'Monotonic Decreasing Stack' }, { text: 'Binary Search Tree' }, { text: 'Min-Heap' }, { text: 'FIFO Queue' }],
    correctOptionIndex: 0,
    explanation: 'A monotonic decreasing stack resolves next greater elements upon discovering a strictly greater element.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'backtracking',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'How many distinct solutions exist for the 4-Queens puzzle?',
    options: [{ text: '2' }, { text: '1' }, { text: '4' }, { text: '0' }],
    correctOptionIndex: 0,
    explanation: 'There are exactly 2 non-attacking configurations for a 4x4 board.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'trees',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Inverting a binary tree swaps which child pointers of every node?',
    options: [{ text: 'Left and Right child pointers' }, { text: 'Parent and Child pointers' }, { text: 'Leaf nodes only' }, { text: 'Root node only' }],
    correctOptionIndex: 0,
    explanation: 'Invert binary tree mirrors the tree by swapping left and right subtrees recursively.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'binary-search-trees',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'Is binary tree [2, 1, 3] a valid BST?',
    options: [{ text: 'True' }, { text: 'False' }, { text: 'None' }, { text: 'Error' }],
    correctOptionIndex: 0,
    explanation: '1 < 2 < 3 satisfies all BST ordering properties.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'heaps',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is the 2nd largest element in nums = [3, 2, 1, 5, 6, 4]?',
    options: [{ text: '5' }, { text: '6' }, { text: '4' }, { text: '3' }],
    correctOptionIndex: 0,
    explanation: 'Sorted descending: 6, 5, 4, 3, 2, 1. The 2nd largest is 5.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'Which algorithm finds topological ordering in a DAG using in-degrees?',
    options: [{ text: 'Kahn Algorithm' }, { text: 'Kruskal Algorithm' }, { text: 'Prim Algorithm' }, { text: 'Floyd-Warshall' }],
    correctOptionIndex: 0,
    explanation: 'Kahn algorithm repeatedly dequeues vertices with in-degree 0 and decrements edge neighbors.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is coinChange([2], 3)?',
    options: [{ text: '-1' }, { text: '1' }, { text: '2' }, { text: '0' }],
    correctOptionIndex: 0,
    explanation: 'It is impossible to form an odd amount 3 using only 2-cent coins, returning -1.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'Can you reach the last index in nums = [3, 2, 1, 0, 4] in Jump Game?',
    options: [{ text: 'False' }, { text: 'True' }, { text: 'None' }, { text: 'Error' }],
    correctOptionIndex: 0,
    explanation: 'Index 3 has 0 jumps, and all preceding jumps lead to index 3. You cannot pass index 3.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'arrays',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'What is the minimum candies required for ratings = [1, 2, 2]?',
    options: [{ text: '4 ([1, 2, 1])' }, { text: '5' }, { text: '3' }, { text: '6' }],
    correctOptionIndex: 0,
    explanation: 'Children with equal ratings do not strictly require more candies than each other. [1, 2, 1] sums to 4.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'sliding-window',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'What is the minimum window substring in s = "ADOBECODEBANC" containing t = "ABC"?',
    options: [{ text: '"BANC"' }, { text: '"ADOBEC"' }, { text: '"CODEBA"' }, { text: '""' }],
    correctOptionIndex: 0,
    explanation: '"BANC" contains A, B, and C in length 4, which is the shortest valid window.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'binary-search',
    difficulty: 'Hard',
    type: 'output_prediction',
    question: 'What is the median of nums1 = [1, 3] and nums2 = [2]?',
    options: [{ text: '2.0' }, { text: '1.5' }, { text: '2.5' }, { text: '3.0' }],
    correctOptionIndex: 0,
    explanation: 'Merged array is [1, 2, 3]. The median is 2.0.',
    points: 5
  },
  {
    assessmentId: 'mock-faang-screening-2',
    assessmentTitle: 'FAANG Technical Screening Mock Exam #2',
    assessmentType: 'timed_mock',
    timeLimitMinutes: 60,
    passingScore: 75,
    topicSlug: 'dynamic-programming',
    difficulty: 'Hard',
    type: 'complexity',
    question: 'What is the time complexity to find Edit Distance between words of length M and N?',
    options: [{ text: 'O(M * N)' }, { text: 'O(M + N)' }, { text: 'O(M^2)' }, { text: 'O(log(M * N))' }],
    correctOptionIndex: 0,
    explanation: 'The 2D dynamic programming table has (M+1) x (N+1) cells, each filled in O(1) time.',
    points: 5
  },

  // =========================================================================
  // DIAGNOSTIC BENCHMARK (10 Qs) [diagnostic-dsa]
  // =========================================================================
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'complexity-analysis',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'What is the worst-case time complexity of inserting an element at the beginning of a dynamic array of size N?',
    options: [{ text: 'O(1)' }, { text: 'O(log N)' }, { text: 'O(N)' }, { text: 'O(N^2)' }],
    correctOptionIndex: 2,
    explanation: 'Inserting at index 0 requires shifting all existing N elements one position to the right.',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'two-pointers',
    difficulty: 'Easy',
    type: 'pattern_id',
    question: 'Which technique checks if a sorted array contains two numbers summing to target S in O(N) time and O(1) space?',
    options: [
      { text: 'Two Pointers (converging inward)' },
      { text: 'Nested For Loops' },
      { text: 'Binary Search on every element' },
      { text: 'Prefix Sum Array' }
    ],
    correctOptionIndex: 0,
    explanation: 'For sorted arrays, converging Two Pointers achieve O(N) time and O(1) auxiliary space.',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'binary-search',
    difficulty: 'Medium',
    type: 'debugging',
    question: 'Why is `mid = low + (high - low) / 2` preferred over `(low + high) / 2`?',
    options: [
      { text: 'It runs faster on ALU' },
      { text: 'It prevents integer overflow when low + high exceeds INT_MAX' },
      { text: 'It handles negative array indices' },
      { text: 'It automatically rounds down' }
    ],
    correctOptionIndex: 1,
    explanation: 'Prevents integer overflow when low + high exceeds standard integer maximum.',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'sliding-window',
    difficulty: 'Medium',
    type: 'output_prediction',
    question: 'What is the maximum sum of a subarray of size k = 3 in [2, 1, 5, 1, 3, 2]?',
    options: [{ text: '8' }, { text: '9' }, { text: '7' }, { text: '10' }],
    correctOptionIndex: 1,
    explanation: 'Subarray [5, 1, 3] gives 5 + 1 + 3 = 9.',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'linked-lists',
    difficulty: 'Easy',
    type: 'complexity',
    question: 'What is the auxiliary space complexity of Floyd Cycle Detection on a Linked List?',
    options: [{ text: 'O(1)' }, { text: 'O(N)' }, { text: 'O(log N)' }, { text: 'O(N^2)' }],
    correctOptionIndex: 0,
    explanation: 'Fast and slow pointers use only two pointer variables.',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'trees',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which traversal yields elements in ascending order in a valid Binary Search Tree?',
    options: [{ text: 'Inorder' }, { text: 'Preorder' }, { text: 'Postorder' }, { text: 'Level order' }],
    correctOptionIndex: 0,
    explanation: 'Inorder (Left -> Root -> Right) on a BST visits keys in non-decreasing order.',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'graphs',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'What algorithm detects cycles in a directed graph using in-degrees?',
    options: [{ text: 'Kahn Topological Sort' }, { text: 'Dijkstra Algorithm' }, { text: 'Kruskal Algorithm' }, { text: 'Bellman-Ford' }],
    correctOptionIndex: 0,
    explanation: 'Kahn algorithm uses in-degrees; if count of processed vertices < total vertices, a cycle exists.',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'dynamic-programming',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the time complexity of finding the Longest Increasing Subsequence using Patience Sorting with binary search?',
    options: [{ text: 'O(N log N)' }, { text: 'O(N^2)' }, { text: 'O(N)' }, { text: 'O(2^N)' }],
    correctOptionIndex: 0,
    explanation: 'Binary searching insertion position in the tails array takes O(N log N).',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'stacks',
    difficulty: 'Medium',
    type: 'pattern_id',
    question: 'What data structure finds the Next Greater Element for all elements in an array in linear time?',
    options: [{ text: 'Monotonic Stack' }, { text: 'Priority Queue' }, { text: 'Binary Search Tree' }, { text: 'Hash Table' }],
    correctOptionIndex: 0,
    explanation: 'A monotonic stack maintains elements in order, popping and resolving when a greater element arrives.',
    points: 10
  },
  {
    assessmentId: 'diagnostic-dsa',
    assessmentTitle: 'Comprehensive Diagnostic Assessment',
    assessmentType: 'diagnostic',
    timeLimitMinutes: 20,
    passingScore: 60,
    topicSlug: 'heaps',
    difficulty: 'Medium',
    type: 'complexity',
    question: 'What is the worst-case time complexity of extracting the minimum element from a binary Min-Heap of size N?',
    options: [{ text: 'O(log N)' }, { text: 'O(1)' }, { text: 'O(N)' }, { text: 'O(N log N)' }],
    correctOptionIndex: 0,
    explanation: 'Extracting min removes the root and bubbles down the last element in O(log N) steps.',
    points: 10
  }
];

module.exports = assessments;
