"""
Test Suite: Prerequisite DAG Roadmap Generator (50 tests)
Faithfully reproducing the 50 roadmap tests documented in the IEEE Research Paper (Section 6.1, 6.3).
"""

import pytest
from app.core.roadmap import (
    generate_roadmap,
    validate_prerequisite_dag,
    verify_prerequisites,
    DEFAULT_TOPIC_GRAPH,
)


class TestRoadmapValidation:
    """DAG validation tests: unknown prerequisites, self-loops, cycles, malformed structures."""

    def test_01_default_graph_validates(self):
        validate_prerequisite_dag(DEFAULT_TOPIC_GRAPH)

    def test_02_default_graph_has_16_topics(self):
        assert len(DEFAULT_TOPIC_GRAPH) == 16

    def test_03_default_graph_contains_expected_roots(self):
        assert DEFAULT_TOPIC_GRAPH["Complexity Analysis"] == []
        assert "Arrays" in DEFAULT_TOPIC_GRAPH
        assert "Recursion" in DEFAULT_TOPIC_GRAPH

    def test_04_unknown_prerequisite_rejected(self):
        graph = {"Arrays": ["NonExistentTopic"]}
        with pytest.raises(ValueError, match="Unknown prerequisite"):
            validate_prerequisite_dag(graph)

    def test_05_self_loop_rejected(self):
        graph = {"Recursion": ["Recursion"]}
        with pytest.raises(ValueError, match="Self-loop detected"):
            validate_prerequisite_dag(graph)

    def test_06_two_node_cycle_rejected(self):
        graph = {
            "Arrays": ["Recursion"],
            "Recursion": ["Arrays"],
        }
        with pytest.raises(ValueError, match="Cycle detected"):
            validate_prerequisite_dag(graph)

    def test_07_three_node_cycle_rejected(self):
        graph = {
            "A": ["C"],
            "B": ["A"],
            "C": ["B"],
        }
        with pytest.raises(ValueError, match="Cycle detected"):
            validate_prerequisite_dag(graph)

    def test_08_non_dict_rejected(self):
        with pytest.raises(ValueError, match="Graph must be a dictionary"):
            validate_prerequisite_dag(["Not", "A", "Dict"])

    def test_09_invalid_node_identifier_rejected(self):
        with pytest.raises(ValueError, match="Invalid topic node identifier"):
            validate_prerequisite_dag({"": []})

    def test_10_non_list_prerequisites_rejected(self):
        with pytest.raises(ValueError, match="must be a list"):
            validate_prerequisite_dag({"Arrays": "Complexity Analysis"})


class TestRoadmapSortingAndPriority:
    """Roadmap sequencing, lowest-mastery priority, and alphabetical tie-breaking."""

    def test_11_roadmap_length_matches_graph(self):
        roadmap = generate_roadmap()
        assert len(roadmap) == 16

    def test_12_complexity_analysis_is_first(self):
        roadmap = generate_roadmap()
        assert roadmap[0] == "Complexity Analysis"

    def test_13_default_roadmap_has_zero_violations(self):
        roadmap = generate_roadmap()
        is_valid, violations = verify_prerequisites(roadmap)
        assert is_valid is True
        assert len(violations) == 0

    def test_14_lowest_mastery_priority_arrays_over_recursion(self):
        # Arrays M=10, Recursion M=50 -> Arrays picked first
        mastery = {"Arrays": 10.0, "Recursion": 50.0}
        roadmap = generate_roadmap(mastery_scores=mastery)
        idx_arr = roadmap.index("Arrays")
        idx_rec = roadmap.index("Recursion")
        assert idx_arr < idx_rec

    def test_15_lowest_mastery_priority_recursion_over_arrays(self):
        # Recursion M=10, Arrays M=50 -> Recursion picked first
        mastery = {"Recursion": 10.0, "Arrays": 50.0}
        roadmap = generate_roadmap(mastery_scores=mastery)
        idx_arr = roadmap.index("Arrays")
        idx_rec = roadmap.index("Recursion")
        assert idx_rec < idx_arr

    def test_16_alphabetical_tie_break_at_mastery_zero(self):
        # Tied at M=0: 'Arrays' < 'Recursion'
        roadmap = generate_roadmap(mastery_scores={"Arrays": 0.0, "Recursion": 0.0})
        idx_arr = roadmap.index("Arrays")
        idx_rec = roadmap.index("Recursion")
        assert idx_arr < idx_rec

    def test_17_alphabetical_tie_break_at_mastery_fifty(self):
        roadmap = generate_roadmap(mastery_scores={"Arrays": 50.0, "Recursion": 50.0})
        idx_arr = roadmap.index("Arrays")
        idx_rec = roadmap.index("Recursion")
        assert idx_arr < idx_rec

    def test_18_prerequisite_dominates_low_mastery_dp(self):
        # DP has M=0, but cannot precede Arrays or Recursion
        mastery = {"Dynamic Programming": 0.0, "Arrays": 90.0, "Recursion": 90.0}
        roadmap = generate_roadmap(mastery_scores=mastery)
        idx_dp = roadmap.index("Dynamic Programming")
        idx_arr = roadmap.index("Arrays")
        idx_rec = roadmap.index("Recursion")
        assert idx_arr < idx_dp
        assert idx_rec < idx_dp

    def test_19_prerequisite_dominates_graphs(self):
        mastery = {"Graphs": 0.0, "Trees": 80.0, "Queues": 80.0, "Hashing": 80.0}
        roadmap = generate_roadmap(mastery_scores=mastery)
        idx_g = roadmap.index("Graphs")
        assert roadmap.index("Trees") < idx_g
        assert roadmap.index("Queues") < idx_g
        assert roadmap.index("Hashing") < idx_g

    def test_20_prerequisite_dominates_bst(self):
        mastery = {"Binary Search Trees": 0.0, "Trees": 90.0, "Binary Search": 90.0}
        roadmap = generate_roadmap(mastery_scores=mastery)
        idx_bst = roadmap.index("Binary Search Trees")
        assert roadmap.index("Trees") < idx_bst
        assert roadmap.index("Binary Search") < idx_bst

    def test_21_synopsis_example_path(self):
        # Once Recursion & Arrays completed, DP with M=0 is prioritized
        mastery = {"Dynamic Programming": 0.0, "Linked Lists": 80.0, "Stacks": 80.0}
        roadmap = generate_roadmap(mastery_scores=mastery)
        assert roadmap.index("Dynamic Programming") < roadmap.index("Linked Lists")


