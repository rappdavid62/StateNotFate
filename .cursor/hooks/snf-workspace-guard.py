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

def git(root: Path, *args: str) -> str:
    r = subprocess.run(["git", *args], cwd=root, capture_output=True, text=True, timeout=8)
    r.check_returncode()
    return r.stdout.strip()

def main():
    p = payload()
    event = str(p.get("hook_event_name") or "")
    ws = workspace(p)
    top = Path(git(ws, "rev-parse", "--show-toplevel")).resolve()
    origin = git(top, "remote", "get-url", "origin")
    trusted = re.fullmatch(r"(?:https://github\.com/|git@github\.com:|ssh://git@github\.com/)rappdavid62/StateNotFate(?:\.git)?/?", origin, re.I)
    root_ok = ws == top and bool(trusted) and (os.name != "nt" or top == ROOT.resolve())
    if not root_ok:
        if event == "sessionStart":
            emit({"additional_context": "SNF checkout identity mismatch. Stop before editing."})
        emit({"permission": "deny", "user_message": "SNF checkout identity mismatch."}, 2)
    branch = git(top, "branch", "--show-current") or "UNKNOWN"
    head = git(top, "rev-parse", "--short", "HEAD") or "UNKNOWN"
    dirty = len([x for x in git(top, "status", "--porcelain").splitlines() if x.strip()])

    if event == "sessionStart":
        context = (
            f"SNF WORKSPACE IDENTITY: root={ws}; git_root={top}; root_match={root_ok}; "
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
        emit({"permission":"deny","user_message":"SNF workspace guard could not verify this checkout.","agent_message":type(exc).__name__}, 2)
