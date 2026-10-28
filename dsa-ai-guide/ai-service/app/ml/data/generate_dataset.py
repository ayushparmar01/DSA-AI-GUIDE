"""
Synthetic Learner Telemetry Generator for DSA Predictive Analytics.
Generates realistic multi-factor student problem-solving session records.
"""

import os
import random
import pandas as pd
import numpy as np

def generate_learner_dataset(num_samples=2500, output_path=None):
    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), 'synthetic_learning_dataset.csv')

    np.random.seed(42)
    random.seed(42)

    records = []
    
    # Difficulties: 1 = Easy, 2 = Medium, 3 = Hard
    for i in range(num_samples):
        user_overall_score = np.random.normal(62, 18)
        user_overall_score = np.clip(user_overall_score, 10, 100)

        topic_mastery = np.random.normal(55, 22)
        topic_mastery = np.clip(topic_mastery, 5, 100)

        problem_difficulty_num = random.choices([1, 2, 3], weights=[0.45, 0.40, 0.15])[0]
        
        past_attempts = np.random.poisson(1.2)
        
        # Base solve time in seconds depending on difficulty
        base_time = 600 if problem_difficulty_num == 1 else 1200 if problem_difficulty_num == 2 else 2400
        avg_solve_time_sec = np.random.normal(base_time, base_time * 0.35)
        avg_solve_time_sec = max(120, avg_solve_time_sec)

        hint_count = random.choices([0, 1, 2, 3, 4], weights=[0.50, 0.25, 0.15, 0.07, 0.03])[0]
        
        pattern_familiarity = np.random.uniform(0.1, 1.0)
        
        days_since_last_practice = np.random.exponential(3.5)
        days_since_last_practice = min(30, days_since_last_practice)

        # Log-odds probability calculation of successful solve
        # P(Solve) increases with user_score, topic_mastery, pattern_familiarity
        # P(Solve) decreases with difficulty, high solve time, days elapsed, and hint count
        z = (
            0.045 * user_overall_score +
            0.050 * topic_mastery +
            1.200 * pattern_familiarity -
            1.600 * problem_difficulty_num -
            0.0008 * avg_solve_time_sec -
            0.350 * hint_count -
            0.060 * days_since_last_practice -
            1.200 # Intercept
        )
        
        prob_success = 1.0 / (1.0 + np.exp(-z))
        is_solve_successful = 1 if np.random.rand() < prob_success else 0

        records.append({
            'user_overall_score': round(user_overall_score, 1),
            'topic_mastery': round(topic_mastery, 1),
            'problem_difficulty': problem_difficulty_num,
            'past_attempts': past_attempts,
            'avg_solve_time_sec': round(avg_solve_time_sec, 0),
            'hint_count': hint_count,
            'pattern_familiarity': round(pattern_familiarity, 2),
            'days_since_last_practice': round(days_since_last_practice, 1),
            'is_solve_successful': is_solve_successful
        })

    df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[ML Data] Generated {len(df)} telemetry records at: {output_path}")
    print(f"[ML Data] Success rate: {df['is_solve_successful'].mean() * 100:.2f}%")
    return df

if __name__ == '__main__':
    generate_learner_dataset()
