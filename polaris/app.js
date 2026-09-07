// Polaris 25.x — State Not Fate PWA with Companion Evolution & Soothing Grounding
// Source of Truth: 09-PROMPTS/Library
// Premise: State is information. Depression is a temporary multi-system state. Proof is the corrective mechanism.

const VERSION = "25.x";

let state = {
  version: VERSION,
  energy: "medium",
  gamification: {
    level: 1,
    currentXP: 0,
    totalXP: 0,
    points: 0,
    comboCount: 0,
    tasksCompletedToday: 0,
    companion: {
      level: 1,
      name: "Polaris Beacon",
      evolved: false
    }
  },
  polaris: {
    enabled: true,
    proof: { total: 0, today: 0, ledger: [] },
    anchors: { active: [] },
    quests: { active: [] },
    streaks: { current: 0, longest: 0, missed: 0 },
    lastReset: null,
    lastActive: Date.now(),
    phq9History: [],
    systemsAudit: {},
    growth: {
      dimensions: { stability: 0, restart: 0, awareness: 0, anchoring: 0, continuity: 0 },
      chronicle: []
    }
  },
  lastEnergy: "medium",
  profile: {}
};

const RANKS = [
  { level: 1, title: "Substrate Initiate", minXP: 0 },
  { level: 2, title: "Floor Anchor", minXP: 100 },
  { level: 3, title: "Signal Collector", minXP: 250 },
  { level: 4, title: "Momentum Weaver", minXP: 450 },
  { level: 5, title: "State Architect", minXP: 700 },
  { level: 6, title: "Sovereign Navigator", minXP: 1000 }
];

function getLevelThreshold(lvl) {
  return Math.round(100 * Math.pow(lvl, 1.35));
}

function getRankTitle(lvl) {
  const match = [...RANKS].reverse().find(r => lvl >= r.level);
  return match ? match.title : `Sovereign Navigator (Lvl ${lvl})`;
}

// LOGARITHMIC COMPANION LEVELING FORMULA
function calculateCompanionLevel(points) {
  if (points <= 0) return 1;
  const rawLvl = 1 + Math.floor(Math.log(points / 12 + 1) / Math.log(1.65));
  return Math.min(10, Math.max(1, rawLvl));
}

const GAMIFIED_TASKS = [
  { id: "gt_stand", title: "Feet on Floor & Stand Up", cat: "Body", xp: 15, points: 10, skill: "mvd-anchors" },
  { id: "gt_water", title: "Hydrate & Meds Baseline", cat: "Body", xp: 15, points: 10, skill: "mvd-anchors" },
  { id: "gt_counter", title: "Speak Counter-Script Line", cat: "Mind", xp: 20, points: 15, skill: "sobriety-anchors" },
  { id: "gt_meditate", title: "1-Min Circadian Breathing", cat: "Mind", xp: 20, points: 15, skill: "circadian-anchors" },
  { id: "gt_proof", title: "Log 1 Visible Win as Proof", cat: "Substrate", xp: 25, points: 20, skill: "snf-proof-registration" },
  { id: "gt_hope", title: "Execute Tiny Hope Action", cat: "Substrate", xp: 25, points: 20, skill: "snf-hope-activation" },
  { id: "gt_job", title: "Job Search / Career Micro-Action", cat: "Skill", xp: 30, points: 25, skill: "daily-job-search" },
  { id: "gt_audit", title: "Run Substrate Systems Check", cat: "Substrate", xp: 30, points: 25, skill: "systems-audit" }
];

const SNF_SKILLS = {
  "sobriety-anchors": { name: "sobriety-anchors", desc: "Turn sobriety into daily anchors.", invocation: "Contact date. Counter-script. Log proof." },
  "snf-hope-activation": { name: "snf-hope-activation", desc: "Repair prediction error with small win.", invocation: "Action small enough + visible result." },
  "snf-proof-registration": { name: "snf-proof-registration", desc: "Register visible proof of effort.", invocation: "Log exact change. Say: Effort shapes substrate." },
  "mvd-anchors": { name: "mvd-anchors", desc: "Minimum Viable Day baseline floor.", invocation: "Define 2-4 tiny non-negotiables." },
  "floor-wins": { name: "floor-wins", desc: "Log smallest win on low/collapse days.", invocation: "Even standing up counts." },
  "library-gardener": { name: "library-gardener", desc: "Maintain system & skill health.", invocation: "Audit dictionary & sync skills." },
  "daily-job-search": { name: "daily-job-search", desc: "Focused low-friction job search.", invocation: "Save leads or update tracker." },
  "low-energy-execution": { name: "low-energy-execution", desc: "Shame-free plan on low days.", invocation: "MVD only. Protect floor." }
};

