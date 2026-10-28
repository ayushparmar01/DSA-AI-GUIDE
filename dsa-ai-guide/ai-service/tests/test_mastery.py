"""
Test Suite: Deterministic Mastery Engine (52 tests)
Faithfully reproducing the 52 mastery tests documented in the IEEE Research Paper (Section 6.1, 6.2).
"""

import pytest
from app.core.mastery import calculate_mastery_update, calculate_time_penalty, MasteryResult


class TestMasteryFormulaTable2:
    """Tests corresponding to Table 2 of the IEEE Research Paper."""

    # Optimal solves (R = +1, E = 1, T = 0)
    def test_01_optimal_0_hints(self):
        res = calculate_mastery_update(50.0, 1.0, 0, 1, 0, 100)
        assert res.mastery_change == 11.0
        assert res.new_mastery == 61.0

    def test_02_optimal_3_hints(self):
        res = calculate_mastery_update(50.0, 1.0, 3, 1, 0, 100)
        assert res.mastery_change == 5.0
        assert res.new_mastery == 55.0

    def test_03_optimal_5_hints(self):
        res = calculate_mastery_update(50.0, 1.0, 5, 1, 0, 100)
        assert res.mastery_change == 1.0
        assert res.new_mastery == 51.0

    def test_04_optimal_6_hints_anomaly(self):
        # Documented anomaly: optimal solve with 6 hints causes negative mastery change
        res = calculate_mastery_update(50.0, 1.0, 6, 1, 0, 100)
        assert res.mastery_change == -1.0
        assert res.new_mastery == 49.0

    def test_05_optimal_10_hints_anomaly(self):
        res = calculate_mastery_update(50.0, 1.0, 10, 1, 0, 100)
        assert res.mastery_change == -9.0
        assert res.new_mastery == 41.0

    # Suboptimal solves (R = +0.5, E = 1, T = 0)
    def test_06_suboptimal_0_hints(self):
        res = calculate_mastery_update(50.0, 0.5, 0, 1, 0, 100)
        assert res.mastery_change == 7.0
        assert res.new_mastery == 57.0

    def test_07_suboptimal_3_hints(self):
        res = calculate_mastery_update(50.0, 0.5, 3, 1, 0, 100)
        assert res.mastery_change == 1.0
        assert res.new_mastery == 51.0

    def test_08_suboptimal_5_hints(self):
        res = calculate_mastery_update(50.0, 0.5, 5, 1, 0, 100)
        assert res.mastery_change == -3.0
        assert res.new_mastery == 47.0

    def test_09_suboptimal_6_hints(self):
        res = calculate_mastery_update(50.0, 0.5, 6, 1, 0, 100)
        assert res.mastery_change == -5.0
        assert res.new_mastery == 45.0

    def test_10_suboptimal_10_hints(self):
        res = calculate_mastery_update(50.0, 0.5, 10, 1, 0, 100)
        assert res.mastery_change == -13.0
        assert res.new_mastery == 37.0

    # Failed attempts (R = -1.0, E = 0, T = 0)
    def test_11_failed_0_hints(self):
        res = calculate_mastery_update(50.0, -1.0, 0, 0, 0, 100)
        assert res.mastery_change == -8.0
        assert res.new_mastery == 42.0

    def test_12_failed_3_hints(self):
        res = calculate_mastery_update(50.0, -1.0, 3, 0, 0, 100)
        assert res.mastery_change == -14.0
        assert res.new_mastery == 36.0

    def test_13_failed_5_hints(self):
        res = calculate_mastery_update(50.0, -1.0, 5, 0, 0, 100)
        assert res.mastery_change == -18.0
        assert res.new_mastery == 32.0

    def test_14_failed_6_hints(self):
        res = calculate_mastery_update(50.0, -1.0, 6, 0, 0, 100)
        assert res.mastery_change == -20.0
        assert res.new_mastery == 30.0

    def test_15_failed_10_hints(self):
        res = calculate_mastery_update(50.0, -1.0, 10, 0, 0, 100)
        assert res.mastery_change == -28.0
        assert res.new_mastery == 22.0


