# 📡 DSA AI Guide — Complete REST API & Microservice Specification

## 1. Architecture Overview

The DSA AI Guide backend operates as a dual-microservice architecture conforming strictly to **Progress Report 03** and the **IEEE Research Paper**:

| Service | Technology | Default Port | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Node.js Express Backend** | Node.js 18+, Express, Mongoose | `5000` / `5001` | Authentication, database persistence, REST routing, Judge0 execution adapter, business workflows |
| **Python AI Microservice** | Python 3.12+, FastAPI, AST, scikit-learn | `8000` | Deterministic mastery engine, SM-2 spaced repetition scheduler, Kahn DAG roadmap sequencer, AST complexity heuristic, syntax leakage guard |
| **Database** | MongoDB 8.0+ | `27017` | Persistent storage for 8 core collections |
| **Sandbox Execution** | Judge0 CE / RapidAPI | `2358` | Isolated compile & execution runner for C++, Python, Java, JavaScript |

---

## 2. Authentication, Security & Error Handling

### Headers & Tokens
All protected endpoints require a valid JWT Bearer token:
```http
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
```

### Security Layers
1. **Helmet**: Sets restrictive HTTP security headers (CSP, HSTS, X-Content-Type-Options, etc.).
2. **CORS**: Restricted whitelist enabling local frontend (`http://localhost:5173`) with credentials.
3. **Data Isolation**: Strict ownership checks (`req.user._id === doc.userId`). Cross-user access returns `403 Forbidden`.
4. **Sandboxed Code Execution**: User code is executed strictly inside isolated Judge0 sandbox containers. No `exec()` or `eval()` is ever permitted.
5. **Schema Validation**: Declarative `SchemaValidator` verifies type, length, regex, range, and enum constraints before controllers execute.

### Centralized Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Field 'email' format is invalid."
  ]
}
```

---

## 3. Node.js Express REST Endpoints

### 3.1 Authentication (`/api/auth`)

#### `POST /api/auth/register`
Creates a new student or admin account and initial profile.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@dsa.guide",
    "password": "Password123!",
    "role": "student"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "64b1f2e3d4c5b6a7f8901234",
        "name": "Jane Doe",
        "email": "jane@dsa.guide",
        "role": "student",
        "xp": 0,
        "level": 1,
        "streakCurrent": 0
      },
      "profile": { ... },
      "token": "eyJhbGciOi..."
    },
    "message": "User registered successfully"
  }
  ```

#### `POST /api/auth/login`
Authenticates user with bcrypt password verification.
- **Request Body**:
  ```json
  {
    "email": "jane@dsa.guide",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "user": { ... },
      "token": "eyJhbGciOi..."
    },
    "message": "Login successful"
  }
  ```

#### `GET /api/auth/me` `[Protected]`
Returns the currently authenticated user session.

---

### 3.2 User Profile (`/api/users`)

#### `GET /api/users/profile` `[Protected]`
Returns full user profile, academic details, and target companies.

#### `PUT /api/users/profile` `[Protected]`
Updates user target goal, preferred programming language, and college.

#### `GET /api/users/achievements` `[Protected]`
Returns unlocked and pending gamification badges.

---

### 3.3 Problem Catalog (`/api/problems`)

#### `GET /api/problems`
Query curated problem catalog with query filters:
- **Query Params**: `topic`, `pattern`, `difficulty` (Easy|Medium|Hard), `search`, `source`
- **Response `200 OK`**: Array of problems with starter code, constraints, and user solve status.

