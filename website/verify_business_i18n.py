#!/usr/bin/env python3
"""Verify visible scenario copy has English mappings and graph parity."""

from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SCENARIO_FIELDS = ("name", "scope", "question", "deliver", "owner", "kpi")
GRAPH_DATA_PREFIX = "const kgData="
GRAPH_DATA_SUFFIX = ";\nfunction initKnowledgeMotion"
# Graph layouts may deliberately abbreviate untouched long labels. This batch changed
# these labels, so they must remain exactly aligned with their catalog source.
GRAPH_LAYOUT_PARITY_IDS = frozenset({"SP-01", "SP-02", "SP-03", "SP-04", "SP-05"})


def load_json(relative_path: str) -> object:
    return json.loads((ROOT / relative_path).read_text(encoding="utf-8"))


def load_graph_data() -> dict[str, object]:
    source = (ROOT / "src/app.js").read_text(encoding="utf-8")
    start = source.find(GRAPH_DATA_PREFIX)
    end = source.find(GRAPH_DATA_SUFFIX, start)
    if start < 0 or end < 0:
        raise ValueError("kgData JSON block is missing from src/app.js")
    graph = json.loads(source[start + len(GRAPH_DATA_PREFIX):end])
    if not isinstance(graph, dict) or not isinstance(graph.get("nodes"), list):
        raise ValueError("kgData.nodes must be an array")
    return graph


def main() -> int:
    business = load_json("src/data/business.json")
    english = load_json("src/data/en.json")
    if not isinstance(business, dict) or not isinstance(english, dict):
        print("business-i18n: expected JSON objects", file=sys.stderr)
        return 1

    scenarios = business.get("scenarios")
    if not isinstance(scenarios, list):
        print("business-i18n: scenarios must be an array", file=sys.stderr)
        return 1

    issues: list[str] = []
    try:
        graph = load_graph_data()
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"business-i18n: {error}", file=sys.stderr)
        return 1

    graph_nodes = {
        str(node["id"]): node
        for node in graph["nodes"]
        if isinstance(node, dict) and isinstance(node.get("id"), str)
    }

    for scenario in scenarios:
        if not isinstance(scenario, dict):
            issues.append("<invalid scenario object>")
            continue
        identifier = str(scenario.get("id", "<missing id>"))
        for field in SCENARIO_FIELDS:
            source = scenario.get(field)
            if not isinstance(source, str) or not source.strip():
                issues.append(f"{identifier}.{field}: missing source copy")
            elif not isinstance(english.get(source), str) or not english[source].strip():
                issues.append(f"{identifier}.{field}: missing English mapping for {source}")

        node = graph_nodes.get(identifier)
        if node is None:
            issues.append(f"{identifier}: missing kgData node")
            continue
        for field in SCENARIO_FIELDS:
            if node.get(field) != scenario.get(field):
                issues.append(f"{identifier}.{field}: business catalog and kgData differ")
        if node.get("label") != scenario.get("name"):
            issues.append(f"{identifier}.label: must match scenario name")
        if node.get("text") != scenario.get("question"):
            issues.append(f"{identifier}.text: must match scenario question")
        if identifier in GRAPH_LAYOUT_PARITY_IDS:
            for layout_name in ("desktop", "mobile"):
                layout = graph.get(layout_name)
                positions = layout.get("pos") if isinstance(layout, dict) else None
                position = positions.get(identifier) if isinstance(positions, dict) else None
                if not isinstance(position, dict):
                    issues.append(f"{identifier}: missing {layout_name} graph position")
                elif position.get("label") != scenario.get("name"):
                    issues.append(f"{identifier}.{layout_name}.label: must match scenario name")

    if issues:
        print("business-i18n: scenario integrity errors:", file=sys.stderr)
        print("\n".join(issues), file=sys.stderr)
        return 1

    print(f"business-i18n: {len(scenarios)} scenarios × {len(SCENARIO_FIELDS)} visible fields mapped and synchronized")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
