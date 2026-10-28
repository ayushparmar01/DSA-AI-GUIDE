# Project Audit Report: DSA AI Guide
**Lead Software Architect & Senior Python Engineer Audit**  
**Date:** October 27, 2026  
**Repository:** `dsa-ai-guide`  
**Audited Documents:**
1. *DSA AI Guide Synopsis Presentation* (GL Bajaj Group of Institutions, Mathura)
2. *DSA AI Guide Progress Report 03* (Week 6–10, October 2026)
3. *DSA AI Guide IEEE-Style Research Paper* ("Specification and Component-Level Evaluation", October 27, 2026)

---

## 1. Executive Summary

This comprehensive audit reconciles the design documents, research specifications, and existing repository codebase for **DSA AI Guide**. 

### Critical Audit Findings
1. **Separation of Verified Prototype vs. Planned Application**:
   - The authoritative IEEE Research Paper and Progress Report 03 explicitly establish that **the full web application has NOT yet been completed**, no human learners were involved, and no live student learning gains have been measured.
   - All evaluation data reported in the research paper originates from author-written synthetic benchmarks (80 leakage items, 24 complexity programs).
   - A suite of **147 Python unit and integration tests** was specified and executed to verify the deterministic components.
2. **Identification of Fabricated Claims in Legacy Drafts**:
   - The repository contained a legacy draft document (`docs/research-paper-draft.md`) claiming "2,500 learner telemetry sessions" and "ROC-AUC 0.941 on Gradient Boosting" as if real students had used the system. 
   - Progress Report 03 (Sections 10, 11, and 14) and the IEEE Research Paper decisively clarify that this dataset was entirely synthetically generated via `ml/data/generate_dataset.py`, and that the live predictive model operates under a **rule-based cold-start fallback** until 20–30 real pilot users provide empirical attempt data.
3. **Algorithm Formula Misalignments in Pre-Audit Code**:
   - Pre-audit Node.js backend files (`server/src/algorithms/masteryAlgorithm.js` and `sm2Algorithm.js`) contained ad-hoc composite formulas (e.g. 6-factor linear weights, hardcoded SM-2 intervals 1, 3, 7 days) that directly contradicted the published IEEE paper formulas.
   - The Python core has now been implemented in `ai-service/app/core/` to strictly obey the published mathematical definitions.

---

## 2. Document-by-Document Comparative Analysis

