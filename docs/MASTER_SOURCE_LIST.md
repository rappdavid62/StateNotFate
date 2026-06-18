# State Not Fate Master Source List

Last updated: 2026-06-18

This is the working master source list for State Not Fate research, public-site evidence, knowledge-base updates, and automation carry-forward. It separates public web sources, project/internal sources, and automation-derived findings so future passes can grow breadth without losing source discipline.

## Public Site Checked

| Source | URL | Use in State Not Fate |
| --- | --- | --- |
| State Not Fate live root | https://statenotfate.netlify.app/ | Current hosted public/private boundary check. On 2026-06-18 the root was reachable and still exposed embedded beta dashboard text alongside public copy. |
| State Not Fate evidence page | https://statenotfate.netlify.app/evidence | Public evidence/source surface. Existing cards cite PubMed studies and categorize claim strength. |
| State Not Fate robots | https://statenotfate.netlify.app/robots.txt | Public indexing metadata check. |
| State Not Fate sitemap | https://statenotfate.netlify.app/sitemap.xml | Public route/indexing metadata check. |

## Official Clinical And Safety Sources

| Source | URL | Evidence role |
| --- | --- | --- |
| WHO depression fact sheet | https://www.who.int/news-room/fact-sheets/detail/depression | Supports depression as a common disorder affecting pleasure, energy, sleep, appetite, concentration, functioning, relationships, work/school, suicide risk, self-care, and effective treatments including behavioral activation, CBT, interpersonal therapy, and problem-solving therapy. |
| NICE NG222 depression recommendations | https://www.nice.org.uk/guidance/ng222/chapter/Recommendations | Supports comprehensive assessment beyond symptom count, functional/social impairment, lifestyle and living-condition context, suicide-risk assessment, relapse prevention, and stepped treatment choice. |
| VA/DoD MDD guideline hub | https://www.healthquality.va.gov/guidelines/MH/mdd/ | Source family for major depressive disorder management, measurement-based care, and clinical follow-up. |
| NIMH depression topic page | https://www.nimh.nih.gov/health/topics/depression | Public education source for depression symptoms, diagnosis, treatment, and help-seeking framing. |
| 988 Suicide and Crisis Lifeline | https://988lifeline.org/ | Public crisis resource. Confirms call, text, and chat access, free/confidential support, and 24/7/365 availability. |
| SAMHSA 988 page | https://www.samhsa.gov/mental-health/988 | US government 988 source and mental-health crisis-routing reference. |
| PHQ screeners | https://www.phqscreeners.com/ | Source family for PHQ/GAD screeners as concise self-administered mental-health tools used in clinical settings. |

## Research And Review Sources To Track

| Source | URL | Evidence role |
| --- | --- | --- |
| BMJ exercise and depression network meta-analysis | https://www.bmj.com/content/384/bmj-2023-075847 | Supports exercise as an evidence-aligned depression anchor; use cautiously and avoid overclaiming exact exercise prescriptions. |
| JAMA Psychiatry bright light therapy review | https://jamanetwork.com/journals/jamapsychiatry/fullarticle/2825659 | Supports bright light therapy as an adjunctive/circadian evidence lane; verify exact claims before quoting publicly. |

## Existing PubMed Evidence Cards On `evidence.html`

