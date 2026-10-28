"""
New Test Suite: Extended Boundary Conditions and Documented Anomalies
Additional verification suite expanding beyond the original 147 tests.
"""

import pytest
from app.core.mastery import calculate_mastery_update
from app.core.roadmap import generate_roadmap, validate_prerequisite_dag, verify_prerequisites
from app.core.sm2 import calculate_sm2_schedule
from app.core.leakage import check_solution_leakage
from app.core.complexity import estimate_time_complexity


class TestAdditionalMasteryBoundaries:
    """Extra boundary conditions on mastery calculation."""

    def test_b01_exact_boundary_clamping_at_0(self):
        res = calculate_mastery_update(0.0, -1.0, 5, 0)
        assert res.new_mastery == 0.0

    def test_b02_exact_boundary_clamping_at_100(self):
        res = calculate_mastery_update(100.0, 1.0, 0, 1)
        assert res.new_mastery == 100.0

    def test_b03_floating_point_mastery_precision(self):
        res = calculate_mastery_update(33.3333, 0.5, 1, 1, 150, 100)
        assert 0.0 <= res.new_mastery <= 100.0


class TestAdditionalRoadmapBoundaries:
    """Extra boundary conditions on DAGs and roadmaps."""

    def test_b04_single_topic_dag(self):
        roadmap = generate_roadmap(graph={"SingleTopic": []})
        assert roadmap == ["SingleTopic"]
        assert verify_prerequisites(roadmap, {"SingleTopic": []})[0] is True

    def test_b05_two_parallel_roots_mastery_ordering(self):
        graph = {"RootA": [], "RootB": []}
        roadmap = generate_roadmap(graph, mastery_scores={"RootA": 75, "RootB": 25})
        assert roadmap == ["RootB", "RootA"]

    def test_b06_two_parallel_roots_alphabetical_tie_break(self):
        graph = {"Beta": [], "Alpha": []}
        roadmap = generate_roadmap(graph, mastery_scores={"Beta": 50, "Alpha": 50})
        assert roadmap == ["Alpha", "Beta"]


class TestAdditionalSM2Boundaries:
    """Extra boundary conditions on SM-2 spaced repetition."""

    def test_b07_long_repetition_chain(self):
        ef = 2.5
        interval = 1
        for rep in range(8):
            res = calculate_sm2_schedule(quality=5, repetitions=rep, interval_days=interval, ease_factor=ef)
            interval = res.interval_days
            ef = res.ease_factor
        assert interval > 100
        assert ef > 2.5

    def test_b08_consecutive_lapses_floor_stability(self):
        ef = 2.0
        for _ in range(10):
            res = calculate_sm2_schedule(quality=0, repetitions=1, interval_days=6, ease_factor=ef, update_ef_on_failure=True)
            ef = res.ease_factor
        assert ef == 1.3  # Strictly floored


class TestAdditionalLeakageBoundaries:
    """Extra boundary conditions on code leakage guard."""

    def test_b09_empty_candidate_hint(self):
        ref = "def f(): return 1"
        res = check_solution_leakage("", ref, threshold=0.80)
        assert res.is_leak is False
        assert res.is_short_input is True

    def test_b10_prose_only_hint_under_threshold(self):
        ref = "def solve(nums): return sorted(nums)"
        cand = "Consider using a sorting approach to bring duplicates together."
        res = check_solution_leakage(cand, ref, threshold=0.80)
        assert res.is_leak is False

    def test_b11_multiline_docstring_stripping(self):
        ref = """
def solve(numbers, target):
    \"\"\"This is a multi-line docstring
    explaining the problem.\"\"\"
    result = []
    for x in numbers:
        if x == target:
            result.append(x)
    return result
"""
        cand = """
def solution(arr, k):
    out = []
    for val in arr:
        if val == k:
            out.append(val)
    return out
"""
        res = check_solution_leakage(cand, ref, threshold=0.80)
        assert res.is_leak is True
        assert res.is_short_input is False


class TestAdditionalComplexityBoundaries:
    """Extra boundary conditions on complexity estimation."""

    def test_b12_empty_code_abstains(self):
        res = estimate_time_complexity("")
        assert res.complexity == "O(1)"

    def test_b13_while_loop_multiplication_log(self):
        code = """
def power_of_two(n):
    i = 1
    while i < n:
        i = i << 1
    return i
"""
        res = estimate_time_complexity(code, version="v1")
        assert res.has_halving_loop is True
        assert res.complexity == "O(log N)"

    def test_b14_sort_and_linear_loop(self):
        # sorted() + a loop -> abstain because outer/inner interaction is complex
        code = """
def mixed(arr):
    for x in arr:
        sorted(arr)
"""
        res = estimate_time_complexity(code, version="v1")
        assert res.complexity == "ABSTAIN"
        assert res.abstained is True

    def test_b15_recursion_multiple_base_cases(self):
        code = """
def fib(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fib(n-1) + fib(n-2)
"""
        res = estimate_time_complexity(code, version="v1")
        assert res.complexity == "O(2^N)"