| Feature / Dimension | 1. Synopsis Presentation | 2. Progress Report 03 | 3. IEEE Research Paper | Pre-Audit Codebase | Resolved System Baseline |
|---|---|---|---|---|---|
| **Deterministic Mastery Formula** | $M' = \text{clamp}(M + 8R - 2H + 3E - T, 0, 100)$ | Section 11, Module M6 ($M_{new}$ formula) | Equation (1): $(w_1..w_4) = (8, 2, 3, 1)$; $c=3$ | Older 6-factor composite score in JavaScript | **IEEE Eq (1) implemented in Python `mastery.py`** |
| **Prerequisite Roadmap** | 16-topic DAG, weighted Kahn (lowest-mastery first) | Section 11, Module M8 (Kahn's topological sort) | 16-topic author DAG, priority $1 - M/100$, alphabetical tie-break | JavaScript BFS traversal without weighted Kahn | **16-topic DAG + weighted Kahn in `roadmap.py`** |
| **SM-2 Spaced Repetition** | Intervals 1, 6, then $\lceil I \times EF \rceil$, floor 1.3 | Section 11, Module M7 (SM-2 scheduler) | Section 4.3 & 6.4: Standard SM-2 + 2 draft flags | Hardcoded intervals (1, 3, 7 days), JS | **Standard SM-2 + draft flags in `sm2.py`** |
| **Leakage Guard** | AST + token similarity, $\tau = 0.80$, <12 token exception | Section 11, Module M9 (AST similarity guard) | Section 4.4 & 6.5: Token + AST sequence ratios | Regex pattern check only in JS | **AST + token sequence ratios in `leakage.py`** |
| **Complexity Analysis** | AST heuristic, v0 loop depth, v1 halving/sort/recursion | Section 11, Module M5 (AST complexity detection) | Section 4.5 & 6.6: v0/v1 + explicit abstention | Missing in Python core | **v0/v1 AST analyzer in `complexity.py`** |
| **Predictive Solve Probability** | Not claimed as built | Module M10: Rule fallback at launch, ML post-pilot | Proposed work; no real learners | Synthetic training script in `ml/` | **Rule fallback + model loader in `routes.py`** |
| **Web Frontend** | Dash-bordered / proposed | React 18, Vite, Monaco, Recharts (Sprint 1-4) | Proposed / dashed | Prototype UI scaffolding in React/Vite | **Clean `frontend/` monorepo package** |
| **Web Backend** | Dash-bordered / proposed | Node.js, Express, MongoDB, Mongoose | Proposed / dashed | Express router scaffolding in `server/` | **Clean `backend/` monorepo package** |
| **Code Sandbox** | Judge0 (proposed) | Judge0 container (Sprint 2) | Proposed / dashed | Placeholder mock service | **Judge0 adapter client planned** |

---

## 3. Discrepancy & Inconsistency Register

### Inconsistency 1: Mastery Update Formula
- **Document 1 & 3**: $M' = \text{clamp}(M + 8R - 2H + 3E - T, 0, 100)$ where $R \in \{+1, +0.5, -1\}$, $H \ge 0$, $E \in \{0, 1\}$, and $T = \text{clamp}\left(\frac{t/t_{exp} - 1}{2}, 0, 1\right)$.
- **Legacy Draft Code**: `server/src/algorithms/masteryAlgorithm.js` implemented $M = \sum w_i S_i$ using accuracy, difficulty points, time bins, recall score, and diagnostic quiz score.
- **Resolution**: Implemented the published formula in `ai-service/app/core/mastery.py` and validated all 52 mastery tests. Documented both published anomalies (optimal solve $\ge 6$ hints decreases score; ungated efficiency bonus on failure).

### Inconsistency 2: SM-2 Scheduler Variations
- **Document 3 (IEEE Paper)**: Original SM-2 has intervals $I(1)=1, I(2)=6, I(n)=\lceil I(n-1) \times EF \rceil$, $EF \ge 1.3$, resets $n=0$ on $q < 3$ without touching $EF$. Identifies 2 draft deviations (`update_ef_on_failure` and `ef_before_interval`) which change 3 and 14 of 46 intervals.
- **Legacy Draft Code**: Used hardcoded intervals 1, 3, 7 days and penalized $EF$ by $-0.2$ upon failure.
- **Resolution**: Implemented canonical SM-2 in `ai-service/app/core/sm2.py` with explicit boolean flags for the draft variations.

### Inconsistency 3: Topic Curriculum Count
- **Document 3 (IEEE Paper)**: Specifies an authored **16-topic prerequisite DAG**.
- **Legacy Draft (`docs/research-paper-draft.md`)**: Mentioned 21 diagnostic topics and 18-phase roadmap.
- **Progress Report 03**: Delimits MVP problem bank to 2 topics (Arrays, Linked Lists).
- **Resolution**: Canonical default graph is the 16-topic DAG specified in Section 4.2 of the IEEE Paper. Problem bank MVP seeds start with Arrays and Linked Lists.

---

## 4. Feature Audit Classification Matrix

Each system component is marked as:
- **A**: Existing and verified
- **B**: Existing but not yet verified
- **C**: Not implemented
- **D**: Proposed future work

| # | System Feature / Component | Category | Verification Method / Evidence |
|---|---|---|---|
| 1 | Deterministic Mastery Engine ($M_{new}$ formula) | **A** | `ai-service/app/core/mastery.py`; 52 unit tests passing |
| 2 | Prerequisite DAG Validation (cycles, self-loops, unknown) | **A** | `ai-service/app/core/roadmap.py`; 10 validation tests passing |
| 3 | Dynamic Roadmap Sequencing (Weighted Kahn + Tie-break) | **A** | `ai-service/app/core/roadmap.py`; 40 roadmap tests passing |
| 4 | Prerequisite Violation Checker | **A** | `verify_prerequisites()` in `roadmap.py`; verified across 15 randomized graphs |
| 5 | SuperMemo SM-2 Scheduler (Canonical + Draft Flags) | **A** | `ai-service/app/core/sm2.py`; 17 schedule tests passing |
| 6 | Syntax Leakage Normalization (AST parsing, docstring drop) | **A** | `ai-service/app/core/leakage.py`; canonical renamer verified |
| 7 | Syntax Leakage Detection (Token + AST sequence difflib) | **A** | `ai-service/app/core/leakage.py`; 15 tests passing, $\tau = 0.80$ |
| 8 | Leakage Guard Short-Input Exception (<12 tokens) | **A** | `ai-service/app/core/leakage.py`; verified under short snippets |
| 9 | Leakage Guard Unparsable Code Fallback | **A** | `ai-service/app/core/leakage.py`; raw text fallback verified |
| 10 | AST Complexity Heuristic v0 (Loop nesting depth) | **A** | `ai-service/app/core/complexity.py`; 4 tests passing ($O(1)$ to $O(N^3)$) |
| 11 | AST Complexity Heuristic v1 (Halving loops, sort, recursion) | **A** | `ai-service/app/core/complexity.py`; 4 tests passing |
| 12 | Complexity Explicit Abstention (Hidden costs: slicing, in, sum) | **A** | `ai-service/app/core/complexity.py`; 2 tests passing |
| 13 | Component Integration Loop (Attempt -> Mastery -> Roadmap -> SM2) | **A** | `ai-service/tests/test_integration.py`; 3 tests passing |
| 14 | FastAPI AI Microservice & Endpoints | **A** | `ai-service/app/main.py` & `routes.py`; 9 API tests passing |
| 15 | Rule-Based Cold-Start Solve Probability Predictor | **A** | Closed-form log-odds equation in `routes.py`; tested |
| 16 | Express Web API Routes & JWT Auth Scaffold | **B** | `backend/src/`; 11 Jest unit tests passing (integration with MongoDB unverified) |
| 17 | React 18 + Vite Code Editor Scaffold | **B** | `frontend/src/`; Monaco editor UI component created, live execution unverified |
| 18 | Supervised ML Models for P(Solve) (Gradient Boosting) | **B** | Scripts exist in `ai-service/app/ml/`, trained on synthetic data only |
| 19 | Judge0 Sandbox Container Integration | **C** | Service client stubbed; docker-compose sandbox not deployed |
| 20 | Socratic LLM Hint Generator (Claude/OpenAI Adapter) | **C** | Multi-provider architecture planned; live LLM calls disabled |
| 21 | Bounded LLM Judge Layer | **C** | Documented in Figure 1 of IEEE paper; not yet implemented |
| 22 | Pilot Empirical User Study (~20–30 learners) | **D** | Scheduled for post-coding phase (Sprint 5) |
| 23 | Deep Knowledge Tracing (DKT) / Bayesian KT Hybrid | **D** | Delimited out of minor project; proposed for Major Project |