class TestMasteryClampingAndBoundaries:
    """Clamping at 0 and 100."""

    def test_16_clamp_upper_near_max(self):
        res = calculate_mastery_update(95.0, 1.0, 0, 1)
        assert res.mastery_change == 11.0
        assert res.new_mastery == 100.0

    def test_17_clamp_upper_at_100(self):
        res = calculate_mastery_update(100.0, 1.0, 0, 1)
        assert res.new_mastery == 100.0

    def test_18_clamp_lower_near_min(self):
        res = calculate_mastery_update(5.0, -1.0, 0, 0)
        assert res.mastery_change == -8.0
        assert res.new_mastery == 0.0

    def test_19_clamp_lower_at_0(self):
        res = calculate_mastery_update(0.0, -1.0, 0, 0)
        assert res.new_mastery == 0.0

    def test_20_exact_mid_increase(self):
        res = calculate_mastery_update(50.0, 1.0, 0, 1)
        assert res.new_mastery == 61.0

    def test_21_exact_mid_decrease(self):
        res = calculate_mastery_update(50.0, -1.0, 0, 0)
        assert res.new_mastery == 42.0


class TestMasteryEfficiencyAndGating:
    """Tests for efficiency bonus and gating anomalies."""

    def test_22_optimal_inefficient_e0(self):
        res = calculate_mastery_update(50.0, 1.0, 0, 0)
        assert res.mastery_change == 8.0
        assert res.new_mastery == 58.0

    def test_23_suboptimal_inefficient_e0(self):
        res = calculate_mastery_update(50.0, 0.5, 0, 0)
        assert res.mastery_change == 4.0
        assert res.new_mastery == 54.0

    def test_24_failed_ungated_e1_anomaly(self):
        # Documented finding: ungated E=1 on failure gives -5 instead of -8
        res = calculate_mastery_update(50.0, -1.0, 0, 1, gated_efficiency=False)
        assert res.mastery_change == -5.0
        assert res.new_mastery == 45.0
        assert res.gated_applied is False

    def test_25_failed_gated_e1(self):
        # Gating fixes anomaly, restoring -8
        res = calculate_mastery_update(50.0, -1.0, 0, 1, gated_efficiency=True)
        assert res.mastery_change == -8.0
        assert res.new_mastery == 42.0
        assert res.gated_applied is True

    def test_26_gated_on_optimal_unaffected(self):
        res = calculate_mastery_update(50.0, 1.0, 0, 1, gated_efficiency=True)
        assert res.mastery_change == 11.0
        assert res.gated_applied is False

    def test_27_gated_on_suboptimal_unaffected(self):
        res = calculate_mastery_update(50.0, 0.5, 0, 1, gated_efficiency=True)
        assert res.mastery_change == 7.0
        assert res.gated_applied is False

    def test_28_boolean_efficiency_true(self):
        res = calculate_mastery_update(50.0, 1.0, 0, True)
        assert res.e_component == 3.0

    def test_29_boolean_efficiency_false(self):
        res = calculate_mastery_update(50.0, 1.0, 0, False)
        assert res.e_component == 0.0


class TestMasteryTimePenalty:
    """Tests for normalized time penalty with c = 3."""

    def test_30_time_well_below_expected(self):
        pen = calculate_time_penalty(30, 100, c=3)
        assert pen == 0.0

    def test_31_time_exactly_expected(self):
        pen = calculate_time_penalty(100, 100, c=3)
        assert pen == 0.0

    def test_32_time_at_midpoint_2x(self):
        pen = calculate_time_penalty(200, 100, c=3)
        assert pen == 0.5

    def test_33_time_at_ceiling_3x(self):
        pen = calculate_time_penalty(300, 100, c=3)
        assert pen == 1.0

    def test_34_time_exceeding_ceiling(self):
        pen = calculate_time_penalty(600, 100, c=3)
        assert pen == 1.0

    def test_35_time_quarter_point(self):
        pen = calculate_time_penalty(150, 100, c=3)
        assert pen == 0.25

    def test_36_full_formula_max_time_penalty(self):
        res = calculate_mastery_update(50.0, 1.0, 0, 1, actual_time=300, expected_time=100)
        # 8(1) - 0 + 3(1) - 1(1.0) = 10
        assert res.mastery_change == 10.0
        assert res.new_mastery == 60.0

    def test_37_full_formula_half_time_penalty(self):
        res = calculate_mastery_update(50.0, 1.0, 0, 1, actual_time=200, expected_time=100)
        # 8(1) - 0 + 3(1) - 1(0.5) = 10.5
        assert res.mastery_change == 10.5
        assert res.new_mastery == 60.5


