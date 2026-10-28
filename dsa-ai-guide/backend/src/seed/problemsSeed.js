/**
 * DSA AI Guide — Complete Curated Problem Bank (44 Problems)
 * Spans all 14 requested topic areas across Easy, Medium, and Hard difficulties:
 * 1. Arrays and Strings
 * 2. Hashing
 * 3. Two Pointers
 * 4. Sliding Window
 * 5. Binary Search
 * 6. Sorting
 * 7. Linked Lists
 * 8. Stacks and Queues
 * 9. Recursion and Backtracking
 * 10. Trees and Binary Search Trees
 * 11. Heaps
 * 12. Graphs and BFS/DFS
 * 13. Greedy Algorithms
 * 14. Dynamic Programming
 *
 * Each problem includes:
 * - Unique slug, title, difficulty, topicSlug, patternSlug
 * - Problem description, constraints, inputFormat, outputFormat
 * - At least 2 sample test cases (input, output, explanation)
 * - At least 2 hidden test cases for code evaluation
 * - 5-tier progressive Socratic hints
 * - Starter code for Python, C++, Java, JavaScript
 * - Verified reference solution code
 * - Optimal time and space complexity
 * - Companies, tags, order
 */

const problems = [
  // ==========================================
  // 1. ARRAYS AND STRINGS
  // ==========================================
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    topicSlug: 'arrays',
    patternSlug: 'kadanes-algorithm',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/maximum-subarray/',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    inputFormat: 'An array of integers nums.',
    outputFormat: 'An integer representing the maximum subarray sum.',
    sampleTestCases: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
      { input: 'nums = [-1,-2,-3]', output: '-1' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'A brute force checks all O(N^2) subarrays. Notice that a negative prefix never helps maximize a future sum.' },
      { level: 2, title: 'Pattern', hintText: 'This is Kadane Algorithm — a dynamic programming greedy scan.' },
      { level: 3, title: 'Approach', hintText: 'Keep a running current_sum. At each index, either extend current_sum by adding nums[i] or restart at nums[i].' },
      { level: 4, title: 'Pseudo-code', hintText: 'max_sum = current_sum = nums[0]; for x in nums[1:]: current_sum = max(x, current_sum + x); max_sum = max(max_sum, current_sum); return max_sum;' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass through array. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write your code here\n        pass',
      cpp: 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
      javascript: 'var maxSubArray = function(nums) {\n    // Write your code here\n};'
    },
    solutionCode: {
      python: 'def maxSubArray(nums):\n    cur = max_s = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        max_s = max(max_s, cur)\n    return max_s',
      cpp: 'int maxSubArray(vector<int>& nums) {\n    int cur = nums[0], max_s = nums[0];\n    for (int i = 1; i < nums.size(); ++i) {\n        cur = max(nums[i], cur + nums[i]);\n        max_s = max(max_s, cur);\n    }\n    return max_s;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Apple', 'Google'],
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    order: 1
  },
  {
    title: 'Merge Sorted Array',
    slug: 'merge-sorted-array',
    topicSlug: 'arrays',
    patternSlug: 'two-pointers-reverse',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/merge-sorted-array/',
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order inside nums1 in-place.',
    constraints: ['nums1.length == m + n', 'nums2.length == n', '0 <= m, n <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
    inputFormat: 'nums1 with m elements and n trailing zeroes, m, nums2 of size n, n.',
    outputFormat: 'In-place modified nums1.',
    sampleTestCases: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]', explanation: 'The arrays being merged are [1,2,3] and [2,5,6].' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]', explanation: 'Result is [1].' }
    ],
    hiddenTestCases: [
      { input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]' },
      { input: 'nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3', output: '[1,2,3,4,5,6]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'If you merge from front to back, you overwrite elements in nums1. Can you merge from the back?' },
      { level: 2, title: 'Pattern', hintText: 'Reverse Three Pointers: point to the end of nums1 valid elements (m-1), end of nums2 (n-1), and end of array (m+n-1).' },
      { level: 3, title: 'Approach', hintText: 'Compare nums1[p1] and nums2[p2], place the larger at nums1[p], and decrement pointers.' },
      { level: 4, title: 'Pseudo-code', hintText: 'p1 = m-1, p2 = n-1, p = m+n-1; while p2 >= 0: if p1 >= 0 and nums1[p1] > nums2[p2]: nums1[p] = nums1[p1]; p1 -= 1 else: nums1[p] = nums2[p2]; p2 -= 1; p -= 1;' },
      { level: 5, title: 'Full Solution', hintText: 'In-place backward three pointer fill. Time: O(M+N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n        # Modify nums1 in-place\n        pass',
      cpp: 'class Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        // Modify nums1 in-place\n    }\n};',
      java: 'class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        // Modify nums1 in-place\n    }\n}',
      javascript: 'var merge = function(nums1, m, nums2, n) {\n    // Modify nums1 in-place\n};'
    },
    solutionCode: {
      python: 'def merge(nums1, m, nums2, n):\n    p1, p2, p = m - 1, n - 1, m + n - 1\n    while p2 >= 0:\n        if p1 >= 0 and nums1[p1] > nums2[p2]:\n            nums1[p] = nums1[p1]\n            p1 -= 1\n        else:\n            nums1[p] = nums2[p2]\n            p2 -= 1\n        p -= 1',
      cpp: 'void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    int p1 = m - 1, p2 = n - 1, p = m + n - 1;\n    while (p2 >= 0) {\n        if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n        else nums1[p--] = nums2[p2--];\n    }\n}'
    },
    optimalTimeComplexity: 'O(M+N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Facebook', 'Microsoft', 'Bloomberg'],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    order: 2
  },
  {
    title: 'Rotate Array',
    slug: 'rotate-array',
    topicSlug: 'arrays',
    patternSlug: 'array-reversal',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/rotate-array/',
    description: 'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.',
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
    inputFormat: 'Array nums and non-negative integer k.',
    outputFormat: 'Modified array nums in-place.',
    sampleTestCases: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]', explanation: 'Rotate 3 steps right.' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]', explanation: 'Rotate 2 steps right.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1,2], k = 3', output: '[2,1]' },
      { input: 'nums = [1], k = 0', output: '[1]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Rotating by k = k % n steps means the last k elements move to the front.' },
      { level: 2, title: 'Pattern', hintText: 'Triple Reversal algorithm: reverse entire array, then reverse first k, then reverse remaining n-k.' },
      { level: 3, title: 'Approach', hintText: 'Step 1: reverse(0, n-1). Step 2: reverse(0, k-1). Step 3: reverse(k, n-1).' },
      { level: 4, title: 'Pseudo-code', hintText: 'k = k % n; reverse(nums, 0, n-1); reverse(nums, 0, k-1); reverse(nums, k, n-1);' },
      { level: 5, title: 'Full Solution', hintText: 'In-place rotation in O(N) time and O(1) extra space.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def rotate(self, nums: list[int], k: int) -> None:\n        # Modify nums in-place\n        pass',
      cpp: 'class Solution {\npublic:\n    void rotate(vector<int>& nums, int k) {\n        // Modify nums in-place\n    }\n};',
      java: 'class Solution {\n    public void rotate(int[] nums, int k) {\n        // Modify nums in-place\n    }\n}',
      javascript: 'var rotate = function(nums, k) {\n    // Modify nums in-place\n};'
    },
    solutionCode: {
      python: 'def rotate(nums, k):\n    n = len(nums)\n    k %= n\n    def rev(l, r):\n        while l < r:\n            nums[l], nums[r] = nums[r], nums[l]\n            l += 1; r -= 1\n    rev(0, n - 1)\n    rev(0, k - 1)\n    rev(k, n - 1)',
      cpp: 'void rotate(vector<int>& nums, int k) {\n    k %= nums.size();\n    reverse(nums.begin(), nums.end());\n    reverse(nums.begin(), nums.begin() + k);\n    reverse(nums.begin() + k, nums.end());\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Cisco'],
    tags: ['Array', 'Math', 'Two Pointers'],
    order: 3
  },
  {
    title: 'First Missing Positive',
    slug: 'first-missing-positive',
    topicSlug: 'arrays',
    patternSlug: 'cyclic-sort-indexing',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/first-missing-positive/',
    description: 'Given an unsorted integer array nums, return the smallest positive integer that is not present in nums. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.',
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
    inputFormat: 'Array of integers nums.',
    outputFormat: 'Smallest missing positive integer.',
    sampleTestCases: [
      { input: 'nums = [1,2,0]', output: '3', explanation: 'Numbers in range [1,2] are present; 3 is the smallest positive missing.' },
      { input: 'nums = [3,4,-1,1]', output: '2', explanation: '1 is in the array, but 2 is missing.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [7,8,9,11,12]', output: '1' },
      { input: 'nums = [1]', output: '2' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'For an array of length N, the answer must be in the range [1, N+1].' },
      { level: 2, title: 'Pattern', hintText: 'Index as Hash Key (Cyclic Sort): place number x at index x - 1.' },
      { level: 3, title: 'Approach', hintText: 'Iterate i from 0 to N-1. While nums[i] is in [1, N] and nums[nums[i]-1] != nums[i], swap nums[i] and nums[nums[i]-1].' },
      { level: 4, title: 'Pseudo-code', hintText: 'for i in range(n): while 1 <= nums[i] <= n and nums[nums[i]-1] != nums[i]: swap(i, nums[i]-1); for i in range(n): if nums[i] != i+1: return i+1; return n+1;' },
      { level: 5, title: 'Full Solution', hintText: 'Every number is placed at most once, yielding O(N) time with O(1) space.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def firstMissingPositive(self, nums: list[int]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        return 1;\n    }\n};',
      java: 'class Solution {\n    public int firstMissingPositive(int[] nums) {\n        return 1;\n    }\n}',
      javascript: 'var firstMissingPositive = function(nums) {\n};'
    },
    solutionCode: {
      python: 'def firstMissingPositive(nums):\n    n = len(nums)\n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n            idx = nums[i] - 1\n            nums[i], nums[idx] = nums[idx], nums[i]\n    for i in range(n):\n        if nums[i] != i + 1:\n            return i + 1\n    return n + 1',
      cpp: 'int firstMissingPositive(vector<int>& nums) {\n    int n = nums.size();\n    for (int i = 0; i < n; ++i) {\n        while (nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i]) {\n            swap(nums[i], nums[nums[i]-1]);\n        }\n    }\n    for (int i = 0; i < n; ++i) if (nums[i] != i + 1) return i + 1;\n    return n + 1;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Google', 'Amazon', 'Meta'],
    tags: ['Array', 'Hash Table'],
    order: 4
  },

  // ==========================================
  // 2. HASHING
  // ==========================================
  {
    title: 'Two Sum',
    slug: 'two-sum',
    topicSlug: 'hashing',
    patternSlug: 'two-sum-hashing',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/two-sum/',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    inputFormat: 'Array nums and target integer.',
    outputFormat: 'Array of two indices [i, j].',
    sampleTestCases: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9, so return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6, so return [1, 2].' }
    ],
    hiddenTestCases: [
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
      { input: 'nums = [1,5,8,3], target = 4', output: '[0,3]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'A brute force checks all pairs in O(n^2). Use a hash map for O(1) lookups.' },
      { level: 2, title: 'Pattern', hintText: 'Direct Hash Map Lookup: store seen elements and their indices.' },
      { level: 3, title: 'Approach', hintText: 'For each number x at index i, compute complement = target - x. Check if complement exists in the map.' },
      { level: 4, title: 'Pseudo-code', hintText: 'seen = {}; for i, x in enumerate(nums): if target - x in seen: return [seen[target - x], i]; seen[x] = i' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass hash map. Time: O(N), Space: O(N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}',
      javascript: 'var twoSum = function(nums, target) {\n};'
    },
    solutionCode: {
      python: 'def twoSum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        diff = target - x\n        if diff in seen:\n            return [seen[diff], i]\n        seen[x] = i\n    return []',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); ++i) {\n        int diff = target - nums[i];\n        if (seen.count(diff)) return {seen[diff], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Google', 'Amazon', 'Apple', 'Meta', 'Microsoft'],
    tags: ['Array', 'Hash Table'],
    order: 5
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    topicSlug: 'hashing',
    patternSlug: 'hash-map-categorization',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/group-anagrams/',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    inputFormat: 'Array of strings strs.',
    outputFormat: 'List of groups of strings.',
    sampleTestCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Group words with the same letter frequencies.' },
      { input: 'strs = [""]', output: '[[""]]', explanation: 'Single empty string.' }
    ],
    hiddenTestCases: [
      { input: 'strs = ["a"]', output: '[["a"]]' },
      { input: 'strs = ["cab","tin","pew","duh","may","ill","buy","bar","max","doc"]', output: '[["cab"],["tin"],["pew"],["duh"],["may"],["ill"],["buy"],["bar"],["max"],["doc"]]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Two words are anagrams if and only if their sorted versions are identical, or their character counts match.' },
      { level: 2, title: 'Pattern', hintText: 'Hash Map with Canonical Key representation (e.g. sorted string or tuple of 26 character frequencies).' },
      { level: 3, title: 'Approach', hintText: 'Map key = tuple(count_chars) or "".join(sorted(s)) to list of matching original strings.' },
      { level: 4, title: 'Pseudo-code', hintText: 'groups = defaultdict(list); for s in strs: groups[tuple(sorted(s))].append(s); return list(groups.values());' },
      { level: 5, title: 'Full Solution', hintText: 'Time: O(N * K log K) with sorting or O(N * K) with 26-char counting. Space: O(N * K).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}',
      javascript: 'var groupAnagrams = function(strs) {\n};'
    },
    solutionCode: {
      python: 'from collections import defaultdict\ndef groupAnagrams(strs):\n    groups = defaultdict(list)\n    for s in strs:\n        groups[tuple(sorted(s))].append(s)\n    return list(groups.values())',
      cpp: 'vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> groups;\n    for (auto& s : strs) {\n        string k = s;\n        sort(k.begin(), k.end());\n        groups[k].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& p : groups) res.push_back(p.second);\n    return res;\n}'
    },
    optimalTimeComplexity: 'O(N * K log K)',
    optimalSpaceComplexity: 'O(N * K)',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    order: 6
  },
  {
    title: 'Subarray Sum Equals K',
    slug: 'subarray-sum-equals-k',
    topicSlug: 'hashing',
    patternSlug: 'prefix-sum-hashmap',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. A subarray is a contiguous non-empty sequence of elements within an array.',
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    inputFormat: 'Array of integers nums and integer k.',
    outputFormat: 'Total number of valid subarrays.',
    sampleTestCases: [
      { input: 'nums = [1,1,1], k = 2', output: '2', explanation: 'Subarrays [1,1] at indices [0,1] and [1,2] have sum 2.' },
      { input: 'nums = [1,2,3], k = 3', output: '2', explanation: 'Subarrays [1,2] and [3] both equal 3.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1,-1,0], k = 0', output: '3' },
      { input: 'nums = [3], k = 3', output: '1' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'The sum of subarray nums[i..j] is prefix_sum[j] - prefix_sum[i-1].' },
      { level: 2, title: 'Pattern', hintText: 'Prefix Sum combined with Hash Map frequency counter.' },
      { level: 3, title: 'Approach', hintText: 'If current_prefix_sum - k was seen previously X times, there are X subarrays ending at current index with sum k.' },
      { level: 4, title: 'Pseudo-code', hintText: 'count = 0, cur = 0, freq = {0: 1}; for x in nums: cur += x; count += freq.get(cur - k, 0); freq[cur] = freq.get(cur, 0) + 1; return count;' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass prefix-sum frequency map. Time: O(N), Space: O(N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int subarraySum(int[] nums, int k) {\n        return 0;\n    }\n}',
      javascript: 'var subarraySum = function(nums, k) {\n};'
    },
    solutionCode: {
      python: 'def subarraySum(nums, k):\n    ans, cur = 0, 0\n    freq = {0: 1}\n    for x in nums:\n        cur += x\n        ans += freq.get(cur - k, 0)\n        freq[cur] = freq.get(cur, 0) + 1\n    return ans',
      cpp: 'int subarraySum(vector<int>& nums, int k) {\n    unordered_map<int, int> freq{{0, 1}};\n    int ans = 0, cur = 0;\n    for (int x : nums) {\n        cur += x;\n        if (freq.count(cur - k)) ans += freq[cur - k];\n        freq[cur]++;\n    }\n    return ans;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Meta', 'Amazon', 'Google'],
    tags: ['Array', 'Hash Table', 'Prefix Sum'],
    order: 7
  },

  // ==========================================
  // 3. TWO POINTERS
  // ==========================================
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    topicSlug: 'two-pointers',
    patternSlug: 'converging-pointers',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/valid-palindrome/',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.',
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    inputFormat: 'String s.',
    outputFormat: 'Boolean true or false.',
    sampleTestCases: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    hiddenTestCases: [
      { input: 's = " "', output: 'true' },
      { input: 's = "0P"', output: 'false' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Ignore case and non-alphanumeric characters, then check symmetry from both ends.' },
      { level: 2, title: 'Pattern', hintText: 'Converging Two Pointers (left = 0, right = n-1).' },
      { level: 3, title: 'Approach', hintText: 'Skip non-alphanumeric characters on left and right, then compare lowercased characters.' },
      { level: 4, title: 'Pseudo-code', hintText: 'l, r = 0, len(s)-1; while l < r: while l < r and not s[l].isalnum(): l += 1; while l < r and not s[r].isalnum(): r -= 1; if s[l].lower() != s[r].lower(): return False; l += 1; r -= 1; return True;' },
      { level: 5, title: 'Full Solution', hintText: 'In-place two pointer scan without creating a filtered string. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass',
      cpp: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        return true;\n    }\n};',
      java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        return true;\n    }\n}',
      javascript: 'var isPalindrome = function(s) {\n};'
    },
    solutionCode: {
      python: 'def isPalindrome(s: str) -> bool:\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower(): return False\n        l += 1; r -= 1\n    return True',
      cpp: 'bool isPalindrome(string s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Facebook', 'Microsoft', 'Amazon'],
    tags: ['Two Pointers', 'String'],
    order: 8
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    topicSlug: 'two-pointers',
    patternSlug: 'converging-pointers',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/container-with-most-water/',
    description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    inputFormat: 'Array of line heights.',
    outputFormat: 'Maximum water area.',
    sampleTestCases: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max area between index 1 and 8: min(8, 7) * (8 - 1) = 49.' },
      { input: 'height = [1,1]', output: '1', explanation: 'Area = min(1, 1) * 1 = 1.' }
    ],
    hiddenTestCases: [
      { input: 'height = [4,3,2,1,4]', output: '16' },
      { input: 'height = [1,2,1]', output: '2' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'The volume is constrained by width * min(height[left], height[right]).' },
      { level: 2, title: 'Pattern', hintText: 'Two Pointers converging from widest span inward.' },
      { level: 3, title: 'Approach', hintText: 'Start at l = 0, r = n-1. Moving the taller line can never increase water because width shrinks and height is bounded by the shorter line. So always move the shorter line inward.' },
      { level: 4, title: 'Pseudo-code', hintText: 'l, r = 0, n-1; ans = 0; while l < r: ans = max(ans, (r-l)*min(h[l], h[r])); if h[l] < h[r]: l += 1 else: r -= 1;' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass two pointers. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}',
      javascript: 'var maxArea = function(height) {\n};'
    },
    solutionCode: {
      python: 'def maxArea(height):\n    l, r = 0, len(height) - 1\n    ans = 0\n    while l < r:\n        ans = max(ans, (r - l) * min(height[l], height[r]))\n        if height[l] < height[r]:\n            l += 1\n        else:\n            r -= 1\n    return ans',
      cpp: 'int maxArea(vector<int>& height) {\n    int l = 0, r = height.size() - 1, ans = 0;\n    while (l < r) {\n        ans = max(ans, (r - l) * min(height[l], height[r]));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return ans;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Google', 'Amazon', 'Apple', 'Meta'],
    tags: ['Array', 'Two Pointers', 'Greedy'],
    order: 9
  },
  {
    title: '3Sum',
    slug: '3sum',
    topicSlug: 'two-pointers',
    patternSlug: 'sort-and-two-pointers',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/3sum/',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    inputFormat: 'Array of integers nums.',
    outputFormat: 'List of unique integer triplets summing to zero.',
    sampleTestCases: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Unique triplets summing to 0.' },
      { input: 'nums = [0,1,1]', output: '[]', explanation: 'No triplets sum to 0.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
      { input: 'nums = [-2,0,1,1,2]', output: '[[-2,0,2],[-2,1,1]]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Sort the array first. If nums[i] > 0, three positive numbers cannot sum to 0.' },
      { level: 2, title: 'Pattern', hintText: 'Fix first element nums[i], then use Two Pointers for the remaining target -nums[i].' },
      { level: 3, title: 'Approach', hintText: 'Skip duplicates for index i, and skip duplicates when moving left and right pointers.' },
      { level: 4, title: 'Pseudo-code', hintText: 'nums.sort(); for i in range(n-2): if i > 0 and nums[i] == nums[i-1]: continue; l, r = i+1, n-1; while l < r: sum = nums[i]+nums[l]+nums[r]; if sum == 0: add triplet; l+=1; r-=1; while l<r and nums[l]==nums[l-1]: l+=1; elif sum < 0: l+=1 else: r-=1' },
      { level: 5, title: 'Full Solution', hintText: 'Sorted two pointers avoids extra hash set memory. Time: O(N^2), Space: O(1) beyond sorting.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}',
      javascript: 'var threeSum = function(nums) {\n};'
    },
    solutionCode: {
      python: 'def threeSum(nums):\n    nums.sort()\n    res = []\n    n = len(nums)\n    for i in range(n - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        if nums[i] > 0: break\n        l, r = i + 1, n - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                l += 1; r -= 1\n                while l < r and nums[l] == nums[l - 1]: l += 1\n                while l < r and nums[r] == nums[r + 1]: r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res',
      cpp: 'vector<vector<int>> threeSum(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    vector<vector<int>> res;\n    int n = nums.size();\n    for (int i = 0; i < n - 2; ++i) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;\n        if (nums[i] > 0) break;\n        int l = i + 1, r = n - 1;\n        while (l < r) {\n            int s = nums[i] + nums[l] + nums[r];\n            if (s == 0) {\n                res.push_back({nums[i], nums[l], nums[r]});\n                l++; r--;\n                while (l < r && nums[l] == nums[l-1]) l++;\n                while (l < r && nums[r] == nums[r+1]) r--;\n            } else if (s < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}'
    },
    optimalTimeComplexity: 'O(N^2)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    order: 10
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    topicSlug: 'two-pointers',
    patternSlug: 'bounded-height-two-pointers',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    inputFormat: 'Array of bar elevations.',
    outputFormat: 'Total units of trapped water.',
    sampleTestCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '9 units of water trapped.' }
    ],
    hiddenTestCases: [
      { input: 'height = [3,0,2,0,4]', output: '7' },
      { input: 'height = [2,0,2]', output: '2' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Water trapped above bar i is min(max_left, max_right) - height[i].' },
      { level: 2, title: 'Pattern', hintText: 'Two Pointers maintaining left_max and right_max.' },
      { level: 3, title: 'Approach', hintText: 'If left_max < right_max, the bottleneck is on the left, so process height[left] and advance left; otherwise process right.' },
      { level: 4, title: 'Pseudo-code', hintText: 'l, r = 0, n-1; l_max = r_max = ans = 0; while l < r: if h[l] < h[r]: l_max = max(l_max, h[l]); ans += l_max - h[l]; l += 1; else: r_max = max(r_max, h[r]); ans += r_max - h[r]; r -= 1; return ans;' },
      { level: 5, title: 'Full Solution', hintText: 'Two Pointers achieves optimal O(N) time and O(1) space.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int trap(vector<int>& height) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}',
      javascript: 'var trap = function(height) {\n};'
    },
    solutionCode: {
      python: 'def trap(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    l_max, r_max = height[l], height[r]\n    ans = 0\n    while l < r:\n        if l_max < r_max:\n            l += 1\n            l_max = max(l_max, height[l])\n            ans += l_max - height[l]\n        else:\n            r -= 1\n            r_max = max(r_max, height[r])\n            ans += r_max - height[r]\n    return ans',
      cpp: 'int trap(vector<int>& height) {\n    int l = 0, r = height.size() - 1, l_max = 0, r_max = 0, ans = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            l_max = max(l_max, height[l]);\n            ans += l_max - height[l++];\n        } else {\n            r_max = max(r_max, height[r]);\n            ans += r_max - height[r--];\n        }\n    }\n    return ans;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Google', 'Apple', 'Meta', 'Microsoft'],
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    order: 11
  },

  // ==========================================
  // 4. SLIDING WINDOW
  // ==========================================
  {
    title: 'Maximum Average Subarray I',
    slug: 'maximum-average-subarray-i',
    topicSlug: 'sliding-window',
    patternSlug: 'fixed-sliding-window',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/maximum-average-subarray-i/',
    description: 'You are given an integer array nums consisting of n elements, and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value.',
    constraints: ['n == nums.length', '1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    inputFormat: 'Array of integers nums and integer window size k.',
    outputFormat: 'Maximum average value (float).',
    sampleTestCases: [
      { input: 'nums = [1,12,-5,-6,50,3], k = 4', output: '12.75', explanation: 'Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75' },
      { input: 'nums = [5], k = 1', output: '5.0', explanation: 'Only 1 element.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [0,4,0,3,2], k = 1', output: '4.0' },
      { input: 'nums = [4,2,1,3,3], k = 2', output: '3.0' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Since window size k is fixed, maximizing the average is equivalent to maximizing the sum.' },
      { level: 2, title: 'Pattern', hintText: 'Fixed Size Sliding Window of width k.' },
      { level: 3, title: 'Approach', hintText: 'Calculate the sum of the first k elements. Then slide right by adding nums[i] and subtracting nums[i-k].' },
      { level: 4, title: 'Pseudo-code', hintText: 'cur = sum(nums[:k]); ans = cur; for i in range(k, n): cur += nums[i] - nums[i-k]; ans = max(ans, cur); return ans / k;' },
      { level: 5, title: 'Full Solution', hintText: 'O(N) time with O(1) auxiliary space.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def findMaxAverage(self, nums: list[int], k: int) -> float:\n        pass',
      cpp: 'class Solution {\npublic:\n    double findMaxAverage(vector<int>& nums, int k) {\n        return 0.0;\n    }\n};',
      java: 'class Solution {\n    public double findMaxAverage(int[] nums, int k) {\n        return 0.0;\n    }\n}',
      javascript: 'var findMaxAverage = function(nums, k) {\n};'
    },
    solutionCode: {
      python: 'def findMaxAverage(nums, k):\n    cur = sum(nums[:k])\n    ans = cur\n    for i in range(k, len(nums)):\n        cur += nums[i] - nums[i - k]\n        ans = max(ans, cur)\n    return ans / k',
      cpp: 'double findMaxAverage(vector<int>& nums, int k) {\n    double cur = 0;\n    for (int i = 0; i < k; ++i) cur += nums[i];\n    double ans = cur;\n    for (int i = k; i < nums.size(); ++i) {\n        cur += nums[i] - nums[i - k];\n        ans = max(ans, cur);\n    }\n    return ans / k;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Google', 'Facebook'],
    tags: ['Array', 'Sliding Window'],
    order: 12
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    topicSlug: 'sliding-window',
    patternSlug: 'dynamic-sliding-window',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    inputFormat: 'String s.',
    outputFormat: 'Integer length of longest unique substring.',
    sampleTestCases: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    hiddenTestCases: [
      { input: 's = "pwwkew"', output: '3' },
      { input: 's = ""', output: '0' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Use a window [left, right] that contains only distinct characters.' },
      { level: 2, title: 'Pattern', hintText: 'Variable-Size Sliding Window with Last Seen Index Hash Map.' },
      { level: 3, title: 'Approach', hintText: 'When character s[right] has been seen at index last_idx >= left, move left = last_idx + 1.' },
      { level: 4, title: 'Pseudo-code', hintText: 'seen = {}; l = 0; ans = 0; for r, ch in enumerate(s): if ch in seen and seen[ch] >= l: l = seen[ch] + 1; seen[ch] = r; ans = max(ans, r - l + 1); return ans;' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass sliding window with character index hash map. Time: O(N), Space: O(min(N, alphabet_size)).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}',
      javascript: 'var lengthOfLongestSubstring = function(s) {\n};'
    },
    solutionCode: {
      python: 'def lengthOfLongestSubstring(s):\n    seen = {}\n    l, ans = 0, 0\n    for r, ch in enumerate(s):\n        if ch in seen and seen[ch] >= l:\n            l = seen[ch] + 1\n        seen[ch] = r\n        ans = max(ans, r - l + 1)\n    return ans',
      cpp: 'int lengthOfLongestSubstring(string s) {\n    vector<int> last(256, -1);\n    int l = 0, ans = 0;\n    for (int r = 0; r < s.size(); ++r) {\n        if (last[(unsigned char)s[r]] >= l) l = last[(unsigned char)s[r]] + 1;\n        last[(unsigned char)s[r]] = r;\n        ans = max(ans, r - l + 1);\n    }\n    return ans;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(min(N, M))',
    companies: ['Amazon', 'Microsoft', 'Google', 'Apple'],
    tags: ['Hash Table', 'String', 'Sliding Window'],
    order: 13
  },
  {
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    topicSlug: 'sliding-window',
    patternSlug: 'frequency-matching-window',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/minimum-window-substring/',
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    inputFormat: 'Strings s and t.',
    outputFormat: 'Smallest substring of s containing all characters of t.',
    sampleTestCases: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'The minimum window substring "BANC" includes A, B, and C.' },
      { input: 's = "a", t = "a"', output: '"a"', explanation: 'Entire string matches.' }
    ],
    hiddenTestCases: [
      { input: 's = "a", t = "aa"', output: '""' },
      { input: 's = "ab", t = "b"', output: '"b"' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Expand right pointer until all characters in t are satisfied, then shrink left pointer to minimize the window.' },
      { level: 2, title: 'Pattern', hintText: 'Expand/Contract Sliding Window with Frequency Map and "formed" match counter.' },
      { level: 3, title: 'Approach', hintText: 'Use required = len(t_freq) and formed to track distinct characters with required count satisfied.' },
      { level: 4, title: 'Pseudo-code', hintText: 'while formed == required: update min_len; contract left pointer; if window[s[l]] < t_count[s[l]]: formed -= 1; l += 1' },
      { level: 5, title: 'Full Solution', hintText: 'Linear scan with two pointers. Time: O(M+N), Space: O(distinct chars).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        pass',
      cpp: 'class Solution {\npublic:\n    string minWindow(string s, string t) {\n        return "";\n    }\n};',
      java: 'class Solution {\n    public String minWindow(String s, String t) {\n        return "";\n    }\n}',
      javascript: 'var minWindow = function(s, t) {\n};'
    },
    solutionCode: {
      python: 'from collections import Counter\ndef minWindow(s, t):\n    if not t or not s: return ""\n    t_count = Counter(t)\n    window = {}\n    have, need = 0, len(t_count)\n    res, res_len = [-1, -1], float("inf")\n    l = 0\n    for r, ch in enumerate(s):\n        window[ch] = window.get(ch, 0) + 1\n        if ch in t_count and window[ch] == t_count[ch]:\n            have += 1\n        while have == need:\n            if (r - l + 1) < res_len:\n                res = [l, r]\n                res_len = r - l + 1\n            window[s[l]] -= 1\n            if s[l] in t_count and window[s[l]] < t_count[s[l]]:\n                have -= 1\n            l += 1\n    return "" if res_len == float("inf") else s[res[0]:res[1]+1]',
      cpp: 'string minWindow(string s, string t) {\n    vector<int> target(128, 0), window(128, 0);\n    for (char c : t) target[c]++;\n    int need = 0;\n    for (int count : target) if (count > 0) need++;\n    int have = 0, l = 0, min_len = 1e9, start = 0;\n    for (int r = 0; r < s.size(); ++r) {\n        window[s[r]]++;\n        if (target[s[r]] > 0 && window[s[r]] == target[s[r]]) have++;\n        while (have == need) {\n            if (r - l + 1 < min_len) {\n                min_len = r - l + 1;\n                start = l;\n            }\n            window[s[l]]--;\n            if (target[s[l]] > 0 && window[s[l]] < target[s[l]]) have--;\n            l++;\n        }\n    }\n    return min_len == 1e9 ? "" : s.substr(start, min_len);\n}'
    },
    optimalTimeComplexity: 'O(M + N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Facebook', 'Google', 'Amazon', 'Uber'],
    tags: ['Hash Table', 'String', 'Sliding Window'],
    order: 14
  },

  // ==========================================
  // 5. BINARY SEARCH
  // ==========================================
  {
    title: 'Binary Search',
    slug: 'binary-search',
    topicSlug: 'binary-search',
    patternSlug: 'binary-search-space',
    difficulty: 'Easy',
    source: 'Striver A2Z',
    problemUrl: 'https://leetcode.com/problems/binary-search/',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.',
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
    inputFormat: 'Sorted array nums and target value.',
    outputFormat: 'Integer index or -1.',
    sampleTestCases: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums at index 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist, so return -1.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [5], target = 5', output: '0' },
      { input: 'nums = [2,5], target = 0', output: '-1' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Since nums is sorted, checking the middle element cuts search space in half.' },
      { level: 2, title: 'Pattern', hintText: 'Standard iterative Binary Search.' },
      { level: 3, title: 'Approach', hintText: 'Initialize low = 0 and high = len(nums) - 1. Calculate mid = low + (high - low) // 2.' },
      { level: 4, title: 'Pseudo-code', hintText: 'while low <= high: mid = (low + high) // 2; if nums[mid] == target: return mid; elif nums[mid] < target: low = mid + 1; else: high = mid - 1; return -1;' },
      { level: 5, title: 'Full Solution', hintText: 'Logarithmic search space halving. Time: O(log N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}',
      javascript: 'var search = function(nums, target) {\n};'
    },
    solutionCode: {
      python: 'def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = l + (r - l) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1',
      cpp: 'int search(vector<int>& nums, int target) {\n    int l = 0, r = nums.size() - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}'
    },
    optimalTimeComplexity: 'O(log N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Apple', 'Google', 'Microsoft'],
    tags: ['Array', 'Binary Search'],
    order: 15
  },
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    topicSlug: 'binary-search',
    patternSlug: 'rotated-sorted-array',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    description: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.', 'nums is an ascending array that was possibly rotated.'],
    inputFormat: 'Array nums and target integer.',
    outputFormat: 'Index of target or -1.',
    sampleTestCases: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: '0 is found at index 4.' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explanation: '3 is not in nums.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1], target = 0', output: '-1' },
      { input: 'nums = [3,1], target = 1', output: '1' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Even though rotated, at least one half [low, mid] or [mid, high] is always normally sorted.' },
      { level: 2, title: 'Pattern', hintText: 'Binary Search with sorted half detection.' },
      { level: 3, title: 'Approach', hintText: 'If nums[low] <= nums[mid], the left half is sorted. Check if target lies within [nums[low], nums[mid]]. Otherwise the right half is sorted.' },
      { level: 4, title: 'Pseudo-code', hintText: 'if nums[l] <= nums[mid]: if nums[l] <= target < nums[mid]: r = mid - 1 else: l = mid + 1; else: if nums[mid] < target <= nums[r]: l = mid + 1 else: r = mid - 1' },
      { level: 5, title: 'Full Solution', hintText: 'Modified binary search. Time: O(log N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}',
      javascript: 'var search = function(nums, target) {\n};'
    },
    solutionCode: {
      python: 'def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = l + (r - l) // 2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    return -1',
      cpp: 'int search(vector<int>& nums, int target) {\n    int l = 0, r = nums.size() - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[l] <= nums[mid]) {\n            if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    return -1;\n}'
    },
    optimalTimeComplexity: 'O(log N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Bloomberg'],
    tags: ['Array', 'Binary Search'],
    order: 16
  },
  {
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    topicSlug: 'binary-search',
    patternSlug: 'binary-search-partition',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    inputFormat: 'Two sorted arrays nums1 and nums2.',
    outputFormat: 'Float median value.',
    sampleTestCases: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' }
    ],
    hiddenTestCases: [
      { input: 'nums1 = [0,0], nums2 = [0,0]', output: '0.0' },
      { input: 'nums1 = [], nums2 = [1]', output: '1.0' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Binary search on the partition index of the smaller array so that total left elements == total right elements.' },
      { level: 2, title: 'Pattern', hintText: 'Binary Search on Partition Cut: cut1 in [0, m], cut2 = (m+n+1)//2 - cut1.' },
      { level: 3, title: 'Approach', hintText: 'A partition is valid when l1 <= r2 and l2 <= r1, where l1, l2 are left boundary elements, r1, r2 are right boundary elements.' },
      { level: 4, title: 'Pseudo-code', hintText: 'if len(A) > len(B): swap; low=0, high=len(A); while low <= high: cut1=(low+high)//2; cut2=(m+n+1)//2 - cut1; check boundaries and adjust low/high.' },
      { level: 5, title: 'Full Solution', hintText: 'Binary search on the smaller array. Time: O(log(min(M, N))), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        pass',
      cpp: 'class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        return 0.0;\n    }\n};',
      java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}',
      javascript: 'var findMedianSortedArrays = function(nums1, nums2) {\n};'
    },
    solutionCode: {
      python: 'def findMedianSortedArrays(nums1, nums2):\n    A, B = nums1, nums2\n    if len(A) > len(B): A, B = B, A\n    m, n = len(A), len(B)\n    low, high = 0, m\n    while low <= high:\n        i = (low + high) // 2\n        j = (m + n + 1) // 2 - i\n        maxL_A = float("-inf") if i == 0 else A[i-1]\n        minR_A = float("inf") if i == m else A[i]\n        maxL_B = float("-inf") if j == 0 else B[j-1]\n        minR_B = float("inf") if j == n else B[j]\n        if maxL_A <= minR_B and maxL_B <= minR_A:\n            if (m + n) % 2 == 1: return float(max(maxL_A, maxL_B))\n            return (max(maxL_A, maxL_B) + min(minR_A, minR_B)) / 2.0\n        elif maxL_A > minR_B: high = i - 1\n        else: low = i + 1\n    return 0.0',
      cpp: 'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);\n    int m = nums1.size(), n = nums2.size();\n    int low = 0, high = m;\n    while (low <= high) {\n        int i = (low + high) / 2;\n        int j = (m + n + 1) / 2 - i;\n        int maxL_A = (i == 0) ? INT_MIN : nums1[i-1];\n        int minR_A = (i == m) ? INT_MAX : nums1[i];\n        int maxL_B = (j == 0) ? INT_MIN : nums2[j-1];\n        int minR_B = (j == n) ? INT_MAX : nums2[j];\n        if (maxL_A <= minR_B && maxL_B <= minR_A) {\n            if ((m + n) % 2 == 1) return max(maxL_A, maxL_B);\n            return (max(maxL_A, maxL_B) + min(minR_A, minR_B)) / 2.0;\n        } else if (maxL_A > minR_B) high = i - 1;\n        else low = i + 1;\n    }\n    return 0.0;\n}'
    },
    optimalTimeComplexity: 'O(log(min(M, N)))',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Google', 'Amazon', 'Apple', 'Meta'],
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    order: 17
  },

  // ==========================================
  // 6. SORTING
  // ==========================================
  {
    title: 'Sort Colors',
    slug: 'sort-colors',
    topicSlug: 'arrays',
    patternSlug: 'dutch-national-flag',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/sort-colors/',
    description: 'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively. You must solve this problem without using the library\'s sort function.',
    constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is either 0, 1, or 2.'],
    inputFormat: 'Array of integers 0, 1, 2.',
    outputFormat: 'In-place sorted array.',
    sampleTestCases: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: '0s followed by 1s followed by 2s.' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]', explanation: 'Sorted order.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [0]', output: '[0]' },
      { input: 'nums = [1,0]', output: '[0,1]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'A two-pass counting sort works, but can you do it in a single pass in O(1) space?' },
      { level: 2, title: 'Pattern', hintText: 'Dutch National Flag algorithm: 3-way partition using low, mid, high pointers.' },
      { level: 3, title: 'Approach', hintText: 'low boundary for 0s, mid scanner for 1s, high boundary for 2s.' },
      { level: 4, title: 'Pseudo-code', hintText: 'low = mid = 0, high = n - 1; while mid <= high: if nums[mid] == 0: swap(low, mid); low += 1; mid += 1; elif nums[mid] == 1: mid += 1; else: swap(mid, high); high -= 1;' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass Dutch National Flag 3-way partition. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def sortColors(self, nums: list[int]) -> None:\n        # Modify nums in-place\n        pass',
      cpp: 'class Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n        // Modify nums in-place\n    }\n};',
      java: 'class Solution {\n    public void sortColors(int[] nums) {\n        // Modify nums in-place\n    }\n}',
      javascript: 'var sortColors = function(nums) {\n    // Modify nums in-place\n};'
    },
    solutionCode: {
      python: 'def sortColors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1; mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1',
      cpp: 'void sortColors(vector<int>& nums) {\n    int low = 0, mid = 0, high = nums.size() - 1;\n    while (mid <= high) {\n        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);\n        else if (nums[mid] == 1) mid++;\n        else swap(nums[mid], nums[high--]);\n    }\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Microsoft', 'Amazon', 'Apple'],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    order: 18
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    topicSlug: 'arrays',
    patternSlug: 'interval-merging',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/merge-intervals/',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
    inputFormat: 'Array of intervals [start, end].',
    outputFormat: 'Array of merged intervals.',
    sampleTestCases: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' }
    ],
    hiddenTestCases: [
      { input: 'intervals = [[1,4],[2,3]]', output: '[[1,4]]' },
      { input: 'intervals = [[1,4],[0,4]]', output: '[[0,4]]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Sort intervals by their start times so overlapping intervals appear consecutively.' },
      { level: 2, title: 'Pattern', hintText: 'Interval Sorting and Greedy Linear Merge.' },
      { level: 3, title: 'Approach', hintText: 'Compare the start of current interval with end of last merged interval. If current.start <= last.end, merge by setting last.end = max(last.end, current.end).' },
      { level: 4, title: 'Pseudo-code', hintText: 'intervals.sort(key=lambda x: x[0]); merged = [intervals[0]]; for iv in intervals[1:]: if iv[0] <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], iv[1]); else: merged.append(iv); return merged;' },
      { level: 5, title: 'Full Solution', hintText: 'Sort + single linear sweep. Time: O(N log N), Space: O(N) for output.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        return new int[][]{};\n    }\n}',
      javascript: 'var merge = function(intervals) {\n};'
    },
    solutionCode: {
      python: 'def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged',
      cpp: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> merged = {intervals[0]};\n    for (int i = 1; i < intervals.size(); ++i) {\n        if (intervals[i][0] <= merged.back()[1]) {\n            merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n        } else {\n            merged.push_back(intervals[i]);\n        }\n    }\n    return merged;\n}'
    },
    optimalTimeComplexity: 'O(N log N)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Google', 'Meta', 'Amazon', 'Bloomberg'],
    tags: ['Array', 'Sorting'],
    order: 19
  },

  // ==========================================
  // 7. LINKED LISTS
  // ==========================================
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    topicSlug: 'linked-lists',
    patternSlug: 'pointer-reversal',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    inputFormat: 'Head node of a singly linked list.',
    outputFormat: 'Head node of reversed linked list.',
    sampleTestCases: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed order.' },
      { input: 'head = [1,2]', output: '[2,1]', explanation: 'Reversed two nodes.' }
    ],
    hiddenTestCases: [
      { input: 'head = []', output: '[]' },
      { input: 'head = [1]', output: '[1]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Maintain pointers prev, curr, and next_temp to reverse next pointers iteratively.' },
      { level: 2, title: 'Pattern', hintText: 'Iterative Three-Pointer Pointer Reversal.' },
      { level: 3, title: 'Approach', hintText: 'At each node curr, save curr.next, point curr.next to prev, then advance prev = curr and curr = next_temp.' },
      { level: 4, title: 'Pseudo-code', hintText: 'prev = None, curr = head; while curr: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; return prev;' },
      { level: 5, title: 'Full Solution', hintText: 'In-place pointer reversal. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        return nullptr;\n    }\n};',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        return null;\n    }\n}',
      javascript: 'var reverseList = function(head) {\n};'
    },
    solutionCode: {
      python: 'def reverseList(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev',
      cpp: 'ListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while (curr) {\n        ListNode* nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Apple', 'Microsoft', 'Google'],
    tags: ['Linked List', 'Recursion'],
    order: 20
  },
  {
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    topicSlug: 'linked-lists',
    patternSlug: 'floyd-cycle-detection',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Return true if there is a cycle in the linked list. Otherwise, return false.',
    constraints: ['The number of nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index in the linked-list.'],
    inputFormat: 'Head of a linked list.',
    outputFormat: 'Boolean true if cycle exists, false otherwise.',
    sampleTestCases: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'There is a cycle where the tail connects to the 1st node (0-indexed).' },
      { input: 'head = [1,2], pos = 0', output: 'true', explanation: 'There is a cycle where the tail connects to the 0th node.' }
    ],
    hiddenTestCases: [
      { input: 'head = [1], pos = -1', output: 'false' },
      { input: 'head = [], pos = -1', output: 'false' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'A hash set can detect previously visited nodes in O(N) space. Can you do it in O(1) space?' },
      { level: 2, title: 'Pattern', hintText: 'Floyd Tortoise and Hare (Fast & Slow Pointers).' },
      { level: 3, title: 'Approach', hintText: 'Slow moves 1 step, fast moves 2 steps. If a cycle exists, fast will inevitably lap and collide with slow.' },
      { level: 4, title: 'Pseudo-code', hintText: 'slow = fast = head; while fast and fast.next: slow = slow.next; fast = fast.next.next; if slow == fast: return True; return False;' },
      { level: 5, title: 'Full Solution', hintText: 'Two pointers collision check. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        pass',
      cpp: 'class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        return false;\n    }\n};',
      java: 'class Solution {\n    public boolean hasCycle(ListNode head) {\n        return false;\n    }\n}',
      javascript: 'var hasCycle = function(head) {\n};'
    },
    solutionCode: {
      python: 'def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False',
      cpp: 'bool hasCycle(ListNode *head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Spotify'],
    tags: ['Hash Table', 'Linked List', 'Two Pointers'],
    order: 21
  },
  {
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    topicSlug: 'linked-lists',
    patternSlug: 'divide-and-conquer-lists',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'lists[i] is sorted in ascending order.', 'The sum of lists[i].length will not exceed 10^4.'],
    inputFormat: 'Array of k sorted linked lists.',
    outputFormat: 'Merged single sorted linked list.',
    sampleTestCases: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'Merged sorted linked list.' },
      { input: 'lists = []', output: '[]', explanation: 'Empty lists array.' }
    ],
    hiddenTestCases: [
      { input: 'lists = [[]]', output: '[]' },
      { input: 'lists = [[2],[],[-1]]', output: '[-1,2]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Merging pairs sequentially takes O(k^2 N). Pairwise divide and conquer or a min-heap takes O(N log k).' },
      { level: 2, title: 'Pattern', hintText: 'Divide and Conquer merge pairs (similar to merge sort) or Min-Heap Priority Queue.' },
      { level: 3, title: 'Approach', hintText: 'Maintain a min-heap of size k storing (node.val, i, node). Pop smallest and push node.next.' },
      { level: 4, title: 'Pseudo-code', hintText: 'heap = [(node.val, i, node) for i, node in enumerate(lists) if node]; dummy = curr = ListNode(); while heap: val, i, node = heappop(heap); curr.next = node; curr = curr.next; if node.next: heappush(heap, (node.next.val, i, node.next)); return dummy.next;' },
      { level: 5, title: 'Full Solution', hintText: 'Min-heap over k heads. Time: O(N log K), Space: O(K).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def mergeKLists(self, lists: list[Optional[ListNode]]) -> Optional[ListNode]:\n        pass',
      cpp: 'class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        return nullptr;\n    }\n};',
      java: 'class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        return null;\n    }\n}',
      javascript: 'var mergeKLists = function(lists) {\n};'
    },
    solutionCode: {
      python: 'import heapq\ndef mergeKLists(lists):\n    dummy = curr = ListNode(0)\n    heap = []\n    for i, node in enumerate(lists):\n        if node: heapq.heappush(heap, (node.val, i, node))\n    while heap:\n        val, i, node = heapq.heappop(heap)\n        curr.next = node\n        curr = curr.next\n        if node.next: heapq.heappush(heap, (node.next.val, i, node.next))\n    return dummy.next',
      cpp: 'struct Compare {\n    bool operator()(ListNode* a, ListNode* b) { return a->val > b->val; }\n};\nListNode* mergeKLists(vector<ListNode*>& lists) {\n    priority_queue<ListNode*, vector<ListNode*>, Compare> pq;\n    for (auto l : lists) if (l) pq.push(l);\n    ListNode dummy(0), *curr = &dummy;\n    while (!pq.empty()) {\n        ListNode* top = pq.top(); pq.pop();\n        curr->next = top; curr = curr->next;\n        if (top->next) pq.push(top->next);\n    }\n    return dummy.next;\n}'
    },
    optimalTimeComplexity: 'O(N log K)',
    optimalSpaceComplexity: 'O(K)',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'],
    tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
    order: 22
  },

  // ==========================================
  // 8. STACKS AND QUEUES
  // ==========================================
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    topicSlug: 'stacks',
    patternSlug: 'balanced-parentheses-stack',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/valid-parentheses/',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and Open brackets must be closed in the correct order.',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'.'],
    inputFormat: 'String containing parentheses.',
    outputFormat: 'Boolean true if valid, false otherwise.',
    sampleTestCases: [
      { input: 's = "()"', output: 'true', explanation: 'Matching parentheses.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All pairs properly closed.' }
    ],
    hiddenTestCases: [
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([)]"', output: 'false' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'The most recently opened bracket must be the first one to be closed (LIFO).' },
      { level: 2, title: 'Pattern', hintText: 'Stack matching with a bracket mapping table.' },
      { level: 3, title: 'Approach', hintText: 'Push opening brackets onto stack. For closing brackets, check if stack is empty or top does not match opening partner.' },
      { level: 4, title: 'Pseudo-code', hintText: 'pairs = {")": "(", "}": "{", "]": "["}; stack = []; for c in s: if c in pairs: if not stack or stack.pop() != pairs[c]: return False; else: stack.append(c); return len(stack) == 0;' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass with LIFO stack. Time: O(N), Space: O(N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        pass',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}',
      javascript: 'var isValid = function(s) {\n};'
    },
    solutionCode: {
      python: 'def isValid(s):\n    pairs = {")": "(", "}": "{", "]": "["}\n    stack = []\n    for c in s:\n        if c in pairs:\n            if not stack or stack.pop() != pairs[c]:\n                return False\n        else:\n            stack.append(c)\n    return len(stack) == 0',
      cpp: 'bool isValid(string s) {\n    stack<char> st;\n    unordered_map<char, char> pairs{{\')\', \'(\'}, {\'}\', \'{\'}, {\']\', \'[\'}};\n    for (char c : s) {\n        if (pairs.count(c)) {\n            if (st.empty() || st.top() != pairs[c]) return false;\n            st.pop();\n        } else {\n            st.push(c);\n        }\n    }\n    return st.empty();\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Apple', 'Meta'],
    tags: ['String', 'Stack'],
    order: 23
  },
  {
    title: 'Daily Temperatures',
    slug: 'daily-temperatures',
    topicSlug: 'stacks',
    patternSlug: 'monotonic-stack',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/daily-temperatures/',
    description: 'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.',
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    inputFormat: 'Array of temperature values.',
    outputFormat: 'Array of wait day counts.',
    sampleTestCases: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: 'Next warmer day counts.' },
      { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]', explanation: 'Strictly increasing temperatures.' }
    ],
    hiddenTestCases: [
      { input: 'temperatures = [30,60,90]', output: '[1,1,0]' },
      { input: 'temperatures = [89,62,70,58,47,47,46,76,100,70]', output: '[8,1,5,4,3,2,1,1,0,0]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'A nested loop takes O(N^2). Use a monotonic decreasing stack to resolve warmer days.' },
      { level: 2, title: 'Pattern', hintText: 'Monotonic Decreasing Stack storing indices.' },
      { level: 3, title: 'Approach', hintText: 'While current temperature is strictly greater than temperature at stack.top(), pop and set ans[prev_idx] = i - prev_idx.' },
      { level: 4, title: 'Pseudo-code', hintText: 'ans = [0]*n; stack = []; for i, t in enumerate(temps): while stack and t > temps[stack[-1]]: prev = stack.pop(); ans[prev] = i - prev; stack.append(i); return ans;' },
      { level: 5, title: 'Full Solution', hintText: 'Each index pushed and popped at most once. Time: O(N), Space: O(N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        return new int[]{};\n    }\n}',
      javascript: 'var dailyTemperatures = function(temperatures) {\n};'
    },
    solutionCode: {
      python: 'def dailyTemperatures(temperatures):\n    ans = [0] * len(temperatures)\n    stack = []\n    for i, t in enumerate(temperatures):\n        while stack and t > temperatures[stack[-1]]:\n            prev = stack.pop()\n            ans[prev] = i - prev\n        stack.append(i)\n    return ans',
      cpp: 'vector<int> dailyTemperatures(vector<int>& temperatures) {\n    vector<int> ans(temperatures.size(), 0);\n    stack<int> st;\n    for (int i = 0; i < temperatures.size(); ++i) {\n        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {\n            int prev = st.top(); st.pop();\n            ans[prev] = i - prev;\n        }\n        st.push(i);\n    }\n    return ans;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Amazon', 'Google', 'Meta'],
    tags: ['Array', 'Stack', 'Monotonic Stack'],
    order: 24
  },
  {
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    topicSlug: 'queues',
    patternSlug: 'amortized-queue-stacks',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/',
    description: 'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).',
    constraints: ['1 <= x <= 9', 'At most 100 calls will be made to push, pop, peek, and empty.', 'All the calls to pop and peek are valid.'],
    inputFormat: 'Operations sequence on MyQueue.',
    outputFormat: 'Results of operations.',
    sampleTestCases: [
      { input: 'push(1), push(2), peek(), pop(), empty()', output: '[null, null, 1, 1, false]', explanation: 'Queue FIFO behavior.' },
      { input: 'push(1), empty()', output: '[null, false]', explanation: 'Non-empty queue.' }
    ],
    hiddenTestCases: [
      { input: 'push(1), pop(), empty()', output: '[null, 1, true]' },
      { input: 'push(2), push(3), pop(), peek()', output: '[null, null, 2, 3]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'One stack handles incoming pushes (in_stack), and the other handles outgoing pops/peeks (out_stack).' },
      { level: 2, title: 'Pattern', hintText: 'Amortized Two-Stack Transfer.' },
      { level: 3, title: 'Approach', hintText: 'When popping or peeking, if out_stack is empty, transfer all elements from in_stack to out_stack.' },
      { level: 4, title: 'Pseudo-code', hintText: 'def pop(): peek(); return out_stack.pop(); def peek(): if not out_stack: while in_stack: out_stack.append(in_stack.pop()); return out_stack[-1];' },
      { level: 5, title: 'Full Solution', hintText: 'Each element moved at most twice. Amortized Time: O(1), Space: O(N).' }
    ],
    starterCode: {
      python: 'class MyQueue:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def peek(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass',
      cpp: 'class MyQueue {\npublic:\n    MyQueue() {}\n    void push(int x) {}\n    int pop() { return 0; }\n    int peek() { return 0; }\n    bool empty() { return false; }\n};',
      java: 'class MyQueue {\n    public MyQueue() {}\n    public void push(int x) {}\n    public int pop() { return 0; }\n    public int peek() { return 0; }\n    public boolean empty() { return false; }\n}',
      javascript: 'var MyQueue = function() {};\nMyQueue.prototype.push = function(x) {};\nMyQueue.prototype.pop = function() {};\nMyQueue.prototype.peek = function() {};\nMyQueue.prototype.empty = function() {};'
    },
    solutionCode: {
      python: 'class MyQueue:\n    def __init__(self):\n        self.in_stk = []\n        self.out_stk = []\n    def push(self, x: int) -> None:\n        self.in_stk.append(x)\n    def pop(self) -> int:\n        self.peek()\n        return self.out_stk.pop()\n    def peek(self) -> int:\n        if not self.out_stk:\n            while self.in_stk: self.out_stk.append(self.in_stk.pop())\n        return self.out_stk[-1]\n    def empty(self) -> bool:\n        return not self.in_stk and not self.out_stk',
      cpp: 'class MyQueue {\n    stack<int> in_stk, out_stk;\npublic:\n    void push(int x) { in_stk.push(x); }\n    int pop() { int val = peek(); out_stk.pop(); return val; }\n    int peek() {\n        if (out_stk.empty()) {\n            while (!in_stk.empty()) { out_stk.push(in_stk.top()); in_stk.pop(); }\n        }\n        return out_stk.top();\n    }\n    bool empty() { return in_stk.empty() && out_stk.empty(); }\n};'
    },
    optimalTimeComplexity: 'O(1) amortized',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Amazon', 'Bloomberg', 'Microsoft'],
    tags: ['Stack', 'Design', 'Queue'],
    order: 24.5
  },
  {
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    topicSlug: 'queues',
    patternSlug: 'monotonic-deque',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/sliding-window-maximum/',
    description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    inputFormat: 'Array nums and integer window size k.',
    outputFormat: 'Array of maximum elements in each window.',
    sampleTestCases: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Sliding window maximums.' },
      { input: 'nums = [1], k = 1', output: '[1]', explanation: 'Single element.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1,-1], k = 1', output: '[1,-1]' },
      { input: 'nums = [9,11], k = 2', output: '[11]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'A max heap takes O(N log k). Can you maintain only candidates that could be maximum in O(1) amortized?' },
      { level: 2, title: 'Pattern', hintText: 'Monotonic Decreasing Deque storing indices.' },
      { level: 3, title: 'Approach', hintText: 'Evict indices smaller than current element from back of deque. Evict indices out of window (deque[0] <= i - k) from front.' },
      { level: 4, title: 'Pseudo-code', hintText: 'deque = deque(); res = []; for i, x in enumerate(nums): while deque and deque[0] <= i - k: deque.popleft(); while deque and nums[deque[-1]] < x: deque.pop(); deque.append(i); if i >= k - 1: res.append(nums[deque[0]]); return res;' },
      { level: 5, title: 'Full Solution', hintText: 'Each element enters and exits deque once. Time: O(N), Space: O(K).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        return new int[]{};\n    }\n}',
      javascript: 'var maxSlidingWindow = function(nums, k) {\n};'
    },
    solutionCode: {
      python: 'from collections import deque\ndef maxSlidingWindow(nums, k):\n    q = deque()\n    res = []\n    for i, x in enumerate(nums):\n        if q and q[0] <= i - k: q.popleft()\n        while q and nums[q[-1]] < x: q.pop()\n        q.append(i)\n        if i >= k - 1: res.append(nums[q[0]])\n    return res',
      cpp: 'vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    deque<int> dq;\n    vector<int> res;\n    for (int i = 0; i < nums.size(); ++i) {\n        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();\n        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();\n        dq.push_back(i);\n        if (i >= k - 1) res.push_back(nums[dq.front()]);\n    }\n    return res;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(K)',
    companies: ['Amazon', 'Google', 'Meta'],
    tags: ['Array', 'Queue', 'Sliding Window', 'Monotonic Queue'],
    order: 25
  },

  // ==========================================
  // 9. RECURSION AND BACKTRACKING
  // ==========================================
  {
    title: 'Fibonacci Number',
    slug: 'fibonacci-number',
    topicSlug: 'recursion',
    patternSlug: 'base-case-recursion',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/fibonacci-number/',
    description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2), for n > 1. Given n, calculate F(n).',
    constraints: ['0 <= n <= 30'],
    inputFormat: 'Integer n.',
    outputFormat: 'Integer F(n).',
    sampleTestCases: [
      { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
      { input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.' }
    ],
    hiddenTestCases: [
      { input: 'n = 0', output: '0' },
      { input: 'n = 4', output: '3' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Identify the base cases: F(0) = 0, F(1) = 1.' },
      { level: 2, title: 'Pattern', hintText: 'Recursive call stack and memoization.' },
      { level: 3, title: 'Approach', hintText: 'Direct recursion recalculates overlapping subproblems in O(2^N). Use memoization or iteration for O(N).' },
      { level: 4, title: 'Pseudo-code', hintText: 'if n <= 1: return n; a, b = 0, 1; for _ in range(2, n + 1): a, b = b, a + b; return b;' },
      { level: 5, title: 'Full Solution', hintText: 'Iterative Fibonacci accumulation. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def fib(self, n: int) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int fib(int n) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int fib(int n) {\n        return 0;\n    }\n}',
      javascript: 'var fib = function(n) {\n};'
    },
    solutionCode: {
      python: 'def fib(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b',
      cpp: 'int fib(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; ++i) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return b;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft'],
    tags: ['Math', 'Dynamic Programming', 'Recursion', 'Memoization'],
    order: 25.5
  },
  {
    title: 'Subsets',
    slug: 'subsets',
    topicSlug: 'backtracking',
    patternSlug: 'cascading-backtrack',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/subsets/',
    description: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.',
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All the numbers of nums are unique.'],
    inputFormat: 'Array of unique integers nums.',
    outputFormat: 'List of all 2^N subsets.',
    sampleTestCases: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explanation: 'All 8 subsets.' },
      { input: 'nums = [0]', output: '[[],[0]]', explanation: 'All 2 subsets.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1,2]', output: '[[],[1],[2],[1,2]]' },
      { input: 'nums = [9]', output: '[[],[9]]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'For each element, we have two choices: include it or exclude it in the subset.' },
      { level: 2, title: 'Pattern', hintText: 'State-space Backtracking tree of depth N.' },
      { level: 3, title: 'Approach', hintText: 'backtrack(start_index, current_path). At every node of the recursion tree, add current_path to results.' },
      { level: 4, title: 'Pseudo-code', hintText: 'res = []; def backtrack(start, path): res.append(list(path)); for i in range(start, len(nums)): path.append(nums[i]); backtrack(i + 1, path); path.pop();' },
      { level: 5, title: 'Full Solution', hintText: '2^N subsets each taking O(N) copy. Time: O(N * 2^N), Space: O(N) recursion stack.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def subsets(self, nums: list[int]) -> list[list[int]]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        return new ArrayList<>();\n    }\n}',
      javascript: 'var subsets = function(nums) {\n};'
    },
    solutionCode: {
      python: 'def subsets(nums):\n    res = []\n    def backtrack(start, path):\n        res.append(list(path))\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()\n    backtrack(0, [])\n    return res',
      cpp: 'vector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> res;\n    vector<int> path;\n    function<void(int)> backtrack = [&](int start) {\n        res.push_back(path);\n        for (int i = start; i < nums.size(); ++i) {\n            path.push_back(nums[i]);\n            backtrack(i + 1);\n            path.pop_back();\n        }\n    };\n    backtrack(0);\n    return res;\n}'
    },
    optimalTimeComplexity: 'O(N * 2^N)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Facebook', 'Amazon', 'Bloomberg'],
    tags: ['Array', 'Backtracking', 'Bit Manipulation'],
    order: 26
  },
  {
    title: 'Word Search',
    slug: 'word-search',
    topicSlug: 'backtracking',
    patternSlug: 'grid-dfs-backtrack',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/word-search/',
    description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15', 'board and word consist of only lowercase and uppercase English letters.'],
    inputFormat: '2D board of characters and string word.',
    outputFormat: 'Boolean true if word exists, false otherwise.',
    sampleTestCases: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true', explanation: 'Word matches path (0,0)->(0,1)->(0,2)->(1,2)->(2,2)->(2,1).' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true', explanation: 'Path exists.' }
    ],
    hiddenTestCases: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false' },
      { input: 'board = [["a"]], word = "a"', output: 'true' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Check each cell as potential starting point. Use DFS to search all 4 directions.' },
      { level: 2, title: 'Pattern', hintText: 'Grid DFS with in-place cell marking ("#") and backtracking unmarking.' },
      { level: 3, title: 'Approach', hintText: 'If board[r][c] != word[k], return False. Temporarily mark board[r][c] = "#", recurse on 4 neighbors, then restore board[r][c].' },
      { level: 4, title: 'Pseudo-code', hintText: 'def dfs(r, c, k): if k == len(word): return True; if out_of_bounds or board[r][c] != word[k]: return False; tmp = board[r][c]; board[r][c] = "#"; res = dfs(r+1,c,k+1) or dfs(r-1,c,k+1) or dfs(r,c+1,k+1) or dfs(r,c-1,k+1); board[r][c] = tmp; return res;' },
      { level: 5, title: 'Full Solution', hintText: 'DFS backtracking in 4 directions. Time: O(M * N * 3^L), Space: O(L).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def exist(self, board: list[list[str]], word: str) -> bool:\n        pass',
      cpp: 'class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        return false;\n    }\n};',
      java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        return false;\n    }\n}',
      javascript: 'var exist = function(board, word) {\n};'
    },
    solutionCode: {
      python: 'def exist(board, word):\n    R, C = len(board), len(board[0])\n    def dfs(r, c, k):\n        if k == len(word): return True\n        if r < 0 or r >= R or c < 0 or c >= C or board[r][c] != word[k]: return False\n        tmp, board[r][c] = board[r][c], "#"\n        found = dfs(r+1, c, k+1) or dfs(r-1, c, k+1) or dfs(r, c+1, k+1) or dfs(r, c-1, k+1)\n        board[r][c] = tmp\n        return found\n    for r in range(R):\n        for c in range(C):\n            if dfs(r, c, 0): return True\n    return False',
      cpp: 'bool exist(vector<vector<char>>& board, string word) {\n    int R = board.size(), C = board[0].size();\n    function<bool(int, int, int)> dfs = [&](int r, int c, int k) {\n        if (k == word.size()) return true;\n        if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] != word[k]) return false;\n        char tmp = board[r][c];\n        board[r][c] = \'#\';\n        bool found = dfs(r+1, c, k+1) || dfs(r-1, c, k+1) || dfs(r, c+1, k+1) || dfs(r, c-1, k+1);\n        board[r][c] = tmp;\n        return found;\n    };\n    for (int r = 0; r < R; ++r) for (int c = 0; c < C; ++c) if (dfs(r, c, 0)) return true;\n    return false;\n}'
    },
    optimalTimeComplexity: 'O(M * N * 3^L)',
    optimalSpaceComplexity: 'O(L)',
    companies: ['Amazon', 'Bloomberg', 'Microsoft'],
    tags: ['Array', 'Backtracking', 'Matrix'],
    order: 27
  },
  {
    title: 'N-Queens',
    slug: 'n-queens',
    topicSlug: 'backtracking',
    patternSlug: 'constraint-satisfaction',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/n-queens/',
    description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.',
    constraints: ['1 <= n <= 9'],
    inputFormat: 'Integer board dimension n.',
    outputFormat: 'List of all valid chessboard configurations.',
    sampleTestCases: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: 'Two distinct 4-queens configurations.' },
      { input: 'n = 1', output: '[["Q"]]', explanation: 'Single queen on 1x1 board.' }
    ],
    hiddenTestCases: [
      { input: 'n = 2', output: '[]' },
      { input: 'n = 3', output: '[]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Place one queen per row. Track columns, positive diagonals (r + c), and negative diagonals (r - c).' },
      { level: 2, title: 'Pattern', hintText: 'Exact Constraint Satisfaction Backtracking using lookup sets.' },
      { level: 3, title: 'Approach', hintText: 'backtrack(row). If row == n, format board. Otherwise iterate c in 0..n-1; check if c, (r+c), (r-c) are occupied.' },
      { level: 4, title: 'Pseudo-code', hintText: 'cols = set(); pos_diag = set(); neg_diag = set(); def backtrack(r): if r == n: save(); for c in range(n): if c in cols or (r+c) in pos_diag or (r-c) in neg_diag: continue; add sets; backtrack(r+1); remove sets;' },
      { level: 5, title: 'Full Solution', hintText: 'Constraint tracking reduces search branch complexity to O(N!). Time: O(N!), Space: O(N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def solveNQueens(self, n: int) -> list[list[str]]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        return new ArrayList<>();\n    }\n}',
      javascript: 'var solveNQueens = function(n) {\n};'
    },
    solutionCode: {
      python: 'def solveNQueens(n):\n    cols, pos_diag, neg_diag = set(), set(), set()\n    res = []\n    board = [["."] * n for _ in range(n)]\n    def backtrack(r):\n        if r == n:\n            res.append(["".join(row) for row in board])\n            return\n        for c in range(n):\n            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag: continue\n            cols.add(c); pos_diag.add(r + c); neg_diag.add(r - c)\n            board[r][c] = "Q"\n            backtrack(r + 1)\n            cols.remove(c); pos_diag.remove(r + c); neg_diag.remove(r - c)\n            board[r][c] = "."\n    backtrack(0)\n    return res',
      cpp: 'vector<vector<string>> solveNQueens(int n) {\n    vector<vector<string>> res;\n    vector<string> board(n, string(n, \'.\'));\n    vector<bool> cols(n, false), d1(2*n, false), d2(2*n, false);\n    function<void(int)> backtrack = [&](int r) {\n        if (r == n) { res.push_back(board); return; }\n        for (int c = 0; c < n; ++c) {\n            if (cols[c] || d1[r + c] || d2[r - c + n]) continue;\n            cols[c] = d1[r + c] = d2[r - c + n] = true;\n            board[r][c] = \'Q\';\n            backtrack(r + 1);\n            board[r][c] = \'.\';\n            cols[c] = d1[r + c] = d2[r - c + n] = false;\n        }\n    };\n    backtrack(0);\n    return res;\n}'
    },
    optimalTimeComplexity: 'O(N!)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Google', 'Meta', 'Amazon'],
    tags: ['Array', 'Backtracking'],
    order: 28
  },

  // ==========================================
  // 10. TREES AND BINARY SEARCH TREES
  // ==========================================
  {
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    topicSlug: 'trees',
    patternSlug: 'tree-dfs-depth',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    description: 'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    inputFormat: 'Root node of a binary tree.',
    outputFormat: 'Integer maximum depth.',
    sampleTestCases: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: 'Path 3 -> 20 -> 15 has length 3.' },
      { input: 'root = [1,null,2]', output: '2', explanation: 'Depth is 2.' }
    ],
    hiddenTestCases: [
      { input: 'root = []', output: '0' },
      { input: 'root = [0]', output: '1' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Depth of any node is 1 + max(depth(left), depth(right)). Base case: null node has depth 0.' },
      { level: 2, title: 'Pattern', hintText: 'Postorder Tree DFS (Divide and Conquer).' },
      { level: 3, title: 'Approach', hintText: 'Recursively compute maxDepth(root.left) and maxDepth(root.right), then return 1 + max.' },
      { level: 4, title: 'Pseudo-code', hintText: 'def maxDepth(root): if not root: return 0; return 1 + max(maxDepth(root.left), maxDepth(root.right));' },
      { level: 5, title: 'Full Solution', hintText: 'Single DFS pass visiting each node once. Time: O(N), Space: O(height).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int maxDepth(TreeNode root) {\n        return 0;\n    }\n}',
      javascript: 'var maxDepth = function(root) {\n};'
    },
    solutionCode: {
      python: 'def maxDepth(root):\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))',
      cpp: 'int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(H)',
    companies: ['LinkedIn', 'Amazon', 'Apple', 'Google'],
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    order: 29
  },
  {
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    topicSlug: 'trees',
    patternSlug: 'tree-reversal-bfs-dfs',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    inputFormat: 'Root node of a binary tree.',
    outputFormat: 'Root of inverted binary tree.',
    sampleTestCases: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Every left and right subtree swapped.' },
      { input: 'root = [2,1,3]', output: '[2,3,1]', explanation: 'Left and right child swapped.' }
    ],
    hiddenTestCases: [
      { input: 'root = []', output: '[]' },
      { input: 'root = [1]', output: '[1]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'To invert a tree, swap the left and right children of every node in the tree.' },
      { level: 2, title: 'Pattern', hintText: 'Recursive Preorder/Postorder Traversal.' },
      { level: 3, title: 'Approach', hintText: 'root.left, root.right = invert(root.right), invert(root.left).' },
      { level: 4, title: 'Pseudo-code', hintText: 'if not root: return None; root.left, root.right = invertTree(root.right), invertTree(root.left); return root;' },
      { level: 5, title: 'Full Solution', hintText: 'Recursive tree swap. Time: O(N), Space: O(H).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        pass',
      cpp: 'class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        return nullptr;\n    }\n};',
      java: 'class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        return null;\n    }\n}',
      javascript: 'var invertTree = function(root) {\n};'
    },
    solutionCode: {
      python: 'def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root',
      cpp: 'TreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    TreeNode* tmp = root->left;\n    root->left = invertTree(root->right);\n    root->right = invertTree(tmp);\n    return root;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(H)',
    companies: ['Google', 'Amazon', 'Apple'],
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    order: 29.5
  },
  {
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    topicSlug: 'binary-search-trees',
    patternSlug: 'bst-range-validation',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as: The left subtree of a node contains only nodes with keys strictly less than the node\'s key. The right subtree contains only keys strictly greater than the node\'s key. Both left and right subtrees must also be BSTs.',
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    inputFormat: 'Root node of a binary tree.',
    outputFormat: 'Boolean true if valid BST, false otherwise.',
    sampleTestCases: [
      { input: 'root = [2,1,3]', output: 'true', explanation: 'Valid BST property holds everywhere.' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The root node\'s value is 5 but its right child\'s value is 4.' }
    ],
    hiddenTestCases: [
      { input: 'root = [2,2,2]', output: 'false' },
      { input: 'root = [5,4,6,null,null,3,7]', output: 'false' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'It is not enough that left child < root < right child. ALL nodes in the left subtree must be less than root.' },
      { level: 2, title: 'Pattern', hintText: 'Top-down Range Pass (min_val, max_val) or Inorder strictly increasing verification.' },
      { level: 3, title: 'Approach', hintText: 'validate(node, low, high). Node.val must satisfy low < val < high. Recurse left with (low, val) and right with (val, high).' },
      { level: 4, title: 'Pseudo-code', hintText: 'def validate(node, low=-inf, high=inf): if not node: return True; if not (low < node.val < high): return False; return validate(node.left, low, node.val) and validate(node.right, node.val, high);' },
      { level: 5, title: 'Full Solution', hintText: 'Top-down range validation. Time: O(N), Space: O(H).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        pass',
      cpp: 'class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        return false;\n    }\n};',
      java: 'class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return false;\n    }\n}',
      javascript: 'var isValidBST = function(root) {\n};'
    },
    solutionCode: {
      python: 'def isValidBST(root):\n    def validate(node, low=float("-inf"), high=float("inf")):\n        if not node: return True\n        if not (low < node.val < high): return False\n        return validate(node.left, low, node.val) and validate(node.right, node.val, high)\n    return validate(root)',
      cpp: 'bool isValidBST(TreeNode* root) {\n    function<bool(TreeNode*, long long, long long)> validate = [&](TreeNode* node, long long low, long long high) {\n        if (!node) return true;\n        if (node->val <= low || node->val >= high) return false;\n        return validate(node->left, low, node->val) && validate(node->right, node->val, high);\n    };\n    return validate(root, LLONG_MIN, LLONG_MAX);\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(H)',
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Bloomberg'],
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    order: 30
  },
  {
    title: 'Binary Tree Maximum Path Sum',
    slug: 'binary-tree-maximum-path-sum',
    topicSlug: 'trees',
    patternSlug: 'postorder-gain-calculation',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
    constraints: ['The number of nodes in the tree is in the range [1, 3 * 10^4].', '-1000 <= Node.val <= 1000'],
    inputFormat: 'Root node of a binary tree.',
    outputFormat: 'Integer maximum path sum.',
    sampleTestCases: [
      { input: 'root = [1,2,3]', output: '6', explanation: 'Path 2 -> 1 -> 3 has sum 6.' },
      { input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: 'Path 15 -> 20 -> 7 has sum 42.' }
    ],
    hiddenTestCases: [
      { input: 'root = [-3]', output: '-3' },
      { input: 'root = [2,-1]', output: '2' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'A path can turn at any node (acting as highest node in path), combining left branch gain + node.val + right branch gain.' },
      { level: 2, title: 'Pattern', hintText: 'Postorder DFS with Global Maxima tracking.' },
      { level: 3, title: 'Approach', hintText: 'gain(node) returns node.val + max(0, max(gain(left), gain(right))). At each node, update max_path = max(max_path, node.val + left_gain + right_gain).' },
      { level: 4, title: 'Pseudo-code', hintText: 'max_sum = -inf; def dfs(node): if not node: return 0; l = max(0, dfs(node.left)); r = max(0, dfs(node.right)); max_sum = max(max_sum, node.val + l + r); return node.val + max(l, r);' },
      { level: 5, title: 'Full Solution', hintText: 'Postorder traversal computes max branch gain in O(N) time and O(H) space.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def maxPathSum(self, root: Optional[TreeNode]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int maxPathSum(TreeNode* root) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int maxPathSum(TreeNode root) {\n        return 0;\n    }\n}',
      javascript: 'var maxPathSum = function(root) {\n};'
    },
    solutionCode: {
      python: 'def maxPathSum(root):\n    max_s = float("-inf")\n    def dfs(node):\n        nonlocal max_s\n        if not node: return 0\n        l = max(0, dfs(node.left))\n        r = max(0, dfs(node.right))\n        max_s = max(max_s, node.val + l + r)\n        return node.val + max(l, r)\n    dfs(root)\n    return max_s',
      cpp: 'int maxPathSum(TreeNode* root) {\n    int max_s = INT_MIN;\n    function<int(TreeNode*)> dfs = [&](TreeNode* node) {\n        if (!node) return 0;\n        int l = max(0, dfs(node->left));\n        int r = max(0, dfs(node->right));\n        max_s = max(max_s, node->val + l + r);\n        return node->val + max(l, r);\n    };\n    dfs(root);\n    return max_s;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(H)',
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
    tags: ['Dynamic Programming', 'Tree', 'Depth-First Search', 'Binary Tree'],
    order: 31
  },

  // ==========================================
  // 11. HEAPS
  // ==========================================
  {
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element-in-an-array',
    topicSlug: 'heaps',
    patternSlug: 'top-k-elements-min-heap',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element. Can you solve it without sorting?',
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    inputFormat: 'Array of integers nums and integer k.',
    outputFormat: 'Kth largest integer.',
    sampleTestCases: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: '2nd largest element is 5.' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4', explanation: '4th largest element is 4.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1], k = 1', output: '1' },
      { input: 'nums = [7,6,5,4,3,2,1], k = 5', output: '3' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Sorting takes O(N log N). A min-heap of size k keeps the top k largest elements.' },
      { level: 2, title: 'Pattern', hintText: 'Min-Heap of fixed capacity k.' },
      { level: 3, title: 'Approach', hintText: 'Push each element into the min-heap. If heap size exceeds k, pop the smallest element. After all elements, heap top is the kth largest.' },
      { level: 4, title: 'Pseudo-code', hintText: 'heap = []; for x in nums: heappush(heap, x); if len(heap) > k: heappop(heap); return heap[0];' },
      { level: 5, title: 'Full Solution', hintText: 'Maintains size k min-heap. Time: O(N log K), Space: O(K).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        return 0;\n    }\n}',
      javascript: 'var findKthLargest = function(nums, k) {\n};'
    },
    solutionCode: {
      python: 'import heapq\ndef findKthLargest(nums, k):\n    heap = []\n    for x in nums:\n        heapq.heappush(heap, x)\n        if len(heap) > k: heapq.heappop(heap)\n    return heap[0]',
      cpp: 'int findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> min_heap;\n    for (int x : nums) {\n        min_heap.push(x);\n        if (min_heap.size() > k) min_heap.pop();\n    }\n    return min_heap.top();\n}'
    },
    optimalTimeComplexity: 'O(N log K)',
    optimalSpaceComplexity: 'O(K)',
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
    tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'],
    order: 32
  },
  {
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    topicSlug: 'heaps',
    patternSlug: 'frequency-min-heap',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].', 'It is guaranteed that the answer is unique.'],
    inputFormat: 'Array nums and integer k.',
    outputFormat: 'List of k most frequent elements.',
    sampleTestCases: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explanation: '1 appears 3 times, 2 appears 2 times.' },
      { input: 'nums = [1], k = 1', output: '[1]', explanation: 'Single element.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [4,1,-1,2,-1,2,3], k = 2', output: '[-1,2]' },
      { input: 'nums = [3,0,1,0], k = 1', output: '[0]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Count frequencies with a hash map, then retrieve top k using a heap or bucket sort.' },
      { level: 2, title: 'Pattern', hintText: 'Min-Heap of size k storing (freq, num) or Bucket Sort by frequency.' },
      { level: 3, title: 'Approach', hintText: 'Build frequency count. Push (freq, num) to min-heap, popping when size > k.' },
      { level: 4, title: 'Pseudo-code', hintText: 'counts = Counter(nums); heap = []; for num, freq in counts.items(): heappush(heap, (freq, num)); if len(heap) > k: heappop(heap); return [num for freq, num in heap];' },
      { level: 5, title: 'Full Solution', hintText: 'Min-heap over unique items. Time: O(N log K), Space: O(N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def topKFrequent(self, nums: list[int], k: int) -> list[int]:\n        pass',
      cpp: 'class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        return {};\n    }\n};',
      java: 'class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        return new int[]{};\n    }\n}',
      javascript: 'var topKFrequent = function(nums, k) {\n};'
    },
    solutionCode: {
      python: 'from collections import Counter\nimport heapq\ndef topKFrequent(nums, k):\n    counts = Counter(nums)\n    heap = []\n    for num, freq in counts.items():\n        heapq.heappush(heap, (freq, num))\n        if len(heap) > k: heapq.heappop(heap)\n    return [num for freq, num in heap]',
      cpp: 'vector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int, int> counts;\n    for (int x : nums) counts[x]++;\n    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;\n    for (auto& [num, freq] : counts) {\n        pq.push({freq, num});\n        if (pq.size() > k) pq.pop();\n    }\n    vector<int> res;\n    while (!pq.empty()) { res.push_back(pq.top().second); pq.pop(); }\n    return res;\n}'
    },
    optimalTimeComplexity: 'O(N log K)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Amazon', 'Meta', 'Google'],
    tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Bucket Sort'],
    order: 33
  },
  {
    title: 'Find Median from Data Stream',
    slug: 'find-median-from-data-stream',
    topicSlug: 'heaps',
    patternSlug: 'two-heaps-stream',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/find-median-from-data-stream/',
    description: 'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class with addNum(int num) and findMedian() -> double.',
    constraints: ['-10^5 <= num <= 10^5', 'There will be at least one element in the data structure before calling findMedian.', 'At most 5 * 10^4 calls will be made to addNum and findMedian.'],
    inputFormat: 'Sequential invocations of addNum and findMedian.',
    outputFormat: 'Float median at any query moment.',
    sampleTestCases: [
      { input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()', output: '[null,null,1.5,null,2.0]', explanation: 'Median of [1,2] is 1.5; median of [1,2,3] is 2.' },
      { input: 'addNum(5), findMedian()', output: '[null,5.0]', explanation: 'Single element median.' }
    ],
    hiddenTestCases: [
      { input: 'addNum(-1), addNum(-2), addNum(-3), findMedian()', output: '[null,null,null,-2.0]' },
      { input: 'addNum(6), addNum(10), findMedian()', output: '[null,null,8.0]' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Maintain numbers split into lower half (max-heap) and upper half (min-heap).' },
      { level: 2, title: 'Pattern', hintText: 'Dual-Heap Balancing (Max-Heap + Min-Heap).' },
      { level: 3, title: 'Approach', hintText: 'max_heap stores smaller half, min_heap stores larger half. Sizes must be equal or max_heap has 1 extra.' },
      { level: 4, title: 'Pseudo-code', hintText: 'heappush(small, -num); heappush(large, -heappop(small)); if len(large) > len(small): heappush(small, -heappop(large)); median: return -small[0] if len(small)>len(large) else (-small[0]+large[0])/2;' },
      { level: 5, title: 'Full Solution', hintText: 'addNum: O(log N), findMedian: O(1). Space: O(N).' }
    ],
    starterCode: {
      python: 'class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num: int) -> None:\n        pass\n    def findMedian(self) -> float:\n        pass',
      cpp: 'class MedianFinder {\npublic:\n    MedianFinder() {}\n    void addNum(int num) {}\n    double findMedian() { return 0.0; }\n};',
      java: 'class MedianFinder {\n    public MedianFinder() {}\n    public void addNum(int num) {}\n    public double findMedian() { return 0.0; }\n}',
      javascript: 'var MedianFinder = function() {};\nMedianFinder.prototype.addNum = function(num) {};\nMedianFinder.prototype.findMedian = function() {};'
    },
    solutionCode: {
      python: 'import heapq\nclass MedianFinder:\n    def __init__(self):\n        self.small = [] # max-heap (invert values)\n        self.large = [] # min-heap\n    def addNum(self, num: int) -> None:\n        heapq.heappush(self.small, -num)\n        heapq.heappush(self.large, -heapq.heappop(self.small))\n        if len(self.large) > len(self.small):\n            heapq.heappush(self.small, -heapq.heappop(self.large))\n    def findMedian(self) -> float:\n        if len(self.small) > len(self.large):\n            return float(-self.small[0])\n        return (-self.small[0] + self.large[0]) / 2.0',
      cpp: 'class MedianFinder {\n    priority_queue<int> small;\n    priority_queue<int, vector<int>, greater<int>> large;\npublic:\n    void addNum(int num) {\n        small.push(num);\n        large.push(small.top()); small.pop();\n        if (large.size() > small.size()) {\n            small.push(large.top()); large.pop();\n        }\n    }\n    double findMedian() {\n        if (small.size() > large.size()) return small.top();\n        return (small.top() + large.top()) / 2.0;\n    }\n};'
    },
    optimalTimeComplexity: 'O(log N) insert, O(1) query',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Google', 'Amazon', 'Apple', 'Meta', 'Goldman Sachs'],
    tags: ['Two Pointers', 'Design', 'Sorting', 'Heap (Priority Queue)', 'Data Stream'],
    order: 34
  },

  // ==========================================
  // 12. GRAPHS AND BFS/DFS
  // ==========================================
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    topicSlug: 'graphs',
    patternSlug: 'grid-connected-components',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/number-of-islands/',
    description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
    inputFormat: '2D binary grid of characters "1" and "0".',
    outputFormat: 'Total count of connected islands.',
    sampleTestCases: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: 'All connected lands form 1 island.' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: '3 separate connected components.' }
    ],
    hiddenTestCases: [
      { input: 'grid = [["1"]]', output: '1' },
      { input: 'grid = [["0"]]', output: '0' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Each connected component of "1"s represents an island.' },
      { level: 2, title: 'Pattern', hintText: 'Grid BFS/DFS flood-fill traversal.' },
      { level: 3, title: 'Approach', hintText: 'Iterate through every cell. When you find "1", increment island count and run BFS/DFS to sink the entire island (set "1"s to "0").' },
      { level: 4, title: 'Pseudo-code', hintText: 'count = 0; for r in range(m): for c in range(n): if grid[r][c] == "1": count += 1; sink_dfs(r, c); return count;' },
      { level: 5, title: 'Full Solution', hintText: 'Each cell visited a constant number of times. Time: O(M * N), Space: O(M * N) worst case recursion.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}',
      javascript: 'var numIslands = function(grid) {\n};'
    },
    solutionCode: {
      python: 'def numIslands(grid):\n    if not grid: return 0\n    R, C = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if r < 0 or r >= R or c < 0 or c >= C or grid[r][c] != "1": return\n        grid[r][c] = "0"\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == "1":\n                count += 1\n                dfs(r, c)\n    return count',
      cpp: 'int numIslands(vector<vector<char>>& grid) {\n    int R = grid.size(), C = grid[0].size(), count = 0;\n    function<void(int, int)> dfs = [&](int r, int c) {\n        if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] != \'1\') return;\n        grid[r][c] = \'0\';\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n    };\n    for (int r = 0; r < R; ++r) for (int c = 0; c < C; ++c) if (grid[r][c] == \'1\') { count++; dfs(r, c); }\n    return count;\n}'
    },
    optimalTimeComplexity: 'O(M * N)',
    optimalSpaceComplexity: 'O(M * N)',
    companies: ['Amazon', 'Bloomberg', 'Google', 'Microsoft'],
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    order: 35
  },
  {
    title: 'Course Schedule',
    slug: 'course-schedule',
    topicSlug: 'graphs',
    patternSlug: 'topological-sort-kahn',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/course-schedule/',
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2', '0 <= ai, bi < numCourses', 'All the pairs prerequisites[i] are unique.'],
    inputFormat: 'Integer numCourses and prerequisites array of [course, prereq].',
    outputFormat: 'Boolean true if cycle-free topological sort exists, false otherwise.',
    sampleTestCases: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take course 0 then course 1.' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: 'Mutual dependency creates a directed cycle.' }
    ],
    hiddenTestCases: [
      { input: 'numCourses = 3, prerequisites = [[0,1],[0,2],[1,2]]', output: 'true' },
      { input: 'numCourses = 1, prerequisites = []', output: 'true' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Courses and prerequisites form a directed graph. Completing all courses is possible if and only if the graph has no directed cycles.' },
      { level: 2, title: 'Pattern', hintText: 'Topological Sort via Kahn Algorithm (In-degree Queue).' },
      { level: 3, title: 'Approach', hintText: 'Build adjacency list and in_degree array. Queue all courses with in_degree == 0. Decrement neighbor in_degrees as courses are processed.' },
      { level: 4, title: 'Pseudo-code', hintText: 'in_degree = [0]*numCourses; q = deque([i for i in range(n) if in_degree[i]==0]); count = 0; while q: u = q.popleft(); count += 1; for v in adj[u]: in_degree[v] -= 1; if in_degree[v] == 0: q.append(v); return count == numCourses;' },
      { level: 5, title: 'Full Solution', hintText: 'Kahn Topological Sort visits each vertex and edge once. Time: O(V + E), Space: O(V + E).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        pass',
      cpp: 'class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        return false;\n    }\n};',
      java: 'class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        return false;\n    }\n}',
      javascript: 'var canFinish = function(numCourses, prerequisites) {\n};'
    },
    solutionCode: {
      python: 'from collections import deque\ndef canFinish(numCourses, prerequisites):\n    adj = [[] for _ in range(numCourses)]\n    in_degree = [0] * numCourses\n    for dest, src in prerequisites:\n        adj[src].append(dest)\n        in_degree[dest] += 1\n    q = deque([i for i in range(numCourses) if in_degree[i] == 0])\n    visited = 0\n    while q:\n        u = q.popleft()\n        visited += 1\n        for v in adj[u]:\n            in_degree[v] -= 1\n            if in_degree[v] == 0: q.append(v)\n    return visited == numCourses',
      cpp: 'bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    vector<vector<int>> adj(numCourses);\n    vector<int> in_degree(numCourses, 0);\n    for (auto& p : prerequisites) {\n        adj[p[1]].push_back(p[0]);\n        in_degree[p[0]]++;\n    }\n    queue<int> q;\n    for (int i = 0; i < numCourses; ++i) if (in_degree[i] == 0) q.push(i);\n    int visited = 0;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        visited++;\n        for (int v : adj[u]) if (--in_degree[v] == 0) q.push(v);\n    }\n    return visited == numCourses;\n}'
    },
    optimalTimeComplexity: 'O(V + E)',
    optimalSpaceComplexity: 'O(V + E)',
    companies: ['Amazon', 'Google', 'Meta', 'Uber'],
    tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    order: 36
  },
  {
    title: 'Word Ladder',
    slug: 'word-ladder',
    topicSlug: 'graphs',
    patternSlug: 'bidirectional-bfs-shortest-path',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/word-ladder/',
    description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter, and each si is in wordList. Return the number of words in the shortest transformation sequence, or 0 if no sequence exists.',
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000', 'wordList[i].length == beginWord.length', 'beginWord, endWord, and wordList[i] consist of lowercase English letters.'],
    inputFormat: 'beginWord, endWord, and wordList array.',
    outputFormat: 'Shortest path length (number of words).',
    sampleTestCases: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog" takes 5 words.' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0', explanation: 'endWord "cog" is not in wordList.' }
    ],
    hiddenTestCases: [
      { input: 'beginWord = "a", endWord = "c", wordList = ["a","b","c"]', output: '2' },
      { input: 'beginWord = "hot", endWord = "dog", wordList = ["hot","dog"]', output: '0' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Shortest path in an unweighted graph is solved using Breadth-First Search (BFS).' },
      { level: 2, title: 'Pattern', hintText: 'Level-order BFS exploring adjacent 1-letter mutation words.' },
      { level: 3, title: 'Approach', hintText: 'Convert wordList to a hash set for O(1) removals. Mutate each character of current word from \'a\' to \'z\'.' },
      { level: 4, title: 'Pseudo-code', hintText: 'q = deque([(beginWord, 1)]); words = set(wordList); while q: w, d = q.popleft(); if w == endWord: return d; for i in range(len(w)): for c in "abcdefghijklmnopqrstuvwxyz": nw = w[:i] + c + w[i+1:]; if nw in words: words.remove(nw); q.append((nw, d+1)); return 0;' },
      { level: 5, title: 'Full Solution', hintText: 'BFS shortest path. Time: O(M^2 * N), Space: O(M * N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        return 0;\n    }\n}',
      javascript: 'var ladderLength = function(beginWord, endWord, wordList) {\n};'
    },
    solutionCode: {
      python: 'from collections import deque\ndef ladderLength(beginWord, endWord, wordList):\n    words = set(wordList)\n    if endWord not in words: return 0\n    q = deque([(beginWord, 1)])\n    while q:\n        word, dist = q.popleft()\n        if word == endWord: return dist\n        for i in range(len(word)):\n            for c in "abcdefghijklmnopqrstuvwxyz":\n                nxt = word[:i] + c + word[i+1:]\n                if nxt in words:\n                    words.remove(nxt)\n                    q.append((nxt, dist + 1))\n    return 0',
      cpp: 'int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n    unordered_set<string> words(wordList.begin(), wordList.end());\n    if (!words.count(endWord)) return 0;\n    queue<pair<string, int>> q;\n    q.push({beginWord, 1});\n    while (!q.empty()) {\n        auto [word, dist] = q.front(); q.pop();\n        if (word == endWord) return dist;\n        for (int i = 0; i < word.size(); ++i) {\n            char orig = word[i];\n            for (char c = \'a\'; c <= \'z\'; ++c) {\n                word[i] = c;\n                if (words.count(word)) {\n                    words.erase(word);\n                    q.push({word, dist + 1});\n                }\n            }\n            word[i] = orig;\n        }\n    }\n    return 0;\n}'
    },
    optimalTimeComplexity: 'O(M^2 * N)',
    optimalSpaceComplexity: 'O(M * N)',
    companies: ['Amazon', 'Google', 'Facebook', 'Uber'],
    tags: ['Hash Table', 'String', 'Breadth-First Search'],
    order: 37
  },

  // ==========================================
  // 13. GREEDY ALGORITHMS
  // ==========================================
  {
    title: 'Jump Game',
    slug: 'jump-game',
    topicSlug: 'arrays',
    patternSlug: 'greedy-farthest-reach',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/jump-game/',
    description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    inputFormat: 'Array of jump capacities nums.',
    outputFormat: 'Boolean true if reachable, false otherwise.',
    sampleTestCases: [
      { input: 'nums = [2,3,1,1,4]', output: 'true', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
      { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'Index 3 has jump 0, preventing progress.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [0]', output: 'true' },
      { input: 'nums = [2,0,0]', output: 'true' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'You only care about the farthest index you can possibly reach from any visited position.' },
      { level: 2, title: 'Pattern', hintText: 'Greedy Farthest Reach Horizon.' },
      { level: 3, title: 'Approach', hintText: 'Maintain max_reach. If current index i > max_reach, you are stuck and cannot proceed. Otherwise max_reach = max(max_reach, i + nums[i]).' },
      { level: 4, title: 'Pseudo-code', hintText: 'max_reach = 0; for i, jump in enumerate(nums): if i > max_reach: return False; max_reach = max(max_reach, i + jump); if max_reach >= len(nums) - 1: return True; return True;' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass greedy reach. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def canJump(self, nums: list[int]) -> bool:\n        pass',
      cpp: 'class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        return false;\n    }\n};',
      java: 'class Solution {\n    public boolean canJump(int[] nums) {\n        return false;\n    }\n}',
      javascript: 'var canJump = function(nums) {\n};'
    },
    solutionCode: {
      python: 'def canJump(nums):\n    max_reach = 0\n    for i, jump in enumerate(nums):\n        if i > max_reach: return False\n        max_reach = max(max_reach, i + jump)\n        if max_reach >= len(nums) - 1: return True\n    return True',
      cpp: 'bool canJump(vector<int>& nums) {\n    int max_reach = 0;\n    for (int i = 0; i < nums.size(); ++i) {\n        if (i > max_reach) return false;\n        max_reach = max(max_reach, i + nums[i]);\n        if (max_reach >= nums.size() - 1) return true;\n    }\n    return true;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Apple'],
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
    order: 38
  },
  {
    title: 'Gas Station',
    slug: 'gas-station',
    topicSlug: 'arrays',
    patternSlug: 'circular-deficit-greedy',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/gas-station/',
    description: 'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations. Return the starting gas station\'s index if you can travel around the circuit once in the clockwise direction, otherwise return -1.',
    constraints: ['n == gas.length == cost.length', '1 <= n <= 10^5', '0 <= gas[i], cost[i] <= 10^4'],
    inputFormat: 'Arrays gas and cost.',
    outputFormat: 'Starting station index or -1.',
    sampleTestCases: [
      { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3', explanation: 'Start at station 3 (index 3). Tank accumulates enough gas to complete the circle.' },
      { input: 'gas = [2,3,4], cost = [3,4,3]', output: '-1', explanation: 'Total gas is 9, total cost is 10. Impossible.' }
    ],
    hiddenTestCases: [
      { input: 'gas = [2], cost = [2]', output: '0' },
      { input: 'gas = [5,1,2,3,4], cost = [4,4,1,5,1]', output: '4' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'If sum(gas) < sum(cost), it is mathematically impossible to complete the loop, so return -1.' },
      { level: 2, title: 'Pattern', hintText: 'Greedy Reset on Negative Tank Deficit.' },
      { level: 3, title: 'Approach', hintText: 'If tank becomes negative after leaving station i, no station from start..i can be a valid start. Reset start = i + 1.' },
      { level: 4, title: 'Pseudo-code', hintText: 'if sum(gas) < sum(cost): return -1; total = cur = 0; start = 0; for i in range(n): cur += gas[i] - cost[i]; if cur < 0: start = i + 1; cur = 0; return start;' },
      { level: 5, title: 'Full Solution', hintText: 'Single pass greedy accumulator. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        return -1;\n    }\n};',
      java: 'class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        return -1;\n    }\n}',
      javascript: 'var canCompleteCircuit = function(gas, cost) {\n};'
    },
    solutionCode: {
      python: 'def canCompleteCircuit(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    cur_tank = 0\n    start = 0\n    for i in range(len(gas)):\n        cur_tank += gas[i] - cost[i]\n        if cur_tank < 0:\n            start = i + 1\n            cur_tank = 0\n    return start',
      cpp: 'int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n    int total_gas = 0, total_cost = 0, cur = 0, start = 0;\n    for (int i = 0; i < gas.size(); ++i) {\n        total_gas += gas[i]; total_cost += cost[i];\n        cur += gas[i] - cost[i];\n        if (cur < 0) { start = i + 1; cur = 0; }\n    }\n    return total_gas < total_cost ? -1 : start;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Google', 'Apple'],
    tags: ['Array', 'Greedy'],
    order: 39
  },
  {
    title: 'Candy',
    slug: 'candy',
    topicSlug: 'arrays',
    patternSlug: 'two-pass-greedy',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/candy/',
    description: 'There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings. You are giving candies to these children subjected to the following requirements: Each child must have at least one candy. Children with a higher rating get more candies than their neighbors. Return the minimum number of candies you need to have to distribute the candies to the children.',
    constraints: ['n == ratings.length', '1 <= n <= 2 * 10^4', '0 <= ratings[i] <= 2 * 10^4'],
    inputFormat: 'Array of ratings.',
    outputFormat: 'Total minimum candy count.',
    sampleTestCases: [
      { input: 'ratings = [1,0,2]', output: '5', explanation: 'Distribution [2,1,2] requires 5 candies.' },
      { input: 'ratings = [1,2,2]', output: '4', explanation: 'Distribution [1,2,1] satisfies all rules with 4 candies.' }
    ],
    hiddenTestCases: [
      { input: 'ratings = [1,3,2,2,1]', output: '7' },
      { input: 'ratings = [1,2,87,87,87,2,1]', output: '13' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Satisfying both left and right neighbors simultaneously is tricky. Can you satisfy left neighbors in pass 1 and right neighbors in pass 2?' },
      { level: 2, title: 'Pattern', hintText: 'Two-Pass Greedy (Left-to-Right then Right-to-Left).' },
      { level: 3, title: 'Approach', hintText: 'Initialize candies = [1]*n. Pass 1: if ratings[i] > ratings[i-1], candies[i] = candies[i-1] + 1. Pass 2 (backwards): if ratings[i] > ratings[i+1], candies[i] = max(candies[i], candies[i+1] + 1).' },
      { level: 4, title: 'Pseudo-code', hintText: 'c = [1]*n; for i in range(1, n): if r[i] > r[i-1]: c[i] = c[i-1] + 1; for i in range(n-2, -1, -1): if r[i] > r[i+1]: c[i] = max(c[i], c[i+1] + 1); return sum(c);' },
      { level: 5, title: 'Full Solution', hintText: 'Two passes guarantee both neighbor constraints. Time: O(N), Space: O(N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def candy(self, ratings: list[int]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int candy(vector<int>& ratings) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int candy(int[] ratings) {\n        return 0;\n    }\n}',
      javascript: 'var candy = function(ratings) {\n};'
    },
    solutionCode: {
      python: 'def candy(ratings):\n    n = len(ratings)\n    c = [1] * n\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]: c[i] = c[i - 1] + 1\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]: c[i] = max(c[i], c[i + 1] + 1)\n    return sum(c)',
      cpp: 'int candy(vector<int>& ratings) {\n    int n = ratings.size();\n    vector<int> c(n, 1);\n    for (int i = 1; i < n; ++i) if (ratings[i] > ratings[i-1]) c[i] = c[i-1] + 1;\n    for (int i = n - 2; i >= 0; --i) if (ratings[i] > ratings[i+1]) c[i] = max(c[i], c[i+1] + 1);\n    int ans = 0;\n    for (int x : c) ans += x;\n    return ans;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Amazon', 'Google', 'Microsoft'],
    tags: ['Array', 'Greedy'],
    order: 40
  },

  // ==========================================
  // 14. DYNAMIC PROGRAMMING
  // ==========================================
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    topicSlug: 'dynamic-programming',
    patternSlug: 'fibonacci-dp',
    difficulty: 'Easy',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/climbing-stairs/',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    constraints: ['1 <= n <= 45'],
    inputFormat: 'Integer number of steps n.',
    outputFormat: 'Total distinct ways.',
    sampleTestCases: [
      { input: 'n = 2', output: '2', explanation: 'Two ways: 1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: 'Three ways: 1+1+1, 1+2, 2+1.' }
    ],
    hiddenTestCases: [
      { input: 'n = 1', output: '1' },
      { input: 'n = 4', output: '5' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'To reach step n, you came from step n-1 (1 step) or step n-2 (2 steps).' },
      { level: 2, title: 'Pattern', hintText: '1D State DP: dp[i] = dp[i-1] + dp[i-2] (Fibonacci sequence).' },
      { level: 3, title: 'Approach', hintText: 'Maintain just two variables prev2 and prev1 to store the last two results.' },
      { level: 4, title: 'Pseudo-code', hintText: 'a = 1, b = 1; for _ in range(n - 1): a, b = b, a + b; return b;' },
      { level: 5, title: 'Full Solution', hintText: 'Linear iteration with two variables. Time: O(N), Space: O(1).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}',
      javascript: 'var climbStairs = function(n) {\n};'
    },
    solutionCode: {
      python: 'def climbStairs(n):\n    a, b = 1, 1\n    for _ in range(n - 1):\n        a, b = b, a + b\n    return b',
      cpp: 'int climbStairs(int n) {\n    int a = 1, b = 1;\n    for (int i = 1; i < n; ++i) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return b;\n}'
    },
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(1)',
    companies: ['Amazon', 'Google', 'Apple', 'Meta'],
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    order: 41
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    topicSlug: 'dynamic-programming',
    patternSlug: 'unbounded-knapsack-dp',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/coin-change/',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. You may assume that you have an infinite number of each kind of coin.',
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    inputFormat: 'Array of coin denominations and target amount.',
    outputFormat: 'Minimum coin count or -1.',
    sampleTestCases: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1 (3 coins).' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot make 3 with only 2-coins.' }
    ],
    hiddenTestCases: [
      { input: 'coins = [1], amount = 0', output: '0' },
      { input: 'coins = [1], amount = 2', output: '2' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Greedy fails on denominations like [1, 3, 4] for amount 6 (greedy chooses 4+1+1=3, optimal is 3+3=2). Use DP.' },
      { level: 2, title: 'Pattern', hintText: 'Unbounded Knapsack / 1D Tabulation: dp[i] = min(dp[i], 1 + dp[i - c]).' },
      { level: 3, title: 'Approach', hintText: 'dp = [inf]*(amount + 1); dp[0] = 0. For each coin c and amount i from c to amount: dp[i] = min(dp[i], dp[i-c] + 1).' },
      { level: 4, title: 'Pseudo-code', hintText: 'dp = [inf] * (amount + 1); dp[0] = 0; for c in coins: for i in range(c, amount + 1): dp[i] = min(dp[i], dp[i - c] + 1); return dp[amount] if dp[amount] != inf else -1;' },
      { level: 5, title: 'Full Solution', hintText: 'Bottom-up DP table. Time: O(amount * len(coins)), Space: O(amount).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        return -1;\n    }\n};',
      java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}',
      javascript: 'var coinChange = function(coins, amount) {\n};'
    },
    solutionCode: {
      python: 'def coinChange(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for i in range(c, amount + 1):\n            dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1',
      cpp: 'int coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, 1e9);\n    dp[0] = 0;\n    for (int c : coins) {\n        for (int i = c; i <= amount; ++i) {\n            dp[i] = min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] > 1e8 ? -1 : dp[amount];\n}'
    },
    optimalTimeComplexity: 'O(amount * N)',
    optimalSpaceComplexity: 'O(amount)',
    companies: ['Amazon', 'Bloomberg', 'Microsoft', 'Apple'],
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    order: 42
  },
  {
    title: 'Longest Increasing Subsequence',
    slug: 'longest-increasing-subsequence',
    topicSlug: 'dynamic-programming',
    patternSlug: 'patience-sorting-dp',
    difficulty: 'Medium',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.',
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    inputFormat: 'Array of integers nums.',
    outputFormat: 'Length of longest increasing subsequence.',
    sampleTestCases: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4.' },
      { input: 'nums = [0,1,0,3,2,3]', output: '4', explanation: 'Subsequence [0,1,2,3].' }
    ],
    hiddenTestCases: [
      { input: 'nums = [7,7,7,7,7]', output: '1' },
      { input: 'nums = [1,3,6,7,9,4,10,5,6]', output: '6' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Standard DP gives O(N^2). Can you use binary search (patience sorting) for O(N log N)?' },
      { level: 2, title: 'Pattern', hintText: 'Patience Sorting / Tails array with binary search (bisect_left).' },
      { level: 3, title: 'Approach', hintText: 'Maintain tails array where tails[i] is smallest tail of an increasing subsequence of length i+1. For each x, binary search its insertion point.' },
      { level: 4, title: 'Pseudo-code', hintText: 'tails = []; for x in nums: idx = bisect_left(tails, x); if idx == len(tails): tails.append(x); else: tails[idx] = x; return len(tails);' },
      { level: 5, title: 'Full Solution', hintText: 'Patience sort with binary search. Time: O(N log N), Space: O(N).' }
    ],
    starterCode: {
      python: 'class Solution:\n    def lengthOfLIS(self, nums: list[int]) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int lengthOfLIS(int[] nums) {\n        return 0;\n    }\n}',
      javascript: 'var lengthOfLIS = function(nums) {\n};'
    },
    solutionCode: {
      python: 'import bisect\ndef lengthOfLIS(nums):\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails): tails.append(x)\n        else: tails[idx] = x\n    return len(tails)',
      cpp: 'int lengthOfLIS(vector<int>& nums) {\n    vector<int> tails;\n    for (int x : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    return tails.size();\n}'
    },
    optimalTimeComplexity: 'O(N log N)',
    optimalSpaceComplexity: 'O(N)',
    companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
    tags: ['Array', 'Binary Search', 'Dynamic Programming'],
    order: 43
  },
  {
    title: 'Edit Distance',
    slug: 'edit-distance',
    topicSlug: 'dynamic-programming',
    patternSlug: '2d-grid-levenshtein',
    difficulty: 'Hard',
    source: 'LeetCode Top 150',
    problemUrl: 'https://leetcode.com/problems/edit-distance/',
    description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.',
    constraints: ['0 <= word1.length, word2.length <= 500', 'word1 and word2 consist of lowercase English letters.'],
    inputFormat: 'Two strings word1 and word2.',
    outputFormat: 'Minimum edit distance integer.',
    sampleTestCases: [
      { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse -> rorse (replace \'h\' with \'r\') -> rose (remove \'r\') -> ros (remove \'e\').' },
      { input: 'word1 = "intention", word2 = "execution"', output: '5', explanation: '5 edit operations.' }
    ],
    hiddenTestCases: [
      { input: 'word1 = "", word2 = "a"', output: '1' },
      { input: 'word1 = "abc", word2 = "abc"', output: '0' }
    ],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Let dp[i][j] be the minimum edit distance between word1[:i] and word2[:j].' },
      { level: 2, title: 'Pattern', hintText: '2D Grid Levenshtein Dynamic Programming.' },
      { level: 3, title: 'Approach', hintText: 'If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]. Else dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)).' },
      { level: 4, title: 'Pseudo-code', hintText: 'dp = [[0]*(n+1) for _ in range(m+1)]; for i in range(m+1): dp[i][0] = i; for j in range(n+1): dp[0][j] = j; fill dp using recurrence; return dp[m][n];' },
      { level: 5, title: 'Full Solution', hintText: '2D grid DP. Time: O(M * N), Space: O(M * N) or O(N) optimized.' }
    ],
    starterCode: {
      python: 'class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        pass',
      cpp: 'class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        return 0;\n    }\n};',
      java: 'class Solution {\n    public int minDistance(String word1, String word2) {\n        return 0;\n    }\n}',
      javascript: 'var minDistance = function(word1, word2) {\n};'
    },
    solutionCode: {
      python: 'def minDistance(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i - 1] == word2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]',
      cpp: 'int minDistance(string word1, string word2) {\n    int m = word1.size(), n = word2.size();\n    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n    for (int i = 0; i <= m; ++i) dp[i][0] = i;\n    for (int j = 0; j <= n; ++j) dp[0][j] = j;\n    for (int i = 1; i <= m; ++i) {\n        for (int j = 1; j <= n; ++j) {\n            if (word1[i-1] == word2[j-1]) dp[i][j] = dp[i-1][j-1];\n            else dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});\n        }\n    }\n    return dp[m][n];\n}'
    },
    optimalTimeComplexity: 'O(M * N)',
    optimalSpaceComplexity: 'O(M * N)',
    companies: ['Google', 'Amazon', 'Microsoft'],
    tags: ['String', 'Dynamic Programming'],
    order: 44
  }
];

module.exports = problems;
