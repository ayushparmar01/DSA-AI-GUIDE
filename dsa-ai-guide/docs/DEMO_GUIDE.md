# Academic Demonstration Guide: DSA AI Guide
**GL Bajaj Group of Institutions, Mathura**  
**Student Authors:** Ayush Parmar, Himanshi Mittal | **Project Guide:** Er. Gopal  
**Document Classification:** Interactive Demonstration & Evaluation Script  
**Date:** October 28, 2026

---

## 1. Quick-Start Setup (Under 2 Minutes)

Open three separate terminal windows:

### Terminal 1: Python AI Microservice (Port 8000)
```powershell
cd C:\Users\Lenovo\.gemini\antigravity\scratch\dsa-ai-guide\ai-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Health Check:* Open `http://localhost:8000/docs` to inspect the Swagger API docs.

### Terminal 2: Node.js Express Backend (Port 5001)
```powershell
cd C:\Users\Lenovo\.gemini\antigravity\scratch\dsa-ai-guide\backend
# Populate realistic demo data (47 problems, 145 questions, 18 users, mastery histories)
npm run seed
npm run dev
```
*Health Check:* Open `http://localhost:5001/api/health` (Returns `{"status": "ONLINE"}`).

### Terminal 3: React Vite Client (Port 5173)
```powershell
cd C:\Users\Lenovo\.gemini\antigravity\scratch\dsa-ai-guide\frontend
npm run dev
```
*Web Application:* Open `http://localhost:5173` in your browser.

---

## 2. Interactive Academic Evaluation Walkthrough

Follow this scripted 8-step walkthrough during oral examination or project reviews:

### Step 1: Authentication & Genuine Empty State
1. Open `http://localhost:5173/register`.
2. Register a new student account (e.g., `evaluator@glbajaj.org`, `Password123!`).
3. Upon registration, you are redirected to the **Learner Dashboard** (`/dashboard`).
4. **Key Evaluator Observation:** The dashboard displays a **genuine empty state** ("No Attempt Telemetry Yet"). Explain to the evaluation committee:
   > *"In strict compliance with research integrity guidelines, our platform never displays fabricated progress or mock analytics charts for a new learner. Progress graphs only render when genuine execution telemetry is recorded in MongoDB."*

### Step 2: Problem Discovery & Problem Bank
1. Click **Problem Bank** in the navigation bar (`/problems`).
2. Demonstrate dynamic filtering:
   - Filter by Topic (e.g., "Arrays").
   - Filter by Difficulty (e.g., "Easy").
   - Search by keyword (e.g., "Two Sum").
3. **Key Evaluator Observation:** Point out the **`Demonstration / MVP Seed`** badge next to demonstration problems. Explain that demonstration seeds are transparently labelled.

### Step 3: Practice Arena & AST Static Complexity Analysis
1. Click on **Solve IDE** for "Two Sum" (`/problems/two-sum`).
2. Point out problem description, constraints, and sample test cases.
3. Click the **AI Code Review** button in the header.
4. **Demonstrating the AST Complexity Engine:**
   - The modal calls the Python AST parser (`POST /api/ai/complexity`).
   - For standard loops, it accurately reports $O(N)$ or $O(N^2)$ with confidence and parser rules.
   - For non-linear or ambiguous code (e.g., slicing or dynamic recursion), point out that the system explicitly returns **"Heuristic Abstained"** rather than guessing an unverified complexity bound.

### Step 4: Socratic Hint Generator & Solution Leakage Guard
1. Scroll to the **Socratic 5-Stage Hints** drawer on the left.
2. Click **Reveal Tier 1 (Conceptual Clue)**:
   - Point out the **Leakage Guard Passed** badge with similarity score ($S_{combined} \le 0.80$).
   - Point out the research disclaimer explaining that syntactic similarity detection does not guarantee semantic safety.
3. Explain the cognitive progression: Level 1 (Concept) $\to$ Level 2 (Pattern) $\to$ Level 3 (Approach) $\to$ Level 4 (Blueprint) $\to$ Level 5 (Analysis).
4. Explain that if candidate hints exceed the $\tau = 0.80$ threshold, the **Solution Leakage Guard** automatically blocks the direct code spoiler and delivers a Socratic guiding question instead.

