# API Documentation: DSA AI Guide
**Specification for Backend Gateway (:5001) & Python AI Microservice (:8000)**  
**Version:** 1.0.0 (Production / Academic Demo Ready)  
**Date:** October 28, 2026

---

## 1. Gateway Health & Diagnostics

### `GET /api/health`
Verifies backend operational status.
- **Auth:** None
- **Response (200 OK):**
```json
{
  "success": true,
  "status": "ONLINE",
  "message": "DSA AI Guide API is running smoothly",
  "timestamp": "2026-10-28T05:00:00.000Z"
}
```

---

## 2. Authentication & User Management

### `POST /api/auth/register`
Creates a new student account.
- **Body:**
```json
{
  "name": "Ayush Parmar",
  "email": "ayush@dsa-ai-guide.edu",
  "password": "SecurePassword123"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "_id": "671df42a1...",
      "name": "Ayush Parmar",
      "email": "ayush@dsa-ai-guide.edu",
      "role": "student"
    }
  }
}
```

### `POST /api/auth/login`
Authenticates existing user with bcrypt comparison.
- **Body:**
```json
{
  "email": "ayush@dsa-ai-guide.edu",
  "password": "SecurePassword123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": { "_id": "671df42a1...", "name": "Ayush Parmar", "email": "ayush@dsa-ai-guide.edu", "role": "student" }
  }
}
```

### `GET /api/users/profile`
Returns the authenticated learner's profile, XP, streak, and preferences.
- **Auth:** `Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": { "name": "Ayush Parmar", "email": "ayush@dsa-ai-guide.edu", "xp": 120, "level": 2 },
    "profile": { "dailyGoalProblems": 3, "preferredLanguage": "python" }
  }
}
```

---

## 3. DSA Problem Bank

### `GET /api/problems`
Filters problems by topic, difficulty, or keyword search.
- **Query Params:** `topic`, `difficulty`, `search`, `source`
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 16,
  "data": [
    {
      "_id": "671df42...",
      "title": "Two Sum",
      "slug": "two-sum",
      "topicSlug": "arrays",
      "difficulty": "Easy",
      "source": "LeetCode Top 150",
      "userStatus": "Solved"
    }
  ]
}
```

### `GET /api/problems/:slug`
Retrieves detailed problem statement, constraints, optimal bounds, and sample test cases. Hidden test cases and solution code are strictly stripped from response.
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "problem": {
      "title": "Two Sum",
      "slug": "two-sum",
      "description": "Given an array of integers nums and an integer target...",
      "constraints": ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
      "optimalTimeComplexity": "O(N)",
      "optimalSpaceComplexity": "O(N)",
      "sampleTestCases": [{ "input": "[2,7,11,15], 9", "output": "[0, 1]" }],
      "starterCode": { "python": "def twoSum(nums, target):\\n    pass" }
    },
    "userStatus": "Attempted",
    "submissions": []
  }
}
```

---

## 4. Code Execution & Deterministic Submissions

### `POST /api/submissions/:slug/run`
Runs code against public sample test cases using the isolated Judge0 runner.
- **Auth:** `Bearer <token>`
- **Body:** `{ "code": "...", "language": "python" }`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "Accepted",
    "isAvailable": true,
    "testCasesPassed": 1,
    "totalTestCases": 1,
    "runtimeMs": 35,
    "memoryKb": 2048,
    "results": [
      { "testCaseIndex": 1, "passed": true, "input": "[2,7,11,15], 9", "expectedOutput": "[0, 1]", "actualOutput": "[0, 1]" }
    ]
  }
}
```

### `POST /api/submissions/:slug/submit`
Full evaluation against sample + hidden test cases. Updates deterministic mastery $M' = \text{clamp}(M + 8R - 2H + 3E - T, 0, 100)$ and schedules SM-2 spaced repetition if Accepted.
- **Auth:** `Bearer <token>`
- **Body:**
```json
{
  "code": "def twoSum(nums, target):\\n    seen = {}\\n    for i, x in enumerate(nums):\\n        if target - x in seen: return [seen[target - x], i]\\n        seen[x] = i\\n    return []",
  "language": "python",
  "timeTakenSeconds": 240,
  "hintsUsedCount": 0
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "_id": "671df4...",
      "status": "Accepted",
      "runtimeMs": 42,
      "memoryKb": 2048,
      "complexityAnalysis": {
        "complexity": "O(N)",
        "abstained": false,
        "confidence": 0.85,
        "explanation": "Single for-loop iterating over input elements"
      }
    },
    "execution": { "status": "Accepted", "testCasesPassed": 3, "totalTestCases": 3 },
    "mastery": {
      "newScore": 61.0,
      "delta": 11.0,
      "timePenalty": 0.0
    }
  },
  "message": "Solution Accepted! 🎉"
}
```

### `GET /api/submissions/:id`
Retrieves single attempt details. Rejects with `403 Forbidden` if requested by another non-admin user.
- **Auth:** `Bearer <token>`
- **Response (200 OK):** Attempt document.

---

## 5. Socratic Hints & Solution Leakage Guard

### `POST /api/ai/hint/:slug`
Requests a graduated cognitive hint (Level 1..5) with pre-screening through the Python Solution Leakage Guard ($\tau = 0.80$).
- **Auth:** `Bearer <token>`
- **Body:** `{ "level": 1 }`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "671df4...",
    "level": 1,
    "hint": "[Level 1 - Concept Clue] Think about how elements relate to each other. Can you reduce redundant checks?",
    "wasBlocked": false,
    "leakageScore": 0.271,
    "leakageDetails": {
      "tokenSimilarity": 0.271,
      "astSimilarity": 0.250,
      "threshold": 0.80,
      "isShortInput": false,
      "explanation": "Clean conceptual hint"
    }
  }
}
```