const PHQ9_INTERPS = {
  0: { label: "Minimal", color: "#5a9a5a", text: "Minimal or no depressive symptoms.", rec: "Maintain current anchors." },
  5: { label: "Mild", color: "#b39f4d", text: "Some difficult days but retaining partial function.", rec: "Monitor, reassess in 2 weeks." },
  10: { label: "Moderate", color: "#d97706", text: "Persistent low energy & focus difficulty.", rec: "Review treatment plan." },
  15: { label: "Moderately Severe", color: "#c2410c", text: "Daily tasks significantly harder.", rec: "Active treatment recommended." },
  20: { label: "Severe", color: "#9f1239", text: "Significant impairment in function.", rec: "Contact clinician or 988 if in crisis." }
};

// AUDIO SYNTHESIZER
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (!ctx) return;
    
    if (type === 'task') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'soothing') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz calming frequency
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } else if (type === 'levelup') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + (idx * 0.1);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    }
  } catch(e) {}
}

function loadState() {
  try {
    const saved = localStorage.getItem('snf_polaris_25');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
      if (!state.gamification) state.gamification = { level: 1, currentXP: 0, totalXP: 0, points: 0, comboCount: 0, tasksCompletedToday: 0, companion: { level: 1, name: "Polaris Beacon", evolved: false } };
      if (!state.polaris.proof) state.polaris.proof = { total: 0, today: 0, ledger: [] };
      if (!state.polaris.anchors) state.polaris.anchors = { active: [] };
      if (!state.polaris.quests) state.polaris.quests = { active: [] };
      if (!state.polaris.streaks) state.polaris.streaks = { current: 0, longest: 0, missed: 0 };
    }
  } catch (e) {}
  updateLastActiveDisplay();
}

function saveState() {
  try {
    localStorage.setItem('snf_polaris_25', JSON.stringify(state));
  } catch (e) {}
}

function addXP(xpAmount, pointsAmount = 10, source = "Action") {
  const g = state.gamification;
  const multiplier = g.tasksCompletedToday >= 3 ? 1.5 : 1.0;
  const gainedXP = Math.round(xpAmount * multiplier);
  
  g.currentXP += gainedXP;
  g.totalXP += gainedXP;
  g.points += pointsAmount;
  g.tasksCompletedToday += 1;
  
  playSound('task');
  
  const prevCompLvl = g.companion ? g.companion.level : 1;
  const newCompLvl = calculateCompanionLevel(g.points);
  
  if (!g.companion) g.companion = { level: 1, name: "Polaris Beacon", evolved: false };
  g.companion.level = newCompLvl;
  
  if (newCompLvl >= 10 && !g.companion.evolved) {
    g.companion.evolved = true;
    g.companion.name = "Resilient Aegis Sentinel";
    showToast("🛡️ COMPANION EVOLVED! Level 10 reached: Aegis Sentinel status unlocked!", "success");
    playSound('levelup');
  } else if (newCompLvl > prevCompLvl) {
    showToast(`💫 Companion leveled up to LVL ${newCompLvl}!`, "info");
  }

  const currentReq = getLevelThreshold(g.level);
  let leveledUp = false;
  
  if (g.currentXP >= currentReq) {
    g.currentXP -= currentReq;
    g.level += 1;
    leveledUp = true;
  }
  
  renderLevelHUD();
  renderCompanionWidget();
  saveState();
  
  if (leveledUp) {
    triggerLevelUpModal(g.level);
  } else {
    showToast(`+${gainedXP} XP (${source}) • ⚡ +${pointsAmount} Points`, "success");
  }
}

function getCompanionPointsReq(lvl) {
  if (lvl <= 1) return 0;
  return Math.round(12 * (Math.pow(1.65, lvl - 1) - 1));
}

