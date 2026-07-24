#!/usr/bin/env python3
"""
nojquery documentation auditor/generator helper.

Single source of truth:
    docs/assets/js/nojquery.core.js

The script:
- inventories public nj.* namespaces and direct APIs;
- inventories NJ wrapper methods;
- maps documentation pages through manifest.json;
- detects duplicate API ownership;
- checks missing API mentions;
- checks broken local links;
- writes api_inventory.json and documentation_status.json;
- selects the next undocumented namespace deterministically;
- exits non-zero when validation errors exist.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def match_balanced(text: str, start: int, opener: str = "{", closer: str = "}") -> int:
    depth = 0
    quote = None
    escape = False
    line_comment = False
    block_comment = False
    i = start
    while i < len(text):
        c = text[i]
        n = text[i + 1] if i + 1 < len(text) else ""
        if line_comment:
            if c == "\n":
                line_comment = False
            i += 1
            continue
        if block_comment:
            if c == "*" and n == "/":
                block_comment = False
                i += 2
                continue
            i += 1
            continue
        if quote:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == quote:
                quote = None
            i += 1
            continue
        if c == "/" and n == "/":
            line_comment = True
            i += 2
            continue
        if c == "/" and n == "*":
            block_comment = True
            i += 2
            continue
        if c in ("'", '"', "`"):
            quote = c
            i += 1
            continue
        if c == opener:
            depth += 1
        elif c == closer:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError(f"Unbalanced expression beginning at {start}")


def split_top_level_object_keys(body: str) -> list[str]:
    keys: list[str] = []
    segments: list[str] = []
    start = 0
    rd = sd = cd = 0
    quote = None
    escape = False
    for i, c in enumerate(body):
        if quote:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == quote:
                quote = None
            continue
        if c in ("'", '"', "`"):
            quote = c
            continue
        if c == "(":
            rd += 1
        elif c == ")":
            rd -= 1
        elif c == "[":
            sd += 1
        elif c == "]":
            sd -= 1
        elif c == "{":
            cd += 1
        elif c == "}":
            cd -= 1
        elif c == "," and rd == sd == cd == 0:
            segments.append(body[start:i].strip())
            start = i + 1
    tail = body[start:].strip()
    if tail:
        segments.append(tail)

    for segment in segments:
        m = re.match(r"(?:get\s+|set\s+)?([A-Za-z_$][\w$]*)\s*(?::|\()", segment)
        if m:
            keys.append(m.group(1))
            continue
        m = re.match(r"['\"]([^'\"]+)['\"]\s*:", segment)
        if m:
            keys.append(m.group(1))
    return keys


def extract_api(core: str) -> dict[str, Any]:
    class_start = core.index("class NJ")
    class_open = core.index("{", class_start)
    class_close = match_balanced(core, class_open)
    class_body = core[class_open + 1:class_close]

    wrapper = []
    for line in class_body.splitlines():
        if not re.match(r"^    \S", line):
            continue
        s = line.strip()
        m = re.match(r"get\s+([A-Za-z_$][\w$]*)\s*\(", s)
        if m:
            wrapper.append({"name": m.group(1), "kind": "getter"})
            continue
        if re.match(r"\[Symbol\.iterator\]\s*\(", s):
            wrapper.append({"name": "[Symbol.iterator]", "kind": "method"})
            continue
        m = re.match(r"([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{", s)
        if m and m.group(1) != "constructor":
            wrapper.append({
                "name": m.group(1),
                "kind": "method",
                "parameters": m.group(2).strip(),
            })

    namespaces: list[dict[str, Any]] = []
    direct: list[dict[str, Any]] = []
    aliases: list[dict[str, Any]] = []

    for m in re.finditer(r"\bnj\.([A-Za-z_$][\w$]*)\s*=\s*", core):
        name = m.group(1)
        value_start = m.end()
        line = core.count("\n", 0, m.start()) + 1
        if core.startswith("{", value_start):
            end = match_balanced(core, value_start)
            members = split_top_level_object_keys(core[value_start + 1:end])
            namespaces.append({"name": name, "members": members, "line": line})
            continue

        line_end = core.find("\n", value_start)
        if line_end < 0:
            line_end = len(core)
        expression = core[value_start:line_end].strip()
        kind = "property"
        if "=>" in expression or expression.startswith("function"):
            kind = "function"
        elif expression.startswith("new "):
            kind = "instance"
        elif re.match(r"nj\.", expression):
            kind = "alias"
            aliases.append({"name": name, "target": expression.rstrip(";"), "line": line})
        direct.append({"name": name, "kind": kind, "line": line, "expression": expression[:200]})

    # Methods created by loops in the AJAX section.
    dynamic = {
        "get": "(url, options={})",
        "delete": "(url, options={})",
        "head": "(url, options={})",
        "post": "(url, data, options={})",
        "put": "(url, data, options={})",
        "patch": "(url, data, options={})",
    }
    known = {x["name"] for x in direct}
    for name, signature in dynamic.items():
        if name not in known:
            direct.append({
                "name": name,
                "kind": "dynamic_function",
                "line": None,
                "expression": signature,
            })

    return {
        "wrapper_members": wrapper,
        "namespaces": sorted(namespaces, key=lambda x: x["line"]),
        "direct_statics": sorted(direct, key=lambda x: (x["line"] is None, x["line"] or 999999, x["name"])),
        "aliases": aliases,
    }


def local_link_exists(page: Path, href: str) -> bool:
    if href.startswith(("http://", "https://", "mailto:", "javascript:", "#")):
        return True
    target = href.split("#", 1)[0].split("?", 1)[0]
    if not target:
        return True
    return (page.parent / target).resolve().exists()


def token_present(raw: str, token: str) -> bool:
    return any(re.search(pattern, raw, re.I | re.S) for pattern in (
        rf"\bnj\.{re.escape(token)}\b",
        rf"\.{re.escape(token)}\s*\(",
        rf"\b{re.escape(token)}\s*\(",
        rf"<code[^>]*>.*?{re.escape(token)}.*?</code>",
    ))


def run(project_root: Path, fail_on_errors: bool = True) -> int:
    docs = project_root / "docs"
    tool_dir = project_root / "tools" / "doc-generator"
    manifest_path = tool_dir / "manifest.json"
    core_path = docs / "assets" / "js" / "nojquery.core.js"

    if not manifest_path.exists():
        print(f"ERROR: missing {manifest_path}", file=sys.stderr)
        return 2
    if not core_path.exists():
        print(f"ERROR: missing {core_path}", file=sys.stderr)
        return 2

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    core = core_path.read_text(encoding="utf-8", errors="replace")
    api = extract_api(core)

    namespaces = {x["name"]: x for x in api["namespaces"]}
    direct = {x["name"]: x for x in api["direct_statics"]}
    wrapper = {x["name"]: x for x in api["wrapper_members"]}
    aliases = {x["name"] for x in api["aliases"]}

    page_results = []
    owners: dict[str, list[str]] = {}
    invalid_mappings = []

    for item in manifest["pages"]:
        rel = item["page"]
        page = docs / rel
        raw = page.read_text(encoding="utf-8", errors="replace") if page.exists() else ""
        missing_mentions = []
        invalid = []

        for ns in item.get("namespaces", []):
            owners.setdefault(f"namespace:{ns}", []).append(rel)
            if ns not in namespaces:
                invalid.append(f"nj.{ns}")
            else:
                for member in namespaces[ns]["members"]:
                    if not token_present(raw, member):
                        missing_mentions.append(f"nj.{ns}.{member}")

        for name in item.get("statics", []):
            owners.setdefault(f"static:{name}", []).append(rel)
            if name not in direct and name not in namespaces:
                invalid.append(f"nj.{name}")
            elif page.exists() and not token_present(raw, name):
                missing_mentions.append(f"nj.{name}")

        for name in item.get("wrapper", []):
            owners.setdefault(f"wrapper:{name}", []).append(rel)
            if name not in wrapper:
                invalid.append(f"NJ.{name}")
            elif page.exists() and not token_present(raw, name):
                missing_mentions.append(f"NJ.{name}")

        if not page.exists():
            status = "missing_page"
        elif invalid:
            status = "invalid_mapping"
        elif missing_mentions:
            status = "partial"
        else:
            status = "complete"

        page_results.append({
            "page": rel,
            "status": status,
            "missing_api_mentions": sorted(set(missing_mentions)),
            "invalid_api_mappings": sorted(set(invalid)),
        })
        invalid_mappings.extend({"page": rel, "api": x} for x in invalid)

    duplicates = {key: pages for key, pages in owners.items() if len(pages) > 1}

    broken_links = []
    for page in docs.rglob("*.html"):
        raw = page.read_text(encoding="utf-8", errors="replace")
        for href in re.findall(r'href=["\']([^"\']+)["\']', raw, re.I):
            if not local_link_exists(page, href):
                broken_links.append({
                    "page": page.relative_to(docs).as_posix(),
                    "href": href,
                })

    documented_ns = {ns for item in manifest["pages"] for ns in item.get("namespaces", [])}
    documented_static = {x for item in manifest["pages"] for x in item.get("statics", [])}
    documented_wrapper = {x for item in manifest["pages"] for x in item.get("wrapper", [])}

    undocumented_ns = [x["name"] for x in api["namespaces"] if x["name"] not in documented_ns]
    undocumented_static = sorted(set(direct) - documented_static - aliases)
    undocumented_wrapper = sorted(set(wrapper) - documented_wrapper)

    priority = manifest.get("namespace_priority", [])
    candidates = [x for x in priority if x in undocumented_ns]
    candidates.extend(x for x in undocumented_ns if x not in candidates)
    next_namespace = candidates[0] if candidates else None

    errors = (
        len(duplicates)
        + len(invalid_mappings)
        + len(broken_links)
        + sum(x["status"] == "missing_page" for x in page_results)
    )

    inventory = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "core": {
            "path": "docs/assets/js/nojquery.core.js",
            "sha256": sha256(core_path),
            "size_bytes": core_path.stat().st_size,
        },
        "api": api,
    }
    status = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "validation": {
            "passed": errors == 0,
            "error_count": errors,
            "duplicate_api_owners": duplicates,
            "invalid_api_mappings": invalid_mappings,
            "broken_local_links": broken_links,
        },
        "pages": page_results,
        "undocumented": {
            "namespaces": undocumented_ns,
            "direct_statics_without_aliases": undocumented_static,
            "wrapper_members": undocumented_wrapper,
        },
        "next_documentation_candidate": {
            "kind": "namespace" if next_namespace else None,
            "name": next_namespace,
            "members": namespaces[next_namespace]["members"] if next_namespace else [],
        },
    }

    (tool_dir / "api_inventory.json").write_text(
        json.dumps(inventory, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (tool_dir / "documentation_status.json").write_text(
        json.dumps(status, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (tool_dir / "next_module.json").write_text(
        json.dumps(status["next_documentation_candidate"], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    with (tool_dir / "generator.log").open("a", encoding="utf-8") as log:
        log.write(
            f"{datetime.now(timezone.utc).isoformat()} "
            f"validation={'passed' if errors == 0 else 'failed'} "
            f"errors={errors} next={next_namespace}\n"
        )

    print(json.dumps({
        "validation_passed": errors == 0,
        "errors": errors,
        "pages": len(page_results),
        "undocumented_namespaces": undocumented_ns,
        "next_namespace": next_namespace,
    }, ensure_ascii=False, indent=2))

    return 1 if fail_on_errors and errors else 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--project-root",
        type=Path,
        default=Path(__file__).resolve().parents[2],
        help="Root containing docs/ and tools/",
    )
    parser.add_argument(
        "--report-only",
        action="store_true",
        help="Always exit zero after writing reports.",
    )
    args = parser.parse_args()
    return run(args.project_root.resolve(), fail_on_errors=not args.report_only)


if __name__ == "__main__":
    raise SystemExit(main())
