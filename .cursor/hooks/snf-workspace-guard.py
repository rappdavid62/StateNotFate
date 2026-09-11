#!/usr/bin/env python3
from __future__ import annotations
import json, os, re, subprocess, sys
from pathlib import Path

ROOT = Path(r"C:\Users\rappd\OneDrive\Desktop\SNF_DEPLOY")
PROD_BRANCH = "SNF"

def emit(data: dict, code: int = 0):
    print(json.dumps(data, ensure_ascii=False))
    raise SystemExit(code)

def payload() -> dict:
    try:
        data = json.loads(sys.stdin.read() or "{}")
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}

def workspace(p: dict) -> Path:
    roots = p.get("workspace_roots") or []
    raw = roots[0] if roots else p.get("cwd") or os.getenv("CURSOR_PROJECT_DIR") or os.getcwd()
    return Path(str(raw).strip('"')).resolve()

def git(*args: str) -> str:
    r = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, timeout=8)
    return (r.stdout or r.stderr or "").strip()

def main():
    p = payload()
    event = str(p.get("hook_event_name") or "")
    ws = workspace(p)
    branch = git("branch", "--show-current") or "UNKNOWN"
    head = git("rev-parse", "--short", "HEAD") or "UNKNOWN"
    dirty = len([x for x in git("status", "--porcelain").splitlines() if x.strip()])
    root_ok = str(ws).casefold().startswith(str(ROOT).casefold())
    if event == "sessionStart":
        context = (
            f"SNF WORKSPACE IDENTITY: root={ws}; expected={ROOT}; root_match={root_ok}; "
            f"branch={branch}; production_branch={PROD_BRANCH}; head={head}; dirty={dirty}. "
            "Current branch may be used for development, but do not claim or mutate production unless production source is explicitly verified. "
            "Do not commit, push, merge, switch branches, deploy, reset, clean, or delete work without David's approval."
        )
        emit({"additional_context": context, "env": {"SNF_ROOT_MATCH": "1" if root_ok else "0", "SNF_BRANCH": branch}})
    command = str(p.get("command") or "")
    destructive = re.search(r"git\s+(clean|reset\s+--hard)|git\s+push\b.*(--force|-f\b)|Remove-Item\b.*-Recurse.*-Force|\brm\s+-rf\b", command, re.I)
    consequential = re.search(r"git\s+(commit|push|merge|rebase|checkout|switch|reset|clean)\b|netlify\s+deploy\b|npm\s+run\s+deploy\b", command, re.I)
    if destructive:
        emit({"permission":"deny","user_message":"Blocked destructive SNF command.","agent_message":"Use a non-destructive approach or obtain explicit authorization."}, 2)
    if consequential:
        emit({"permission":"ask","user_message":"This SNF command can change Git history/branch state or deployment state. Review before running.","agent_message":f"Workspace branch={branch}; production branch={PROD_BRANCH}."})
    emit({"permission":"allow"})

if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as exc:
        emit({"permission":"ask","user_message":"SNF workspace guard could not verify this command.","agent_message":type(exc).__name__})