function renderCompanionWidget() {
  const g = state.gamification;
  const comp = g.companion || { level: 1, name: "Polaris Beacon", evolved: false };
  const energy = state.energy || "medium";
  
  const avatarEl = document.getElementById('companion-avatar');
  const titleEl = document.getElementById('companion-name-title');
  const textEl = document.getElementById('companion-dialogue-text');
  const xpLabelEl = document.getElementById('companion-xp-label');
  const xpFillEl = document.getElementById('companion-xp-fill');

  // Companion progress bar
  const curReq = getCompanionPointsReq(comp.level);
  const nextReq = getCompanionPointsReq(comp.level + 1);
  const ptsInLvl = Math.max(0, g.points - curReq);
  const lvlSpan = Math.max(1, nextReq - curReq);
  const pct = comp.level >= 10 ? 100 : Math.min(100, Math.round((ptsInLvl / lvlSpan) * 100));

  if (xpLabelEl) {
    if (comp.level >= 10) xpLabelEl.textContent = `MAX EVOLUTION (⚡ ${g.points} Pts)`;
    else xpLabelEl.textContent = `${g.points} / ${nextReq} Pts to Lvl ${comp.level + 1}`;
  }
  if (xpFillEl) xpFillEl.style.width = `${pct}%`;

  // State-aware dynamic dialogue
  let dialogue = "";
  if (comp.evolved || comp.level >= 10) {
    if (energy === "collapse") dialogue = `"Shields up. Feet on the floor. I'm right here with you. We hold the line through total fog."`;
    else if (energy === "low") dialogue = `"Resilience Aegis active. Low energy state detected. One floor anchor updates the substrate."`;
    else dialogue = `"I have evolved alongside your resilience. We hold the line together. Small actions shape the substrate."`;
    
    if (avatarEl) { avatarEl.textContent = '🛡️'; avatarEl.classList.add('evolved'); }
    if (titleEl) { titleEl.innerHTML = `Resilient Aegis Sentinel <span style="font-size:12px;color:var(--gold);font-weight:bold">(LVL 10 EVOLVED)</span>`; titleEl.classList.add('evolved'); }
  } else {
    if (energy === "collapse") dialogue = `"Feet on the floor. I'm right here with you. Zero pressure. Even standing up or resting is valid data."`;
    else if (energy === "low") dialogue = `"Low energy state detected. Protect the floor. Drink water or take 3 deep breaths. Every tiny proof counts."`;
    else if (energy === "medium") dialogue = `"Functional state active. Small actions build momentum without overload. Ready for a circadian or meditation reset?"`;
    else dialogue = `"High momentum! Let me help you stay anchored while you conquer today's goals."`;
    
    if (avatarEl) { avatarEl.textContent = '💫'; avatarEl.classList.remove('evolved'); }
    if (titleEl) { titleEl.innerHTML = `Polaris Companion <span style="font-size:12px;color:var(--cyan);font-weight:normal">(LVL ${comp.level} • Beacon)</span>`; titleEl.classList.remove('evolved'); }
  }
  if (textEl) textEl.textContent = dialogue;
}

function triggerMicroHabit(type) {
  if (type === 'meditation') {
    addXP(15, 15, "1-Min Meditation");
    playSound('soothing');
    showToast("🧘 Meditation registered. Autonomic state soothing activated.");
  } else if (type === 'circadian') {
    addXP(15, 15, "Morning Light Anchor");
    playSound('soothing');
    showToast("☀️ Circadian light anchor logged. Substrate rhythm aligned.");
  } else if (type === 'water') {
    addXP(10, 10, "Hydration Anchor");
    showToast("💧 Hydration proof registered.");
  } else if (type === 'counter') {
    addXP(20, 15, "Counter-Script Shield");
    playSound('soothing');
    showToast("🛡️ Counter-script spoken: 'This is a state, not a fate.'");
  }
}

function openCompanionTreeModal() {
  const modal = document.getElementById('companion-tree-modal');
  if (modal) modal.style.display = 'flex';
}

function closeCompanionTreeModal() {
  const modal = document.getElementById('companion-tree-modal');
  if (modal) modal.style.display = 'none';
}

function openSoothingModal() {
  const modal = document.getElementById('soothing-modal');
  if (modal) modal.style.display = 'flex';
  playSoothingTone();
}