| PMID URL | Current evidence lane |
| --- | --- |
| https://pubmed.ncbi.nlm.nih.gov/42171809 | Behavioral activation / app-mediated depression support |
| https://pubmed.ncbi.nlm.nih.gov/42124392 | Smartphone CBT engagement and PHQ-9 symptom change |
| https://pubmed.ncbi.nlm.nih.gov/42025640 | Behavioral activation and bodily pain in lifetime MDD |
| https://pubmed.ncbi.nlm.nih.gov/41985751 | Imagery-enhanced behavioral activation |
| https://pubmed.ncbi.nlm.nih.gov/41951156 | Behavioral activation prevention meta-analysis |
| https://pubmed.ncbi.nlm.nih.gov/41853181 | Bright light therapy and sleep symptoms |
| https://pubmed.ncbi.nlm.nih.gov/41785919 | Bright light timing, anhedonia, and circadian rhythm |
| https://pubmed.ncbi.nlm.nih.gov/41756577 | Bright light therapy, cortisol rhythm, and metabolic markers |
| https://pubmed.ncbi.nlm.nih.gov/41284534 | Triple chronotherapy as an inpatient adjunct |
| https://pubmed.ncbi.nlm.nih.gov/42205348 | Shame, safeness/warmth memories, and mental health |
| https://pubmed.ncbi.nlm.nih.gov/42220893 | Case-level inference around shame/self-appraisal shifts |
| https://pubmed.ncbi.nlm.nih.gov/42234575 | Resilience-focused psychological interventions |
| https://pubmed.ncbi.nlm.nih.gov/42227754 | Experiential therapies, mindfulness, ACT, yoga, meditation |
| https://pubmed.ncbi.nlm.nih.gov/42181584 | mHealth psychosocial screening feasibility |
| https://pubmed.ncbi.nlm.nih.gov/42177443 | mHealth-supported home exercise delivery |
| https://pubmed.ncbi.nlm.nih.gov/42131188 | Digital CBT pilot safety |
| https://pubmed.ncbi.nlm.nih.gov/42126919 | User-centered digital mental-health intervention design |

## Internal Project Sources

| Source | Location | Role |
| --- | --- | --- |
| State Not Fate MOC | `docs/State-Not-Fate-MOC.md` | Current knowledge hub tying philosophy, PWA, AI coaching, Drive/Obsidian, and evidence. |
| Long-form intake | `docs/legitimate_preamble_and_150_item_intake.md` | Simulated/intake upgrade material: 150-item functional mapping intake with source basis and action prompts. |
| Public evidence page | `evidence.html` | Current live-source-card surface. |
| Evidence datasets | `pubmed_evidence.json`, `expanded_pubmed_evidence.json` | Machine-readable evidence inputs used to populate or expand evidence cards. |
| Front-end and app shell | `index.html`, `app.js`, `index.css` | Public page plus embedded beta app; currently the main public/private boundary risk. |
| Crisis and contact routes | `crisis.html`, `contact.html` | Public safety and contact surfaces. |

## Automation Sources To Reuse Before Each Pass

| Automation memory | What it adds |
| --- | --- |
| `C:\Users\rappd\.codex\automations\hourly-state-not-fate-site-health-check\memory.md` | Hosted-site public/private exposure history, Netlify/root checks, SEO drift, publish-root risk. |
| `C:\Users\rappd\.codex\automations\state-not-fate-buttons-and-links-qa\memory.md` | Public route/test pass history, PWA wiring gaps, target/rel issue on PubMed links, misleading CTA labels. |
| `C:\Users\rappd\.codex\automations\state-not-fate-persona-walkthrough\memory.md` | Persona walkthrough coverage, simulated intake/app-flow validation, safety surface coverage. |
| `C:\Users\rappd\.codex\automations\state-not-fate-obsidian-connection-check\memory.md` | Obsidian vault connection, current active vault paths, stale repo path references, missing `knowledge/` assets. |
| `C:\Users\rappd\.codex\automations\state-workspace-and-computer-readiness-check\memory.md` | Local toolchain/readiness, Playwright pass/fail status, hosted-probe caveats. |
| `C:\Users\rappd\.codex\automations\daily-node-js-environment-report\memory.md` | Current Node/npm/Playwright baseline and PowerShell `.cmd` command guidance. |
| `C:\Users\rappd\.codex\automations\daily-five-person-tech-council\memory.md` | Broader system-stack context: Obsidian, ChatGPT/Codex, NotebookLM, Google Drive, and n8n as the durable knowledge/execution stack. |

## Breadth Protocol For Future Passes

Each State Not Fate research or QA pass should add at least one new checked source or source lane, then record it here. Keep the pass bounded, but rotate the evidence lens:

