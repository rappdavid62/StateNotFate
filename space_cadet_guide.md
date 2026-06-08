# Space Cadet Guide — State Not Fate

You are here.
It is okay if you do not remember.
We have cataloged your system, your workspace, and your files below so you don't have to carry the mental load.

---

## 1. Grounding / First Action
If you are feeling spaced out, overwhelmed, or unable to start:
* **The Floor Option:** Place both feet flat on the floor and stand up once.
* **The No-Debt Rule:** There is no catch-up debt. You do not need to read everything or remember what you did yesterday.
* **Action Beats Understanding:** One tiny action (even a 30-second transition) is proof of progress. 

---

## 2. Where Everything Is (System Map)

### 📂 Obsidian Vault (Your Brain Repository)
* **Location:** `C:\Users\rappd\OneDrive\Desktop\ObsidianVault`
* **Project Folder:** `STATENOTFATE`
* **What we did today:** We gathered all loose project files from your desktop backups and organized them into your Obsidian vault under the `STATENOTFATE` folder. This includes all project outlines, clinical preamble worksheets, canonical 5-year models, and intake questionnaires.

### 💻 Active Web Development Workspace
* **Location:** `C:\Users\rappd\OneDrive\Desktop\SNF_Deploy`
* **Git Repository:** [rappdavid62/StateNotFate](https://github.com/rappdavid62/StateNotFate)
* **Current Branch:** `SNF`
* **Status:** Clean and fully up to date with the remote repository. 
> [!NOTE]
> We fixed a corruption in the local Git database today by replacing missing object packfiles with a clean pull and restoring the files. The working tree is now 100% clean and correct.

### 🎥 Stabilizing Media & Knowledge Assets
* **Location:** `C:\Users\rappd\OneDrive\Desktop\SNF_Deploy\knowledge` (and backed up in `State_Not_Fate_Recovery\DOCS\knowledge`)
* **What it contains:** 8 stabilizing MP4 video guide files:
  1. `State,_Not_A_Fate.mp4` (~70 MB)
  2. `The_Broken_Firmware__A_Mechanical_Guide_to_Depression.mp4` (~46 MB)
  3. `The_Reprogramming_Protocol__Debugging_Depression.mp4` (~58 MB)
  4. `The_Depression_Project.mp4` (~58 MB)
  5. `The_Mechanics_of_State_vs.mp4` / `(1).mp4` (~46 MB each)
  6. `Developing_a_Clinical_Trial_Community_Outreach_Action_Plan.mp4` (~33 MB)
  7. `6_minute_synopsis.mp4` (~33 MB)

### 📦 Master Project Archive
* **Location:** `C:\Users\rappd\OneDrive\Desktop\depression project master`
* **Details:** This contains 7.3 GB of original source documents, including a massive 6.2 GB backup archive `OneDrive_2026-04-18.zip`.

---

## 3. What You Were Working On
You are building the **Polaris / Smart Welcome / Adaptive Recovery Profile** layer into the State Not Fate PWA.
* **Product Purpose:** Depression is treated as a temporary *current state* and execution system failure, not a permanent identity. The app helps bridge the execution gap by suggesting tiny, low-friction physical actions (anchors).
* **Smart Welcome Paths:** When a user enters, they are routed through one of four options:
  1. *Start Small* (Collapse mode/state selector)
  2. *Explore Full Program* (Open access, no locks)
  3. *Personalize More* (Adaptive Recovery Profile questionnaire)
  4. *Emergency Floor* (Safety/stabilization routing)

---

## 4. How to Resume Work (Quick Commands)
When you are ready to code or inspect the app, open PowerShell in the project directory:

```powershell
# 1. Navigate to the web deployment folder
cd C:\Users\rappd\OneDrive\Desktop\SNF_Deploy

# 2. Check current status
git status

# 3. Launch the local development server to test the PWA
npm run dev
```

Remember: **State, not fate.** Pausing is allowed. Progress never resets.

---

## 5. Integrated AI Prompts & Commands
If you are working with an AI assistant (Grok, Claude, ChatGPT, or Antigravity), use these short command codes. The details are documented in [universal_prompt_and_skill_library.md](file:///C:/Users/rappd/OneDrive/Desktop/ObsidianVault/STATENOTFATE/universal_prompt_and_skill_library.md):

*   **`/tp` — Thoroughness Protocol:** Forces the AI to stop, reality-check runway/energy, identify uncertainty, evaluate risks, and scale down the plan.
*   **`/council` — Strategic Decision:** Summons a panel of virtual experts to debate and recommend direct, blunt next actions.
*   **`/prs` — Peer Recovery Specialist:** Triggers clinical self-management tone and low-friction baseline biological flooring.
*   **`/tech` — Technical Operator:** Triggers checklists and procedural plans for HVAC, low-voltage, or field technician jobs.
*   **`/ops` — Logistics & Distribution:** Triggers warehouse, inventory, and logistics operations routing.
*   **`/coach` — Employment Coach:** Triggers resume tailoring, daily job search pipelines, and email/message drafting.

---

## 6. Keyboard Shortcuts Cheat-Sheet
Use these aligned shortcuts to speed up execution and reduce friction:

| Action | Obsidian | VS Code | Web PWA / Browser |
| :--- | :--- | :--- | :--- |
| **Global Search** | `Ctrl + Shift + F` | `Ctrl + Shift + F` | `Ctrl + Shift + F` (DevTools) |
| **Quick Open File** | `Ctrl + O` | `Ctrl + P` | `Ctrl + P` (Sources) |
| **New Note / File** | `Ctrl + N` | `Ctrl + N` | `Ctrl + T` (New Tab) |
| **Command Palette** | `Ctrl + P` (Command mode) | `Ctrl + Shift + P` | `F12` or `Ctrl + Shift + I` |
| **Close Active Tab** | `Ctrl + W` | `Ctrl + W` | `Ctrl + W` |
| **Focus Terminal** | N/A | `Ctrl + \`` | `Ctrl + \`` (Dev Server) |
| **PWA Sync/Refresh** | N/A | N/A | `Ctrl + F5` (Force Reload) |

