#!/usr/bin/env sh
set -eu
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
python3 "$ROOT/tools/doc-generator/generate_docs_inventory.py" --project-root "$ROOT"
