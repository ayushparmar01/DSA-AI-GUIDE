"""
SuperMemo SM-2 Revision Scheduler
Specified in IEEE Research Paper (Section 4.3, 6.4) & Progress Report 03 (Section 11, M7).

Original SM-2 Algorithm (Wozniak 1990):
- Quality rating q in {0, 1, 2, 3, 4, 5}
- Repetitions n: consecutive successful reviews
- Intervals: I(1) = 1 day, I(2) = 6 days, I(n) = ceil(I(n-1) * EF) for n >= 3
- Initial EF = 2.5, minimum floor EF = 1.3
- EF formula: EF' = max(1.3, EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
- If q < 3 (failed review):
    repetitions reset to 0, interval resets to 1, and EF remains UNCHANGED.
- Interval calculation uses previous EF before EF update.

Draft Deviations (Exposed as Flags):
1. `update_ef_on_failure` (bool, default False):
   If True, updates EF even when q < 3. (In 46 scripted reviews, changes 3 intervals).
2. `ef_before_interval` (bool, default False):
   If True, computes I' using the updated EF' instead of the previous EF.
   (In 46 scripted reviews, changes 14 intervals).
"""

import math
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class SM2Schedule:
    quality: int
    repetitions: int
    interval_days: int
    ease_factor: float
    next_review_days: int
    is_successful: bool
    ef_delta: float


def calculate_sm2_schedule(
    quality: int,
    repetitions: int = 0,
    interval_days: int = 1,
    ease_factor: float = 2.5,
    update_ef_on_failure: bool = False,
    ef_before_interval: bool = False,
    min_ease_factor: float = 1.3,
) -> SM2Schedule:
    """
    Calculates the next SM-2 repetition schedule following the IEEE Paper specification.
    
    Args:
        quality: Performance rating q in [0, 5]
        repetitions: Consecutive successful recall sessions n >= 0
        interval_days: Previous interval in days I >= 1
        ease_factor: Current ease factor EF >= min_ease_factor
        update_ef_on_failure: If True, updates EF even on failed recall (q < 3)
        ef_before_interval: If True, uses updated EF to compute interval
        min_ease_factor: Floor for ease factor (default 1.3)
    """
    # 1. Input Validation
    if not isinstance(quality, int) or quality < 0 or quality > 5:
        raise ValueError(f"Quality q must be an integer between 0 and 5, got {quality}")

    if not isinstance(repetitions, int) or repetitions < 0:
        raise ValueError(f"Repetitions n must be a non-negative integer (>= 0), got {repetitions}")

    if interval_days < 1:
        raise ValueError(f"Interval days must be at least 1, got {interval_days}")

    if ease_factor < min_ease_factor:
        raise ValueError(f"Ease factor must be >= minimum {min_ease_factor}, got {ease_factor}")

    # 2. Ease factor update delta
    # Delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
    delta_ef = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    updated_ef = max(min_ease_factor, ease_factor + delta_ef)

    is_successful = quality >= 3

    if is_successful:
        # Successful review (q >= 3)
        if repetitions == 0:
            next_interval = 1
            next_repetitions = 1
        elif repetitions == 1:
            next_interval = 6
            next_repetitions = 2
        else:
            eff_for_interval = updated_ef if ef_before_interval else ease_factor
            next_interval = math.ceil(interval_days * eff_for_interval)
            next_repetitions = repetitions + 1

        next_ef = updated_ef
    else:
        # Failed review (q < 3)
        next_repetitions = 0
        next_interval = 1
        if update_ef_on_failure:
            next_ef = updated_ef
        else:
            next_ef = ease_factor  # EF remains unchanged in original SM-2

    return SM2Schedule(
        quality=quality,
        repetitions=next_repetitions,
        interval_days=next_interval,
        ease_factor=round(next_ef, 4),
        next_review_days=next_interval,
        is_successful=is_successful,
        ef_delta=round(delta_ef, 4),
    )
