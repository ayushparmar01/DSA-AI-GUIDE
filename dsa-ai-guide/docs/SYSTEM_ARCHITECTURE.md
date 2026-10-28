# System Architecture: DSA AI Guide
**GL Bajaj Group of Institutions, Mathura**  
**Authors:** Ayush Parmar, Himanshi Mittal | **Project Guide:** Er. Gopal  
**Document Classification:** Academic Architectural Specification  
**Date:** October 28, 2026

---

## 1. Architectural Philosophy & Layered Isolation

The **DSA AI Guide** platform addresses the core deficiencies of traditional competitive programming platforms: binary non-pedagogical feedback, cognitive overload, rigid curriculum graphs, and the forgetting curve. 

To achieve scientific integrity and deterministic reproducibility, the architecture strictly segregates:
1. **The Deterministic Core (Python 3 / FastAPI):** Mathematical mastery scoring, Kahn topological sort sequencing, SuperMemo SM-2 interval scheduling, AST-based static complexity estimation, and token/AST solution leakage pre-screening.
2. **The Application Platform & Persistence Layer (Node.js / Express / MongoDB):** REST API gateway, JWT authentication, role authorization, rate-limiting, and state persistence across 8 normalized collections.
3. **The Isolated Execution Sandbox (Judge0 REST API Adapter):** Dedicated containerized code runner executing untrusted code with CPU and memory cgroups. No shell `eval()` or `exec()` is ever permitted on the server.
4. **The Adaptive Presentation Interface (React 18 / Vite / Monaco / Recharts):** IDE environment, multi-tier progressive Socratic hints, live telemetry, and topological DAG visualization.

---

## 2. High-Level System Topology

```mermaid
graph TD
    subgraph ClientLayer ["Layer 1: Learner Presentation Interface (React 18 + Vite)"]
        UI_IDE["Monaco Code Editor & Practice Arena"]
        UI_Hint["5-Stage Socratic Hint Drawer"]
        UI_Roadmap["Kahn Topological Roadmap Visualizer"]
        UI_Revision["SM-2 Spaced Recall Center"]
        UI_Analytics["Recharts Telemetry Dashboard"]
    end

    subgraph GatewayLayer ["Layer 2: Application API Gateway (Node.js + Express)"]
        AuthMiddleware["JWT Auth & Role Guard"]
        RateLimiter["Rate Limiters (API & AI)"]
        Router["Express Modular Router"]
        Controllers["Controllers (Problem, Submission, Revision, AI, Roadmap)"]
    end

    subgraph PersistenceLayer ["Layer 3: Document Store (MongoDB + Mongoose)"]
        DB_User[("USER")]
        DB_Topic[("TOPIC")]
        DB_Problem[("PROBLEM")]
        DB_Attempt[("ATTEMPT")]
        DB_Mastery[("MASTERY_SCORE")]
        DB_Roadmap[("ROADMAP")]
        DB_Revision[("REVISION_SCHEDULE")]
        DB_Hint[("HINT_SESSION")]
    end

    subgraph AIServiceLayer ["Layer 4: Deterministic AI Microservice (FastAPI + Python)"]
        Core_Mastery["Deterministic Mastery Engine (M')"]
        Core_Roadmap["Weighted Kahn DAG Sorter"]
        Core_SM2["SuperMemo SM-2 Scheduler"]
        Core_Leakage["Solution Leakage Guard (tau = 0.80)"]
        Core_Complexity["AST Complexity Heuristic v0/v1"]
        Core_Predict["Rule-Based P(Solve) Fallback"]
    end

    subgraph SandboxLayer ["Layer 5: Sandboxed Code Runner"]
        Judge0["Judge0 Isolated Runner (:2358)"]
    end

    UI_IDE -->|HTTPS / Bearer JWT| AuthMiddleware
    UI_Hint -->|HTTPS / Bearer JWT| AuthMiddleware
    UI_Roadmap -->|HTTPS / Bearer JWT| AuthMiddleware
    UI_Revision -->|HTTPS / Bearer JWT| AuthMiddleware
    UI_Analytics -->|HTTPS / Bearer JWT| AuthMiddleware

    AuthMiddleware --> Router
    Router --> Controllers

    Controllers -->|CRUD Operations| PersistenceLayer
    Controllers -->|HTTP JSON Bridge :8000| AIServiceLayer
    Controllers -->|HTTP /submissions?wait=true :2358| SandboxLayer
```

---