function closeSoothingModal() {
  const modal = document.getElementById('soothing-modal');
  if (modal) modal.style.display = 'none';
  addXP(15, 10, "Soothing Grounding Invocation");
}

function playSoothingTone() {
  playSound('soothing');
  showToast("🔊 432Hz Calming Frequency active.", "info");
}

function selectSoothingAnchor(name) {
  const textEl = document.getElementById('soothing-guidance-text');
  if (textEl) textEl.textContent = `Anchor active: ${name}. Focus on your breath... State is data. Effort shapes substrate.`;
  playSound('soothing');
}

function triggerLevelUpModal(lvl) {
  playSound('levelup');
  const title = getRankTitle(lvl);
  const modal = document.getElementById('level-modal');
  const modalTitle = document.getElementById('modal-level-title');
  const modalRank = document.getElementById('modal-rank-title');
  const modalDesc = document.getElementById('modal-level-desc');
  
  if (modalTitle) modalTitle.textContent = `LEVEL UP! (LVL ${lvl})`;
  if (modalRank) modalRank.textContent = `Rank Unlocked: ${title}`;
  if (modalDesc) modalDesc.textContent = `Your registered proof signals updated the substrate! You reached Level ${lvl} (${title}). Keep making low-friction proof moves!`;
  
  if (modal) modal.style.display = 'flex';
}

function closeLevelModal() {
  const modal = document.getElementById('level-modal');
  if (modal) modal.style.display = 'none';
}

function renderLevelHUD() {
  const g = state.gamification;
  const badge = document.getElementById('hud-level-badge');
  const title = document.getElementById('hud-level-title');
  const combo = document.getElementById('hud-combo-status');
  const points = document.getElementById('hud-points-count');
  const xpText = document.getElementById('hud-xp-text');
  const xpFill = document.getElementById('hud-xp-fill');
  
  const reqXP = getLevelThreshold(g.level);
  const pct = Math.min(100, Math.round((g.currentXP / reqXP) * 100));
  
  if (badge) badge.textContent = `LVL ${g.level}`;
  if (title) title.textContent = getRankTitle(g.level);
  if (points) points.textContent = g.points;
  if (xpText) xpText.textContent = `${g.currentXP} / ${reqXP} XP`;
  if (xpFill) xpFill.style.width = `${pct}%`;
  
  if (combo) {
    if (g.tasksCompletedToday >= 3) {
      combo.textContent = `Combo Multiplier: 1.5x 🔥 (${g.tasksCompletedToday} tasks today)`;
    } else {
      combo.textContent = `Combo Multiplier: 1.0x (${3 - g.tasksCompletedToday} more for 1.5x boost)`;
    }
  }
}

