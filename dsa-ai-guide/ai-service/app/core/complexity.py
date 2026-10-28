"""
AST-Based Time-Complexity Heuristic Engine
Specified in IEEE Research Paper (Section 4.5, 6.6) & Progress Report 03 (Section 11, M5).

Heuristic Versions:
- v0: Basic draft rules based purely on maximum loop nesting depth and simple patterns:
    depth 0 -> O(1)
    depth 1 -> O(N)
    depth 2 -> O(N^2)
    depth >= 3 -> O(N^3)
- v1: Extended heuristic incorporating:
    - Halving loops (binary search, divide-and-conquer steps) -> O(log N) or O(N log N)
    - Python sorting invocations (sorted(), .sort()) -> adds O(N log N)
    - Recursive call graph branching (T(n) = 2T(n-1) -> O(2^N))
    - Explicit abstention when hidden-cost operations (slicing, list membership 'in', sum())
      make static loop-counting unconfident.
"""

import ast
from dataclasses import dataclass, field
from typing import List, Optional, Tuple, Set


COMPLEXITY_CLASSES = {
    "O(1)": 0,
    "O(log N)": 1,
    "O(N)": 2,
    "O(N log N)": 3,
    "O(N^2)": 4,
    "O(N^3)": 5,
    "O(2^N)": 6,
    "ABSTAIN": -1,
}


@dataclass(frozen=True)
class ComplexityResult:
    complexity: str
    version: str
    loop_depth: int
    has_halving_loop: bool
    has_sort: bool
    is_recursive: bool
    recursive_branch_factor: int
    hidden_costs: Tuple[str, ...]
    abstained: bool
    confidence: float
    explanation: str


class ComplexityVisitor(ast.NodeVisitor):
    """AST visitor extracting structural complexity indicators."""

    def __init__(self):
        self.max_loop_depth = 0
        self.current_loop_depth = 0
        self.has_halving_loop = False
        self.has_sort = False
        self.function_names: Set[str] = set()
        self.recursive_calls_per_function: dict = {}
        self.current_function: Optional[str] = None
        self.hidden_costs: List[str] = []
        self.has_while_halving = False

    def visit_FunctionDef(self, node: ast.FunctionDef):
        self.function_names.add(node.name)
        prev_fn = self.current_function
        self.current_function = node.name
        self.recursive_calls_per_function[node.name] = 0
        self.generic_visit(node)
        self.current_function = prev_fn

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef):
        self.visit_FunctionDef(node)

    def visit_Call(self, node: ast.Call):
        # 1. Sort calls: sorted(...) or x.sort(...)
        if isinstance(node.func, ast.Name) and node.func.id == "sorted":
            self.has_sort = True
        elif isinstance(node.func, ast.Attribute) and node.func.attr == "sort":
            self.has_sort = True

        # 2. Hidden cost: sum(...) inside a loop
        if self.current_loop_depth > 0:
            if isinstance(node.func, ast.Name) and node.func.id in ("sum", "max", "min"):
                self.hidden_costs.append(f"builtin_{node.func.id}_inside_loop")

        # 3. Recursion detection
        if self.current_function and isinstance(node.func, ast.Name):
            if node.func.id == self.current_function:
                self.recursive_calls_per_function[self.current_function] += 1

        self.generic_visit(node)

    def visit_Subscript(self, node: ast.Subscript):
        # Hidden cost: list slicing arr[1:] inside a loop
        if self.current_loop_depth > 0 and isinstance(node.slice, ast.Slice):
            self.hidden_costs.append("slicing_inside_loop")
        self.generic_visit(node)

    def visit_Compare(self, node: ast.Compare):
        # Hidden cost: linear search `x in lst` inside a loop or function
        for op in node.ops:
            if isinstance(op, (ast.In, ast.NotIn)):
                if self.current_loop_depth > 0:
                    self.hidden_costs.append("membership_in_inside_loop")
                else:
                    self.hidden_costs.append("membership_in_list")
        self.generic_visit(node)

    def visit_For(self, node: ast.For):
        self.current_loop_depth += 1
        if self.current_loop_depth > self.max_loop_depth:
            self.max_loop_depth = self.current_loop_depth
        self.generic_visit(node)
        self.current_loop_depth -= 1

    def visit_While(self, node: ast.While):
        self.current_loop_depth += 1
        if self.current_loop_depth > self.max_loop_depth:
            self.max_loop_depth = self.current_loop_depth

        # Inspect if while loop condition or body halves a variable
        if self._is_halving_while_loop(node):
            self.has_halving_loop = True

        self.generic_visit(node)
        self.current_loop_depth -= 1

    def _is_halving_while_loop(self, node: ast.While) -> bool:
        """Checks for floor division // 2, shift >>= 1, or binary search pointer updates."""
        for child in ast.walk(node):
            if isinstance(child, ast.AugAssign):
                if isinstance(child.op, (ast.FloorDiv, ast.RShift, ast.LShift, ast.Mult)):
                    return True
            elif isinstance(child, ast.Assign):
                for val in ast.walk(child.value):
                    if isinstance(val, ast.BinOp) and isinstance(val.op, (ast.FloorDiv, ast.RShift, ast.LShift, ast.Mult)):
                        return True
                    # mid = (low + high) // 2
                    if isinstance(val, ast.BinOp) and isinstance(val.op, ast.FloorDiv):
                        if isinstance(val.right, ast.Constant) and val.right.value == 2:
                            return True
        return False


