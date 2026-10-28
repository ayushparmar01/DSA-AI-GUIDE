# 🤖 AI System Architecture & Prompt Orchestration

## 1. Multi-Provider Layer

DSA AI Guide incorporates an abstract provider interface (`server/src/ai/aiProvider.js`) supporting:
- **Google Gemini API**: Native Google Generative AI REST endpoints with `gemini-1.5-flash` or `gemini-1.5-pro`.
- **OpenAI API**: Standard chat completions API with `gpt-4o` or `gpt-3.5-turbo`.
- **Intelligent Offline Mock Provider**: Zero-external dependency engine providing realistic, pedagogical JSON responses and code reviews so the application is completely testable offline.

## 2. Prevention of AI Hallucinations & Deterministic Separation

A core engineering principle of this platform is that **quantitative metrics are computed by deterministic backend algorithms, never by LLMs**:
- **Topic Mastery (0–100)**: Evaluated deterministically via closed-form weighted equation.
- **Spaced Repetition Intervals**: Computed using the SuperMemo SM-2 algorithm.
- **Recommendation Ranking**: Computed using a multi-variable scoring function.
- **Streak & XP**: Computed through transactional database increments.

The AI is exclusively utilized for qualitative pedagogical synthesis:
- Natural-language Socratic guidance and dialogue.
- Nuanced code reviews, code smell detection, and interview readiness feedback.
- Progressive graduated hint generation without solution spoiling.
- Mock interview roleplay simulation and conversational probing.

## 3. Token Economy & Rate Limiting

- **Structured JSON Schema Enforcement**: Forces LLMs to produce concise, parseable outputs without conversational preamble.
- **Sliding History Truncation**: Chat history is truncated to the last 6 turns to keep context windows compact.
- **Strict Rate Limiting**: Dedicated `aiLimiter` middleware protects external API credits and prevents DDoS attacks.