function renderGamifiedTasks() {
  const grid = document.getElementById('gamified-task-grid');
  if (!grid) return;
  
  grid.innerHTML = GAMIFIED_TASKS.map((t, i) => `
    <div class="task-card" id="gt-card-${t.id}">
      <input type="checkbox" class="task-checkbox" onchange="completeGamifiedTask('${t.id}', ${t.xp}, ${t.points}, '${t.title}', '${t.skill}', this)">
      <div class="task-content">
        <div class="task-title">${t.title}</div>
        <div class="task-meta">
          <span class="badge-cat">${t.cat}</span>
          <span class="badge-xp">+${t.xp} XP</span>
          <span class="badge-points">+${t.points} Pts</span>
          <span class="small" style="color:var(--text-dim)">from ${t.skill}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function completeGamifiedTask(id, xp, points, title, skill, checkbox) {
  if (checkbox.checked) {
    checkbox.disabled = true;
    const card = document.getElementById(`gt-card-${id}`);
    if (card) card.classList.add('completed');
    
    state.polaris.proof.today = (state.polaris.proof.today || 0) + 1;
    state.polaris.proof.total = (state.polaris.proof.total || 0) + 1;
    state.polaris.proof.ledger.push({ ts: Date.now(), text: title, skill, energy: state.energy });
    
    addXP(xp, points, title);
    updateProofDisplay();
    renderResilienceMeter();
  }
}

function setEnergy(level) {
  state.energy = level;
  state.lastEnergy = level;
  document.querySelectorAll('.energy-option').forEach(el => el.classList.remove('active'));
  const activeEl = [...document.querySelectorAll('.energy-option')].find(el => el.textContent.toLowerCase() === level);
  if (activeEl) activeEl.classList.add('active');
  renderPolarisPlan();
  renderAnchors();
  renderQuests();
  renderResilienceMeter();
  saveState();
  showToast(`Energy set to ${level}.`, "info");
}

function renderPolarisPlan() {
  const container = document.getElementById('polaris-plan');
  if (!container) return;
  const e = state.energy;
  let text = "";
  if (e === "high") text = "High energy. Full anchors + expansion tasks. Register proof for maximum XP!";
  else if (e === "medium") text = "Functional. Standard anchors + adaptive quests. One proof-generating task.";
  else if (e === "low") text = "Low energy. MVD only. Small actions still earn full XP. No shame.";
  else text = "Collapse. Absolute floor only. Feet on floor. Log Floor Win. You belong here.";

  container.innerHTML = `<strong>Plan (${e}) — State is information. Proof updates substrate:</strong><br>${text}`;
}

function getEnergyAnchors(energy) {
  const base = [
    { id: "feet", text: "Feet on floor + stand once", skill: "mvd-anchors", xp: 15 },
    { id: "water", text: "Drink water or take meds if due", skill: "mvd-anchors", xp: 15 }
  ];
  if (energy === "collapse") {
    return [...base, { id: "counter", text: "Speak: 'This is a state, not a fate.'", skill: "sobriety-anchors", xp: 20 }];
  }
  return [...base, { id: "win", text: "Do one small visible action", skill: "snf-hope-activation", xp: 25 }];
}

function renderAnchors() {
  const container = document.getElementById('polaris-anchors');
  if (!container) return;
  const anchors = getEnergyAnchors(state.energy);
  
  if (!state.polaris.anchors.active.length || state.polaris.anchors.energy !== state.energy) {
    state.polaris.anchors = { active: anchors.map(a => ({...a, done: false})), energy: state.energy };
    saveState();
  }

  container.innerHTML = state.polaris.anchors.active.map((a, i) => `
    <div class="anchor ${a.done ? 'done' : ''}">
      <input type="checkbox" ${a.done ? 'checked' : ''} onchange="toggleAnchor(${i})">
      <div style="flex:1">
        ${a.text} <span class="badge-xp" style="margin-left:6px">+${a.xp || 15} XP</span>
        <div class="small">from <span style="color:#7bc77b">${a.skill}</span></div>
      </div>
    </div>
  `).join('');
}

function toggleAnchor(index) {
  const anchor = state.polaris.anchors.active[index];
  anchor.done = !anchor.done;
  if (anchor.done) {
    state.polaris.proof.today = (state.polaris.proof.today || 0) + 1;
    state.polaris.proof.total = (state.polaris.proof.total || 0) + 1;
    state.polaris.proof.ledger.push({ ts: Date.now(), text: anchor.text, skill: anchor.skill, energy: state.energy });
    addXP(anchor.xp || 15, 10, "Anchor Completed");
  } else {
    state.polaris.proof.today = Math.max(0, (state.polaris.proof.today || 0) - 1);
  }
  updateProofDisplay();
  renderResilienceMeter();
  saveState();
  renderAnchors();
}

function logFloorWin() {
  const win = prompt("What tiny thing happened (even 'I stood up')?") || "Floor presence";
  state.polaris.proof.today = (state.polaris.proof.today || 0) + 1;
  state.polaris.proof.total = (state.polaris.proof.total || 0) + 1;
  state.polaris.proof.ledger.push({ ts: Date.now(), text: "FLOOR WIN: " + win, skill: "floor-wins", energy: state.energy });

  addXP(20, 15, "Floor Win");
  updateProofDisplay();
  renderResilienceMeter();
  saveState();
}

function updateProofDisplay() {
  const t = document.getElementById('proof-today');
  const tot = document.getElementById('proof-total');
  if (t) t.textContent = state.polaris.proof.today || 0;
  if (tot) tot.textContent = state.polaris.proof.total || 0;
}

function togglePolaris() {
  state.polaris.enabled = document.getElementById('polaris-toggle').checked;
  saveState();
}

function renderResilienceMeter() {
  const container = document.getElementById('resilience-meter');
  if (!container) return;
  const p = state.polaris;
  const restartSpeed = p.streaks.missed > 0 ? Math.max(1, Math.round((p.proof.total || 1) / (p.streaks.missed + 1))) : (p.proof.total || 0);
  const proofVelocity = Math.min(100, Math.round(((p.proof.today || 0) + (p.quests.active ? p.quests.active.filter(q => q.done).length : 0)) * 10));
  container.innerHTML = `
    <div>Restart Speed: <strong>${restartSpeed}</strong> (proofs / missed day) — Restarts without punishment.</div>
    <div class="meter-bar"><div class="meter-fill" style="width:${Math.min(100, restartSpeed * 5)}%"></div></div>
    <div>Proof Velocity today: <strong>${proofVelocity}%</strong></div>
    <div class="meter-bar"><div class="meter-fill" style="width:${proofVelocity}%"></div></div>
  `;
}

function renderQuests() {
  const container = document.getElementById('polaris-quests');
  if (!container) return;
  const energy = state.energy;
  const quests = generateAdaptiveQuests(energy);

  if (!state.polaris.quests.active.length || state.polaris.quests.energy !== energy) {
    state.polaris.quests = { active: quests.map(q => ({...q, done: false})), energy };
    saveState();
  }

  container.innerHTML = state.polaris.quests.active.map((q, i) => `
    <div class="quest ${q.done ? 'done' : ''}">
      <input type="checkbox" ${q.done ? 'checked' : ''} onchange="toggleQuest(${i})">
      <div style="flex:1">${q.text} <span class="badge-xp">+${q.xp || 25} XP</span> <span class="small">(${q.skill})</span></div>
    </div>
  `).join('');
}

function generateAdaptiveQuests(energy) {
  if (energy === "collapse" || energy === "low") {
    return [
      { id: "q1", text: "Feet on floor (MVD)", skill: "mvd-anchors", xp: 15 },
      { id: "q2", text: "Speak counter-script line", skill: "sobriety-anchors", xp: 20 },
      { id: "q3", text: "Low-energy execution line", skill: "low-energy-execution", xp: 20 }
    ];
  }
  return [
    { id: "q4", text: "One visible win + proof statement", skill: "snf-proof-registration", xp: 25 },
    { id: "q5", text: "Tiny hope move (action + visible result)", skill: "snf-hope-activation", xp: 25 },
    { id: "q6", text: "Job search micro-move", skill: "daily-job-search", xp: 30 }
  ];
}

function toggleQuest(index) {
  const q = state.polaris.quests.active[index];
  q.done = !q.done;
  if (q.done) {
    state.polaris.proof.today = (state.polaris.proof.today || 0) + 1;
    state.polaris.proof.total = (state.polaris.proof.total || 0) + 1;
    state.polaris.proof.ledger.push({ ts: Date.now(), text: q.text, skill: q.skill, energy: state.energy });
    addXP(q.xp || 25, 20, "Quest Completed");
  }
  updateProofDisplay();
  renderResilienceMeter();
  saveState();
  renderQuests();
}

function openSystemsAudit() { saveSystemsAudit(); }
function saveSystemsAudit() {
  state.polaris.proof.ledger.push({ ts: Date.now(), text: "Substrate Systems Check", skill: "systems-audit", energy: state.energy });
  addXP(30, 25, "Systems Audit");
  updateProofDisplay();
  renderResilienceMeter();
  saveState();
}

function syncToVaultTrackers() {
  const p = state.polaris;
  const g = state.gamification;
  const comp = g.companion || { level: 1, name: "Polaris Beacon" };
  const summary = `2026-07-22 | Polaris 25.x | Player Level ${g.level} (${getRankTitle(g.level)}) | Companion: ${comp.name} (LVL ${comp.level}) | XP: ${g.totalXP} | Points: ${g.points} | Proofs today: ${p.proof.today || 0}`;
  navigator.clipboard.writeText(summary).then(() => {
    showToast("Copied player & companion stats for vault trackers!");
  }).catch(() => prompt("Copy for vault trackers:", summary));
}

function openPHQ9() {
  const modal = document.getElementById('phq9-modal');
  const qContainer = document.getElementById('phq9-questions');
  const result = document.getElementById('phq9-result');
  if (result) result.style.display = 'none';
  if (qContainer) qContainer.innerHTML = '';

  const questions = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself?",
    "Trouble concentrating?",
    "Moving or speaking slowly or restlessly?",
    "Thoughts of self-harm or being better off dead?"
  ];

  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'phq9-question';
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <div><strong>${i+1}.</strong> ${q}</div>
      <select data-q="${i}" style="width:100%;margin-top:4px;padding:4px;background:#1a1a1e;color:#e8e8ea;border:1px solid #333">
        <option value="0">Not at all</option>
        <option value="1">Several days</option>
        <option value="2">More than half the days</option>
        <option value="3">Nearly every day</option>
      </select>
    `;
    qContainer.appendChild(div);
  });

  if (modal) modal.style.display = 'flex';
}