def estimate_time_complexity(
    code: str,
    version: str = "v1",
    abstain_on_hidden_costs: bool = True,
) -> ComplexityResult:
    """
    Estimates algorithmic time complexity from Python AST.
    
    Args:
        code: Python source code snippet
        version: "v0" (draft loop-nesting rules) or "v1" (extended with halving, sort, recursion)
        abstain_on_hidden_costs: If True (default in v1), returns ABSTAIN when hidden costs
                                 (slicing, list membership 'in', sum) are detected.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return ComplexityResult(
            complexity="ABSTAIN",
            version=version,
            loop_depth=0,
            has_halving_loop=False,
            has_sort=False,
            is_recursive=False,
            recursive_branch_factor=0,
            hidden_costs=tuple(),
            abstained=True,
            confidence=0.0,
            explanation=f"Parse failure: {str(e)}",
        )

    visitor = ComplexityVisitor()
    visitor.visit(tree)

    max_rec_branches = max(visitor.recursive_calls_per_function.values(), default=0)
    is_recursive = max_rec_branches > 0
    hidden_costs_tuple = tuple(set(visitor.hidden_costs))

    # --- Heuristic v0: Draft nesting rules ---
    if version == "v0":
        if visitor.max_loop_depth == 0:
            comp = "O(1)"
        elif visitor.max_loop_depth == 1:
            comp = "O(N)"
        elif visitor.max_loop_depth == 2:
            comp = "O(N^2)"
        else:
            comp = "O(N^3)"

        return ComplexityResult(
            complexity=comp,
            version="v0",
            loop_depth=visitor.max_loop_depth,
            has_halving_loop=visitor.has_halving_loop,
            has_sort=visitor.has_sort,
            is_recursive=is_recursive,
            recursive_branch_factor=max_rec_branches,
            hidden_costs=hidden_costs_tuple,
            abstained=False,
            confidence=0.70,
            explanation=f"v0 loop nesting depth: {visitor.max_loop_depth}",
        )

    # --- Heuristic v1: Extended rules with explicit abstention ---
    # 1. Explicit abstention check on hidden costs
    if abstain_on_hidden_costs and len(hidden_costs_tuple) > 0:
        return ComplexityResult(
            complexity="ABSTAIN",
            version="v1",
            loop_depth=visitor.max_loop_depth,
            has_halving_loop=visitor.has_halving_loop,
            has_sort=visitor.has_sort,
            is_recursive=is_recursive,
            recursive_branch_factor=max_rec_branches,
            hidden_costs=hidden_costs_tuple,
            abstained=True,
            confidence=0.0,
            explanation=f"Abstention triggered by hidden-cost operations: {', '.join(hidden_costs_tuple)}",
        )

    # 2. Recursion analysis
    if is_recursive:
        if max_rec_branches >= 2:
            return ComplexityResult(
                complexity="O(2^N)",
                version="v1",
                loop_depth=visitor.max_loop_depth,
                has_halving_loop=visitor.has_halving_loop,
                has_sort=visitor.has_sort,
                is_recursive=True,
                recursive_branch_factor=max_rec_branches,
                hidden_costs=hidden_costs_tuple,
                abstained=False,
                confidence=0.85,
                explanation=f"Multiple recursive branch calls per frame ({max_rec_branches}) -> exponential O(2^N)",
            )
        elif visitor.has_halving_loop or visitor.has_while_halving:
            return ComplexityResult(
                complexity="O(log N)",
                version="v1",
                loop_depth=visitor.max_loop_depth,
                has_halving_loop=True,
                has_sort=visitor.has_sort,
                is_recursive=True,
                recursive_branch_factor=1,
                hidden_costs=hidden_costs_tuple,
                abstained=False,
                confidence=0.85,
                explanation="Divide-and-conquer single-branch recursion -> O(log N)",
            )
        else:
            return ComplexityResult(
                complexity="O(N)",
                version="v1",
                loop_depth=visitor.max_loop_depth,
                has_halving_loop=False,
                has_sort=visitor.has_sort,
                is_recursive=True,
                recursive_branch_factor=1,
                hidden_costs=hidden_costs_tuple,
                abstained=False,
                confidence=0.80,
                explanation="Linear single recursive descent -> O(N)",
            )

    # 3. Halving loops
    if visitor.has_halving_loop:
        if visitor.max_loop_depth == 1:
            comp = "O(log N)"
            explanation = "Single halving while loop -> O(log N)"
        elif visitor.max_loop_depth == 2:
            comp = "O(N log N)"
            explanation = "Halving loop nested with linear loop -> O(N log N)"
        else:
            comp = "ABSTAIN"
            explanation = "Deeply nested halving loop -> abstained"
            return ComplexityResult(
                complexity=comp,
                version="v1",
                loop_depth=visitor.max_loop_depth,
                has_halving_loop=True,
                has_sort=visitor.has_sort,
                is_recursive=False,
                recursive_branch_factor=0,
                hidden_costs=hidden_costs_tuple,
                abstained=True,
                confidence=0.0,
                explanation=explanation,
            )

        return ComplexityResult(
            complexity=comp,
            version="v1",
            loop_depth=visitor.max_loop_depth,
            has_halving_loop=True,
            has_sort=visitor.has_sort,
            is_recursive=False,
            recursive_branch_factor=0,
            hidden_costs=hidden_costs_tuple,
            abstained=False,
            confidence=0.85,
            explanation=explanation,
        )

    # 4. Sorting calls
    if visitor.has_sort:
        if visitor.max_loop_depth == 0:
            return ComplexityResult(
                complexity="O(N log N)",
                version="v1",
                loop_depth=0,
                has_halving_loop=False,
                has_sort=True,
                is_recursive=False,
                recursive_branch_factor=0,
                hidden_costs=hidden_costs_tuple,
                abstained=False,
                confidence=0.90,
                explanation="Sorting invocation without outer loops -> O(N log N)",
            )
        else:
            return ComplexityResult(
                complexity="ABSTAIN",
                version="v1",
                loop_depth=visitor.max_loop_depth,
                has_halving_loop=False,
                has_sort=True,
                is_recursive=False,
                recursive_branch_factor=0,
                hidden_costs=hidden_costs_tuple,
                abstained=True,
                confidence=0.0,
                explanation="Sort invocation inside loop structure -> abstained",
            )

    # 5. Standard loop depth
    if visitor.max_loop_depth == 0:
        comp = "O(1)"
        conf = 0.95
    elif visitor.max_loop_depth == 1:
        comp = "O(N)"
        conf = 0.90
    elif visitor.max_loop_depth == 2:
        comp = "O(N^2)"
        conf = 0.85
    elif visitor.max_loop_depth == 3:
        comp = "O(N^3)"
        conf = 0.80
    else:
        return ComplexityResult(
            complexity="ABSTAIN",
            version="v1",
            loop_depth=visitor.max_loop_depth,
            has_halving_loop=False,
            has_sort=False,
            is_recursive=False,
            recursive_branch_factor=0,
            hidden_costs=hidden_costs_tuple,
            abstained=True,
            confidence=0.0,
            explanation=f"Excessive loop depth ({visitor.max_loop_depth}) without bounds analysis -> abstained",
        )

    return ComplexityResult(
        complexity=comp,
        version="v1",
        loop_depth=visitor.max_loop_depth,
        has_halving_loop=False,
        has_sort=False,
        is_recursive=False,
        recursive_branch_factor=0,
        hidden_costs=hidden_costs_tuple,
        abstained=False,
        confidence=conf,
        explanation=f"Loop nesting depth: {visitor.max_loop_depth}",
    )
