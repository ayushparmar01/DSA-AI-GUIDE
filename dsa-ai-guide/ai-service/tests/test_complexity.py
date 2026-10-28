"""
Test Suite: AST-Based Time-Complexity Heuristic (10 tests)
Faithfully reproducing the 10 complexity tests documented in the IEEE Research Paper (Section 6.1, 6.6).
"""

import pytest
from app.core.complexity import estimate_time_complexity, ComplexityResult


class TestComplexityV0LoopNesting:
    """Tests evaluating Heuristic v0 draft rules."""

    def test_01_constant_time_o1(self):
        code = """
def get_first(arr):
    if len(arr) > 0:
        return arr[0]
    return None
"""
        res = estimate_time_complexity(code, version="v0")
        assert res.complexity == "O(1)"
        assert res.loop_depth == 0

    def test_02_linear_time_on(self):
        code = """
def find_max(arr):
    m = arr[0]
    for x in arr:
        if x > m:
            m = x
    return m
"""
        res = estimate_time_complexity(code, version="v0")
        assert res.complexity == "O(N)"
        assert res.loop_depth == 1

    def test_03_quadratic_time_on2(self):
        code = """
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
"""
        res = estimate_time_complexity(code, version="v0")
        assert res.complexity == "O(N^2)"
        assert res.loop_depth == 2

    def test_04_cubic_time_on3(self):
        code = """
def triple_loop(n):
    total = 0
    for i in range(n):
        for j in range(n):
            for k in range(n):
                total += 1
    return total
"""
        res = estimate_time_complexity(code, version="v0")
        assert res.complexity == "O(N^3)"
        assert res.loop_depth == 3


class TestComplexityV1ExtendedRules:
    """Tests evaluating Heuristic v1 extended rules."""

    def test_05_halving_loop_ologn(self):
        code = """
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
"""
        res = estimate_time_complexity(code, version="v1")
        assert res.complexity == "O(log N)"
        assert res.has_halving_loop is True

    def test_06_halving_in_linear_onlogn(self):
        code = """
def n_log_n_algorithm(n):
    for i in range(n):
        curr = n
        while curr > 1:
            curr = curr // 2
"""
        res = estimate_time_complexity(code, version="v1")
        assert res.complexity == "O(N log N)"

    def test_07_standalone_sort_onlogn(self):
        code = """
def sort_elements(arr):
    return sorted(arr)
"""
        res = estimate_time_complexity(code, version="v1")
        assert res.complexity == "O(N log N)"
        assert res.has_sort is True

    def test_08_exponential_recursion_o2n(self):
        code = """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
"""
        res = estimate_time_complexity(code, version="v1")
        assert res.complexity == "O(2^N)"
        assert res.recursive_branch_factor >= 2


class TestComplexityExplicitAbstention:
    """Tests evaluating explicit abstention on hidden-cost operations (Section 6.6)."""

    def test_09_abstain_on_slicing_inside_loop(self):
        # Hidden cost: slicing creates a new list copy inside a loop, turning O(N) into O(N^2)
        code = """
def process_sublists(arr):
    for i in range(len(arr)):
        sub = arr[i:]
"""
        res = estimate_time_complexity(code, version="v1", abstain_on_hidden_costs=True)
        assert res.complexity == "ABSTAIN"
        assert res.abstained is True
        assert any("slicing" in c for c in res.hidden_costs)

    def test_10_abstain_on_membership_in_list(self):
        # Hidden cost: `x in lst` is O(N) linear search inside a loop, making it O(N^2)
        code = """
def find_common(a, b):
    res = []
    for x in a:
        if x in b:
            res.append(x)
    return res
"""
        res = estimate_time_complexity(code, version="v1", abstain_on_hidden_costs=True)
        assert res.complexity == "ABSTAIN"
        assert res.abstained is True
        assert any("membership" in c for c in res.hidden_costs)
