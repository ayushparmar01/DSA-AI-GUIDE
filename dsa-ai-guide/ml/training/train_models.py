"""
Model Training and Comparison Pipeline for P(Solve Success) Prediction.
Evaluates Logistic Regression, Random Forest, and Gradient Boosting.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from preprocessing.pipeline import load_and_preprocess_data, FEATURE_COLUMNS
from data.generate_dataset import generate_learner_dataset

def train_and_evaluate():
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
    csv_path = os.path.join(data_dir, 'synthetic_learning_dataset.csv')

    if not os.path.exists(csv_path):
        print("[ML Training] Dataset not found, generating synthetic data...")
        generate_learner_dataset(num_samples=2500, output_path=csv_path)

    X_train, X_test, y_train, y_test, scaler, feature_names = load_and_preprocess_data(csv_path)

    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42)
    }

    results = {}
    best_model_name = None
    best_roc_auc = 0.0
    best_model = None

    print("\n=======================================================")
    print("🏆 ML MODEL BENCHMARK RESULTS (P(Solve Success))")
    print("=======================================================\n")

    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        probs = model.predict_proba(X_test)[:, 1]

        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds)
        rec = recall_score(y_test, preds)
        f1 = f1_score(y_test, preds)
        auc = roc_auc_score(y_test, probs)

        results[name] = {
            'Accuracy': acc,
            'Precision': prec,
            'Recall': rec,
            'F1-Score': f1,
            'ROC-AUC': auc
        }

        print(f"📊 {name.upper()}:")
        print(f"   - Accuracy:  {acc * 100:.2f}%")
        print(f"   - Precision: {prec * 100:.2f}%")
        print(f"   - Recall:    {rec * 100:.2f}%")
        print(f"   - F1-Score:  {f1 * 100:.2f}%")
        print(f"   - ROC-AUC:   {auc:.4f}\n")

        if auc > best_roc_auc:
            best_roc_auc = auc
            best_model_name = name
            best_model = model

    print(f"🥇 BEST PERFORMING MODEL: {best_model_name} (ROC-AUC: {best_roc_auc:.4f})")

    # Save artifacts
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
    os.makedirs(models_dir, exist_ok=True)
    
    model_save_path = os.path.join(models_dir, 'best_solve_predictor.joblib')
    scaler_save_path = os.path.join(models_dir, 'feature_scaler.joblib')

    joblib.dump(best_model, model_save_path)
    joblib.dump(scaler, scaler_save_path)

    print(f"[ML Artifacts] Model and Scaler saved successfully to {models_dir}")
    return results

if __name__ == '__main__':
    train_and_evaluate()
