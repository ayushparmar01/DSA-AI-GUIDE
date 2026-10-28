"""
Syntax-Based Solution Leakage Guard
Specified in IEEE Research Paper (Section 4.4, 6.5) & Progress Report 03 (Section 11, M9).

Design:
- Normalization Pipeline:
    1. Parse candidate hint and reference solution into Python AST.
    2. Remove docstrings and comments.
    3. Canonically rename user-defined identifiers (v0, v1, v2, ...) while preserving built-ins.
    4. Extract normalized token sequence and AST node-type sequence.
- Similarity Measures:
    - Token sequence similarity ratio (symmetrised difflib).
    - AST node-type sequence similarity ratio (symmetrised difflib).
    - Combined similarity = max(sim_token, sim_ast).
    - Raw text ratio as baseline.
- Exceptions & Edge Cases:
    - Inputs under 12 tokens are never flagged (short-input exception).
    - Unparsable code gracefully falls back to raw-text ratio.
    - Documented threshold tau = 0.80.
- Syntactic Limitation:
    Measures syntactic similarity only. Cannot detect algorithmically equivalent rewrites
    (mean similarity ~0.54 vs ~0.48 for different algorithms; 0/8 equivalent rewrites flagged).
"""

import ast
import difflib
import builtins
import re
from dataclasses import dataclass
from typing import List, Tuple, Set, Dict, Optional


PYTHON_BUILTINS: Set[str] = set(dir(builtins)) | {
    "self", "cls", "args", "kwargs", "True", "False", "None"
}


@dataclass(frozen=True)
class LeakageResult:
    is_leak: bool
    combined_similarity: float
    token_similarity: float
    ast_similarity: float
    raw_similarity: float
    token_count: int
    threshold: float
    used_fallback: bool
    is_short_input: bool
    explanation: str


class DocstringStripper(ast.NodeTransformer):
    """Removes docstrings from Module, ClassDef, and FunctionDef bodies."""
    def _strip_docstring(self, body: list) -> list:
        if body and isinstance(body[0], ast.Expr):
            val = getattr(body[0], 'value', None)
            if isinstance(val, ast.Constant) and isinstance(val.value, str):
                return body[1:]
        return body

    def visit_Module(self, node: ast.Module) -> ast.Module:
        self.generic_visit(node)
        node.body = self._strip_docstring(node.body)
        return node

    def visit_FunctionDef(self, node: ast.FunctionDef) -> ast.FunctionDef:
        self.generic_visit(node)
        node.body = self._strip_docstring(node.body)
        return node

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> ast.AsyncFunctionDef:
        self.generic_visit(node)
        node.body = self._strip_docstring(node.body)
        return node

    def visit_ClassDef(self, node: ast.ClassDef) -> ast.ClassDef:
        self.generic_visit(node)
        node.body = self._strip_docstring(node.body)
        return node


class CanonicalRenamer(ast.NodeTransformer):
    """
    Renames user identifiers to canonical names (v0, v1, v2...) in order of appearance.
    Preserves Python built-ins and standard keywords.
    """
    def __init__(self):
        self.mapping: Dict[str, str] = {}
        self.counter: int = 0

    def _get_canonical(self, name: str) -> str:
        if name in PYTHON_BUILTINS or name.startswith("__"):
            return name
        if name not in self.mapping:
            self.mapping[name] = f"v{self.counter}"
            self.counter += 1
        return self.mapping[name]

    def visit_Name(self, node: ast.Name) -> ast.Name:
        node.id = self._get_canonical(node.id)
        return node

    def visit_arg(self, node: ast.arg) -> ast.arg:
        node.arg = self._get_canonical(node.arg)
        return node

    def visit_FunctionDef(self, node: ast.FunctionDef) -> ast.FunctionDef:
        node.name = self._get_canonical(node.name)
        self.generic_visit(node)
        return node

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> ast.AsyncFunctionDef:
        node.name = self._get_canonical(node.name)
        self.generic_visit(node)
        return node

    def visit_ClassDef(self, node: ast.ClassDef) -> ast.ClassDef:
        node.name = self._get_canonical(node.name)
        self.generic_visit(node)
        return node