### Step 5: Sandboxed Code Execution & Mastery Scoring
1. In the Monaco editor, select Python and enter the optimal Two-Sum solution:
```python
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```
2. Click **Submit Solution**:
   - Code is sent to the isolated Judge0 runner (or shows honest sandbox container notification if offline).
   - Point out the **Topic Mastery Updated** card:
     $$M' = \text{clamp}(M + 8R - 2H + 3E - T, 0, 100)$$
     Optimal solve with 0 hints yields $+11.0$ points ($\Delta M = 8(1) - 2(0) + 3(1) - 0$).
   - Confetti triggers upon Accepted solve.

### Step 6: Personalized Prerequisite Roadmap (Kahn's Topological Sort)
1. Navigate to **Roadmap** in the navigation bar (`/roadmap`).
2. Point out the dynamically sequenced 16-node roadmap:
   - Topic order is determined by Kahn's algorithm prioritizing lowest mastery: $\text{priority} = (1 - M/100)$.
   - Click the **Prerequisite DAG Dependencies** toggle to view the structural graph table.
   - Explain the difference: Directed graph edges are hard prerequisite requirements; the linear timeline is the adaptive recommendation.
3. Click **Re-Adapt Roadmap** to demonstrate dynamic re-computation based on updated telemetry.

### Step 7: Revision Center (SuperMemo SM-2 Spaced Repetition)
1. Navigate to **Revision Center** (`/revision`).
2. Point out that the problem solved in Step 5 is now scheduled for active recall.
3. Demonstrate the self-rating buttons ($q \in [0, 5]$):
   - Click **5 - Perfect Recall**.
   - Show the confirmation toast: repetition interval advances from 1 day to 6 days ($I_1=1 \to I_2=6$) and Ease Factor increases to $2.60$.
   - Revisions queue displays the completion state when all daily items are done.

### Step 8: Multi-Factor Analytics & Predictive Solve Probability
1. Navigate to **Analytics** (`/analytics`).
2. Show that real charts now render (no longer empty):
   - **Topic Mastery Radar Chart:** Plots real mastery across topics.
   - **Weekly Problem Solve Velocity:** Shows accepted vs attempted submissions.
   - **Outcome Breakdown:** Distribution of Accepted vs Failed runs.
3. Scroll to **Predictive Solve Probability (Cold-Start Rule Heuristic)**:
   - Toggle between Easy, Medium, and Hard.
   - Show how the logistic prior formula calculates solve probability based on the learner's actual accuracy and hint history.
   - Point out the **Cold-Start Policy Disclosure**: Explains that synthetic ML models are not used for live predictions; supervised ML classifiers will be trained strictly on empirical pilot data.

---

## 3. Automated Verification Demonstration

To demonstrate complete codebase integrity during examination, run:

```powershell
# 1. Run Empirical Algorithm Benchmarks (all 5 core algorithms)
python scripts/evaluate_algorithms.py

# 2. Run Backend Unit, Integration & E2E Smoke Tests
cd backend
npm test

# 3. Run Python AI Microservice Tests
cd ../ai-service
python -m pytest tests
```
*Expected Result:* **256 / 256 Automated Tests Passing** (171 Pytest + 85 Jest) with 0 failures.

---

## 4. Pre-Seeded Evaluation Personas

Faculty evaluators can immediately log into any of these accounts without creating a new profile:

| Persona | Email | Password | Solves | Mastery Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@dsa-ai-guide.edu` | `AdminPass123!` | — | Platform metrics & oversight |
| **Instructor** | `dr.sharma@dsa-ai-guide.edu` | `InstructorPass123!` | — | Curriculum & Research Lead |
| **Beginner** | `aarav.sharma@student.dsa.edu` | `StudentPass123!` | 4 | Low mastery ($M \approx 25$), active linear structure roadmap |
| **Intermediate** | `vikram.malhotra@student.dsa.edu` | `StudentPass123!` | 18 | Solid fundamentals ($M \approx 65$), active trees/binary search |
| **Advanced** | `priya.venkatesh@student.dsa.edu` | `StudentPass123!` | 36 | High mastery ($M \approx 92$), advanced DP, Graphs, Heaps, 25-day streak |
| **Default** | `student@dsa-ai.guide` | `Password123!` | 15 | Balanced intermediate demo account |