class TestMasteryTrajectoriesFig2:
    """Tests reproducing the scripted trajectories shown in Figure 2 of the IEEE Paper."""

    def test_38_ten_optimal_no_hints_from_0(self):
        m = 0.0
        for _ in range(10):
            m = calculate_mastery_update(m, 1.0, 0, 1, 0, 100).new_mastery
        assert m == 100.0

    def test_39_ten_optimal_3_hints_from_0(self):
        m = 0.0
        for _ in range(10):
            m = calculate_mastery_update(m, 1.0, 3, 1, 0, 100).new_mastery
        assert m == 50.0

    def test_40_ten_optimal_6_hints_from_50(self):
        m = 50.0
        for _ in range(10):
            m = calculate_mastery_update(m, 1.0, 6, 1, 0, 100).new_mastery
        assert m == 40.0

    def test_41_alternating_optimal_failed_from_50(self):
        m = 50.0
        for _ in range(5):
            m = calculate_mastery_update(m, 1.0, 0, 1, 0, 100).new_mastery
            m = calculate_mastery_update(m, -1.0, 0, 0, 0, 100).new_mastery
        assert m == 65.0

    def test_42_ten_failed_0_hints_from_50(self):
        m = 50.0
        for _ in range(10):
            m = calculate_mastery_update(m, -1.0, 0, 0, 0, 100).new_mastery
        assert m == 0.0

    def test_43_ten_failed_e1_ungated_from_50(self):
        m = 50.0
        for _ in range(10):
            m = calculate_mastery_update(m, -1.0, 0, 1, 0, 100, gated_efficiency=False).new_mastery
        assert m == 0.0

    def test_44_ten_failed_e1_gated_from_50(self):
        m = 50.0
        for _ in range(10):
            m = calculate_mastery_update(m, -1.0, 0, 1, 0, 100, gated_efficiency=True).new_mastery
        assert m == 0.0


class TestMasteryValidationExceptions:
    """Tests for edge cases and parameter validation."""

    def test_45_invalid_negative_initial_mastery(self):
        with pytest.raises(ValueError, match="current_mastery must be in"):
            calculate_mastery_update(-0.1, 1.0, 0, 1)

    def test_46_invalid_excessive_initial_mastery(self):
        with pytest.raises(ValueError, match="current_mastery must be in"):
            calculate_mastery_update(100.1, 1.0, 0, 1)

    def test_47_invalid_result_value(self):
        with pytest.raises(ValueError, match="result R must be one of"):
            calculate_mastery_update(50.0, 0.75, 0, 1)

    def test_48_invalid_negative_hints(self):
        with pytest.raises(ValueError, match="hints_used H must be a non-negative integer"):
            calculate_mastery_update(50.0, 1.0, -1, 1)

    def test_49_invalid_float_hints(self):
        with pytest.raises(ValueError, match="hints_used H must be a non-negative integer"):
            calculate_mastery_update(50.0, 1.0, 2.5, 1)

    def test_50_invalid_negative_time(self):
        with pytest.raises(ValueError, match="actual_time must be non-negative"):
            calculate_time_penalty(-5, 100)

    def test_51_invalid_zero_expected_time(self):
        with pytest.raises(ValueError, match="expected_time must be strictly positive"):
            calculate_time_penalty(100, 0)

    def test_52_invalid_c_multiplier(self):
        with pytest.raises(ValueError, match="c parameter must be strictly greater than 1"):
            calculate_time_penalty(100, 100, c=1.0)