1. Hosted public site: root, evidence page, crisis page, contact page, robots, sitemap.
2. Local test state: public Playwright suite, persona/intake walkthroughs, console errors, accessibility and SEO.
3. Knowledge base: MOC, intake docs, evidence JSON, Obsidian path drift, missing `knowledge/` assets.
4. Clinical source lane: WHO, NICE, VA/DoD, NIMH, PHQ, 988/SAMHSA.
5. Intervention lane: behavioral activation, CBT/IPT/problem-solving, exercise, sleep/circadian, light therapy, relapse prevention, social connection.
6. Digital safety lane: mHealth/digital-CBT safety, privacy, self-guided support boundaries, crisis escalation.
7. Project logic lane: energy tiers, MVD, restart fidelity, proof-based hope, ideal vs realistic, professional-care boundary.

## Current Update Proposals

- Public site: split the public marketing/evidence pages from the private beta dashboard shell so `Security Locked`, PIN setup, local OpenAI key UI, placeholder contacts, and Crisis Safe Box content are not emitted on the public root.
- Evidence page: add `rel="noopener noreferrer"` to PubMed links that use `target="_blank"`.
- Evidence page: add this master source list as an internal maintenance source and mirror a short public version later.
- Knowledge base: update stale vault references to the current active numbered Obsidian folders before relying on old `STATENOTFATE/`, `Human/`, `Tech/`, or `MOCS/` prose.
- Automation loop: start each pass by reading the automation memories above, then add one source-lane expansion instead of repeating the same checks only.

## Full Protocol Run Log - 2026-06-18 04:24 -04:00

### 1. Hosted Public Site

- Checked `https://statenotfate.netlify.app/` with the web fetcher.
- Root is reachable and starts with clear public copy: proof-based depression support, adjunctive-not-treatment boundary, and safety-first crisis guidance.
- Root still emits embedded private/beta app text in the public HTML: `Security Locked`, PIN setup, private recovery dashboard, Crisis Safe Box, PHQ-9 UI, local OpenAI API key UI, placeholder safe contact `Dave (555-0192)`, and `David or Dave`.
- Web fetcher did not return readable evidence/contact/crisis/robots/sitemap subroute bodies in this pass, so hosted subroute status should be rechecked with a browser or deploy-side Netlify verification.

### 2. Local Test And Static State

- Ran `npm.cmd run test:public -- --reporter=line --workers=1`.
- Result: 9 passed, 8 failed.
- Failure mode was local server lifecycle, not first-order assertion failure: after the first 9 tests passed, the remaining 8 failed with `page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/`.
- A focused `npx.cmd playwright test tests/public/presence-seo.spec.ts --reporter=line --workers=1` timed out while waiting on the same local server path.
- Direct `node scripts/static-server.mjs` printed `State Not Fate public test server running at http://127.0.0.1:4173`, showing the server can start in foreground, but a background helper run was blocked by the app approval policy.
- Static production URL check passed: `index.html`, `contact.html`, `crisis.html`, `evidence.html`, `robots.txt`, and `sitemap.xml` all point to `https://statenotfate.netlify.app/...` instead of localhost.
- Static issues still present: no `rel="manifest"` in `index.html`; `manifest.json` points to missing `./knowledge/neuroplasticity_abstract.png`; `app.js` still fetches `knowledge/openai-api-key.txt`; `netlify.toml` still contains `/knowledge/*` headers; `evidence.html` PubMed links use `target="_blank"` without `rel="noopener noreferrer"`; `index.html` still has `Exit to Safety` opening Google.

### 3. Knowledge Base And Obsidian