def tokenize_code(code: str) -> List[str]:
    """Tokenizes code into word/symbol tokens."""
    return re.findall(r'[a-zA-Z_]\w*|[0-9]+(?:\.[0-9]+)?|[^\s\w]', code)


def get_ast_node_sequence(tree: ast.AST) -> List[str]:
    """Extracts preorder sequence of AST node types."""
    sequence: List[str] = []
    for node in ast.walk(tree):
        sequence.append(type(node).__name__)
    return sequence


def normalize_code_ast(code: str) -> Tuple[Optional[str], Optional[List[str]], Optional[List[str]]]:
    """
    Normalizes code via AST: strips docstrings, renames identifiers canonically.
    Returns:
        (normalized_code_str, token_sequence, ast_node_types_sequence)
        or (None, None, None) on parse failure.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return (None, None, None)

    # 1. Remove docstrings
    stripper = DocstringStripper()
    tree = stripper.visit(tree)

    # 2. Canonical identifier renaming
    renamer = CanonicalRenamer()
    tree = renamer.visit(tree)
    ast.fix_missing_locations(tree)

    # 3. Normalized code and sequences
    try:
        norm_code = ast.unparse(tree)
    except Exception:
        norm_code = ""

    tokens = tokenize_code(norm_code)
    ast_nodes = get_ast_node_sequence(tree)
    return (norm_code, tokens, ast_nodes)


def check_solution_leakage(
    candidate_hint: str,
    reference_solution: str,
    threshold: float = 0.80,
    min_tokens: int = 12,
) -> LeakageResult:
    """
    Evaluates whether candidate hint leaks the reference solution using normalized AST
    and token similarity, adhering to the IEEE Paper specification.
    """
    raw_cand = candidate_hint.strip()
    raw_ref = reference_solution.strip()

    # Raw text ratio baseline
    raw_sim = difflib.SequenceMatcher(None, raw_cand, raw_ref).ratio()

    # Raw token count check for short-input exception
    raw_tokens = tokenize_code(raw_cand)
    token_count = len(raw_tokens)
    is_short = token_count < min_tokens

    # Attempt AST normalization
    norm_cand, cand_tokens, cand_ast = normalize_code_ast(raw_cand)
    norm_ref, ref_tokens, ref_ast = normalize_code_ast(raw_ref)

    used_fallback = False

    if norm_cand is None or norm_ref is None:
        # Fallback to raw text similarity on syntax error
        used_fallback = True
        tok_sim = raw_sim
        ast_sim = raw_sim
        combined_sim = raw_sim
    else:
        tok_sim = difflib.SequenceMatcher(None, cand_tokens, ref_tokens).ratio()
        ast_sim = difflib.SequenceMatcher(None, cand_ast, ref_ast).ratio()
        combined_sim = max(tok_sim, ast_sim)

    # Apply decision rule
    if is_short:
        is_leak = False
        explanation = f"Short input exception: token count ({token_count}) < {min_tokens}. Never flagged."
    elif combined_sim >= threshold:
        is_leak = True
        explanation = f"Potential solution leakage detected: combined similarity ({combined_sim:.4f}) >= threshold ({threshold})."
    else:
        is_leak = False
        explanation = f"Candidate hint permitted: combined similarity ({combined_sim:.4f}) < threshold ({threshold})."

    return LeakageResult(
        is_leak=is_leak,
        combined_similarity=round(combined_sim, 4),
        token_similarity=round(tok_sim, 4),
        ast_similarity=round(ast_sim, 4),
        raw_similarity=round(raw_sim, 4),
        token_count=token_count,
        threshold=threshold,
        used_fallback=used_fallback,
        is_short_input=is_short,
        explanation=explanation,
    )