## 3. End-to-End Submission & Telemetry Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner (Browser)
    participant IDE as Monaco / Client App
    participant API as Express API Gateway
    participant J0 as Judge0 Sandbox Container
    participant AI as Python AI Microservice
    participant DB as MongoDB Persistence

    Learner->>IDE: Write & Submit Solution Code
    IDE->>API: POST /api/submissions/:slug/submit { code, language, hintsUsed, timeTaken }
    
    API->>DB: Fetch Problem Test Cases & Reference Solution
    DB-->>API: Problem Document

    Note over API,J0: Step 1: Sandboxed Execution (Zero local exec/eval)
    API->>J0: POST /submissions (source, stdin, expectedOutput, cgroup limits)
    J0-->>API: { status: "Accepted", runtimeMs, memoryKb, results }

    Note over API,AI: Step 2: AST Complexity Analysis
    API->>AI: POST /api/v1/complexity { code, version: "v1" }
    AI-->>API: { complexity: "O(N)", confidence: 0.85, abstained: false }

    Note over API,DB: Step 3: Persist Attempt Telemetry
    API->>DB: Create ATTEMPT Document

    Note over API,AI: Step 4: Deterministic Topic Mastery Evaluation
    API->>AI: POST /api/v1/mastery/calculate { M, R, H, E, t, t_exp }
    AI-->>API: { new_mastery, delta, time_penalty }
    API->>DB: Upsert MASTERY_SCORE Document

    alt Execution Accepted
        Note over API,AI: Step 5: Schedule SM-2 Spaced Repetition
        API->>AI: POST /api/v1/sm2/schedule { quality: 4, repetitions: 0, interval: 1, EF: 2.5 }
        AI-->>API: { repetitions: 1, interval_days: 1, ease_factor: 2.50 }
        API->>DB: Upsert REVISION_SCHEDULE Document
    end

    API-->>IDE: 201 Created { execution, attempt, mastery, message }
    IDE-->>Learner: Display Test Results, Complexity Badge & Mastery Points Delta
```

---

## 4. Socratic Hint Generation & Solution Leakage Guard

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner
    participant UI as Progressive Hint Drawer
    participant API as Express Backend
    participant AI as Python AI Microservice
    participant DB as HINT_SESSION Collection

    Learner->>UI: Request Tier k Hint (k in 1..5)
    UI->>API: POST /api/ai/hint/:slug { level: k }
    API->>DB: Fetch Problem Reference Solution & Hints
    DB-->>API: Problem Reference Code

    API->>AI: POST /api/v1/leakage/check { candidateHint, referenceSolution, threshold: 0.80 }
    
    alt Combined Similarity > 0.80 (Solution Leak Detected)
        AI-->>API: { is_leak: true, combined_similarity: 0.96 }
        API->>API: Replace Hint with Socratic Inquiry Question
    else Combined Similarity <= 0.80 (Clean Conceptual Clue)
        AI-->>API: { is_leak: false, combined_similarity: 0.28 }
    end

    API->>DB: Log Interaction in HINT_SESSION
    API-->>UI: 200 OK { hint, wasBlocked, leakageScore, leakageDetails }
    UI-->>Learner: Render Socratic Hint + Screening Badge + Research Disclosure
```

---

## 5. Normalized Database Entities (The 8 Report Collections)

| Collection | Schema File | Primary Indexes | Architectural Invariants |
|---|---|---|---|
| **`USER`** | `User.js` | `_id`, `email` (unique) | Passwords hashed with bcrypt (cost 10). Stores gamification states (XP, streaks, level). |
| **`TOPIC`** | `Topic.js` | `_id`, `slug` (unique) | Corresponds to the 16 IEEE prerequisite graph topics rooted at Complexity Analysis. |
| **`PROBLEM`** | `Problem.js` | `_id`, `slug` (unique), `topicSlug` | Stores problem statement, constraints, optimal bounds, sample test cases, hidden test cases (never exposed to client), and 5-tier hints. |
| **`ATTEMPT`** | `Attempt.js` | `_id`, `userId`, `problemSlug`, `status` | Auditable log of all submissions with Judge0 runtime ms, memory, and mastery delta. |
| **`MASTERY_SCORE`** | `MasteryScore.js` | `_id`, `userId + topicSlug` (unique) | Clamped mastery score $M \in [0, 100]$ computed via $M' = \text{clamp}(M + 8R - 2H + 3E - T, 0, 100)$. |
| **`ROADMAP`** | `Roadmap.js` | `_id`, `userId` (unique) | Topological sequence of the 16 topics generated by weighted Kahn algorithm. |
| **`REVISION_SCHEDULE`** | `RevisionSchedule.js` | `_id`, `userId + problemSlug` (unique) | SuperMemo SM-2 state: repetitions $n$, interval days $I$, and ease factor $EF \ge 1.30$. |
| **`HINT_SESSION`** | `HintSession.js` | `_id`, `userId`, `problemSlug`, `level` | Audit trail of hints served, similarity scores, and leakage block flags. |

---

## 6. Security & Execution Isolation Mandate

1. **Zero Shell Execution**: User code is sent strictly over HTTP to Judge0 running in an isolated container. The application server never executes `child_process.exec`, `eval()`, or `new Function()`.
2. **Access Isolation**: Learner attempts, mastery scores, and revision queues enforce strict ownership checking (`req.user._id === attempt.userId`). Cross-user snooping returns `403 Forbidden`.
3. **No Solution Leaks**: Hidden test cases and reference solutions are explicitly stripped (`.select('-hiddenTestCases -solutionCode')`) before problem objects leave the API gateway.
