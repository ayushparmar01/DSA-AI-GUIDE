"""
Standalone Inference Engine for Predicting Problem Solve Success Probability.
Can be invoked from CLI or integrated via subprocess / microservice.
"""

import os
import sys
import joblib
import numpy as np

def predict_solve_probability(features_dict):
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
    model_path = os.path.join(models_dir, 'best_solve_predictor.joblib')
    scaler_path = os.path.join(models_dir, 'feature_scaler.joblib')

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        # Fallback heuristic calculation if model not trained yet
        score = features_dict.get('user_overall_score', 60)
        mastery = features_dict.get('topic_mastery', 50)
        diff = features_dict.get('problem_difficulty', 2)
        base = (score * 0.4 + mastery * 0.6) / 100.0
        prob = max(0.05, min(0.95, base - (diff - 1) * 0.2))
        return round(prob, 4)

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    feature_array = np.array([[
        features_dict.get('user_overall_score', 60),
        features_dict.get('topic_mastery', 50),
        features_dict.get('problem_difficulty', 2),
        features_dict.get('past_attempts', 0),
        features_dict.get('avg_solve_time_sec', 1200),
        features_dict.get('hint_count', 0),
        features_dict.get('pattern_familiarity', 0.5),
        features_dict.get('days_since_last_practice', 2.0)
    ]])

    feature_scaled = scaler.transform(feature_array)
    prob_success = model.predict_proba(feature_scaled)[0, 1]
    return round(float(prob_success), 4)

if __name__ == '__main__':
    sample_student = {
        'user_overall_score': 72.0,
        'topic_mastery': 80.0,
        'problem_difficulty': 2, # Medium
        'past_attempts': 1,
        'avg_solve_time_sec': 950,
        'hint_count': 1,
        'pattern_familiarity': 0.85,
        'days_since_last_practice': 1.5
    }

    prob = predict_solve_probability(sample_student)
    print(f"Sample Student P(Solve Success): {prob * 100:.2f}%")
