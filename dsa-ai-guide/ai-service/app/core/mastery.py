"""
Deterministic Mastery Engine
Specified in IEEE Research Paper (Section 4.1) & Progress Report 03 (Section 11, M6).

Formula:
    M' = clamp(M + w1*R - w2*H + w3*E - w4*T, 0, 100)
    where:
        (w1, w2, w3, w4) = (8, 2, 3, 1)
        M in [0, 100]: Current mastery score
        R in {+1, +0.5, -1}: Result (optimal: +1, suboptimal: +0.5, failed: -1)
        H >= 0: Hint count
        E in {0, 1}: Efficient solution flag
        T in [0, 1]: Time penalty T = clamp((t / t_exp - 1) / (c - 1), 0, 1), with c = 3

Documented Pedagogical Anomalies:
    1. Optimal Solve with >= 6 Hints:
       A learner who produces an optimal solve (R=1, E=1, T=0) with 6 hints suffers a net
       mastery change of +8 - 2(6) + 3 = -1. At 10 hints, change is -9.
    2. Ungated Efficiency Bonus on Failed Attempt:
       If E=1 is credited on a failed attempt (R=-1, T=0, H=0), the change is -8 + 3 = -5
       instead of -8. Gating option `gated_efficiency=True` disables E when R=-1,
       but `gated_efficiency=False` remains the default to faithfully match published results.
"""

from dataclasses import dataclass
from typing import Union


@dataclass(frozen=True)
class MasteryResult:
    new_mastery: float
    mastery_change: float
    r_component: float
    h_component: float
    e_component: float
    t_penalty: float
    gated_applied: bool


def calculate_time_penalty(actual_time: float, expected_time: float, c: float = 3.0) -> float:
    """
    Computes normalized time penalty T in [0, 1].
    T = clamp((t / t_exp - 1) / (c - 1), 0, 1) with c = 3.
    """
    if expected_time <= 0:
        raise ValueError(f"expected_time must be strictly positive (>0), got {expected_time}")
    if actual_time < 0:
        raise ValueError(f"actual_time must be non-negative (>=0), got {actual_time}")
    if c <= 1.0:
        raise ValueError(f"c parameter must be strictly greater than 1, got {c}")

    ratio = actual_time / expected_time
    raw_penalty = (ratio - 1.0) / (c - 1.0)
    return max(0.0, min(1.0, raw_penalty))


def calculate_mastery_update(
    current_mastery: float,
    result: float,
    hints_used: int,
    is_efficient: Union[int, bool],
    actual_time: float = 0.0,
    expected_time: float = 1.0,
    gated_efficiency: bool = False,
    w1: float = 8.0,
    w2: float = 2.0,
    w3: float = 3.0,
    w4: float = 1.0,
    c: float = 3.0,
) -> MasteryResult:
    """
    Computes deterministic topic mastery update following equation (1) of the IEEE Paper.
    
    Args:
        current_mastery: M in [0, 100]
        result: R in {+1, +0.5, -1}
        hints_used: H >= 0 integer
        is_efficient: E in {0, 1}
        actual_time: t in seconds (>=0)
        expected_time: t_exp in seconds (>0)
        gated_efficiency: If True, E is set to 0 when R == -1
        w1, w2, w3, w4: Heuristic weights (default 8, 2, 3, 1)
        c: Time penalty threshold multiplier (default 3.0)
    """
    # 1. Validation
    if not (0.0 <= current_mastery <= 100.0):
        raise ValueError(f"current_mastery must be in [0, 100], got {current_mastery}")

    valid_results = {1.0: 1.0, 0.5: 0.5, -1.0: -1.0}
    try:
        r_val = float(result)
    except (TypeError, ValueError):
        raise ValueError(f"result R must be one of {{+1, +0.5, -1}}, got {result}")

    if r_val not in valid_results:
        raise ValueError(f"result R must be one of {{+1, +0.5, -1}}, got {result}")

    if not isinstance(hints_used, int) or hints_used < 0:
        raise ValueError(f"hints_used H must be a non-negative integer (>= 0), got {hints_used}")

    if isinstance(is_efficient, bool):
        e_val = 1.0 if is_efficient else 0.0
    elif is_efficient in (0, 1, 0.0, 1.0):
        e_val = float(is_efficient)
    else:
        raise ValueError(f"is_efficient E must be 0, 1, or boolean, got {is_efficient}")

    # 2. Time Penalty
    time_penalty = calculate_time_penalty(actual_time, expected_time, c=c)

    # 3. Gating logic for E
    gated_applied = False
    if gated_efficiency and r_val == -1.0 and e_val > 0.0:
        e_val = 0.0
        gated_applied = True

    # 4. Component calculation
    r_comp = w1 * r_val
    h_comp = w2 * hints_used
    e_comp = w3 * e_val
    t_comp = w4 * time_penalty

    delta_m = r_comp - h_comp + e_comp - t_comp
    new_m = max(0.0, min(100.0, current_mastery + delta_m))

    return MasteryResult(
        new_mastery=round(new_m, 4),
        mastery_change=round(delta_m, 4),
        r_component=round(r_comp, 4),
        h_component=round(h_comp, 4),
        e_component=round(e_comp, 4),
        t_penalty=round(t_comp, 4),
        gated_applied=gated_applied,
    )
