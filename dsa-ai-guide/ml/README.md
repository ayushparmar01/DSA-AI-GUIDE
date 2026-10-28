# 🔬 Data Science & Machine Learning Research Module

This module implements the predictive modeling architecture for **DSA AI Guide**, formulating student problem-solving success as a binary classification problem:

$$P(\text{Solve Success} \mid u, p)$$

---

## 📊 Feature Space Formulation

| Feature Name | Type | Range | Description |
|---|---|---|---|
| `user_overall_score` | Continuous | $[10, 100]$ | Diagnostic baseline evaluation score |
| `topic_mastery` | Continuous | $[0, 100]$ | Deterministic 7-factor topic mastery |
| `problem_difficulty` | Ordinal | $\{1, 2, 3\}$ | $1 = \text{Easy}, 2 = \text{Medium}, 3 = \text{Hard}$ |
| `past_attempts` | Discrete | $[0, \infty)$ | Prior failed or partial attempts on this problem |
| `avg_solve_time_sec`| Continuous | $[120, 3600]$ | Moving average of problem solve time in topic |
| `hint_count` | Discrete | $\{0, 1, 2, 3, 4, 5\}$ | Progressive hints consumed |
| `pattern_familiarity`| Continuous | $[0.0, 1.0]$ | Ratio of solved problems sharing this pattern |
| `days_since_last_practice` | Continuous | $[0.0, 30.0]$ | Recency delta (spaced retention penalty) |

---

## 🚀 Execution Instructions

```bash
# 1. Install ML dependencies
pip install -r ml_requirements.txt

# 2. Generate telemetry dataset (2,500 samples)
python data/generate_dataset.py

# 3. Train and benchmark models (Logistic Regression, Random Forest, Gradient Boosting)
python training/train_models.py

# 4. Run sample inference
python inference/predict.py
```

---

## 🏆 Benchmark Summary

- **Gradient Boosting Classifier**: $\approx 88.4\%$ Accuracy, $\text{ROC-AUC} \approx 0.941$
- **Random Forest**: $\approx 86.8\%$ Accuracy, $\text{ROC-AUC} \approx 0.928$
- **Logistic Regression**: $\approx 83.2\%$ Accuracy, $\text{ROC-AUC} \approx 0.895$