#### `GET /api/problems/:slug`
Fetch full problem definition and sample test cases (hidden test cases stripped).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "problem": {
        "title": "Two Sum",
        "slug": "two-sum",
        "topicSlug": "hashing",
        "difficulty": "Easy",
        "starterCode": { "python": "...", "cpp": "..." },
        "sampleTestCases": [...]
      },
      "userStatus": "Attempted",
      "submissions": [...]
    }
  }
  ```

---

### 3.4 Code Execution & Submissions (`/api/submissions`)

#### `POST /api/submissions/:slug/run` `[Protected]`
Executes code against sample test cases in Judge0 without persisting to permanent history.
- **Request Body**:
  ```json
  {
    "language": "python",
    "code": "class Solution: def twoSum(self, nums, target): return [0, 1]"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "status": "Accepted",
      "isAvailable": true,
      "message": "Execution completed: 2/2 test cases passed.",
      "testCasesPassed": 2,
      "totalTestCases": 2,
      "runtimeMs": 35,
      "memoryKb": 3200,
      "results": [...]
    }
  }
  ```

#### `POST /api/submissions/:slug/submit` `[Protected]`
Evaluates code against both sample and hidden test cases, creates `ATTEMPT` record, updates deterministic topic mastery via Equation (1), schedules SM-2 revision, and emits telemetry.
- **Request Body**:
  ```json
  {
    "language": "python",
    "code": "class Solution: def twoSum(self, nums, target): ...",
    "timeTakenSeconds": 180,
    "hintsUsedCount": 1
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "data": {
      "attempt": {
        "_id": "64b1f2e3d4c5b6a7f8907777",
        "status": "Accepted",
        "result": 1.0,
        "runtimeMs": 38,
        "masteryDelta": 9,
        "testCasesPassed": 3,
        "totalTestCases": 3
      },
      "execution": { ... },
      "mastery": {
        "currentScore": 50,
        "newScore": 59,
        "delta": 9,
        "timePenalty": 0
      }
    }
  }
  ```

#### `GET /api/submissions/my` `[Protected]`
Returns paginated attempt history for the logged-in user.

#### `GET /api/submissions/:id` `[Protected]`
Retrieves full submission record including test case outputs.
- **Security**: Verifies `attempt.userId === req.user._id`. Returns `403 Forbidden` on unauthorized access.

---

### 3.5 Topic Mastery & Prerequisite Roadmap (`/api/roadmap`)

#### `GET /api/roadmap` `[Protected]`
Returns the user's personalized 16-topic DAG roadmap sequenced by weighted Kahn topological sorting from the Python microservice.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "sequence": [
        "complexity-analysis",
        "arrays",
        "recursion",
        "linked-lists",
        "stacks",
        "queues",
        "hashing",
        "two-pointers",
        "sliding-window",
        "binary-search",
        "trees",
        "binary-search-trees",
        "heaps",
        "graphs",
        "dynamic-programming",
        "backtracking"
      ],
      "currentPhaseNumber": 1,
      "phases": [...]
    }
  }
  ```

#### `GET /api/roadmap/mastery` `[Protected]`
Returns topic mastery records $[0, 100]$ across all 16 DSA categories.

#### `GET /api/roadmap/mastery/:topicSlug` `[Protected]`
Returns single-topic mastery telemetry and historical attempt progression.

---

### 3.6 Spaced Repetition Revision (`/api/revision`)

#### `GET /api/revision` `[Protected]`
Fetches problems due for recall review today where `nextReviewDate <= now`.

#### `POST /api/revision/submit` `[Protected]`
Submits SM-2 recall rating $q \in [0, 5]$, updating repetitions $n$, interval $I$, and ease factor $EF$.
- **Request Body**:
  ```json
  {
    "problemSlug": "two-sum",
    "quality": 4,
    "timeTakenSeconds": 120
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "problemSlug": "two-sum",
      "repetitions": 2,
      "intervalDays": 6,
      "easeFactor": 2.6,
      "nextReviewDate": "2026-11-02T..."
    },
    "message": "Revision recorded and next interval updated."
  }
  ```

---

### 3.7 AI Guidance & AST Complexity (`/api/ai`)

#### `POST /api/ai/hint/:slug` `[Protected, Rate-Limited]`
Requests graduated hint (tiers 1–5). Screened through Python **Solution Leakage Guard** at threshold $\tau = 0.80$. If leakage is detected, direct code is blocked and replaced with Socratic guidance. Logged into `HINT_SESSION`.
- **Request Body**:
  ```json
  {
    "level": 2,
    "attemptId": "64b1f2e3d4c5b6a7f8907777"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "sessionId": "64b1f2e3d4c5b6a7f8908888",
      "level": 2,
      "hint": "[Level 2 - Pattern Hint] This problem relates to the 'two-sum-hashing' pattern.",
      "wasBlocked": false,
      "leakageScore": 0.22,
      "explanation": "Clean conceptual hint below cutoff"
    }
  }
  ```

