"""
Test Suite: End-to-End Component Integration (3 tests)
Faithfully reproducing the 3 integration tests documented in the IEEE Research Paper (Section 6.1).
"""

import pytest
from app.core.mastery import calculate_mastery_update
from app.core.roadmap import generate_roadmap, verify_prerequisites, DEFAULT_TOPIC_GRAPH
from app.core.sm2 import calculate_sm2_schedule
from app.core.leakage import check_solution_leakage


class TestSystemIntegration:
    """End-to-end integration tests chaining the deterministic components."""

    def test_01_attempt_to_mastery_to_roadmap_flow(self):
        """
        Scenario: Student practices Arrays and Recursion.
        1. Initially Arrays M=20, Recursion M=50. Roadmap puts Arrays before Recursion.
        2. Student completes multiple optimal solves on Arrays (+11 each).
        3. Arrays mastery reaches 64. Recursion remains 50.
        4. Regenerated roadmap now prioritizes Recursion over Arrays due to lower mastery.
        5. Verify no prerequisite violations occur in either state.
        """
        mastery = {"Arrays": 20.0, "Recursion": 50.0}
        rm1 = generate_roadmap(mastery_scores=mastery)
        assert rm1.index("Arrays") < rm1.index("Recursion")
        valid1, _ = verify_prerequisites(rm1)
        assert valid1 is True

        # Simulate 4 optimal solves on Arrays (no hints, efficient, on-time)
        cur_m = mastery["Arrays"]
        for _ in range(4):
            cur_m = calculate_mastery_update(cur_m, 1.0, 0, 1, 60, 120).new_mastery
        mastery["Arrays"] = cur_m
        assert mastery["Arrays"] == 64.0

        # Now Recursion (50) has lower mastery than Arrays (64)
        rm2 = generate_roadmap(mastery_scores=mastery)
        assert rm2.index("Recursion") < rm2.index("Arrays")
        valid2, _ = verify_prerequisites(rm2)
        assert valid2 is True

    def test_02_attempt_evaluation_to_sm2_schedule_flow(self):
        """
        Scenario: Attempt feedback drives mastery update and SM-2 revision schedule.
        1. Student attempts problem with 1 minor hint (suboptimal, quality=4).
        2. Mastery updates deterministically.
        3. SM-2 schedule advances interval to 1 day (first review) with unchanged EF=2.5.
        4. Subsequent perfect solve (quality=5) advances interval to 6 days with EF=2.6.
        """
        # Step 1: Initial attempt with 1 hint
        m_res = calculate_mastery_update(
            current_mastery=40.0,
            result=0.5,
            hints_used=1,
            is_efficient=1,
            actual_time=150,
            expected_time=120,
        )
        assert m_res.new_mastery > 40.0

        # Step 2: Quality rating 4 from attempt telemetry
        sm2_step1 = calculate_sm2_schedule(quality=4, repetitions=0, interval_days=1, ease_factor=2.5)
        assert sm2_step1.interval_days == 1
        assert sm2_step1.repetitions == 1
        assert sm2_step1.ease_factor == 2.5

        # Step 3: Second review optimal
        sm2_step2 = calculate_sm2_schedule(
            quality=5,
            repetitions=sm2_step1.repetitions,
            interval_days=sm2_step1.interval_days,
            ease_factor=sm2_step1.ease_factor,
        )
        assert sm2_step2.interval_days == 6
        assert sm2_step2.repetitions == 2
        assert sm2_step2.ease_factor == 2.6

    def test_03_hint_safety_gating_loop(self):
        """
        Scenario: Hint generation pipeline validates safety before delivering hint.
        1. Reference solution is known.
        2. Candidate 1 contains direct code copy -> blocked by Leakage Guard.
        3. Candidate 2 contains conceptual Socratic question -> allowed through.
        """
        ref_code = """
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
"""
        # Leaking candidate
        leak_hint = """
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
"""
        leak_check = check_solution_leakage(leak_hint, ref_code, threshold=0.80)
        assert leak_check.is_leak is True

        # Safe conceptual hint
        safe_hint = """
# Think about two runners on a circular track.
# If one runs twice as fast as the other, what will eventually happen?
"""
        safe_check = check_solution_leakage(safe_hint, ref_code, threshold=0.80)
        assert safe_check.is_leak is False