function closePHQ9() {
  const modal = document.getElementById('phq9-modal');
  if (modal) modal.style.display = 'none';
}

function submitPHQ9() {
  const selects = document.querySelectorAll('#phq9-questions select');
  let score = 0;
  selects.forEach(s => score += parseInt(s.value));
  
  state.polaris.phq9History = state.polaris.phq9History || [];
  state.polaris.phq9History.unshift({ date: new Date().toISOString().split('T')[0], score });
  
  addXP(50, 40, "PHQ-9 Clinical Assessment");
  saveState();
  closePHQ9();
}

function renderDashboard() {
  const c = document.getElementById('dashboard-content');
  if (!c) return;
  const g = state.gamification;
  const p = state.polaris;
  const comp = g.companion || { level: 1, name: "Polaris Beacon" };
  c.innerHTML = `
    <div>Player Level: <strong>${g.level}</strong> (${getRankTitle(g.level)})</div>
    <div>Companion: <strong>${comp.name}</strong> (LVL ${comp.level}${comp.evolved ? ' • EVOLVED' : ''})</div>
    <div>Total Experience: <strong>${g.totalXP} XP</strong></div>
    <div>Proof Points: <strong>⚡ ${g.points} Points</strong></div>
    <div>Proof Total: <strong>${p.proof.total || 0}</strong></div>
    <div>Energy: <strong>${state.energy}</strong></div>
  `;
}

