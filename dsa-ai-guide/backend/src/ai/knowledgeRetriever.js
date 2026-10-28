/**
 * Knowledge Base & RAG Retrieval Interface.
 * Allows indexing and querying semantic documentation on DSA concepts, pattern templates,
 * and complexity proofs without forcing an external vector DB dependency.
 */

const DSA_KNOWLEDGE_BASE = [
  {
    topic: 'binary-search',
    pattern: 'binary-search-space',
    title: 'Binary Search on Monotonic Answer Spaces',
    content: 'When a predicate P(x) is monotonic (e.g. false, false, ..., true, true), we can binary search the boundary condition in O(log(range)) steps. Common examples include Koko Eating Bananas, Capacity To Ship Packages Within D Days, and Painter Partition.'
  },
  {
    topic: 'two-pointers',
    pattern: 'two-pointer',
    title: 'Opposite-Direction Two Pointer Invariant',
    content: 'On sorted arrays, if sum < target, increment left pointer to increase sum; if sum > target, decrement right pointer. This avoids O(N^2) brute force nested loops.'
  },
  {
    topic: 'sliding-window',
    pattern: 'sliding-window',
    title: 'Dynamic Sliding Window Invariant (Shrink vs Expand)',
    content: 'Expand right pointer to include elements until condition is violated. Once violated, contract left pointer until validity is restored. Updates global maximum/minimum at valid states.'
  },
  {
    topic: 'dynamic-programming',
    pattern: 'dp-memoization-tabulation',
    title: 'Optimal Substructure & Overlapping Subproblems',
    content: 'Dynamic programming applies when the solution to a problem contains optimal solutions to its subproblems and the same subproblems are solved repeatedly. 1D DP addresses linear choices, 2D DP addresses grid or dual-string choices (e.g. LCS, Edit Distance).'
  }
];

class KnowledgeRetriever {
  /**
   * Retrieves relevant conceptual snippets matching query or topic.
   * 
   * @param {string} query - Keyword or topic query
   * @param {number} topK - Number of results to return
   * @returns {Array<Object>}
   */
  async retrieveContext(query, topK = 2) {
    const qLower = (query || '').toLowerCase();
    const scored = DSA_KNOWLEDGE_BASE.map(doc => {
      let score = 0;
      if (qLower.includes(doc.topic)) score += 5;
      if (qLower.includes(doc.pattern)) score += 4;
      if (doc.content.toLowerCase().includes(qLower)) score += 2;
      return { ...doc, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }
}

module.exports = new KnowledgeRetriever();