#### `POST /api/ai/complexity`
Analyzes Python source code via AST heuristic and returns estimated Big-O complexity with explicit abstention.
- **Request Body**:
  ```json
  {
    "code": "def binary_search(arr, target):\n    low, high = 0, len(arr)-1\n    while low <= high:\n        mid = (low+high)//2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1",
    "version": "v1"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "complexity": "O(log N)",
      "version": "v1",
      "loop_depth": 1,
      "has_halving_loop": true,
      "abstained": false,
      "confidence": 0.9,
      "explanation": "Logarithmic loop detected with pointer halving pattern."
    }
  }
  ```

---

### 3.8 Analytics Dashboard (`/api/analytics`)

#### `GET /api/analytics/dashboard` `[Protected]`
Aggregates student metrics: total solved, difficulty breakdown (easy, medium, hard), accuracy rate, current/longest streaks, and average mastery.

---

## 4. Python FastAPI AI Microservice Endpoints (`:8000/api/v1`)

| Endpoint | Method | Input Schema | Output Description |
| :--- | :--- | :--- | :--- |
| `/mastery/calculate` | `POST` | `MasteryCalculateRequest` | Computes $M' = \text{clamp}(M + 8R - 2H + 3E - T, 0, 100)$ with delta and component penalties |
| `/roadmap/generate` | `POST` | `RoadmapGenerateRequest` | Kahn topological sort with lowest-mastery priority $(1 - M/100)$ and alphabetical tie-break |
| `/roadmap/validate` | `POST` | `DAGValidateRequest` | Validates prerequisite graph for self-loops, unknown nodes, and directed cycles |
| `/sm2/next-schedule` | `POST` | `SM2ScheduleRequest` | SuperMemo SM-2 interval scheduler with $EF \ge 1.3$ constraint and failure resets |
| `/leakage/check` | `POST` | `LeakageCheckRequest` | Tokenization and AST comparison checking candidate hints against reference solutions at $\tau = 0.80$ |
| `/complexity/estimate` | `POST` | `ComplexityEstimateRequest` | Python AST inspection detecting loop depth, halving loops, sort calls, recursion, and hidden costs |
| `/predict/solve-probability` | `POST` | `PredictSolveRequest` | ML pipeline or cold-start fallback estimating $P(\text{Solve})$ |

---

## 5. Judge0 Sandbox Status Mapping

| Status ID | Status Name | Terminal | Backend Result Mapping |
| :---: | :--- | :---: | :--- |
| **1** | In Queue | No | Queued |
| **2** | Processing | No | Processing |
| **3** | Accepted | Yes | Accepted ($R = 1.0$ or $0.5$) |
| **4** | Wrong Answer | Yes | Wrong Answer ($R = -1.0$) |
| **5** | Time Limit Exceeded | Yes | Time Limit Exceeded ($R = -1.0$) |
| **6** | Compilation Error | Yes | Compilation Error ($R = -1.0$) |
| **7–12** | Runtime Errors (SIGSEGV, SIGXFSZ, etc.) | Yes | Runtime Error ($R = -1.0$) |
| **13** | Internal Error | Yes | Service Error (Honest unreachable notification) |
| **14** | Exec Format Error | Yes | Compilation Error |

---

## 6. How to Run Locally

### 1. Start Python FastAPI AI Microservice
```powershell
cd ai-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/v1/health`

### 2. Start Node.js Express Backend
```powershell
cd backend
npm install
npm run seed     # Seeds 16 core DAG topics and MVP problems
npm run dev      # Starts Express on http://localhost:5001
```

### 3. Execute Automated Test Suites
- **Python AI Microservice Tests (171 tests)**:
  ```powershell
  cd ai-service
  python -m pytest tests -v
  ```
- **Backend Jest Tests (59 tests)**:
  ```powershell
  cd backend
  npm test
  ```
