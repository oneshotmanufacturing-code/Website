#!/usr/bin/env bash
# Render and open both graphify graph views:
#   1. graph.html      - interactive force-directed graph, any browser
#   2. obsidian vault   - graph.canvas + one note per community, Obsidian app
#
# Usage: scripts/graphify-launch.sh [--no-render]
#   --no-render   skip regenerating graph.html/obsidian, just (re)open the existing ones

set -euo pipefail
cd "$(dirname "$0")/.."

GRAPH_JSON="graphify-out/graph.json"
HTML_OUT="graphify-out/graph.html"
OBSIDIAN_DIR="graphify-out/obsidian"

if [ ! -f "$GRAPH_JSON" ]; then
  echo "error: $GRAPH_JSON not found. Run /graphify . in Claude Code first to build the graph." >&2
  exit 1
fi

if [[ "${1:-}" != "--no-render" ]]; then
  echo "Rendering graph views from $GRAPH_JSON ..."
  PYTHON="python3"
  [ -f graphify-out/.graphify_python ] && PYTHON="$(cat graphify-out/.graphify_python)"
  "$PYTHON" scripts/graphify-render.py
fi

open_target() {
  local target="$1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$target" >/dev/null 2>&1 &
  elif command -v open >/dev/null 2>&1; then
    open "$target" >/dev/null 2>&1 &
  else
    echo "  (no opener found - open manually: $target)"
    return 1
  fi
}

echo
echo "1. Interactive HTML graph"
if [ -f "$HTML_OUT" ]; then
  echo "   $HTML_OUT"
  open_target "$(pwd)/$HTML_OUT" || true
else
  echo "   skipped (graph exceeds the 5000-node HTML limit - see scripts/graphify-render.py output)"
fi

echo
echo "2. Obsidian vault (community notes + graph.canvas)"
if [ -d "$OBSIDIAN_DIR" ]; then
  echo "   $OBSIDIAN_DIR"
  # obsidian:// URI opens the vault directly if the Obsidian app is installed;
  # silently no-ops otherwise, which is why the path above is also printed.
  VAULT_PATH="$(cd "$OBSIDIAN_DIR" && pwd)"
  open_target "obsidian://open?path=$VAULT_PATH" || true
  echo "   (if Obsidian didn't open, launch it manually and 'Open folder as vault' on the path above)"
else
  echo "   not found - re-run without --no-render to generate it"
fi
echo
