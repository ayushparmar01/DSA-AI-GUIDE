"""
FastAPI Route Handlers for AI Microservice Endpoints
"""

import math
import os
import joblib
from fastapi import APIRouter, HTTPException, status
from app.config import settings
from app.core.mastery import calculate_mastery_update
from app.core.roadmap import generate_roadmap, validate_prerequisite_dag, verify_prerequisites, DEFAULT_TOPIC_GRAPH
from app.core.sm2 import calculate_sm2_schedule
from app.core.leakage import check_solution_leakage
from app.core.complexity import estimate_time_complexity

from .schemas import (
    MasteryCalculateRequest, MasteryCalculateResponse,
    RoadmapGenerateRequest, RoadmapGenerateResponse,
    DAGValidateRequest, DAGValidateResponse,
    SM2ScheduleRequest, SM2ScheduleResponse,
    LeakageCheckRequest, LeakageCheckResponse,
    ComplexityEstimateRequest, ComplexityEstimateResponse,
    PredictSolveRequest, PredictSolveResponse,
)

router = APIRouter()


# --- 1. Mastery Calculation Endpoint ---
@router.post("/mastery/calculate", response_model=MasteryCalculateResponse, summary="Compute deterministic topic mastery update")
def calculate_mastery(req: MasteryCalculateRequest):
    try:
        res = calculate_mastery_update(
            current_mastery=req.current_mastery,
            result=req.result,
            hints_used=req.hints_used,
            is_efficient=req.is_efficient,
            actual_time=req.actual_time,
            expected_time=req.expected_time,
            gated_efficiency=req.gated_efficiency,
        )
        return MasteryCalculateResponse(
            new_mastery=res.new_mastery,
            mastery_change=res.mastery_change,
            r_component=res.r_component,
            h_component=res.h_component,
            e_component=res.e_component,
            t_penalty=res.t_penalty,
            gated_applied=res.gated_applied,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# --- 2. Roadmap Generation & Validation Endpoints ---
@router.post("/roadmap/generate", response_model=RoadmapGenerateResponse, summary="Generate personalized roadmap using weighted Kahn's sort")
def get_roadmap(req: RoadmapGenerateRequest):
    try:
        graph = req.custom_graph or DEFAULT_TOPIC_GRAPH
        roadmap = generate_roadmap(graph=graph, mastery_scores=req.mastery_scores)
        valid, _ = verify_prerequisites(roadmap, graph=graph)
        return RoadmapGenerateResponse(
            roadmap=roadmap,
            total_topics=len(roadmap),
            prerequisites_valid=valid,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/roadmap/validate", response_model=DAGValidateResponse, summary="Validate a prerequisite DAG structure")
def validate_dag(req: DAGValidateRequest):
    try:
        validate_prerequisite_dag(req.graph)
        return DAGValidateResponse(is_valid=True, message="Prerequisite graph is a valid DAG", errors=[])
    except ValueError as e:
        return DAGValidateResponse(is_valid=False, message=str(e), errors=[str(e)])


# --- 3. SM-2 Spaced Repetition Endpoint ---
@router.post("/sm2/next-schedule", response_model=SM2ScheduleResponse, summary="Calculate next revision schedule with SM-2")
def get_sm2_schedule(req: SM2ScheduleRequest):
    try:
        res = calculate_sm2_schedule(
            quality=req.quality,
            repetitions=req.repetitions,
            interval_days=req.interval_days,
            ease_factor=req.ease_factor,
            update_ef_on_failure=req.update_ef_on_failure,
            ef_before_interval=req.ef_before_interval,
        )
        return SM2ScheduleResponse(
            quality=res.quality,
            repetitions=res.repetitions,
            interval_days=res.interval_days,
            ease_factor=res.ease_factor,
            next_review_days=res.next_review_days,
            is_successful=res.is_successful,
            ef_delta=res.ef_delta,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# --- 4. Leakage Guard Endpoint ---
@router.post("/leakage/check", response_model=LeakageCheckResponse, summary="Check candidate hint for solution leakage")
def check_leakage(req: LeakageCheckRequest):
    res = check_solution_leakage(
        candidate_hint=req.candidate_hint,
        reference_solution=req.reference_solution,
        threshold=req.threshold,
        min_tokens=req.min_tokens,
    )
    return LeakageCheckResponse(
        is_leak=res.is_leak,
        combined_similarity=res.combined_similarity,
        token_similarity=res.token_similarity,
        ast_similarity=res.ast_similarity,
        raw_similarity=res.raw_similarity,
        token_count=res.token_count,
        threshold=res.threshold,
        used_fallback=res.used_fallback,
        is_short_input=res.is_short_input,
        explanation=res.explanation,
    )


# --- 5. Complexity Estimation Endpoint ---
@router.post("/complexity/estimate", response_model=ComplexityEstimateResponse, summary="Estimate code time complexity from AST")
def estimate_complexity(req: ComplexityEstimateRequest):
    res = estimate_time_complexity(
        code=req.code,
        version=req.version,
        abstain_on_hidden_costs=req.abstain_on_hidden_costs,
    )
    return ComplexityEstimateResponse(
        complexity=res.complexity,
        version=res.version,
        loop_depth=res.loop_depth,
        has_halving_loop=res.has_halving_loop,
        has_sort=res.has_sort,
        is_recursive=res.is_recursive,
        recursive_branch_factor=res.recursive_branch_factor,
        hidden_costs=list(res.hidden_costs),
        abstained=res.abstained,
        confidence=res.confidence,
        explanation=res.explanation,
    )


# --- 6. Predictive Solve Probability Endpoint ---
@router.post("/predict/solve-probability", response_model=PredictSolveResponse, summary="Predict P(Solve Success) with ML or rule fallback")
def predict_solve_probability(req: PredictSolveRequest):
    model_path = os.path.join(settings.ml_models_dir, "best_solve_predictor.joblib")
    scaler_path = os.path.join(settings.ml_models_dir, "feature_scaler.joblib")

    if os.path.exists(model_path) and os.path.exists(scaler_path):
        try:
            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)
            features = [[
                req.user_overall_score,
                req.topic_mastery,
                req.problem_difficulty,
                req.past_attempts,
                req.avg_solve_time_sec,
                req.hint_count,
                req.pattern_familiarity,
                req.days_since_last_practice,
            ]]
            scaled_feats = scaler.transform(features)
            prob = float(model.predict_proba(scaled_feats)[0][1])
            return PredictSolveResponse(
                probability=round(prob, 4),
                will_solve=prob >= 0.5,
                model_used=type(model).__name__,
                confidence=round(abs(prob - 0.5) * 2, 4),
            )
        except Exception:
            pass  # Fall back to rule-based equation

    # Rule-based fallback equation specified in Progress Report 02 Section 2.5
    z = (
        0.045 * req.user_overall_score +
        0.050 * req.topic_mastery +
        1.200 * req.pattern_familiarity -
        1.600 * req.problem_difficulty -
        0.0008 * req.avg_solve_time_sec -
        0.350 * req.hint_count -
        0.060 * req.days_since_last_practice -
        1.200
    )
    prob = 1.0 / (1.0 + math.exp(-z))
    return PredictSolveResponse(
        probability=round(prob, 4),
        will_solve=prob >= 0.5,
        model_used="Rule-Based Fallback (Logistic Prior)",
        confidence=round(abs(prob - 0.5) * 2, 4),
    )
