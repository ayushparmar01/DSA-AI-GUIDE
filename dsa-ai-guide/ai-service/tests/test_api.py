"""
New Test Suite: AI Microservice Route Handlers and Controller Logic
Directly verifies API request parsing, Pydantic schema validation, controller logic, and responses.
"""

import pytest
from pydantic import ValidationError
from fastapi import HTTPException
from app.main import health_check
from app.api.routes import (
    calculate_mastery,
    get_roadmap,
    validate_dag,
    get_sm2_schedule,
    check_leakage,
    estimate_complexity,
    predict_solve_probability,
)
from app.api.schemas import (
    MasteryCalculateRequest,
    RoadmapGenerateRequest,
    DAGValidateRequest,
    SM2ScheduleRequest,
    LeakageCheckRequest,
    ComplexityEstimateRequest,
    PredictSolveRequest,
)


def test_api_01_health_check():
    res = health_check()
    assert res["status"] == "healthy"
    assert "version" in res


def test_api_02_mastery_endpoint_optimal():
    req = MasteryCalculateRequest(
        current_mastery=50.0,
        result=1.0,
        hints_used=0,
        is_efficient=1,
        actual_time=60,
        expected_time=100,
    )
    res = calculate_mastery(req)
    assert res.new_mastery == 61.0
    assert res.mastery_change == 11.0


def test_api_03_mastery_endpoint_validation_error():
    with pytest.raises(ValidationError):
        MasteryCalculateRequest(
            current_mastery=150.0,  # Invalid > 100
            result=1.0,
            hints_used=0,
            is_efficient=1,
        )


def test_api_04_roadmap_generate():
    req = RoadmapGenerateRequest(
        mastery_scores={"Arrays": 80.0, "Recursion": 20.0}
    )
    res = get_roadmap(req)
    assert res.total_topics == 16
    assert res.prerequisites_valid is True
    # Recursion (20) before Arrays (80)
    assert res.roadmap.index("Recursion") < res.roadmap.index("Arrays")


def test_api_05_roadmap_validate_cycle():
    req = DAGValidateRequest(
        graph={"A": ["B"], "B": ["A"]}
    )
    res = validate_dag(req)
    assert res.is_valid is False
    assert len(res.errors) > 0


def test_api_06_sm2_schedule():
    req = SM2ScheduleRequest(
        quality=5,
        repetitions=1,
        interval_days=1,
        ease_factor=2.5,
    )
    res = get_sm2_schedule(req)
    assert res.interval_days == 6
    assert res.repetitions == 2
    assert res.ease_factor == 2.6


def test_api_07_leakage_endpoint():
    req = LeakageCheckRequest(
        candidate_hint="def f(nums, target): return []",
        reference_solution="def two_sum(arr, k): return []",
        threshold=0.80,
    )
    res = check_leakage(req)
    assert res.is_leak is False  # Under 12 tokens exception
    assert res.is_short_input is True


def test_api_08_complexity_endpoint():
    req = ComplexityEstimateRequest(
        code="def f(arr):\n  for x in arr: pass",
        version="v1",
    )
    res = estimate_complexity(req)
    assert res.complexity == "O(N)"
    assert res.abstained is False


def test_api_09_predict_solve_rule_fallback():
    req = PredictSolveRequest(
        user_overall_score=75.0,
        topic_mastery=70.0,
        problem_difficulty=1,
        past_attempts=1,
        avg_solve_time_sec=450.0,
        hint_count=0,
        pattern_familiarity=0.8,
        days_since_last_practice=2.0,
    )
    res = predict_solve_probability(req)
    assert 0.0 <= res.probability <= 1.0
    assert "Fallback" in res.model_used
