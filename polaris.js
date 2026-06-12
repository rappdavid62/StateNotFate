// =====================================================
// POLARIS COMPLETE v1.0.0 — ALL IN ONE FILE
// =====================================================
// Drop this file into your project and include it in index.html

// --- POLARIS PROTOCOL (Full) ---
const PolarisProtocol = {
  classifyDayState() {
    const energy = (state.todayEnergy || "medium").toLowerCase();
    return ["high", "medium", "low", "collapse"].includes(energy) ? energy : "medium";
  },

  generateDailyPlan() {
    const dayState = this.classifyDayState();
    const plan = {
      dayState,
      generatedAt: new Date().toISOString(),
      anchors: this.getAdaptiveAnchors(dayState),
      difficulty: dayState === "high" ? "standard" : "easy",
      pacing: "slow",
      quest: dayState === "collapse" ? null : this.generateDailyQuest(dayState),
      floorWinsMode: dayState === "collapse",
      message: this.getDayMessage(dayState)
    };

    ensurePolarisState();
    state.polaris.day = { currentState: dayState, lastCheckInAt: new Date().toISOString(), difficulty: plan.difficulty, pacing: plan.pacing };
    state.polaris.anchors.today = plan.anchors;
    saveState();
    return plan;
  },

  getAdaptiveAnchors(dayState) {
    const base = state.mvd || [];
    if (dayState === "collapse") {
      return [
        { id: "water", text: "Drink a full glass of water", completed: false },
        { id: "light", text: "Open blinds or stand by window", completed: false },
        { id: "floor_win", text: "One tiny Floor Win (anything)", completed: false }
      ];
    }
    if (dayState === "low") return base.slice(0, 2);
    if (dayState === "medium") return [...base.slice(0, 3), { id: "micro", text: "One small practical task", completed: false }];
    return [...base, { id: "micro", text: "One small practical task", completed: false }];
  },

  generateDailyQuest(dayState) {
    const pool = dayState === "high" 
      ? ["Complete one anchor after a missed day", "Record proof on 4 separate days this week"]
      : ["Get light for 30 seconds", "Drink water and log it", "Send one low-stakes message", "Write one sentence starting with “Today I can reduce damage by…”"];
    return { id: "quest_" + Date.now(), text: pool[Math.floor(Math.random() * pool.length)], completed: false };
  },

  awardProofPoints(source, points = 1, label = "Action completed") {
    if (state.safety && state.safety.currentFlag) return false;
    ensurePolarisState();
    const event = { id: "proof_" + Date.now(), source, points, label, createdAt: new Date().toISOString(), dayState: this.classifyDayState() };
    state.polaris.proof.ledger.push(event);
    state.polaris.proof.total += points;
    state.polaris.proof.today += points;
    saveState();
    return true;
  },

  handleMissedDay() {
    ensurePolarisState();
    state.polaris.resilience.missedDays = (state.polaris.resilience.missedDays || 0) + 1;
    const quest = { id: "restart_" + Date.now(), text: "You missed. That is data, not a verdict. Pick one floor anchor and restart.", type: "restart", completed: false, createdAt: new Date().toISOString() };
    state.polaris.quests.daily = [quest];
    saveState();
    return quest;
  },

  enterFloorWinsMode() {
    ensurePolarisState();
    state.polaris.day.floorWinsMode = true;
    this.awardProofPoints("floor_win", 1, "Floor Win completed");
    saveState();
    return { message: "Floor Wins Mode. Proof still counts. Return is the win." };
  },

  updateResilience(completed) {
    ensurePolarisState();
    const r = state.polaris.resilience;
    if (completed) {
      r.current = (r.current || 0) + 1;
      if (r.current > (r.longest || 0)) r.longest = r.current;
      r.lastCompletedDate = new Date().toISOString().split("T")[0];
    } else {
      r.missedDays = (r.missedDays || 0) + 1;
      r.current = 0;
    }
    saveState();
  },

  checkSafetyIntercept() {
    return (state.safety && state.safety.currentFlag) 
      ? { active: true, message: "This is outside the self-management layer. Use 988 or emergency support." }
      : { active: false };
  },

  getTodayPlan() {
    const safety = this.checkSafetyIntercept();
    if (safety.active) return safety;
    return this.generateDailyPlan();
  },

  getDayMessage(dayState) {
    const map = {
      high: "You have capacity today. Run the full stack, then stop before recovery turns into punishment.",
      medium: "Keep it clean. Core anchors first. One practical task. One social or cognitive action. No heroic plan.",
      low: "Low energy changes the plan. It does not cancel the day.",
      collapse: "Floor Wins Mode. No performance standard today. Stay safe, reduce damage."
    };
    return map[dayState] || map.medium;
  }
};

// --- POLARIS UI ---
const PolarisUI = {
  toggle() {
    ensurePolarisState();
    state.polaris.enabled = !state.polaris.enabled;
    saveState();
    this.render();
  },

  render() {
    const container = document.getElementById("polaris-status");
    if (!container || !state.polaris || !state.polaris.enabled) {
      if (container) container.innerHTML = `<div style="padding:1.5rem;text-align:center;"><p>Polaris is disabled.</p></div>`;
      return;
    }

    const plan = PolarisProtocol.getTodayPlan();
    container.innerHTML = `
      <div style="padding:1rem;">
        <h3 style="margin-bottom:0.5rem;">🜁 Polaris — Your Counter-Gravity Companion</h3>
        <p style="margin-bottom:1rem;">${plan.message}</p>
        <button onclick="PolarisUI.showPlan()" class="btn btn-primary">View Today’s Plan</button>
      </div>
    `;
  },

  showPlan() {
    const plan = PolarisProtocol.getTodayPlan();
    alert("Today’s Polaris Plan:\n\n" + plan.message);
  }
};

// --- AUTO INIT ---
function ensurePolarisState() {
  if (!state.polaris) {
    state.polaris = {
      enabled: true,
      guide: { name: "Polaris", appearance: { avatar: "🐻" } },
      proof: { total: 0, today: 0, ledger: [] },
      resilience: { current: 0, longest: 0, missedDays: 0 }
    };
  }
}

if (typeof window !== 'undefined') {
  window.Polaris = { Protocol: PolarisProtocol, UI: PolarisUI };
  console.log('[Polaris] Complete system loaded');
}