- Confirmed present: `docs/MASTER_SOURCE_LIST.md`, `docs/State-Not-Fate-MOC.md`, and `docs/legitimate_preamble_and_150_item_intake.md`.
- Confirmed absent in repo: `knowledge\`, `knowledge\neuroplasticity_abstract.png`, and `knowledge\openai-api-key.txt`.
- Live Obsidian vault exists with `.obsidian\core-plugins.json`, `.obsidian\community-plugins.json`, `.obsidian\workspace.json`, and `git-sync.ps1`.
- Core plugin support includes `backlink`, `outgoing-link`, `publish`, and `sync`.
- Community plugin support includes `omnisearch`, `templater-obsidian`, `dataview`, `obsidian-clipper`, and `obsidian-git`.
- Active vault folders exist: `01-PROJECTS\STATENOTFATE`, `07-HUMAN-HEALTH\Human`, `08-TECH-AND-AI\MOCS`, and `08-TECH-AND-AI\Obsidian Integration`.
- Drift persists: `ObsidianVault\STATENOTFATE\universal_prompt_and_skill_library.md` is missing, while `ObsidianVault\01-PROJECTS\STATENOTFATE\universal_prompt_and_skill_library.md` exists. `space_cadet_guide.md` still links to the missing old path.
- The MOC now links to `docs/MASTER_SOURCE_LIST.md`, but its older source-of-truth prose still names the outdated `STATENOTFATE/ + Human/ + Tech/ + MOCS/` layout.

### 4. Clinical Source Lane

- WHO depression fact sheet checked. Current WHO page is dated 2025-08-29 and supports depression as affecting pleasure, concentration, self-worth/guilt, hopelessness, suicide risk, sleep, appetite/weight, energy, and functioning at home, work, school, and community.
- NICE NG222 recommendations checked. NICE supports comprehensive assessment beyond symptom count, including functional/social difficulty, lifestyle, sleep, physical activity, stressful events, living conditions, employment, debt, loneliness, suicide risk, and relapse factors such as avoidance, rumination, residual symptoms, severe functional impairment, poverty, isolation, and unemployment.
- NIMH depression topic checked. NIMH frames depression as causing severe symptoms affecting feeling, thinking, and daily activities such as sleeping, eating, and working; it also links depression to suicidal thoughts/behaviors and directs crisis users to 988/911.
- PHQ Screeners checked. PHQ/GAD screeners are described as concise, self-administered tools field-tested in office practice for recognition and treatment facilitation.
- 988 Lifeline checked. 988 confirms call, text, and chat access, free/confidential conversations, and 24/7/365 availability.

### 5. Intervention Source Lane

- Behavioral activation remains the strongest direct intervention match for State Not Fate's action-before-motivation and restart logic, supported by WHO's listed effective psychological treatments and NICE treatment/relapse framework.
- Exercise/movement remains an evidence-aligned anchor, but public copy should avoid turning it into a cure claim. Keep it framed as one support among sleep, food, hydration, social contact, measurement, and professional care.
- Bright light/circadian support remains a plausible adjunctive lane, but exact lux/timing/remission claims should be verified against primary articles before being promoted on the public site.
- Relapse prevention is strongly supported by NICE and maps directly to restart speed, residual symptom monitoring, avoidance/rumination interruption, and maintenance reviews.

### 6. Digital Safety Lane

- Existing `evidence.html` includes mHealth/digital intervention PubMed cards. Keep these as feasibility/safety/support evidence, not proof that an AI app treats depression.
- Public safety boundary should stay explicit: State Not Fate is adjunctive, not diagnosis, treatment, emergency response, or a replacement for professional care.
- Public beta/private dashboard separation is the highest digital-safety issue because sensitive local app concepts are currently visible in public root HTML.

### 7. Project Logic Lane

- Project logic still coheres across sources: function over appearance, proof-based hope, restart fidelity, energy tiers, MVD, stabilization before expansion, and ideal-vs-realistic planning.
- The long-form 150-item intake adds useful breadth by mapping symptom burden, functional damage, cognition/rumination, circadian disruption, body state, avoidance, environment/admin friction, social shrinkage, treatment fit, and hope/agency.
- Next breadth lane recommendation: add a "clinical claim strength table" that maps every public claim to one of `Guideline-backed`, `Research-backed`, `Project inference`, `Hypothesis`, or `Personal/design philosophy`.

### Smallest Next Action

Split the public root from the private beta shell first. The current root is the public-facing safety risk because it exposes private-dashboard, PIN, OpenAI-key, placeholder contact, and Crisis Safe Box copy even though the top public copy is appropriately cautious.