class TestRoadmapVerifier:
    """Tests for the prerequisite violation checker."""

    def test_22_valid_roadmap_passes(self):
        roadmap = generate_roadmap()
        valid, errs = verify_prerequisites(roadmap)
        assert valid is True
        assert errs == []

    def test_23_inverted_root_fails(self):
        # Placing Arrays before Complexity Analysis violates prereq
        bad = ["Arrays", "Complexity Analysis"] + [t for t in DEFAULT_TOPIC_GRAPH if t not in ("Arrays", "Complexity Analysis")]
        valid, errs = verify_prerequisites(bad)
        assert valid is False
        assert any("Complexity Analysis" in e for e in errs)

    def test_24_inverted_dp_fails(self):
        bad = ["Dynamic Programming", "Recursion", "Arrays", "Complexity Analysis"]
        valid, errs = verify_prerequisites(bad)
        assert valid is False
        assert len(errs) > 0


class TestRoadmapSyntheticGraphs:
    """Tests on synthetic topologies: empty, single, chain, diamond, star."""

    def test_25_empty_graph(self):
        assert generate_roadmap({}) == []

    def test_26_single_node(self):
        assert generate_roadmap({"A": []}) == ["A"]

    def test_27_linear_chain(self):
        graph = {"A": [], "B": ["A"], "C": ["B"], "D": ["C"], "E": ["D"]}
        roadmap = generate_roadmap(graph)
        assert roadmap == ["A", "B", "C", "D", "E"]

    def test_28_linear_chain_verifier_rejection(self):
        graph = {"A": [], "B": ["A"]}
        valid, errs = verify_prerequisites(["B", "A"], graph)
        assert valid is False

    def test_29_diamond_graph(self):
        graph = {"A": [], "B": ["A"], "C": ["A"], "D": ["B", "C"]}
        roadmap = generate_roadmap(graph)
        assert roadmap[0] == "A"
        assert roadmap[3] == "D"
        assert set(roadmap[1:3]) == {"B", "C"}

    def test_30_diamond_tie_breaking(self):
        graph = {"A": [], "B": ["A"], "C": ["A"], "D": ["B", "C"]}
        roadmap = generate_roadmap(graph, mastery_scores={"B": 0, "C": 0})
        # B < C alphabetically
        assert roadmap == ["A", "B", "C", "D"]

    def test_31_disconnected_components(self):
        graph = {"A1": [], "A2": ["A1"], "B1": [], "B2": ["B1"]}
        roadmap = generate_roadmap(graph, mastery_scores={"A1": 80, "B1": 10})
        assert roadmap[0] == "B1"

    def test_32_star_graph(self):
        graph = {"Center": []}
        for i in range(1, 10):
            graph[f"Leaf_{i}"] = ["Center"]
        roadmap = generate_roadmap(graph)
        assert roadmap[0] == "Center"
        assert len(roadmap) == 10

    def test_33_inverted_star_graph(self):
        graph = {"Sink": [f"Source_{i}" for i in range(1, 10)]}
        for i in range(1, 10):
            graph[f"Source_{i}"] = []
        roadmap = generate_roadmap(graph)
        assert roadmap[-1] == "Sink"
        assert len(roadmap) == 10


class TestRoadmapMasteryVariations:
    """15 tests running random/varied mastery score vectors to verify 0 violations."""

    @pytest.mark.parametrize("run_id,seed_shift", [(i, i * 7) for i in range(1, 16)])
    def test_random_mastery_vector(self, run_id, seed_shift):
        scores = {topic: (seed_shift * (idx + 1) * 13) % 101 for idx, topic in enumerate(DEFAULT_TOPIC_GRAPH)}
        roadmap = generate_roadmap(mastery_scores=scores)
        valid, errs = verify_prerequisites(roadmap)
        assert valid is True, f"Run {run_id} failed with violations: {errs}"
        assert len(roadmap) == 16


class TestRoadmapLargeAndDuplicates:
    """Stress and duplicate handling."""

    def test_49_duplicate_prerequisite_declarations(self):
        graph = {"A": [], "B": ["A", "A", "A"]}
        roadmap = generate_roadmap(graph)
        assert roadmap == ["A", "B"]

    def test_50_large_linear_chain_50_topics(self):
        graph = {f"T_{0}": []}
        for i in range(1, 50):
            graph[f"T_{i}"] = [f"T_{i-1}"]
        roadmap = generate_roadmap(graph)
        assert len(roadmap) == 50
        valid, errs = verify_prerequisites(roadmap, graph)
        assert valid is True
