# 🚀 DSA AI Guide — Intelligent Adaptive DSA Learning Platform

> **A Research-Grounded, Deterministic-Mastery and Leakage-Guarded Tutoring Architecture** for Data Structures & Algorithms, specified in the IEEE-Style Research Paper (*Department of Computer Science & Engineering, GL Bajaj Group of Institutions, Mathura*).  
> **Authors:** Ayush Parmar, Himanshi Mittal | **Project Guide:** Er. Gopal

![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12%20%7C%203.13-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-009688.svg)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/React-18.x-cyan.svg)
![Tests](https://img.shields.io/badge/Tests-256%20Automated%20Passing%20(171%20Py%20%2B%2085%20Jest)-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-purple.svg)

---

## 📖 Academic Submission & Documentation Pack

Complete documentation according to IEEE research and institutional evaluation standards:

1. 🏛️ **[System Architecture](docs/SYSTEM_ARCHITECTURE.md)**: Layered topology, Mermaid data-flow diagrams, Judge0 execution isolation, and 8-collection Mongoose entity models.
2. 🔌 **[API Documentation](docs/API_DOCUMENTATION.md)**: Endpoints, request/response schemas, and curl examples for Backend (:5001) and AI Microservice (:8000).
3. 🧪 **[Test Report](docs/TEST_REPORT.md)**: Full breakdown of **241 passing automated tests** across Python and Node.js, and empirical benchmark reproduction.
4. 🛡️ **[Security Review](docs/SECURITY_REVIEW.md)**: 7-layer security audit, sandboxed code execution confirmation (zero local `eval()`/`exec()`), and data isolation checks.
5. 🎬 **[Demo Guide](docs/DEMO_GUIDE.md)**: Step-by-step scripted walkthrough for faculty evaluators, viva examinations, and project presentations.
6. ⚠️ **[Known Limitations](docs/KNOWN_LIMITATIONS.md)**: Transparent disclosure of algorithmic boundaries (semantic leakage limitation, AST abstentions, heuristic mastery nature).
7. 📋 **[Requirements Traceability](docs/REQUIREMENTS_TRACEABILITY.md)**: Traceability matrix mapping IEEE and Progress Report 03 specifications to verified test cases.
8. 📊 **[Implementation Status](docs/IMPLEMENTATION_STATUS.md)**: Feature-by-feature classification matrix across Phases 1, 2, 3, and 4.

---

## 🏛️ Monorepo Architecture

```
dsa-ai-guide/
├── ai-service/                         # Python 3 + FastAPI AI Microservice
│   ├── app/
│   │   ├── api/                        # REST routes & Pydantic schemas (/api/v1/)
│   │   ├── core/                       # 5 deterministic core algorithms
│   │   │   ├── mastery.py              # IEEE Eq. (1) mastery scoring engine
│   │   │   ├── roadmap.py              # 16-topic DAG & weighted Kahn topological sort
│   │   │   ├── sm2.py                  # SuperMemo SM-2 spaced repetition scheduler
│   │   │   ├── leakage.py              # Solution leakage guard (tau = 0.80)
│   │   │   └── complexity.py           # AST time-complexity heuristic v0/v1
│   │   ├── ml/                         # ML data generation & model training pipelines
│   │   ├── config.py                   # Environment configuration
│   │   └── main.py                     # FastAPI entry point (:8000)
│   ├── scripts/
│   │   └── evaluate_algorithms.py      # Reproducible empirical benchmark runner
│   ├── tests/                          # 171 pytest unit, integration, and API tests
│   ├── Dockerfile
│   ├── .env.example
│   └── requirements.txt
├── backend/                            # Node.js + Express REST API Gateway
│   ├── src/
│   │   ├── controllers/                # Problem, Submission, Revision, Roadmap, AI
│   │   ├── models/                     # 8 Mongoose collections (User, Problem, Attempt...)
│   │   ├── services/                   # Judge0 adapter, aiServiceClient, masteryService
│   │   ├── middleware/                 # JWT auth, rateLimiter, errorMiddleware, helmet
│   │   ├── routes/                     # Modular Express routes (/api/)
│   │   └── server.js                   # Express server entry point (:5001)
│   ├── tests/                          # 70 Jest tests (including e2e_smoke.test.js)
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/                           # React 18 + Vite Single Page Application
│   ├── src/
│   │   ├── components/                 # Monaco Editor, TestRunnerPanel, HintDrawer
│   │   ├── pages/                      # Dashboard, Problems, Practice, Roadmap, Revision, Analytics
│   │   ├── api/                        # Axios HTTP client with JWT interceptor
│   │   └── App.jsx                     # Route definitions & protected routes
│   ├── dist/                           # Production build output
│   ├── vercel.json                     # Vercel deployment configuration
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docs/                               # Academic Submission Pack
├── scripts/
│   └── evaluate_algorithms.py          # Root benchmark proxy
├── docker-compose.yml                  # Unified multi-service container definition
├── render.yaml                         # Render / Railway production specification
├── .env.example                        # Unified monorepo environment template
├── package.json                        # Workspaces configuration and top-level scripts
└── README.md                           # Master presentation document
```

---

## 🧪 Verified Test Results

### 1. Python Deterministic Core (`ai-service`): **171 / 171 PASS**
- **Mastery Engine (`test_mastery.py`):** 52 passed
- **Prerequisite Roadmap (`test_roadmap.py`):** 50 passed
- **SuperMemo SM-2 (`test_sm2.py`):** 17 passed
- **Leakage Guard (`test_leakage.py`):** 15 passed
- **Complexity Heuristic (`test_complexity.py`):** 10 passed
- **Integration Feedback Loop (`test_integration.py`):** 3 passed
- **Extended Boundaries (`test_additional_boundaries.py`):** 15 passed
- **FastAPI Endpoints (`test_api.py`):** 9 passed

### 2. Node.js Express Backend (`backend`): **70 / 70 PASS**
- **Full API Integration Suite (`tests/api.test.js`):** 25 passed
- **Complete Learner Journey E2E Smoke (`tests/e2e_smoke.test.js`):** 11 passed
- **Dedicated Judge0 Sandbox Adapter (`tests/judge0.test.js`):** 9 passed
- **Authentication & JWT Security (`tests/auth.test.js`):** 5 passed
- **AI Microservice Bridge Client (`tests/aiClient.test.js`):** 8 passed
- **Deterministic Mastery Service (`tests/mastery.test.js`):** 5 passed
- **Spaced Repetition Scheduler (`tests/sm2.test.js`):** 4 passed
- **Hybrid Recommendation Algorithm (`tests/recommendation.test.js`):** 3 passed

### 3. Frontend Production Build (`frontend`): **CLEAN BUILD**
- `npm run build` completed cleanly in **23.79s** (2416 modules transformed, zero syntax or JSX errors).

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- Python 3.10+ (tested on Python 3.12.5)
- Node.js 18+ and npm
- (Optional) Local MongoDB or MongoDB Atlas URI
- (Optional) Local Judge0 container or RapidAPI Judge0 credentials

### 1. Environment Configuration
Copy `.env.example` templates in each service directory:
```powershell
# In root
cp .env.example .env

# In backend
cd backend
cp .env.example .env

# In ai-service
cd ../ai-service
cp .env.example .env

# In frontend
cd ../frontend
cp .env.example .env
```

### 2. Install Dependencies
```powershell
# Python AI Microservice
cd ai-service
pip install -r requirements.txt

# Node.js Backend
cd ../backend
npm install

# React Frontend
cd ../frontend
npm install
```

### 3. Seed Comprehensive Demo Data
Run the deterministic seed script to populate 47 DSA problems across all 14 topics, 145 assessment questions (quizzes, assessments, and mocks), 18 demo users, and realistic attempt histories with mastery scores:
```powershell
cd backend
npm run seed
```

### 4. Launch Services

#### Terminal 1: Python AI Microservice
```powershell
cd ai-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Health check:* `http://localhost:8000/health` or `http://localhost:8000/docs`

#### Terminal 2: Node.js Express Backend
```powershell
cd backend
npm run dev
```
*Health check:* `http://localhost:5001/api/health`

#### Terminal 3: React Vite Client
```powershell
cd frontend
npm run dev
```
*Application URL:* `http://localhost:5173`

---

## 🔑 Demo Credentials Cheat Sheet

Development-only credentials pre-seeded for faculty presentation and viva examination:

| Role | Name | Email | Password | Tier / Description |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. Ramesh Rao | `admin@dsa-ai-guide.edu` | `AdminPass123!` | System Administration & Faculty Oversight |
| **Admin (Alt)** | Platform Admin | `admin@dsa-ai.guide` | `AdminSecret123!` | Default Platform Admin |
| **Instructor** | Dr. Ananya Sharma | `dr.sharma@dsa-ai-guide.edu` | `InstructorPass123!` | Lead Instructor, Dept. of CSE |
| **Instructor** | Prof. Rajesh Verma | `prof.verma@dsa-ai-guide.edu` | `InstructorPass123!` | Competitive Programming Lead |
| **Student** | Aarav Sharma | `aarav.sharma@student.dsa.edu` | `StudentPass123!` | **Beginner** (Streak: 3, Solves: 4, Low Mastery) |
| **Student** | Ananya Gupta | `ananya.gupta@student.dsa.edu` | `StudentPass123!` | **Beginner** (Streak: 4, Solves: 5) |
| **Student** | Rohan Mehta | `rohan.mehta@student.dsa.edu` | `StudentPass123!` | **Beginner** (Streak: 2, Solves: 4) |
| **Student** | Ishaan Verma | `ishaan.verma@student.dsa.edu` | `StudentPass123!` | **Beginner** (Streak: 1, Solves: 3) |
| **Student** | Diya Patel | `diya.patel@student.dsa.edu` | `StudentPass123!` | **Beginner** (Streak: 5, Solves: 5) |
| **Student** | Vikram Malhotra | `vikram.malhotra@student.dsa.edu` | `StudentPass123!` | **Intermediate** (Streak: 8, Solves: 18) |
| **Student** | Sneha Reddy | `sneha.reddy@student.dsa.edu` | `StudentPass123!` | **Intermediate** (Streak: 10, Solves: 20) |
| **Student** | Aditya Joshi | `aditya.joshi@student.dsa.edu` | `StudentPass123!` | **Intermediate** (Streak: 6, Solves: 16) |
| **Student** | Meera Nair | `meera.nair@student.dsa.edu` | `StudentPass123!` | **Intermediate** (Streak: 12, Solves: 22) |
| **Student** | Kabir Das | `kabir.das@student.dsa.edu` | `StudentPass123!` | **Intermediate** (Streak: 7, Solves: 15) |
| **Student** | Priya Venkatesh | `priya.venkatesh@student.dsa.edu` | `StudentPass123!` | **Advanced** (Streak: 25, Solves: 36, Rank #1) |
| **Student** | Arjun Kapoor | `arjun.kapoor@student.dsa.edu` | `StudentPass123!` | **Advanced** (Streak: 22, Solves: 34, Rank #2) |
| **Student** | Neha Singhal | `neha.singhal@student.dsa.edu` | `StudentPass123!` | **Advanced** (Streak: 18, Solves: 31, Rank #3) |
| **Student** | Siddharth Rao | `siddharth.rao@student.dsa.edu` | `StudentPass123!` | **Advanced** (Streak: 16, Solves: 29, Rank #4) |
| **Student** | Tanvi Bhatia | `tanvi.bhatia@student.dsa.edu` | `StudentPass123!` | **Advanced** (Streak: 15, Solves: 27, Rank #5) |
| **Student (Alt)**| Demo Student | `student@dsa-ai.guide` | `Password123!` | Default Student Account |

> **Security Note:** Passwords in MongoDB are securely hashed with bcrypt (salt rounds = 10). Plaintext passwords are strictly development/demo fixtures and never stored in the database. Production environments enforce strict TLS and environment-injected secret keys.

---

## 📊 Empirical Algorithm Benchmarks

Execute the reproducible evaluation script:
```powershell
python scripts/evaluate_algorithms.py
```
- **Deterministic Mastery Engine:** 100% reproduction of Table 2 delta values; confirms anomalies ($H \ge 6 \implies \Delta M < 0$).
- **Prerequisite DAG & Kahn Roadmap:** 0 prerequisite violations across 50 randomized stress trials (100% validity).
- **SM-2 Scheduler:** Interval expansion validated ($I_1=1, I_2=6, I_3=17, I_4=48$, $EF \ge 1.30$).
- **Solution Leakage Guard ($\tau=0.80$):** Precision 100.0%, Recall 83.33%, F1 90.91%. Confirms documented semantic weakness on equivalent rewrites (FN).
- **AST Time-Complexity:** 100% classification accuracy on supported constructs; 12.5% explicit abstention rate on hidden-cost expressions.

---

## 📄 License & Attribution

This project is authored by Ayush Parmar and Himanshi Mittal under the academic guidance of Er. Gopal at GL Bajaj Group of Institutions, Mathura. Released under the MIT License.