function showTab(tab) {
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  const target = document.getElementById(tab);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.getElementById('tab-' + tab);
  if (activeTab) activeTab.classList.add('active');

  if (tab === 'tasks') renderGamifiedTasks();
  if (tab === 'polaris') {
    renderCompanionWidget();
    renderPolarisPlan();
    renderAnchors();
    renderQuests();
    renderResilienceMeter();
    updateProofDisplay();
  }
  if (tab === 'dashboard') renderDashboard();
}

function updateLastActiveDisplay() {
  const el = document.getElementById('last-active');
  if (el) el.textContent = "moments ago";
}

function showToast(msg, type = "success") {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}

function startSmall() { showTab('polaris'); setEnergy('low'); }
function exploreFull() { showTab('skills'); }
function emergencyFloor() { showTab('safebox'); setEnergy('collapse'); }
function quickRestart() { showTab('polaris'); setEnergy(state.energy || 'medium'); }

function restartToday() {
  state.polaris.proof.today = 0;
  saveState();
  updateProofDisplay();
  showToast("Today reset. Total XP and level preserved.");
}

function copySkill(key) {
  const s = SNF_SKILLS[key];
  if (s) {
    navigator.clipboard.writeText(`Skill: ${s.name}\n${s.desc}\nInvocation: ${s.invocation}`);
    showToast(`Copied ${s.name}`);
  }
}

function emitDailyPack() {
  navigator.clipboard.writeText("Daily Pack 25.x with Companion Evolution & Soothing Grounding");
  showToast("Daily pack copied");
}

function emitCustomPack() {
  navigator.clipboard.writeText("Custom Pack 25.x from Polaris");
  showToast("Custom pack copied");
}

function init() {
  loadState();
  renderLevelHUD();
  renderCompanionWidget();
  showTab('welcome');
  renderGamifiedTasks();
  console.log(`Polaris ${VERSION} initialized.`);
}

init();

window.POLARIS_25 = { state, setEnergy, addXP, showTab, openPHQ9, openSoothingModal, openCompanionTreeModal, triggerMicroHabit, logFloorWin, syncToVaultTrackers };
