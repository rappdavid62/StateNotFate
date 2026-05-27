// INJECTED JAVASCRIPT Logic Engine
        const DEFAULT_STATE = {
            isOnboarded: false,
            ratings: {
                sleep: 0,
                morning: 0,
                initiation: 0,
                clutter: 0,
                energy: 0,
                shame: 0,
                hygiene: 0,
                eating: 0,
                social: 0,
                meaning: 0
            },
            safety: {
                suicide: 0,
                psychosis: 0,
                mania: 0
            },
            customMantra: "I am a happy, healthy, handsome, confident, charismatic man, and people like me.",
            negativeBeliefs: "",
            worstTime: "morning",
            stillWorks: "",
            mvd: [
                "Wake on workdays by 7:30am, drink water, take morning medication.",
                "Brush teeth, eat a simple protein block before energy crash.",
                "Stand outside for 2 minutes in daylight, keep tomorrow's clothes pre-positioned."
            ],
            reasonsLive: "",
            safeContacts: "",
            distractions: "",
            linkedFiles: [],
            todayEnergy: "medium",
            mantraCompletedToday: false,
            history: [],
            currentHopeLevel: 1,
            hopeProgress: 0,
            dominantPattern: "Rhythm Collapse",
            phq9History: [],
            currentLayer: 0,
            activeMediaIndex: -1,
            playbackSpeed: 1.0,
            gratitudeJournal: [],
            thoughtCorrections: [],
            customTasks: [],
            securityPin: "",
            isLocked: false
        };

        let state = { ...DEFAULT_STATE };

        const MEDIA_PLAYLIST = [
            { title: "Treating depression as a systems failure", file: "Treating_depression_as_a_systems_failure.m4a", type: "audio", duration: "48:09" },
            { title: "The Reprogramming Protocol: Debugging Depression", file: "The_Reprogramming_Protocol__Debugging_Depression.mp4", type: "video", duration: "1:21:49" },
            { title: "State, Not A Fate", file: "State,_Not_A_Fate.mp4", type: "video", duration: "1:37:42" },
            { title: "Stop treating depression like broken bones", file: "Stop_treating_depression_like_broken_bones.m4a", type: "audio", duration: "47:17" },
            { title: "The Broken Firmware: A Mechanical Guide to Depression", file: "The_Broken_Firmware__A_Mechanical_Guide_to_Depression.mp4", type: "video", duration: "1:04:10" },
            { title: "The Depression Project", file: "The_Depression_Project.mp4", type: "video", duration: "1:21:34" },
            { title: "Depression is a mechanical system failure", file: "Depression_is_a_mechanical_system_failure.m4a", type: "audio", duration: "56:43" },
            { title: "Developing a Clinical Trial Outreach Plan", file: "Developing_a_Clinical_Trial_Community_Outreach_Action_Plan.mp4", type: "video", duration: "47:04" },
            { title: "Why recovery requires proof not inspiration", file: "Why_recovery_requires_proof_not_inspiration.m4a", type: "audio", duration: "1:02:07" },
            { title: "The Mechanics of State vs. Fate", file: "The_Mechanics_of_State_vs.mp4", type: "video", duration: "47:55" },
            { title: "The 6-Minute System Synopsis", file: "6_minute_synopsis.mp4", type: "video", duration: "6:00" }
        ];

        const PHQ9_QUESTIONS = [
            "Little interest or pleasure in doing things.",
            "Feeling down, depressed, or hopeless.",
            "Trouble falling or staying asleep, or sleeping too much.",
            "Feeling tired or having little energy.",
            "Poor appetite or overeating.",
            "Feeling bad about yourself - or that you are a failure or have let yourself or your family down.",
            "Trouble concentrating on things, such as reading the newspaper or watching television.",
            "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual.",
            "Thoughts that you would be better off dead or of hurting yourself in some way."
        ];

        const ROADMAP_LAYERS = [
            { num: 0, title: "Trust Building", desc: "Establish basic credibility, blunt honest framing, and buy-in.", req: 0 },
            { num: 1, title: "Intake & Reality Map", desc: "Progressive mapping of burden, daily rhythms, and barriers.", req: 1 },
            { num: 2, title: "First Traction", desc: "Secure the first matched move to prove that one contained action still alters the day.", req: 3 },
            { num: 3, title: "Anchor Building", desc: "Build a stable, minimal daily floor (MVD) to protect self-trust.", req: 5 },
            { num: 4, title: "Startup Repair", desc: "Reduce task-entry thresholds, pre-position items, and eliminate negotiation.", req: 8 },
            { num: 5, title: "Stabilization", desc: "Coordinate circadian light signals, nutrition, sleep timing, and medical care.", req: 12 },
            { num: 6, title: "Graded Expansion", desc: "Widen routine into low-friction exercise, simple administration, and creative goals.", req: 17 },
            { num: 7, title: "Social Reintegration", desc: "Gradual, low-stakes reconnection to safe contacts with zero performative pressure.", req: 23 },
            { num: 8, title: "Relapse & Restart", desc: "Master the emergency rescue protocol. Relapse is measured by restart speed.", req: 29 },
            { num: 9, title: "Trust Repair", desc: "Sustain cumulative floor wins to permanently rewrite negative programming scripts.", req: 36 }
        ];

        const screens = {
            lock: document.getElementById("screen-lock"),
            welcome: document.getElementById("screen-welcome"),
            intake: document.getElementById("screen-intake"),
            dashboard: document.getElementById("screen-dashboard")
        };

        const tabs = {
            dashboard: document.getElementById("tab-dashboard"),
            safebox: document.getElementById("tab-safebox"),
            mediaconsole: document.getElementById("tab-mediaconsole"),
            progression: document.getElementById("tab-progression"),
            cognitivelab: document.getElementById("tab-cognitivelab"),
            documentcenter: document.getElementById("tab-documentcenter"),
            explorer: document.getElementById("tab-explorer")
        };

        let tempPhqAnswers = new Array(9).fill(null);
        let tempPinInput = ""; 

        function init() {
            loadState();
            setupEventListeners();
            
            // Register PWA Service Worker for Mobile Offline Standalone Installations
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('./service-worker.js')
                        .then(reg => console.log('[PWA] Service Worker registered successfully:', reg.scope))
                        .catch(err => console.error('[PWA] Service Worker registration failed:', err));
                });
            }
            
            if (state.securityPin) {
                state.isLocked = true;
                showScreen("lock");
                resetPinDots();
            } else if (state.isOnboarded) {
                showScreen("dashboard");
                renderDashboard();
            } else {
                showScreen("welcome");
            }
        }

        function scramble(text, pin) {
            if (!text) return "";
            let key = pin.split("").reduce((sum, v) => sum + parseInt(v), 0) || 5;
            return text.split("").map(c => String.fromCharCode(c.charCodeAt(0) + key)).join("");
        }

        function descramble(text, pin) {
            if (!text) return "";
            let key = pin.split("").reduce((sum, v) => sum + parseInt(v), 0) || 5;
            return text.split("").map(c => String.fromCharCode(c.charCodeAt(0) - key)).join("");
        }

        function loadState() {
            const saved = localStorage.getItem("state_not_fate_state");
            if (saved) {
                try {
                    state = JSON.parse(saved);
                    
                    if (!state.mvd || state.mvd.length === 0) state.mvd = [ ...DEFAULT_STATE.mvd ];
                    if (state.linkedFiles === undefined) state.linkedFiles = [];
                    if (state.phq9History === undefined) state.phq9History = [];
                    if (state.currentLayer === undefined) state.currentLayer = 0;
                    if (state.activeMediaIndex === undefined) state.activeMediaIndex = -1;
                    if (state.playbackSpeed === undefined) state.playbackSpeed = 1.0;
                    if (state.gratitudeJournal === undefined) state.gratitudeJournal = [];
                    if (state.thoughtCorrections === undefined) state.thoughtCorrections = [];
                    if (state.customTasks === undefined) state.customTasks = [];
                    if (state.securityPin === undefined) state.securityPin = "";
                    if (state.isLocked === undefined) state.isLocked = false;
                } catch (e) {
                    console.error("Error reading saved state, resetting...", e);
                    state = { ...DEFAULT_STATE };
                }
            }
        }

        function saveState() {
            // If a security PIN is set, cryptographically obfuscate sensitive fields before saving
            let stateToSave = { ...state };
            if (state.securityPin) {
                stateToSave.reasonsLive = scramble(state.reasonsLive, state.securityPin);
                stateToSave.safeContacts = scramble(state.safeContacts, state.securityPin);
                stateToSave.distractions = scramble(state.distractions, state.securityPin);
                
                stateToSave.linkedFiles = state.linkedFiles.map(file => ({
                    name: scramble(file.name, state.securityPin),
                    path: scramble(file.path, state.securityPin)
                }));

                stateToSave.gratitudeJournal = state.gratitudeJournal.map(item => ({
                    date: item.date,
                    relief: scramble(item.relief, state.securityPin),
                    possibility: scramble(item.possibility, state.securityPin)
                }));

                stateToSave.thoughtCorrections = state.thoughtCorrections.map(item => ({
                    date: item.date,
                    ant: scramble(item.ant, state.securityPin),
                    challenge: scramble(item.challenge, state.securityPin),
                    rewrite: scramble(item.rewrite, state.securityPin)
                }));

                stateToSave.customTasks = state.customTasks.map(task => scramble(task, state.securityPin));
            }
            localStorage.setItem("state_not_fate_state", JSON.stringify(stateToSave));
        }

        function decryptStateData(pin) {
            state.reasonsLive = descramble(state.reasonsLive, pin);
            state.safeContacts = descramble(state.safeContacts, pin);
            state.distractions = descramble(state.distractions, pin);
            
            state.linkedFiles = state.linkedFiles.map(file => ({
                name: descramble(file.name, pin),
                path: descramble(file.path, pin)
            }));

            state.gratitudeJournal = state.gratitudeJournal.map(item => ({
                date: item.date,
                relief: descramble(item.relief, pin),
                possibility: descramble(item.possibility, pin)
            }));

            state.thoughtCorrections = state.thoughtCorrections.map(item => ({
                date: item.date,
                ant: descramble(item.ant, pin),
                challenge: descramble(item.challenge, pin),
                rewrite: descramble(item.rewrite, pin)
            }));

            state.customTasks = state.customTasks.map(task => descramble(task, pin));
        }

        function showScreen(screenId) {
            Object.keys(screens).forEach(key => {
                if (key === screenId) {
                    screens[key].classList.remove("hidden");
                } else {
                    screens[key].classList.add("hidden");
                }
            });
        }

        function showTab(tabId) {
            Object.keys(tabs).forEach(key => {
                if (key === tabId) {
                    tabs[key].classList.remove("hidden");
                } else {
                    tabs[key].classList.add("hidden");
                }
            });
            
            document.querySelectorAll(".tab-btn").forEach(btn => {
                if (btn.getAttribute("data-tab") === tabId) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });

            if (tabId === "mediaconsole") {
                renderMediaConsole();
            } else if (tabId === "progression") {
                renderProgressionDashboard();
            } else if (tabId === "cognitivelab") {
                renderCognitiveLab();
            } else if (tabId === "documentcenter") {
                renderDocumentCenter();
            }
        }

        function setupEventListeners() {
            document.getElementById("btn-start-intake").addEventListener("click", () => {
                showScreen("intake");
                initIntakeForm();
            });

            document.getElementById("btn-back-welcome").addEventListener("click", () => {
                showScreen("welcome");
            });

            document.querySelectorAll(".accordion-header").forEach(header => {
                header.addEventListener("click", (e) => {
                    const currentSection = e.target.closest(".accordion-section");
                    const isActive = currentSection.classList.contains("active");
                    document.querySelectorAll(".accordion-section").forEach(sec => sec.classList.remove("active"));
                    
                    if (!isActive) {
                        currentSection.classList.add("active");
                    }
                });
            });

            document.querySelectorAll(".rating-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const container = e.target.parentElement;
                    const metric = container.getAttribute("data-metric");
                    const val = parseInt(e.target.getAttribute("data-val"));
                    
                    container.querySelectorAll(".rating-btn").forEach(b => b.classList.remove("selected"));
                    e.target.classList.add("selected");
                    state.ratings[metric] = val;
                });
            });

            document.querySelectorAll(".safety-option-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const row = e.target.closest(".safety-row");
                    const safetyType = row.getAttribute("data-safety-type");
                    const val = parseInt(e.target.getAttribute("data-val"));
                    
                    row.querySelectorAll(".safety-option-btn").forEach(b => b.classList.remove("selected"));
                    e.target.classList.add("selected");
                    state.safety[safetyType] = val;
                });
            });

            document.getElementById("btn-submit-intake").addEventListener("click", submitIntake);

            document.querySelectorAll(".tab-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const tabId = e.target.getAttribute("data-tab");
                    if (tabId === "reset-intake") {
                        if (confirm("Are you sure you want to reset your intake data? This will clear your current dashboard and clinical progress history.")) {
                            resetToOnboarding();
                        }
                    } else if (e.target.id === "btn-tab-lock") {
                        lockApplication();
                    } else {
                        showTab(tabId);
                        if (tabId === "safebox") {
                            renderSafeBox();
                            if (isHighRiskActive()) {
                                triggerCrisisOverlay();
                            }
                        }
                    }
                });
            });

            document.querySelectorAll(".energy-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const energyBtn = e.target.closest(".energy-btn");
                    const energyVal = energyBtn.getAttribute("data-energy");
                    
                    document.querySelectorAll(".energy-btn").forEach(b => b.classList.remove("active"));
                    energyBtn.classList.add("active");
                    
                    state.todayEnergy = energyVal;
                    if (energyVal === "collapse") {
                        logMissInHistory();
                    }
                    
                    saveState();
                    renderDailyChecklist();
                    updateDashboardMetrics();
                });
            });

            document.getElementById("btn-check-mantra").addEventListener("click", () => {
                state.mantraCompletedToday = true;
                document.getElementById("btn-check-mantra").innerHTML = "✓ Active Identity Anchored";
                document.getElementById("btn-check-mantra").disabled = true;
                logActionCompletion("Master Counter-Script Recited Aloud");
                saveState();
                updateDashboardMetrics();
            });

            document.getElementById("btn-add-file-link").addEventListener("click", addFileLink);

            // Cognitive Lab saves
            document.getElementById("btn-save-gratitude").addEventListener("click", saveGratitudeEntry);
            document.getElementById("btn-save-thought").addEventListener("click", saveThoughtCorrection);
            document.getElementById("btn-add-custom-task").addEventListener("click", addCustomTask);
            document.getElementById("btn-save-custom-treatment").addEventListener("click", saveCustomTreatment);

            document.getElementById("btn-close-crisis-modal").addEventListener("click", () => {
                document.getElementById("crisis-modal").classList.remove("active");
            });
            document.getElementById("btn-crisis-dismiss").addEventListener("click", () => {
                document.getElementById("crisis-modal").classList.remove("active");
            });
            document.getElementById("btn-crisis-go-safebox").addEventListener("click", () => {
                document.getElementById("crisis-modal").classList.remove("active");
                showTab("safebox");
                renderSafeBox();
            });

            document.getElementById("btn-trigger-breathe").addEventListener("click", triggerBreathingModal);
            document.getElementById("btn-close-breath-modal").addEventListener("click", closeBreathingModal);
            document.getElementById("btn-breath-done").addEventListener("click", () => {
                closeBreathingModal();
                document.getElementById("btn-check-mantra").click();
            });

            document.querySelectorAll(".speed-badge").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const rate = parseFloat(e.target.getAttribute("data-speed"));
                    document.querySelectorAll(".speed-badge").forEach(b => b.classList.remove("active"));
                    e.target.classList.add("active");
                    
                    state.playbackSpeed = rate;
                    saveState();
                    
                    const audio = document.getElementById("audio-player");
                    const video = document.getElementById("video-player");
                    audio.playbackRate = rate;
                    video.playbackRate = rate;
                });
            });

            document.getElementById("btn-start-phq9").addEventListener("click", openPhqAssessmentModal);
            document.getElementById("btn-close-phq-modal").addEventListener("click", closePhqAssessmentModal);
            document.getElementById("btn-cancel-phq").addEventListener("click", closePhqAssessmentModal);
            document.getElementById("btn-submit-phq").addEventListener("click", submitPhqAssessment);

            document.querySelectorAll(".keypad-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const val = e.target.getAttribute("data-val");
                    if (!val) return; 
                    handleKeypadInput(val);
                });
            });
            
            document.getElementById("btn-submit-pin").addEventListener("click", validateEnteredPin);

            // Virtual Expert Council Upgrades Event Bindings
            document.getElementById("btn-quick-safety").addEventListener("click", renderQuickSafety);
            document.getElementById("btn-close-quick-safety-modal").addEventListener("click", () => {
                document.getElementById("quick-safety-modal").classList.remove("active");
            });
            document.getElementById("btn-export-session").addEventListener("click", generateProgressBriefing);
            document.getElementById("btn-close-export-modal").addEventListener("click", () => {
                document.getElementById("export-modal").classList.remove("active");
            });
            document.getElementById("btn-copy-export-briefing").addEventListener("click", () => {
                const textarea = document.getElementById("textarea-export-briefing");
                textarea.select();
                document.execCommand("copy");
                alert("Anonymized clinical progress briefing copied to clipboard!");
            });
            document.getElementById("btn-download-export-briefing").addEventListener("click", () => {
                const content = document.getElementById("textarea-export-briefing").value;
                const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `State_Not_Fate_Progress_Briefing_${new Date().toISOString().slice(0,10)}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }

        function initIntakeForm() {
            document.getElementById("input-set-pin").value = state.securityPin;
            document.getElementById("input-custom-mantra").value = state.customMantra;
            document.getElementById("input-negative-beliefs").value = state.negativeBeliefs;
            document.getElementById("select-worst-time").value = state.worstTime;
            document.getElementById("input-still-works").value = state.stillWorks;
            document.getElementById("input-mvd-1").value = state.mvd[0];
            document.getElementById("input-mvd-2").value = state.mvd[1];
            document.getElementById("input-mvd-3").value = state.mvd[2];
            document.getElementById("input-reasons-live").value = state.reasonsLive;
            document.getElementById("input-safe-contacts").value = state.safeContacts;
            document.getElementById("input-distraction-activities").value = state.distractions;
            
            document.querySelectorAll(".accordion-section").forEach((sec, idx) => {
                if (idx === 0) sec.classList.add("active");
                else sec.classList.remove("active");
            });
        }

        function handleKeypadInput(val) {
            if (val === "clear") {
                tempPinInput = "";
            } else {
                if (tempPinInput.length < 4) {
                    tempPinInput += val;
                }
            }
            updatePinDotsDisplay();
            if (tempPinInput.length === 4) {
                setTimeout(validateEnteredPin, 150);
            }
        }

        function updatePinDotsDisplay() {
            const len = tempPinInput.length;
            for (let i = 1; i <= 4; i++) {
                const dot = document.getElementById(`dot-${i}`);
                if (i <= len) dot.classList.add("active");
                else dot.classList.remove("active");
            }
        }

        function resetPinDots() {
            tempPinInput = "";
            updatePinDotsDisplay();
        }

        function validateEnteredPin() {
            if (tempPinInput === state.securityPin) {
                state.isLocked = false;
                decryptStateData(state.securityPin);
                showScreen("dashboard");
                renderDashboard();
            } else {
                const keypadCard = document.querySelector("#screen-lock .glass-card");
                keypadCard.style.animation = "none";
                setTimeout(() => {
                    keypadCard.style.animation = "shake 0.3s ease-in-out";
                }, 10);
                alert("Incorrect Security PIN. Decryption failed.");
                resetPinDots();
            }
        }

        const style = document.createElement('style');
        style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
        }
        `;
        document.head.appendChild(style);

        function lockApplication() {
            if (state.securityPin) {
                state.isLocked = true;
                saveState();
                loadState();
                showScreen("lock");
                resetPinDots();
            } else {
                alert("You must define a 4-digit Security PIN in Intake Section 1 to lock the application.");
            }
        }

        function submitIntake() {
            const pin = document.getElementById("input-set-pin").value.trim();
            if (pin.length > 0 && pin.length !== 4) {
                alert("Your Security PIN must be exactly 4 digits long.");
                return;
            }
            
            state.securityPin = pin;
            state.customMantra = document.getElementById("input-custom-mantra").value.trim() || DEFAULT_STATE.customMantra;
            state.negativeBeliefs = document.getElementById("input-negative-beliefs").value.trim();
            state.worstTime = document.getElementById("select-worst-time").value;
            state.stillWorks = document.getElementById("input-still-works").value.trim();
            
            state.mvd = [
                document.getElementById("input-mvd-1").value.trim() || DEFAULT_STATE.mvd[0],
                document.getElementById("input-mvd-2").value.trim() || DEFAULT_STATE.mvd[1],
                document.getElementById("input-mvd-3").value.trim() || DEFAULT_STATE.mvd[2]
            ];
            
            state.reasonsLive = document.getElementById("input-reasons-live").value.trim();
            state.safeContacts = document.getElementById("input-safe-contacts").value.trim();
            state.distractions = document.getElementById("input-distraction-activities").value.trim();
            
            state.dominantPattern = calculatePrimaryPattern();
            state.isOnboarded = true;
            state.todayEnergy = "medium";
            state.currentLayer = 1;
            
            saveState();
            showScreen("dashboard");
            showTab("dashboard");
            renderDashboard();
            
            if (isHighRiskActive()) {
                triggerCrisisOverlay();
            }
        }

        function calculatePrimaryPattern() {
            const r = state.ratings;
            const scores = {
                "Rhythm Collapse": (r.sleep || 0) + (r.morning || 0),
                "Environmental Drag": (r.clutter || 0) * 2,
                "Total Initiation Failure": (r.initiation || 0) * 2,
                "High Shame / Low Trust": (r.shame || 0) + (r.meaning || 0),
                "Fragile Consistency": (r.shame || 0) + (r.initiation || 0),
                "Good-Day Overreach": (r.shame || 0) + (r.energy || 0)
            };
            
            let bestPattern = "Rhythm Collapse";
            let maxScore = -1;
            
            Object.keys(scores).forEach(pattern => {
                if (scores[pattern] > maxScore) {
                    maxScore = scores[pattern];
                    bestPattern = pattern;
                }
            });
            return bestPattern;
        }

        function isHighRiskActive() {
            return state.safety.suicide === 2 || state.safety.psychosis === 2 || state.safety.mania === 2;
        }

        function triggerCrisisOverlay() {
            document.getElementById("crisis-modal").classList.add("active");
        }

        function resetToOnboarding() {
            localStorage.removeItem("state_not_fate_state");
            state = { ...DEFAULT_STATE };
            showScreen("welcome");
        }

        function renderDashboard() {
            document.getElementById("dashboard-mantra-text").innerHTML = `"${state.customMantra}"`;
            
            state.mantraCompletedToday = isMantraCompletedToday();
            const mantraBtn = document.getElementById("btn-check-mantra");
            if (state.mantraCompletedToday) {
                mantraBtn.innerHTML = "✓ Active Identity Anchored";
                mantraBtn.disabled = true;
            } else {
                mantraBtn.innerHTML = "✓ Repeated Aloud";
                mantraBtn.disabled = false;
            }
            
            document.querySelectorAll(".energy-btn").forEach(btn => {
                if (btn.getAttribute("data-energy") === state.todayEnergy) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
            
            renderDailyChecklist();
            updateDashboardMetrics();
        }

        function isMantraCompletedToday() {
            const today = getTodayString();
            const todayLog = state.history.find(log => log.date === today);
            return todayLog ? todayLog.completed.includes("Master Counter-Script Recited Aloud") : false;
        }

        function getTodayString() {
            const d = new Date();
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }

        function renderDailyChecklist() {
            const container = document.getElementById("daily-checklist-items");
            container.innerHTML = "";
            
            const energy = state.todayEnergy;
            const badge = document.getElementById("active-energy-badge");
            const warning = document.getElementById("collapse-warning-banner");
            
            badge.className = `badge badge-${energy}`;
            badge.innerHTML = `${energy.toUpperCase()} ENERGY`;
            
            if (energy === "collapse") warning.classList.remove("hidden");
            else warning.classList.add("hidden");
            
            let tasks = [];
            
            if (energy === "collapse" || energy === "low") {
                tasks = [
                    { label: state.mvd[0], isMvd: true },
                    { label: state.mvd[1], isMvd: true },
                    { label: state.mvd[2], isMvd: true }
                ];
            } else {
                tasks = [
                    { label: state.mvd[0], isMvd: true },
                    { label: state.mvd[1], isMvd: true },
                    { label: state.mvd[2], isMvd: true }
                ];
                
                tasks.push({ label: "Morning outdoor light exposure (10 minutes circadian signal)", isMvd: false });
                tasks.push({ label: "Medication adherence checklist item (substrate floor)", isMvd: false });
                
                if (state.dominantPattern === "Rhythm Collapse") {
                    tasks.push({ label: "Maintain precise pre-decided workday sleep/wake anchors", isMvd: false });
                    tasks.push({ label: "Execute immediate first-hour actions without debate", isMvd: false });
                } else if (state.dominantPattern === "Environmental Drag") {
                    tasks.push({ label: "Clear and reset 1 visible surface zone (anti-chaos)", isMvd: false });
                    tasks.push({ label: "Perform a focused 10-minute trash removal swipe", isMvd: false });
                } else if (state.dominantPattern === "Total Initiation Failure") {
                    tasks.push({ label: "Execute 1 micro-threshold task (define first 10 seconds only)", isMvd: false });
                    tasks.push({ label: "Pre-position tomorrow's work clothes and tools by the door", isMvd: false });
                } else if (state.dominantPattern === "High Shame / Low Trust") {
                    tasks.push({ label: "Maintain small base wins only; strictly avoid grand plans", isMvd: false });
                    tasks.push({ label: "Send 1 low-threat connection text ('Thinking of you, no pressure')", isMvd: false });
                } else if (state.dominantPattern === "Fragile Consistency" || state.dominantPattern === "Good-Day Overreach") {
                    tasks.push({ label: "Cap today's ambition floor; prevent good-day overreach burnout", isMvd: false });
                    tasks.push({ label: "Execute 5-minute graded body movement (no identity gym targets)", isMvd: false });
                }
                
                if (energy === "high") {
                    tasks.push({ label: "Complete structured 10-minute walking, yoga, or light exercise", isMvd: false });
                    tasks.push({ label: "Structured meditation session (10 to 15 minutes focus gap)", isMvd: false });
                    tasks.push({ label: "Handle 1 admin micro-task (open mail, file one document, pay one bill)", isMvd: false });
                }

                // Inject custom clinician/user recovery tasks
                if (state.customTasks && state.customTasks.length > 0) {
                    state.customTasks.forEach(task => {
                        tasks.push({ label: task, isMvd: false });
                    });
                }
            }
            
            const today = getTodayString();
            const todayLog = state.history.find(log => log.date === today);
            const completedList = todayLog ? todayLog.completed : [];
            
            tasks.forEach(task => {
                const item = document.createElement("div");
                const isChecked = completedList.includes(task.label);
                
                item.className = `task-item ${isChecked ? 'checked' : ''}`;
                item.innerHTML = `
                    <div class="task-checkbox"></div>
                    <div class="task-label">${task.label}</div>
                `;
                
                item.addEventListener("click", () => {
                    toggleTask(task.label, item);
                });
                container.appendChild(item);
            });
        }

        function toggleTask(label, element) {
            const today = getTodayString();
            let todayLog = state.history.find(log => log.date === today);
            
            if (!todayLog) {
                todayLog = {
                    date: today,
                    energy: state.todayEnergy,
                    completed: [],
                    floorCompleted: false,
                    mvdCompleted: false,
                    missed: false
                };
                state.history.push(todayLog);
            }
            
            const index = todayLog.completed.indexOf(label);
            if (index === -1) {
                todayLog.completed.push(label);
                element.classList.add("checked");
            } else {
                todayLog.completed.splice(index, 1);
                element.classList.remove("checked");
            }
            
            evaluateDaySuccess(todayLog);
            saveState();
            updateDashboardMetrics();
        }

        function logActionCompletion(label) {
            const today = getTodayString();
            let todayLog = state.history.find(log => log.date === today);
            
            if (!todayLog) {
                todayLog = {
                    date: today,
                    energy: state.todayEnergy,
                    completed: [],
                    floorCompleted: false,
                    mvdCompleted: false,
                    missed: false
                };
                state.history.push(todayLog);
            }
            
            if (!todayLog.completed.includes(label)) {
                todayLog.completed.push(label);
            }
            evaluateDaySuccess(todayLog);
        }

        function logMissInHistory() {
            const today = getTodayString();
            let todayLog = state.history.find(log => log.date === today);
            
            if (!todayLog) {
                todayLog = {
                    date: today,
                    energy: state.todayEnergy,
                    completed: [],
                    floorCompleted: false,
                    mvdCompleted: false,
                    missed: true
                };
                state.history.push(todayLog);
            } else {
                todayLog.energy = "collapse";
                evaluateDaySuccess(todayLog);
            }
        }

        function evaluateDaySuccess(todayLog) {
            const mvdCompleted = state.mvd.every(task => todayLog.completed.includes(task));
            const energy = todayLog.energy;
            todayLog.mvdCompleted = mvdCompleted;
            
            if (energy === "collapse" || energy === "low") {
                todayLog.floorCompleted = mvdCompleted;
                todayLog.missed = !mvdCompleted;
            } else {
                const totalCompleted = todayLog.completed.length;
                const requiredCompleted = energy === "high" ? 6 : 4;
                todayLog.floorCompleted = mvdCompleted && (totalCompleted >= requiredCompleted);
                todayLog.missed = !mvdCompleted;
            }
        }

        function updateDashboardMetrics() {
            const totalFloorDays = state.history.filter(log => log.floorCompleted).length;
            
            const statsResilience = calculateResilienceRate();
            document.getElementById("stats-resilience-rate").innerHTML = `${statsResilience}%`;
            document.getElementById("stats-floor-days").innerHTML = totalFloorDays;
            
            updateHopeLevel(totalFloorDays);
            calculateCurrentLayer(totalFloorDays);
        }

        function calculateResilienceRate() {
            const h = state.history;
            if (h.length === 0) return 100;
            
            let totalMisses = 0;
            let successfulRestarts = 0;
            
            for (let i = 0; i < h.length; i++) {
                if (h[i].missed) {
                    totalMisses++;
                    if (i + 1 < h.length) {
                        if (h[i + 1].floorCompleted || h[i + 1].mvdCompleted) {
                            successfulRestarts++;
                        }
                    }
                }
            }
            if (totalMisses === 0) return 100;
            return Math.round((successfulRestarts / totalMisses) * 100);
        }

        function updateHopeLevel(totalFloorDays) {
            const fill = document.getElementById("hope-bar-fill");
            const lvlText = document.getElementById("label-hope-level");
            const lvlPercent = document.getElementById("label-hope-percent");
            const title = document.getElementById("hope-level-title");
            const desc = document.getElementById("hope-level-desc");
            
            let level = 1;
            let progress = 0;
            let lTitle = "Action is Possible";
            let lDesc = "Rebuild self-trust. Complete small daily anchors to register proof.";
            
            if (totalFloorDays < 3) {
                level = 1;
                progress = (totalFloorDays / 3) * 20;
            } else if (totalFloorDays < 7) {
                level = 2;
                progress = 20 + ((totalFloorDays - 3) / 4) * 20;
                lTitle = "Action Causes Results";
                lDesc = "Your actions are creating observable outcomes. The floor is stabilizing.";
            } else if (totalFloorDays < 12) {
                level = 3;
                progress = 40 + ((totalFloorDays - 7) / 5) * 20;
                lTitle = "The Result Can Repeat";
                lDesc = "Repetition builds neuroplasticity. You are proving you can restart repeatedly.";
            } else if (totalFloorDays < 20) {
                level = 4;
                progress = 60 + ((totalFloorDays - 12) / 8) * 20;
                lTitle = "Repetition Stabilizes Life";
                lDesc = "Mornings, hygiene, and routines are losing their chaos. The floor is solid.";
            } else {
                level = 5;
                progress = Math.min(100, 80 + ((totalFloorDays - 20) / 10) * 20);
                lTitle = "Stability Supports a Future";
                lDesc = "A wider future is thinkable. Safe re-expansion into work and social connection.";
            }
            
            state.currentHopeLevel = level;
            state.hopeProgress = Math.round(progress);
            
            fill.style.width = `${progress}%`;
            lvlText.innerHTML = `Level ${level}`;
            lvlPercent.innerHTML = `${Math.round(progress)}%`;
            title.innerHTML = lTitle;
            desc.innerHTML = lDesc;
        }

        function calculateCurrentLayer(totalFloorDays) {
            let layer = 0;
            ROADMAP_LAYERS.forEach(step => {
                if (totalFloorDays >= step.req) {
                    layer = step.num;
                }
            });
            if (state.isOnboarded && layer === 0) layer = 1;
            state.currentLayer = layer;
            saveState();
        }

        function renderSafeBox() {
            document.getElementById("display-reasons-live").innerHTML = state.reasonsLive || "No reasons added yet. Fill out safety details in Intake.";
            document.getElementById("display-distraction-activities").innerHTML = state.distractions || "No distraction activities listed yet.";
            document.getElementById("display-safe-contacts").innerHTML = state.safeContacts || "No safe contacts listed yet.";
            renderLinkedFilesList();
        }

        function renderLinkedFilesList() {
            const container = document.getElementById("linked-files-container");
            container.innerHTML = "";
            
            if (state.linkedFiles.length === 0) {
                container.innerHTML = `<div class="text-muted center-text py-2" style="font-size:0.85rem;">No personal files logged yet. Link paths below.</div>`;
                return;
            }
            
            state.linkedFiles.forEach((file, index) => {
                const item = document.createElement("div");
                item.className = "linked-file-item";
                item.innerHTML = `
                    <div class="linked-file-info">
                        <div class="linked-file-name">${file.name}</div>
                        <div class="linked-file-path">${file.path}</div>
                    </div>
                    <div style="display:flex; gap:0.5rem; align-items:center;">
                        <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${file.path.replace(/\\/g, '\\\\')}'); alert('Path copied to clipboard!')" style="padding:0.4rem 0.6rem; font-size:0.75rem;">Copy Path</button>
                        <button class="linked-file-remove" data-idx="${index}">×</button>
                    </div>
                `;
                
                item.querySelector(".linked-file-remove").addEventListener("click", () => {
                    removeFileLink(index);
                });
                container.appendChild(item);
            });
        }

        function addFileLink() {
            const nameInput = document.getElementById("input-link-filename");
            const pathInput = document.getElementById("input-link-path");
            const name = nameInput.value.trim();
            const path = pathInput.value.trim();
            
            if (!name || !path) {
                alert("Please enter both the file label and its local absolute system path.");
                return;
            }
            
            state.linkedFiles.push({ name, path });
            saveState();
            renderLinkedFilesList();
            
            nameInput.value = "";
            pathInput.value = "";
        }

        function removeFileLink(index) {
            state.linkedFiles.splice(index, 1);
            saveState();
            renderLinkedFilesList();
        }

        function renderMediaConsole() {
            const container = document.getElementById("media-playlist-container");
            container.innerHTML = "";
            
            MEDIA_PLAYLIST.forEach((track, index) => {
                const item = document.createElement("div");
                const isActive = state.activeMediaIndex === index;
                
                item.className = `playlist-item ${isActive ? 'active' : ''}`;
                item.innerHTML = `
                    <div class="playlist-item-info">
                        <span class="media-tag tag-${track.type}">${track.type}</span>
                        <div class="playlist-item-title" title="${track.title}">${track.title}</div>
                    </div>
                    <div style="display:flex; gap:0.5rem; align-items:center;">
                        <span class="text-muted" style="font-size:0.75rem; font-family:monospace;">${track.duration}</span>
                        <button class="btn btn-primary btn-play" style="padding:0.35rem 0.6rem; font-size:0.75rem;">${isActive ? 'Playing' : 'Play'}</button>
                    </div>
                `;
                
                item.addEventListener("click", () => {
                    loadAndPlayTrack(index);
                });
                container.appendChild(item);
            });

            document.querySelectorAll(".speed-badge").forEach(btn => {
                if (parseFloat(btn.getAttribute("data-speed")) === state.playbackSpeed) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        }

        function loadAndPlayTrack(index) {
            state.activeMediaIndex = index;
            saveState();
            renderMediaConsole();
            
            const track = MEDIA_PLAYLIST[index];
            const audio = document.getElementById("audio-player");
            const video = document.getElementById("video-player");
            const videoContainer = document.getElementById("video-container");
            const title = document.getElementById("media-playing-title");
            const typeLabel = document.getElementById("media-playing-type");
            
            title.innerHTML = track.title;
            typeLabel.innerHTML = `Format: ${track.type.toUpperCase()} | Duration: ${track.duration} | Relative Offline Link`;
            
            // Single-file local streaming path using Directory Junction
            const relativeSrc = `knowledge/${track.file}`;
            
            if (track.type === "audio") {
                video.pause();
                videoContainer.classList.add("hidden");
                
                audio.src = relativeSrc;
                audio.style.display = "block";
                audio.playbackRate = state.playbackSpeed;
                audio.load();
                audio.play().catch(err => console.log("Media play block.", err));
            } else {
                audio.pause();
                audio.style.display = "none";
                
                video.src = relativeSrc;
                videoContainer.classList.remove("hidden");
                video.playbackRate = state.playbackSpeed;
                video.load();
                video.play().catch(err => console.log("Media play block.", err));
            }
        }

        function renderProgressionDashboard() {
            renderTimelineRoadmap();
            renderPhq9SeverityDashboard();
            drawPhq9HistoryChart();
        }

        function renderTimelineRoadmap() {
            const container = document.getElementById("progression-timeline-container");
            container.innerHTML = "";
            
            const activeLayer = state.currentLayer;
            const totalFloorDays = state.history.filter(log => log.floorCompleted).length;
            
            ROADMAP_LAYERS.forEach(layer => {
                const item = document.createElement("div");
                let statusClass = ""; 
                let badgeLabel = "";
                
                if (layer.num < activeLayer) {
                    statusClass = "completed";
                    badgeLabel = "Completed";
                } else if (layer.num === activeLayer) {
                    statusClass = "active";
                    badgeLabel = "Active Stage";
                } else {
                    statusClass = "locked";
                    badgeLabel = `Locked (Req: ${layer.req} Floor Wins)`;
                }
                
                item.className = `timeline-item ${statusClass}`;
                item.innerHTML = `
                    <div class="timeline-circle"></div>
                    <div class="timeline-content-card">
                        <div class="flex-between">
                            <span class="timeline-layer-num">Layer ${layer.num}</span>
                            <span class="badge ${statusClass === 'completed' ? 'badge-high' : (statusClass === 'active' ? 'badge-medium' : 'badge-low')}" style="font-size: 0.65rem; font-weight:600; padding:0.15rem 0.4rem;">
                                ${badgeLabel}
                            </span>
                        </div>
                        <div class="timeline-layer-title">${layer.title}</div>
                        <div class="timeline-layer-desc">${layer.desc}</div>
                        ${layer.num > activeLayer ? `<div class="timeline-layer-desc text-orange" style="font-size:0.75rem; font-weight:500; margin-top:0.4rem;">Requires ${layer.req - totalFloorDays} more Floor Wins to unlock.</div>` : ''}
                    </div>
                `;
                container.appendChild(item);
            });
        }

        function renderPhq9SeverityDashboard() {
            const severityText = document.getElementById("phq-current-severity");
            const scoreText = document.getElementById("phq-current-score");
            
            if (state.phq9History.length === 0) {
                severityText.innerHTML = "Not Assessed";
                severityText.className = "text-muted";
                scoreText.innerHTML = "--";
                return;
            }
            
            const lastAssessment = state.phq9History[state.phq9History.length - 1];
            scoreText.innerHTML = lastAssessment.score;
            severityText.innerHTML = lastAssessment.severity;
            
            const score = lastAssessment.score;
            if (score < 5) severityText.className = "text-teal";
            else if (score < 10) severityText.className = "text-teal";
            else if (score < 15) severityText.className = "text-orange";
            else if (score < 20) severityText.className = "text-orange";
            else severityText.className = "text-red";
        }

        function openPhqAssessmentModal() {
            const container = document.getElementById("phq-questions-container");
            container.innerHTML = "";
            
            tempPhqAnswers = new Array(9).fill(null);
            PHQ9_QUESTIONS.forEach((q, idx) => {
                const row = document.createElement("div");
                row.className = "phq-row";
                row.innerHTML = `
                    <div class="phq-question">${idx + 1}. ${q}</div>
                    <div class="phq-options" data-qidx="${idx}">
                        <button class="phq-btn" data-val="0">Not at all</button>
                        <button class="phq-btn" data-val="1">Several days</button>
                        <button class="phq-btn" data-val="2">More than half</button>
                        <button class="phq-btn" data-val="3">Nearly every day</button>
                    </div>
                `;
                
                row.querySelectorAll(".phq-btn").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        const val = parseInt(e.target.getAttribute("data-val"));
                        row.querySelectorAll(".phq-btn").forEach(b => b.classList.remove("selected"));
                        e.target.classList.add("selected");
                        tempPhqAnswers[idx] = val;
                    });
                });
                container.appendChild(row);
            });
            
            document.getElementById("phq9-modal").classList.add("active");
        }

        function closePhqAssessmentModal() {
            document.getElementById("phq9-modal").classList.remove("active");
        }

        function submitPhqAssessment() {
            const unanswered = tempPhqAnswers.findIndex(ans => ans === null);
            if (unanswered !== -1) {
                alert(`Please answer all questions. Question ${unanswered + 1} is missing.`);
                return;
            }
            
            const score = tempPhqAnswers.reduce((sum, val) => sum + val, 0);
            
            let severity = "Minimal Depression";
            if (score >= 20) severity = "Severe Depression";
            else if (score >= 15) severity = "Moderately Severe";
            else if (score >= 10) severity = "Moderate Depression";
            else if (score >= 5) severity = "Mild Depression";
            
            const today = getTodayString();
            state.phq9History.push({
                date: today,
                score: score,
                severity: severity
            });
            
            const q9SuicidalityScore = tempPhqAnswers[8];
            if (q9SuicidalityScore >= 1) {
                state.safety.suicide = 2;
                triggerCrisisOverlay();
            }
            
            saveState();
            closePhqAssessmentModal();
            renderProgressionDashboard();
        }

        function drawPhq9HistoryChart() {
            const svg = document.getElementById("phq-history-svg");
            const emptyText = document.getElementById("chart-empty-text");
            svg.innerHTML = "";
            
            if (state.phq9History.length === 0) {
                emptyText.classList.remove("hidden");
                return;
            }
            emptyText.classList.add("hidden");
            
            const history = state.phq9History;
            const paddingLeft = 30;
            const paddingRight = 10;
            const paddingTop = 15;
            const paddingBottom = 25;
            
            const width = svg.clientWidth || 300;
            const height = svg.clientHeight || 200;
            
            const chartWidth = width - paddingLeft - paddingRight;
            const chartHeight = height - paddingTop - paddingBottom;
            
            const gridYValues = [0, 5, 10, 15, 20, 27];
            gridYValues.forEach(yVal => {
                const yCoord = chartHeight + paddingTop - (yVal / 27) * chartHeight;
                
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", paddingLeft);
                line.setAttribute("y1", yCoord);
                line.setAttribute("x2", width - paddingRight);
                line.setAttribute("y2", yCoord);
                line.setAttribute("class", "chart-grid");
                svg.appendChild(line);
                
                const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
                txt.setAttribute("x", paddingLeft - 8);
                txt.setAttribute("y", yCoord + 3);
                txt.setAttribute("class", "chart-text");
                txt.setAttribute("style", "text-anchor: end;");
                txt.textContent = yVal;
                svg.appendChild(txt);
            });

            const points = [];
            const count = history.length;
            
            history.forEach((entry, idx) => {
                const xCoord = paddingLeft + (count > 1 ? (idx / (count - 1)) * chartWidth : chartWidth / 2);
                const yCoord = chartHeight + paddingTop - (entry.score / 27) * chartHeight;
                points.push({ x: xCoord, y: yCoord, data: entry });
            });
            
            if (points.length > 1) {
                let pathD = `M ${points[0].x} ${points[0].y}`;
                for (let i = 1; i < points.length; i++) {
                    pathD += ` L ${points[i].x} ${points[i].y}`;
                }
                
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", pathD);
                path.setAttribute("class", "chart-line");
                svg.appendChild(path);
            }
            
            points.forEach(pt => {
                const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute("cx", pt.x);
                dot.setAttribute("cy", pt.y);
                dot.setAttribute("r", 5);
                dot.setAttribute("class", "chart-dot");
                
                const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "title");
                tooltip.textContent = `Date: ${pt.data.date}\nScore: ${pt.data.score}\nSeverity: ${pt.data.severity}`;
                dot.appendChild(tooltip);
                svg.appendChild(dot);
                
                const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
                txt.setAttribute("x", pt.x);
                txt.setAttribute("y", height - 6);
                txt.setAttribute("class", "chart-text");
                
                const parts = pt.data.date.split("-");
                txt.textContent = parts.length === 3 ? `${parts[1]}/${parts[2]}` : pt.data.date;
                svg.appendChild(txt);
            });
        }

        let breatheInterval = null;
        function triggerBreathingModal() {
            const modal = document.getElementById("breath-modal");
            const subtitle = document.getElementById("breath-mantra-subtitle");
            const pacer = document.getElementById("pacer-circle");
            const phaseText = document.getElementById("breath-phase-text");
            const ring = document.getElementById("breath-progress-ring");
            
            subtitle.innerHTML = `"${state.customMantra}"`;
            modal.classList.add("active");
            
            if (ring) {
                ring.style.transition = "stroke-dashoffset 4000ms ease-in-out, filter 1000ms ease-in-out";
                ring.style.strokeDashoffset = "251.2";
                ring.getBoundingClientRect();
                setTimeout(() => {
                    ring.style.strokeDashoffset = "0";
                    ring.style.filter = "drop-shadow(0 0 10px var(--accent-teal))";
                }, 50);
            }
            
            let phase = 0; 
            phaseText.innerHTML = "Inhale...";
            pacer.style.transform = "scale(1.4)";
            
            breatheInterval = setInterval(() => {
                phase = (phase + 1) % 4;
                if (phase === 0) {
                    phaseText.innerHTML = "Inhale...";
                    pacer.style.transform = "scale(1.4)";
                    if (ring) {
                        ring.style.strokeDashoffset = "0";
                        ring.style.filter = "drop-shadow(0 0 10px var(--accent-teal))";
                    }
                } else if (phase === 1) {
                    phaseText.innerHTML = "Hold...";
                    if (ring) {
                        ring.style.filter = "drop-shadow(0 0 16px var(--accent-teal))";
                    }
                } else if (phase === 2) {
                    phaseText.innerHTML = "Exhale (Repeat Mantra aloud)...";
                    pacer.style.transform = "scale(1.0)";
                    if (ring) {
                        ring.style.strokeDashoffset = "251.2";
                        ring.style.filter = "drop-shadow(0 0 10px var(--accent-lavender))";
                    }
                } else if (phase === 3) {
                    phaseText.innerHTML = "Hold...";
                    if (ring) {
                        ring.style.filter = "drop-shadow(0 0 4px var(--accent-lavender))";
                    }
                }
            }, 4000);
        }

        function closeBreathingModal() {
            document.getElementById("breath-modal").classList.remove("active");
            if (breatheInterval) {
                clearInterval(breatheInterval);
                breatheInterval = null;
            }
        }

        function renderQuickSafety() {
            document.getElementById("quick-reasons-live").innerText = state.reasonsLive || "No custom reasons to live recorded. You can add them in settings or intake.";
            document.getElementById("quick-safe-contacts").innerText = state.safeContacts || "No custom safe contacts recorded. You can add them in settings or intake.";
            document.getElementById("quick-safety-modal").classList.add("active");
        }

        function generateProgressBriefing() {
            const totalFloorWins = state.history.filter(log => log.floorCompleted).length;
            const statsResilience = calculateResilienceRate();
            const lastAssessment = state.phq9History[state.phq9History.length - 1];
            
            let markdown = `## CLINICAL STATUS REPORT & PROGRESS BRIEF\n`;
            markdown += `*Generated offline, privately, on State, Not Fate OS.*\n\n`;
            markdown += `### 📈 Executive Recovery Summary\n`;
            markdown += `- **Current Hope Level:** Level ${state.currentHopeLevel} (${state.hopeProgress}%)\n`;
            markdown += `- **Active Roadmap Stage:** Layer ${state.currentLayer} (${ROADMAP_LAYERS[state.currentLayer].title})\n`;
            markdown += `- **Cumulative Floor Wins:** ${totalFloorWins} successful MVD Days\n`;
            markdown += `- **Calculated Resilience Rate:** ${statsResilience}% (miss-to-restart recovery factor)\n`;
            markdown += `- **Dominant Clinical Intake Pattern:** ${state.dominantPattern}\n\n`;
            
            markdown += `### 📊 PHQ-9 Symptom Progression History\n`;
            if (state.phq9History.length === 0) {
                markdown += `*No PHQ-9 symptoms logged in database yet.*\n\n`;
            } else {
                markdown += `| Date | Score | Severity Classification |\n`;
                markdown += `|---|---|---|\n`;
                state.phq9History.forEach(h => {
                    markdown += `| ${h.date} | **${h.score}** | ${h.severity} |\n`;
                });
                markdown += `\n`;
            }
            
            markdown += `### 📝 Completed Restructured Cognitive Worksheets\n`;
            if (state.thoughtCorrections.length === 0) {
                markdown += `*No thought restructuring sheets completed yet.*\n\n`;
            } else {
                state.thoughtCorrections.forEach((tc, idx) => {
                    markdown += `#### restruct-${idx + 1} (${tc.date})\n`;
                    markdown += `- **Automatic Negative Thought (ANT):** *${tc.ant}*\n`;
                    markdown += `- **Socratic Evidence Check:** ${tc.challenge}\n`;
                    markdown += `- **Empirical Cognitive Rewrite:** **"${tc.rewrite}"**\n\n`;
                });
            }
            
            markdown += `### 📝 Micro-Moment Wins & Relief Journal\n`;
            if (state.gratitudeJournal.length === 0) {
                markdown += `*No relief logs written yet.*\n\n`;
            } else {
                state.gratitudeJournal.forEach((g, idx) => {
                    markdown += `- **${g.date}**: Relief: *${g.relief}* | Possibility: *${g.possibility}*\n`;
                });
                markdown += `\n`;
            }
            
            markdown += `### ⚙️ Current Treatment Configuration\n`;
            markdown += `- **Counter-Script Identity Mantra:** "${state.customMantra}"\n`;
            markdown += `- **Minimum Viable Day (MVD) Anchors:**\n`;
            state.mvd.forEach((task, idx) => {
                markdown += `  ${idx + 1}. ${task}\n`;
            });
            if (state.customTasks && state.customTasks.length > 0) {
                markdown += `- **Additional Prescribed Routines:**\n`;
                state.customTasks.forEach(t => {
                    markdown += `  - ${t}\n`;
                });
            }
            
            document.getElementById("textarea-export-briefing").value = markdown;
            document.getElementById("export-modal").classList.add("active");
        }

        // ==========================================================
        // COGNITIVE LAB (DAILY GRATITUDE JOURNAL & THOUGHT WORKSHEET)
        // ==========================================================

        function renderCognitiveLab() {
            renderGratitudeJournalList();
            renderThoughtCorrectionList();
            renderCustomizer();
        }

        function renderGratitudeJournalList() {
            const container = document.getElementById("gratitude-history-container");
            container.innerHTML = "";
            
            if (state.gratitudeJournal.length === 0) {
                container.innerHTML = `<div class="text-muted center-text py-2" style="font-size:0.85rem;">No gratitude entries recorded yet. Write your first entry above.</div>`;
                return;
            }
            
            [...state.gratitudeJournal].reverse().forEach((item, index) => {
                const realIdx = state.gratitudeJournal.length - 1 - index;
                const entryCard = document.createElement("div");
                entryCard.className = "linked-file-item";
                entryCard.style.flexDirection = "column";
                entryCard.style.alignItems = "stretch";
                entryCard.style.gap = "0.25rem";
                entryCard.style.padding = "0.75rem";
                
                entryCard.innerHTML = `
                    <div class="flex-between">
                        <span class="text-teal" style="font-size: 0.75rem; font-weight: 600; font-family: monospace;">${item.date}</span>
                        <button class="linked-file-remove" onclick="removeGratitudeEntry(${realIdx})" style="background:none; border:none; color:var(--accent-red); cursor:pointer; font-size:1.1rem; line-height:1;">×</button>
                    </div>
                    <div style="font-size: 0.85rem; margin-top: 0.25rem; color: var(--text-primary); line-height: 1.4;">
                        <strong>Moments of Relief:</strong> ${item.relief}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 0.25rem; margin-top: 0.25rem; line-height: 1.4;">
                        <strong>Possibility for Tomorrow:</strong> ${item.possibility}
                    </div>
                `;
                container.appendChild(entryCard);
            });
        }

        function saveGratitudeEntry() {
            const reliefInput = document.getElementById("input-gratitude-relief");
            const possibilityInput = document.getElementById("input-gratitude-possibility");
            const relief = reliefInput.value.trim();
            const possibility = possibilityInput.value.trim();
            
            if (!relief || !possibility) {
                alert("Please complete both the Micro-Moment Win and Tomorrow's Possibility fields.");
                return;
            }
            
            const today = getTodayString();
            state.gratitudeJournal.push({
                date: today,
                relief: relief,
                possibility: possibility
            });
            
            logActionCompletion("Gratitude / Possibility Note Written");
            saveState();
            renderGratitudeJournalList();
            
            reliefInput.value = "";
            possibilityInput.value = "";
        }

        function removeGratitudeEntry(index) {
            if (confirm("Are you sure you want to delete this gratitude log entry?")) {
                state.gratitudeJournal.splice(index, 1);
                saveState();
                renderGratitudeJournalList();
            }
        }

        function renderThoughtCorrectionList() {
            const container = document.getElementById("thought-history-container");
            container.innerHTML = "";
            
            if (state.thoughtCorrections.length === 0) {
                container.innerHTML = `<div class="text-muted center-text py-2" style="font-size:0.85rem;">No thought corrections completed yet. Try challenging an automatic thought above.</div>`;
                return;
            }
            
            [...state.thoughtCorrections].reverse().forEach((item, index) => {
                const realIdx = state.thoughtCorrections.length - 1 - index;
                const entryCard = document.createElement("div");
                entryCard.className = "linked-file-item";
                entryCard.style.flexDirection = "column";
                entryCard.style.alignItems = "stretch";
                entryCard.style.gap = "0.35rem";
                entryCard.style.padding = "0.75rem";
                entryCard.style.borderLeft = "2px solid var(--accent-teal)";
                
                entryCard.innerHTML = `
                    <div class="flex-between">
                        <span class="text-lavender" style="font-size: 0.75rem; font-weight: 600; font-family: monospace;">${item.date}</span>
                        <button class="linked-file-remove" onclick="removeThoughtCorrection(${realIdx})" style="background:none; border:none; color:var(--accent-red); cursor:pointer; font-size:1.1rem; line-height:1;">×</button>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--accent-red); text-decoration: line-through; opacity: 0.75; line-height: 1.4;">
                        <strong>ANT:</strong> "${item.ant}"
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
                        <strong>Evidence check:</strong> ${item.challenge}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--accent-teal); font-weight: 500; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 0.25rem; line-height: 1.4;">
                        <strong>Rewrite:</strong> "${item.rewrite}"
                    </div>
                `;
                container.appendChild(entryCard);
            });
        }

        function saveThoughtCorrection() {
            const antInput = document.getElementById("input-thought-ant");
            const challengeInput = document.getElementById("input-thought-challenge");
            const rewriteInput = document.getElementById("input-thought-rewrite");
            
            const ant = antInput.value.trim();
            const challenge = challengeInput.value.trim();
            const rewrite = rewriteInput.value.trim();
            
            if (!ant || !challenge || !rewrite) {
                alert("Please complete all three steps of the Thought Challenge worksheet.");
                return;
            }
            
            const today = getTodayString();
            state.thoughtCorrections.push({
                date: today,
                ant: ant,
                challenge: challenge,
                rewrite: rewrite
            });
            logActionCompletion("Thought Correction Worksheet Completed");
            saveState();
            renderThoughtCorrectionList();
            
            antInput.value = "";
            challengeInput.value = "";
            rewriteInput.value = "";
        }

        function removeThoughtCorrection(index) {
            if (confirm("Are you sure you want to delete this completed worksheet?")) {
                state.thoughtCorrections.splice(index, 1);
                saveState();
                renderThoughtCorrectionList();
            }
        }

        // ==========================================================
        // DOCUMENT CENTER & FILE SYSTEM NAVIGATOR ENGINE
        // ==========================================================

        const KNOWLEDGE_CATALOG = [
            { name: "00_Project_File_Map_Comprehensive.pdf", type: "pdf", size: "6.5 KB", desc: "Comprehensive mapping of all core documents, scripts, and media files in the recovery suite." },
            { name: "00_READ_THIS_FIRST_COMPREHENSIVE.pdf", type: "pdf", size: "7.2 KB", desc: "Crucial initial briefing outlining installation steps, troubleshooting launcher, and browser CORS solutions." },
            { name: "01_2026 All Documents.pdf", type: "pdf", size: "404.4 KB", desc: "Compiled clinical data, guides, and worksheets for the 2026 depression project elements." },
            { name: "01_Current_Main_Elements_Expanded.pdf", type: "pdf", size: "9.8 KB", desc: "Expanded reference documenting the core features of the interactive main frame SPA." },
            { name: "01_Front_End_Preamble_Expanded.pdf", type: "pdf", size: "6.0 KB", desc: "Preamble briefing explaining the mechanical model of depression functioning burden." },
            { name: "02_Depression_Project_Program_Expanded.pdf", type: "pdf", size: "13.4 KB", desc: "Outlines the 10-layer clinical roadmap, layer requirements, and behavior guidelines." },
            { name: "02_Front_End_Questionnaire_Expanded.pdf", type: "pdf", size: "8.9 KB", desc: "Expanded guide to the accordion intake forms and diagnostic burdent mapping metrics." },
            { name: "03_Depression_Project_Outline_Expanded.pdf", type: "pdf", size: "12.1 KB", desc: "An expanded operational outline documenting the startup damage and initiation models." },
            { name: "03_Front_End_Intake_Guide_Expanded.pdf", type: "pdf", size: "10.5 KB", desc: "Comprehensive companion manual for the onboarding, mantras, and safety plan inputs." },
            { name: "04_Hope_System_Front_End_Expanded.pdf", type: "pdf", size: "6.0 KB", desc: "Clinical blueprint explaining the proof-based hope sequence and its progression math." },
            { name: "05_User_Testimonial_and_Design_Rationale.pdf", type: "pdf", size: "7.1 KB", desc: "Presents early feedback data and clinical evidence for low-shame downscaling checklists." },
            { name: "06_Evidence_and_Design_Rationale.pdf", type: "pdf", size: "8.8 KB", desc: "NICE/VA guidelines alignment details and professional reviews cooperation brief." },
            { name: "State_Not_Fate_Revised_Comprehensive_Clinical_Overview.docx", type: "docx", size: "41.7 KB", desc: "A comprehensive Microsoft Word clinical overview guide of the recovery suite's medical paradigm." },
            { name: "emergency_appendix_living_with_suicidal_thoughts_scrubbed.rtf", type: "rtf", size: "12.8 KB", desc: "Appendix document detailing critical crisis handling, coping tactics, and self-support bridges." },
            // Media tracks
            { name: "Treating_depression_as_a_systems_failure.m4a", type: "audio", size: "34.7 MB", desc: "Guide on treating depression as an operational systems failure rather than identity." },
            { name: "The_Reprogramming_Protocol__Debugging_Depression.mp4", type: "video", size: "58.9 MB", desc: "Video overview on reprograming automatic self-talk and building consistency." },
            { name: "State,_Not_A_Fate.mp4", type: "video", size: "70.4 MB", desc: "Core clinical documentary detailing the foundational theories and evidence base." },
            { name: "Stop_treating_depression_like_broken_bones.m4a", type: "audio", size: "34.0 MB", desc: "Audio briefing on why standard recovery models fail and the need for low floors." },
            { name: "The_Broken_Firmware__A_Mechanical_Guide_to_Depression.mp4", type: "video", size: "46.2 MB", desc: "Visual guide to the broken biological clock and task-initiation failure systems." },
            { name: "The_Depression_Project.mp4", type: "video", size: "58.7 MB", desc: "Outlines the primary patterns and dynamic checklist energy downscaling triggers." },
            { name: "Depression_is_a_mechanical_system_failure.m4a", type: "audio", size: "40.8 MB", desc: "Audio podcast covering the mechanical models, light signals, and baseline wins." },
            { name: "Developing_a_Clinical_Trial_Community_Outreach_Action_Plan.mp4", type: "video", size: "33.9 MB", desc: "Visual blueprint for setting up community review groups and guideline alignments." },
            { name: "Why_recovery_requires_proof_not_inspiration.m4a", type: "audio", size: "44.7 MB", desc: "Audio guide showing how action creates proof, which builds biological hope." },
            { name: "The_Mechanics_of_State_vs.mp4", type: "video", size: "46.5 MB", desc: "Expanded video guide explaining the mechanics of state vs fate models." },
            { name: "6_minute_synopsis.mp4", type: "video", size: "33.8 MB", desc: "Quick 6-minute synopsis explaining the core main frame mechanics." }
        ];

        function renderDocumentCenter() {
            renderDocPhqHistory();
            renderDocWorksheets();
            renderDocCatalog();
        }

        function renderDocPhqHistory() {
            const tbody = document.getElementById("doc-phq-table-body");
            tbody.innerHTML = "";
            
            if (state.phq9History.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="text-muted center-text py-2" style="font-size:0.85rem;">No assessments recorded yet.</td></tr>`;
                return;
            }
            
            [...state.phq9History].reverse().forEach((item, index) => {
                const realIdx = state.phq9History.length - 1 - index;
                const row = document.createElement("tr");
                row.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
                
                row.innerHTML = `
                    <td style="padding:0.5rem; font-family:monospace; color:var(--text-secondary);">${item.date}</td>
                    <td style="padding:0.5rem; text-align:center; font-weight:600; color:var(--accent-lavender);">${item.score}</td>
                    <td style="padding:0.5rem; color:var(--text-secondary);">${item.severity}</td>
                    <td style="padding:0.5rem; text-align:center;">
                        <button class="linked-file-remove" onclick="deleteDocPhqEntry(${realIdx})" style="background:none; border:none; color:var(--accent-red); cursor:pointer; font-size:1rem;">×</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function deleteDocPhqEntry(index) {
            if (confirm("Are you sure you want to delete this clinical assessment log?")) {
                state.phq9History.splice(index, 1);
                saveState();
                renderDocumentCenter();
                renderProgressionDashboard();
            }
        }

        function renderDocWorksheets() {
            const container = document.getElementById("doc-worksheets-list-container");
            container.innerHTML = "";
            
            const entries = [];
            
            state.gratitudeJournal.forEach((item, idx) => {
                entries.push({
                    type: "Gratitude Log",
                    date: item.date,
                    content: `<strong>relief wins:</strong> "${item.relief}" <br><strong>hopes:</strong> "${item.possibility}"`,
                    color: "var(--accent-teal)",
                    rawIdx: idx,
                    removeFn: `removeGratitudeEntry`
                });
            });
            
            state.thoughtCorrections.forEach((item, idx) => {
                entries.push({
                    type: "CBT Challenge",
                    date: item.date,
                    content: `<strong>ANT:</strong> <span style="text-decoration:line-through; opacity:0.75; color:var(--accent-red);">${item.ant}</span><br><strong>facts:</strong> ${item.challenge}<br><strong>rewrite:</strong> <span class="text-teal">${item.rewrite}</span>`,
                    color: "var(--accent-lavender)",
                    rawIdx: idx,
                    removeFn: `removeThoughtCorrection`
                });
            });
            
            // Sort by date descending
            entries.sort((a,b) => b.date.localeCompare(a.date));
            
            if (entries.length === 0) {
                container.innerHTML = `<div class="text-muted center-text py-2" style="font-size:0.85rem;">No cognitive worksheets completed yet.</div>`;
                return;
            }
            
            entries.forEach(entry => {
                const card = document.createElement("div");
                card.className = "linked-file-item";
                card.style.flexDirection = "column";
                card.style.alignItems = "stretch";
                card.style.padding = "0.6rem 0.8rem";
                card.style.gap = "0.25rem";
                card.style.borderLeft = `2px solid ${entry.color}`;
                
                card.innerHTML = `
                    <div class="flex-between" style="font-size: 0.75rem;">
                        <span style="font-weight:600; color:${entry.color};">${entry.type}</span>
                        <div style="display:flex; gap:0.5rem; align-items:center;">
                            <span class="text-muted" style="font-family:monospace;">${entry.date}</span>
                            <button class="linked-file-remove" onclick="${entry.removeFn}(${entry.rawIdx}); setTimeout(renderDocumentCenter, 100);" style="background:none; border:none; color:var(--accent-red); cursor:pointer; font-size:1rem; line-height:1;">×</button>
                        </div>
                    </div>
                    <div style="font-size: 0.8rem; line-height:1.4; color:var(--text-secondary);">
                        ${entry.content}
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function renderDocCatalog() {
            filterDocumentExplorer();
        }

        function filterDocumentExplorer() {
            const query = document.getElementById("input-explorer-search").value.trim().toLowerCase();
            const container = document.getElementById("explorer-catalog-container");
            container.innerHTML = "";
            
            const filtered = KNOWLEDGE_CATALOG.filter(file => {
                return file.name.toLowerCase().includes(query) || file.type.toLowerCase().includes(query) || file.desc.toLowerCase().includes(query);
            });
            
            if (filtered.length === 0) {
                container.innerHTML = `<div class="text-muted center-text py-2" style="font-size:0.8rem;">No documents matching "${query}" found.</div>`;
                return;
            }
            
            filtered.forEach(file => {
                const card = document.createElement("div");
                card.className = "linked-file-item";
                card.style.padding = "0.6rem 0.8rem";
                card.style.flexDirection = "column";
                card.style.alignItems = "stretch";
                card.style.gap = "0.25rem";
                
                let badgeClass = "badge-low";
                if (file.type === "pdf") badgeClass = "badge-high";
                else if (file.type === "video" || file.type === "audio") badgeClass = "badge-medium";
                
                card.innerHTML = `
                    <div class="flex-between">
                        <div style="display:flex; gap:0.4rem; align-items:center; overflow:hidden;">
                            <span class="badge ${badgeClass}" style="font-size:0.6rem; padding:0.15rem 0.35rem; font-family:monospace; text-transform:uppercase;">${file.type}</span>
                            <span style="font-size:0.85rem; font-weight:500; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${file.name}</span>
                        </div>
                        <div style="display:flex; gap:0.5rem; align-items:center;">
                            <span class="text-muted" style="font-size:0.75rem; font-family:monospace;">${file.size}</span>
                            <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('knowledge/${file.name}'); alert('Relative offline path copied!')" style="padding:0.25rem 0.5rem; font-size:0.7rem;">Copy Path</button>
                        </div>
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.35; padding-top:0.15rem;">
                        ${file.desc}
                    </div>
                `;
                container.appendChild(card);
            });
        }

        // ==========================================================
        // CLINICIAN'S ADAPTIVE PLAN CUSTOMIZER ENGINE
        // ==========================================================

        function renderCustomizer() {
            // Populate MVD inputs
            document.getElementById("input-custom-mvd1").value = state.mvd[0] || "";
            document.getElementById("input-custom-mvd2").value = state.mvd[1] || "";
            document.getElementById("input-custom-mvd3").value = state.mvd[2] || "";
            
            // Render custom tasks list
            renderCustomTasksList();
        }

        function renderCustomTasksList() {
            const container = document.getElementById("custom-tasks-container");
            container.innerHTML = "";
            
            if (!state.customTasks || state.customTasks.length === 0) {
                container.innerHTML = `<div class="text-muted center-text py-2" style="font-size:0.8rem;">No custom checklist tasks added yet. Add one above.</div>`;
                return;
            }
            
            state.customTasks.forEach((task, index) => {
                const item = document.createElement("div");
                item.className = "linked-file-item";
                item.style.padding = "0.4rem 0.6rem";
                item.style.fontSize = "0.8rem";
                item.innerHTML = `
                    <div style="flex:1; color:var(--text-secondary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
                        ${task}
                    </div>
                    <button class="linked-file-remove" onclick="removeCustomTask(${index})" style="background:none; border:none; color:var(--accent-red); cursor:pointer; font-size:1rem; line-height:1; padding:0 0.25rem;">×</button>
                `;
                container.appendChild(item);
            });
        }

        function addCustomTask() {
            const input = document.getElementById("input-custom-task");
            const val = input.value.trim();
            
            if (!val) {
                alert("Please enter a custom checklist task label.");
                return;
            }
            
            if (!state.customTasks) state.customTasks = [];
            state.customTasks.push(val);
            input.value = "";
            renderCustomTasksList();
        }

        function removeCustomTask(index) {
            if (state.customTasks) {
                state.customTasks.splice(index, 1);
                renderCustomTasksList();
            }
        }

        function saveCustomTreatment() {
            const mvd1 = document.getElementById("input-custom-mvd1").value.trim();
            const mvd2 = document.getElementById("input-custom-mvd2").value.trim();
            const mvd3 = document.getElementById("input-custom-mvd3").value.trim();
            
            if (!mvd1 || !mvd2 || !mvd3) {
                alert("Your Minimum Viable Day (MVD) Floor must have all 3 tasks defined to protect your self-trust.");
                return;
            }
            
            state.mvd = [mvd1, mvd2, mvd3];
            saveState();
            
            alert("Treatment Plan customization saved successfully! Your daily checklist is updated.");
            renderDashboard();
        }

        function resetChecklistToDefaults() {
            if (confirm("Are you sure you want to reset your checklist and MVD Floor to the system default clinical settings?")) {
                state.mvd = [ ...DEFAULT_STATE.mvd ];
                state.customTasks = [];
                saveState();
                renderCustomizer();
                renderDashboard();
            }
        }

        function loadClinicalTemplate(type) {
            if (confirm(`Are you sure you want to load Clinical Template: ${type.toUpperCase()}? This will override your current MVD floor and custom tasks.`)) {
                if (type === 'circadian') {
                    state.mvd = [
                        "Wake on workdays by 7:00am and take morning medication immediately.",
                        "Sync biological clock: stand in bright daylight/outdoor light for 10 minutes.",
                        "Turn off all bright overhead lights and screens by 10:00pm."
                    ];
                    state.customTasks = [
                        "Strict same-time sleep wind-down routine starting at 9:30pm",
                        "Cut off all caffeine intake by 12:00pm",
                        "Log evening light levels inside your room"
                    ];
                } else if (type === 'environmental') {
                    state.mvd = [
                        "Keep tomorrow's clothes and shoes pre-positioned by the door.",
                        "Clear and reset exactly 1 visible surface zone (anti-chaos swipe).",
                        "Complete a focused 5-minute environmental trash swipe."
                    ];
                    state.customTasks = [
                        "Reset kitchen sink and dry all dishes before energy crash",
                        "Sort and file 3 letters/papers to reduce administrative drag",
                        "Perform a 10-minute bedroom floor clutter swipe"
                    ];
                } else if (type === 'graded') {
                    state.mvd = [
                        "Take morning medicines alongside a full glass of water.",
                        "Execute the 10-Second Rule: sit on the edge of the bed for 10 seconds.",
                        "Perform a 2-minute stretch or walk to the mailbox and back."
                    ];
                    state.customTasks = [
                        "Complete exactly 5 minutes of graded physical movement",
                        "Open one single envelope or write down one calendar item",
                        "Log one micro-win to prove consequence follows action"
                    ];
                } else if (type === 'lowshame') {
                    state.mvd = [
                        "Repeat your Identity Shield Mantra aloud upon waking up.",
                        "Brush teeth once and drink water to preserve basic hygiene floor.",
                        "Tell yourself: 'I am allowed to restart today without moral punishment.'"
                    ];
                    state.customTasks = [
                        "Send exactly 1 low-threat connection text to Dave or Dave ('thinking of you, zero pressure to reply')",
                        "Spend 10 minutes resting in a public space/park without performative pressure",
                        "Practice breathing guides for 3 minutes to downregulate the nervous system"
                    ];
                }
                
                saveState();
                renderCustomizer();
                renderDashboard();
                alert(`Clinical Template loaded successfully! Your MVD Floor and Active checklists are updated.`);
            }
        }

        window.onload = init;