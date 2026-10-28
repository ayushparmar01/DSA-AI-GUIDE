"""
Pydantic Request and Response Schemas for AI Microservice
"""

from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field


# --- Mastery Schemas ---
class MasteryCalculateRequest(BaseModel):
    current_mastery: float = Field(..., ge=0.0, le=100.0, description="Current mastery score M in [0, 100]")
    result: float = Field(..., description="Attempt result R: 1.0 (optimal), 0.5 (suboptimal), -1.0 (failed)")
    hints_used: int = Field(0, ge=0, description="Number of hints used H >= 0")
    is_efficient: Union[int, bool] = Field(1, description="Efficiency credit E: 1 or 0 (or boolean)")
    actual_time: float = Field(0.0, ge=0.0, description="Actual time taken in seconds")
    expected_time: float = Field(1.0, gt=0.0, description="Expected time in seconds")
    gated_efficiency: bool = Field(False, description="If True, E=0 when R=-1 (prevents rewarding failed attempts)")


class MasteryCalculateResponse(BaseModel):
    new_mastery: float
    mastery_change: float
    r_component: float
    h_component: float
    e_component: float
    t_penalty: float
    gated_applied: bool


# --- Roadmap Schemas ---
class RoadmapGenerateRequest(BaseModel):
    mastery_scores: Optional[Dict[str, float]] = Field(default_factory=dict, description="Topic mastery scores")
    custom_graph: Optional[Dict[str, List[str]]] = Field(None, description="Optional custom prerequisite DAG")


class RoadmapGenerateResponse(BaseModel):
    roadmap: List[str]
    total_topics: int
    prerequisites_valid: bool


class DAGValidateRequest(BaseModel):
    graph: Dict[str, List[str]] = Field(..., description="Prerequisite adjacency list")


class DAGValidateResponse(BaseModel):
    is_valid: bool
    message: str
    errors: List[str] = Field(default_factory=list)


# --- SM-2 Schemas ---
class SM2ScheduleRequest(BaseModel):
    quality: int = Field(..., ge=0, le=5, description="Recall performance rating q in [0, 5]")
    repetitions: int = Field(0, ge=0, description="Consecutive successful repetitions n >= 0")
    interval_days: int = Field(1, ge=1, description="Previous interval I >= 1 in days")
    ease_factor: float = Field(2.5, ge=1.3, description="Current ease factor EF >= 1.3")
    update_ef_on_failure: bool = Field(False, description="Draft flag: update EF on failed recall")
    ef_before_interval: bool = Field(False, description="Draft flag: calculate interval using updated EF")


class SM2ScheduleResponse(BaseModel):
    quality: int
    repetitions: int
    interval_days: int
    ease_factor: float
    next_review_days: int
    is_successful: bool
    ef_delta: float


# --- Leakage Schemas ---
class LeakageCheckRequest(BaseModel):
    candidate_hint: str = Field(..., description="Candidate hint or code snippet to verify")
    reference_solution: str = Field(..., description="Reference accepted implementation")
    threshold: float = Field(0.80, ge=0.0, le=1.0, description="Similarity cutoff threshold tau")
    min_tokens: int = Field(12, ge=1, description="Minimum tokens required before flagging")


class LeakageCheckResponse(BaseModel):
    is_leak: bool
    combined_similarity: float
    token_similarity: float
    ast_similarity: float
    raw_similarity: float
    token_count: int
    threshold: float
    used_fallback: bool
    is_short_input: bool
    explanation: str


# --- Complexity Schemas ---
class ComplexityEstimateRequest(BaseModel):
    code: str = Field(..., description="Python source code snippet")
    version: str = Field("v1", description="Heuristic version: 'v0' (loop nesting) or 'v1' (extended)")
    abstain_on_hidden_costs: bool = Field(True, description="Abstain if slicing, membership in, or sum detected")


class ComplexityEstimateResponse(BaseModel):
    complexity: str
    version: str
    loop_depth: int
    has_halving_loop: bool
    has_sort: bool
    is_recursive: bool
    recursive_branch_factor: int
    hidden_costs: List[str]
    abstained: bool
    confidence: float
    explanation: str


# --- Predictive ML Solve Probability Schemas ---
class PredictSolveRequest(BaseModel):
    user_overall_score: float = Field(..., ge=0, le=100)
    topic_mastery: float = Field(..., ge=0, le=100)
    problem_difficulty: int = Field(..., ge=1, le=3, description="1=Easy, 2=Medium, 3=Hard")
    past_attempts: int = Field(0, ge=0)
    avg_solve_time_sec: float = Field(..., ge=0)
    hint_count: int = Field(0, ge=0)
    pattern_familiarity: float = Field(0.5, ge=0.0, le=1.0)
    days_since_last_practice: float = Field(0.0, ge=0.0)


class PredictSolveResponse(BaseModel):
    probability: float
    will_solve: bool
    model_used: str
    confidence: float
