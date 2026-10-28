"""
Root proxy to run reproducible algorithm evaluation script.
"""
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI_SERVICE_DIR = os.path.join(ROOT_DIR, "ai-service")
AI_SCRIPT = os.path.join(AI_SERVICE_DIR, "scripts", "evaluate_algorithms.py")

if AI_SERVICE_DIR not in sys.path:
    sys.path.insert(0, AI_SERVICE_DIR)

if __name__ == "__main__":
    if os.path.exists(AI_SCRIPT):
        # Forward execution to ai-service script
        with open(AI_SCRIPT, "r", encoding="utf-8") as f:
            code = f.read()
        exec(compile(code, AI_SCRIPT, "exec"))
    else:
        print(f"Error: {AI_SCRIPT} not found.")
        sys.exit(1)
