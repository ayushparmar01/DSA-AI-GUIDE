"""
DSA AI Guide - Deterministic Core Package
Implements the 5 core deterministic Python components specified in the IEEE Research Paper
and Progress Report 03:
1. Deterministic Mastery Scoring (mastery.py)
2. Prerequisite DAG Roadmap via Weighted Kahn's Algorithm (roadmap.py)
3. SuperMemo SM-2 Revision Scheduler (sm2.py)
4. Syntax-Based Solution Leakage Guard (leakage.py)
5. AST-Based Time-Complexity Heuristic (complexity.py)
"""

from .mastery import calculate_mastery_update, MasteryResult
from .roadmap import generate_roadmap, validate_prerequisite_dag, verify_prerequisites, DEFAULT_TOPIC_GRAPH
from .sm2 import calculate_sm2_schedule, SM2Schedule
from .leakage import check_solution_leakage, LeakageResult
from .complexity import estimate_time_complexity, ComplexityResult

__all__ = [
    "calculate_mastery_update",
    "MasteryResult",
    "generate_roadmap",
    "validate_prerequisite_dag",
    "verify_prerequisites",
    "DEFAULT_TOPIC_GRAPH",
    "calculate_sm2_schedule",
    "SM2Schedule",
    "check_solution_leakage",
    "LeakageResult",
    "estimate_time_complexity",
    "ComplexityResult",
]
