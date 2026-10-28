"""
Test Suite: SuperMemo SM-2 Revision Scheduler (17 tests)
Faithfully reproducing the 17 SM-2 tests documented in the IEEE Research Paper (Section 6.1, 6.4).
"""

import pytest
from app.core.sm2 import calculate_sm2_schedule, SM2Schedule


class TestSM2StandardSequence:
    """Standard SM-2 intervals and ease factor progression."""

    def test_01_first_review_perfect_recall(self):
        # Initial review n=0, q=5 -> I=1, n=1, EF: 2.5 + 0.1 = 2.6
        res = calculate_sm2_schedule(quality=5, repetitions=0, interval_days=1, ease_factor=2.5)
        assert res.interval_days == 1
        assert res.repetitions == 1
        assert res.ease_factor == 2.6
        assert res.is_successful is True

    def test_02_second_review_perfect_recall(self):
        # Second review n=1, q=5 -> I=6, n=2, EF: 2.6 + 0.1 = 2.7
        res = calculate_sm2_schedule(quality=5, repetitions=1, interval_days=1, ease_factor=2.6)
        assert res.interval_days == 6
        assert res.repetitions == 2
        assert res.ease_factor == 2.7
        assert res.is_successful is True

    def test_03_third_review_ceil_interval(self):
        # Third review n=2, q=5, I=6, EF=2.5 -> I=ceil(6 * 2.5)=15, n=3
        res = calculate_sm2_schedule(quality=5, repetitions=2, interval_days=6, ease_factor=2.5)
        assert res.interval_days == 15
        assert res.repetitions == 3
        assert res.is_successful is True

    def test_04_fourth_review_progression(self):
        # Fourth review n=3, q=5, I=15, EF=2.6 -> I=ceil(15 * 2.6)=39, n=4
        res = calculate_sm2_schedule(quality=5, repetitions=3, interval_days=15, ease_factor=2.6)
        assert res.interval_days == 39
        assert res.repetitions == 4

    def test_05_quality_4_ef_unchanged(self):
        # q=4 -> delta = 0.1 - (1)(0.08 + 0.02) = 0.1 - 0.10 = 0.0
        res = calculate_sm2_schedule(quality=4, repetitions=2, interval_days=6, ease_factor=2.5)
        assert res.ease_factor == 2.5
        assert res.interval_days == 15

    def test_06_quality_3_ef_decreases(self):
        # q=3 -> delta = 0.1 - (2)(0.08 + 2*0.02) = 0.1 - 2*(0.12) = -0.14
        res = calculate_sm2_schedule(quality=3, repetitions=2, interval_days=6, ease_factor=2.5)
        assert res.ease_factor == 2.36
        assert res.interval_days == 15


class TestSM2FailureHandling:
    """Handling of failed reviews (q < 3) and repetition reset."""

    def test_07_failure_quality_2_resets(self):
        res = calculate_sm2_schedule(quality=2, repetitions=4, interval_days=30, ease_factor=2.4)
        assert res.repetitions == 0
        assert res.interval_days == 1
        assert res.is_successful is False

    def test_08_failure_quality_1_resets(self):
        res = calculate_sm2_schedule(quality=1, repetitions=3, interval_days=15, ease_factor=2.2)
        assert res.repetitions == 0
        assert res.interval_days == 1
        assert res.is_successful is False

    def test_09_failure_quality_0_blackout(self):
        res = calculate_sm2_schedule(quality=0, repetitions=5, interval_days=45, ease_factor=2.5)
        assert res.repetitions == 0
        assert res.interval_days == 1
        assert res.is_successful is False

    def test_10_original_algorithm_preserves_ef_on_failure(self):
        # In original SM-2, EF is not degraded on failure
        res = calculate_sm2_schedule(quality=1, repetitions=3, interval_days=15, ease_factor=2.5, update_ef_on_failure=False)
        assert res.ease_factor == 2.5


class TestSM2EaseFactorFloorAndDraftVariations:
    """Ease factor minimum floor (1.3) and draft flag deviations."""

    def test_11_ease_factor_floor_at_1_3(self):
        # Repeated degradation cannot drop EF below 1.3
        ef = 1.35
        res = calculate_sm2_schedule(quality=3, repetitions=2, interval_days=6, ease_factor=ef)
        # 1.35 - 0.14 = 1.21 -> clamped to 1.3
        assert res.ease_factor == 1.3

    def test_12_draft_flag_failure_floor(self):
        res = calculate_sm2_schedule(quality=0, repetitions=2, interval_days=6, ease_factor=1.3, update_ef_on_failure=True)
        assert res.ease_factor == 1.3

    def test_13_draft_flag_updates_ef_on_failure(self):
        # Draft variant degrades EF on failure
        res = calculate_sm2_schedule(quality=2, repetitions=2, interval_days=6, ease_factor=2.5, update_ef_on_failure=True)
        # q=2 -> delta = 0.1 - (3)(0.08 + 3*0.02) = 0.1 - 3*(0.14) = 0.1 - 0.42 = -0.32
        assert res.ease_factor == 2.18

    def test_14_draft_flag_ef_before_interval(self):
        # If ef_before_interval=True, updated EF (2.6) is used: ceil(6 * 2.6) = 16
        res = calculate_sm2_schedule(quality=5, repetitions=2, interval_days=6, ease_factor=2.5, ef_before_interval=True)
        assert res.interval_days == 16  # vs 15 in original

    def test_15_draft_interval_difference_demonstration(self):
        # Compares interval for original vs draft flag
        orig = calculate_sm2_schedule(quality=5, repetitions=2, interval_days=6, ease_factor=2.5, ef_before_interval=False)
        draft = calculate_sm2_schedule(quality=5, repetitions=2, interval_days=6, ease_factor=2.5, ef_before_interval=True)
        assert orig.interval_days == 15
        assert draft.interval_days == 16


class TestSM2Validation:
    """Validation tests for input ranges."""

    def test_16_invalid_quality_range(self):
        with pytest.raises(ValueError, match="Quality q must be an integer between 0 and 5"):
            calculate_sm2_schedule(quality=6)

    def test_17_invalid_negative_repetitions(self):
        with pytest.raises(ValueError, match="Repetitions n must be a non-negative integer"):
            calculate_sm2_schedule(quality=4, repetitions=-1)
