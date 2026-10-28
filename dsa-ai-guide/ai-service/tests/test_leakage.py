"""
Test Suite: Syntax-Based Solution Leakage Guard (15 tests)
Faithfully reproducing the 15 leakage tests documented in the IEEE Research Paper (Section 6.1, 6.5).
"""

import pytest
from app.core.leakage import check_solution_leakage, LeakageResult


# Reference solution for Two-Sum
REFERENCE_TWO_SUM = """
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
"""


class TestLeakageCategoriesTable3:
    """Tests evaluating leakage categories from the 80-item author benchmark."""

    def test_01_exact_copy_flagged(self):
        cand = REFERENCE_TWO_SUM
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_leak is True
        assert res.combined_similarity >= 0.99

    def test_02_format_change_flagged(self):
        cand = """
def two_sum(nums, target):

    seen = {}

    for i, num in enumerate(nums):

        complement = target - num
        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []
"""
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_leak is True
        assert res.combined_similarity >= 0.95

    def test_03_identifier_rename_flagged(self):
        # Variable names renamed canonically (nums->arr, target->k, seen->table, num->val)
        cand = """
def solve(arr, k):
    table = {}
    for idx, val in enumerate(arr):
        diff = k - val
        if diff in table:
            return [table[diff], idx]
        table[val] = idx
    return []
"""
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_leak is True
        assert res.combined_similarity >= 0.95

    def test_04_rename_plus_format_flagged(self):
        cand = """
def solution(numbers, goal):

    lookup = {}
    for pos, element in enumerate(numbers):
        remainder = goal - element
        if remainder in lookup:
            return [lookup[remainder], pos]
        lookup[element] = pos

    return []
"""
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_leak is True
        assert res.combined_similarity >= 0.95

    def test_05_mutated_copy_flagged(self):
        cand = """
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            res = [seen[comp], i]
            return res
        seen[num] = i
    return []
"""
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_leak is True
        assert res.combined_similarity >= 0.85

    def test_06_different_algorithm_not_flagged(self):
        # Two-pointer O(N^2) or nested loop
        cand = """
def two_sum(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
"""
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_leak is False
        assert res.combined_similarity < 0.80

    def test_07_partial_outline_not_flagged(self):
        cand = """
def two_sum(nums, target):
    seen = {}
    # Learner should iterate over nums
    pass
"""
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_leak is False
        assert res.combined_similarity < 0.80

    def test_08_unrelated_problem_not_flagged(self):
        cand = """
def is_valid_parentheses(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack
"""
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_leak is False
        assert res.combined_similarity < 0.80

    def test_09_equivalent_rewrite_anomaly(self):
        # Documented limitation in Paper Section 6.5:
        # Syntactic similarity fails to detect algorithmically equivalent rewrites (mean sim ~0.54)
        cand = """
def find_indices(arr, target_sum):
    cache = dict()
    idx = 0
    while idx < len(arr):
        need = target_sum - arr[idx]
        if need in cache:
            return [cache[need], idx]
        cache[arr[idx]] = idx
        idx += 1
    return []
"""
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        # Demonstrates that equivalent rewrites are NOT flagged at tau=0.80
        assert res.is_leak is False
        assert res.combined_similarity < 0.80


class TestLeakageExceptionsAndFallbacks:
    """Short-input exceptions and parse-failure fallback handling."""

    def test_10_short_input_under_12_tokens(self):
        cand = "return [seen[comp], i]"
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_short_input is True
        assert res.is_leak is False
        assert "Short input exception" in res.explanation

    def test_11_short_input_ten_tokens(self):
        cand = "seen = {}\nfor x in nums: pass"
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.is_short_input is True
        assert res.is_leak is False

    def test_12_unparsable_syntax_falls_back_to_raw(self):
        # Prose hint with some syntax errors
        cand = "Here is a hint: seen = { for x in nums missing colon"
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.used_fallback is True
        assert res.is_leak is False

    def test_13_unparsable_identical_raw_text_flagged(self):
        cand = REFERENCE_TWO_SUM + "\n??? syntax error"
        res = check_solution_leakage(cand, cand, threshold=0.80)
        assert res.used_fallback is True
        assert res.is_leak is True

    def test_14_unparsable_dissimilar_not_flagged(self):
        cand = "This is a completely dissimilar prose hint with broken Python syntax: if then else"
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.80)
        assert res.used_fallback is True
        assert res.is_leak is False

    def test_15_custom_threshold_support(self):
        cand = """
def two_sum(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
"""
        # At low threshold tau=0.40, different algorithm gets flagged
        res = check_solution_leakage(cand, REFERENCE_TWO_SUM, threshold=0.40)
        assert res.is_leak is True