---

## 6. AST Static Complexity Analysis

### `POST /api/ai/complexity`
Analyzes code abstract syntax tree directly via the Python microservice.
- **Auth:** `Bearer <token>`
- **Body:** `{ "code": "def search(arr, k):\\n    for x in arr: pass", "version": "v1" }`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "complexity": "O(N)",
    "abstained": false,
    "confidence": 0.90,
    "explanation": "Single linear loop traversal detected"
  }
}
```

---

## 7. Dynamic Prerequisite Roadmap

### `GET /api/roadmap`
Returns the 16-topic prerequisite graph ordered via weighted Kahn's topological sort (lowest-mastery first).
- **Auth:** `Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "currentTopicSlug": "arrays",
    "overallRoadmapCompletion": 12,
    "sequence": ["complexity-analysis", "arrays", "recursion", "hashing", "..."],
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Phase 1: Complexity Analysis",
        "topicSlug": "complexity-analysis",
        "status": "completed",
        "masteryScore": 85
      }
    ]
  }
}
```

### `POST /api/roadmap/regenerate`
Forces re-computation of the Kahn topological sort based on the latest mastery scores.

---

## 8. Spaced Repetition (SuperMemo SM-2)

### `GET /api/revision`
Fetches all problems currently due for review ($dueDate \le now$).
- **Auth:** `Bearer <token>`
- **Response (200 OK):** Array of due items with previous repetition number and ease factor.

### `POST /api/revision/submit`
Logs recall quality rating ($q \in [0, 5]$) and computes next repetition interval via SM-2.
- **Auth:** `Bearer <token>`
- **Body:** `{ "problemSlug": "two-sum", "quality": 5, "timeTakenSeconds": 180 }`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "problemSlug": "two-sum",
    "repetitionNumber": 2,
    "intervalDays": 6,
    "easeFactor": 2.60,
    "dueDate": "2026-11-03T05:00:00.000Z"
  },
  "message": "Revision recorded and next interval updated."
}
```

---

## 9. Analytics & Telemetry

### `GET /api/analytics/dashboard`
Aggregates real attempt metrics, outcomes, mastery progression, and hint usage. Shows genuine zero values for new accounts.
- **Auth:** `Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalAttempts": 12,
    "acceptedAttempts": 9,
    "accuracyRate": 75,
    "totalHintsUsed": 8,
    "averageHintsPerAttempt": 0.67,
    "revisionsDueCount": 2,
    "outcomeBreakdown": {
      "accepted": 9,
      "wrongAnswer": 2,
      "timeLimitExceeded": 1,
      "compilationError": 0,
      "runtimeError": 0
    },
    "masteryBreakdown": [
      { "topicSlug": "arrays", "masteryScore": 72.0 },
      { "topicSlug": "hashing", "masteryScore": 65.0 }
    ],
    "weeklyActivity": [
      { "day": "Mon", "solved": 2, "attempts": 3 },
      { "day": "Tue", "solved": 1, "attempts": 2 }
    ]
  }
}
```

---

## 10. Python AI Microservice Direct Endpoints (:8000)

| Endpoint | Method | Input Parameters | Return Value |
|---|---|---|---|
| `/health` | GET | None | `{"status": "ONLINE", "version": "1.0.0"}` |
| `/api/v1/mastery/calculate` | POST | `current_mastery, result, hints_used, is_efficient, actual_time, expected_time, gated_efficiency` | `{ "new_mastery", "mastery_change", "r_component", "h_component", "e_component", "t_penalty" }` |
| `/api/v1/roadmap/generate` | POST | `mastery_scores: Dict[str, float]` | `{ "roadmap": List[str], "algorithm": "Weighted Kahn Topological Sort" }` |
| `/api/v1/sm2/schedule` | POST | `quality, repetitions, interval_days, ease_factor` | `{ "repetitions", "interval_days", "ease_factor" }` |
| `/api/v1/leakage/check` | POST | `candidate_hint, reference_solution, threshold` | `{ "is_leak", "combined_similarity", "token_similarity", "ast_similarity", "is_short_input" }` |
| `/api/v1/complexity/estimate` | POST | `code, version: "v0" | "v1"` | `{ "complexity", "abstained", "confidence", "explanation", "rules_triggered" }` |
| `/api/v1/predict/solve-probability` | POST | `user_overall_score, topic_mastery, problem_difficulty, ...` | `{ "probability", "will_solve", "model_used", "confidence" }` |
