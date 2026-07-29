#!/usr/bin/env python3
"""Render graphify-out/graph.json into its two viewable graphs.

graphify's own rebuild path (graphify.watch._rebuild_code) only writes graph.json
and GRAPH_REPORT.md -- it does not produce either visualisation. This script
takes the persisted graph and emits:

  1. graphify-out/graph.html            -- self-contained interactive graph (browser)
  2. graphify-out/obsidian/             -- Obsidian vault + graph.canvas

Community labels are derived from the dominant source directory of each
community, so the legend reads "src/components/sections" instead of
"Community 7". Deterministic, no LLM involved.

Usage: graphify-render.py [--html] [--obsidian] [--graph PATH] [--obsidian-dir DIR]
       (no target flag renders both)
"""
from __future__ import annotations

import argparse
import sys
from collections import Counter
from pathlib import Path


def community_labels(G, communities: dict[int, list[str]]) -> dict[int, str]:
    """Name each community after the directory most of its nodes come from."""
    labels: dict[int, str] = {}
    for cid, members in communities.items():
        dirs = Counter()
        for node in members:
            src = G.nodes[node].get("source_file") or ""
            if src:
                parent = str(Path(src).parent)
                dirs[parent if parent != "." else "(root)"] += 1
        if not dirs:
            labels[cid] = f"Community {cid}"
            continue
        top, count = dirs.most_common(1)[0]
        # Mixed community -> show the split rather than implying purity.
        labels[cid] = top if count == len(members) else f"{top} +{len(members) - count}"
    return labels


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--graph", default="graphify-out/graph.json")
    ap.add_argument("--obsidian-dir", default="graphify-out/obsidian")
    ap.add_argument("--html", action="store_true")
    ap.add_argument("--obsidian", action="store_true")
    args = ap.parse_args()

    # No explicit target => render both.
    want_html = args.html or not (args.html or args.obsidian)
    want_obsidian = args.obsidian or not (args.html or args.obsidian)

    graph_path = Path(args.graph)
    if not graph_path.exists():
        print(f"error: {graph_path} not found -- build the graph first", file=sys.stderr)
        return 1

    from graphify.cluster import score_all
    from graphify.export import to_canvas, to_html, to_obsidian
    from graphify.serve import _communities_from_graph, _load_graph

    G = _load_graph(str(graph_path))
    communities = _communities_from_graph(G)
    labels = community_labels(G, communities)

    print(f"graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, "
          f"{len(communities)} communities")

    if want_html:
        # to_html bails above 5000 nodes; say so rather than reporting a silent success.
        if G.number_of_nodes() > 5000:
            print(f"skip html: {G.number_of_nodes()} nodes exceeds the 5000-node viz limit")
        else:
            out = Path(graph_path).parent / "graph.html"
            to_html(G, communities, str(out), community_labels=labels)
            print(f"html:     {out}")

    if want_obsidian:
        obs = Path(args.obsidian_dir)
        obs.mkdir(parents=True, exist_ok=True)
        cohesion = score_all(G, communities)
        n = to_obsidian(G, communities, str(obs), community_labels=labels, cohesion=cohesion)
        to_canvas(G, communities, str(obs / "graph.canvas"), community_labels=labels)
        print(f"obsidian: {n} notes + graph.canvas in {obs}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
