"""
Feature Engineering and Data Preprocessing Pipeline.
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    'user_overall_score',
    'topic_mastery',
    'problem_difficulty',
    'past_attempts',
    'avg_solve_time_sec',
    'hint_count',
    'pattern_familiarity',
    'days_since_last_practice'
]

TARGET_COLUMN = 'is_solve_successful'

def load_and_preprocess_data(csv_path, test_size=0.2, random_state=42):
    df = pd.read_csv(csv_path)
    
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, scaler, FEATURE_COLUMNS
