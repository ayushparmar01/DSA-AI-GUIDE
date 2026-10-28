"""
Prerequisite DAG Roadmap Generator
Specified in IEEE Research Paper (Section 4.2) & Progress Report 03 (Section 11, M8).

Features:
- Validates prerequisite graph for:
    1. Unknown prerequisites
    2. Self-loops
    3. Directed cycles
- Generates personalized study roadmap via Kahn-style topological sort:
    Among currently available nodes (in-degree == 0), the topic with lowest mastery
    (priority = 1 - M/100) is placed first, with ties broken alphabetically.
- Verifies that no topic precedes any of its prerequisites.
"""

from typing import Dict, List, Set, Tuple, Optional
import heapq


DEFAULT_TOPIC_GRAPH: Dict[str, List[str]] = {
    "Complexity Analysis": [],
    "Arrays": ["Complexity Analysis"],
    "Recursion": ["Complexity Analysis"],
    "Linked Lists": ["Arrays"],
    "Stacks": ["Arrays"],
    "Queues": ["Stacks"],
    "Hashing": ["Arrays"],
    "Two Pointers": ["Arrays"],
    "Sliding Window": ["Arrays", "Two Pointers"],
    "Binary Search": ["Arrays", "Recursion"],
    "Trees": ["Recursion", "Queues"],
    "Binary Search Trees": ["Trees", "Binary Search"],
    "Heaps": ["Trees", "Arrays"],
    "Graphs": ["Trees", "Queues", "Hashing"],
    "Dynamic Programming": ["Recursion", "Arrays"],
    "Backtracking": ["Recursion", "Arrays"],
}


def validate_prerequisite_dag(graph: Dict[str, List[str]]) -> None:
    """
    Validates that graph is a well-formed Directed Acyclic Graph (DAG).
    Raises ValueError on unknown prerequisites, self-loops, or cycles.
    """
    if not isinstance(graph, dict):
        raise ValueError(f"Graph must be a dictionary, got {type(graph)}")

    all_nodes: Set[str] = set(graph.keys())

    # 1. Check self-loops and unknown prerequisites
    for node, prereqs in graph.items():
        if not isinstance(node, str) or not node.strip():
            raise ValueError(f"Invalid topic node identifier: {node}")
        if not isinstance(prereqs, list):
            raise ValueError(f"Prerequisites for '{node}' must be a list, got {type(prereqs)}")

        for prereq in prereqs:
            if prereq == node:
                raise ValueError(f"Self-loop detected: topic '{node}' cannot be a prerequisite of itself")
            if prereq not in all_nodes:
                raise ValueError(f"Unknown prerequisite '{prereq}' specified for topic '{node}'")

    # 2. Cycle detection using Kahn's in-degree check
    in_degree: Dict[str, int] = {node: len(set(prereqs)) for node, prereqs in graph.items()}
    # Adjacency list: prereq -> list of dependent topics
    dependents: Dict[str, List[str]] = {node: [] for node in all_nodes}
    for node, prereqs in graph.items():
        for prereq in set(prereqs):
            dependents[prereq].append(node)

    queue = [node for node, deg in in_degree.items() if deg == 0]
    visited_count = 0

    while queue:
        curr = queue.pop(0)
        visited_count += 1
        for dep in dependents[curr]:
            in_degree[dep] -= 1
            if in_degree[dep] == 0:
                queue.append(dep)

    if visited_count != len(all_nodes):
        unresolved = [node for node, deg in in_degree.items() if deg > 0]
        raise ValueError(f"Cycle detected in prerequisite graph; unresolved nodes: {unresolved}")


def generate_roadmap(
    graph: Optional[Dict[str, List[str]]] = None,
    mastery_scores: Optional[Dict[str, float]] = None,
) -> List[str]:
    """
    Generates a personalized roadmap using weighted Kahn topological sort.
    
    Priority rule:
        Among all currently available topics (in-degree == 0), select the one with
        highest priority = 1 - M/100 (i.e. lowest mastery M).
        Ties are broken alphabetically (ascending topic name).
    """
    if graph is None:
        graph = DEFAULT_TOPIC_GRAPH

    validate_prerequisite_dag(graph)

    if mastery_scores is None:
        mastery_scores = {}

    all_nodes = set(graph.keys())
    # Clean in-degree with de-duplicated prerequisites
    in_degree: Dict[str, int] = {node: len(set(graph[node])) for node in all_nodes}
    dependents: Dict[str, List[str]] = {node: [] for node in all_nodes}
    for node, prereqs in graph.items():
        for prereq in set(prereqs):
            dependents[prereq].append(node)

    # Priority queue item: (mastery, topic_name)
    # Lowest mastery comes first; on tie, alphabetically smaller topic name comes first.
    pq: List[Tuple[float, str]] = []
    for node, deg in in_degree.items():
        if deg == 0:
            m = float(mastery_scores.get(node, 0.0))
            heapq.heappush(pq, (m, node))

    roadmap: List[str] = []

    while pq:
        m, curr = heapq.heappop(pq)
        roadmap.append(curr)

        for dep in sorted(dependents[curr]):
            in_degree[dep] -= 1
            if in_degree[dep] == 0:
                dep_m = float(mastery_scores.get(dep, 0.0))
                heapq.heappush(pq, (dep_m, dep))

    if len(roadmap) != len(all_nodes):
        raise ValueError("Failed to generate complete roadmap: graph contains a cycle")

    return roadmap


def verify_prerequisites(roadmap: List[str], graph: Optional[Dict[str, List[str]]] = None) -> Tuple[bool, List[str]]:
    """
    Verifies that no topic precedes any of its declared prerequisites.
    Returns:
        (is_valid, list_of_violation_messages)
    """
    if graph is None:
        graph = DEFAULT_TOPIC_GRAPH

    seen_topics: Set[str] = set()
    violations: List[str] = []

    for topic in roadmap:
        prereqs = graph.get(topic, [])
        for prereq in prereqs:
            if prereq not in seen_topics:
                violations.append(
                    f"Prerequisite violation: Topic '{topic}' scheduled before prerequisite '{prereq}'"
                )
        seen_topics.add(topic)

    return (len(violations) == 0, violations)
