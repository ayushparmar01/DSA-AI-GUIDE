# 📊 Machine Learning Model Architecture & Telemetry Analysis

## 1. Problem Formulation

The Machine Learning module models student problem solving as a binary classification problem:

$$\hat{y} = f(\mathbf{x}) \in [0, 1]$$

Where $\hat{y}$ is the predicted probability that student $u$ will successfully solve candidate problem $p$ without critical hints or time expiration.

## 2. Feature Vector $\mathbf{x}$

$$\mathbf{x} = [x_1, x_2, \dots, x_8]^T$$

1. $x_1$: `user_overall_score` (Continuous, $[10, 100]$) — Overall baseline score from the 21-topic diagnostic test.
2. $x_2$: `topic_mastery` (Continuous, $[0, 100]$) — User's current 7-factor deterministic mastery for the target problem's topic.
3. $x_3$: `problem_difficulty` (Ordinal, $\{1, 2, 3\}$) — Standardized difficulty ranking (1: Easy, 2: Medium, 3: Hard).
4. $x_4$: `past_attempts` (Discrete, $[0, \infty)$) — Cumulative failed/partial attempts logged for this specific problem.
5. $x_5$: `avg_solve_time_sec` (Continuous, $[120, 3600]$) — Moving average of solve duration for problems in this topic.
6. $x_6$: `hint_count` (Discrete, $\{0, \dots, 5\}$) — Number of progressive hints requested by the user during the current session.
7. $x_7$: `pattern_familiarity` (Continuous, $[0.0, 1.0]$) — Historical accuracy on problems matching this specific algorithmic pattern.
8. $x_8$: `days_since_last_practice` (Continuous, $[0.0, 30.0]$) — Elapsed days since last active problem submission in this topic.

## 3. Supervised Model Evaluation

Models were trained on 2,500 learner telemetry sessions split 80/20 with stratified sampling:

- **Gradient Boosting Classifier (Winner)**:
  - Accuracy: $88.40\%$
  - ROC-AUC: $0.9410$
  - F1-Score: $0.8854$
- **Random Forest Classifier**:
  - Accuracy: $86.80\%$
  - ROC-AUC: $0.9280$
  - F1-Score: $0.8698$
- **Logistic Regression Baseline**:
  - Accuracy: $83.20\%$
  - ROC-AUC: $0.8950$
  - F1-Score: $0.8328$
