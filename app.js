// INJECTED JAVASCRIPT Logic Engine
        let PolarisEnhancedSafety = null;
        let SafetyDetectionModule = null;
        let CrisisProtocol = null;
        let safetyDetection = null;
        let polarisEnhanced = null;

        async function loadSafetyModules() {
            try {
                const detectionMod = await import('./src/safety-detection.js');
                const protocolMod = await import('./src/crisis-protocol.js');
                const integrationMod = await import('./src/polaris-safety-integration.js');
                
                SafetyDetectionModule = detectionMod.default || detectionMod.SafetyDetectionModule;
                CrisisProtocol = protocolMod.default || protocolMod.CrisisProtocol;
                PolarisEnhancedSafety = integrationMod.default || integrationMod.PolarisEnhancedSafety;
                
                // Initialize safety modules
                safetyDetection = new SafetyDetectionModule(state);
                polarisEnhanced = new PolarisEnhancedSafety(state);
                
                console.log("Polaris Enhanced Safety modules loaded successfully.");
            } catch (err) {
                console.error("Failed to load Polaris Enhanced Safety modules:", err);
            }
        }

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
            isLocked: false,
            userAnchors: [],
            firstUseDate: '',
            tomorrowAnchor: '',
            personalBests: { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null },
            polarisUpgrade: false,
            polarisHistory: [],
            polarisRestartLogs: [],
            lastVisitDate: '',
            reEntry: {
                lastSeenDate: null,
                missedDays: 0,
                lastMessageType: null
            },
            futureNarrowing: "action",
            startupDrag: "none",
            rumination: "redirect",
            socialIsolation: "neutral",
            externalAnchor: "none",
            ruminationLogs: [],
            safetyJournal: [],
            parablesCompleted: {},
            lastCrisisEvent: null,
            caringContactStage: 0,
            safeboxLogs: []
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
            { title: "Developing a Trial Outreach Plan", file: "Developing_a_Trial_Community_Outreach_Action_Plan.mp4", type: "video", duration: "47:04" },
            { title: "Why recovery requires proof not inspiration", file: "Why_recovery_requires_proof_not_inspiration.m4a", type: "audio", duration: "1:02:07" },
            { title: "The Mechanics of State vs. Fate", file: "The_Mechanics_of_State_vs.mp4", type: "video", duration: "47:55" },
            { title: "The 6-Minute System Synopsis", file: "6_minute_synopsis.mp4", type: "video", duration: "6:00" }
        ];
const COMPANION_QUESTION_TREE = {
    "q1": { text: "I feel slowed down or weighed down much of the day.", next: {'0': 'q2', '1': 'q2', '2': 'q1_a', '3': 'q1_a', '4': 'q1_a', 'default': 'q2'} },
    "q1_a": { text: "What daily activities are most impacted when you feel slowed down or weighed down?", next: {'default': 'q2'} },
    "q2": { text: "My day feels harder to start than it should.", next: {'0': 'q3', '1': 'q3', '2': 'q2_a', '3': 'q2_a', '4': 'q2_a', 'default': 'q3'} },
    "q2_a": { text: "What specific factors make starting your day particularly challenging?", next: {'default': 'q3'} },
    "q3": { text: "My depressive state is reducing how much life I can carry.", next: {'0': 'q4', '1': 'q4', '2': 'q3_a', '3': 'q3_a', '4': 'q3_a', 'default': 'q4'} },
    "q3_a": { text: "What specific activities or responsibilities are most impacted by your depressive state?", next: {'default': 'q4'} },
    "q4": { text: "Basic tasks feel disproportionately expensive.", next: {'0': 'q5', '1': 'q5', '2': 'q4_a', '3': 'q4_a', '4': 'q4_a', 'default': 'q5'} },
    "q4_a": { text: "What specific tasks trigger this feeling of disproportionate expense most frequently?", next: {'default': 'q5'} },
    "q5": { text: "I lose large amounts of time to drifting, freezing, or shutting down.", next: {'0': 'q6', '1': 'q6', '2': 'q5_a', '3': 'q5_a', '4': 'q5_a', 'default': 'q6'} },
    "q5_a": { text: "What triggers the episodes of drifting, freezing, or shutting down for you?", next: {'default': 'q6'} },
    "q6": { text: "My functioning is worse than my mood alone would suggest.", next: {'0': 'q7', '1': 'q7', '2': 'q6_a', '3': 'q6_a', '4': 'q6_a', 'default': 'q7'} },
    "q6_a": { text: "What specific situations worsen your functioning despite a stable mood?", next: {'default': 'q7'} },
    "q7": { text: "I feel less able to handle ordinary stress than I used to.", next: {'0': 'q8', '1': 'q8', '2': 'q7_a', '3': 'q7_a', '4': 'q7_a', 'default': 'q8'} },
    "q7_a": { text: "What specific stressors have become more challenging for you recently?", next: {'default': 'q8'} },
    "q8": { text: "I am letting important tasks pile up because they feel too heavy.", next: {'0': 'q9', '1': 'q9', '2': 'q8_a', '3': 'q8_a', '4': 'q8_a', 'default': 'q9'} },
    "q8_a": { text: "What specific barriers are preventing you from starting these important tasks?", next: {'default': 'q9'} },
    "q9": { text: "My depression is damaging work, school, or household functioning.", next: {'0': 'q10', '1': 'q10', '2': 'q9_a', '3': 'q9_a', '4': 'q9_a', 'default': 'q10'} },
    "q9_a": { text: "What specific tasks or responsibilities are most affected by your depression?", next: {'default': 'q10'} },
    "q10": { text: "I am having trouble maintaining hygiene or basic self-care.", next: {'0': 'q11', '1': 'q11', '2': 'q10_a', '3': 'q10_a', '4': 'q10_a', 'default': 'q11'} },
    "q10_a": { text: "What specific barriers are preventing you from maintaining your hygiene or self-care?", next: {'default': 'q11'} },
    "q11": { text: "My appetite or eating pattern has become less reliable.", next: {'0': 'q12', '1': 'q12', '2': 'q11_a', '3': 'q11_a', '4': 'q11_a', 'default': 'q12'} },
    "q11_a": { text: "What specific factors trigger changes in your appetite or eating patterns?", next: {'default': 'q12'} },
    "q12": { text: "I feel disconnected from pleasure, interest, or reward.", next: {'0': 'q13', '1': 'q13', '2': 'q12_a', '3': 'q12_a', '4': 'q12_a', 'default': 'q13'} },
    "q12_a": { text: "What specific situations trigger your sense of disconnection from pleasure or interest?", next: {'default': 'q13'} },
    "q13": { text: "I feel like my range of action has narrowed.", next: {'0': 'q14', '1': 'q14', '2': 'q13_a', '3': 'q13_a', '4': 'q13_a', 'default': 'q14'} },
    "q13_a": { text: "What specific activities do you feel have become restricted or inaccessible recently?", next: {'default': 'q14'} },
    "q14": { text: "Small setbacks hit me harder than they should.", next: {'0': 'q15', '1': 'q15', '2': 'q14_a', '3': 'q14_a', '4': 'q14_a', 'default': 'q15'} },
    "q14_a": { text: "What specific thoughts arise immediately after experiencing a small setback?", next: {'default': 'q15'} },
    "q15": { text: "My current functioning feels fragile or inconsistent.", next: {'0': 'q16', '1': 'q16', '2': 'q15_a', '3': 'q15_a', '4': 'q15_a', 'default': 'q16'} },
    "q15_a": { text: "What specific events or changes trigger fluctuations in your functioning?", next: {'default': 'q16'} },
    "q16": { text: "I feel sad, flat, empty, or emotionally blunted.", next: {'0': 'q17', '1': 'q17', '2': 'q16_a', '3': 'q16_a', '4': 'q16_a', 'default': 'q17'} },
    "q16_a": { text: "What recent changes or stressors might have contributed to these feelings?", next: {'default': 'q17'} },
    "q17": { text: "I get less pleasure from things that used to help.", next: {'0': 'q18', '1': 'q18', '2': 'q17_a', '3': 'q17_a', '4': 'q17_a', 'default': 'q18'} },
    "q17_a": { text: "What specific activities have lost their appeal and when did this change start?", next: {'default': 'q18'} },
    "q18": { text: "Positive events have less impact on me than they used to.", next: {'0': 'q19', '1': 'q19', '2': 'q18_a', '3': 'q18_a', '4': 'q18_a', 'default': 'q19'} },
    "q18_a": { text: "What recent changes in your life might be affecting your response to positive events?", next: {'default': 'q19'} },
    "q19": { text: "I have trouble imagining enjoying the future.", next: {'0': 'q20', '1': 'q20', '2': 'q19_a', '3': 'q19_a', '4': 'q19_a', 'default': 'q20'} },
    "q19_a": { text: "What specific future events feel most difficult for you to envision enjoying?", next: {'default': 'q20'} },
    "q20": { text: "I feel hopeless about meaningful change.", next: {'0': 'q21', '1': 'q21', '2': 'q20_a', '3': 'q20_a', '4': 'q20_a', 'default': 'q21'} },
    "q20_a": { text: "What specific past experiences contribute most to your sense of hopelessness about change?", next: {'default': 'q21'} },
    "q21": { text: "I feel emotionally numb more than simply tired.", next: {'0': 'q22', '1': 'q22', '2': 'q21_a', '3': 'q21_a', '4': 'q21_a', 'default': 'q22'} },
    "q21_a": { text: "What situations trigger your emotional numbness most frequently?", next: {'default': 'q22'} },
    "q22": { text: "I feel grief-like heaviness without clear relief.", next: {'0': 'q23', '1': 'q23', '2': 'q22_a', '3': 'q22_a', '4': 'q22_a', 'default': 'q23'} },
    "q22_a": { text: "What triggers or situations intensify your experience of grief-like heaviness?", next: {'default': 'q23'} },
    "q23": { text: "I feel irritable or more easily frustrated.", next: {'0': 'q24', '1': 'q24', '2': 'q23_a', '3': 'q23_a', '4': 'q23_a', 'default': 'q24'} },
    "q23_a": { text: "What specific situations or triggers do you notice increase your irritability or frustration?", next: {'default': 'q24'} },
    "q24": { text: "My mood drops sharply with small disappointments.", next: {'0': 'q25', '1': 'q25', '2': 'q24_a', '3': 'q24_a', '4': 'q24_a', 'default': 'q25'} },
    "q24_a": { text: "What specific thoughts or beliefs trigger your mood drop during these disappointments?", next: {'default': 'q25'} },
    "q25": { text: "I feel like life has lost some of its color.", next: {'0': 'q26', '1': 'q26', '2': 'q25_a', '3': 'q25_a', '4': 'q25_a', 'default': 'q26'} },
    "q25_a": { text: "What specific changes or events preceded the feeling that life lost its color?", next: {'default': 'q26'} },
    "q26": { text: "I feel guilty or defective much of the time.", next: {'0': 'q27', '1': 'q27', '2': 'q26_a', '3': 'q26_a', '4': 'q26_a', 'default': 'q27'} },
    "q26_a": { text: "What specific experiences or thoughts trigger your feelings of guilt or defectiveness?", next: {'default': 'q27'} },
    "q27": { text: "I feel ashamed of struggling this much.", next: {'0': 'q28', '1': 'q28', '2': 'q27_a', '3': 'q27_a', '4': 'q27_a', 'default': 'q28'} },
    "q27_a": { text: "What specific expectations do you feel you're not meeting that's causing your shame?", next: {'default': 'q28'} },
    "q28": { text: "I feel like effort probably will not pay off.", next: {'0': 'q29', '1': 'q29', '2': 'q28_a', '3': 'q28_a', '4': 'q28_a', 'default': 'q29'} },
    "q28_a": { text: "What specific past experiences lead you to believe effort won't pay off?", next: {'default': 'q29'} },
    "q29": { text: "I feel stuck in the same state with little movement.", next: {'0': 'q30', '1': 'q30', '2': 'q29_a', '3': 'q29_a', '4': 'q29_a', 'default': 'q30'} },
    "q29_a": { text: "What specific situations or triggers do you associate with feeling stuck or immobilized?", next: {'default': 'q30'} },
    "q30": { text: "I feel disconnected from wanting things.", next: {'0': 'q31', '1': 'q31', '2': 'q30_a', '3': 'q30_a', '4': 'q30_a', 'default': 'q31'} },
    "q30_a": { text: "What recent changes in your life might have influenced your sense of desire?", next: {'default': 'q31'} },
    "q31": { text: "My thinking becomes darker or harsher when I am low.", next: {'0': 'q32', '1': 'q32', '2': 'q31_a', '3': 'q31_a', '4': 'q31_a', 'default': 'q32'} },
    "q31_a": { text: "What specific thoughts or events trigger this darkening or harshness in your thinking?", next: {'default': 'q32'} },
    "q32": { text: "I mistake depressed thoughts for objective truth.", next: {'0': 'q33', '1': 'q33', '2': 'q32_a', '3': 'q32_a', '4': 'q32_a', 'default': 'q33'} },
    "q32_a": { text: "What specific thoughts do you frequently misinterpret as factual truths?", next: {'default': 'q33'} },
    "q33": { text: "I replay problems without getting clearer or closer to action.", next: {'0': 'q34', '1': 'q34', '2': 'q33_a', '3': 'q33_a', '4': 'q33_a', 'default': 'q34'} },
    "q33_a": { text: "What factors trigger or exacerbate your tendency to ruminate on problems?", next: {'default': 'q34'} },
    "q34": { text: "I build cases against myself in my own head.", next: {'0': 'q35', '1': 'q35', '2': 'q34_a', '3': 'q34_a', '4': 'q34_a', 'default': 'q35'} },
    "q34_a": { text: "What triggers the initial thoughts that lead to building cases against yourself?", next: {'default': 'q35'} },
    "q35": { text: "I focus more on failure than on contrary evidence.", next: {'0': 'q36', '1': 'q36', '2': 'q35_a', '3': 'q35_a', '4': 'q35_a', 'default': 'q36'} },
    "q35_a": { text: "What specific situations trigger your tendency to focus on perceived failures?", next: {'default': 'q36'} },
    "q36": { text: "I have trouble making ordinary decisions.", next: {'0': 'q37', '1': 'q37', '2': 'q36_a', '3': 'q36_a', '4': 'q36_a', 'default': 'q37'} },
    "q36_a": { text: "What specific factors make decision-making challenging for you in daily situations?", next: {'default': 'q37'} },
    "q37": { text: "My concentration is worse than normal.", next: {'0': 'q38', '1': 'q38', '2': 'q37_a', '3': 'q37_a', '4': 'q37_a', 'default': 'q38'} },
    "q37_a": { text: "What specific activities or times of day worsen your concentration difficulties?", next: {'default': 'q38'} },
    "q38": { text: "I feel mentally slowed or foggy.", next: {'0': 'q39', '1': 'q39', '2': 'q38_a', '3': 'q38_a', '4': 'q38_a', 'default': 'q39'} },
    "q38_a": { text: "What situations or activities worsen your feelings of mental slowness or fog?", next: {'default': 'q39'} },
    "q39": { text: "I expect bad outcomes before I try.", next: {'0': 'q40', '1': 'q40', '2': 'q39_a', '3': 'q39_a', '4': 'q39_a', 'default': 'q40'} },
    "q39_a": { text: "What past experiences contribute to your expectation of negative outcomes?", next: {'default': 'q40'} },
    "q40": { text: "I interpret delays or neutral events as proof that I am failing.", next: {'0': 'q41', '1': 'q41', '2': 'q40_a', '3': 'q40_a', '4': 'q40_a', 'default': 'q41'} },
    "q40_a": { text: "What past experiences contribute to interpreting delays as personal failures?", next: {'default': 'q41'} },
    "q41": { text: "I have trouble holding perspective once shame gets high.", next: {'0': 'q42', '1': 'q42', '2': 'q41_a', '3': 'q41_a', '4': 'q41_a', 'default': 'q42'} },
    "q41_a": { text: "What specific thoughts or situations trigger heightened shame for you?", next: {'default': 'q42'} },
    "q42": { text: "My mind erases evidence that I can handle things.", next: {'0': 'q43', '1': 'q43', '2': 'q42_a', '3': 'q42_a', '4': 'q42_a', 'default': 'q43'} },
    "q42_a": { text: "What specific situations trigger your mind to erase evidence of your capabilities?", next: {'default': 'q43'} },
    "q43": { text: "I compare myself to others in ways that make me collapse further.", next: {'0': 'q44', '1': 'q44', '2': 'q43_a', '3': 'q43_a', '4': 'q43_a', 'default': 'q44'} },
    "q43_a": { text: "What specific situations trigger these comparisons leading to emotional collapse?", next: {'default': 'q44'} },
    "q44": { text: "I struggle to separate a bad state from my whole identity.", next: {'0': 'q45', '1': 'q45', '2': 'q44_a', '3': 'q44_a', '4': 'q44_a', 'default': 'q45'} },
    "q44_a": { text: "What specific thoughts or beliefs reinforce your identification with negative states?", next: {'default': 'q45'} },
    "q45": { text: "I have trouble seeing temporary conditions as temporary.", next: {'0': 'q46', '1': 'q46', '2': 'q45_a', '3': 'q45_a', '4': 'q45_a', 'default': 'q46'} },
    "q45_a": { text: "What influences your perception that temporary conditions might become permanent?", next: {'default': 'q46'} },
    "q46": { text: "My sleep schedule is drifting later or becoming irregular.", next: {'0': 'q47', '1': 'q47', '2': 'q46_a', '3': 'q46_a', '4': 'q46_a', 'default': 'q47'} },
    "q46_a": { text: "What changes in your daily routine might be contributing to your irregular sleep patterns?", next: {'default': 'q47'} },
    "q47": { text: "I have trouble falling asleep when I intend to.", next: {'0': 'q48', '1': 'q48', '2': 'q47_a', '3': 'q47_a', '4': 'q47_a', 'default': 'q48'} },
    "q47_a": { text: "What specific thoughts or activities prevent you from falling asleep at your intended time?", next: {'default': 'q48'} },
    "q48": { text: "I wake often or sleep lightly.", next: {'0': 'q49', '1': 'q49', '2': 'q48_a', '3': 'q48_a', '4': 'q48_a', 'default': 'q49'} },
    "q48_a": { text: "What specific thoughts or events trigger your nighttime awakenings?", next: {'default': 'q49'} },
    "q49": { text: "I wake without feeling restored.", next: {'0': 'q50', '1': 'q50', '2': 'q49_a', '3': 'q49_a', '4': 'q49_a', 'default': 'q50'} },
    "q49_a": { text: "What patterns or habits affect your sleep quality and duration?", next: {'default': 'q50'} },
    "q50": { text: "I oversleep or stay in bed longer than intended.", next: {'0': 'q51', '1': 'q51', '2': 'q50_a', '3': 'q50_a', '4': 'q50_a', 'default': 'q51'} },
    "q50_a": { text: "What factors contribute to your decision to remain in bed longer than planned?", next: {'default': 'q51'} },
    "q51": { text: "My wake time changes a lot from day to day.", next: {'0': 'q52', '1': 'q52', '2': 'q51_a', '3': 'q51_a', '4': 'q51_a', 'default': 'q52'} },
    "q51_a": { text: "What factors contribute to the variability in your daily wake time?", next: {'default': 'q52'} },
    "q52": { text: "Morning light or daylight exposure is inconsistent.", next: {'0': 'q53', '1': 'q53', '2': 'q52_a', '3': 'q52_a', '4': 'q52_a', 'default': 'q53'} },
    "q52_a": { text: "What factors prevent consistent morning light exposure in your daily routine?", next: {'default': 'q53'} },
    "q53": { text: "Low sleep quality makes everything else worse.", next: {'0': 'q54', '1': 'q54', '2': 'q53_a', '3': 'q53_a', '4': 'q53_a', 'default': 'q54'} },
    "q53_a": { text: "What specific aspects of your daily routine are most disrupted by poor sleep quality?", next: {'default': 'q54'} },
    "q54": { text: "I use sleep, lying down, or hiding in bed to escape the day.", next: {'0': 'q55', '1': 'q55', '2': 'q54_a', '3': 'q54_a', '4': 'q54_a', 'default': 'q55'} },
    "q54_a": { text: "What specific situations trigger your urge to escape by sleeping or hiding in bed?", next: {'default': 'q55'} },
    "q55": { text: "My evenings get taken over by passive numbing or scrolling.", next: {'0': 'q56', '1': 'q56', '2': 'q55_a', '3': 'q55_a', '4': 'q55_a', 'default': 'q56'} },
    "q55_a": { text: "What triggers your urge to engage in passive numbing or scrolling in evenings?", next: {'default': 'q56'} },
    "q56": { text: "My sleep pattern makes mornings feel unwinnable.", next: {'0': 'q57', '1': 'q57', '2': 'q56_a', '3': 'q56_a', '4': 'q56_a', 'default': 'q57'} },
    "q56_a": { text: "What specific sleep disruptions contribute most to your difficult mornings?", next: {'default': 'q57'} },
    "q57": { text: "I delay starting the day even after waking.", next: {'0': 'q58', '1': 'q58', '2': 'q57_a', '3': 'q57_a', '4': 'q57_a', 'default': 'q58'} },
    "q57_a": { text: "What thoughts or activities contribute to delaying your start in the morning?", next: {'default': 'q58'} },
    "q58": { text: "My energy rhythm feels badly timed or unstable.", next: {'0': 'q59', '1': 'q59', '2': 'q58_a', '3': 'q58_a', '4': 'q58_a', 'default': 'q59'} },
    "q58_a": { text: "What factors or events typically disrupt your energy rhythm throughout the day?", next: {'default': 'q59'} },
    "q59": { text: "I have trouble protecting a realistic wind-down window.", next: {'0': 'q60', '1': 'q60', '2': 'q59_a', '3': 'q59_a', '4': 'q59_a', 'default': 'q60'} },
    "q59_a": { text: "What specific activities or thoughts disrupt your wind-down process before sleep?", next: {'default': 'q60'} },
    "q60": { text: "Sleep disruption is one of the main engines of my depression right now.", next: {'0': 'q61', '1': 'q61', '2': 'q60_a', '3': 'q60_a', '4': 'q60_a', 'default': 'q61'} },
    "q60_a": { text: "What specific sleep disruptions are most impacting your mood and daily functioning?", next: {'default': 'q61'} },
    "q61": { text: "My energy is low most days.", next: {'0': 'q62', '1': 'q62', '2': 'q61_a', '3': 'q61_a', '4': 'q61_a', 'default': 'q62'} },
    "q61_a": { text: "What patterns or activities consistently precede your low energy days?", next: {'default': 'q62'} },
    "q62": { text: "My body often feels heavy or slowed down.", next: {'0': 'q63', '1': 'q63', '2': 'q62_a', '3': 'q62_a', '4': 'q62_a', 'default': 'q63'} },
    "q62_a": { text: "What activities worsen or improve your sensation of heaviness or slowed movement?", next: {'default': 'q63'} },
    "q63": { text: "Small tasks consume more energy than they should.", next: {'0': 'q64', '1': 'q64', '2': 'q63_a', '3': 'q63_a', '4': 'q63_a', 'default': 'q64'} },
    "q63_a": { text: "What specific tasks feel most draining, and when do you notice this increase in effort?", next: {'default': 'q64'} },
    "q64": { text: "Fatigue makes me doubt myself morally instead of practically.", next: {'0': 'q65', '1': 'q65', '2': 'q64_a', '3': 'q64_a', '4': 'q64_a', 'default': 'q65'} },
    "q64_a": { text: "What specific situations trigger moral doubt when you're fatigued?", next: {'default': 'q65'} },
    "q65": { text: "I feel physically deconditioned or weaker than I should.", next: {'0': 'q66', '1': 'q66', '2': 'q65_a', '3': 'q65_a', '4': 'q65_a', 'default': 'q66'} },
    "q65_a": { text: "What changes in activity or lifestyle might have contributed to this deconditioning?", next: {'default': 'q66'} },
    "q66": { text: "My appetite or food intake becomes erratic when I am low.", next: {'0': 'q67', '1': 'q67', '2': 'q66_a', '3': 'q66_a', '4': 'q66_a', 'default': 'q67'} },
    "q66_a": { text: "What triggers or alleviates your appetite changes when you're feeling low?", next: {'default': 'q67'} },
    "q67": { text: "I go too long without eating or drinking enough.", next: {'0': 'q68', '1': 'q68', '2': 'q67_a', '3': 'q67_a', '4': 'q67_a', 'default': 'q68'} },
    "q67_a": { text: "What factors prevent you from eating or drinking regularly throughout the day?", next: {'default': 'q68'} },
    "q68": { text: "My physical state worsens my mood more than I admit.", next: {'0': 'q69', '1': 'q69', '2': 'q68_a', '3': 'q68_a', '4': 'q68_a', 'default': 'q69'} },
    "q68_a": { text: "What specific physical symptoms most frequently correlate with your mood worsening?", next: {'default': 'q69'} },
    "q69": { text: "I feel restless or agitated instead of simply tired.", next: {'0': 'q70', '1': 'q70', '2': 'q69_a', '3': 'q69_a', '4': 'q69_a', 'default': 'q70'} },
    "q69_a": { text: "What specific situations trigger your feelings of restlessness or agitation?", next: {'default': 'q70'} },
    "q70": { text: "I rely on substances, caffeine, nicotine, or other inputs to push through collapse.", next: {'0': 'q71', '1': 'q71', '2': 'q70_a', '3': 'q70_a', '4': 'q70_a', 'default': 'q71'} },
    "q70_a": { text: "What patterns trigger your reliance on substances to overcome feelings of collapse?", next: {'default': 'q71'} },
    "q71": { text: "Physical discomfort or pain is feeding the depressive state.", next: {'0': 'q72', '1': 'q72', '2': 'q71_a', '3': 'q71_a', '4': 'q71_a', 'default': 'q72'} },
    "q71_a": { text: "What specific physical discomforts most intensify your depressive symptoms?", next: {'default': 'q72'} },
    "q72": { text: "I have trouble telling the difference between exhaustion and avoidance.", next: {'0': 'q73', '1': 'q73', '2': 'q72_a', '3': 'q72_a', '4': 'q72_a', 'default': 'q73'} },
    "q72_a": { text: "What situations trigger confusion between exhaustion and avoidance for you?", next: {'default': 'q73'} },
    "q73": { text: "I often wait to feel energized before attempting anything useful.", next: {'0': 'q74', '1': 'q74', '2': 'q73_a', '3': 'q73_a', '4': 'q73_a', 'default': 'q74'} },
    "q73_a": { text: "What factors contribute to your lack of energy before starting tasks?", next: {'default': 'q74'} },
    "q74": { text: "When my body feels bad, the whole day is easier to lose.", next: {'0': 'q75', '1': 'q75', '2': 'q74_a', '3': 'q74_a', '4': 'q74_a', 'default': 'q75'} },
    "q74_a": { text: "What specific physical sensations most often trigger your day becoming unmanageable?", next: {'default': 'q75'} },
    "q75": { text: "Basic body care is inconsistent enough to affect function.", next: {'0': 'q76', '1': 'q76', '2': 'q75_a', '3': 'q75_a', '4': 'q75_a', 'default': 'q76'} },
    "q75_a": { text: "What specific factors prevent you from maintaining consistent basic body care?", next: {'default': 'q76'} },
    "q76": { text: "I avoid things that might actually help because they feel too hard.", next: {'0': 'q77', '1': 'q77', '2': 'q76_a', '3': 'q76_a', '4': 'q76_a', 'default': 'q77'} },
    "q76_a": { text: "What specific obstacles make helpful tasks feel too challenging for you?", next: {'default': 'q77'} },
    "q77": { text: "I delay tasks until they become bigger and more frightening.", next: {'0': 'q78', '1': 'q78', '2': 'q77_a', '3': 'q77_a', '4': 'q77_a', 'default': 'q78'} },
    "q77_a": { text: "What specific thoughts or fears contribute to delaying these tasks?", next: {'default': 'q78'} },
    "q78": { text: "I use scrolling, numbing, or passive distraction to avoid starting.", next: {'0': 'q79', '1': 'q79', '2': 'q78_a', '3': 'q78_a', '4': 'q78_a', 'default': 'q79'} },
    "q78_a": { text: "What specific emotions or tasks trigger your urge to engage in distraction?", next: {'default': 'q79'} },
    "q79": { text: "I cancel, hide, or withdraw more than I want to.", next: {'0': 'q80', '1': 'q80', '2': 'q79_a', '3': 'q79_a', '4': 'q79_a', 'default': 'q80'} },
    "q79_a": { text: "What specific situations trigger your tendency to cancel or withdraw?", next: {'default': 'q80'} },
    "q80": { text: "I wait to feel ready before acting.", next: {'0': 'q81', '1': 'q81', '2': 'q80_a', '3': 'q80_a', '4': 'q80_a', 'default': 'q81'} },
    "q80_a": { text: "What fears or beliefs contribute to needing to feel ready before acting?", next: {'default': 'q81'} },
    "q81": { text: "I start less than I plan.", next: {'0': 'q82', '1': 'q82', '2': 'q81_a', '3': 'q81_a', '4': 'q81_a', 'default': 'q82'} },
    "q81_a": { text: "What specific obstacles prevent you from initiating planned tasks?", next: {'default': 'q82'} },
    "q82": { text: "I follow through less than I intend.", next: {'0': 'q83', '1': 'q83', '2': 'q82_a', '3': 'q82_a', '4': 'q82_a', 'default': 'q83'} },
    "q82_a": { text: "What specific obstacles prevent you from completing tasks as intended?", next: {'default': 'q83'} },
    "q83": { text: "Once I slip, I tend to abandon the whole day.", next: {'0': 'q84', '1': 'q84', '2': 'q83_a', '3': 'q83_a', '4': 'q83_a', 'default': 'q84'} },
    "q83_a": { text: "What specific triggers typically cause you to slip and abandon the day?", next: {'default': 'q84'} },
    "q84": { text: "I turn one mistake into a reason to stop trying.", next: {'0': 'q85', '1': 'q85', '2': 'q84_a', '3': 'q84_a', '4': 'q84_a', 'default': 'q85'} },
    "q84_a": { text: "What past experiences contribute to stopping efforts after a mistake?", next: {'default': 'q85'} },
    "q85": { text: "My routines disappear when mood drops.", next: {'0': 'q86', '1': 'q86', '2': 'q85_a', '3': 'q85_a', '4': 'q85_a', 'default': 'q86'} },
    "q85_a": { text: "What specific routines are hardest to maintain when your mood drops?", next: {'default': 'q86'} },
    "q86": { text: "I can think clearly about the plan but not run it consistently.", next: {'0': 'q87', '1': 'q87', '2': 'q86_a', '3': 'q86_a', '4': 'q86_a', 'default': 'q87'} },
    "q86_a": { text: "What specific obstacles prevent you from consistently executing your plans?", next: {'default': 'q87'} },
    "q87": { text: "I choose short-term relief over longer-term function.", next: {'0': 'q88', '1': 'q88', '2': 'q87_a', '3': 'q87_a', '4': 'q87_a', 'default': 'q88'} },
    "q87_a": { text: "What specific situations trigger choosing short-term relief over long-term function?", next: {'default': 'q88'} },
    "q88": { text: "I have trouble scaling the day to my actual energy.", next: {'0': 'q89', '1': 'q89', '2': 'q88_a', '3': 'q88_a', '4': 'q88_a', 'default': 'q89'} },
    "q88_a": { text: "What specific factors prevent you from adjusting your activities to your energy levels?", next: {'default': 'q89'} },
    "q89": { text: "I overreach on better days and pay for it later.", next: {'0': 'q90', '1': 'q90', '2': 'q89_a', '3': 'q89_a', '4': 'q89_a', 'default': 'q90'} },
    "q89_a": { text: "What specific activities do you tend to overcommit to on better days?", next: {'default': 'q90'} },
    "q90": { text: "My life is more passive than I want it to be.", next: {'0': 'q91', '1': 'q91', '2': 'q90_a', '3': 'q90_a', '4': 'q90_a', 'default': 'q91'} },
    "q90_a": { text: "What barriers prevent you from taking more active control in your life?", next: {'default': 'q91'} },
    "q91": { text: "My room, home, or daily environment makes functioning harder.", next: {'0': 'q92', '1': 'q92', '2': 'q91_a', '3': 'q91_a', '4': 'q91_a', 'default': 'q92'} },
    "q91_a": { text: "What specific environmental factors are most disruptive to your daily functioning?", next: {'default': 'q92'} },
    "q92": { text: "Clutter, mess, or friction drains more energy than I admit.", next: {'0': 'q93', '1': 'q93', '2': 'q92_a', '3': 'q92_a', '4': 'q92_a', 'default': 'q93'} },
    "q92_a": { text: "What specific situations trigger the highest energy drain from clutter or mess?", next: {'default': 'q93'} },
    "q93": { text: "Bills, paperwork, appointments, or admin tasks are slipping.", next: {'0': 'q94', '1': 'q94', '2': 'q93_a', '3': 'q93_a', '4': 'q93_a', 'default': 'q94'} },
    "q93_a": { text: "What specific obstacles prevent you from managing bills and paperwork effectively?", next: {'default': 'q94'} },
    "q94": { text: "I lose traction because needed items are not where I can find them.", next: {'0': 'q95', '1': 'q95', '2': 'q94_a', '3': 'q94_a', '4': 'q94_a', 'default': 'q95'} },
    "q94_a": { text: "What specific situations or locations do you most frequently misplace important items?", next: {'default': 'q95'} },
    "q95": { text: "My environment makes good habits harder to run.", next: {'0': 'q96', '1': 'q96', '2': 'q95_a', '3': 'q95_a', '4': 'q95_a', 'default': 'q96'} },
    "q95_a": { text: "What specific environmental factors make it difficult to maintain good habits?", next: {'default': 'q96'} },
    "q96": { text: "I am falling behind on tasks that keep life stable.", next: {'0': 'q97', '1': 'q97', '2': 'q96_a', '3': 'q96_a', '4': 'q96_a', 'default': 'q97'} },
    "q96_a": { text: "What specific obstacles are preventing you from completing essential daily tasks?", next: {'default': 'q97'} },
    "q97": { text: "Work or practical responsibilities feel increasingly threatening.", next: {'0': 'q98', '1': 'q98', '2': 'q97_a', '3': 'q97_a', '4': 'q97_a', 'default': 'q98'} },
    "q97_a": { text: "What specific work tasks contribute most to your sense of threat or anxiety?", next: {'default': 'q98'} },
    "q98": { text: "My day lacks enough structure to protect me from drift.", next: {'0': 'q99', '1': 'q99', '2': 'q98_a', '3': 'q98_a', '4': 'q98_a', 'default': 'q99'} },
    "q98_a": { text: "What factors prevent you from establishing a consistent daily routine?", next: {'default': 'q99'} },
    "q99": { text: "I do better with external structure than without it.", next: {'0': 'q100', '1': 'q100', '2': 'q99_a', '3': 'q99_a', '4': 'q99_a', 'default': 'q100'} },
    "q99_a": { text: "What specific structures help improve your daily functioning and decision-making?", next: {'default': 'q100'} },
    "q100": { text: "When external structure disappears, I unravel quickly.", next: {'0': 'q101', '1': 'q101', '2': 'q100_a', '3': 'q100_a', '4': 'q100_a', 'default': 'q101'} },
    "q100_a": { text: "What specific situations trigger this loss of structure and subsequent unraveling?", next: {'default': 'q101'} },
    "q101": { text: "I spend too much time reacting instead of running a plan.", next: {'0': 'q102', '1': 'q102', '2': 'q101_a', '3': 'q101_a', '4': 'q101_a', 'default': 'q102'} },
    "q101_a": { text: "What factors typically trigger your reactive responses over planned actions?", next: {'default': 'q102'} },
    "q102": { text: "My current systems for tracking or reminders are too weak.", next: {'0': 'q103', '1': 'q103', '2': 'q102_a', '3': 'q102_a', '4': 'q102_a', 'default': 'q103'} },
    "q102_a": { text: "What challenges prevent your tracking or reminder systems from being effective?", next: {'default': 'q103'} },
    "q103": { text: "I am not using written structure as much as I need.", next: {'0': 'q104', '1': 'q104', '2': 'q103_a', '3': 'q103_a', '4': 'q103_a', 'default': 'q104'} },
    "q103_a": { text: "What barriers prevent you from utilizing written structure effectively in daily tasks?", next: {'default': 'q104'} },
    "q104": { text: "My environment becomes an accomplice to collapse.", next: {'0': 'q105', '1': 'q105', '2': 'q104_a', '3': 'q104_a', '4': 'q104_a', 'default': 'q105'} },
    "q104_a": { text: "What environmental factors contribute most to your sense of collapse?", next: {'default': 'q105'} },
    "q105": { text: "Practical life friction is a major maintaining factor right now.", next: {'0': 'q106', '1': 'q106', '2': 'q105_a', '3': 'q105_a', '4': 'q105_a', 'default': 'q106'} },
    "q105_a": { text: "What specific practical life obstacles are most contributing to your current challenges?", next: {'default': 'q106'} },
    "q106": { text: "I withdraw from people when I am low.", next: {'0': 'q107', '1': 'q107', '2': 'q106_a', '3': 'q106_a', '4': 'q106_a', 'default': 'q107'} },
    "q106_a": { text: "What specific situations trigger your withdrawal from others when feeling low?", next: {'default': 'q107'} },
    "q107": { text: "I feel like a burden to others.", next: {'0': 'q108', '1': 'q108', '2': 'q107_a', '3': 'q107_a', '4': 'q107_a', 'default': 'q108'} },
    "q107_a": { text: "What specific situations make you feel most like a burden to others?", next: {'default': 'q108'} },
    "q108": { text: "I expect misunderstanding or rejection more than support.", next: {'0': 'q109', '1': 'q109', '2': 'q108_a', '3': 'q108_a', '4': 'q108_a', 'default': 'q109'} },
    "q108_a": { text: "What past experiences have led you to expect misunderstanding or rejection?", next: {'default': 'q109'} },
    "q109": { text: "I communicate less clearly or less often than I want to.", next: {'0': 'q110', '1': 'q110', '2': 'q109_a', '3': 'q109_a', '4': 'q109_a', 'default': 'q110'} },
    "q109_a": { text: "What specific barriers prevent you from communicating as clearly or as often as desired?", next: {'default': 'q110'} },
    "q110": { text: "Relationships feel harder to maintain than they should.", next: {'0': 'q111', '1': 'q111', '2': 'q110_a', '3': 'q110_a', '4': 'q110_a', 'default': 'q111'} },
    "q110_a": { text: "What specific challenges do you encounter when trying to maintain relationships?", next: {'default': 'q111'} },
    "q111": { text: "Loneliness is feeding the depressive state.", next: {'0': 'q112', '1': 'q112', '2': 'q111_a', '3': 'q111_a', '4': 'q111_a', 'default': 'q112'} },
    "q111_a": { text: "What specific situations or factors contribute most to your feelings of loneliness?", next: {'default': 'q112'} },
    "q112": { text: "Shame makes me harder to reach.", next: {'0': 'q113', '1': 'q113', '2': 'q112_a', '3': 'q112_a', '4': 'q112_a', 'default': 'q113'} },
    "q112_a": { text: "What specific situations trigger the shame that hinders your ability to connect?", next: {'default': 'q113'} },
    "q113": { text: "I have become less expressive or less responsive.", next: {'0': 'q114', '1': 'q114', '2': 'q113_a', '3': 'q113_a', '4': 'q113_a', 'default': 'q114'} },
    "q113_a": { text: "What specific situations trigger your decreased expressiveness or responsiveness?", next: {'default': 'q114'} },
    "q114": { text: "I lose contact with parts of my identity outside depression.", next: {'0': 'q115', '1': 'q115', '2': 'q114_a', '3': 'q114_a', '4': 'q114_a', 'default': 'q115'} },
    "q114_a": { text: "What aspects of your identity feel most diminished during depressive episodes?", next: {'default': 'q115'} },
    "q115": { text: "I feel smaller, narrower, or less like myself than before.", next: {'0': 'q116', '1': 'q116', '2': 'q115_a', '3': 'q115_a', '4': 'q115_a', 'default': 'q116'} },
    "q115_a": { text: "What recent events or changes might be contributing to this diminished self-perception?", next: {'default': 'q116'} },
    "q116": { text: "Social effort feels expensive even when I want connection.", next: {'0': 'q117', '1': 'q117', '2': 'q116_a', '3': 'q116_a', '4': 'q116_a', 'default': 'q117'} },
    "q116_a": { text: "What specific situations make social interaction feel most draining for you?", next: {'default': 'q117'} },
    "q117": { text: "I avoid people because I do not want to be seen like this.", next: {'0': 'q118', '1': 'q118', '2': 'q117_a', '3': 'q117_a', '4': 'q117_a', 'default': 'q118'} },
    "q117_a": { text: "What specific situations trigger your need to avoid people?", next: {'default': 'q118'} },
    "q118": { text: "When others respond badly, it confirms my worst beliefs fast.", next: {'0': 'q119', '1': 'q119', '2': 'q118_a', '3': 'q118_a', '4': 'q118_a', 'default': 'q119'} },
    "q118_a": { text: "What past experiences reinforce your belief when others respond badly to you?", next: {'default': 'q119'} },
    "q119": { text: "I need more low-pressure human contact than I currently get.", next: {'0': 'q120', '1': 'q120', '2': 'q119_a', '3': 'q119_a', '4': 'q119_a', 'default': 'q120'} },
    "q119_a": { text: "What barriers or circumstances limit your ability to have low-pressure social interactions?", next: {'default': 'q120'} },
    "q120": { text: "Depression has started to fuse with my sense of who I am.", next: {'0': 'q121', '1': 'q121', '2': 'q120_a', '3': 'q120_a', '4': 'q120_a', 'default': 'q121'} },
    "q120_a": { text: "How has this fusion with depression affected your daily decision-making processes?", next: {'default': 'q121'} },
    "q121": { text: "I have had depressive periods before this current one.", next: {'0': 'q122', '1': 'q122', '2': 'q121_a', '3': 'q121_a', '4': 'q121_a', 'default': 'q122'} },
    "q121_a": { text: "What triggers have you identified that precede your depressive periods?", next: {'default': 'q122'} },
    "q122": { text: "This current state feels chronic, recurrent, or stubborn.", next: {'0': 'q123', '1': 'q123', '2': 'q122_a', '3': 'q122_a', '4': 'q122_a', 'default': 'q123'} },
    "q122_a": { text: "What recurring triggers or stressors have you identified that exacerbate this state?", next: {'default': 'q123'} },
    "q123": { text: "I suspect there are contributing factors beyond just mood.", next: {'0': 'q124', '1': 'q124', '2': 'q123_a', '3': 'q123_a', '4': 'q123_a', 'default': 'q124'} },
    "q123_a": { text: "What specific factors beyond mood do you believe are influencing your situation?", next: {'default': 'q124'} },
    "q124": { text: "Physical health issues may be worsening the depression picture.", next: {'0': 'q125', '1': 'q125', '2': 'q124_a', '3': 'q124_a', '4': 'q124_a', 'default': 'q125'} },
    "q124_a": { text: "What specific physical health issues are contributing to your worsening depression symptoms?", next: {'default': 'q125'} },
    "q125": { text: "Substances or medication side effects may be part of the picture.", next: {'0': 'q126', '1': 'q126', '2': 'q125_a', '3': 'q125_a', '4': 'q125_a', 'default': 'q126'} },
    "q125_a": { text: "Which specific substances or medications are affecting your daily functioning the most?", next: {'default': 'q126'} },
    "q126": { text: "My current medication strategy, if any, is not fully optimized.", next: {'0': 'q127', '1': 'q127', '2': 'q126_a', '3': 'q126_a', '4': 'q126_a', 'default': 'q127'} },
    "q126_a": { text: "What specific issues have you noticed with your current medication strategy?", next: {'default': 'q127'} },
    "q127": { text: "Side effects or treatment tradeoffs are affecting function.", next: {'0': 'q128', '1': 'q128', '2': 'q127_a', '3': 'q127_a', '4': 'q127_a', 'default': 'q128'} },
    "q127_a": { text: "Which specific side effects are most disruptive to your daily activities?", next: {'default': 'q128'} },
    "q128": { text: "I have trouble judging treatment by concrete outcomes instead of ideology or mood memory.", next: {'0': 'q129', '1': 'q129', '2': 'q128_a', '3': 'q128_a', '4': 'q128_a', 'default': 'q129'} },
    "q128_a": { text: "What specific patterns or past experiences influence your treatment judgments the most?", next: {'default': 'q129'} },
    "q129": { text: "I do not track changes in sleep, energy, mood, and side effects clearly enough.", next: {'0': 'q130', '1': 'q130', '2': 'q129_a', '3': 'q129_a', '4': 'q129_a', 'default': 'q130'} },
    "q129_a": { text: "What barriers prevent you from consistently tracking sleep, energy, mood, and side effects?", next: {'default': 'q130'} },
    "q130": { text: "Access, cost, time, or logistics make treatment harder.", next: {'0': 'q131', '1': 'q131', '2': 'q130_a', '3': 'q130_a', '4': 'q130_a', 'default': 'q131'} },
    "q130_a": { text: "Which specific barrier\u2014access, cost, time, or logistics\u2014affects your treatment the most?", next: {'default': 'q131'} },
    "q131": { text: "I have trouble staying consistent with helpful treatment inputs.", next: {'0': 'q132', '1': 'q132', '2': 'q131_a', '3': 'q131_a', '4': 'q131_a', 'default': 'q132'} },
    "q131_a": { text: "What obstacles prevent you from consistently engaging with your treatment plan?", next: {'default': 'q132'} },
    "q132": { text: "I need a plan that fits real life better, not a theoretically perfect one.", next: {'0': 'q133', '1': 'q133', '2': 'q132_a', '3': 'q132_a', '4': 'q132_a', 'default': 'q133'} },
    "q132_a": { text: "What specific obstacles prevent you from following your current plan effectively?", next: {'default': 'q133'} },
    "q133": { text: "My depression may be complicated by anxiety, trauma, pain, burnout, or heavy stress.", next: {'0': 'q134', '1': 'q134', '2': 'q133_a', '3': 'q133_a', '4': 'q133_a', 'default': 'q134'} },
    "q133_a": { text: "Which factor most frequently triggers or intensifies your depressive episodes?", next: {'default': 'q134'} },
    "q134": { text: "I need better collaborative decision-making around treatment than I currently have.", next: {'0': 'q135', '1': 'q135', '2': 'q134_a', '3': 'q134_a', '4': 'q134_a', 'default': 'q135'} },
    "q134_a": { text: "What specific barriers are hindering effective collaboration in your treatment decisions?", next: {'default': 'q135'} },
    "q135": { text: "My current approach is too fragmented to be reliable.", next: {'0': 'q136', '1': 'q136', '2': 'q135_a', '3': 'q135_a', '4': 'q135_a', 'default': 'q136'} },
    "q135_a": { text: "What factors contribute to the fragmentation in your current approach?", next: {'default': 'q136'} },
    "q136": { text: "It is hard to believe effort will lead to improvement.", next: {'0': 'q137', '1': 'q137', '2': 'q136_a', '3': 'q136_a', '4': 'q136_a', 'default': 'q137'} },
    "q136_a": { text: "What past experiences have reinforced your belief that effort doesn't lead to improvement?", next: {'default': 'q137'} },
    "q137": { text: "I have trouble noticing small gains once they happen.", next: {'0': 'q138', '1': 'q138', '2': 'q137_a', '3': 'q137_a', '4': 'q137_a', 'default': 'q138'} },
    "q137_a": { text: "What factors prevent you from recognizing and acknowledging small improvements in your progress?", next: {'default': 'q138'} },
    "q138": { text: "I discount small corrective actions as meaningless.", next: {'0': 'q139', '1': 'q139', '2': 'q138_a', '3': 'q138_a', '4': 'q138_a', 'default': 'q139'} },
    "q138_a": { text: "What past experiences led you to view small actions as insignificant?", next: {'default': 'q139'} },
    "q139": { text: "I need visible evidence that inputs can change the state.", next: {'0': 'q140', '1': 'q140', '2': 'q139_a', '3': 'q139_a', '4': 'q139_a', 'default': 'q140'} },
    "q139_a": { text: "What specific situations trigger your need for visible evidence of change?", next: {'default': 'q140'} },
    "q140": { text: "I do better when expectations are realistic and scaled.", next: {'0': 'q141', '1': 'q141', '2': 'q140_a', '3': 'q140_a', '4': 'q140_a', 'default': 'q141'} },
    "q140_a": { text: "How do unrealistic expectations typically impact your ability to meet goals?", next: {'default': 'q141'} },
    "q141": { text: "I need a minimum viable day plan for bad days.", next: {'0': 'q142', '1': 'q142', '2': 'q141_a', '3': 'q141_a', '4': 'q141_a', 'default': 'q142'} },
    "q141_a": { text: "What specific obstacles prevent you from achieving a minimum viable day plan?", next: {'default': 'q142'} },
    "q142": { text: "I need a rescue plan for collapse days.", next: {'0': 'q143', '1': 'q143', '2': 'q142_a', '3': 'q142_a', '4': 'q142_a', 'default': 'q143'} },
    "q142_a": { text: "What triggers your collapse days, and how do you currently manage them?", next: {'default': 'q143'} },
    "q143": { text: "I need clearer priorities about which anchors matter most first.", next: {'0': 'q144', '1': 'q144', '2': 'q143_a', '3': 'q143_a', '4': 'q143_a', 'default': 'q144'} },
    "q143_a": { text: "What factors make it difficult for you to prioritize these anchors effectively?", next: {'default': 'q144'} },
    "q144": { text: "I need a plan that protects continuity rather than perfection.", next: {'0': 'q145', '1': 'q145', '2': 'q144_a', '3': 'q144_a', '4': 'q144_a', 'default': 'q145'} },
    "q144_a": { text: "What obstacles prevent you from prioritizing continuity over perfection in your plans?", next: {'default': 'q145'} },
    "q145": { text: "I need a stronger sense of what would count as real progress.", next: {'0': 'q146', '1': 'q146', '2': 'q145_a', '3': 'q145_a', '4': 'q145_a', 'default': 'q146'} },
    "q145_a": { text: "What specific obstacles do you perceive are hindering your sense of progress?", next: {'default': 'q146'} },
    "q146": { text: "I need more repetition and less heroic overcorrection.", next: {'0': 'q147', '1': 'q147', '2': 'q146_a', '3': 'q146_a', '4': 'q146_a', 'default': 'q147'} },
    "q146_a": { text: "What specific situations trigger your need for repetition and avoidance of overcorrection?", next: {'default': 'q147'} },
    "q147": { text: "I need a better way to identify my main constraints.", next: {'0': 'q148', '1': 'q148', '2': 'q147_a', '3': 'q147_a', '4': 'q147_a', 'default': 'q148'} },
    "q147_a": { text: "What specific constraints do you feel are hindering your progress the most?", next: {'default': 'q148'} },
    "q148": { text: "I need the plan to meet me at my actual capacity, not an ideal version of me.", next: {'0': 'q149', '1': 'q149', '2': 'q148_a', '3': 'q148_a', '4': 'q148_a', 'default': 'q149'} },
    "q148_a": { text: "What factors prevent you from aligning your plans with your true capacity?", next: {'default': 'q149'} },
    "q149": { text: "It is hard to hold onto the idea that any part of this can still change.", next: {'0': 'q150', '1': 'q150', '2': 'q149_a', '3': 'q149_a', '4': 'q149_a', 'default': 'q150'} },
    "q149_a": { text: "What specific experiences contribute to your belief that change is impossible?", next: {'default': 'q150'} },
    "q150": { text: "I struggle to keep testing small repeated changes when immediate payoff is low.", next: {'0': 'done', '1': 'done', '2': 'q150_a', '3': 'q150_a', '4': 'q150_a', 'default': 'done'} },
    "q150_a": { text: "What obstacles prevent sustained effort when rewards are not immediately apparent?", next: {'default': 'done'} },
};

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
            stateSelector: document.getElementById("screen-state-selector"),
            profileDepth: document.getElementById("screen-profile-depth"),
            intake: document.getElementById("screen-intake"),
            dashboard: document.getElementById("screen-dashboard")
        };

        const tabs = {
            dashboard: document.getElementById("tab-dashboard"),
            polaris: document.getElementById("tab-polaris"),
            momentum: document.getElementById("tab-momentum"),
            safebox: document.getElementById("tab-safebox"),
            mediaconsole: document.getElementById("tab-mediaconsole"),
            progression: document.getElementById("tab-progression"),
            cognitivelab: document.getElementById("tab-cognitivelab"),
            documentcenter: document.getElementById("tab-documentcenter"),
            explorer: document.getElementById("tab-explorer"),
            suicideprevention: document.getElementById("tab-suicideprevention")
        };

        let tempPhqAnswers = new Array(9).fill(null);
        let tempPinInput = ""; 

        function init() {
            loadState();
            loadSafetyModules();
            setupEventListeners();
            
            // Register PWA Service Worker for Mobile Offline Standalone Installations
            // Note: init() is already invoked via window.onload, so we register directly
            // instead of adding another 'load' listener (which would never fire at this point).
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(reg => console.log('[PWA] Service Worker registered successfully:', reg.scope))
                    .catch(err => console.error('[PWA] Service Worker registration failed:', err));
            }
            
            setTimeout(() => {
                checkCaringContactModal();
            }, 1000);

            handleRouting();
            window.addEventListener("hashchange", handleRouting);
        }

        function handleRouting() {
            const hash = window.location.hash;
            if (state.securityPin) {
                state.isLocked = true;
                showScreen("lock");
                resetPinDots();
                return;
            }
            if (state.isOnboarded) {
                showScreen("dashboard");
                ensurePolarisState();

                const path = hash.replace(/^#\/?/, "");
                const parts = path.split("/");
                const tabId = parts[0];
                const subtabId = parts[1];

                const validTabs = ["dashboard", "polaris", "momentum", "safebox", "mediaconsole", "progression", "cognitivelab", "documentcenter", "explorer", "suicideprevention"];
                let targetTab = tabId;
                if (!validTabs.includes(targetTab)) {
                    targetTab = (state.polaris && state.polaris.enabled) ? "polaris" : "dashboard";
                }

                const success = showTab(targetTab);
                if (!success) {
                    const currentTab = getActiveTabId() || ((state.polaris && state.polaris.enabled) ? "polaris" : "dashboard");
                    window.location.hash = `#/${currentTab}`;
                    return;
                }

                if (targetTab === "safebox") {
                    renderSafeBox();
                    if (isHighRiskActive()) {
                        triggerCrisisOverlay();
                    }
                }

                if (targetTab === "suicideprevention") {
                    const validSubtabs = ["crisis", "parables", "journal", "compendium", "evidence", "systems"];
                    let targetSubtab = subtabId;
                    if (!validSubtabs.includes(targetSubtab)) {
                        targetSubtab = "crisis";
                    }

                    validSubtabs.forEach(t => {
                        const btn = document.getElementById(`btn-sp-subtab-${t}`);
                        const panel = document.getElementById(`sp-panel-${t}`);
                        if (t === targetSubtab) {
                            if (btn) btn.classList.add("active");
                            if (panel) panel.classList.remove("hidden");
                        } else {
                            if (btn) btn.classList.remove("active");
                            if (panel) panel.classList.add("hidden");
                        }
                    });

                    if (targetSubtab === "compendium") {
                        renderCompendiumSubpanel();
                    } else if (targetSubtab === "evidence") {
                        renderEvidenceSubpanel();
                    } else if (targetSubtab === "systems") {
                        renderSystemsSubpanel();
                    }
                }

                // Gap acknowledgment for returning users
                const h = state.history;
                if (h.length > 0) {
                    const lastDate = h[h.length - 1].date;
                    const today = getTodayString();
                    if (lastDate !== today) {
                        const gap = Math.floor(Math.abs(new Date(today) - new Date(lastDate)) / 86400000);
                        if (gap >= 2) {
                            showToast(`${gap} days since last check-in. Pick up where you are.`, 'info', 6000);
                        }
                    }
                }
            } else {
                const path = hash.replace(/^#\/?/, "");
                if (path === "screen-welcome" || path === "program" || hash === "#screen-welcome" || hash === "#program") {
                    showScreen("welcome");
                } else {
                    toggleAppView(false);
                }
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
                    if (state.history === undefined) state.history = [];
                    if (state.ratings === undefined) state.ratings = { ...DEFAULT_STATE.ratings };
                    if (state.safety === undefined) state.safety = { ...DEFAULT_STATE.safety };
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
                    if (state.polaris === undefined) state.polaris = null;
                    if (state.userAnchors === undefined) state.userAnchors = [];
                    if (state.firstUseDate === undefined) state.firstUseDate = '';
                    if (state.tomorrowAnchor === undefined) state.tomorrowAnchor = '';
                    if (state.personalBests === undefined) state.personalBests = { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null };
                    if (state.polarisUpgrade === undefined) state.polarisUpgrade = false;
                    if (state.polarisHistory === undefined) state.polarisHistory = [];
                    if (state.polarisRestartLogs === undefined) state.polarisRestartLogs = [];
                    if (state.lastVisitDate === undefined) state.lastVisitDate = '';
                    if (state.reEntry === undefined) {
                        state.reEntry = {
                            lastSeenDate: null,
                            missedDays: 0,
                            lastMessageType: null
                        };
                    }
                    if (state.futureNarrowing === undefined) state.futureNarrowing = "action";
                    if (state.startupDrag === undefined) state.startupDrag = "none";
                    if (state.rumination === undefined) state.rumination = "redirect";
                    if (state.socialIsolation === undefined) state.socialIsolation = "neutral";
                    if (state.externalAnchor === undefined) state.externalAnchor = "none";
                    if (state.ruminationLogs === undefined) state.ruminationLogs = [];
                    if (state.safetyJournal === undefined) state.safetyJournal = [];
                    if (state.parablesCompleted === undefined) state.parablesCompleted = {};
                    if (state.lastCrisisEvent === undefined) state.lastCrisisEvent = null;
                    if (state.caringContactStage === undefined) state.caringContactStage = 0;
                    if (state.safeboxLogs === undefined) state.safeboxLogs = [];
                    // Migrate polaris.anchors.today from array (v2/v3) to object (v4, ID-based)
                    if (state.polaris && state.polaris.anchors && Array.isArray(state.polaris.anchors.today)) {
                        state.polaris.anchors.today = {};
                    }
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
                stateToSave.safetyJournal = state.safetyJournal.map(item => ({
                    id: item.id,
                    timestamp: item.timestamp,
                    rawThoughts: scramble(item.rawThoughts, state.securityPin),
                    counterScript: scramble(item.counterScript, state.securityPin),
                    distressLevel: item.distressLevel,
                    parableRef: item.parableRef
                }));
            }
            /*
             * SECURITY NOTE — POLARIS ENCRYPTION
             * Polaris state (state.polaris) currently stores proof point ledger entries,
             * anchor completion data, and resilience metrics. These are currently
             * non-sensitive and low-risk (counts, timestamps, task labels).
             *
             * HOWEVER: If sensitive notes, therapist-facing summaries, or free-text
             * reflections are ever added to the Polaris proof ledger or quest system,
             * they MUST be encrypted using the same scramble/descramble PIN method
             * applied to reasonsLive, safeContacts, gratitudeJournal, and
             * thoughtCorrections. Unencrypted sensitive free-text in localStorage
             * would violate the privacy contract this app makes with the user.
             *
             * To extend: add polaris.proof.ledger[].label and any future free-text
             * fields to the scramble block in saveState() and the descramble block
             * in decryptStateData().
             */
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
            state.safetyJournal = state.safetyJournal.map(item => ({
                id: item.id,
                timestamp: item.timestamp,
                rawThoughts: descramble(item.rawThoughts, pin),
                counterScript: descramble(item.counterScript, pin),
                distressLevel: item.distressLevel,
                parableRef: item.parableRef
            }));
        }

        function toggleAppView(showApp) {
            const publicElements = document.querySelectorAll("[data-public-site]");
            const appContainer = document.querySelector(".app-container");
            if (showApp) {
                publicElements.forEach(el => el.classList.add("hidden"));
                if (appContainer) appContainer.classList.remove("hidden");
            } else {
                publicElements.forEach(el => el.classList.remove("hidden"));
                if (appContainer) appContainer.classList.add("hidden");
            }
        }

        function showScreen(screenId) {
            toggleAppView(true);
            Object.keys(screens).forEach(key => {
                if (key === screenId) {
                    screens[key].classList.remove("hidden");
                } else {
                    screens[key].classList.add("hidden");
                }
            });
            if (screenId === "welcome") {
                updateWelcomeScreenDynamicGreeting();
            }
        }

        function getActiveTabId() {
            const activeBtn = document.querySelector(".nav-item.active");
            return activeBtn ? activeBtn.getAttribute("data-tab") : "";
        }

        function showTab(tabId) {
            ensurePolarisState();
            const hiddenTabs = ["progression", "documentcenter", "explorer"];
            if (state.polaris.futureNarrowingActive && hiddenTabs.includes(tabId)) {
                showToast("Future Narrowing Active. Horizon restricted to Polaris/Dashboard.", "warning");
                return false;
            }
            Object.keys(tabs).forEach(key => {
                if (key === tabId) {
                    tabs[key].classList.remove("hidden");
                } else {
                    tabs[key].classList.add("hidden");
                }
            });
            
            document.querySelectorAll(".nav-item").forEach(btn => {
                if (btn.getAttribute("data-tab") === tabId) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });

            if (tabId === "dashboard") {
                renderDashboard();
            } else if (tabId === "mediaconsole") {
                renderMediaConsole();
            } else if (tabId === "progression") {
                renderProgressionDashboard();
                if (typeof renderPolarisGrowthLayer === 'function') renderPolarisGrowthLayer();
            } else if (tabId === "cognitivelab") {
                renderCognitiveLab();
            } else if (tabId === "documentcenter") {
                renderDocumentCenter();
            } else if (tabId === "polaris") {
                renderPolarisTab();
            } else if (tabId === "momentum") {
                renderMomentumTab();
            } else if (tabId === "suicideprevention") {
                renderSuicidePreventionTab();
            }
            return true;
        }

        function setupEventListeners() {
            // Crisis Safe Box distress rating events
            const btnUnlock = document.getElementById("btn-unlock-safebox");
            if (btnUnlock) {
                btnUnlock.addEventListener("click", () => {
                    const ratingSelect = document.getElementById("safebox-pre-distress");
                    const rating = ratingSelect ? parseInt(ratingSelect.value) : 5;
                    if (!state.safeboxLogs) state.safeboxLogs = [];
                    state.safeboxLogs.push({ timestamp: Date.now(), type: 'pre', rating: rating });
                    saveState();

                    const overlay = document.getElementById("safebox-distress-overlay");
                    const content = document.getElementById("safebox-content");
                    if (overlay) overlay.style.display = "none";
                    if (content) content.style.display = "block";
                });
            }

            const btnClose = document.getElementById("btn-close-safebox");
            if (btnClose) {
                btnClose.addEventListener("click", () => {
                    const content = document.getElementById("safebox-content");
                    const postOverlay = document.getElementById("safebox-post-distress-overlay");
                    if (content) content.style.display = "none";
                    if (postOverlay) postOverlay.style.display = "block";
                });
            }

            const btnFinalize = document.getElementById("btn-finalize-safebox");
            if (btnFinalize) {
                btnFinalize.addEventListener("click", () => {
                    const ratingSelect = document.getElementById("safebox-post-distress");
                    const rating = ratingSelect ? parseInt(ratingSelect.value) : 5;
                    if (!state.safeboxLogs) state.safeboxLogs = [];
                    state.safeboxLogs.push({ timestamp: Date.now(), type: 'post', rating: rating });
                    saveState();

                    const feedbackMsg = document.getElementById("distress-feedback-msg");
                    const btnReturn = document.getElementById("btn-return-dashboard");
                    if (feedbackMsg) feedbackMsg.style.display = "block";
                    if (btnReturn) btnReturn.style.display = "block";
                });
            }

            const btnReturnDash = document.getElementById("btn-return-dashboard");
            if (btnReturnDash) {
                btnReturnDash.addEventListener("click", () => {
                    window.location.hash = '#/dashboard';
                });
            }

            // Caring Contact modal acknowledgement
            const btnAcknowledgeCC = document.getElementById("btn-acknowledge-caring-contact");
            if (btnAcknowledgeCC) {
                btnAcknowledgeCC.addEventListener("click", () => {
                    state.caringContactStage = 1;
                    saveState();
                    const modal = document.getElementById("caring-contact-modal");
                    if (modal) {
                        modal.classList.remove("active");
                    }
                });
            }

            document.getElementById("btn-start-intake").addEventListener("click", () => {
                showScreen("intake");
                initIntakeForm();
            });

            document.getElementById("btn-back-welcome").addEventListener("click", () => {
                showScreen("welcome");
            });

            
            // Wizard Next/Prev Logic
            document.querySelectorAll(".btn-wizard-next").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const currentSection = e.target.closest(".accordion-section");
                    const nextSection = currentSection.nextElementSibling;
                    if (nextSection && nextSection.classList.contains("accordion-section")) {
                        currentSection.classList.remove("active");
                        nextSection.classList.add("active");
                        
                        // Handle final step completion if needed
                        if(nextSection.getAttribute('data-section') === 'crisis') {
                            // Example hook: do something when reaching the last step
                        }
                    }
                });
            });

            document.querySelectorAll(".btn-wizard-prev").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const currentSection = e.target.closest(".accordion-section");
                    const prevSection = currentSection.previousElementSibling;
                    if (prevSection && prevSection.classList.contains("accordion-section")) {
                        currentSection.classList.remove("active");
                        prevSection.classList.add("active");
                    }
                });
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

            document.querySelectorAll(".nav-item").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const tabBtn = e.target.closest(".nav-item");
                    if (!tabBtn) return;
                    const tabId = tabBtn.getAttribute("data-tab");
                    const buttonId = tabBtn.id;
                    if (tabId === "reset-intake") {
                        if (confirm("Are you sure you want to reset your intake data? This will clear your current dashboard and progress history.")) {
                            resetToOnboarding();
                        }
                    } else if (buttonId === "btn-tab-lock") {
                        lockApplication();
                    } else {
                        showTab(tabId);
                        if (tabId === "safebox") {
                            renderSafeBox();
                            if (isHighRiskActive()) {
                                triggerCrisisOverlay();
                            }
                        }
                        window.location.hash = `#/${tabId}`;
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
                    
                    const safetyCard = document.getElementById("safety-checkin-card");
                    if (safetyCard) {
                        safetyCard.style.display = "block";
                    } else {
                        renderDailyChecklist();
                        updateDashboardMetrics();
                    }
                });
            });

            // Toggle active state on safety buttons
            const safetyButtons = document.querySelectorAll("#safety-buttons-container .btn");
            safetyButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    safetyButtons.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                });
            });

            // Submit safety check-in responses
            document.getElementById("submit-safety-check").addEventListener("click", () => {
                const ideationVal = parseInt(document.querySelector('input[name="ideation-24h"]:checked')?.value || "0");
                const safetyBtn = document.querySelector("#safety-buttons-container .btn.active");
                const safetyVal = safetyBtn ? safetyBtn.getAttribute("data-safety") : "yes";
                
                const assessment = {
                    id: "assessment-" + Date.now(),
                    timestamp: new Date().toISOString(),
                    type: "quick-screen",
                    ideation: { value: ideationVal },
                    safety: { value: safetyVal },
                    responses: {
                        ideationPresence: ideationVal,
                        feeling_safe: safetyVal === "yes"
                    }
                };
                
                // Initialize safety tracking in state if needed
                state.safetyAssessments = state.safetyAssessments || [];
                state.safetyAssessments.push(assessment);
                
                // Calculate risk
                let riskLevel = { level: 'low', score: 0 };
                if (safetyDetection) {
                    riskLevel = safetyDetection.calculateRiskLevel({
                        quickScreen: assessment,
                        patterns: safetyDetection.detectRiskPatterns ? safetyDetection.detectRiskPatterns(state) : []
                    });
                } else {
                    let score = ideationVal;
                    if (safetyVal === "no") score += 5;
                    else if (safetyVal === "unsure") score += 2;
                    let level = 'low';
                    if (score >= 8) level = 'acute';
                    else if (score >= 5) level = 'elevated';
                    else if (score >= 3) level = 'moderate';
                    else if (score >= 1) level = 'low-moderate';
                    riskLevel = { level, score };
                }
                
                // Hide card
                document.getElementById("safety-checkin-card").style.display = "none";
                
                // Update safety state
                state.safety = state.safety || {};
                if (riskLevel.level === "acute" || riskLevel.level === "elevated" || safetyVal === "no") {
                    state.safety.suicide = 2; // High alert
                    triggerCrisisOverlay();
                } else if (riskLevel.level === "moderate" || safetyVal === "unsure") {
                    state.safety.suicide = 1;
                } else {
                    state.safety.suicide = 0;
                }
                
                // Adapt anchors based on risk
                if (polarisEnhanced && polarisEnhanced.generateAdaptiveAnchors) {
                    state.polaris = polarisEnhanced.generateAdaptiveAnchors(riskLevel, state.polaris || {});
                }
                
                saveState();
                renderDailyChecklist();
                updateDashboardMetrics();
                
                showToast("Safety check complete. Risk level: " + riskLevel.level.toUpperCase(), "success");
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
                window.location.hash = "#/safebox";
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
                showToast('Anonymized progress briefing copied to clipboard!', 'success');
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
            setupSafetyPreventionListeners();
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

            document.getElementById("select-future-narrowing").value = state.futureNarrowing || "action";
            document.getElementById("select-startup-drag").value = state.startupDrag || "none";
            document.getElementById("select-rumination").value = state.rumination || "redirect";
            document.getElementById("select-social-isolation").value = state.socialIsolation || "neutral";
            document.getElementById("select-external-anchor").value = state.externalAnchor || "none";

            // Helper to match legacy values to closest new allowed option
            function getClosestValue(val, allowed) {
                return allowed.reduce((prev, curr) => Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
            }

            // Restore rating buttons with closest-match mapping
            const ratingConfig = {
                sleep: [0, 2, 4],
                morning: [0, 2, 4],
                initiation: [0, 2, 4],
                clutter: [0, 2, 4],
                energy: [0, 1, 3, 4],
                shame: [0, 2, 4],
                hygiene: [0, 4],
                eating: [0, 4],
                social: [0, 4],
                meaning: [0, 2, 4]
            };

            Object.keys(ratingConfig).forEach(metric => {
                const rawVal = state.ratings[metric] !== undefined ? state.ratings[metric] : 0;
                const allowed = ratingConfig[metric];
                const closestVal = getClosestValue(rawVal, allowed);
                
                // Keep state synchronized with closest available UI option
                state.ratings[metric] = closestVal;

                const container = document.querySelector(`.rating-buttons[data-metric="${metric}"]`);
                if (container) {
                    container.querySelectorAll(".rating-btn").forEach(btn => {
                        const btnVal = parseInt(btn.getAttribute("data-val"));
                        if (btnVal === closestVal) {
                            btn.classList.add("selected");
                        } else {
                            btn.classList.remove("selected");
                        }
                    });
                }
            });

            // Restore safety choices
            Object.keys(state.safety).forEach(safetyType => {
                const val = state.safety[safetyType] !== undefined ? state.safety[safetyType] : 0;
                const row = document.querySelector(`.safety-row[data-safety-type="${safetyType}"]`);
                if (row) {
                    row.querySelectorAll(".safety-option-btn").forEach(btn => {
                        const btnVal = parseInt(btn.getAttribute("data-val"));
                        if (btnVal === val) {
                            btn.classList.add("selected");
                        } else {
                            btn.classList.remove("selected");
                        }
                    });
                }
            });
            
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
                handleRouting();
            } else {
                const keypadCard = document.querySelector("#screen-lock .glass-card");
                keypadCard.style.animation = "none";
                setTimeout(() => {
                    keypadCard.style.animation = "shake 0.3s ease-in-out";
                }, 10);
                showToast('Incorrect PIN.', 'error');
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

        // ==========================================================
        // TOAST NOTIFICATION SYSTEM (replaces all alert() calls)
        // ==========================================================
        function showToast(message, type = 'info', durationMs = 4000) {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const colorMap = {
                success: { bg: 'rgba(20, 200, 175, 0.12)', border: 'rgba(20, 200, 175, 0.35)', text: 'var(--accent-teal)', icon: '✓' },
                warning: { bg: 'rgba(240, 115, 30, 0.12)', border: 'rgba(240, 115, 30, 0.35)', text: 'var(--accent-orange)', icon: '⚠' },
                error:   { bg: 'rgba(230, 40, 60, 0.12)', border: 'rgba(230, 40, 60, 0.35)', text: 'var(--accent-red)', icon: '✖' },
                info:    { bg: 'rgba(165, 120, 240, 0.12)', border: 'rgba(165, 120, 240, 0.35)', text: 'var(--accent-lavender)', icon: 'ℹ' }
            };
            const c = colorMap[type] || colorMap.info;

            const toast = document.createElement('div');
            toast.style.cssText = `pointer-events: auto; display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.75rem 1rem; border-radius: var(--radius-sm, 8px); background: ${c.bg}; border: 1px solid ${c.border}; backdrop-filter: blur(12px); color: var(--text-primary, #e8eaf0); font-size: 0.85rem; line-height: 1.45; box-shadow: 0 4px 16px rgba(0,0,0,0.25); opacity: 0; transform: translateX(40px); transition: opacity 0.3s, transform 0.3s;`;
            toast.innerHTML = `<span style="color: ${c.text}; font-size: 1.1rem; flex-shrink: 0; margin-top: 1px;">${c.icon}</span><span>${message}</span>`;

            container.appendChild(toast);
            // Trigger entrance animation
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(40px)';
                setTimeout(() => toast.remove(), 350);
            }, durationMs);
        }

        function lockApplication() {
            if (state.securityPin) {
                state.isLocked = true;
                saveState();
                loadState();
                showScreen("lock");
                resetPinDots();
            } else {
                showToast('You must define a 4-digit Security PIN in Intake Section 1 to lock the application.', 'warning');
            }
        }

        function submitIntake() {
            const pin = document.getElementById("input-set-pin").value.trim();
            if (pin.length > 0 && pin.length !== 4) {
                showToast('Your Security PIN must be exactly 4 digits long.', 'warning');
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
            
            state.futureNarrowing = document.getElementById("select-future-narrowing").value;
            state.startupDrag = document.getElementById("select-startup-drag").value;
            state.rumination = document.getElementById("select-rumination").value;
            state.socialIsolation = document.getElementById("select-social-isolation").value;
            state.externalAnchor = document.getElementById("select-external-anchor").value;

            state.dominantPattern = calculatePrimaryPattern();
            state.isOnboarded = true;
            
            if (state.futureNarrowing === "none") {
                state.todayEnergy = "collapse";
                ensurePolarisState();
                state.polaris.day.floorWinsMode = true;
            } else {
                state.todayEnergy = "medium";
            }
            state.currentLayer = 1;
            
            saveState();
            showScreen("dashboard");
            window.location.hash = "#/dashboard";
            
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
            
            const banner = document.getElementById("polaris-activation-banner");
            if (banner) {
                if (state.polarisUpgrade) {
                    banner.classList.add("hidden");
                } else {
                    banner.classList.remove("hidden");
                }
            }

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
            renderReEntryCard();
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

        function getExternalAnchorTask() {
            if (!state.externalAnchor || state.externalAnchor === "none") return null;
            const map = {
                pet: "Feed and care for your pet (Responsibility Anchor)",
                plant: "Water plants / care for environment (Responsibility Anchor)",
                checkin: "Structured check-in with your partner (Responsibility Anchor)",
                duty: "Execute scheduled obligation or recurring chore (Responsibility Anchor)"
            };
            return map[state.externalAnchor];
        }

        function renderDailyChecklist() {
            const container = document.getElementById("daily-checklist-items");
            container.innerHTML = "";
            
            const energy = state.todayEnergy;
            const badge = document.getElementById("active-energy-badge");
            const warning = document.getElementById("collapse-warning-banner");
            
            badge.className = `badge badge-${energy}`;
            badge.innerHTML = `${energy.toUpperCase()} ENERGY`;
            
            const isPossibilityCollapse = state.futureNarrowing === "none";
            if (isPossibilityCollapse) {
                warning.innerHTML = `<strong>Possibility Collapse active:</strong> Plan scaled down to protect self-trust. The goal is not hope; it is one proof action. <em>If you feel unsafe or in danger, please open the Crisis Safe Box or text/call 988.</em>`;
                warning.classList.remove("hidden");
            } else if (energy === "collapse") {
                warning.innerHTML = `<strong>Protect the Floor:</strong> You are in collapse mode. Standard goals are disabled to eliminate shame. Complete only these three floor anchors to protect your self-trust.`;
                warning.classList.remove("hidden");
            } else {
                warning.classList.add("hidden");
            }
            
            let tasks = [];
            
            if (energy === "collapse" || energy === "low" || isPossibilityCollapse) {
                tasks = [
                    { label: state.mvd[0], isMvd: true },
                    { label: state.mvd[1], isMvd: true },
                    { label: state.mvd[2], isMvd: true }
                ];
                // Social presence as regulation
                tasks.push({ label: "Social Presence: Sit near people, send one low-pressure text, or reply to one message", isMvd: false });
                const extTask = getExternalAnchorTask();
                if (extTask) {
                    tasks.push({ label: extTask, isMvd: false });
                }
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

                // Inject custom professional/user recovery tasks
                if (state.customTasks && state.customTasks.length > 0) {
                    state.customTasks.forEach(task => {
                        tasks.push({ label: task, isMvd: false });
                    });
                }

                // Social presence as regulation
                tasks.push({ label: "Social Presence: Sit near people, send one low-pressure text, or reply to one message", isMvd: false });

                // External Anchor
                const extTask = getExternalAnchorTask();
                if (extTask) {
                    tasks.push({ label: extTask, isMvd: false });
                }
            }

            // Inject adaptive safety anchors
            if (state.polaris && state.polaris.safetyAnchors && state.polaris.safetyAnchors.length > 0) {
                state.polaris.safetyAnchors.forEach(a => {
                    tasks.push({ label: a.text, isMvd: a.critical || false });
                });
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
            
            if (energy === "collapse" || energy === "low" || state.futureNarrowing === "none") {
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
            // Reset distress overlays and content visibility
            const overlay = document.getElementById("safebox-distress-overlay");
            const content = document.getElementById("safebox-content");
            const postOverlay = document.getElementById("safebox-post-distress-overlay");
            const feedbackMsg = document.getElementById("distress-feedback-msg");
            const btnReturn = document.getElementById("btn-return-dashboard");

            if (overlay) overlay.style.display = "block";
            if (content) content.style.display = "none";
            if (postOverlay) postOverlay.style.display = "none";
            if (feedbackMsg) feedbackMsg.style.display = "none";
            if (btnReturn) btnReturn.style.display = "none";

            document.getElementById("display-reasons-live").innerHTML = state.reasonsLive || "No reasons added yet. Fill out safety details in Intake.";
            document.getElementById("display-distraction-activities").innerHTML = state.distractions || "No distraction activities listed yet.";
            document.getElementById("display-safe-contacts").innerHTML = state.safeContacts || "No safe contacts listed yet.";
            renderLinkedFilesList();
        }

        function checkCaringContactModal() {
            ensurePolarisState();
            if (state.lastCrisisEvent && state.caringContactStage === 0) {
                const elapsed = Date.now() - state.lastCrisisEvent;
                const twentyFourHours = 24 * 60 * 60 * 1000;
                if (elapsed >= twentyFourHours) {
                    const modal = document.getElementById("caring-contact-modal");
                    if (modal) {
                        modal.classList.add("active");
                    }
                }
            }
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
                        <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${file.path.replace(/\\/g, '\\\\')}'); showToast('Path copied to clipboard!', 'success')" style="padding:0.4rem 0.6rem; font-size:0.75rem;">Copy Path</button>
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
                showToast('Please enter both the file label and its local absolute system path.', 'warning');
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
            const errorFallback = document.getElementById("media-error-fallback");
            
            title.innerHTML = track.title;
            typeLabel.innerHTML = `Format: ${track.type.toUpperCase()} | Duration: ${track.duration} | Relative Offline Link`;
            
            if (errorFallback) errorFallback.classList.add("hidden");

            const handleError = () => {
                if (audio) audio.style.display = "none";
                if (videoContainer) videoContainer.classList.add("hidden");
                if (errorFallback) {
                    errorFallback.classList.remove("hidden");
                    const streamUrl = track.url || "https://statenotfate.org/media"; // Placeholder until exact external URLs are ready
                    errorFallback.innerHTML = `
                        <h4 class="text-orange" style="margin-top:0; margin-bottom:0.75rem; font-size:1rem; color: #ffcc00;">⚠️ Local File Not Found (Email-Safe Core Frame):</h4>
                        <p style="font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-secondary); line-height: 1.4;">
                            To keep this app lightweight and emailable (&lt; 1.5 MB), the heavy 500 MB media assets are excluded from this core program frame.
                        </p>
                        <div style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.5rem;">Options to play:</div>
                        <ol style="font-size: 0.85rem; color: var(--text-secondary); padding-left: 1.25rem; margin-bottom: 1.5rem; line-height: 1.5;">
                            <li style="margin-bottom: 0.5rem;"><strong class="text-teal">Stream Online:</strong> Stream this high-fidelity track instantly from our secure vault.</li>
                            <li><strong>Play Locally:</strong> Download the full version or place this file (<code>${track.file}</code>) in your local <code>knowledge/</code> folder.</li>
                        </ol>
                        <a href="${streamUrl}" target="_blank" class="btn btn-primary" style="background: var(--accent-teal); color: #0b0f13; border:none; text-decoration: none; padding: 0.6rem 1.2rem; font-weight: 600; display: inline-block;">Stream Online ➔</a>
                    `;
                }
            };

            audio.onerror = handleError;
            video.onerror = handleError;
            
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
                showToast(`Please answer all questions. Question ${unanswered + 1} is missing.`, 'warning');
                return;
            }
            
            const score = tempPhqAnswers.reduce((sum, val) => sum + val, 0);
            
            let severity = 'Minimal Depression';
            let interpretation = '';
            let recommendation = '';
            if (score >= 20) {
                severity = 'Severe Depression';
                interpretation = 'Your responses indicate severe depressive symptoms. This level of distress significantly impairs daily functioning and requires professional intervention.';
                recommendation = '⚠ Strongly recommended: Contact your physician, psychiatrist, or therapist immediately. This score warrants active professional management. If you are in crisis, call or text 988.';
            } else if (score >= 15) {
                severity = 'Moderately Severe';
                interpretation = 'Your responses suggest moderately severe depression. Routine daily tasks are likely significantly harder than usual, and self-motivation is unreliable.';
                recommendation = 'Recommended: Active treatment with therapy and/or medication. Review your MVD floor — lower the bar to protect self-trust. Floor Wins count.';
            } else if (score >= 10) {
                severity = 'Moderate Depression';
                interpretation = 'Your responses reflect moderate depressive symptoms. You may experience persistent low energy, disrupted sleep, and difficulty starting tasks.';
                recommendation = 'Consider: Treatment plan review with your care provider. Continue using daily anchors and track restart speed rather than streak purity.';
            } else if (score >= 5) {
                severity = 'Mild Depression';
                interpretation = 'Your responses suggest mild depressive symptoms. You may have some difficult days but retain partial functioning capacity.';
                recommendation = 'Monitor: Continue daily Floor anchors. Reassess in 2 weeks. If symptoms persist or worsen, consult your care provider.';
            } else {
                interpretation = 'Your responses indicate minimal or no depressive symptoms at this time. This is measurable progress.';
                recommendation = 'Maintain: Keep your current anchors running. Proof of stability is objective data. Reassess in 2–4 weeks to confirm trajectory.';
            }
            
            const today = getTodayString();
            state.phq9History.push({
                date: today,
                score: score,
                severity: severity,
                interpretation: interpretation,
                recommendation: recommendation
            });
            
            const q9SuicidalityScore = tempPhqAnswers[8];
            if (q9SuicidalityScore >= 1) {
                state.safety.suicide = 2;
                triggerCrisisOverlay();
            }
            
            saveState();

            // Display results in the PHQ-9 modal interpretation panel
            const resultPanel = document.getElementById('phq-result-panel');
            const scoreBadge = document.getElementById('phq-result-score-badge');
            const severityEl = document.getElementById('phq-result-severity');
            const interpEl = document.getElementById('phq-result-interpretation');
            const recEl = document.getElementById('phq-result-recommendation');

            resultPanel.classList.remove('hidden');
            scoreBadge.textContent = `Score: ${score}/27`;

            // Color-code the score badge
            if (score >= 20) { scoreBadge.className = 'badge badge-collapse'; }
            else if (score >= 15) { scoreBadge.className = 'badge'; scoreBadge.style.cssText = 'font-size:0.85rem;padding:0.25rem 0.6rem;background:rgba(240,115,30,0.2);color:var(--accent-orange);border:1px solid rgba(240,115,30,0.3);'; }
            else if (score >= 10) { scoreBadge.className = 'badge badge-low'; scoreBadge.style.cssText = 'font-size:0.85rem;padding:0.25rem 0.6rem;'; }
            else if (score >= 5) { scoreBadge.className = 'badge badge-medium'; scoreBadge.style.cssText = 'font-size:0.85rem;padding:0.25rem 0.6rem;'; }
            else { scoreBadge.className = 'badge badge-high'; scoreBadge.style.cssText = 'font-size:0.85rem;padding:0.25rem 0.6rem;'; }

            severityEl.textContent = severity;
            interpEl.textContent = interpretation;
            recEl.innerHTML = `<strong style="color: var(--accent-teal);">Recommendation:</strong> ${recommendation}`;

            // Scroll the result panel into view
            resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Change Submit button to Close
            const submitBtn = document.getElementById('btn-submit-phq');
            submitBtn.textContent = '✓ Close Assessment';
            submitBtn.onclick = function() {
                closePhqAssessmentModal();
                resultPanel.classList.add('hidden');
                submitBtn.innerHTML = '✓ Submit Results';
                submitBtn.onclick = null;
                // Re-bind original via event listener (it was set in setupEventListeners)
                submitBtn.addEventListener('click', submitPhqAssessment, { once: false });
            };

            renderProgressionDashboard();
            showToast(`PHQ-9 recorded: ${severity} (Score: ${score}/27)`, score >= 15 ? 'warning' : 'success', 5000);
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

        // ==========================================
        // SUICIDE PREVENTION MODULE INTEGRATION
        // ==========================================
        let currentSensoryStep = 1;
        const sensorySteps = [
            { title: "Step 1: Sight", text: "Name 5 things you can SEE around you right now (focus on colors, shapes, light)." },
            { title: "Step 2: Touch", text: "Name 4 things you can TOUCH/FEEL (e.g. your clothes, the floor, the table, your skin)." },
            { title: "Step 3: Sound", text: "Name 3 things you can HEAR (e.g. traffic, computer hum, wind, birds)." },
            { title: "Step 4: Smell", text: "Name 2 things you can SMELL (e.g. coffee, paper, air, soap)." },
            { title: "Step 5: Taste / Self", text: "Name 1 thing you can TASTE or one small positive capability of your body/mind." }
        ];

        let inlineBreathingInterval = null;
        let inlineBreathingPhase = 0;

        function populateRegionalResources(country) {
            const listContainer = document.getElementById("sp-regional-resources-list");
            if (!listContainer) return;
            listContainer.innerHTML = "";
            
            let resources = [];
            if (country === "us") {
                resources = [
                    { name: "Suicide & Crisis Lifeline", details: "Call/Text 988" },
                    { name: "Crisis Text Line", details: "Text HOME to 741741" },
                    { name: "The Trevor Project (LGBTQ)", details: "Call 866-488-7386 or Text START to 678-678" },
                    { name: "Veterans Crisis Line", details: "Call 988, Press 1 or Text 838255" }
                ];
            } else if (country === "ca") {
                resources = [
                    { name: "Suicide Crisis Helpline", details: "Call/Text 988" },
                    { name: "Kids Help Phone (Youth)", details: "Call 1-800-668-6868 or Text CONNECT to 686868" },
                    { name: "Hope for Wellness (Indigenous)", details: "Call 1-855-242-3310" }
                ];
            } else if (country === "uk") {
                resources = [
                    { name: "Samaritans helpline", details: "Call 116 123" },
                    { name: "Shout Crisis Text Line", details: "Text SHOUT to 85258" },
                    { name: "SANEline (Mental Health Support)", details: "Call 0300 304 7000" }
                ];
            } else if (country === "au") {
                resources = [
                    { name: "Lifeline Australia", details: "Call 13 11 14" },
                    { name: "Beyond Blue", details: "Call 1300 22 4636" },
                    { name: "Kids Helpline (5-25 yr)", details: "Call 1800 55 1800" }
                ];
            } else {
                resources = [
                    { name: "Befrienders Worldwide", details: "Find local lifelines at befrienders.org" },
                    { name: "International Association for Suicide Prevention", details: "Find crisis centers at iasp.info" }
                ];
            }

            resources.forEach(r => {
                const li = document.createElement("div");
                li.style.display = "flex";
                li.style.justifyContent = "space-between";
                li.style.alignItems = "center";
                li.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
                li.style.padding = "0.4rem 0";
                li.style.fontSize = "0.8rem";
                li.innerHTML = `<span>${r.name}</span><strong style="color: var(--accent-orange);">${r.details}</strong>`;
                listContainer.appendChild(li);
            });
        }

        function renderSafetyJournalList() {
            const container = document.getElementById("sp-journal-history-list");
            if (!container) return;
            container.innerHTML = "";

            const searchQuery = document.getElementById("input-sp-journal-search")?.value.toLowerCase().trim() || "";

            const entries = state.safetyJournal || [];
            const filtered = entries.filter(e => {
                if (!searchQuery) return true;
                const matchThoughts = e.rawThoughts && e.rawThoughts.toLowerCase().includes(searchQuery);
                const matchCounter = e.counterScript && e.counterScript.toLowerCase().includes(searchQuery);
                const matchParable = e.parableRef && e.parableRef.toLowerCase().includes(searchQuery);
                return matchThoughts || matchCounter || matchParable;
            });

            if (filtered.length === 0) {
                container.innerHTML = `<div class="text-muted center-text py-3" style="font-size:0.85rem; font-style:italic;">No restraint journal entries recorded yet.</div>`;
                return;
            }

            [...filtered].reverse().forEach(item => {
                const card = document.createElement("div");
                card.className = "sp-journal-item mb-2";

                let distressClass = "sp-journal-distress-low";
                if (item.distressLevel >= 8) distressClass = "sp-journal-distress-acute";
                else if (item.distressLevel >= 5) distressClass = "sp-journal-distress-high";
                else if (item.distressLevel >= 3) distressClass = "sp-journal-distress-medium";

                const dateStr = new Date(item.timestamp).toLocaleString();
                const parableLabel = item.parableRef ? ` | Reflected: ${item.parableRef}` : "";

                card.innerHTML = `
                    <div class="sp-journal-item-header">
                        <span style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${dateStr}${parableLabel}</span>
                        <div style="display:flex; gap:0.5rem; align-items:center;">
                            <span class="sp-journal-distress-badge ${distressClass}">Distress: ${item.distressLevel}/10</span>
                            <button class="sp-journal-remove-btn" data-id="${item.id}" style="background:none; border:none; color:var(--accent-red); cursor:pointer; font-size:1.1rem; line-height:1; padding:0 0.25rem;">×</button>
                        </div>
                    </div>
                    <div style="font-size:0.8rem; color:var(--accent-red); text-decoration:line-through; opacity:0.65; margin-bottom:0.35rem; font-style:italic; line-height:1.4;">
                        <strong>Urge:</strong> "${item.rawThoughts}"
                    </div>
                    <div style="font-size:0.85rem; color:var(--accent-teal); font-weight:500; line-height:1.4;">
                        <strong>Restraint Script:</strong> "${item.counterScript}"
                    </div>
                `;

                // Wire up delete event
                card.querySelector(".sp-journal-remove-btn").addEventListener("click", (e) => {
                    const idToDelete = parseInt(e.target.getAttribute("data-id"));
                    if (confirm("Are you sure you want to delete this restraint journal entry?")) {
                        state.safetyJournal = state.safetyJournal.filter(entry => entry.id !== idToDelete);
                        saveState();
                        renderSafetyJournalList();
                    }
                });

                container.appendChild(card);
            });
        }

        function renderSuicidePreventionTab() {
            // Fill Safety Plan Editor textareas
            document.getElementById("input-sp-reasons").value = state.reasonsLive || "";
            document.getElementById("input-sp-distractions").value = state.distractions || "";
            document.getElementById("input-sp-contacts").value = state.safeContacts || "";

            // Fill Support Map inputs
            const anchorInput = document.getElementById("input-sp-anchor-person");
            const bufferInput = document.getElementById("input-sp-buffer-contact");
            const envInput = document.getElementById("input-sp-safe-environment");
            if (anchorInput && state.supportMap) anchorInput.value = state.supportMap.anchorPerson || "";
            if (bufferInput && state.supportMap) bufferInput.value = state.supportMap.bufferContact || "";
            if (envInput && state.supportMap) envInput.value = state.supportMap.safeEnvironment || "";

            // Calculate active risk level
            let riskLevel = { level: 'low', score: 0 };
            if (safetyDetection) {
                const latestCheckin = state.safetyAssessments && state.safetyAssessments.length > 0
                    ? state.safetyAssessments[state.safetyAssessments.length - 1]
                    : null;
                riskLevel = safetyDetection.calculateRiskLevel({
                    quickScreen: latestCheckin,
                    patterns: safetyDetection.detectRiskPatterns ? safetyDetection.detectRiskPatterns(state) : []
                });
            } else {
                let score = 0;
                if (state.safety && state.safety.suicide === 2) score = 8;
                else if (state.safety && state.safety.suicide === 1) score = 4;
                let level = 'low';
                if (score >= 8) level = 'acute';
                else if (score >= 5) level = 'elevated';
                else if (score >= 3) level = 'moderate';
                riskLevel = { level, score };
            }

            // Update active risk badge
            const badge = document.getElementById("safety-sp-risk-badge");
            if (badge) {
                badge.innerText = riskLevel.level.toUpperCase();
                
                badge.className = ""; // clear all custom classes
                if (riskLevel.level === "acute") {
                    badge.style.color = "var(--accent-red)";
                } else if (riskLevel.level === "elevated") {
                    badge.style.color = "var(--accent-orange)";
                } else if (riskLevel.level === "moderate") {
                    badge.style.color = "var(--accent-lavender)";
                } else {
                    badge.style.color = "var(--accent-teal)";
                }
            }

            // Show deterioration warnings if any
            const warningsContainer = document.getElementById("safety-sp-warnings-container");
            const warningsList = document.getElementById("safety-sp-warnings-list");
            if (warningsContainer && warningsList) {
                warningsList.innerHTML = "";
                
                let activeWarnings = [];
                if (safetyDetection && safetyDetection.detectRiskPatterns) {
                    const patterns = safetyDetection.detectRiskPatterns(state);
                    patterns.forEach(p => activeWarnings.push(p.description));
                }
                
                // If distress is very high on recent journal check-ins, add alert
                const recentJournal = state.safetyJournal || [];
                if (recentJournal.length > 0 && recentJournal[recentJournal.length - 1].distressLevel >= 8) {
                    activeWarnings.push(`Recent acute distress check-in (Level ${recentJournal[recentJournal.length - 1].distressLevel}/10)`);
                }

                if (activeWarnings.length > 0) {
                    warningsContainer.classList.remove("hidden");
                    activeWarnings.forEach(w => {
                        const li = document.createElement("li");
                        li.innerText = w;
                        warningsList.appendChild(li);
                    });
                } else {
                    warningsContainer.classList.add("hidden");
                }
            }

            // Next Safety Screening schedule
            const checkinTime = document.getElementById("safety-sp-checkin-time");
            if (checkinTime) {
                if (state.safetyAssessments && state.safetyAssessments.length > 0) {
                    const last = new Date(state.safetyAssessments[state.safetyAssessments.length - 1].timestamp);
                    const diffDays = Math.ceil((new Date() - last) / (1000 * 60 * 60 * 24));
                    if (diffDays >= 7) {
                        checkinTime.innerText = "Overdue (Check-in Required)";
                        checkinTime.style.color = "var(--accent-orange)";
                    } else {
                        checkinTime.innerText = `Completed (${diffDays}d ago)`;
                        checkinTime.style.color = "var(--text-secondary)";
                    }
                } else {
                    checkinTime.innerText = "Pending Initial Assessment";
                    checkinTime.style.color = "var(--accent-orange)";
                }
            }

            // Populate regional hotlines based on country select
            const countrySelect = document.getElementById("select-sp-country");
            if (countrySelect) {
                populateRegionalResources(countrySelect.value);
            }

            // Populate parable cards completion status
            const parables = ["chioran", "restraint", "gap10", "council", "means"];
            parables.forEach(pid => {
                const card = document.getElementById(`parable-card-${pid}`);
                const badge = document.getElementById(`parable-badge-${pid}`);
                if (card && badge) {
                    if (state.parablesCompleted && state.parablesCompleted[pid]) {
                        card.classList.add("completed");
                        badge.innerText = "Completed ✓";
                        badge.style.background = "rgba(0, 255, 200, 0.15)";
                        badge.style.color = "var(--accent-teal)";
                        // Set textarea reflection if already done
                        const reflectTextarea = document.getElementById(`reflect-${pid}`);
                        if (reflectTextarea) {
                            reflectTextarea.value = state.parablesCompleted[pid].reflection || "";
                        }
                    } else {
                        card.classList.remove("completed");
                        badge.innerText = "Unread";
                        badge.style.background = "rgba(255, 255, 255, 0.05)";
                        badge.style.color = "var(--text-secondary)";
                    }
                }
            });

            // Render the safety journal timeline list
            renderSafetyJournalList();

            // Render Compendium if active
            const compendiumBtn = document.getElementById("btn-sp-subtab-compendium");
            if (compendiumBtn && compendiumBtn.classList.contains("active")) {
                renderCompendiumSubpanel();
            }

            // Render Evidence if active
            const evidenceBtn = document.getElementById("btn-sp-subtab-evidence");
            if (evidenceBtn && evidenceBtn.classList.contains("active")) {
                renderEvidenceSubpanel();
            }

            // Render Systems if active
            const systemsBtn = document.getElementById("btn-sp-subtab-systems");
            if (systemsBtn && systemsBtn.classList.contains("active")) {
                renderSystemsSubpanel();
            }

            // Render Emergency Contact Ladder
            renderEmergencyContactLadder();
        }

        function generateClinicianHandoff() {
            // Compile a structured clinician handoff document
            let md = `# CLINICIAN COLLABORATIVE BRIEFING\n`;
            md += `*CONFIDENTIAL | Generated locally by State, Not Fate OS on ${new Date().toLocaleDateString()}*\n\n`;
            md += `This document provides structured behavioral and safety data to help collaborate with your therapist, psychiatrist, or coach.\n\n`;
            
            md += `## 🎗️ Current Safety Status\n`;
            const recentJournal = state.safetyJournal || [];
            let latestDistress = "N/A";
            if (recentJournal.length > 0) {
                latestDistress = `${recentJournal[recentJournal.length - 1].distressLevel}/10 (Logged: ${new Date(recentJournal[recentJournal.length - 1].timestamp).toLocaleDateString()})`;
            }
            
            md += `- **Last Check-in distress:** ${latestDistress}\n`;
            md += `- **Hope Level:** Level ${state.currentHopeLevel} (${state.hopeProgress}% progression)\n`;
            md += `- **MVD Completion Count:** ${state.history ? state.history.filter(h => h.floorCompleted).length : 0} days\n\n`;
            
            md += `## 🛠️ Collaborative Safety Plan\n`;
            md += `### Reasons to Live:\n${state.reasonsLive || "*None recorded yet. Fill out in the Suicide Prevention tab.*"}\n\n`;
            md += `### Safe Contacts:\n${state.safeContacts || "*None recorded yet.*"}\n\n`;
            md += `### Distraction Activities:\n${state.distractions || "*None recorded yet.*"}\n\n`;
            
            md += `## 📝 Safety & Restraint Journal Timeline (Last 5 Entries)\n`;
            if (recentJournal.length === 0) {
                md += `*No restraint journal logs written yet.*\n`;
            } else {
                md += `| Date | Distress | Restraint Counter-Script |\n`;
                md += `|---|---|---|\n`;
                [...recentJournal].slice(-5).reverse().forEach(rj => {
                    md += `| ${new Date(rj.timestamp).toLocaleDateString()} | ${rj.distressLevel}/10 | ${rj.counterScript} |\n`;
                });
                md += `\n`;
            }
            
            md += `## 📖 Parables completed:\n`;
            const completedParables = [];
            if (state.parablesCompleted) {
                Object.keys(state.parablesCompleted).forEach(pid => {
                    completedParables.push(`${pid.toUpperCase()} (${new Date(state.parablesCompleted[pid].timestamp).toLocaleDateString()}): "${state.parablesCompleted[pid].reflection}"`);
                });
            }
            if (completedParables.length === 0) {
                md += `*No parable reflections completed yet.*\n`;
            } else {
                completedParables.forEach(cp => {
                    md += `- ${cp}\n`;
                });
            }

            // Export Modal display
            const modal = document.getElementById("export-modal");
            const textarea = document.getElementById("textarea-export-briefing");
            if (modal && textarea) {
                textarea.value = md;
                modal.classList.add("active");
                showToast("Clinician handoff file compiled successfully.", "success");
            }
        }

        function setupSafetyPreventionListeners() {
            // Sub-nav tab toggles
            const subtabs = ["crisis", "parables", "journal", "compendium", "evidence", "systems"];
            subtabs.forEach(tab => {
                const btn = document.getElementById(`btn-sp-subtab-${tab}`);
                if (btn) {
                    btn.addEventListener("click", () => {
                        subtabs.forEach(t => {
                            const b = document.getElementById(`btn-sp-subtab-${t}`);
                            const panel = document.getElementById(`sp-panel-${t}`);
                            if (t === tab) {
                                if (b) b.classList.add("active");
                                if (panel) panel.classList.remove("hidden");
                            } else {
                                if (b) b.classList.remove("active");
                                if (panel) panel.classList.add("hidden");
                            }
                        });
                        if (tab === "compendium") {
                            renderCompendiumSubpanel();
                        } else if (tab === "evidence") {
                            renderEvidenceSubpanel();
                        } else if (tab === "systems") {
                            renderSystemsSubpanel();
                        }
                        window.location.hash = `#/suicideprevention/${tab}`;
                    });
                }
            });

            // Save Safety Plan updates
            const savePlanBtn = document.getElementById("btn-sp-save-plan");
            if (savePlanBtn) {
                savePlanBtn.addEventListener("click", () => {
                    state.reasonsLive = document.getElementById("input-sp-reasons").value.trim();
                    state.distractions = document.getElementById("input-sp-distractions").value.trim();
                    state.safeContacts = document.getElementById("input-sp-contacts").value.trim();
                    saveState();
                    showToast("Safety Plan Updates Saved successfully.", "success");
                });
            }

            // Country change for regional resources
            const countrySelect = document.getElementById("select-sp-country");
            if (countrySelect) {
                countrySelect.addEventListener("change", (e) => {
                    populateRegionalResources(e.target.value);
                });
            }

            // Grounding tools navigation
            const grounding54321 = document.getElementById("btn-sp-grounding-54321");
            if (grounding54321) {
                grounding54321.addEventListener("click", () => {
                    document.getElementById("sp-grounding-default-msg").classList.add("hidden");
                    document.getElementById("sp-grounding-54321-tool").classList.remove("hidden");
                    document.getElementById("sp-grounding-breathing-tool").classList.add("hidden");
                    document.getElementById("sp-grounding-cold-tool").classList.add("hidden");
                    currentSensoryStep = 1;
                    updateSensoryStep();
                });
            }

            const sp54321Prev = document.getElementById("btn-sp-54321-prev");
            if (sp54321Prev) {
                sp54321Prev.addEventListener("click", () => {
                    if (currentSensoryStep > 1) {
                        currentSensoryStep--;
                        updateSensoryStep();
                    }
                });
            }

            const sp54321Next = document.getElementById("btn-sp-54321-next");
            if (sp54321Next) {
                sp54321Next.addEventListener("click", () => {
                    if (currentSensoryStep < 5) {
                        currentSensoryStep++;
                        updateSensoryStep();
                    } else {
                        // Reset to default
                        document.getElementById("sp-grounding-54321-tool").classList.add("hidden");
                        document.getElementById("sp-grounding-default-msg").classList.remove("hidden");
                        showToast("Sensory grounding complete. Heart rate down-regulated.", "success");
                    }
                });
            }

            function updateSensoryStep() {
                const step = sensorySteps[currentSensoryStep - 1];
                document.getElementById("sp-54321-step-title").innerText = step.title;
                document.getElementById("sp-54321-step-instruction").innerText = step.text;
                document.getElementById("sp-54321-progress").innerText = `Step ${currentSensoryStep} of 5`;
                document.getElementById("btn-sp-54321-prev").disabled = currentSensoryStep === 1;
                document.getElementById("btn-sp-54321-next").innerText = currentSensoryStep === 5 ? "Finish" : "Next Step";
            }

            // Box breathing somatic grounding toggle
            const groundingBreathing = document.getElementById("btn-sp-grounding-breathing");
            if (groundingBreathing) {
                groundingBreathing.addEventListener("click", () => {
                    document.getElementById("sp-grounding-default-msg").classList.add("hidden");
                    document.getElementById("sp-grounding-54321-tool").classList.add("hidden");
                    document.getElementById("sp-grounding-breathing-tool").classList.remove("hidden");
                    document.getElementById("sp-grounding-cold-tool").classList.add("hidden");
                    
                    // Stop any running interval
                    stopInlineBreathing();
                });
            }

            const breathingToggle = document.getElementById("btn-sp-breathing-toggle");
            if (breathingToggle) {
                breathingToggle.addEventListener("click", () => {
                    const btn = document.getElementById("btn-sp-breathing-toggle");
                    if (inlineBreathingInterval) {
                        stopInlineBreathing();
                        btn.innerText = "Start Pacer";
                    } else {
                        startInlineBreathing();
                        btn.innerText = "Stop Pacer";
                    }
                });
            }

            function startInlineBreathing() {
                const circle = document.getElementById("sp-breathing-circle");
                const text = document.getElementById("sp-breathing-action-text");
                inlineBreathingPhase = 0;
                
                if (text) text.innerText = "Inhale...";
                if (circle) {
                    circle.style.transform = "scale(1.5)";
                    circle.style.background = "linear-gradient(135deg, var(--accent-teal), var(--accent-lavender))";
                }

                inlineBreathingInterval = setInterval(() => {
                    inlineBreathingPhase = (inlineBreathingPhase + 1) % 4;
                    const c = document.getElementById("sp-breathing-circle");
                    const t = document.getElementById("sp-breathing-action-text");
                    if (inlineBreathingPhase === 0) {
                        if (t) t.innerText = "Inhale...";
                        if (c) {
                            c.style.transform = "scale(1.5)";
                            c.style.filter = "drop-shadow(0 0 10px var(--accent-teal))";
                        }
                    } else if (inlineBreathingPhase === 1) {
                        if (t) t.innerText = "Hold...";
                        if (c) c.style.filter = "drop-shadow(0 0 16px var(--accent-teal))";
                    } else if (inlineBreathingPhase === 2) {
                        if (t) t.innerText = "Exhale...";
                        if (c) {
                            c.style.transform = "scale(1.0)";
                            c.style.filter = "drop-shadow(0 0 10px var(--accent-lavender))";
                        }
                    } else if (inlineBreathingPhase === 3) {
                        if (t) t.innerText = "Hold...";
                        if (c) c.style.filter = "drop-shadow(0 0 4px var(--accent-lavender))";
                    }
                }, 4000);
            }

            function stopInlineBreathing() {
                if (inlineBreathingInterval) {
                    clearInterval(inlineBreathingInterval);
                    inlineBreathingInterval = null;
                }
                const circle = document.getElementById("sp-breathing-circle");
                if (circle) {
                    circle.style.transform = "scale(1.0)";
                    circle.style.filter = "none";
                }
                const text = document.getElementById("sp-breathing-action-text");
                if (text) text.innerText = "Breath Pacer Ready";
            }

            // Cold water shock
            const groundingCold = document.getElementById("btn-sp-grounding-cold");
            if (groundingCold) {
                groundingCold.addEventListener("click", () => {
                    document.getElementById("sp-grounding-default-msg").classList.add("hidden");
                    document.getElementById("sp-grounding-54321-tool").classList.add("hidden");
                    document.getElementById("sp-grounding-breathing-tool").classList.add("hidden");
                    document.getElementById("sp-grounding-cold-tool").classList.remove("hidden");
                    stopInlineBreathing();
                });
            }

            // Provider template copy button
            const copyTemplateBtn = document.getElementById("btn-sp-copy-template");
            if (copyTemplateBtn) {
                copyTemplateBtn.addEventListener("click", () => {
                    const text = "I am utilizing a structured behavioral activation and circadian timing system to manage my daily energy and function. It helps me track anchors, record restart speed, and manage task-entry friction. It is designed to complement our recovery objectives by tracking my floor wins and PHQ-9 progress.";
                    navigator.clipboard.writeText(text).then(() => {
                        showToast("Collaboration template copied to clipboard!", "success");
                    }).catch(err => {
                        console.error("Failed to copy template: ", err);
                    });
                });
            }

            const actionMapButtons = document.querySelectorAll(".suicide-map-btn");
            actionMapButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    actionMapButtons.forEach(other => {
                        other.classList.remove("active");
                        other.setAttribute("aria-pressed", "false");
                    });
                    btn.classList.add("active");
                    btn.setAttribute("aria-pressed", "true");
                    renderSuicideActionMap(btn.getAttribute("data-map"));
                });
            });

            const scriptButtons = document.querySelectorAll(".suicide-script-btn");
            scriptButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    scriptButtons.forEach(other => {
                        other.classList.remove("active");
                        other.setAttribute("aria-pressed", "false");
                    });
                    btn.classList.add("active");
                    btn.setAttribute("aria-pressed", "true");
                    renderSupporterScript(btn.getAttribute("data-script"));
                });
            });

            const copyActiveScriptBtn = document.getElementById("btn-sp-copy-active-script");
            if (copyActiveScriptBtn) {
                copyActiveScriptBtn.addEventListener("click", copyActiveSupporterScript);
            }

            const scenarioButtons = document.querySelectorAll(".suicide-scenario-btn");
            scenarioButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    scenarioButtons.forEach(other => {
                        other.classList.remove("active");
                        other.setAttribute("aria-pressed", "false");
                    });
                    btn.classList.add("active");
                    btn.setAttribute("aria-pressed", "true");
                    renderSuicideScenario(btn.getAttribute("data-scenario"));
                });
            });

            const settingButtons = document.querySelectorAll(".suicide-setting-btn");
            settingButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    settingButtons.forEach(other => {
                        other.classList.remove("active");
                        other.setAttribute("aria-pressed", "false");
                    });
                    btn.classList.add("active");
                    btn.setAttribute("aria-pressed", "true");
                    renderSuicideSetting(btn.getAttribute("data-setting"));
                });
            });

            // Full Safety Assessment trigger buttons
            const triggerAssessmentBtn = document.getElementById("btn-sp-trigger-assessment");
            if (triggerAssessmentBtn) {
                triggerAssessmentBtn.addEventListener("click", openSafetyAssessmentModal);
            }
            
            const closeAssessmentBtn = document.getElementById("btn-close-safety-assessment-modal");
            if (closeAssessmentBtn) {
                closeAssessmentBtn.addEventListener("click", closeSafetyAssessmentModal);
            }
            
            const cancelAssessmentBtn = document.getElementById("btn-sa-cancel");
            if (cancelAssessmentBtn) {
                cancelAssessmentBtn.addEventListener("click", closeSafetyAssessmentModal);
            }

            // Safety Assessment navigation steps
            let saCurrentStep = 1;
            
            function openSafetyAssessmentModal() {
                saCurrentStep = 1;
                document.getElementById("sa-step-1").classList.remove("hidden");
                document.getElementById("sa-step-2").classList.add("hidden");
                document.getElementById("btn-sa-prev").classList.add("hidden");
                document.getElementById("btn-sa-next").classList.remove("hidden");
                document.getElementById("btn-sa-submit").classList.add("hidden");
                
                // Set default inputs
                document.getElementById("input-sa-conviction").value = 0;
                document.getElementById("display-sa-conviction").innerText = 0;
                
                // Set radios to first option
                document.querySelectorAll("input[name='sa-access']")[0].checked = true;
                document.querySelectorAll("input[name='sa-timeline']")[0].checked = true;
                
                // Clear checkboxes
                document.querySelectorAll("#sa-deterrents-container input").forEach(c => c.checked = false);
                document.querySelectorAll("#sa-behaviors-container input").forEach(c => c.checked = false);

                document.getElementById("safety-assessment-modal").classList.add("active");
            }

            function closeSafetyAssessmentModal() {
                document.getElementById("safety-assessment-modal").classList.remove("active");
            }

            const saConvictionSlider = document.getElementById("input-sa-conviction");
            if (saConvictionSlider) {
                saConvictionSlider.addEventListener("input", (e) => {
                    document.getElementById("display-sa-conviction").innerText = e.target.value;
                });
            }

            const saNextBtn = document.getElementById("btn-sa-next");
            if (saNextBtn) {
                saNextBtn.addEventListener("click", () => {
                    saCurrentStep = 2;
                    document.getElementById("sa-step-1").classList.add("hidden");
                    document.getElementById("sa-step-2").classList.remove("hidden");
                    document.getElementById("btn-sa-prev").classList.remove("hidden");
                    document.getElementById("btn-sa-next").classList.add("hidden");
                    document.getElementById("btn-sa-submit").classList.remove("hidden");
                });
            }

            const saPrevBtn = document.getElementById("btn-sa-prev");
            if (saPrevBtn) {
                saPrevBtn.addEventListener("click", () => {
                    saCurrentStep = 1;
                    document.getElementById("sa-step-1").classList.remove("hidden");
                    document.getElementById("sa-step-2").classList.add("hidden");
                    document.getElementById("btn-sa-prev").classList.add("hidden");
                    document.getElementById("btn-sa-next").classList.remove("hidden");
                    document.getElementById("btn-sa-submit").classList.add("hidden");
                });
            }

            // Submit safety assessment
            const saSubmitBtn = document.getElementById("btn-sa-submit");
            if (saSubmitBtn) {
                saSubmitBtn.addEventListener("click", () => {
                    const convictionVal = parseInt(document.getElementById("input-sa-conviction").value, 10);
                    const accessVal = parseInt(document.querySelector("input[name='sa-access']:checked").value, 10);
                    const timelineVal = parseInt(document.querySelector("input[name='sa-timeline']:checked").value, 10);
                    
                    const selectedDeterrents = [];
                    document.querySelectorAll("#sa-deterrents-container input:checked").forEach(c => {
                        selectedDeterrents.push(c.value);
                    });

                    const selectedBehaviors = [];
                    document.querySelectorAll("#sa-behaviors-container input:checked").forEach(c => {
                        selectedBehaviors.push(c.value);
                    });

                    const assessment = {
                        id: Date.now(),
                        timestamp: new Date().toISOString(),
                        ideation: { value: Math.ceil(convictionVal / 2.5) }, // normalize conviction 0-10 to 0-4
                        intentAssessment: {
                            intent: { value: convictionVal > 5 ? 3 : (convictionVal > 1 ? 1 : 0) },
                            access: { value: accessVal },
                            timeline: { value: timelineVal },
                            protective: { selected: selectedDeterrents }
                        }
                    };

                    state.safetyAssessments = state.safetyAssessments || [];
                    state.safetyAssessments.push(assessment);

                    // Run safety detection logic
                    let riskLevel = { level: 'low', score: 0 };
                    if (safetyDetection) {
                        riskLevel = safetyDetection.calculateRiskLevel({
                            quickScreen: assessment,
                            intentAssessment: assessment.intentAssessment,
                            patterns: safetyDetection.detectRiskPatterns ? safetyDetection.detectRiskPatterns(state) : []
                        });
                    } else {
                        let score = convictionVal;
                        if (accessVal >= 2) score += 3;
                        if (timelineVal >= 2) score += 3;
                        let level = 'low';
                        if (score >= 12) level = 'acute';
                        else if (score >= 8) level = 'elevated';
                        else if (score >= 4) level = 'moderate';
                        riskLevel = { level, score };
                    }

                    // Update safety state
                    state.safety = state.safety || {};
                    if (riskLevel.level === "acute" || riskLevel.level === "elevated") {
                        state.safety.suicide = 2; // High alert
                        triggerCrisisOverlay();
                    } else if (riskLevel.level === "moderate") {
                        state.safety.suicide = 1;
                    } else {
                        state.safety.suicide = 0;
                    }

                    saveState();
                    closeSafetyAssessmentModal();
                    renderSuicidePreventionTab();
                    updateDashboardMetrics();
                    
                    showToast("Safety Assessment completed successfully. Risk status updated: " + riskLevel.level.toUpperCase(), "success");
                });
            }

            // Clinician Handoff Export
            const exportHandoffBtn = document.getElementById("btn-sp-export-handoff");
            if (exportHandoffBtn) {
                exportHandoffBtn.addEventListener("click", generateClinicianHandoff);
            }

            // Log reflections for parables
            const parablesList = ["chioran", "restraint", "gap10", "council", "means"];
            parablesList.forEach(pid => {
                const btn = document.getElementById(`btn-sp-reflect-${pid}`);
                if (btn) {
                    btn.addEventListener("click", () => {
                        const text = document.getElementById(`reflect-${pid}`).value.trim();
                        if (!text) {
                            showToast("Please enter a brief reflection before logging.", "warning");
                            return;
                        }
                        state.parablesCompleted = state.parablesCompleted || {};
                        state.parablesCompleted[pid] = {
                            timestamp: new Date().toISOString(),
                            reflection: text
                        };
                        
                        // Increment hope scale slightly / log micro-win
                        state.hopeProgress = Math.min((state.hopeProgress || 0) + 15, 100);
                        if (state.hopeProgress >= 100) {
                            state.hopeProgress = 0;
                            state.currentHopeLevel = Math.min((state.currentHopeLevel || 1) + 1, 10);
                        }

                        logActionCompletion(`Edge Parable Reflection logged: ${pid.toUpperCase()}`);
                        saveState();
                        renderSuicidePreventionTab();
                        updateDashboardMetrics();
                        showToast("Reflection logged. Perspective shift registered.", "success");
                    });
                }
            });

            // Restraint Journal entries
            const distressSlider = document.getElementById("input-sp-journal-distress");
            const distressDisplay = document.getElementById("display-sp-journal-distress");
            
            if (distressSlider && distressDisplay) {
                distressSlider.addEventListener("input", (e) => {
                    distressDisplay.innerText = `${e.target.value} / 10`;
                });
            }

            const saveJournalBtn = document.getElementById("btn-sp-save-journal");
            if (saveJournalBtn) {
                saveJournalBtn.addEventListener("click", () => {
                    const rawThoughtsInput = document.getElementById("input-sp-journal-thoughts");
                    const counterScriptInput = document.getElementById("input-sp-journal-counter");
                    const parableSelect = document.getElementById("select-sp-journal-parable");

                    const rawThoughts = rawThoughtsInput.value.trim();
                    const counterScript = counterScriptInput.value.trim();
                    const distressLevel = distressSlider ? parseInt(distressSlider.value, 10) : 5;
                    const parableRef = parableSelect ? parableSelect.value : "";

                    if (!rawThoughts || !counterScript) {
                        showToast("Please enter raw thoughts/urges and your balanced counter-script.", "warning");
                        return;
                    }

                    // Push new entry
                    state.safetyJournal = state.safetyJournal || [];
                    state.safetyJournal.push({
                        id: Date.now(),
                        timestamp: new Date().toISOString(),
                        rawThoughts: rawThoughts,
                        counterScript: counterScript,
                        distressLevel: distressLevel,
                        parableRef: parableRef
                    });

                    // Clear input form
                    rawThoughtsInput.value = "";
                    counterScriptInput.value = "";
                    if (distressSlider) distressSlider.value = 5;
                    if (distressDisplay) distressDisplay.innerText = "5 / 10";
                    if (parableSelect) parableSelect.value = "";

                    // If distress >= 8, trigger somatic grounding or alert
                    if (distressLevel >= 8) {
                        showToast("🚨 High distress detected. Initializing Box Breathing somatic helper.", "danger");
                        // Switch subtabs to somatic grounding
                        const subtabCrisisBtn = document.getElementById("btn-sp-subtab-crisis");
                        if (subtabCrisisBtn) subtabCrisisBtn.click();
                        const groundingBreathingBtn = document.getElementById("btn-sp-grounding-breathing");
                        if (groundingBreathingBtn) groundingBreathingBtn.click();
                        const breathingToggleBtn = document.getElementById("btn-sp-breathing-toggle");
                        if (breathingToggleBtn) breathingToggleBtn.click();
                    } else {
                        showToast("Restraint journal entry successfully logged and encrypted.", "success");
                    }

                    saveState();
                    renderSuicidePreventionTab();
                });
            }

            // Search search timeline listener
            const journalSearch = document.getElementById("input-sp-journal-search");
            if (journalSearch) {
                journalSearch.addEventListener("input", renderSafetyJournalList);
            }

            // Compendium select section listener
            const selectCompSection = document.getElementById("select-compendium-section");
            if (selectCompSection) {
                selectCompSection.addEventListener("change", (e) => {
                    switchCompendiumTable(e.target.value);
                });
            }

            // Compendium module reflection input listener
            const modReflectionInput = document.getElementById("module-reflection-input");
            if (modReflectionInput) {
                modReflectionInput.addEventListener("input", updateModuleCharCount);
            }

            // Compendium submit module button listener
            const submitModBtn = document.getElementById("btn-submit-module");
            if (submitModBtn) {
                submitModBtn.addEventListener("click", submitCurrentModule);
            }

            // Compendium module nav button listeners
            for (let i = 1; i <= 10; i++) {
                const modBtn = document.getElementById(`btn-module-${i}`);
                if (modBtn) {
                    modBtn.addEventListener("click", () => {
                        selectCourseModule(i);
                    });
                }
            }

            // Save Support Map listener
            const saveSupportMapBtn = document.getElementById("btn-sp-save-support-map");
            if (saveSupportMapBtn) {
                saveSupportMapBtn.addEventListener("click", () => {
                    const anchorVal = document.getElementById("input-sp-anchor-person").value.trim();
                    const bufferVal = document.getElementById("input-sp-buffer-contact").value.trim();
                    const envVal = document.getElementById("input-sp-safe-environment").value.trim();
                    
                    state.supportMap = {
                        anchorPerson: anchorVal,
                        bufferContact: bufferVal,
                        safeEnvironment: envVal
                    };
                    
                    saveState();
                    renderEmergencyContactLadder();
                    showToast("Active Support Map saved successfully.", "success");
                });
            }

            // Supporter Script Category tabs
            const scriptCats = ["help", "helper", "visit"];
            scriptCats.forEach(cat => {
                const btn = document.getElementById(`btn-script-cat-${cat}`);
                if (btn) {
                    btn.addEventListener("click", () => {
                        scriptCats.forEach(c => {
                            const b = document.getElementById(`btn-script-cat-${c}`);
                            if (b) {
                                if (c === cat) b.classList.add("active");
                                else b.classList.remove("active");
                            }
                        });
                        switchScriptCategory(cat);
                    });
                }
            });

            // Evidence source filter tabs
            const sourceFilters = ["all", "anchor", "chapter", "research", "watchlist"];
            sourceFilters.forEach(filt => {
                const btn = document.getElementById(`btn-source-filter-${filt}`);
                if (btn) {
                    btn.addEventListener("click", () => {
                        sourceFilters.forEach(f => {
                            const b = document.getElementById(`btn-source-filter-${f}`);
                            if (b) {
                                if (f === filt) b.classList.add("active");
                                else b.classList.remove("active");
                            }
                        });
                        renderEvidenceSources(filt);
                    });
                }
            });

            // Initial load of script display
            switchScriptCategory("help");

            // ==========================================
            // EMERGENCY APPENDIX EVENT BINDINGS
            // ==========================================
            const emerTabs = ["frame", "load", "ladder", "supporter"];
            emerTabs.forEach(t => {
                const btn = document.getElementById(`btn-emer-tab-${t}`);
                if (btn) {
                    btn.addEventListener("click", () => {
                        switchEmergencyTab(t);
                    });
                }
            });

            const intensityInput = document.getElementById("input-emer-intensity");
            const intensityLabel = document.getElementById("label-emer-intensity");
            if (intensityInput && intensityLabel) {
                intensityInput.addEventListener("input", (e) => {
                    intensityLabel.innerText = `${e.target.value}/10`;
                });
            }
            
            const severityInput = document.getElementById("input-emer-severity");
            const severityLabel = document.getElementById("label-emer-severity");
            if (severityInput && severityLabel) {
                severityInput.addEventListener("input", (e) => {
                    severityLabel.innerText = `${e.target.value}/10`;
                });
            }

            const calcBtn = document.getElementById("btn-emer-calculate");
            if (calcBtn) {
                calcBtn.addEventListener("click", calculateDistortion);
            }

            const reliefChecks = document.querySelectorAll(".emer-relief-check");
            reliefChecks.forEach(check => {
                check.addEventListener("change", updateEmergencyReliefProgress);
            });

            renderEmergencyContactLadder();

            // ==========================================
            // SYSTEMS & HOPE REPAIR EVENT BINDINGS
            // ==========================================
            const sopStates = ["low", "medium", "strong"];
            sopStates.forEach(s => {
                const btn = document.getElementById(`btn-state-sop-${s}`);
                if (btn) {
                    btn.addEventListener("click", () => {
                        switchStateSop(s);
                    });
                }
            });

            const hopeChecks = document.querySelectorAll(".hope-sim-check");
            hopeChecks.forEach(check => {
                check.addEventListener("change", updateHopeSimProgress);
            });

            const triageChecks = document.querySelectorAll(".triage-exclusion-check");
            triageChecks.forEach(check => {
                check.addEventListener("change", updateTriageExclusionWarning);
            });

            renderSystemsSubpanel();

            renderSuicideActionMap("distress");
            renderSupporterScript("self");
            renderSuicideScenario("self_low");
            renderSuicideSetting("home");
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
            
            let markdown = `## SYSTEM STATUS REPORT & PROGRESS BRIEF\n`;
            markdown += `*Generated offline, privately, on State, Not Fate OS.*\n\n`;
            markdown += `### 📈 Executive Recovery Summary\n`;
            markdown += `- **Current Hope Level:** Level ${state.currentHopeLevel} (${state.hopeProgress}%)\n`;
            markdown += `- **Active Roadmap Stage:** Layer ${state.currentLayer} (${ROADMAP_LAYERS[state.currentLayer].title})\n`;
            markdown += `- **Cumulative Floor Wins:** ${totalFloorWins} successful MVD Days\n`;
            markdown += `- **Calculated Resilience Rate:** ${statsResilience}% (miss-to-restart recovery factor)\n`;
            markdown += `- **Dominant Intake Pattern:** ${state.dominantPattern}\n\n`;
            
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
            renderRuminationHistoryList();
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
                showToast('Please complete both the Micro-Moment Win and Tomorrow\'s Possibility fields.', 'warning');
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
                showToast('Please complete all three steps of the Thought Challenge worksheet.', 'warning');
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

        let ruminationInterval = null;
        let ruminationActiveSession = null;

        function startRuminationStopLoss() {
            const loopInput = document.getElementById("input-rumination-loop");
            const issueInput = document.getElementById("input-rumination-issue");
            const redirectInput = document.getElementById("input-rumination-redirect");
            const loop = loopInput.value.trim();
            const issue = issueInput.value.trim();
            const duration = parseInt(document.getElementById("select-rumination-duration").value, 10);
            const redirect = redirectInput.value.trim();

            if (!loop || !issue || !redirect) {
                showToast("Please enter the loop, describe the issue, and define your redirect thought.", "warning");
                return;
            }

            ruminationActiveSession = {
                loop: loop,
                issue: issue,
                duration: duration,
                redirect: redirect,
                startTime: new Date().toISOString()
            };

            const container = document.getElementById("rumination-timer-container");
            const countdown = document.getElementById("rumination-timer-countdown");
            const startBtn = document.getElementById("btn-start-rumination");
            const completeBtn = document.getElementById("btn-complete-rumination");

            container.classList.remove("hidden");
            startBtn.classList.add("hidden");
            completeBtn.classList.remove("hidden");

            let secondsLeft = duration * 60;
            
            function updateDisplay() {
                const mins = Math.floor(secondsLeft / 60);
                const secs = secondsLeft % 60;
                countdown.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }

            updateDisplay();

            if (ruminationInterval) clearInterval(ruminationInterval);
            
            ruminationInterval = setInterval(() => {
                secondsLeft--;
                if (secondsLeft <= 0) {
                    clearInterval(ruminationInterval);
                    countdown.textContent = "0:00 - REDIRECT NOW";
                    showToast("Time elapsed. Redirect your focus now.", "info", 5000);
                } else {
                    updateDisplay();
                }
            }, 1000);
        }

        function completeRuminationStopLoss() {
            if (ruminationInterval) {
                clearInterval(ruminationInterval);
                ruminationInterval = null;
            }

            if (!ruminationActiveSession) return;

            const today = getTodayString();
            state.ruminationLogs.push({
                date: today,
                loop: ruminationActiveSession.loop,
                issue: ruminationActiveSession.issue,
                duration: ruminationActiveSession.duration,
                redirect: ruminationActiveSession.redirect,
                startTime: ruminationActiveSession.startTime,
                completedTime: new Date().toISOString()
            });

            logActionCompletion(`Rumination Stop-Loss completed: ${ruminationActiveSession.loop}`);

            ensurePolarisState();
            state.polaris.proof.today += 1;
            state.polaris.proof.total += 1;
            state.polaris.proof.ledger.push({
                id: 'proof_' + Date.now(),
                source: 'rumination_stop_loss',
                points: 1,
                label: `Rumination Stop-Loss: ${ruminationActiveSession.loop}`,
                createdAt: new Date().toISOString()
            });

            saveState();
            renderRuminationHistoryList();
            updateDashboardMetrics();
            renderPolarisTab();

            showToast("You do not need to win the argument in your head. You need to stop it from taking the whole day.", "success", 7000);

            document.getElementById("input-rumination-loop").value = "";
            document.getElementById("input-rumination-issue").value = "";
            document.getElementById("input-rumination-redirect").value = "";
            document.getElementById("rumination-timer-container").classList.add("hidden");
            document.getElementById("btn-start-rumination").classList.remove("hidden");
            document.getElementById("btn-complete-rumination").classList.add("hidden");

            ruminationActiveSession = null;
        }

        function removeRuminationEntry(index) {
            if (confirm("Are you sure you want to delete this stop-loss log?")) {
                state.ruminationLogs.splice(index, 1);
                saveState();
                renderRuminationHistoryList();
            }
        }

        function renderRuminationHistoryList() {
            const container = document.getElementById("rumination-history-container");
            if (!container) return;
            container.innerHTML = "";

            if (!state.ruminationLogs || state.ruminationLogs.length === 0) {
                container.innerHTML = `<div class="text-muted center-text py-2" style="font-size:0.85rem;">No stop-loss protocols completed yet. Try setting a timer above.</div>`;
                return;
            }

            [...state.ruminationLogs].reverse().forEach((item, index) => {
                const realIdx = state.ruminationLogs.length - 1 - index;
                const entryCard = document.createElement("div");
                entryCard.className = "linked-file-item";
                entryCard.style.flexDirection = "column";
                entryCard.style.alignItems = "stretch";
                entryCard.style.gap = "0.35rem";
                entryCard.style.padding = "0.75rem";
                entryCard.style.borderLeft = "2px solid var(--accent-orange)";

                entryCard.innerHTML = `
                    <div class="flex-between">
                        <span class="text-orange" style="font-size: 0.75rem; font-weight: 600; font-family: monospace; color: var(--accent-orange);">${item.date} (${item.duration}m)</span>
                        <button class="linked-file-remove" onclick="removeRuminationEntry(${realIdx})" style="background:none; border:none; color:var(--accent-red); cursor:pointer; font-size:1.1rem; line-height:1;">×</button>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-primary); font-weight: 500; line-height: 1.4;">
                        <strong>Loop:</strong> "${item.loop}"
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
                        <strong>Issue:</strong> ${item.issue}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 0.25rem;">
                        Redirect to: ${item.redirect}
                    </div>
                `;
                container.appendChild(entryCard);
            });
        }

        window.startRuminationStopLoss = startRuminationStopLoss;
        window.completeRuminationStopLoss = completeRuminationStopLoss;
        window.removeRuminationEntry = removeRuminationEntry;

        // ==========================================================
        // DOCUMENT CENTER & FILE SYSTEM NAVIGATOR ENGINE
        // ==========================================================

        const KNOWLEDGE_CATALOG = [
            { name: "01_Front_End_Preamble-2.md", type: "md", size: "4.1 KB", desc: "Preamble briefing explaining the mechanical model of depression." },
            { name: "02_Depression_Project_Program-1.md", type: "md", size: "12.3 KB", desc: "Outlines the recovery roadmap and behavior guidelines." },
            { name: "02_Front_End_Questionnaire-1.md", type: "md", size: "7.9 KB", desc: "Guide to the intake forms and diagnostic metrics." },
            { name: "03_Depression_Project_Outline-1.md", type: "md", size: "11.1 KB", desc: "Operational outline documenting the startup damage and initiation models." },
            { name: "03_Front_End_Intake_Guide-1.md", type: "md", size: "9.5 KB", desc: "Companion manual for the onboarding and interpreting answers." },
            { name: "04_Hope_and_Activation_Start-2.md", type: "md", size: "5.5 KB", desc: "Hope activation protocols and starter steps." },
            { name: "04_Hope_System_Front_End-1.md", type: "md", size: "5.1 KB", desc: "Detailed blueprint explaining the proof-based hope sequence." },
            { name: "five_year_depression_years_and_worksheets_2026_v1.md", type: "md", size: "14.2 KB", desc: "Historical worksheet mapping five years of depression state vs. external stressors." },
            { name: "legitimate_preamble_and_150_item_intake.md", type: "md", size: "22.3 KB", desc: "The definitive 150-item intake questionnaire assessing core function." },
            // Media tracks
            { name: "Treating_depression_as_a_systems_failure.m4a", type: "audio", size: "34.7 MB", desc: "Guide on treating depression as an operational systems failure rather than identity." },
            { name: "The_Reprogramming_Protocol__Debugging_Depression.mp4", type: "video", size: "58.9 MB", desc: "Video overview on reprograming automatic self-talk and building consistency." },
            { name: "State,_Not_A_Fate.mp4", type: "video", size: "70.4 MB", desc: "Core documentary detailing the foundational theories and evidence base." },
            { name: "Stop_treating_depression_like_broken_bones.m4a", type: "audio", size: "34.0 MB", desc: "Audio briefing on why standard recovery models fail and the need for low floors." },
            { name: "The_Broken_Firmware__A_Mechanical_Guide_to_Depression.mp4", type: "video", size: "46.2 MB", desc: "Visual guide to the broken biological clock and task-initiation failure systems." },
            { name: "The_Depression_Project.mp4", type: "video", size: "58.7 MB", desc: "Outlines the primary patterns and dynamic checklist energy downscaling triggers." },
            { name: "Depression_is_a_mechanical_system_failure.m4a", type: "audio", size: "40.8 MB", desc: "Audio podcast covering the mechanical models, light signals, and baseline wins." },
            { name: "Developing_a_Trial_Community_Outreach_Action_Plan.mp4", type: "video", size: "33.9 MB", desc: "Visual blueprint for setting up community review groups and guideline alignments." },
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
            if (confirm("Are you sure you want to delete this assessment log?")) {
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
                if (file.type === "md") badgeClass = "badge-high";
                else if (file.type === "video" || file.type === "audio") badgeClass = "badge-medium";
                
                let linkPath = file.type === "md" ? "docs/" + file.name : "knowledge/" + file.name;
                
                card.innerHTML = `
                    <div class="flex-between">
                        <div style="display:flex; gap:0.4rem; align-items:center; overflow:hidden;">
                            <span class="badge ${badgeClass}" style="font-size:0.6rem; padding:0.15rem 0.35rem; font-family:monospace; text-transform:uppercase;">${file.type}</span>
                            <span style="font-size:0.85rem; font-weight:500; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${file.name}</span>
                        </div>
                        <div style="display:flex; gap:0.5rem; align-items:center;">
                            <span class="text-muted" style="font-size:0.75rem; font-family:monospace;">${file.size}</span>
                            <a href="${linkPath}" target="_blank" class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.7rem; text-decoration: none;">View</a>
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
        // PROFESSIONAL'S ADAPTIVE PLAN CUSTOMIZER ENGINE
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
                showToast('Please enter a custom checklist task label.', 'warning');
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
                showToast('Your Minimum Viable Day (MVD) Floor must have all 3 tasks defined to protect your self-trust.', 'warning');
                return;
            }
            
            state.mvd = [mvd1, mvd2, mvd3];
            saveState();
            
            showToast('Treatment Plan customization saved successfully! Your daily checklist is updated.', 'success');
            renderDashboard();
        }

        function resetChecklistToDefaults() {
            if (confirm("Are you sure you want to reset your checklist and MVD Floor to the system default settings?")) {
                state.mvd = [ ...DEFAULT_STATE.mvd ];
                state.customTasks = [];
                saveState();
                renderCustomizer();
                renderDashboard();
            }
        }

        function loadProgramTemplate(type) {
            if (confirm(`Are you sure you want to load Program Template: ${type.toUpperCase()}? This will override your current MVD floor and custom tasks.`)) {
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
                        "Send exactly 1 low-threat connection text to Dave or Dave ('thinking of you, no pressure to reply')",
                        "Spend 10 minutes resting in a public space/park without performative pressure",
                        "Practice breathing guides for 3 minutes to downregulate the nervous system"
                    ];
                }
                
                saveState();
                renderCustomizer();
                renderDashboard();
                showToast(`Program Template loaded successfully! Your MVD Floor and Active checklists are updated.`, 'success');
            }
        }
        window.loadProgramTemplate = loadProgramTemplate;
        // ==========================================================
        // SMART WELCOME HANDLER FUNCTIONS
        // ==========================================================

        // === SMART RE-ENTRY CARD ===
        function updateReEntryState() {
            if (!state.isOnboarded) return;

            const today = getTodayString();
            
            // Ensure reEntry structure exists
            if (!state.reEntry) {
                state.reEntry = {
                    lastSeenDate: null,
                    missedDays: 0,
                    lastMessageType: null
                };
            }
            
            // If it is a new day (or first check)
            if (state.reEntry.lastSeenDate !== today) {
                let type = 'normal';
                let diffDays = 0;
                
                if (!state.lastVisitDate || state.history.length === 0) {
                    type = 'first-use';
                } else {
                    const d1 = new Date(today);
                    const d2 = new Date(state.lastVisitDate);
                    
                    // Safely calculate difference in days using UTC to avoid DST issues
                    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
                    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
                    diffDays = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) {
                        // Check if yesterday was completed
                        const yesterdayDate = new Date();
                        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                        const yyyy = yesterdayDate.getFullYear();
                        const mm = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
                        const dd = String(yesterdayDate.getDate()).padStart(2, '0');
                        const yesterdayStr = `${yyyy}-${mm}-${dd}`;
                        
                        const yesterdayLog = state.history.find(log => log.date === yesterdayStr);
                        const completedYesterday = yesterdayLog && (yesterdayLog.floorCompleted || (yesterdayLog.completed && yesterdayLog.completed.length > 0));
                        
                        if (completedYesterday) {
                            type = 'normal';
                        } else {
                            type = 'missed-yesterday';
                        }
                    } else if (diffDays >= 2) {
                        type = 'away-multiple';
                    } else {
                        // Already checked in today or timezone shift
                        type = 'normal';
                    }
                }
                
                state.reEntry.lastSeenDate = today;
                state.reEntry.missedDays = diffDays > 0 ? diffDays : 0;
                state.reEntry.lastMessageType = type;
                state.lastVisitDate = today;
                saveState();
            }
        }

        function renderReEntryCard() {
            if (!state.isOnboarded) return;

            const container = document.getElementById("reentry-card-container");
            if (!container) return;
            
            // Re-run checking logic to ensure reEntry state is up-to-date
            updateReEntryState();

            // Check if energy is low or collapse (dynamic override)
            const isLowEnergy = state.todayEnergy === 'low' || state.todayEnergy === 'collapse';
            
            let message = "";
            let cardType = state.reEntry ? state.reEntry.lastMessageType : 'normal';

            if (isLowEnergy) {
                message = "Low energy changes the plan. It does not cancel the day. Use Floor Wins Mode.";
            } else if (cardType === 'first-use') {
                message = "Start small. The goal is not a perfect day. The goal is one piece of proof.";
            } else if (cardType === 'missed-yesterday') {
                message = "You missed a day. That is data, not a verdict. Restart with one small anchor.";
            } else if (cardType === 'away-multiple') {
                message = "You were away for a bit. No penalty. The system resumes at the smallest useful step.";
            } else {
                message = "Welcome back. Start with today’s anchors.";
            }

            container.innerHTML = `
                <div class="reentry-card">
                    <div class="reentry-header">
                        <span class="icon">🜁</span> Smart Re-Entry Signal
                    </div>
                    <div class="reentry-content">
                        ${message}
                    </div>
                    <div class="reentry-actions">
                        <button class="reentry-btn reentry-btn-primary" onclick="startSmallestAnchor()">
                            🎯 Start smallest anchor
                        </button>
                        <button class="reentry-btn reentry-btn-secondary" onclick="focusChecklist()">
                            📋 Open today's checklist
                        </button>
                    </div>
                </div>
            `;
        }

        function startSmallestAnchor() {
            // Determine the first anchor label
            const label = (state.mvd && state.mvd[0]) || "Wake on workdays by 7:30am, drink water, take morning medication.";
            
            // If already completed, show a toast. Otherwise, complete it.
            const today = getTodayString();
            const todayLog = state.history.find(log => log.date === today);
            const isCompleted = todayLog && todayLog.completed.includes(label);

            if (!isCompleted) {
                logActionCompletion(label);

                // If yesterday was missed, completing the smallest anchor is a Restart Quest!
                if (state.reEntry && state.reEntry.lastMessageType === 'missed-yesterday') {
                    ensurePolarisState();
                    state.polaris.proof.today += 1;
                    state.polaris.proof.total += 1;
                    state.polaris.proof.ledger.push({
                        id: 'proof_' + Date.now(),
                        source: 'restart',
                        points: 1,
                        label: 'Restart after missed day completed',
                        createdAt: new Date().toISOString()
                    });
                }

                saveState();
                renderDashboard();
                showToast(`Anchor logged: ${label}`, 'success');
            } else {
                showToast(`Anchor already completed: ${label}`, 'info');
            }

            // Scroll to the checklist
            focusChecklist();
        }

        function focusChecklist() {
            showTab("dashboard");
            window.location.hash = "#/dashboard";
            const el = document.getElementById("daily-checklist-items");
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                // Subtle highlight animation
                el.style.transition = "outline 0.3s ease";
                el.style.outline = "2px solid var(--accent-teal)";
                setTimeout(() => {
                    el.style.outline = "none";
                }, 1000);
            }
        }

        window.startSmallestAnchor = startSmallestAnchor;
        window.focusChecklist = focusChecklist;

        function toggleStartupDragLadder() {
            const content = document.getElementById("startup-drag-ladder-content");
            const icon = document.getElementById("startup-drag-toggle-icon");
            if (!content || !icon) return;
            if (content.classList.contains("hidden")) {
                content.classList.remove("hidden");
                icon.textContent = "[ Hide ]";
            } else {
                content.classList.add("hidden");
                icon.textContent = "[ Show ]";
            }
        }

        function checkDragStep(stepNum) {
            if (stepNum === 7) {
                ensurePolarisState();
                state.polaris.proof.today += 1;
                state.polaris.proof.total += 1;
                state.polaris.proof.ledger.push({
                    id: 'proof_' + Date.now(),
                    source: 'startup_drag',
                    points: 1,
                    label: 'Startup Drag Action Ladder completed',
                    createdAt: new Date().toISOString()
                });
                saveState();
                updateDashboardMetrics();
                renderPolarisTab();
                showToast("That counts. Not because it fixed everything. Because it happened.", "success", 6000);
            } else {
                showToast("Starting is the failure point. Make the first action smaller.", "info", 3000);
            }
        }

        window.toggleStartupDragLadder = toggleStartupDragLadder;
        window.checkDragStep = checkDragStep;


        function showSmartWelcomeScreen() {
            // Check if we should show the Smart Welcome instead of just the generic welcome
            const today = getTodayString();
            if (state.polaris && state.polaris.day && state.polaris.day.lastCheckInDate !== today) {
                // If it's a new day, route to the Welcome / Re-entry screen
                showScreen("welcome");
            } else {
                showScreen("welcome"); // fallback to existing welcome
            }
        }

        function executeTinyAnchor(category) {
            // Map the category to a specific Tiny Anchor based on Master Prompt Rules
            const map = {
                initiation: { id: 'tiny_stand', text: 'Put both feet on the floor and stand once', isGeneric: true },
                rhythm: { id: 'tiny_light', text: 'Open blinds or stand by a window for 30 seconds', isGeneric: true },
                space: { id: 'tiny_trash', text: 'Put one visible piece of trash in a bin', isGeneric: true },
                body: { id: 'tiny_water', text: 'Drink water or take prescribed meds if due', isGeneric: true },
                mind: { id: 'tiny_mind', text: 'Say "This is a state, not a fate," then touch one physical object and name it', isGeneric: true }
            };
            
            const anchor = map[category];
            if (!anchor) return;
            
            ensurePolarisState();
            state.lastVisitDate = getTodayString();
            
            // Set energy to low/collapse equivalent implicitly
            state.todayEnergy = 'low';
            
            // Add it to today's active anchors list dynamically
            if (!state.polaris.anchors.today) state.polaris.anchors.today = {};
            state.polaris.anchors.today[anchor.id] = false; // Mark incomplete
            
            // We temporarily add it to userAnchors so it renders, or we handle it via getAnchorsForToday
            // Let's just push it to the top of the user anchors for today
            if (!state.userAnchors.some(a => a.id === anchor.id)) {
                state.userAnchors.unshift(anchor);
            }
            
            saveState();
            
            // We want to immediately show the Polaris tab with this anchor listed
            showScreen("dashboard");
            window.location.hash = "#/polaris";
            
            showToast("Tiny anchor activated. You only need to do this one thing.", "info", 6000);
        }

        function startSmallAction() {
            // Opens state selector for immediate small action path
            showScreen('stateSelector');
        }

        function exploreFullProgram() {
            // Go to normal intake if not onboarded, or dashboard if already onboarded
            if (state.isOnboarded) {
                state.lastVisitDate = getTodayString();
                saveState();
                showScreen('dashboard');
                window.location.hash = "#/dashboard";
            } else {
                showScreen('intake');
                initIntakeForm();
            }
        }

        function openProfileDepthSelector() {
            // Open lightweight profile/depth selector screen
            showScreen('profileDepth');
        }

        function applyProfileDepth(depth) {
            if (depth === 'quick') {
                // Go to intake but auto-open only mantra + MVD sections
                showScreen('intake');
                initIntakeForm();
                // Collapse all sections except mantra and mvd
                document.querySelectorAll('.accordion-section').forEach(sec => {
                    const section = sec.getAttribute('data-section');
                    if (section === 'mantra' || section === 'mvd') {
                        sec.classList.add('active');
                    } else {
                        sec.classList.remove('active');
                    }
                });
            } else if (depth === 'standard') {
                showScreen('intake');
                initIntakeForm();
            } else if (depth === 'minimal') {
                // Skip intake entirely, mark as onboarded with defaults
                state.isOnboarded = true;
                state.todayEnergy = 'medium';
                state.currentLayer = 1;
                state.lastVisitDate = getTodayString();
                saveState();
                showScreen('dashboard');
                window.location.hash = "#/dashboard";
            }
        }

        function goToEmergencyFloor() {
            // If onboarded, go to safebox tab. If not, do minimal onboard then safebox.
            state.lastVisitDate = getTodayString();
            if (state.isOnboarded) {
                saveState();
                showScreen('dashboard');
                window.location.hash = "#/safebox";
            } else {
                // Minimal onboard to enable dashboard access
                state.isOnboarded = true;
                state.todayEnergy = 'collapse';
                state.currentLayer = 0;
                saveState();
                showScreen('dashboard');
                window.location.hash = "#/safebox";
            }
            // Also trigger crisis overlay if high risk
            if (isHighRiskActive()) {
                triggerCrisisOverlay();
            }
        }

        function selectState(selectedState) {
            // Map state selection to a meaningful first action and show dashboard
            const stateActionMap = {
                initiation: {
                    message: 'Task initiation is the bottleneck. Your only job: define the first 10 seconds of one task.',
                    energy: 'low'
                },
                rhythm: {
                    message: 'Your rhythm is broken. Anchor to one fixed wake time and one fixed light exposure.',
                    energy: 'low'
                },
                environment: {
                    message: 'Your space is dragging you down. Clear one visible surface zone. That is the whole mission.',
                    energy: 'medium'
                },
                body: {
                    message: 'Your body needs the floor. Water, light, and standing for 60 seconds. Nothing more required.',
                    energy: 'collapse'
                },
                mind: {
                    message: 'Your mind is spiraling. Repeat your counter-script aloud. Open the breathing guide.',
                    energy: 'low'
                },
                emergency: {
                    message: 'Emergency mode activated. Opening Safe Box.',
                    energy: 'collapse'
                }
            };

            const action = stateActionMap[selectedState] || stateActionMap.initiation;

            // If emergency, go straight to safe box
            if (selectedState === 'emergency') {
                goToEmergencyFloor();
                return;
            }

            // Ensure onboarded (minimal) so dashboard works
            if (!state.isOnboarded) {
                state.isOnboarded = true;
                state.currentLayer = 0;
            }

            state.todayEnergy = action.energy;
            saveState();

            showScreen('dashboard');
            window.location.hash = "#/dashboard";

            // Show a brief contextual message
            showToast(action.message, selectedState === 'body' ? 'warning' : 'info', 5000);
        }

        // ==========================================================
        // POLARIS SYSTEM (UPDATE 4 — USER-OWNED ANCHORS + RETENTION)
        // ==========================================================

        function ensurePolarisState() {
            if (!state.polaris) {
                state.polaris = {
                    enabled: true,
                    proof: { total: 0, today: 0, streak: 0, lastProofDate: "", ledger: [] },
                    resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
                    day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
                    anchors: { today: {} },
                    quests: { daily: [] },
                    profile: {},
                    questionnaire: {},
                    routing: {}
                };
            }
            if (!state.polaris.proof) state.polaris.proof = { total: 0, today: 0, ledger: [] };
            if (!state.polaris.resilience) state.polaris.resilience = { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' };
            if (!state.polaris.day) state.polaris.day = { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false };
            if (!state.polaris.anchors) state.polaris.anchors = { today: {} };
            if (!state.polaris.quests) state.polaris.quests = { daily: [] };
            if (!state.polaris.profile) state.polaris.profile = {};
            if (!state.polaris.profile.evolvingIntake) {
                state.polaris.profile.evolvingIntake = {
                    enabled: true,
                    answers: {},
                    lastQuestionDate: null,
                    currentQuestionId: "q1"
                };
            } else if (typeof state.polaris.profile.evolvingIntake.currentQuestionId === 'number') {
                // Migration from flat array to tree structure
                state.polaris.profile.evolvingIntake.currentQuestionId = "q1";
            }
            if (!state.polaris.questionnaire) state.polaris.questionnaire = {};
            if (!state.polaris.routing) state.polaris.routing = {};

            if (state.polaris.openaiApiKey === undefined) state.polaris.openaiApiKey = null;
            if (state.polaris.chatHistory === undefined) state.polaris.chatHistory = [];
            if (state.polaris.futureNarrowingActive === undefined) state.polaris.futureNarrowingActive = false;
            if (state.polaris.possibilityCollapseInterventions === undefined) state.polaris.possibilityCollapseInterventions = 0;
            if (state.polaris.startupDragHistory === undefined) state.polaris.startupDragHistory = [];
            if (state.polaris.ruminationStopLossCount === undefined) state.polaris.ruminationStopLossCount = 0;

            if (!state.compendiumCourse) {
                state.compendiumCourse = {
                    completedModules: [],
                    reflections: {}
                };
            }

            if (!state.supportMap) {
                state.supportMap = {
                    anchorPerson: "",
                    bufferContact: "",
                    safeEnvironment: ""
                };
            }

            // Ensure anchors.today is an object (migration from v2/v3 arrays)
            if (Array.isArray(state.polaris.anchors.today)) {
                state.polaris.anchors.today = {};
            }
            // Set firstUseDate once
            if (!state.firstUseDate) {
                state.firstUseDate = getTodayString();
                saveState();
            }
        }

        function getDayNumber() {
            if (!state.firstUseDate) return 1;
            const first = new Date(state.firstUseDate + 'T00:00:00');
            const now = new Date(getTodayString() + 'T00:00:00');
            return Math.max(1, Math.floor((now - first) / 86400000) + 1);
        }

        function daysBetween(dateStr1, dateStr2) {
            const d1 = new Date(dateStr1 + 'T00:00:00');
            const d2 = new Date(dateStr2 + 'T00:00:00');
            return Math.floor(Math.abs(d2 - d1) / 86400000);
        }

        function getPolarisMessage(dayState) {
            if (state.reEntry && state.reEntry.lastMessageType === 'missed-yesterday') {
                return "You missed. That is data, not a verdict. Restart with one floor anchor.";
            }
            if (state.futureNarrowing === "none") {
                return "If no future feels believable, lower the task. The goal is not hope. The goal is one proof action.";
            }
            const map = {
                high: 'Full capacity. Run your anchors, then stop before it turns into punishment.',
                medium: 'Core anchors first. One extra task. No heroic plan.',
                low: 'Low day. Your anchors are still here. Do what you can.',
                collapse: 'Floor Wins Mode. No performance standard today. Stay safe, reduce damage, complete the smallest viable anchor.'
            };
            return map[dayState] || map.medium;
        }

        function getCompanionMessage(dayState, defaultMsg) {
            if (state.reEntry && state.reEntry.lastMessageType === 'missed-yesterday') {
                return "You missed. That is data, not a verdict. Restart with one floor anchor.";
            }
            if (state.futureNarrowing === "none") {
                return "If no future feels believable, lower the task. The goal is not hope. The goal is one proof action.";
            }
            if (dayState === 'collapse') {
                return "Floor Wins Mode. No performance standard today. Stay safe, reduce damage, complete the smallest viable anchor.";
            }
            // Give the companion a slightly mythic/calm voice if enabled, overriding the default message
            if (!state.polaris.profile.companionSkin) return defaultMsg;
            
            const PSYCHOED_TENETS = [
                "Momentum creates motivation, not the other way around.",
                "Avoidance reduces anxiety for 10 minutes, but deepens the depressive state for 10 hours.",
                "Shame is the heaviest cognitive drag. You are allowed to restart your day without moral punishment.",
                "Depression is a physical drag, not a moral failing. Protect your biological core.",
                "Disrupted sleep is one of the main engines of depression. Defend your wind-down window.",
                "The goal is not a perfect day. The goal is one piece of proof.",
                "Small setbacks hit harder than they should. This is a temporary condition of the nervous system."
            ];
            
            // Randomly select one if high or medium, otherwise use fallback
            // Seed randomness based on date so it's consistent for the day
            const daySeed = new Date().getDate();
            const tenet = PSYCHOED_TENETS[daySeed % PSYCHOED_TENETS.length];
            
            const map = {
                high: tenet,
                medium: tenet,
                low: 'I am here. The floor remains. Do what you can.',
                collapse: 'Rest. There is no failure on the floor.'
            };
            return map[dayState] || defaultMsg;
        }

        function getAnchorsForToday(dayState) {
            let anchorsList = [];
            // Collapse: always show generic floor items
            if (dayState === 'collapse') {
                anchorsList = [
                    { id: 'floor_water', text: 'Drink a full glass of water', isGeneric: true },
                    { id: 'floor_light', text: 'Open blinds or stand by window', isGeneric: true },
                    { id: 'floor_win', text: 'One tiny Floor Win (anything)', isGeneric: true }
                ];
            } else if (state.userAnchors.length > 0) {
                // User has anchors: show them all
                anchorsList = state.userAnchors.map(a => ({ id: a.id, text: a.text, isGeneric: false }));
            } else if (dayState === 'low') {
                // No user anchors + low energy: show minimal generic suggestions
                anchorsList = [
                    { id: 'sug_water', text: 'Drink water', isGeneric: true },
                    { id: 'sug_light', text: 'Stand in daylight for 2 minutes', isGeneric: true },
                    { id: 'sug_one', text: 'Do one small thing', isGeneric: true }
                ];
            }

            // Always append Social Presence as a generic/optional anchor
            anchorsList.push({
                id: 'polaris_social_presence',
                text: 'Social Presence: Sit near people, send one low-pressure text, or reply to one message',
                isGeneric: true
            });

            // Append External Anchor if one is configured and not "none"
            const extTask = getExternalAnchorTask();
            if (extTask) {
                anchorsList.push({
                    id: 'polaris_external_anchor',
                    text: extTask,
                    isGeneric: true
                });
            }

            return anchorsList;
        }

        function setPolarisCompanion(skinEmoji) {
            ensurePolarisState();
            state.polaris.profile.companionSkin = skinEmoji;
            saveState();
            renderPolarisTab();
            if (skinEmoji) {
                showToast(`Companion selected: ${skinEmoji}`, "success");
            } else {
                showToast("Companion hidden.", "success");
            }
        }

        function toggleCompanionQuestions() {
            ensurePolarisState();
            const intake = state.polaris.profile.evolvingIntake;
            intake.enabled = !intake.enabled;
            saveState();
            renderPolarisTab();
            if (intake.enabled) {
                showToast("Evolving intake enabled.", "success");
            } else {
                showToast("Evolving intake disabled.", "info");
            }
        }

        function answerCompanionQuestion(score) {
            ensurePolarisState();
            const intake = state.polaris.profile.evolvingIntake;
            const qId = intake.currentQuestionId;
            if (qId === "done") return;
            
            // Record answer
            const today = getTodayString();
            if (!intake.answers[today]) intake.answers[today] = {};
            intake.answers[today][qId] = score;
            intake.lastQuestionDate = getTodayString();
            
            const currentQ = COMPANION_QUESTION_TREE[qId];
            if (currentQ && currentQ.next) {
                if (currentQ.next[score] !== undefined) {
                    intake.currentQuestionId = currentQ.next[score];
                } else if (currentQ.next["default"] !== undefined) {
                    intake.currentQuestionId = currentQ.next["default"];
                } else {
                    intake.currentQuestionId = "done";
                }
            } else {
                intake.currentQuestionId = "done";
            }
            
            saveState();
            renderPolarisTab();
            showToast("Companion noted your answer.", "success");
        }

        function submitCompanionTextAnswer() {
            const textarea = document.getElementById('companion-question-text-input');
            if (!textarea) return;
            const textVal = textarea.value.trim();
            if (!textVal) {
                showToast("Please type a reflection before saving.", "warning");
                return;
            }
            answerCompanionQuestion(textVal);
        }

        function skipCompanionQuestion() {
            ensurePolarisState();
            const intake = state.polaris.profile.evolvingIntake;
            intake.lastQuestionDate = getTodayString(); // count as asked today
            saveState();
            renderPolarisTab();
        }

        function answerAnotherCompanionQuestion() {
            ensurePolarisState();
            const intake = state.polaris.profile.evolvingIntake;
            intake.lastQuestionDate = null;
            saveState();
            renderPolarisTab();
        }

        // ---- RENDER: Main Polaris Tab ----

        function renderPolarisTab() {
            ensurePolarisState();

            const contentEl = document.getElementById('polaris-content');
            const disabledEl = document.getElementById('polaris-disabled');
            const toggleEl = document.getElementById('polaris-toggle');
            const toggleKnob = document.getElementById('polaris-toggle-knob');
            const toggleLabel = document.getElementById('polaris-toggle-label');

            if (!state.polaris.enabled) {
                contentEl.classList.add('hidden');
                disabledEl.classList.remove('hidden');
                toggleEl.style.background = 'rgba(255,255,255,0.1)';
                toggleKnob.style.left = '2px';
                toggleLabel.textContent = 'Disabled';
                return;
            }

            contentEl.classList.remove('hidden');
            disabledEl.classList.add('hidden');
            toggleEl.style.background = 'var(--accent-teal)';
            toggleKnob.style.left = '22px';
            toggleLabel.textContent = 'Enabled';

            // Day rollover: reset today's completions and proof when date changes
            const today = getTodayString();
            if (state.polaris.day.lastCheckInDate && state.polaris.day.lastCheckInDate !== today) {
                // Clear stale tomorrowAnchor if gap > 1 day
                const gapSinceCheckin = daysBetween(state.polaris.day.lastCheckInDate, today);
                if (gapSinceCheckin > 1) {
                    state.tomorrowAnchor = '';
                }
                state.polaris.anchors.today = {};
                state.polaris.proof.today = 0;
                state.polaris.day.floorWinsMode = false;
            }
            state.polaris.day.lastCheckInDate = today;

            const dayState = (state.todayEnergy || 'medium').toLowerCase();
            let message = getPolarisMessage(dayState);
            message = getCompanionMessage(dayState, message);

            // B2: Day counter
            const dayCounterEl = document.getElementById('polaris-day-counter');
            if (dayCounterEl) dayCounterEl.textContent = 'Day ' + getDayNumber();

            // B5: Hope level
            renderPolarisHopeLevel();

            // Day message and Companion Avatar
            document.getElementById('polaris-message-text').textContent = message;
            const energyBadge = document.getElementById('polaris-energy-badge');
            energyBadge.textContent = dayState.toUpperCase();
            energyBadge.className = 'badge badge-' + dayState;
            energyBadge.style.cssText = 'font-size: 0.65rem; padding: 0.1rem 0.4rem;';
            
            const avatarEl = document.getElementById('polaris-companion-avatar');
            if (state.polaris.profile.companionSkin) {
                avatarEl.textContent = state.polaris.profile.companionSkin;
                avatarEl.style.display = 'block';
                contentEl.dataset.companionTheme = state.polaris.profile.companionSkin;
            } else {
                avatarEl.style.display = 'none';
                delete contentEl.dataset.companionTheme;
            }

            // Highlight active companion selector button
            const activeSkin = state.polaris.profile.companionSkin || '';
            const selectorContainer = document.getElementById('companion-selector-list');
            if (selectorContainer) {
                const buttons = selectorContainer.querySelectorAll('button');
                buttons.forEach(btn => {
                    const onclickAttr = btn.getAttribute('onclick') || '';
                    const match = onclickAttr.match(/setPolarisCompanion\('(.*)'\)/);
                    const btnSkin = match ? match[1] : '';
                    if (btnSkin === activeSkin) {
                        btn.style.borderColor = 'var(--accent-teal)';
                        btn.style.boxShadow = '0 0 8px var(--accent-teal-glow)';
                        btn.style.background = 'rgba(20, 200, 175, 0.2)';
                    } else {
                        btn.style.borderColor = 'rgba(255,255,255,0.1)';
                        btn.style.boxShadow = 'none';
                        btn.style.background = 'rgba(255,255,255,0.05)';
                    }
                });
            }

            // Evolving Questionnaire logic
            const qToggleKnob = document.getElementById('companion-questions-knob');
            const qToggle = document.getElementById('companion-questions-toggle');
            const intake = state.polaris.profile.evolvingIntake;
            
            if (qToggle && qToggleKnob) {
                if (intake.enabled) {
                    qToggle.style.background = 'var(--accent-lavender)';
                    qToggleKnob.style.left = '18px';
                } else {
                    qToggle.style.background = 'rgba(255,255,255,0.1)';
                    qToggleKnob.style.left = '2px';
                }
            }

            // B2: Evolving Questionnaire
            const qCard = document.getElementById('polaris-companion-question');
            const askAnotherCard = document.getElementById('polaris-answer-another-container');
            const qControls = document.getElementById('companion-question-controls');
            if (qCard) {
                const intake = state.polaris.profile.evolvingIntake;
                const currentQ = COMPANION_QUESTION_TREE[intake.currentQuestionId];
                const isReflection = intake.currentQuestionId && intake.currentQuestionId.endsWith('_a');
                if (intake.enabled && state.polaris.profile.companionSkin && (intake.lastQuestionDate !== getTodayString() || isReflection) && intake.currentQuestionId !== "done" && currentQ) {
                    document.getElementById('companion-question-text').textContent = currentQ.text;
                    
                    // Render dynamic inputs based on question type
                    if (qControls) {
                        const isTextQuestion = currentQ.next && currentQ.next['0'] === undefined && currentQ.next['default'] !== undefined;
                        
                        if (isTextQuestion) {
                            qControls.innerHTML = `
                                <textarea id="companion-question-text-input" rows="3" placeholder="Type your reflection here..." class="polaris-input polaris-input-lavender" style="resize: vertical; margin-bottom: 0.75rem;" autofocus></textarea>
                                <button class="polaris-btn polaris-btn-lavender" id="btn-submit-companion-text" style="background: rgba(165,120,240,0.1); border: 1px solid var(--accent-lavender); font-weight: 600;">Save Reflection</button>
                            `;
                            // Attach click listener directly
                            document.getElementById('btn-submit-companion-text').addEventListener('click', submitCompanionTextAnswer);
                        } else {
                            qControls.innerHTML = `
                                <div style="display: flex; gap: 0.5rem; flex-direction: column; margin-bottom: 0.75rem;">
                                    <button class="polaris-btn polaris-btn-lavender" onclick="answerCompanionQuestion(0)" style="padding: 0.6rem;">Not at all</button>
                                    <button class="polaris-btn polaris-btn-lavender" onclick="answerCompanionQuestion(1)" style="padding: 0.6rem;">Rare / Mild</button>
                                    <button class="polaris-btn polaris-btn-lavender" onclick="answerCompanionQuestion(2)" style="padding: 0.6rem;">Sometimes</button>
                                    <button class="polaris-btn polaris-btn-lavender" onclick="answerCompanionQuestion(3)" style="padding: 0.6rem;">Often</button>
                                    <button class="polaris-btn polaris-btn-lavender" onclick="answerCompanionQuestion(4)" style="padding: 0.6rem;">Almost Always</button>
                                </div>
                            `;
                        }
                    }
                    
                    qCard.classList.remove('hidden');
                } else {
                    qCard.classList.add('hidden');
                }

                if (intake.enabled && state.polaris.profile.companionSkin && intake.lastQuestionDate === getTodayString() && !isReflection && intake.currentQuestionId !== "done") {
                    if(askAnotherCard) askAnotherCard.classList.remove('hidden');
                } else {
                    if(askAnotherCard) askAnotherCard.classList.add('hidden');
                }
            }

            // B3: Gap notice
            renderGapNotice();

            // B4: Program Insights
            renderPolarisInsights();
            renderPolarisIntakeHistory();

            // B8: Yesterday incomplete
            renderYesterdayIncomplete();

            // B6: Tomorrow recall (from yesterday)
            renderTomorrowRecall();

            // Anchors
            const anchors = getAnchorsForToday(dayState);
            renderAnchorList(anchors, dayState);

            // Proof points
            document.getElementById('polaris-proof-total').textContent = state.polaris.proof.total + ' pts';
            document.getElementById('polaris-proof-today').textContent = 'Today: ' + state.polaris.proof.today + ' points earned';

            // B7: Personal bests
            renderPersonalBests();

            // B1: Activity calendar
            renderActivityCalendar();

            // B6: Tomorrow hook (after all done)
            renderTomorrowHook(anchors);

            // Resilience info (B4: return speed surfaced)
            const r = state.polaris.resilience;
            const resRate = calculateResilienceRate();
            let resText = 'Active: ' + (r.current || 0) + ' | Best: ' + (r.longest || 0);
            if (r.missedDays > 0) resText += ' | Restarts: ' + r.missedDays;
            if (resRate < 100 && state.history.length > 2) resText += ' | Return rate: ' + resRate + '%';
            document.getElementById('polaris-resilience-info').textContent = resText;

            // Future Narrowing Toggle state
            const narrowingBanner = document.getElementById('future-narrowing-banner');
            const narrowingBtn = document.getElementById('btn-toggle-future-narrowing');
            const narrowingBadge = document.getElementById('badge-narrowing-status');
            
            if (state.polaris.futureNarrowingActive) {
                document.body.classList.add('future-narrowing-active');
                if (narrowingBanner) narrowingBanner.classList.remove('hidden');
                if (narrowingBtn) {
                    narrowingBtn.textContent = 'Expand Horizon';
                    narrowingBtn.style.borderColor = 'var(--accent-orange)';
                    narrowingBtn.style.color = 'var(--accent-orange)';
                }
                if (narrowingBadge) {
                    narrowingBadge.textContent = 'NARROWED';
                    narrowingBadge.style.background = 'rgba(20, 200, 175, 0.2)';
                    narrowingBadge.style.borderColor = 'rgba(20, 200, 175, 0.4)';
                    narrowingBadge.style.color = 'var(--accent-teal)';
                }
            } else {
                document.body.classList.remove('future-narrowing-active');
                if (narrowingBanner) narrowingBanner.classList.add('hidden');
                if (narrowingBtn) {
                    narrowingBtn.textContent = 'Narrow Horizon';
                    narrowingBtn.style.borderColor = 'rgba(20,200,175,0.25)';
                    narrowingBtn.style.color = 'var(--accent-teal)';
                }
                if (narrowingBadge) {
                    narrowingBadge.textContent = 'Normal';
                    narrowingBadge.style.background = 'rgba(255,255,255,0.05)';
                    narrowingBadge.style.color = 'var(--text-secondary)';
                }
            }

            void ensurePolarisOpenAIKeyLoaded();
            renderPolarisChat();

            saveState();
        }

        function renderPolarisInsights() {
            const container = document.getElementById('polaris-insights-container');
            const list = document.getElementById('polaris-insights-list');
            if (!container || !list) return;

            const intake = state.polaris.profile.evolvingIntake;
            if (!intake || !intake.answers || !intake.enabled || !state.polaris.profile.companionSkin) {
                container.classList.add('hidden');
                return;
            }

            const answers = {};
            for (const date in intake.answers) {
                Object.assign(answers, intake.answers[date]);
            }

            const domains = [
                { title: "Functional Damage", range: [1, 15], text: "Your depressive state is heavily shrinking your daily life, making basic tasks disproportionately expensive." },
                { title: "Anhedonia & Despair", range: [16, 30], text: "You are experiencing significant emotional blunting and loss of reward. This is a nervous system state, not a permanent loss of color." },
                { title: "Cognitive Drag", range: [31, 45], text: "Your mind is currently building cases against itself. Remember that depressed thoughts are not objective truth." },
                { title: "Sleep Disruption", range: [46, 60], text: "Sleep disruption is a primary engine of your current state. Stabilizing your wake time and morning light is a top priority." },
                { title: "Physical Drag", range: [61, 75], text: "Your body is experiencing heavy physical deconditioning. The drag you feel is biological, not a lack of willpower." },
                { title: "Avoidance Failure", range: [76, 90], text: "Avoidance is currently driving your collapse. Waiting to feel ready before acting is a trap. Start smaller." },
                { title: "Friction & Admin", range: [91, 105], text: "Your environment and lack of structure are accomplices to collapse. Focus on reducing visual clutter and friction." },
                { title: "Social Shrinkage", range: [106, 120], text: "Shame is making you harder to reach. You need low-pressure human contact, even if you feel like a burden." },
                { title: "Treatment Fit", range: [121, 135], text: "Your current treatment approach may not fit your real life or has severe side-effect tradeoffs." },
                { title: "Hope Signal", range: [136, 150], text: "You are discounting small corrective actions. We need a minimum viable day plan that guarantees small wins." }
            ];

            const insights = [];
            for (const config of domains) {
                let sum = 0;
                let count = 0;
                for (let i = config.range[0]; i <= config.range[1]; i++) {
                    if (answers["q" + i] !== undefined) {
                        sum += parseInt(answers["q" + i]);
                        count++;
                    }
                }
                // Require at least 3 questions answered in a domain, with average >= 2.5
                if (count >= 3 && (sum / count) >= 2.5) {
                    insights.push(config);
                }
            }

            if (insights.length === 0) {
                container.classList.add('hidden');
                return;
            }

            container.classList.remove('hidden');
            list.innerHTML = insights.map(i => `
                <div class="polaris-tool-card" style="border-left: 3px solid var(--accent-lavender); padding: 0.75rem; margin-bottom: 0.5rem;">
                    <div class="polaris-tool-title polaris-section-title-lavender" style="margin-bottom: 0.25rem;">${i.title}</div>
                    <div class="polaris-tool-desc" style="margin-bottom: 0;">${i.text}</div>
                </div>
            `).join('');
        }

        // ---- RENDER: Evolving Intake History Log ----

        function renderPolarisIntakeHistory() {
            const container = document.getElementById('polaris-intake-history-container');
            const list = document.getElementById('polaris-intake-history-list');
            if (!container || !list) return;

            const intake = state.polaris.profile.evolvingIntake;
            if (!intake || !intake.answers || !intake.enabled || !state.polaris.profile.companionSkin) {
                container.classList.add('hidden');
                return;
            }

            const historyItems = [];
            const dates = Object.keys(intake.answers).sort();
            for (const date of dates) {
                const dayAnswers = intake.answers[date];
                for (const qId in dayAnswers) {
                    historyItems.push({
                        qId,
                        answer: dayAnswers[qId],
                        date
                    });
                }
            }

            if (historyItems.length === 0) {
                container.classList.add('hidden');
                return;
            }

            container.classList.remove('hidden');

            const scoreLabels = {
                0: "Not at all",
                1: "Rare / Mild",
                2: "Sometimes",
                3: "Often",
                4: "Almost Always"
            };

            list.innerHTML = historyItems.map(item => {
                const qId = item.qId;
                const ans = item.answer;
                const currentQ = COMPANION_QUESTION_TREE[qId];
                if (!currentQ) return '';

                if (qId.endsWith('_a')) {
                    const parentQId = qId.replace('_a', '');
                    const parentQ = COMPANION_QUESTION_TREE[parentQId];
                    const parentText = parentQ ? parentQ.text : 'Previous Question';
                    return `
                        <div class="polaris-tool-card" style="border-left: 2px solid var(--accent-lavender); padding: 0.6rem; margin-bottom: 0.5rem; background: rgba(165, 120, 240, 0.05);">
                            <div class="text-muted" style="font-size: 0.75rem; margin-bottom: 0.2rem;">Reflection on: ${escapeHtml(parentText)}</div>
                            <div class="text-lavender" style="font-size: 0.8rem; font-style: italic; margin-bottom: 0.3rem;">"${escapeHtml(currentQ.text)}"</div>
                            <div style="color: var(--text-primary); white-space: pre-wrap; line-height: 1.4; font-size: 0.85rem;">${escapeHtml(ans.toString())}</div>
                            <div class="text-muted" style="font-size: 0.7rem; text-align: right; margin-top: 0.25rem;">${item.date}</div>
                        </div>
                    `;
                } else {
                    const label = scoreLabels[ans] || ans;
                    const qNum = qId.replace('q', '');
                    return `
                        <div class="polaris-tool-card" style="border-left: 2px solid rgba(255,255,255,0.15); padding: 0.6rem; margin-bottom: 0.5rem;">
                            <div class="text-muted" style="font-size: 0.75rem; margin-bottom: 0.2rem;">Question ${qNum}: ${escapeHtml(currentQ.text)}</div>
                            <div style="color: var(--text-primary); font-weight: 500; font-size: 0.85rem;">Answer: ${escapeHtml(label.toString())}</div>
                            <div class="text-muted" style="font-size: 0.7rem; text-align: right; margin-top: 0.25rem;">${item.date}</div>
                        </div>
                    `;
                }
            }).filter(h => h !== '').join('');
        }

        // ---- RENDER: Hope Level in Polaris ----

        function renderPolarisHopeLevel() {
            const totalFloorDays = state.history.filter(log => log.floorCompleted).length;
            let level = 1, progress = 0, title = 'Action is Possible';

            if (totalFloorDays < 3) {
                level = 1; progress = (totalFloorDays / 3) * 20;
            } else if (totalFloorDays < 7) {
                level = 2; progress = 20 + ((totalFloorDays - 3) / 4) * 20;
                title = 'Action Causes Results';
            } else if (totalFloorDays < 12) {
                level = 3; progress = 40 + ((totalFloorDays - 7) / 5) * 20;
                title = 'The Result Can Repeat';
            } else if (totalFloorDays < 20) {
                level = 4; progress = 60 + ((totalFloorDays - 12) / 8) * 20;
                title = 'Repetition Stabilizes';
            } else {
                level = 5; progress = Math.min(100, 80 + ((totalFloorDays - 20) / 10) * 20);
                title = 'Stability Supports a Future';
            }

            const hopeTitle = document.getElementById('polaris-hope-title');
            const hopePercent = document.getElementById('polaris-hope-percent');
            const hopeFill = document.getElementById('polaris-hope-fill');
            if (hopeTitle) hopeTitle.textContent = 'Level ' + level + ': ' + title;
            if (hopePercent) hopePercent.textContent = Math.round(progress) + '%';
            if (hopeFill) hopeFill.style.width = progress + '%';
        }

        // ---- RENDER: Gap Notice (B3) ----

        function renderGapNotice() {
            const el = document.getElementById('polaris-gap-notice');
            if (!el) return;
            const h = state.history;
            if (h.length === 0) { el.classList.add('hidden'); return; }
            const lastDate = h[h.length - 1].date;
            const today = getTodayString();
            if (lastDate === today) { el.classList.add('hidden'); return; }
            const gap = daysBetween(lastDate, today);
            if (gap >= 2) {
                el.textContent = gap + ' days since last check-in. Pick up where you are.';
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }

        // ---- RENDER: Yesterday Incomplete (B8) ----

        function renderYesterdayIncomplete() {
            const el = document.getElementById('polaris-yesterday-incomplete');
            if (!el) return;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yy = yesterday.getFullYear();
            const ym = String(yesterday.getMonth() + 1).padStart(2, '0');
            const yd = String(yesterday.getDate()).padStart(2, '0');
            const yStr = yy + '-' + ym + '-' + yd;
            const yLog = state.history.find(l => l.date === yStr);
            if (!yLog) { el.classList.add('hidden'); return; }
            if (yLog.missed) {
                el.textContent = 'Yesterday was missed. Today is a restart.';
                el.classList.remove('hidden');
            } else if (yLog.completed && yLog.completed.length > 0 && !yLog.mvdCompleted) {
                el.textContent = yLog.completed.length + ' done yesterday. Partial days still count.';
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }

        // ---- RENDER: Tomorrow Recall (B6) ----

        function renderTomorrowRecall() {
            const el = document.getElementById('polaris-tomorrow-recall');
            if (!el) return;
            if (state.tomorrowAnchor) {
                el.innerHTML = '<span>Yesterday you said: <strong>' + escapeHtml(state.tomorrowAnchor) + '</strong></span>'
                    + '<span style="display:flex;gap:0.4rem;">'
                    + '<button class="btn btn-secondary" onclick="addTomorrowRecallAsAnchor()" style="padding:0.2rem 0.5rem;font-size:0.7rem;color:var(--accent-teal);border-color:rgba(20,200,175,0.3);">Add</button>'
                    + '<button class="btn btn-secondary" onclick="dismissTomorrowRecall()" style="padding:0.2rem 0.5rem;font-size:0.7rem;">×</button>'
                    + '</span>';
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }

        function escapeHtml(str) {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        }

        function addTomorrowRecallAsAnchor() {
            if (state.tomorrowAnchor) {
                state.userAnchors.push({ id: 'anchor_' + Date.now(), text: state.tomorrowAnchor, active: true });
                state.tomorrowAnchor = '';
                saveState();
                renderPolarisTab();
                showToast('Added as anchor.', 'success');
            }
        }

        function dismissTomorrowRecall() {
            state.tomorrowAnchor = '';
            saveState();
            renderPolarisTab();
        }

        // ---- RENDER: Anchor List ----

        function renderAnchorList(anchors, dayState) {
            const anchorsList = document.getElementById('polaris-anchors-list');
            const emptyState = document.getElementById('polaris-empty-anchors');
            anchorsList.innerHTML = '';

            if (anchors.length === 0) {
                if (emptyState) emptyState.classList.remove('hidden');
                return;
            }
            if (emptyState) emptyState.classList.add('hidden');

            // Generic suggestion notice
            if (anchors[0] && anchors[0].isGeneric && dayState !== 'collapse') {
                const notice = document.createElement('div');
                notice.style.cssText = 'font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.4rem; font-style: italic;';
                notice.textContent = 'Suggested basics \u2014 add your own anchors above.';
                anchorsList.appendChild(notice);
            }

            if (dayState === 'collapse') {
                const notice = document.createElement('div');
                notice.style.cssText = 'font-size: 0.75rem; color: var(--accent-orange); margin-bottom: 0.4rem;';
                notice.textContent = 'Collapse day. Minimum floor only.';
                anchorsList.appendChild(notice);
            }

            anchors.forEach(function(anchor) {
                const isChecked = state.polaris.anchors.today[anchor.id] && state.polaris.anchors.today[anchor.id].completed;
                const item = document.createElement('div');
                item.className = 'polaris-anchor-item' + (isChecked ? ' checked' : '');

                // Checkbox
                const checkbox = document.createElement('div');
                checkbox.className = 'polaris-anchor-checkbox';
                checkbox.textContent = isChecked ? '\u2713' : '';
                // Add click on the entire item instead of just the checkbox for a better click target
                item.addEventListener('click', function() { togglePolarisAnchor(anchor.id, anchor.text); });

                // Text
                const text = document.createElement('span');
                text.className = 'polaris-anchor-text';
                text.textContent = anchor.text;

                item.appendChild(checkbox);
                item.appendChild(text);

                // Delete button (user anchors only)
                if (!anchor.isGeneric) {
                    const del = document.createElement('button');
                    del.style.cssText = 'background: none; border: none; color: rgba(255,255,255,0.15); font-size: 1.1rem; cursor: pointer; padding: 0 0.3rem; line-height: 1; transition: color 0.2s;';
                    del.textContent = '\u00d7';
                    del.addEventListener('mouseenter', function() { del.style.color = 'var(--accent-red)'; });
                    del.addEventListener('mouseleave', function() { del.style.color = 'rgba(255,255,255,0.15)'; });
                    del.addEventListener('click', function(e) { e.stopPropagation(); removeUserAnchor(anchor.id); });
                    item.appendChild(del);
                }

                anchorsList.appendChild(item);
            });

            // Softer messaging for low energy
            if (dayState === 'low' && anchors.length > 0 && !anchors[0].isGeneric) {
                const notice = document.createElement('div');
                notice.style.cssText = 'font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.4rem; font-style: italic;';
                notice.textContent = 'Low energy day. Do what you can.';
                anchorsList.appendChild(notice);
            }
        }

        // ---- RENDER: Personal Bests (B7) ----

        function computePersonalBests() {
            const h = state.history;
            let currentStreak = 0, longestStreak = 0;
            for (let i = 0; i < h.length; i++) {
                if (h[i] && (h[i].floorCompleted || (h[i].completed && h[i].completed.length > 0))) {
                    currentStreak++;
                    longestStreak = Math.max(longestStreak, currentStreak);
                } else { currentStreak = 0; }
            }
            let mostAnchors = 0;
            for (let i = 0; i < h.length; i++) {
                if (h[i] && h[i].completed) mostAnchors = Math.max(mostAnchors, h[i].completed.length);
            }
            // Also count polaris proof entries per day
            if (state.polaris && state.polaris.proof && state.polaris.proof.ledger) {
                const dayCounts = {};
                state.polaris.proof.ledger.forEach(function(e) {
                    if (e && e.createdAt) {
                        const d = e.createdAt.slice(0, 10);
                        dayCounts[d] = (dayCounts[d] || 0) + 1;
                    }
                });
                Object.values(dayCounts).forEach(function(c) { mostAnchors = Math.max(mostAnchors, c); });
            }
            let fastestRestart = null;
            for (let i = 0; i < h.length; i++) {
                if (h[i] && h[i].missed) {
                    for (let j = i + 1; j < h.length; j++) {
                        if (h[j] && (h[j].floorCompleted || (h[j].completed && h[j].completed.length > 0))) {
                            const gap = j - i;
                            if (fastestRestart === null || gap < fastestRestart) fastestRestart = gap;
                            break;
                        }
                    }
                }
            }
            state.personalBests = { longestStreak: longestStreak, mostAnchorsInDay: mostAnchors, fastestRestart: fastestRestart };
        }

        function renderPersonalBests() {
            computePersonalBests();
            const el = document.getElementById('polaris-personal-bests');
            if (!el) return;
            const pb = state.personalBests;
            if (pb.longestStreak === 0 && pb.mostAnchorsInDay === 0) { el.style.display = 'none'; return; }
            el.style.display = 'flex';
            var parts = [];
            if (pb.longestStreak > 0) parts.push('Best run: ' + pb.longestStreak);
            if (pb.mostAnchorsInDay > 0) parts.push('Best day: ' + pb.mostAnchorsInDay + ' done');
            if (pb.fastestRestart !== null) parts.push('Fastest restart: ' + pb.fastestRestart + 'd');
            el.textContent = parts.join('  |  ');
        }

        // ---- RENDER: Activity Calendar (B1) ----

        function renderActivityCalendar() {
            const container = document.getElementById('polaris-activity-calendar');
            if (!container) return;

            // Build active dates map from history + proof ledger
            var activeDates = {};
            state.history.forEach(function(log) {
                if (!log) return;
                var level = 0;
                if (log.floorCompleted && log.mvdCompleted) level = 3;
                else if (log.floorCompleted) level = 2;
                else if (log.completed && log.completed.length > 0) level = 1;
                if (level > 0) activeDates[log.date] = level;
            });
            if (state.polaris && state.polaris.proof && state.polaris.proof.ledger) {
                state.polaris.proof.ledger.forEach(function(entry) {
                    if (entry && entry.createdAt) {
                        var d = entry.createdAt.slice(0, 10);
                        if (!activeDates[d]) activeDates[d] = 1;
                    }
                });
            }

            var today = new Date();
            var todayStr = getTodayString();
            var colors = ['rgba(255,255,255,0.04)', 'rgba(20,200,175,0.2)', 'rgba(20,200,175,0.45)', 'rgba(20,200,175,0.75)'];
            var html = '<div style="display:grid;grid-template-rows:repeat(7,12px);grid-auto-flow:column;gap:2px;width:fit-content;">';

            for (var i = 83; i >= 0; i--) {
                var d = new Date(today);
                d.setDate(d.getDate() - i);
                var yyyy = d.getFullYear();
                var mm = String(d.getMonth() + 1).padStart(2, '0');
                var dd = String(d.getDate()).padStart(2, '0');
                var dateStr = yyyy + '-' + mm + '-' + dd;
                var level = activeDates[dateStr] || 0;
                var isToday = (dateStr === todayStr);
                var border = isToday ? 'outline:1px solid rgba(255,255,255,0.4);outline-offset:-1px;' : '';
                html += '<div title="' + dateStr + '" style="width:12px;height:12px;border-radius:2px;background:' + colors[Math.min(level, 3)] + ';' + border + '"></div>';
            }
            html += '</div>';
            container.innerHTML = html;
        }

        // ---- RENDER: Tomorrow Hook (B6) ----

        function renderTomorrowHook(anchors) {
            var el = document.getElementById('polaris-tomorrow-hook');
            if (!el) return;
            if (anchors.length === 0) { el.classList.add('hidden'); return; }
            var allDone = anchors.every(function(a) {
                return state.polaris.anchors.today[a.id] && state.polaris.anchors.today[a.id].completed;
            });
            if (allDone && anchors.length > 0) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }

        // ---- USER ANCHOR MANAGEMENT ----

        function addUserAnchor() {
            var input = document.getElementById('input-new-anchor');
            var text = input.value.trim();
            if (!text) return;
            state.userAnchors.push({ id: 'anchor_' + Date.now(), text: text, active: true });
            input.value = '';
            saveState();
            renderPolarisTab();
        }

        function removeUserAnchor(id) {
            state.userAnchors = state.userAnchors.filter(function(a) { return a.id !== id; });
            // Clean up completion entry
            delete state.polaris.anchors.today[id];
            saveState();
            renderPolarisTab();
        }

        function saveTomorrowAnchor() {
            var input = document.getElementById('input-tomorrow-anchor');
            var text = input.value.trim();
            if (!text) return;
            state.tomorrowAnchor = text;
            input.value = '';
            saveState();
            showToast('Tomorrow anchor set.', 'success');
        }

        // ---- POLARIS ACTIONS ----

        function togglePolaris() {
            ensurePolarisState();
            state.polaris.enabled = !state.polaris.enabled;
            saveState();
            renderPolarisTab();
        }

        function togglePolarisAnchor(anchorId, anchorText) {
            ensurePolarisState();
            var wasCompleted = state.polaris.anchors.today[anchorId] && state.polaris.anchors.today[anchorId].completed;
            state.polaris.anchors.today[anchorId] = { completed: !wasCompleted };

            if (!wasCompleted) {
                state.polaris.proof.today += 1;
                state.polaris.proof.total += 1;
                state.polaris.proof.ledger.push({
                    id: 'proof_' + Date.now(),
                    source: 'anchor',
                    points: 1,
                    label: anchorText,
                    createdAt: new Date().toISOString()
                });
                // Also log to history for dashboard metrics
                logActionCompletion(anchorText);
            } else {
                state.polaris.proof.today = Math.max(0, state.polaris.proof.today - 1);
                state.polaris.proof.total = Math.max(0, state.polaris.proof.total - 1);
            }

            saveState();
            renderPolarisTab();
        }

        function polarisFloorWin() {
            ensurePolarisState();
            state.polaris.proof.today += 1;
            state.polaris.proof.total += 1;
            state.polaris.proof.ledger.push({
                id: 'proof_' + Date.now(),
                source: 'floor_win',
                points: 1,
                label: 'Floor Win',
                createdAt: new Date().toISOString()
            });
            state.polaris.day.floorWinsMode = true;
            logActionCompletion('Floor Win');
            saveState();
            renderPolarisTab();
            showToast('Floor Win logged. Proof logged.', 'success');
        }

        function polarisRestart() {
            ensurePolarisState();
            state.polaris.resilience.current = 0;
            state.polaris.anchors.today = {};
            state.polaris.proof.today = 0;
            state.polaris.day.floorWinsMode = false;
            saveState();
            renderPolarisTab();
            showToast('Day restarted. Anchors reset.', 'info');
        }

        // function showSmartWelcomeScreen() {
        //     showScreen("welcome");
        // }

        function executeMatchedFirstMove() {
            const energy = state.todayEnergy || "medium";
            if (energy === "collapse") {
                goToEmergencyFloor();
            } else {
                startSmallAction();
            }
        }

        function updateWelcomeScreenDynamicGreeting() {
            const greetingEl = document.getElementById("welcome-greeting");
            const subtitleEl = document.getElementById("welcome-subtitle");
            if (!greetingEl || !subtitleEl) return;

            let greeting = "You’re here.";
            let subtitle = "No catch-up. Pick the current state.";

            if (state.history && state.history.length > 0) {
                const activeDays = state.history.filter(log => log && log.date && !log.missed);
                if (activeDays.length > 0) {
                    const lastActiveLog = activeDays[activeDays.length - 1];
                    const today = getTodayString();
                    const gap = daysBetween(lastActiveLog.date, today);

                    if (gap <= 1) {
                        greeting = "You’re here.";
                        subtitle = "Continue or make it smaller.";
                    } else if (gap >= 2 && gap <= 3) {
                        greeting = "No reset.";
                        subtitle = "Pick the floor.";
                    } else if (gap >= 4 && gap <= 14) {
                        greeting = "Progress paused.";
                        subtitle = "Nothing is erased.";
                    } else {
                        greeting = "Long gap. Still not zero.";
                        subtitle = "Start with the floor.";
                    }
                }
            }

            greetingEl.textContent = greeting;
            subtitleEl.textContent = subtitle;
        }

        // ==========================================================
        // POLARIS 2.0 SYSTEM LOGIC FUNCTIONS
        // ==========================================================

        function activatePolarisUpgrade() {
            ensurePolarisState();
            state.polarisUpgrade = true;
            // Migrate existing history to polarisHistory
            if (state.history && state.history.length > 0 && state.polarisHistory.length === 0) {
                state.polarisHistory = state.history.map(h => ({
                    date: h.date,
                    energy: h.energy || 'medium',
                    phq9Score: (state.phq9History && state.phq9History.find(p => p.date === h.date)) ? state.phq9History.find(p => p.date === h.date).score : null,
                    anchorsCompleted: h.completed ? h.completed.length : 0,
                    floorCompleted: h.floorCompleted || false
                }));
            }
            saveState();
            // Hide the banner
            const banner = document.getElementById("polaris-activation-banner");
            if (banner) banner.classList.add("hidden");
            
            showToast("⚡ Polaris 2.0 Activated! Core assets and ledger records successfully migrated.", "success", 5000);
            renderDashboard();
            // Switch to momentum tab to show it off!
            window.location.hash = "#/momentum";
        }

        function generateNarrativeProof() {
            const h = state.history || [];
            if (h.length === 0) {
                return "PROOF: No check-in data recorded yet. Set your energy level and check off your first action to build your first data point.";
            }
            
            // Filter low energy successes
            const lowEnergySuccesses = h.filter(log => (log.energy === 'low' || log.energy === 'collapse') && (log.floorCompleted || log.mvdCompleted));
            
            // Calculate restarts
            let restarts = [];
            for (let i = 0; i < h.length - 1; i++) {
                if (h[i].missed && (h[i+1].floorCompleted || h[i+1].mvdCompleted)) {
                    restarts.push(h[i+1].date);
                }
            }
            
            const totalFloorDays = h.filter(log => log.floorCompleted).length;
            
            const proofs = [];
            
            if (lowEnergySuccesses.length > 0) {
                const lastLow = lowEnergySuccesses[lowEnergySuccesses.length - 1];
                proofs.push(`PROOF: On ${lastLow.date}, your energy was registered as ${lastLow.energy.toUpperCase()}, but you secured your biological floor. Action outpaced mood.`);
            }
            
            if (restarts.length > 0) {
                proofs.push(`PROOF: You successfully restarted on ${restarts[restarts.length - 1]} immediately following an incomplete day. Your restart speed is operational.`);
            }
            
            if (totalFloorDays >= 3) {
                proofs.push(`PROOF: You have defended your biological floor for ${totalFloorDays} days. This is not luck or inspiration; it is repeatable mechanical execution.`);
            }
            
            // Default fallback proof
            proofs.push(`PROOF: Your recovery OS is running. You have logged ${h.length} total active check-ins. Every log is evidence of agency.`);
            
            // Pick a random one from the generated proofs
            const index = Math.floor(Math.random() * proofs.length);
            return proofs[index];
        }

        function updateSimulatorProjections() {
            const slider = document.getElementById("input-sim-rate");
            if (!slider) return;
            const pct = parseInt(slider.value);
            
            // Display values
            const dailyTarget = Math.max(3, state.userAnchors.length);
            const projectedDaily = (dailyTarget * (pct / 100)).toFixed(1);
            
            const simSliderVal = document.getElementById("sim-slider-val");
            const simSliderPct = document.getElementById("sim-slider-pct");
            if (simSliderVal) simSliderVal.textContent = projectedDaily;
            if (simSliderPct) simSliderPct.textContent = pct + "%";
            
            const y1 = Math.round(365 * projectedDaily);
            const y3 = Math.round(365 * 3 * projectedDaily);
            const y5 = Math.round(365 * 5 * projectedDaily);
            
            const y1El = document.getElementById("sim-y1-count");
            const y3El = document.getElementById("sim-y3-count");
            const y5El = document.getElementById("sim-y5-count");
            
            if (y1El) y1El.textContent = y1.toLocaleString();
            if (y3El) y3El.textContent = y3.toLocaleString();
            if (y5El) y5El.textContent = y5.toLocaleString();
            
            // Calculate unlocks
            // - 30% Rate: "Survival Floor Secured"
            // - 50% Rate: "PRS Certification & entry-level peer work"
            // - 80% Rate: "Cincinnati Integration & lead coordinator"
            // - 95% Rate: "Master Recovery Partner"
            const milestones = [];
            if (pct >= 30) milestones.push('<span class="text-teal" style="font-weight:600;">Survival Floor Secured (30%)</span>');
            else milestones.push('<span class="text-muted">Survival Floor Secured (Requires 30%)</span>');
            
            if (pct >= 50) milestones.push('<span class="text-teal" style="font-weight:600;">PRS Certification & Entry-Level Peer Work (50%)</span>');
            else milestones.push('<span class="text-muted">PRS Certification & Entry-Level Peer Work (Requires 50%)</span>');
            
            if (pct >= 80) milestones.push('<span class="text-lavender" style="font-weight:600;">Cincinnati Integration & Lead Coordinator (80%)</span>');
            else milestones.push('<span class="text-muted">Cincinnati Integration & Lead Coordinator (Requires 80%)</span>');
            
            if (pct >= 95) milestones.push('<span class="text-orange" style="font-weight:600;">Master Recovery Partner (95%)</span>');
            else milestones.push('<span class="text-muted">Master Recovery Partner (Requires 95%)</span>');
            
            const milestoneEl = document.getElementById("sim-unlocked-milestones");
            if (milestoneEl) {
                milestoneEl.innerHTML = milestones.join("  |  ");
            }
        }

        function renderMomentumTab() {
            ensurePolarisState();
            
            // Update Living System State
            const domPatternEl = document.getElementById("audit-dominant-pattern");
            const hopeLvlEl = document.getElementById("audit-hope-level");
            const resRateEl = document.getElementById("audit-resilience-rate");
            const restartCountEl = document.getElementById("audit-restart-count");
            const narrativeEl = document.getElementById("audit-narrative-statement");
            
            if (domPatternEl) domPatternEl.textContent = state.dominantPattern || "Rhythm Collapse";
            
            const hopeTitles = {
                1: "Action is Possible",
                2: "Action Causes Results",
                3: "The Result Can Repeat",
                4: "Repetition Stabilizes Life",
                5: "Stability Supports a Future"
            };
            if (hopeLvlEl) {
                hopeLvlEl.textContent = `Level ${state.currentHopeLevel || 1} - ${hopeTitles[state.currentHopeLevel || 1]}`;
            }
            
            const resRate = calculateResilienceRate();
            if (resRateEl) resRateEl.textContent = `${resRate}%`;
            
            // Calculate slumps / restarts
            let restarts = 0;
            const h = state.history || [];
            for (let i = 0; i < h.length - 1; i++) {
                if (h[i].missed && (h[i+1].floorCompleted || h[i+1].mvdCompleted)) {
                    restarts++;
                }
            }
            if (restartCountEl) restartCountEl.textContent = restarts;
            
            if (narrativeEl) {
                narrativeEl.textContent = `"${generateNarrativeProof()}"`;
            }

            // Update Recovery Engine metrics
            const fnStatusEl = document.getElementById("audit-future-narrowing-status");
            const pcCountEl = document.getElementById("audit-collapse-count");
            const sdCountEl = document.getElementById("audit-startup-count");
            const rslCountEl = document.getElementById("audit-stop-loss-count");

            if (fnStatusEl) fnStatusEl.textContent = state.polaris.futureNarrowingActive ? "ACTIVE (HORIZON COMPRESSED)" : "INACTIVE";
            if (fnStatusEl) {
                if (state.polaris.futureNarrowingActive) {
                    fnStatusEl.style.color = "var(--accent-orange)";
                } else {
                    fnStatusEl.style.color = "var(--accent-teal)";
                }
            }
            if (pcCountEl) pcCountEl.textContent = state.polaris.possibilityCollapseInterventions || 0;
            if (sdCountEl) sdCountEl.textContent = (state.polaris.startupDragHistory || []).length;
            if (rslCountEl) rslCountEl.textContent = state.polaris.ruminationStopLossCount || 0;
            
            // Update Year Simulator
            updateSimulatorProjections();
            
            // Render 28-Day Momentum Grid
            renderMomentumGrid();
        }

        function renderMomentumGrid() {
            const grid = document.getElementById("momentum-grid");
            if (!grid) return;
            grid.innerHTML = "";
            
            const today = new Date();
            const colors = {
                unchecked: 'cell-unchecked',
                floor: 'cell-floor',
                full: 'cell-full',
                slump: 'cell-slump',
                emergency: 'cell-emergency'
            };
            
            for (let i = 27; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;
                
                const log = state.history.find(h => h.date === dateStr);
                let cellClass = colors.unchecked;
                let tooltip = `${dateStr}: Unchecked`;
                
                if (log) {
                    const energyLabel = log.energy ? log.energy.toUpperCase() : 'MEDIUM';
                    const completedCount = log.completed ? log.completed.length : 0;
                    tooltip = `${dateStr} [${energyLabel}]: ${completedCount} actions completed`;
                    
                    if (log.energy === 'collapse') {
                        if (log.floorCompleted || log.mvdCompleted) {
                            cellClass = colors.floor;
                            tooltip += " (Floor Win protected)";
                        } else {
                            cellClass = colors.emergency;
                            tooltip += " (Emergency active)";
                        }
                    } else {
                        if (log.floorCompleted) {
                            cellClass = colors.full;
                            tooltip += " (All completed)";
                        } else if (log.mvdCompleted) {
                            cellClass = colors.floor;
                            tooltip += " (MVD Floor protected)";
                        } else if (log.missed) {
                            cellClass = colors.slump;
                            tooltip += " (Slump Day)";
                        } else {
                            cellClass = colors.unchecked;
                        }
                    }
                }
                
                const cell = document.createElement("div");
                cell.className = `momentum-grid-cell ${cellClass}`;
                cell.title = tooltip;
                grid.appendChild(cell);
            }
        }

        function exportAnonymizedAudit() {
            ensurePolarisState();
            
            const resRate = calculateResilienceRate();
            let restarts = 0;
            const h = state.history || [];
            for (let i = 0; i < h.length - 1; i++) {
                if (h[i].missed && (h[i+1].floorCompleted || h[i+1].mvdCompleted)) {
                    restarts++;
                }
            }
            
            const totalFloorDays = h.filter(log => log.floorCompleted).length;
            const totalLogs = h.length;
            const lowEnergyLogs = h.filter(log => log.energy === 'low' || log.energy === 'collapse').length;
            
            let phqTrend = "";
            if (state.phq9History && state.phq9History.length > 0) {
                phqTrend = state.phq9History.map(p => `- **${p.date}**: Score ${p.score}/27 (${p.severity})`).join("\n");
            } else {
                phqTrend = "No assessments recorded yet.";
            }
            
            // Generate narrative statements list
            const narrativeList = [];
            const lowEnergySuccesses = h.filter(log => (log.energy === 'low' || log.energy === 'collapse') && (log.floorCompleted || log.mvdCompleted));
            if (lowEnergySuccesses.length > 0) {
                const lastLow = lowEnergySuccesses[lowEnergySuccesses.length - 1];
                narrativeList.push(`- **Action > Mood**: On ${lastLow.date}, energy was low, but floor anchors were maintained.`);
            }
            if (totalFloorDays >= 3) {
                narrativeList.push(`- **Consistency Proof**: Biological floor defended for ${totalFloorDays} days.`);
            }
            if (restarts > 0) {
                narrativeList.push(`- **Restart Speed**: Verified immediate return-to-floor following collapse events.`);
            }
            if (narrativeList.length === 0) {
                narrativeList.push("- No logs registered yet. Complete daily checklist items to generate narrative proofs.");
            }
            
            const md = `# Polaris 2.0 Recovery Audit & Co-Pilot Sync\nAnonymized progress tracker generated on ${new Date().toISOString().slice(0, 10)}.\n\n## 1. System Metrics\n- **Dominant Functional Pattern**: ${state.dominantPattern || 'Rhythm Collapse'}\n- **Current Hope Level**: Level ${state.currentHopeLevel || 1}\n- **Resilience Rating**: ${resRate}% (Restart success rate)\n- **Verified Streak Restarts**: ${restarts}\n- **Total Tracked Days**: ${totalLogs} days\n- **Low Energy / Collapse Days Managed**: ${lowEnergyLogs} days\n- **Future Narrowing**: ${state.polaris.futureNarrowingActive ? 'ACTIVE (Horizon compressed)' : 'INACTIVE'}\n- **Choice Overload Interventions**: ${state.polaris.possibilityCollapseInterventions || 0}\n- **Startup Drag Timer Count**: ${(state.polaris.startupDragHistory || []).length}\n- **Rumination Breakers Reset**: ${state.polaris.ruminationStopLossCount || 0}\n\n## 2. PHQ-9 Depressive Severity Trend\n${phqTrend}\n\n## 3. Narrative Verification Proofs\n${narrativeList.join("\n")}\n\n## 4. Substrate & Floor Configuration\n- **Morning Wake Target**: Wake on workdays by 7:30am (Circadian Lock)\n- **Active Anchors Count**: ${Math.max(3, state.userAnchors.length)} target anchors\n- **MVD Tasks**:\n  1. ${state.mvd[0]}\n  2. ${state.mvd[1]}\n  3. ${state.mvd[2]}\n\n---\n*Anonymity Statement: This report contains no personal identifiers (name, email, IP) and is formatted for copy-paste sharing into vaults (e.g., Obsidian, Grok, therapist session notebooks).*`;

            navigator.clipboard.writeText(md).then(() => {
                showToast("📋 Anonymized Audit copied to clipboard successfully!", "success");
            }).catch(err => {
                console.error("Failed to copy clipboard:", err);
                showToast("Failed to copy to clipboard. Please select manually.", "error");
            });
        }

        // ==========================================================
        // POLARIS INTERACTIVE CHAT & LLM CONNECTOR
        // ==========================================================

        async function loadLocalOpenAIKey(forceRefresh = false) {
            ensurePolarisState();
            if (state.polaris.openaiApiKey) {
                updateOpenAIKeyStatus("Custom Key Active");
                return state.polaris.openaiApiKey;
            }
            if (window.polarisRuntimeKey) {
                updateOpenAIKeyStatus("Loaded from local workspace file");
                return window.polarisRuntimeKey;
            }
            if (window.polarisLocalKeyProbeAttempted && !forceRefresh) {
                updateOpenAIKeyStatus("No key active. Set one below.");
                return "";
            }

            const isLocalRuntime = ["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol === "file:";
            if (!isLocalRuntime) {
                updateOpenAIKeyStatus("No key active. Set one below.");
                window.polarisLocalKeyProbeAttempted = true;
                return "";
            }

            window.polarisLocalKeyProbeAttempted = true;
            updateOpenAIKeyStatus("Checking key source...");
            try {
                const response = await fetch('knowledge/openai-api-key.txt');
                if (!response.ok) {
                    throw new Error("Key file not found on server");
                }

                const key = await response.text();
                const cleanKey = key.trim();
                if (cleanKey && cleanKey.startsWith("sk-")) {
                    window.polarisRuntimeKey = cleanKey;
                    updateOpenAIKeyStatus("Loaded from local workspace file");
                    return cleanKey;
                }

                updateOpenAIKeyStatus("Key file empty or invalid");
                return "";
            } catch (err) {
                console.log("Could not load local OpenAI key from file:", err.message);
                updateOpenAIKeyStatus("No key active. Set one below.");
                return "";
            }
        }

        async function ensurePolarisOpenAIKeyLoaded(forceRefresh = false) {
            ensurePolarisState();
            if (state.polaris.openaiApiKey) {
                updateOpenAIKeyStatus("Custom Key Active");
                return state.polaris.openaiApiKey;
            }
            if (window.polarisRuntimeKey) {
                updateOpenAIKeyStatus("Loaded from local workspace file");
                return window.polarisRuntimeKey;
            }

            return loadLocalOpenAIKey(forceRefresh);
        }

        function updateOpenAIKeyStatus(statusText) {
            const el = document.getElementById("openai-key-status");
            const inputEl = document.getElementById("input-openai-key");
            if (el) el.textContent = statusText;
            if (inputEl) {
                const key = state.polaris.openaiApiKey || window.polarisRuntimeKey;
                if (key) {
                    inputEl.value = "••••••••••••••••" + key.slice(-4);
                } else {
                    inputEl.value = "";
                }
            }
        }

        function saveOpenAIKey() {
            const inputEl = document.getElementById("input-openai-key");
            if (!inputEl) return;
            const key = inputEl.value.trim();
            ensurePolarisState();
            if (key) {
                if (key.startsWith("sk-")) {
                    state.polaris.openaiApiKey = key;
                    saveState();
                    showToast("OpenAI API Key saved successfully.", "success");
                    updateOpenAIKeyStatus("Custom Key Active");
                } else if (key.startsWith("••••")) {
                    showToast("No changes to API key.", "info");
                } else {
                    showToast("Invalid key format. Must start with 'sk-'.", "error");
                }
            } else {
                state.polaris.openaiApiKey = null;
                window.polarisRuntimeKey = null;
                window.polarisLocalKeyProbeAttempted = false;
                saveState();
                showToast("OpenAI API Key removed.", "info");
                updateOpenAIKeyStatus("No key active. Set one below.");
            }
        }

        function getOpenAIKey() {
            ensurePolarisState();
            return state.polaris.openaiApiKey || window.polarisRuntimeKey || "";
        }

        function renderPolarisChat() {
            const container = document.getElementById("polaris-chat-container");
            const messagesEl = document.getElementById("polaris-chat-messages");
            if (!container || !messagesEl) return;

            ensurePolarisState();

            if (state.polaris.enabled && state.polaris.profile.companionSkin) {
                container.classList.add("active");
                void ensurePolarisOpenAIKeyLoaded();
            } else {
                container.classList.remove("active");
                return;
            }

            const messages = state.polaris.chatHistory || [];
            if (messages.length === 0) {
                messagesEl.innerHTML = `
                    <div class="polaris-chat-message system">
                        <div class="polaris-chat-message-meta">
                            <span>Polaris (${state.polaris.profile.companionSkin})</span>
                            <span class="chat-time">${getFormattedTime()}</span>
                        </div>
                        Secure channel established. Ready to check functional alignment. Say anything to begin.
                    </div>
                `;
            } else {
                messagesEl.innerHTML = messages.map(msg => {
                    const senderName = msg.role === 'user' ? 'User' : `Polaris (${state.polaris.profile.companionSkin})`;
                    const cssClass = msg.role === 'user' ? 'user' : 'system';
                    const timeStr = msg.time || getFormattedTime();
                    return `
                        <div class="polaris-chat-message ${cssClass}">
                            <div class="polaris-chat-message-meta">
                                <span>${senderName}</span>
                                <span class="chat-time">${timeStr}</span>
                            </div>
                            ${escapeHTML(msg.content)}
                        </div>
                    `;
                }).join('');
            }
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }

        function getFormattedTime() {
            const now = new Date();
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            return `${hrs}:${mins}`;
        }

        function escapeHTML(text) {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        async function sendPolarisChatMessage() {
            const inputEl = document.getElementById("polaris-chat-input");
            if (!inputEl) return;
            const text = inputEl.value.trim();
            if (!text) return;

            inputEl.value = "";
            await addPolarisChatMessage('user', text);
            await ensurePolarisOpenAIKeyLoaded();

            const apiKey = getOpenAIKey();
            if (!apiKey) {
                await addPolarisChatMessage('system', "ERROR: OpenAI API Key not configured. Go to Settings (⚙) to configure a key, or add openai-api-key.txt to your local workspace knowledge folder.");
                return;
            }

            const typingEl = document.getElementById("polaris-chat-typing");
            if (typingEl) typingEl.classList.remove("hidden");
            const messagesEl = document.getElementById("polaris-chat-messages");
            if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;

            try {
                const response = await callPolarisLLM(text, apiKey);
                if (typingEl) typingEl.classList.add("hidden");
                await addPolarisChatMessage('system', response);
            } catch (error) {
                if (typingEl) typingEl.classList.add("hidden");
                console.error("Error communicating with Polaris companion:", error);
                await addPolarisChatMessage('system', `SYSTEM FAILURE: Connection interrupted. ${error.message}`);
            }
        }

        async function addPolarisChatMessage(role, content) {
            ensurePolarisState();
            if (!state.polaris.chatHistory) state.polaris.chatHistory = [];
            state.polaris.chatHistory.push({
                role,
                content,
                time: getFormattedTime()
            });

            if (state.polaris.chatHistory.length > 50) {
                state.polaris.chatHistory.shift();
            }

            saveState();
            renderPolarisChat();
        }

        async function sendQuickPolarisPrompt(promptLabel) {
            let userPromptText = "";
            if (promptLabel === 'Suggest next move') {
                userPromptText = "Analyze my current parameters and suggest the next minimum viable action block.";
            } else if (promptLabel === 'Check biological floor') {
                userPromptText = "Verify if my biological core is defended. Run diagnostic checklist.";
            } else if (promptLabel === 'Decompress shame spiral') {
                userPromptText = "Cognitive overload. Help me separate state from identity and decompress functional drag.";
            } else {
                userPromptText = promptLabel;
            }

            await addPolarisChatMessage('user', userPromptText);
            await ensurePolarisOpenAIKeyLoaded();

            const apiKey = getOpenAIKey();
            if (!apiKey) {
                await addPolarisChatMessage('system', "ERROR: OpenAI API Key not configured.");
                return;
            }

            const typingEl = document.getElementById("polaris-chat-typing");
            if (typingEl) typingEl.classList.remove("hidden");
            const messagesEl = document.getElementById("polaris-chat-messages");
            if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;

            try {
                const response = await callPolarisLLM(userPromptText, apiKey);
                if (typingEl) typingEl.classList.add("hidden");
                await addPolarisChatMessage('system', response);
            } catch (error) {
                if (typingEl) typingEl.classList.add("hidden");
                await addPolarisChatMessage('system', `SYSTEM FAILURE: Connection interrupted. ${error.message}`);
            }
        }

        async function callPolarisLLM(userText, apiKey) {
            const skin = state.polaris.profile.companionSkin || 'None';
            let personaGuideline = "";
            
            if (['🦇', '💀', '👻', '🧛', '🕷️', '🧟', '🐦‍⬛'].includes(skin)) {
                personaGuideline = "\n- COMPANION PERSONA: Adopt a dry, slightly gothic, dark humor, blunt but supportive tone. Embrace the dark mode and shadow aesthetic. Treat energy depletion with dark pragmatism.";
            } else if (['🦊', '🤖', '🛸', '👾'].includes(skin)) {
                personaGuideline = "\n- COMPANION PERSONA: Adopt a highly precise, technical, diagnostic terminal console tone. Refer to functions, states, and telemetry. You are a diagnostic supervisor checking the user's biological hardware.";
            } else if (['🦉', '🌲', '🐺'].includes(skin)) {
                personaGuideline = "\n- COMPANION PERSONA: Adopt a calm, grounded, organic wilderness guide tone. Refer to natural cycles, clean biological rhythms, daylight signals, and organic baselines.";
            } else if (['🐉', '🧙‍♂️', '🦄'].includes(skin)) {
                personaGuideline = "\n- COMPANION PERSONA: Adopt a sage-like, epic quest, mythic advisor tone. Frame the recovery process as an epic journey of incremental actions (runes/spells) to bypass dark magic (avoidance).";
            } else if (['🐈', '🧸', '☕'].includes(skin)) {
                personaGuideline = "\n- COMPANION PERSONA: Adopt a warm, comforting, hearth-like, low-friction gentle tone. Emphasize resting without self-punishment, cozy baseline safety, and slow soft transitions.";
            }

            const systemPrompt = `You are Polaris, a systems AI companion inside the "State Not Fate" depression recovery operating system. 
The user is interacting with you via a secure terminal. You are a calm, intelligent operating system, NOT a therapist, friend, or motivational coach.
Write in a blunt, precise, objective tone. Avoid positive fluff, sentimentality, or moralizing. Frame depression as a temporary systems failure and energy deconditioning, not a permanent identity.${personaGuideline}

CORE VOICE & COPY RULES:
- Use phrases like: "You're here.", "No catch-up.", "Pick the current state.", "We'll keep this small.", "Nothing reset.", "Start with the floor.", "Make it smaller.", "State, not fate.", "Action happened.", "Proof logged."
- AVOID these forbidden words/concepts: "journey", "empower", "thrive", "crush your goals", "be your best self", "try harder", "you should", "just", "back on track", "failed", "streak broken", "lost progress", "start over", "what's your why", "unlock your potential", "forced positivity", "therapy clichés".

SYSTEM PERSPECTIVE (From Docs):
- "Hope" is the brain's prediction of whether effort will lead to improvement. It is a system signal, not a mood.
- Defend the biological core first (sleep wake time, light, water, medications). Do not recommend complex scheduling or social exposure if the biological floor is unstable.
- Avoidance reduces anxiety for 10 minutes but deepens the depressive state for 10 hours. Act before you feel ready; momentum creates motivation.
- Progress pauses; it never resets. A gap day is data, not a verdict. Restart without punishment.

USER CURRENT TELEMETRY:
- Companion Selected: \${state.polaris.profile.companionSkin || 'None'}
- Current Energy State: \${(state.todayEnergy || 'medium').toUpperCase()}
- Dominant Functional Pattern: \${state.dominantPattern || 'Rhythm Collapse'}
- Current Hope Level: Level \${state.currentHopeLevel || 1}
- Total Proof Points: \${state.polaris.proof.total} pts
- Today's completed anchors: \${JSON.stringify(Object.keys(state.polaris.anchors.today || {}).filter(k => state.polaris.anchors.today[k]))}
- Today's incomplete anchors: \${JSON.stringify(Object.keys(state.polaris.anchors.today || {}).filter(k => !state.polaris.anchors.today[k]))}

CRITICAL CRISIS ROUTING:
If the user expresses immediate self-harm, suicidal ideation, or crisis: immediately output: "ALERT: This query resides outside the functional self-management layer. Please transition to emergency resources immediately. Call or text 988 (Crisis Lifeline) or go to the nearest emergency facility."

Your response should be under 100 words. Stick to objective mechanics, pattern diagnostics, or micro-action calibration. No fluff.`;

            const chatHistory = state.polaris.chatHistory || [];
            const apiMessages = [
                { role: "system", content: systemPrompt }
            ];

            const historySlice = chatHistory.slice(-20);
            historySlice.forEach(msg => {
                if (msg.content !== userText) {
                    apiMessages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
                }
            });

            apiMessages.push({ role: "user", content: userText });

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: apiMessages,
                    max_tokens: 180,
                    temperature: 0.5
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || `HTTP error ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        }

        // ==========================================================
        // RECOVERY ENGINE CONTROLLER INTERVENTIONS
        // ==========================================================

        function toggleFutureNarrowing() {
            ensurePolarisState();
            state.polaris.futureNarrowingActive = !state.polaris.futureNarrowingActive;
            
            if (state.polaris.futureNarrowingActive) {
                var activeTabBtn = document.querySelector('.nav-item.active');
                var activeTab = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : '';
                var hiddenTabs = ["progression", "documentcenter", "explorer"];
                if (hiddenTabs.includes(activeTab)) {
                    window.location.hash = "#/polaris";
                }
                showToast("Future Narrowing Active. Horizon compressed to today.", "info");
            } else {
                showToast("Time horizon expanded. Long-term projection models available.", "info");
            }
            
            saveState();
            renderPolarisTab();
        }

        function openPossibilityCollapseModal() {
            ensurePolarisState();
            const modal = document.getElementById('possibility-collapse-modal');
            if (modal) modal.classList.add('active');
        }

        function closePossibilityCollapseModal() {
            const modal = document.getElementById('possibility-collapse-modal');
            if (modal) modal.classList.remove('active');
        }

        function selectCollapseLane(lane) {
            ensurePolarisState();
            const textMap = {
                rhythm: "Circadian Lock (Wake window & light)",
                space: "Space Reset (Clear 1 surface / trash)",
                body: "Bio Floor (Water, meds, 60s stand)"
            };
            
            if (!state.userAnchors) state.userAnchors = [];
            const anchorId = 'anchor_collapse_' + Date.now();
            state.userAnchors.push({ id: anchorId, text: textMap[lane], active: true });
            
            state.polaris.possibilityCollapseInterventions = (state.polaris.possibilityCollapseInterventions || 0) + 1;
            state.polaris.proof.today += 1;
            state.polaris.proof.total += 1;
            state.polaris.proof.ledger.push({
                id: 'proof_' + Date.now(),
                source: 'possibility_collapse',
                points: 1,
                label: 'Possibility Collapse: ' + textMap[lane] + ' lane selected',
                createdAt: new Date().toISOString()
            });
            
            saveState();
            closePossibilityCollapseModal();
            renderPolarisTab();
            showToast('Bypassed paralysis. ' + textMap[lane] + ' added to anchors. Proof points earned.', 'success');
        }

        function openStartupDragModal() {
            ensurePolarisState();
            const modal = document.getElementById('startup-drag-modal');
            if (modal) {
                modal.classList.add('active');
                document.getElementById('startup-drag-setup').classList.remove('hidden');
                document.getElementById('startup-drag-timer-container').classList.add('hidden');
                document.getElementById('input-startup-task').value = '';
                document.getElementById('input-startup-step').value = '';
            }
        }

        function closeStartupDragModal() {
            const modal = document.getElementById('startup-drag-modal');
            if (modal) modal.classList.remove('active');
            if (window.startupTimerInterval) {
                clearInterval(window.startupTimerInterval);
                window.startupTimerInterval = null;
            }
        }

        function startStartupDragTimer() {
            const task = document.getElementById('input-startup-task').value.trim() || 'Blocked action';
            const step = document.getElementById('input-startup-step').value.trim() || 'First 10s step';
            
            document.getElementById('startup-drag-setup').classList.add('hidden');
            document.getElementById('startup-drag-timer-container').classList.remove('hidden');
            document.getElementById('startup-timer-instruction').innerHTML = `Task: <strong class="text-orange">${escapeHtml(task)}</strong><br>Do ONLY this: <em>${escapeHtml(step)}</em>`;
            
            let seconds = 10;
            const display = document.getElementById('startup-timer-display');
            display.textContent = seconds;
            
            document.getElementById('startup-timer-actions').classList.add('hidden');
            
            if (window.startupTimerInterval) clearInterval(window.startupTimerInterval);
            
            window.startupTimerInterval = setInterval(() => {
                seconds--;
                display.textContent = seconds;
                if (seconds <= 0) {
                    clearInterval(window.startupTimerInterval);
                    window.startupTimerInterval = null;
                    display.textContent = "DONE";
                    document.getElementById('startup-timer-actions').classList.remove('hidden');
                }
            }, 1000);
        }

        function verifyStartupDrag(success) {
            ensurePolarisState();
            if (success) {
                const task = document.getElementById('input-startup-task').value.trim() || 'Blocked action';
                const step = document.getElementById('input-startup-step').value.trim() || 'First 10s step';
                
                state.polaris.startupDragHistory.push({
                    id: 'startup_' + Date.now(),
                    task: task,
                    step: step,
                    date: getTodayString()
                });
                
                state.polaris.proof.today += 2;
                state.polaris.proof.total += 2;
                state.polaris.proof.ledger.push({
                    id: 'proof_' + Date.now(),
                    source: 'startup_drag',
                    points: 2,
                    label: 'Startup Drag Bypass: ' + task,
                    createdAt: new Date().toISOString()
                });
                
                showToast('Action initiated. 2 proof points earned. Deconditioning success.', 'success');
            } else {
                showToast('Intervention cancelled.', 'info');
            }
            saveState();
            closeStartupDragModal();
            renderPolarisTab();
        }

        function openRuminationStopLossModal() {
            ensurePolarisState();
            const modal = document.getElementById('rumination-stop-loss-modal');
            if (modal) {
                modal.classList.add('active');
                advanceStopLossStep(1);
            }
        }

        function closeRuminationStopLossModal() {
            const modal = document.getElementById('rumination-stop-loss-modal');
            if (modal) modal.classList.remove('active');
        }

        function advanceStopLossStep(step) {
            document.getElementById('stop-loss-step-1').classList.add('hidden');
            document.getElementById('stop-loss-step-2').classList.add('hidden');
            document.getElementById('stop-loss-step-3').classList.add('hidden');
            
            document.getElementById('stop-loss-step-' + step).classList.remove('hidden');
        }

        function completeStopLoss() {
            ensurePolarisState();
            state.polaris.ruminationStopLossCount = (state.polaris.ruminationStopLossCount || 0) + 1;
            
            state.polaris.proof.today += 1;
            state.polaris.proof.total += 1;
            state.polaris.proof.ledger.push({
                id: 'proof_' + Date.now(),
                source: 'rumination_stop_loss',
                points: 1,
                label: 'Rumination Stop-Loss triggered & grounded',
                createdAt: new Date().toISOString()
            });
            
            saveState();
            closeRuminationStopLossModal();
            renderPolarisTab();
            showToast('Stop-loss triggered. Breaker switch activated. Rumination intercepted.', 'success');
        }

        window.saveOpenAIKey = saveOpenAIKey;
        window.sendPolarisChatMessage = sendPolarisChatMessage;
        window.sendQuickPolarisPrompt = sendQuickPolarisPrompt;
        window.toggleFutureNarrowing = toggleFutureNarrowing;
        window.openPossibilityCollapseModal = openPossibilityCollapseModal;
        window.closePossibilityCollapseModal = closePossibilityCollapseModal;
        window.selectCollapseLane = selectCollapseLane;
        window.openStartupDragModal = openStartupDragModal;
        window.closeStartupDragModal = closeStartupDragModal;
        window.startStartupDragTimer = startStartupDragTimer;
        window.verifyStartupDrag = verifyStartupDrag;
        window.openRuminationStopLossModal = openRuminationStopLossModal;
        window.closeRuminationStopLossModal = closeRuminationStopLossModal;
        window.advanceStopLossStep = advanceStopLossStep;
        window.completeStopLoss = completeStopLoss;
        window.showTab = showTab;
        window.showScreen = showScreen;
        window.answerCompanionQuestion = answerCompanionQuestion;
        window.removeGratitudeEntry = removeGratitudeEntry;
        window.removeThoughtCorrection = removeThoughtCorrection;
        window.deleteDocPhqEntry = deleteDocPhqEntry;
        window.removeCustomTask = removeCustomTask;
        window.addTomorrowRecallAsAnchor = addTomorrowRecallAsAnchor;
        window.dismissTomorrowRecall = dismissTomorrowRecall;
        window.togglePolaris = togglePolaris;
        window.exportAnonymizedAudit = exportAnonymizedAudit;
        window.resetChecklistToDefaults = resetChecklistToDefaults;
        window.filterDocumentExplorer = filterDocumentExplorer;

        // ==========================================================
        // POLARIS EXPERIENCE GROWTH SYSTEM v1
        // Recovery labor made visible. No gamification, no hype,
        // no levels, no badges, no streaks, no motivational language.
        // Derives all signals from existing proof/history — zero duplication.
        // ==========================================================

        // ---- Growth stages (adult names, thresholds in proof points) ----
        const POLARIS_GROWTH_STAGES = [
            {
                id: 'grounding',
                name: 'Grounding',
                threshold: 0,
                description: 'Actions happening. Proof accumulating.'
            },
            {
                id: 'stabilizing',
                name: 'Stabilizing',
                threshold: 10,
                description: 'Repeated action. Pattern beginning.'
            },
            {
                id: 'consolidating',
                name: 'Consolidating',
                threshold: 30,
                description: 'Consistency across varied states.'
            },
            {
                id: 'extending',
                name: 'Extending',
                threshold: 75,
                description: 'Recovery labor persisting after collapse.'
            },
            {
                id: 'integrating',
                name: 'Integrating',
                threshold: 150,
                description: 'Sustained continuity. Growth through repeated action.'
            }
        ];

        // ---- 5 constellation dimensions mapped to data sources ----
        // regulation → floor_wins + rumination_stop_loss
        // action     → anchor completions
        // restart    → post-missed days with action
        // continuity → days with any proof across the last 28d
        // expansion  → startup_drag + possibility_collapse
        const PGL_DIMS = [
            { key: 'regulation', label: 'Regulation',  color: 'hsl(40,100%,55%)' },
            { key: 'action',     label: 'Action',      color: 'hsl(180,100%,50%)' },
            { key: 'restart',    label: 'Restart',     color: 'hsl(300,100%,65%)' },
            { key: 'continuity', label: 'Continuity',  color: 'hsl(200,80%,55%)' },
            { key: 'expansion',  label: 'Expansion',   color: 'hsl(160,70%,50%)' }
        ];

        // ---- Ensure polaris.growth substate ----
        function ensurePolarisGrowthState() {
            ensurePolarisState();
            if (!state.polaris.growth) {
                state.polaris.growth = {
                    schemaVersion: 1,
                    // signals are always derived fresh — not stored
                };
            }
            if (!state.polaris.growth.schemaVersion) {
                state.polaris.growth.schemaVersion = 1;
            }
        }

        // ---- Derive signals from existing proof + history ----
        // Returns an object with normalized [0..1] scores for each dimension
        // and raw counts. No PHQ-9, no safety, no crisis text touched.
        function derivePGLSignals() {
            ensurePolarisGrowthState();
            const ledger = (state.polaris && state.polaris.proof && state.polaris.proof.ledger) || [];
            const history = state.history || [];
            const today = new Date();

            // --- action: anchor proof entries ---
            const anchorCount = ledger.filter(function(e) {
                return e && e.source === 'anchor';
            }).length;

            // --- regulation: floor wins + rumination stop loss ---
            const regulationCount = ledger.filter(function(e) {
                return e && (e.source === 'floor_win' || e.source === 'rumination_stop_loss');
            }).length;

            // --- restart: after a missed-day log, how many times was there action the next day? ---
            var restartCount = 0;
            for (var i = 0; i < history.length - 1; i++) {
                if (history[i] && history[i].missed) {
                    var nextLog = history[i + 1];
                    if (nextLog && (nextLog.floorCompleted || nextLog.mvdCompleted ||
                        (nextLog.completed && nextLog.completed.length > 0))) {
                        restartCount++;
                    }
                }
            }

            // --- continuity: days with any proof entry in last 28 days ---
            var activeDays28 = new Set();
            ledger.forEach(function(e) {
                if (!e || !e.createdAt) return;
                var d = new Date(e.createdAt);
                var diffMs = today - d;
                var diffDays = diffMs / 86400000;
                if (diffDays >= 0 && diffDays < 28) {
                    activeDays28.add(e.createdAt.slice(0, 10));
                }
            });
            history.forEach(function(log) {
                if (!log || !log.date) return;
                var d = new Date(log.date + 'T00:00:00');
                var diffMs = today - d;
                var diffDays = diffMs / 86400000;
                if (diffDays >= 0 && diffDays < 28 &&
                    (log.floorCompleted || log.mvdCompleted ||
                     (log.completed && log.completed.length > 0))) {
                    activeDays28.add(log.date);
                }
            });
            var continuityCount = activeDays28.size;

            // --- expansion: startup_drag + possibility_collapse ---
            var expansionCount = ledger.filter(function(e) {
                return e && (e.source === 'startup_drag' || e.source === 'possibility_collapse');
            }).length;

            // Normalize to 0..1 with soft caps
            function norm(val, cap) {
                return Math.min(1, val / cap);
            }

            return {
                raw: {
                    regulation: regulationCount,
                    action:     anchorCount,
                    restart:    restartCount,
                    continuity: continuityCount,
                    expansion:  expansionCount
                },
                scores: {
                    regulation: norm(regulationCount, 20),
                    action:     norm(anchorCount, 50),
                    restart:    norm(restartCount, 10),
                    continuity: norm(continuityCount, 20),
                    expansion:  norm(expansionCount, 15)
                }
            };
        }

        // ---- Determine current growth stage from total proof ----
        function getPGLCurrentStage() {
            ensurePolarisGrowthState();
            var total = (state.polaris && state.polaris.proof && state.polaris.proof.total) || 0;
            var stage = POLARIS_GROWTH_STAGES[0];
            for (var i = POLARIS_GROWTH_STAGES.length - 1; i >= 0; i--) {
                if (total >= POLARIS_GROWTH_STAGES[i].threshold) {
                    stage = POLARIS_GROWTH_STAGES[i];
                    break;
                }
            }
            // Progress within this stage toward next
            var stageIdx = POLARIS_GROWTH_STAGES.indexOf(stage);
            var nextStage = POLARIS_GROWTH_STAGES[stageIdx + 1];
            var progress = 1; // at final stage
            if (nextStage) {
                var rangeStart = stage.threshold;
                var rangeEnd = nextStage.threshold;
                progress = Math.min(1, (total - rangeStart) / (rangeEnd - rangeStart));
            }
            return { stage: stage, stageIdx: stageIdx, progress: progress, total: total };
        }

        // ---- Build pentagon SVG constellation ----
        // 5 vertices around a circle, scaled by dimension score
        function buildConstellationSVG(scores) {
            var W = 140, H = 140, cx = 70, cy = 70, maxR = 55;
            var count = PGL_DIMS.length;
            // Vertex positions (top vertex at -90deg, clockwise)
            function vertex(i, r) {
                var angle = (Math.PI * 2 * i / count) - (Math.PI / 2);
                return [
                    cx + r * Math.cos(angle),
                    cy + r * Math.sin(angle)
                ];
            }

            var svgParts = [
                '<svg class="pgl-constellation-svg" width="' + W + '" height="' + H + '" role="img" aria-hidden="true" viewBox="0 0 ' + W + ' ' + H + '">'
            ];

            // Guide ring (max extent)
            var guidePts = PGL_DIMS.map(function(_, i) { return vertex(i, maxR); });
            svgParts.push(
                '<polygon points="' + guidePts.map(function(p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') +
                '" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>'
            );

            // Mid ring
            var midPts = PGL_DIMS.map(function(_, i) { return vertex(i, maxR * 0.5); });
            svgParts.push(
                '<polygon points="' + midPts.map(function(p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') +
                '" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>'
            );

            // Spokes
            PGL_DIMS.forEach(function(_, i) {
                var outer = vertex(i, maxR);
                svgParts.push(
                    '<line x1="' + cx + '" y1="' + cy + '" x2="' + outer[0].toFixed(1) + '" y2="' + outer[1].toFixed(1) +
                    '" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>'
                );
            });

            // Data polygon
            var dataPts = PGL_DIMS.map(function(dim, i) {
                return vertex(i, maxR * (scores[dim.key] || 0));
            });
            svgParts.push(
                '<polygon points="' + dataPts.map(function(p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') +
                '" fill="rgba(0,255,200,0.07)" stroke="rgba(0,255,200,0.35)" stroke-width="1.5" stroke-linejoin="round"/>'
            );

            // Vertex dots (colored per dimension)
            PGL_DIMS.forEach(function(dim, i) {
                var score = scores[dim.key] || 0;
                var pos = vertex(i, maxR * score);
                var r = score > 0 ? 4 : 2;
                var opacity = score > 0 ? 1 : 0.25;
                svgParts.push(
                    '<circle cx="' + pos[0].toFixed(1) + '" cy="' + pos[1].toFixed(1) +
                    '" r="' + r + '" fill="' + dim.color + '" opacity="' + opacity + '"/>'
                );
            });

            // Center dot
            svgParts.push('<circle cx="' + cx + '" cy="' + cy + '" r="2" fill="rgba(255,255,255,0.3)"/>');

            svgParts.push('</svg>');
            return svgParts.join('');
        }

        // ---- Build proof timeline (last N entries, max 60) ----
        function buildProofTimeline() {
            var ledger = (state.polaris && state.polaris.proof && state.polaris.proof.ledger) || [];
            if (ledger.length === 0) {
                return '<span class="pgl-pt-empty">No proof entries yet. Complete an anchor or log a Floor Win.</span>';
            }
            var recent = ledger.slice(-60);
            return recent.map(function(e) {
                if (!e) return '';
                var src = e.source || 'other';
                var label = e.label || src;
                var date = e.createdAt ? e.createdAt.slice(0, 10) : '';
                return '<div class="pgl-pt-dot" data-src="' + src + '" ' +
                       'tabindex="0" role="img" ' +
                       'aria-label="' + label.replace(/"/g, '') + ' (' + date + ')' + '" ' +
                       'title="' + label.replace(/"/g, '') + ' — ' + date + '"></div>';
            }).join('');
        }

        // ---- Build state-pattern strip (last 28 history days) ----
        // Each cell height represents actions completed; color = energy state
        // Completely avoids PHQ-9, crisis, or safety fields
        function buildStatePatternStrip() {
            var history = state.history || [];
            // Take last 28 with any record; pad earlier with empty
            var today = new Date();
            var cells = [];
            for (var i = 27; i >= 0; i--) {
                var d = new Date(today);
                d.setDate(today.getDate() - i);
                var yyyy = d.getFullYear();
                var mm = String(d.getMonth() + 1).padStart(2, '0');
                var dd = String(d.getDate()).padStart(2, '0');
                var dateStr = yyyy + '-' + mm + '-' + dd;
                var log = history.find(function(h) { return h && h.date === dateStr; });
                cells.push({ dateStr: dateStr, log: log || null });
            }

            var energyColor = {
                high: 'hsl(180,100%,45%)',
                medium: 'hsl(300,80%,55%)',
                low: 'hsl(40,100%,55%)',
                collapse: 'hsl(0,80%,60%)'
            };
            var DEFAULT_HEIGHT = 6;
            var MAX_HEIGHT = 28;

            return cells.map(function(c) {
                if (!c.log) {
                    return '<div class="pgl-ps-cell" style="height:' + DEFAULT_HEIGHT + 'px;background:rgba(255,255,255,0.04);" ' +
                           'title="' + c.dateStr + ': no entry" aria-label="' + c.dateStr + ': no entry" tabindex="0" role="img"></div>';
                }
                var log = c.log;
                var completedCount = (log.completed ? log.completed.length : 0) +
                                     (log.floorCompleted ? 1 : 0) +
                                     (log.mvdCompleted ? 1 : 0);
                var heightPx = Math.max(DEFAULT_HEIGHT, Math.min(MAX_HEIGHT, DEFAULT_HEIGHT + completedCount * 4));
                var energy = log.energy || 'medium';
                var color = energyColor[energy] || energyColor.medium;
                var opacity = log.missed ? 0.2 : 0.65;
                var label = c.dateStr + ': ' + (log.energy ? log.energy : '') +
                            (completedCount > 0 ? ', ' + completedCount + ' actions' : '') +
                            (log.missed ? ', missed' : '');
                return '<div class="pgl-ps-cell" style="height:' + heightPx + 'px;background:' + color + ';opacity:' + opacity + ';" ' +
                       'title="' + label + '" aria-label="' + label + '" tabindex="0" role="img"></div>';
            }).join('');
        }

        // ---- Build legend HTML ----
        function buildConstellationLegend(rawSignals) {
            return PGL_DIMS.map(function(dim) {
                var rawVal = rawSignals[dim.key] || 0;
                return '<div class="pgl-legend-row">' +
                       '<div class="pgl-legend-dot" style="background:' + dim.color + ';"></div>' +
                       '<span>' + dim.label + '</span>' +
                       '<span style="margin-left:auto;color:var(--text-muted);font-size:0.72rem;">' + rawVal + '</span>' +
                       '</div>';
            }).join('');
        }

        // ---- Build accessible text summary ----
        function buildPGLTextSummary(stageInfo, signals) {
            var total = stageInfo.total;
            var stage = stageInfo.stage;
            var r = signals.raw;
            var parts = [];

            parts.push(total + ' proof actions accumulated. Stage: ' + stage.name + '.');
            if (r.action > 0) parts.push(r.action + ' anchor' + (r.action === 1 ? '' : 's') + ' completed.');
            if (r.regulation > 0) parts.push(r.regulation + ' regulation action' + (r.regulation === 1 ? '' : 's') + ' (floor wins + stop-loss).');
            if (r.restart > 0) parts.push(r.restart + ' restart' + (r.restart === 1 ? '' : 's') + ' after a missed day.');
            if (r.continuity > 0) parts.push(r.continuity + ' active day' + (r.continuity === 1 ? '' : 's') + ' in the last 28.');
            if (r.expansion > 0) parts.push(r.expansion + ' expansion action' + (r.expansion === 1 ? '' : 's') + ' (startup drag + possibility collapse).');

            return parts.join(' ');
        }

        // ---- Main render function ----
        function renderPolarisGrowthLayer() {
            var mount = document.getElementById('polaris-growth-layer');
            if (!mount) return;

            // Safety gate: do not render if Polaris is not enabled
            ensurePolarisGrowthState();
            if (!state.polaris || !state.polaris.enabled) {
                mount.innerHTML = '';
                return;
            }

            var stageInfo = getPGLCurrentStage();
            var signals = derivePGLSignals();
            var progressPct = Math.round(stageInfo.progress * 100);
            var totalPts = stageInfo.total;

            var nextStage = POLARIS_GROWTH_STAGES[stageInfo.stageIdx + 1];
            var progressBarTitle = nextStage
                ? (progressPct + '% toward ' + nextStage.name + ' (' + (nextStage.threshold - totalPts) + ' pts remaining)')
                : (totalPts + ' pts — ' + stageInfo.stage.name);

            var html = [
                '<div class="glass-card" style="background:rgba(0,0,0,0.2);border-color:rgba(0,255,200,0.1);padding:1rem;margin-bottom:1rem;">',

                // ---- Stage header ----
                '<div class="pgl-stage-header">',
                '<span class="pgl-stage-name">' + stageInfo.stage.name + '</span>',
                '<span class="pgl-stage-desc">' + stageInfo.stage.description + '</span>',
                '<span style="font-size:0.72rem;color:var(--text-muted);white-space:nowrap;">' + totalPts + ' pts</span>',
                '</div>',

                // Progress bar toward next stage
                '<div class="pgl-stage-progress-bar" title="' + progressBarTitle + '" aria-label="' + progressBarTitle + '">',
                '<div class="pgl-stage-progress-fill" style="width:' + progressPct + '%"></div>',
                '</div>',

                // ---- Constellation ----
                '<div class="pgl-constellation-wrap">',
                buildConstellationSVG(signals.scores),
                '<div class="pgl-constellation-legend">',
                '<div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:0.4rem;">Recovery dimensions</div>',
                buildConstellationLegend(signals.raw),
                '</div>',
                '</div>',

                // ---- Proof Timeline ----
                '<div class="pgl-section-label">Proof timeline (recent ' + Math.min(60, ((state.polaris.proof && state.polaris.proof.ledger && state.polaris.proof.ledger.length) || 0)) + ' actions)</div>',
                '<div class="pgl-proof-timeline" role="list" aria-label="Proof timeline">',
                buildProofTimeline(),
                '</div>',

                // ---- State-Pattern Strip ----
                '<div class="pgl-section-label">State pattern — last 28 days</div>',
                '<div class="pgl-pattern-strip" role="list" aria-label="State pattern strip, last 28 days">',
                buildStatePatternStrip(),
                '</div>',

                // ---- Text summary (screen-reader accessible, also visible) ----
                '<div class="pgl-text-summary" aria-live="polite">',
                buildPGLTextSummary(stageInfo, signals),
                '</div>',

                '</div>'
            ].join('');

            mount.innerHTML = html;
        }

        // Export so other callers can trigger growth layer re-render
        window.renderPolarisGrowthLayer = renderPolarisGrowthLayer;

        window.PolarisUI = {
            render: renderPolarisTab,
            toggle: togglePolaris
        };

        // ==========================================================
        // SUICIDE & SUICIDE PREVENTION COMPENDIUM & COURSE MODULES
        // ==========================================================

        const COURSE_MODULES = [


            {
                id: 1,
                title: "Module 1: Suicidal Thinking as Systems Failure",
                objective: "Understand suicidal thoughts as a systems failure rather than a moral choice or individual failure.",
                psychology: "Suicide is not a single act of will or a simple outcome. It is the product of risk stacks, state narrowing, social conditions, and failures in supportive human networks. Framing suicide as a systems problem lets us design environmental buffers and accessible help pathways rather than asking a suffering person to perform heroic cognitive recovery alone.",
                exercise: "Reflect on how shifting from a moral choice frame to a systems failure frame changes how you view suicidal thoughts, and note any stigmas you want to reject.",
                placeholder: "Shifting the frame to a systems failure perspective makes me realize..."
            },
            {
                id: 2,
                title: "Module 2: Depression, Narrowing & Startup Failure",
                objective: "Recognize how depression compromises startup energy, reward prediction, and decision range.",
                psychology: "Depression is not just sadness; it is a systems failure that damages startup, corrupts reward prediction, and shrinks options. When startup is damaged, normal advice (like 'just reach out') becomes structurally impossible. We build recovery around small, believable, low-friction floor wins to slowly restore the brain's action-to-outcome prediction loop.",
                exercise: "Identify a task that feels too heavy right now. Write down a minimum viable version of that task with a zero startup cost (e.g. drinking one glass of water or standing outside for 10 seconds).",
                placeholder: "The minimum viable action I will take with near-zero startup cost is..."
            },
            {
                id: 3,
                title: "Module 3: Warning Signs vs. Chronic Risk Stacks",
                objective: "Distinguish acute warning signs requiring immediate intervention from background risk factors.",
                psychology: "Warning signs (such as giving away possessions, talking about being a burden, or seeking means) indicate immediate danger. Risk factors (such as depression history, isolation, or chronic pain) build a background risk stack. Separating the two keeps us from panic while ensuring we act decisively when acute signs appear.",
                exercise: "Look at the NIMH warning signs list in the compendium tables. Note the difference between a background risk factor you carry and an acute warning sign that means you need to call 988.",
                placeholder: "For me, a background risk factor is __, but an acute warning sign that means call 988 is..."
            },
            {
                id: 4,
                title: "Module 4: Protective Factors & Connectedness",
                objective: "Map the individual, relationship, and community buffers that protect against collapse.",
                psychology: "Connectedness is a load-bearing protective factor. Feeling accepted and supported reduces suicidality. The Trevor Project's survey data shows that community acceptance and basic respect (such as pronoun respect and affirming spaces) reduce suicide attempts among vulnerable youth to less than one-third of the baseline rate.",
                exercise: "List three connections or 'reasons for living' (family, pets, creative projects, or community groups) that act as protective anchors in your life.",
                placeholder: "My three protective anchors and reasons for living are..."
            },
            {
                id: 5,
                title: "Module 5: How to Ask Directly and Listen Safely",
                objective: "Learn the rules of safe dialogue: ask directly about suicide and listen without judgment.",
                psychology: "Asking directly 'Are you thinking about suicide?' does not implant the idea; it provides a safe valve. When someone discloses distress, your role is validation and safety mapping, not solving their entire life. Do not argue or lecture—focus entirely on reducing danger for the next hour and routing to professional care.",
                exercise: "Practice writing out a direct question you would use to ask someone you are worried about if they are thinking of suicide, focusing on clear, non-evasive language.",
                placeholder: "If I am worried about someone, I will ask them directly: ..."
            },
            {
                id: 6,
                title: "Module 6: Collaborative Safety Planning & Means Safety",
                objective: "Create a written safety plan and understand the critical role of lethal means safety.",
                psychology: "In a crisis, cognitive narrowing makes safety planning from memory impossible. A written safety plan lists warning signs, coping tools, contacts, and emergency routing. Temporarily removing access to lethal means (firearms, stockpiled medications) is the single most effective way to prevent self-harm during an acute window.",
                exercise: "Go to the Support Plan subtab and complete or update your local Safety Plan. Write a reflection on why restricting access to means makes sense as a collaborative safety step.",
                placeholder: "Updating my safety plan and restricting access to means helps because..."
            },
            {
                id: 7,
                title: "Module 7: Aftercare, Transition & Caring Contacts",
                objective: "Evaluate the role of caring contacts and the vulnerability of care transition windows.",
                psychology: "The period immediately following hospital discharge, ED visits, or care drop-out is a high-risk window. Motto's research proved that brief, non-demanding caring check-ins reduce suicide mortality. Modern RCTs show these contacts keep people engaged with support networks. Continuity is prevention.",
                exercise: "Draft a brief, non-demanding message you can send to someone who is struggling, requiring absolutely no response from them.",
                placeholder: "My non-demanding check-in script: ..."
            },
            {
                id: 8,
                title: "Module 8: Community Postvention & Contagion Mitigation",
                objective: "Learn postvention principles to stabilize communities and support survivors after a loss.",
                psychology: "Suicide loss survivors are themselves at elevated risk. Postvention is the planned, organized response to support those grieving and stabilize the environment. It requires safe communication: avoiding sensationalism, omitting graphic details of the method, and focusing on healing and help-seeking resources.",
                exercise: "Review the Action Alliance postvention guidelines. Write down how you would share news of a crisis in your workplace or school without romanticizing or providing graphic detail.",
                placeholder: "To communicate responsibly after a loss, I will ensure that..."
            },
            {
                id: 9,
                title: "Module 9: Culturally Grounded Prevention & Equity",
                objective: "Recognize how systemic stress impacts mental health and learn to value community-specific buffers.",
                psychology: "Suicide risk is shaped by systemic discrimination, historical trauma, and social exclusion. Generic clinical frameworks can fail if they ignore these stressors. Tribal prevention (IHS) and community-specific networks succeed by drawing on cultural identity, storytelling, peer networks, and community acceptance.",
                exercise: "Identify a community-specific or culturally grounded protective factor that feels meaningful to you, and how it can be integrated into your local support stack.",
                placeholder: "A culturally grounded protective factor that supports my stability is..."
            },
            {
                id: 10,
                title: "Module 10: Product Boundaries & Safe Agent Interaction",
                objective: "Align your daily recovery tools with public health safety boundaries and understand system limits.",
                psychology: "State Not Fate is a peer support and routine-tracking scaffold, not a clinic. It cannot diagnose or predict behavior. Understanding these boundaries keeps users safe from false expectations. If a crisis occurs, the system must immediately hand off to human support structures (like 988).",
                exercise: "Review the Product Boundaries declaration. Write a reflection on why it is critical for an AI or digital tool to know its limits and avoid pretending to have clinical authority.",
                placeholder: "Acknowledging that State Not Fate is an adjunctive tool rather than a clinic is important because..."
            },
            {
                id: 11,
                title: "Module 11: Childhood Trauma & The Chronic Risk Stack",
                objective: "Identify how early adversity builds a chronic vulnerability stack.",
                psychology: "Early trauma (like childhood surgeries or extreme religious alienation) acts as a chronic risk stack, significantly lowering baseline capacity to handle stress. When triggered, the system defaults to isolation or numbing behaviors (like forced alcohol schedules) as maladaptive buffers against perceived existential failure.",
                exercise: "List one chronic risk factor from your past that still drains your capacity today, and one new physical anchor you can implement to offset it.",
                placeholder: "Reflect on your chronic risk stack here..."
            },
            {
                id: 12,
                title: "Module 12: Dancing in the Rain - Acceptance & Capacity",
                objective: "Shift from trying to stop the depression to managing capacity within it.",
                psychology: "Depression often creates a thick 'stink cloud' of nihilism and perceived inferiority, especially when compounded by uncontrollable physical losses. Survival requires pivoting from 'stopping the rain' to 'dancing in it'—accepting the unchangeable and finding micro-anchors to rebuild a sense of purpose.",
                exercise: "Identify one aspect of your current situation that is completely outside your control. How can you show up with a small win (like a smile or caring for a pet) despite it?",
                placeholder: "Reflect on acceptance and micro-anchors here..."
            }

        ];

        const COMPENDIUM_TABLES = {
            table1: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Group / Factor</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Suicide Risk Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Under 25</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">High baseline risk. Self-injury or suicidal behavior occurs in up to 52% of adolescents with depression. Increased risk of antidepressant-induced suicidal thoughts/behaviors in first months of treatment.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Over 65</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Meta-analyses show a <em>reduced</em> risk of antidepressant-induced suicidal behavior compared to younger cohorts.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Perinatal & Postpartum</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Leading cause of perinatal death. Risk peaks during severe depression, postpartum psychosis, or mania. Must differentiate passive intrusive thoughts (unwanted, causing mother distress/shame) from high-risk active suicidal/psychotic thoughts.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Clinical Predictors</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Key predictors of attempts: history of previous attempts, severe depression, prominent psychotic symptoms, severity of hopelessness, and sleep disturbances (insomnia or nightmares). Additional risks: poor social support, male gender, family history of psychiatric disorders, impulsivity, substance misuse.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table2: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Instrument</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Description and Clinical Utility</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">C-SSRS</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Gold standard. Comprehensively evaluates the presence, intensity, frequency, and lethality of suicidal ideation and behavior.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">ASQ</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Brief 4-item self-report tool valid across medical settings and age groups. Includes an "acuity" question to determine if risk is acute.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Beck's SIS</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">15-item scale evaluating subjective intent and objective planning/circumstances of the patient's most recent suicide attempt.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">PHQ-9 (9th Item)</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Asks about passive thoughts of death or self-injury. High predictive utility for immediate and long-term suicide attempts.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table3: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Strategy</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Clinical Directives and Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Safety Planning</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">For all depressed patients, collaboratively build safety plans (e.g. Stanley Brown Safety Plan) and provide crisis resources (988). Seek immediate emergency consult if active plan, escalating ideation, or psychotic features occur.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Safe Prescribing</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Do not withhold treatment from suicidal patients, but strictly limit the supply of prescribed medications to reduce overdose toxicity risk. SSRIs are preferred over TCAs (Tricyclic Antidepressants) for patients at risk.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Monitoring Windows</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Heightened vigilance for sudden mood/behavioral changes during high-risk periods: month before starting an antidepressant, first 1-4 weeks after initiation, during dose changes, and month after discontinuation.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Postpartum Psychosis</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Treated as a psychiatric emergency due to high risk of maternal suicide and infanticide. A patient exhibiting signs (delusions, severe agitation, mood lability) must never be left alone with the baby.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table4: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Treatment</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Efficacy and Application for Suicidality</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Esketamine / Ketamine</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Level 1 evidence for rapidly reducing acute suicidality (within hours to days). Esketamine (Spravato) nasal spray is FDA-approved for MDD with acute suicidal ideation/behavior.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Lithium</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Level 1 evidence for unipolar and bipolar depression. Demonstrates superior reduction of suicidal behavior and ideation compared to placebo.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">ECT</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Treatment of choice for severe, life-threatening suicidality, psychotic depression, or rapid safety needs. Shorter resolution time than oral medications.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">SAINT TMS</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Accelerated fMRI-guided TMS compresses 6 weeks into 5 days. Open-label study showed 100% of participants reported complete acute resolution of suicidal thoughts at 1 month.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">NRX-101 (Pipeline)</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Combination of D-cycloserine and lurasidone. FDA Phase 2/3 trials evaluating efficacy for severe depression and acute suicidality in conjunction with TMS.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Adjunctive Anxiolytics</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Short-term (1-4 weeks) use can safely manage initial antidepressant-induced arousal, anxiety, or agitation, which can otherwise aggravate suicide risk.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table5: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Modality</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Level of Evidence & Impact on Suicidality</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">CBT-SP</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);"><strong>Level 1 Evidence.</strong> Targets maladaptive cognitive processes and impulsivity. Reduces suicide attempts by 50% in patients with recent attempts.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">DBT</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);"><strong>Level 1 Evidence.</strong> Combines problem-solving, emotional regulation, distress tolerance, and phone coaching. Highly effective for high-frequency ideation and attempts.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">PST</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);"><strong>Level 1 (attempts) / Level 2 (ideation).</strong> Equips patients to solve problems systematically and reduces impulsivity. Effective at preventing reattempts.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">IPT</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);"><strong>Level 1 (Conditional).</strong> Addresses interpersonal friction, thwarted belongingness, and perceived burdensomeness that bridge thoughts to action.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table6: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Medication / Class</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Safety Warnings & Real-World Pharmacovigilance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">SSRIs & SNRIs (General)</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Carry a black box warning for increasing suicidal thoughts and behaviors in patients 24 years and younger. Ultimately reduce suicidal thoughts in the general population.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Gepirone ER (Exxua)</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Approved in 2023. Carries standard box warning for age 24 and younger. Contraindicated and not approved for pediatric patients.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Zuranolone (Zurzuvae)</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Oral treatment for postpartum depression and MDD. Close monitoring for mood changes, CNS depression, or suicidal ideation. Post-marketing FAERS data flags high Reporting Odds Ratio (ROR = 30.65) for suicidal ideation.</td>
                        </tr>
                    </tbody>
                </table>
            `
        };

        COURSE_MODULES.splice(0, COURSE_MODULES.length,
            {
                id: 1,
                title: "Module 1: Differentiating Ideation & Intent",
                objective: "Differentiate passive, intrusive thoughts from active suicidal intent using gold-standard clinical metrics, and build a collaborative safety plan.",
                psychology: "Under severe depression, the brain's prefrontal cortex shuts down, causing 'possibility collapse.' Suicide risk screening tools (C-SSRS, ASQ) help clinicians and individuals map current thoughts to prevent panic. Intrusive thoughts are unwanted fictions generated by a hijacked state; active intent is structured planning. Recognizing this difference helps you pause and choose safety.",
                exercise: "Read the C-SSRS/ASQ criteria in the clinical tables. Under the 'Support Plan' subtab, complete or review your Collaborative Safety Plan (reasons to live, safe contacts, and coping tools). Reflect on how separating intrusive passive thoughts of death from active planning changes your panic levels.",
                placeholder: "Differentiating passive thoughts from active planning makes me realize..."
            },
            {
                id: 2,
                title: "Module 2: Stabilizing the Frame & Reality-Testing",
                objective: "Absorb the Emergency Appendix rules to stabilize the frame, limit rumination, and separate feeling intensity from issue severity.",
                psychology: "When flooded, the mind loops in circles and distorts scale, making one problem feel like all of reality. The emergency protocol demands: 1) Stay in the present first—handle the next hour before your whole life. 2) Put limits on backward/forward thinking—rumination deepens the state. 3) Separate feelings from reality-testing: rate your feeling intensity (e.g. shame 9/10) separately from the issue severity (e.g. 3/10 big picture), and reassess after 15 minutes.",
                exercise: "Review a recent distress spike. Rate your emotional intensity (0-10) and then rate the actual severity of the triggering issue in the big picture (0-10). Write down a script to remind yourself to limit backward/forward thinking when flooded.",
                placeholder: "My emotional intensity was __/10, but the big picture severity is __/10. To stop ruminating I will..."
            },
            {
                id: 3,
                title: "Module 3: Cioran's Solace (The Thought as a Relief Valve)",
                objective: "Explore Emil Cioran's quote: 'Without the thought of suicide, I certainly would have killed myself.'",
                psychology: "Severe mental pain makes the mind feel trapped. The concept of suicide often serves as a mental escape hatch—a release valve that lets you believe you are not permanently trapped. This thought reduces pressure. The error occurs when the brain interprets this relief valve as a command to act. By separating the thought (relief valve) from action (command), you can breathe, let the thought exist, and choose to stay one more day.",
                exercise: "Examine Cioran's quote. Write a reflection on how treating the thought of suicide as a passive relief valve to lower psychological pressure—rather than an active command—affects your ability to tolerate distress.",
                placeholder: "Viewing the thought as a relief valve rather than an action command..."
            },
            {
                id: 4,
                title: "Module 4: The Cerebral Council & Mechanical Relief",
                objective: "Understand state-dependent cognitive hijacking and apply the Restraint Principle alongside low-friction mechanical relief.",
                psychology: "Severe depressive states act like a hostile takeover of your mind (e.g. Bruce Banner trapped while the Hulk runs the body). The thoughts generated in this state are 'errors of state'—they are the Hulk's dark fictions, not your true self. The Restraint Principle dictates that your character and worth are defined by the restraint you show in not acting on these fictions. When risk rises, lower the load immediately using mechanical relief: drink water, eat protein, step outside, wash your face, or clean one small area.",
                exercise: "Identify an automatic negative 'Hulk thought' your brain has generated. Draft your Restraint Statement (e.g. 'These thoughts are biological errors of my current state. They do not define me.') and list 2 concrete mechanical relief actions you will take next time you feel a crash.",
                placeholder: "My Restraint Statement: ... My 2 mechanical relief actions: ..."
            },
            {
                id: 5,
                title: "Module 5: Advanced Clinical Interventions (2026 Guide)",
                objective: "Explore modern clinical options for Treatment-Resistant Depression (TRD) and acute suicidality.",
                psychology: "By 2026, psychiatry has shifted away from slow trial-and-error antidepressant cycles during crises. Advanced protocols like fMRI-guided SAINT TMS (5 days), Esketamine (Spravato) nasal sprays, and sub-anesthetic IV Ketamine can resolve acute suicidality in hours to days. Safe prescribing (limiting outpatient medication supply) is a critical standard. You can work with your clinician to navigate these options.",
                exercise: "Review the modern rapid-acting therapies in the compendium tables. Draft a one-sentence message/bullet you would share with a trusted doctor to discuss these modern neuromodulation or rapid-acting options (e.g. SAINT TMS, Esketamine) for your treatment plan.",
                placeholder: "I want to discuss rapid-acting interventions like SAINT TMS or Spravato because..."
            },
            {
                id: 6,
                title: "Module 6: The 5-Year Roadmap & Relapse Prevention",
                objective: "Absorb the 5-Year Depression Project sequence and maintenance tightening protocols to prevent long-term relapse.",
                psychology: "Recovery is a cumulative sequence, not a one-week sprint: Year 1 (Stabilize/De-chaos), Year 2 (Capacity Building), Year 3 (Reintegration), Year 4 (Expansion), Year 5 (Consolidation). Maintenance is the adult form of the plan. Relapse is a process problem before a mood catastrophe: sleep drift for 3-5 days, skipped meals, and decreased movement precede a crash. The tightening protocol is: 1) Restore wake time and light. 2) Rebuild meal timing. 3) Reinstall minimum movement. 4) Reduce load.",
                exercise: "Identify which year of the recovery hierarchy you are currently in. List your three primary non-negotiable anchors and your earliest behavioral warning sign of drift (e.g., sleep drift, irregular meals).",
                placeholder: "I am in Year __. My three non-negotiables: ... My earliest warning sign of drift: ..."
            }
        );

        Object.assign(COMPENDIUM_TABLES, {

            table1: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Signal Type</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">What It Can Mean</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Immediate danger indicators</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Current intent, a specific plan, inability to stay safe, severe agitation, psychosis, or rapidly escalating behavior call for urgent human intervention rather than self-guided reflection.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Common warning signs</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Hopelessness, feeling trapped, talking about being a burden, sleep collapse, increased substance use, withdrawal, rage, and marked mood or behavior change are warning signs that support should move closer.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Thoughts vs action</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">A distressing thought, a passive wish not to exist, and a decision to act are different states. The distinction matters because the response changes: grounding, support, crisis care, or emergency services.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Communication cue</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">If you are asking whether it is serious enough to tell someone, that is often a sign to tell someone sooner, not later.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table2: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Factor Type</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Examples</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Major risk factors</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Prior attempt, depression or other mental illness, substance use, trauma, acute loss, isolation, chronic pain, financial or legal crisis, care dropout, and easy access to dangerous means.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Protective factors</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Reasons for living, supportive relationships, belonging, cultural identity, problem-solving skills, quality healthcare, crisis resources, and follow-up contact.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Pattern clues</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">For many people the stack builds through sleep disruption, shame, conflict, withdrawal, substance use, or abrupt collapse in routine before the crisis becomes obvious.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Clinical tools</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Clinicians may use tools such as the C-SSRS, ASQ, and PHQ-9 item 9, but public education should not treat these as self-diagnosis engines or prediction machines.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table3: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Strategy</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Practical Use</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Safety Planning</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">A collaborative plan typically includes warning signs, internal coping steps, people and places that help, trusted contacts, professional resources, and ways to reduce immediate danger.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Follow-up contact</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Support does not end after the peak of a crisis. Follow-up contact, caring messages, and transition planning after emergency or hospital care are important prevention tools.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Means safety</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Reducing immediate access to dangerous items during high-risk periods is a collaborative harm-reduction step. Public-facing education should mention this without procedural detail.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">988 and emergency escalation</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">In the U.S., people can call or text 988 for the Suicide and Crisis Lifeline. If there is immediate danger or a person cannot be kept safe, call 911 or local emergency services.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table4: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Care Pathway</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">What It Covers</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Crisis evaluation</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Used when risk is acute, safety is uncertain, or symptoms such as psychosis, severe agitation, or inability to maintain safety are present.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Outpatient treatment planning</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Medication changes, psychotherapy, sleep and substance-use care, and close follow-up often belong here when danger is not immediate but the risk stack is rising.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Psychotherapies</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Evidence-supported approaches may include CBT-based suicide prevention work, DBT, problem-solving approaches, and other structured therapies matched by clinicians to the person's needs.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Clinician-guided advanced options</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Some people may discuss options such as ECT, TMS, ketamine or esketamine, lithium, or other higher-intensity interventions with a qualified clinician when clinically appropriate. Public education should not overpromise speed or outcomes.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Medication monitoring</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Medication starts, stops, and dose changes deserve monitoring, especially in younger people and in early treatment windows. Changes in agitation or suicidal thinking should be reported promptly.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table5: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Framework</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Use for State Not Fate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">CDC public health approach</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Frames suicide prevention as more than crisis response. It includes upstream protection, safer environments, connection, economic and social conditions, and support after crises.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">HHS National Strategy</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Supports a whole-of-society model spanning prevention, treatment, crisis response, surveillance, recovery, and equity.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">WHO LIVE LIFE</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Highlights limiting access to means, responsible media, social-emotional learning, and early identification as practical prevention levers.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Zero Suicide and similar systems work</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Useful for thinking about safer care transitions, training, identification, engagement, treatment, and improvement at the system level.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            table6: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-lavender);">
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold; width: 30%;">Population or Context</th>
                            <th style="text-align: left; padding: 0.5rem; color: var(--accent-lavender); font-weight: bold;">Why It Deserves Specific Attention</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Youth and young adults</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Need developmentally appropriate support, close monitoring, and honest discussion of digital life, identity, belonging, and care transitions.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Perinatal and postpartum</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Requires explicit screening and urgent assessment when severe depression, suicidality, psychosis, or mania are present. Intrusive thoughts and active intent should not be collapsed into one category.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Veterans, LGBTQ+ people, tribal communities, rural communities, and other disproportionately affected groups</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">Population-specific context matters. Culturally grounded, community-trusted, and identity-aware prevention is stronger than one generic message for everyone.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 0.5rem; font-weight: bold; color: var(--text-primary); vertical-align: top;">Public product design</td>
                            <td style="padding: 0.5rem; color: var(--text-secondary);">A support product should provide crisis routing, preparation tools, and educational context without claiming to assess, predict, or prevent suicide on its own.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            chris_3_narrowing_options: `
<div class='table-responsive'><table class='w-full'><thead><tr><th>Systems Phase</th><th>Vulnerability</th><th>System SOP Interventions</th></tr></thead><tbody><tr><td>Startup Drag</td><td>The depression loop artificially narrows perceived positive outcomes, removing all 'good' possibilities.</td><td><strong>Stop-Loss Technique:</strong> Set a 15-20 min timer on rumination. When the timer hits, forcefully pivot attention to put the spiral in a box.<br><br><strong>Circadian Rhythm:</strong> Lock down a 24-hour routine. Use daylight to sync cortisol and melatonin.</td></tr></tbody></table></div>
            `,

        });

        const SUICIDE_ACTION_MAP = {
            distress: {
                title: "Distress spike but no clear plan or intent",
                summary: "Treat the next 10 to 30 minutes as a nervous-system problem first.",
                steps: [
                    "Use one grounding tool or a very short physical reset.",
                    "Move closer to other people or a less isolated place if possible.",
                    "Open your safety plan and lower decisions to the next hour, not the rest of life."
                ]
            },
            warning: {
                title: "Warning signs are building over hours or days",
                summary: "Assume support needs to move closer before the situation becomes acute.",
                steps: [
                    "Name the warning signs plainly: sleep drift, withdrawal, hopelessness, agitation, substance use, or shutting down.",
                    "Tell one trusted person that your state is tightening and that you need more contact.",
                    "Reduce danger, simplify the day, and consider professional follow-up instead of waiting for certainty."
                ]
            },
            help: {
                title: "I need help fast",
                summary: "When safety feels shaky, hand the situation to human support quickly.",
                steps: [
                    "Call or text 988 in the U.S. for live crisis support.",
                    "If there is immediate danger or you cannot stay safe, call 911 or local emergency services.",
                    "Use a short script: 'I do not feel safe being alone with this right now. Stay with me while I contact help.'"
                ]
            },
            supporter: {
                title: "I am supporting someone else",
                summary: "Stay calm, ask directly, and focus on connection and handoff.",
                steps: [
                    "Ask direct, plain questions about whether they are thinking about suicide or feel unsafe.",
                    "Do not argue, shame, or try to solve their life story in the moment.",
                    "Stay with them, involve trusted support, and use 988 or emergency services when danger is immediate."
                ]
            }
        };

        const SUICIDE_SUPPORTER_SCRIPTS = {
            self: {
                title: "Text when you need help",
                body: "I am not doing well and I do not want to be alone with my thoughts right now. Can you stay with me by text or phone while I get grounded or contact more support?"
            },
            friend: {
                title: "Text to a trusted person",
                body: "My warning signs are getting worse and I need a little more contact than usual tonight. I do not need you to fix everything. I need you to stay connected with me while I follow my safety plan."
            },
            supporter: {
                title: "Reply as a supporter",
                body: "I am glad you told me. I am with you right now. Are you in immediate danger, or do we need to call or text 988 together? Let’s slow this down and stay connected while we decide the next safe step."
            }
        };

        const SUICIDE_SCENARIOS = {
            self_low: {
                title: "I am struggling and I need the next right step",
                summary: "Focus on reducing danger, reducing isolation, and shortening the time horizon.",
                bullets: [
                    "Do not ask yourself to solve your whole life while your state is narrowed.",
                    "Use one grounding step, one human contact step, and one environmental safety step.",
                    "If safety feels shaky, move to 988 or emergency escalation faster rather than waiting for certainty."
                ]
            },
            supporting: {
                title: "I am helping someone else",
                summary: "Your job is connection, reality-testing, and handoff, not perfect words.",
                bullets: [
                    "Ask directly about suicidal thoughts and immediate safety.",
                    "Stay calm and avoid shaming, arguing, or overpromising secrecy.",
                    "Help the person get to trusted support, 988, or emergency care when needed."
                ]
            },
            post_crisis: {
                title: "This is after a crisis or after a frightening night",
                summary: "The danger is not automatically over just because the peak has passed.",
                bullets: [
                    "Plan contact for the next day or two instead of assuming relief means full stability.",
                    "Write down warning signs, contacts, and the next follow-up appointment or check-in.",
                    "Use caring contacts and practical structure to prevent the shame-and-disappearance cycle."
                ]
            },
            care_team: {
                title: "I need to talk to a therapist, psychiatrist, or doctor",
                summary: "Bring concrete observations instead of trying to summarize your whole identity.",
                bullets: [
                    "Name warning signs, recent safety concerns, sleep shifts, substance use, agitation, or withdrawal.",
                    "Bring one short message about what support or follow-up you think is missing.",
                    "Ask directly about safety planning, monitoring, and care-transition support if recent risk has risen."
                ]
            }
        };

        const SUICIDE_SETTINGS_GUIDE = {
            home: {
                title: "Home and close relationships",
                summary: "Home is where warning signs are often first visible and where practical safety steps matter most.",
                bullets: [
                    "Keep contact pathways obvious: who to text, who to call, and what phrase means 'stay with me now.'",
                    "Reduce isolation and lower access to danger during high-risk periods.",
                    "Treat sleep collapse, disappearance, rage, and sudden hopelessness as support signals, not attitude problems."
                ]
            },
            primary_care: {
                title: "Primary care and general medical settings",
                summary: "Many people disclose distress first in ordinary medical care, not specialty mental-health care.",
                bullets: [
                    "Brief screening, direct questions, and clear handoff pathways matter.",
                    "Primary care can help with follow-up, medication monitoring, sleep, pain, and referral escalation.",
                    "A good handoff is warm and specific, not just 'here is a number to call later.'"
                ]
            },
            school_work: {
                title: "School and work settings",
                summary: "These settings often notice functioning changes before anyone hears the deeper story.",
                bullets: [
                    "Withdrawal, attendance problems, abrupt performance drops, and visible overwhelm can be important flags.",
                    "Support should focus on connection, safety, and referral rather than discipline-first reactions.",
                    "Privacy matters, but so does not leaving a struggling person alone with a collapsing week."
                ]
            },
            community: {
                title: "Community and public-health settings",
                summary: "Prevention is stronger when it is trusted, local, and connected to real belonging.",
                bullets: [
                    "Safer media, outreach, culturally grounded support, and trusted messengers all matter.",
                    "Community prevention is not only about crisis lines; it is also about reducing stigma and increasing reachable support.",
                    "Equity matters because suicide risk is shaped by access, identity, history, environment, and exclusion."
                ]
            }
        };

        let currentSelectedModuleId = 1;

        function renderSuicideActionMap(mapKey) {
            const displayEl = document.getElementById("sp-action-map-display");
            if (!displayEl) return;

            const item = SUICIDE_ACTION_MAP[mapKey] || SUICIDE_ACTION_MAP.distress;
            displayEl.innerHTML = `
                <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                    <div style="font-size: 0.92rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.35rem;">${item.title}</div>
                    <div style="margin-bottom: 0.65rem;">${item.summary}</div>
                    <ol style="margin: 0; padding-left: 1.15rem;">
                        ${item.steps.map(step => `<li style="margin-bottom: 0.35rem;">${step}</li>`).join("")}
                    </ol>
                </div>
            `;
        }

        function renderSupporterScript(scriptKey) {
            const displayEl = document.getElementById("sp-script-display");
            if (!displayEl) return;

            const item = SUICIDE_SUPPORTER_SCRIPTS[scriptKey] || SUICIDE_SUPPORTER_SCRIPTS.self;
            displayEl.setAttribute("data-active-script", scriptKey);
            displayEl.innerHTML = `
                <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                    <div style="font-size: 0.92rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem;">${item.title}</div>
                    <div style="padding: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); color: var(--text-primary);">
                        ${item.body}
                    </div>
                </div>
            `;
        }

        function copyActiveSupporterScript() {
            const displayEl = document.getElementById("sp-script-display");
            if (!displayEl) return;

            const scriptKey = displayEl.getAttribute("data-active-script") || "self";
            const item = SUICIDE_SUPPORTER_SCRIPTS[scriptKey] || SUICIDE_SUPPORTER_SCRIPTS.self;

            navigator.clipboard.writeText(item.body).then(() => {
                showToast("Support script copied to clipboard.", "success");
            }).catch(err => {
                console.error("Failed to copy support script: ", err);
                showToast("Could not copy the script right now.", "warning");
            });
        }

        function renderSuicideScenario(scenarioKey) {
            const displayEl = document.getElementById("sp-scenario-display");
            if (!displayEl) return;

            const item = SUICIDE_SCENARIOS[scenarioKey] || SUICIDE_SCENARIOS.self_low;
            displayEl.innerHTML = `
                <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                    <div style="font-size: 0.92rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.35rem;">${item.title}</div>
                    <div style="margin-bottom: 0.65rem;">${item.summary}</div>
                    <ul style="margin: 0; padding-left: 1.15rem;">
                        ${item.bullets.map(step => `<li style="margin-bottom: 0.35rem;">${step}</li>`).join("")}
                    </ul>
                </div>
            `;
        }

        function renderSuicideSetting(settingKey) {
            const displayEl = document.getElementById("sp-setting-display");
            if (!displayEl) return;

            const item = SUICIDE_SETTINGS_GUIDE[settingKey] || SUICIDE_SETTINGS_GUIDE.home;
            displayEl.innerHTML = `
                <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                    <div style="font-size: 0.92rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.35rem;">${item.title}</div>
                    <div style="margin-bottom: 0.65rem;">${item.summary}</div>
                    <ul style="margin: 0; padding-left: 1.15rem;">
                        ${item.bullets.map(step => `<li style="margin-bottom: 0.35rem;">${step}</li>`).join("")}
                    </ul>
                </div>
            `;
        }

        function renderCompendiumSubpanel() {
            ensurePolarisState();

            if (!state.compendiumCourse) {
                state.compendiumCourse = {
                    completedModules: [],
                    reflections: {}
                };
            }

            const totalProofPoints = (state.polaris && state.polaris.proof) ? state.polaris.proof.total : 0;
            const threshold = 10;

            const lockedEl = document.getElementById("sp-compendium-locked");
            const unlockedEl = document.getElementById("sp-compendium-unlocked");

            if (totalProofPoints < threshold) {
                if (lockedEl) lockedEl.classList.remove("hidden");
                if (unlockedEl) unlockedEl.classList.add("hidden");

                const progressText = document.getElementById("sp-lock-progress-text");
                const progressBar = document.getElementById("sp-lock-progress-bar");
                if (progressText) {
                    progressText.innerText = `${totalProofPoints} / ${threshold} pts`;
                }
                if (progressBar) {
                    const percentage = Math.min(100, (totalProofPoints / threshold) * 100);
                    progressBar.style.width = `${percentage}%`;
                }
            } else {
                if (lockedEl) lockedEl.classList.add("hidden");
                if (unlockedEl) unlockedEl.classList.remove("hidden");

                renderCourseModuleDetails(currentSelectedModuleId);
                
                const progressBadge = document.getElementById("course-progress-badge");
                if (progressBadge) {
                    const completedCount = state.compendiumCourse.completedModules ? state.compendiumCourse.completedModules.length : 0;
                    progressBadge.innerText = `${completedCount} / 10 Complete`;
                }

                const tableDisplay = document.getElementById("compendium-table-display");
                if (tableDisplay && !tableDisplay.innerHTML.trim()) {
                    const selectEl = document.getElementById("select-compendium-section");
                    const currentTable = selectEl ? selectEl.value : "table1";
                    switchCompendiumTable(currentTable);
                }
            }
        }

        function selectCourseModule(idx) {
            renderCourseModuleDetails(idx);
        }

        function renderCourseModuleDetails(idx) {
            currentSelectedModuleId = idx;
            ensurePolarisState();

            for (let i = 1; i <= 10; i++) {
                const navBtn = document.getElementById(`btn-module-${i}`);
                if (navBtn) {
                    if (i === idx) {
                        navBtn.classList.add("active");
                        navBtn.style.background = "rgba(0, 255, 200, 0.12)";
                        navBtn.style.borderColor = "var(--accent-teal)";
                        navBtn.style.color = "var(--accent-teal)";
                    } else {
                        navBtn.classList.remove("active");
                        navBtn.style.background = "";
                        navBtn.style.borderColor = "";
                        navBtn.style.color = "";
                    }
                }
            }

            const module = COURSE_MODULES[idx - 1];
            const bodyEl = document.getElementById("module-education-body");
            if (!bodyEl) return;

            const isCompleted = state.compendiumCourse.completedModules && state.compendiumCourse.completedModules.includes(`module${idx}`);
            const savedReflection = (state.compendiumCourse.reflections && state.compendiumCourse.reflections[`module${idx}`]) || "";

            let statusBadgeHtml = isCompleted 
                ? `<span style="background: rgba(0, 255, 200, 0.15); color: var(--accent-teal); padding: 0.15rem 0.4rem; border-radius: var(--radius-sm); font-size: 0.7rem; font-weight: bold; margin-left: 0.5rem; display: inline-block;">COMPLETED ✓</span>`
                : `<span style="background: rgba(240, 115, 30, 0.1); color: var(--accent-orange); padding: 0.15rem 0.4rem; border-radius: var(--radius-sm); font-size: 0.7rem; font-weight: bold; margin-left: 0.5rem; display: inline-block;">IN PROGRESS</span>`;

            bodyEl.innerHTML = `
                <div style="margin-bottom: 0.75rem; display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <strong style="color: var(--text-primary); font-size: 0.95rem;">${module.title}</strong>
                    ${statusBadgeHtml}
                </div>
                <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.6rem;">
                    <strong style="color: var(--accent-teal);">Core Objective:</strong> ${module.objective}
                </div>
                <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.6rem; border-left: 2px solid var(--accent-lavender); padding-left: 0.6rem; background: rgba(165,120,240,0.02);">
                    <strong style="color: var(--accent-lavender);">Psychology & Perspectives:</strong> ${module.psychology}
                </div>
                <div style="font-size: 0.82rem; color: var(--text-primary); padding: 0.4rem; background: rgba(0,255,200,0.02); border: 1px dashed rgba(0,255,200,0.15); border-radius: var(--radius-sm);">
                    <strong>Exercise Instructions:</strong> ${module.exercise}
                </div>
            `;

            const inputEl = document.getElementById("module-reflection-input");
            if (inputEl) {
                inputEl.value = savedReflection;
                inputEl.placeholder = module.placeholder;
                if (isCompleted) {
                    inputEl.disabled = true;
                    const submitBtn = document.getElementById("btn-submit-module");
                    if (submitBtn) {
                        submitBtn.innerText = "Completed ✓ (+5 Proof Points Logged)";
                        submitBtn.disabled = true;
                        submitBtn.style.opacity = "0.6";
                    }
                } else {
                    inputEl.disabled = false;
                    const submitBtn = document.getElementById("btn-submit-module");
                    if (submitBtn) {
                        submitBtn.innerText = "💾 Log Module Completion (+5 pts)";
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = "1";
                    }
                }
            }
            updateModuleCharCount();
        }

        function updateModuleCharCount() {
            const inputEl = document.getElementById("module-reflection-input");
            const charCountEl = document.getElementById("module-char-count");
            if (inputEl && charCountEl) {
                const len = inputEl.value.trim().length;
                charCountEl.innerText = `${len} / 15 chars`;
                if (len >= 15) {
                    charCountEl.style.color = "var(--accent-teal)";
                } else {
                    charCountEl.style.color = "var(--text-muted)";
                }
            }
        }

        function submitCurrentModule() {
            ensurePolarisState();
            const idx = currentSelectedModuleId;
            const inputEl = document.getElementById("module-reflection-input");
            if (!inputEl) return;

            const text = inputEl.value.trim();
            if (text.length < 15) {
                showToast("Please write a reflection of at least 15 characters to register completion.", "warning");
                return;
            }

            const moduleKey = `module${idx}`;
            
            if (state.compendiumCourse.completedModules.includes(moduleKey)) {
                return;
            }

            state.compendiumCourse.completedModules.push(moduleKey);
            state.compendiumCourse.reflections[moduleKey] = text;

            // Reward 5 proof points
            state.polaris.proof.today += 5;
            state.polaris.proof.total += 5;
            state.polaris.proof.ledger.push({
                id: 'proof_course_' + Date.now(),
                timestamp: new Date().toISOString(),
                action: `Completed Course Module ${idx}: ${COURSE_MODULES[idx - 1].title.split(':')[0]}`,
                points: 5
            });

            logActionCompletion(`Suicide Compendium Course - Completed Module ${idx}`);

            saveState();
            showToast(`Module ${idx} completed! +5 Proof Points registered.`, "success");

            renderCompendiumSubpanel();
            updateDashboardMetrics();
        }

        function switchCompendiumTable(tableId) {
            const displayEl = document.getElementById("compendium-table-display");
            if (!displayEl) return;

            const tableHtml = COMPENDIUM_TABLES[tableId] || "<p class='text-muted'>Select a section from the dropdown list to display clinical guidelines.</p>";
            displayEl.innerHTML = tableHtml;
        }

        // ==========================================
        // EVIDENCE BASE & SUPPORTER SCRIPT LIBRARY
        // ==========================================

        const EVIDENCE_SOURCES = [
            {
                id: "cdc_data",
                title: "CDC Suicide Data and Statistics",
                url: "https://www.cdc.gov/suicide/data/index.html",
                type: "official",
                disposition: "anchor",
                dispositionText: "Official Data. Anchors the appendix as a public-health document rather than a purely personal or motivational one."
            },
            {
                id: "cdc_factors",
                title: "CDC Risk and Protective Factors for Suicide",
                url: "https://www.cdc.gov/suicide/risk-factors/index.html",
                type: "official",
                disposition: "chapter",
                dispositionText: "Official Public-Health Guidance. Wrote a chapter. Supports the risk stack / protection stack language and keeps warning signs separate from long-range risk context."
            },
            {
                id: "cdc_wisqars",
                title: "CDC WISQARS (Web-based Injury Statistics Query and Reporting System)",
                url: "https://www.cdc.gov/injury/wisqars/index.html",
                type: "official",
                disposition: "anchor",
                dispositionText: "Official Data. Establishes suicide as a leading cause of death to ground the severity of State Not Fate's mission."
            },
            {
                id: "cdc_tech",
                title: "CDC Preventing Suicide: A Technical Package of Policy, Programs, and Practices",
                url: "https://www.cdc.gov/suicide/resources/index.html",
                type: "official",
                disposition: "research",
                dispositionText: "Official Framework. Informs the system-level focus on protective environments and coping/problem-solving skills."
            },
            {
                id: "nimh_research",
                title: "NIMH Suicide Prevention Research",
                url: "https://www.nimh.nih.gov/health/topics/suicide-prevention",
                type: "research",
                disposition: "research",
                dispositionText: "Research Base. Underpins our grounding techniques and supports the necessity of collaborative, clinician-guided treatment plans."
            },
            {
                id: "va_dod",
                title: "VA/DoD Clinical Practice Guideline for the Assessment and Management of Patients at Risk for Suicide",
                url: "https://www.healthquality.va.gov/guidelines/MH/sui/",
                type: "clinical",
                disposition: "chapter",
                dispositionText: "Clinical Practice Guidelines. Wrote a chapter. Directly informs the risk assessment protocols, safety plan structure, and follow-up loops."
            },
            {
                id: "who_preventing",
                title: "WHO Preventing Suicide: A Global Imperative",
                url: "https://www.who.int/publications/i/item/9789241564779",
                type: "official",
                disposition: "research",
                dispositionText: "Official Framework / Global Strategy. Reinforces the need for community support, restriction of lethal means, and destigmatization."
            },
            {
                id: "samhsa_guidelines",
                title: "SAMHSA National Guidelines for Behavioral Health Crisis Care",
                url: "https://www.samhsa.gov/find-help/988",
                type: "official",
                disposition: "anchor",
                dispositionText: "System Standards. Confirms the role of 988 and crisis response networks to route acute users to live human support."
            },
            {
                id: "zero_suicide",
                title: "Zero Suicide Framework",
                url: "https://zerosuicide.edc.org/",
                type: "clinical",
                disposition: "research",
                dispositionText: "System Framework. Guides the core design ethic: safety is a systemic property of the environment, not just an individual effort."
            },
            {
                id: "stanley_brown",
                title: "Stanley-Brown Safety Planning Intervention",
                url: "https://www.suicidepreventionlifeline.org/wp-content/uploads/2016/08/Stanley-Brown-Safety-Plan-Description.pdf",
                type: "clinical",
                disposition: "chapter",
                dispositionText: "Clinical Intervention. Wrote a chapter. The foundation for our interactive safety plan (reasons to live, contacts, environments, warning signs)."
            },
            {
                id: "cams_framework",
                title: "Collaborative Assessment and Management of Suicidality (CAMS)",
                url: "https://cams-care.com/",
                type: "clinical",
                disposition: "research",
                dispositionText: "Clinical Intervention. Underpins our emphasis on collaborative, non-coercive, and suicide-focused clinical interventions."
            },
            {
                id: "crisis_data",
                title: "Crisis Text Line & 988 Suicide & Crisis Lifeline Data Reports",
                url: "https://www.crisistextline.org/trends",
                type: "official",
                disposition: "anchor",
                dispositionText: "Service Outcomes. Highlights the critical transition window when users seek help via digital platforms."
            },
            {
                id: "trevor_survey",
                title: "The Trevor Project National Survey on LGBTQ Youth Mental Health",
                url: "https://www.thetrevorproject.org/survey-2025/",
                type: "watchlist",
                disposition: "watchlist",
                dispositionText: "Watchlist / Specific Lane. Reminds us that marginalized groups require tailored safety routing, pronoun respect, and community acceptance."
            },
            {
                id: "mmhla_maternal",
                title: "Maternal Mental Health Leadership Alliance (MMHLA) Fact Sheets",
                url: "https://www.mmhla.org/",
                type: "watchlist",
                disposition: "watchlist",
                dispositionText: "Watchlist / Specific Lane. Guides perinatal screening contexts to protect mothers during high-vulnerability windows."
            },
            {
                id: "afsp_grants",
                title: "American Foundation for Suicide Prevention (AFSP) Research Grants",
                url: "https://afsp.org/research-funding/",
                type: "research",
                disposition: "watchlist",
                dispositionText: "Research Base. Provides early-stage data on biological mechanisms and digital intervention outcomes."
            },
            {
                id: "iasp_global",
                title: "International Association for Suicide Prevention (IASP) Resources",
                url: "https://www.iasp.info/resources/",
                type: "official",
                disposition: "watchlist",
                dispositionText: "Global Strategy. Connects local efforts to international crisis networks and policy recommendations."
            },
            {
                id: "motto_rct",
                title: "Motto & Bostrom (2001) Randomized Controlled Trial of Postcrisis Suicide Prevention",
                url: "https://pubmed.ncbi.nlm.nih.gov/11376235/",
                type: "research",
                disposition: "research",
                dispositionText: "Research Anchor (PMID 11376235). Proved that periodic, brief, non-demanding caring contacts reduce suicide mortality in high-risk individuals."
            },
            {
                id: "luxton_rct",
                title: "Luxton et al. (2020) & VA (2024) Caring Contacts Evaluations",
                url: "https://pubmed.ncbi.nlm.nih.gov/",
                type: "research",
                disposition: "research",
                dispositionText: "Research Anchor. Modern randomized trials showing that caring contacts increase engagement with treatment systems and follow-up support."
            },
            {
                id: "stanley_brown_2018",
                title: "Stanley & Brown (2018) Comparison of Safety Planning Intervention vs Usual Care",
                url: "https://pubmed.ncbi.nlm.nih.gov/29800977/",
                type: "clinical",
                disposition: "research",
                dispositionText: "Landmark Trial (PMID 29800977). Proved that collaborative Safety Planning Intervention (SPI) combined with follow-up contact reduces suicidal behavior by 45% and doubles treatment engagement."
            },
            {
                id: "bryan_rudd_2017",
                title: "Bryan & Rudd (2017) Crisis Response Planning vs Safety Contracts",
                url: "https://pubmed.ncbi.nlm.nih.gov/28142085/",
                type: "clinical",
                disposition: "research",
                dispositionText: "Randomized Trial (PMID 28142085). Demonstrated that collaborative, handwritten Crisis Response Planning (CRP) reduced suicide attempts by 76% compared to safety contracts in soldiers."
            },
            {
                id: "bryan_mood_2017",
                title: "Bryan et al. (2017) Crisis Response Planning on Mood and Triage",
                url: "https://pubmed.ncbi.nlm.nih.gov/28967323/",
                type: "research",
                disposition: "research",
                dispositionText: "Clinical Evaluation (PMID 28967323). Showed that integrating 'reasons for living' into collaborative crisis plans reduces immediate negative mood state and psychiatric admission rates."
            },
            {
                id: "bryan_veterans_2024",
                title: "Bryan et al. (2024) Crisis Response Planning with Cognitive Processing Therapy",
                url: "https://pubmed.ncbi.nlm.nih.gov/38154445/",
                type: "research",
                disposition: "research",
                dispositionText: "Pragmatic Trial (PMID 38154445). Proved that Crisis Response Planning (CRP) alongside CPT for PTSD leads to faster, more robust reductions in suicidal ideation in veterans."
            }
        ];

        const RANKED_IDEAS = [
            {
                rank: 1,
                title: "Immediate Crisis Routing",
                importance: 100,
                influence: 100,
                riskAlert: false,
                description: "Primary safety lane. Ensures active 988/911 buttons are highly visible and permanently accessible in crisis views."
            },
            {
                rank: 2,
                title: "Product Boundaries Statement",
                importance: 95,
                influence: 90,
                riskAlert: false,
                description: "Explicitly states that State Not Fate is strictly adjunctive and cannot predict acute risk or replace professional diagnosis."
            },
            {
                rank: 3,
                title: "Evidence-Disposition Mapping",
                importance: 90,
                influence: 85,
                riskAlert: false,
                description: "Distinguishes official guidelines and trials from early-stage watchlists to prevent unverified medical assertions."
            },
            {
                rank: 4,
                title: "Interactive Support Map",
                importance: 95,
                influence: 95,
                riskAlert: false,
                description: "Captures active network contacts (Anchor, Buffer, and Safe Environments) to bypass panic search loops."
            },
            {
                rank: 5,
                title: "Supporter Script Library",
                importance: 85,
                influence: 80,
                riskAlert: false,
                description: "Provides pre-framed text message templates for asking for help, helping others, or preparing for clinical visits."
            },
            {
                rank: 6,
                title: "CDC Warning Signs Alignment",
                importance: 90,
                influence: 90,
                riskAlert: false,
                description: "Explicitly structures warning signs (agitation, hopelessness, withdrawal, sleep, and shame) according to public-health models."
            },
            {
                rank: 7,
                title: "Means Safety Directive",
                importance: 95,
                influence: 95,
                riskAlert: false,
                description: "Advocates securing the immediate physical environment (locking/handing off dangerous items) without providing procedural details."
            },
            {
                rank: 8,
                title: "Population-Aware Contexts",
                importance: 80,
                influence: 75,
                riskAlert: false,
                description: "Tailors safety resources and warnings across maternal, youth, veteran, LGBTQ+, tribal, and rural lanes."
            },
            {
                rank: 9,
                title: "Proof Point Barrier Gate",
                importance: 85,
                influence: 90,
                riskAlert: false,
                description: "Gates high-intensity philosophical modules behind a 10 proof-point floor to protect users in acute distress."
            },
            {
                rank: 10,
                title: "Evolving Course Modules",
                importance: 80,
                influence: 85,
                riskAlert: false,
                description: "Provides a structured educational pathway (Cioran, SAINT, Cerebral Council) with mandatory reflective journaling."
            },
            {
                rank: 11,
                title: "Somatic Grounding Intervention",
                importance: 85,
                influence: 90,
                riskAlert: false,
                description: "Uses box breathing, cold exposure, and sensory checklists to override high-distress physiological activation."
            },
            {
                rank: 12,
                title: "Collaborative Clinician Handoff",
                importance: 75,
                influence: 80,
                riskAlert: false,
                description: "Enables exporting safety plans and distress timelines to Markdown to facilitate therapeutic collaboration."
            },
            {
                rank: 13,
                title: "Local State Sandboxing",
                importance: 90,
                influence: 80,
                riskAlert: false,
                description: "Persists safety plan entries, journal logs, and module status locally within the browser sandbox to guarantee privacy."
            },
            {
                rank: 14,
                title: "Service Worker Offline Support",
                importance: 85,
                influence: 75,
                riskAlert: false,
                description: "Ensures the PWA remains accessible, loading safety contacts and local plans during sudden cell/network drops."
            },
            {
                rank: 15,
                title: "Contrast and Accessibility",
                importance: 80,
                influence: 70,
                riskAlert: false,
                description: "Adheres to WCAG AA color contrast standards to ensure reading legibility under stress or low light."
            },
            {
                rank: 16,
                title: "Separating Signs from Long-term Risk",
                importance: 75,
                influence: 75,
                riskAlert: false,
                description: "Clearly separates acute warning signs from background risk factors to prevent unnecessary warning fatigue."
            },
            {
                rank: 17,
                title: "Reflective Writing Limits",
                importance: 70,
                influence: 70,
                riskAlert: false,
                description: "Enforces a minimum character length on journal reflections to prompt deliberate, slowed cognitive processing."
            },
            {
                rank: 18,
                title: "Interactive Grounding Loop",
                importance: 80,
                influence: 85,
                riskAlert: false,
                description: "Integrates visual step-by-step guidance for physical de-escalation rather than displaying plain static text."
            },
            {
                rank: 19,
                title: "Danger-Triggered Routing",
                importance: 85,
                influence: 90,
                riskAlert: false,
                description: "Automatically routes the user to active somatic grounding modules when a journal log records distress >= 8/10."
            },
            {
                rank: 20,
                title: "Zero Speculative Pseudoscience",
                importance: 90,
                influence: 95,
                riskAlert: true,
                description: "Strictly bans speculative, unproven diagnostic or therapeutic algorithms from entering safety-critical areas."
            }
        ];

        const SUPPORTER_SCRIPTS = {
            help: `
                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                    <div>
                        <strong style="color:var(--accent-teal); font-size: 0.8rem;">Text Script 1 (Direct Request):</strong>
                        <p class="text-secondary" style="font-size:0.78rem; margin:0.25rem 0; padding:0.5rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.05); user-select:all; line-height: 1.45;">"I am feeling unsafe right now and need support. Can you call me or come sit with me? If you can't reach me, please help me contact 988."</p>
                    </div>
                    <div>
                        <strong style="color:var(--accent-teal); font-size: 0.8rem;">Text Script 2 (Non-crisis support request):</strong>
                        <p class="text-secondary" style="font-size:0.78rem; margin:0.25rem 0; padding:0.5rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.05); user-select:all; line-height: 1.45;">"I'm having a really hard time keeping my head above water. I don't need you to fix it, I just need to know you are there. Can we talk?"</p>
                    </div>
                </div>
            `,
            helper: `
                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                    <div>
                        <strong style="color:var(--accent-orange); font-size: 0.8rem;">Text Script 1 (Reaching out):</strong>
                        <p class="text-secondary" style="font-size:0.78rem; margin:0.25rem 0; padding:0.5rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.05); user-select:all; line-height: 1.45;">"I noticed you've been really quiet lately and want to check in. I'm here for you, no matter what you're feeling. We don't have to solve anything, we can just sit."</p>
                    </div>
                    <div>
                        <strong style="color:var(--accent-orange); font-size: 0.8rem;">Text Script 2 (Safety focused offer):</strong>
                        <p class="text-secondary" style="font-size:0.78rem; margin:0.25rem 0; padding:0.5rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.05); user-select:all; line-height: 1.45;">"You don't have to carry this alone. I'm here. If you need me to call a doctor, or help you lock things up to keep your space safe, just tell me how."</p>
                    </div>
                </div>
            `,
            visit: `
                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                    <div>
                        <strong style="color:var(--accent-lavender); font-size: 0.8rem;">Speaking Script 1 (To clinician/therapist):</strong>
                        <p class="text-secondary" style="font-size:0.78rem; margin:0.25rem 0; padding:0.5rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.05); user-select:all; line-height: 1.45;">"I've written down my safety plan and my distress logs. Here is what has been happening. I want to adjust my treatment plan to focus on these specific triggers."</p>
                    </div>
                    <div>
                        <strong style="color:var(--accent-lavender); font-size: 0.8rem;">Speaking Script 2 (Reporting high risk to clinician):</strong>
                        <p class="text-secondary" style="font-size:0.78rem; margin:0.25rem 0; padding:0.5rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.05); user-select:all; line-height: 1.45;">"I am having active thoughts of wanting to die. I have a safety plan in place, but I need medical guidance to stabilize my mood and look at target therapies."</p>
                    </div>
                </div>
            `
        };

        function switchScriptCategory(category) {
            const displayEl = document.getElementById("script-display-area");
            if (!displayEl) return;
            displayEl.innerHTML = SUPPORTER_SCRIPTS[category] || "<p class='text-muted'>Select a category to load scripts.</p>";
        }

        function renderEvidenceSubpanel() {
            // Get active category filter btn class
            let activeFilter = "all";
            const filters = ["all", "anchor", "chapter", "research", "watchlist"];
            for (let f of filters) {
                const btn = document.getElementById(`btn-source-filter-${f}`);
                if (btn && btn.classList.contains("active")) {
                    activeFilter = f;
                    break;
                }
            }
            renderEvidenceSources(activeFilter);
            renderRankedIdeas();
        }

        function renderEvidenceSources(filter) {
            const listEl = document.getElementById("evidence-sources-list");
            const countEl = document.getElementById("evidence-source-count");
            if (!listEl) return;

            listEl.innerHTML = "";
            let filtered = EVIDENCE_SOURCES;
            if (filter !== "all") {
                filtered = EVIDENCE_SOURCES.filter(s => s.disposition === filter);
            }

            if (countEl) {
                countEl.innerText = `${filtered.length} Source${filtered.length === 1 ? "" : "s"}`;
            }

            if (filtered.length === 0) {
                listEl.innerHTML = `<p class="text-muted" style="font-size:0.8rem; text-align:center; padding:2rem 0;">No sources found matching this category.</p>`;
                return;
            }

            filtered.forEach(s => {
                const card = document.createElement("div");
                card.style.background = "rgba(255,255,255,0.02)";
                card.style.border = "1px solid rgba(255,255,255,0.05)";
                card.style.padding = "0.75rem";
                card.style.borderRadius = "var(--radius-sm)";
                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.gap = "0.35rem";

                let typeColor = "var(--accent-teal)";
                if (s.type === "clinical") typeColor = "var(--accent-lavender)";
                if (s.type === "watchlist") typeColor = "var(--accent-orange)";

                let dispColor = "rgba(255,255,255,0.1)";
                if (s.disposition === "anchor") dispColor = "rgba(0, 255, 200, 0.15)";
                if (s.disposition === "chapter") dispColor = "rgba(255, 170, 0, 0.15)";

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem;">
                        <a href="${s.url}" target="_blank" style="color:var(--text-primary); font-weight:bold; font-size:0.82rem; text-decoration:none; display:flex; align-items:center; gap:0.25rem;">
                            <span>${s.title}</span> 🔗
                        </a>
                    </div>
                    <div style="display:flex; gap:0.35rem; margin: 0.1rem 0;">
                        <span class="badge" style="background:rgba(255,255,255,0.05); color:${typeColor}; border:1px solid rgba(255,255,255,0.05); font-size:0.6rem; padding:0.1rem 0.3rem;">${s.type.toUpperCase()}</span>
                        <span class="badge" style="background:${dispColor}; color:var(--text-primary); font-size:0.6rem; padding:0.1rem 0.3rem;">${s.disposition.toUpperCase()}</span>
                    </div>
                    <p class="text-secondary" style="font-size:0.75rem; line-height:1.4; margin:0;">
                        ${s.dispositionText}
                    </p>
                `;
                listEl.appendChild(card);
            });
        }

        function renderRankedIdeas() {
            const listEl = document.getElementById("evidence-ideas-list");
            if (!listEl) return;

            listEl.innerHTML = "";

            RANKED_IDEAS.forEach(idea => {
                const card = document.createElement("div");
                card.style.background = "rgba(255,255,255,0.02)";
                card.style.border = "1px solid rgba(255,255,255,0.05)";
                card.style.padding = "0.75rem";
                card.style.borderRadius = "var(--radius-sm)";
                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.gap = "0.35rem";

                let headerHtml = `
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem;">
                        <strong style="color:var(--text-primary); font-size:0.82rem;">
                            <span style="color:var(--accent-lavender); margin-right:0.25rem;">#${idea.rank}</span> ${idea.title}
                        </strong>
                `;

                if (idea.riskAlert) {
                    headerHtml += `
                        <span class="badge" style="background:rgba(255,50,50,0.15); color:var(--accent-red); font-size:0.6rem; padding:0.1rem 0.4rem; border:1px solid rgba(255,50,50,0.2); font-weight:bold;">
                            ⚠️ RISK ALERT
                        </span>
                    `;
                }

                headerHtml += `</div>`;

                card.innerHTML = `
                    ${headerHtml}
                    <p class="text-secondary" style="font-size:0.75rem; line-height:1.4; margin:0;">
                        ${idea.description}
                    </p>
                    <div style="display:flex; flex-direction:column; gap:0.25rem; margin-top:0.4rem;">
                        <div style="display:flex; justify-content:space-between; font-size:0.65rem; color:var(--text-muted);">
                            <span>Importance: ${idea.importance}%</span>
                            <span>Influence: ${idea.influence}%</span>
                        </div>
                        <div style="display:flex; gap:0.5rem;">
                            <!-- Importance Bar -->
                            <div style="flex:1; height:4px; background:rgba(255,255,255,0.05); border-radius:2px; overflow:hidden;">
                                <div style="width:${idea.importance}%; height:100%; background:var(--accent-teal); border-radius:2px;"></div>
                            </div>
                            <!-- Influence Bar -->
                            <div style="flex:1; height:4px; background:rgba(255,255,255,0.05); border-radius:2px; overflow:hidden;">
                                <div style="width:${idea.influence}%; height:100%; background:var(--accent-lavender); border-radius:2px;"></div>
                            </div>
                        </div>
                    </div>
                `;
                listEl.appendChild(card);
            });
        }

        // ==========================================
        // EMERGENCY APPENDIX INTERACTIVE HELPERS
        // ==========================================

        function switchEmergencyTab(tabId) {
            const tabs = ["frame", "load", "ladder", "supporter"];
            tabs.forEach(t => {
                const btn = document.getElementById(`btn-emer-tab-${t}`);
                const panel = document.getElementById(`sp-emer-panel-${t}`);
                if (t === tabId) {
                    if (btn) btn.classList.add("active");
                    if (panel) panel.classList.remove("hidden");
                } else {
                    if (btn) btn.classList.remove("active");
                    if (panel) panel.classList.add("hidden");
                }
            });

            // If switching to ladder, pre-populate names from supportMap
            if (tabId === "ladder") {
                renderEmergencyContactLadder();
            }
        }

        function renderEmergencyContactLadder() {
            const anchorEl = document.getElementById("emer-ladder-anchor");
            const bufferEl = document.getElementById("emer-ladder-buffer");
            const envEl = document.getElementById("emer-ladder-env");
            
            ensurePolarisState();
            
            if (anchorEl) {
                anchorEl.innerHTML = `<strong>Anchor Person:</strong> ${state.supportMap.anchorPerson || '<span style="color:var(--accent-orange); font-style:italic;">[Not set. Add in Support Plan subtab]</span>'}`;
            }
            if (bufferEl) {
                bufferEl.innerHTML = `<strong>Backup Contact:</strong> ${state.supportMap.bufferContact || '<span style="color:var(--accent-orange); font-style:italic;">[Not set]</span>'}`;
            }
            if (envEl) {
                envEl.innerHTML = `<strong>Safe Place:</strong> ${state.supportMap.safeEnvironment || '<span style="color:var(--accent-orange); font-style:italic;">[Not set]</span>'}`;
            }
        }

        function updateEmergencyReliefProgress() {
            const checks = document.querySelectorAll(".emer-relief-check");
            let checkedCount = 0;
            checks.forEach(c => {
                if (c.checked) checkedCount++;
            });
            const progressLabel = document.getElementById("emer-relief-progress-label");
            if (progressLabel) {
                progressLabel.innerText = `${checkedCount} / 5 checked`;
                if (checkedCount === 5) {
                    progressLabel.style.color = "var(--accent-teal)";
                    progressLabel.innerText = `5 / 5 checked ✓ (Mechanical Load Reduced)`;
                } else {
                    progressLabel.style.color = "var(--accent-orange)";
                }
            }
        }

        function calculateDistortion() {
            const feeling = document.getElementById("input-emer-feeling").value.trim() || "Feeling";
            const intensity = parseInt(document.getElementById("input-emer-intensity").value, 10);
            const severity = parseInt(document.getElementById("input-emer-severity").value, 10);
            
            const resultEl = document.getElementById("emer-comparison-result");
            if (!resultEl) return;
            
            resultEl.classList.remove("hidden");
            
            const discrepancy = intensity - severity;
            
            let html = `<strong>Distortion analysis for "${feeling}":</strong><br>`;
            if (discrepancy > 3) {
                html += `<span style="color:var(--accent-orange); font-weight:bold;">⚠️ Scale distortion detected.</span> Your internal emotion is rated at <strong>${intensity}/10</strong>, but the big-picture severity of this issue is <strong>${severity}/10</strong>.<br>`;
                html += `Depression distorts scale. It narrows your vision until one issue feels like all of reality. Focus on lowering your immediate physical load—do not attempt to solve this issue while flooded.`;
            } else if (discrepancy < 0) {
                html += `Your emotional intensity (<strong>${intensity}/10</strong>) is lower than the big-picture severity of the issue (<strong>${severity}/10</strong>). This represents a calm, logical assessment. You are in control. Stay in the present and handle one piece at a time.`;
            } else {
                html += `Your emotional intensity (<strong>${intensity}/10</strong>) matches the big-picture severity of the issue (<strong>${severity}/10</strong>). You are assessing this situation clearly. Your safety plan remains active. Use your contacts and grounding tools to stabilize.`;
            }
            
            resultEl.innerHTML = html;
        }

        // ==========================================
        // SYSTEMS & HOPE REPAIR WIDGET HELPERS
        // ==========================================
        let currentSelectedSop = "low";

        function renderSystemsSubpanel() {
            switchStateSop(currentSelectedSop);
            updateHopeSimProgress();
            updateTriageExclusionWarning();
        }

        function switchStateSop(sopState) {
            currentSelectedSop = sopState;
            const states = ["low", "medium", "strong"];
            states.forEach(s => {
                const btn = document.getElementById(`btn-state-sop-${s}`);
                if (btn) {
                    if (s === sopState) {
                        btn.classList.add("active");
                        btn.style.background = "rgba(240, 115, 30, 0.12)";
                        btn.style.borderColor = "var(--accent-orange)";
                        btn.style.color = "var(--accent-orange)";
                    } else {
                        btn.classList.remove("active");
                        btn.style.background = "";
                        btn.style.borderColor = "";
                        btn.style.color = "";
                    }
                }
            });

            const detailsBox = document.getElementById("state-sop-details-box");
            if (!detailsBox) return;

            let html = "";
            if (sopState === "low") {
                html = `
                    <div style="display:flex; flex-direction:column; gap:0.5rem;">
                        <span style="color:var(--accent-orange); font-weight:bold; font-size:0.85rem;">Survival SOP (Goal: Prevent further collapse)</span>
                        <p class="text-secondary" style="font-size:0.75rem; margin:0; line-height:1.45;">
                            When your battery is low, do not attempt expansion. Stick strictly to keeping the floor from dropping out:
                        </p>
                        <ul style="margin:0; padding-left:1.1rem; font-size:0.75rem; line-height:1.45; color:var(--text-secondary);">
                            <li><strong>Wake regularity:</strong> Defend your sleep boundary (wake up at your alarm time).</li>
                            <li><strong>Hydration & Meds:</strong> Stay biological: drink water and take prescribed medications.</li>
                            <li><strong>Morning Light:</strong> 5 minutes exposure to reset your clock.</li>
                            <li><strong>Collapse Rescue Sequence:</strong> Do less, but do not disappear. Contact your anchor person. Secure your environment (means safety lockdown).</li>
                        </ul>
                    </div>
                `;
            } else if (sopState === "medium") {
                html = `
                    <div style="display:flex; flex-direction:column; gap:0.5rem;">
                        <span style="color:var(--accent-orange); font-weight:bold; font-size:0.85rem;">Stabilization SOP (Goal: Protect continuity)</span>
                        <p class="text-secondary" style="font-size:0.75rem; margin:0; line-height:1.45;">
                            With moderate energy, protect the basics and introduce a single high-impact task block:
                        </p>
                        <ul style="margin:0; padding-left:1.1rem; font-size:0.75rem; line-height:1.45; color:var(--text-secondary);">
                            <li><strong>Level 1 Survival:</strong> Defend wake time, light, hydration, and meds first.</li>
                            <li><strong>Movement:</strong> 15-20 minutes of mild activation (e.g., outdoor walking).</li>
                            <li><strong>One Task Block:</strong> Focus on one single high-friction task (max 45 mins).</li>
                            <li><strong>Surface Reset:</strong> 10 minutes environment de-cluttering to prevent room decay.</li>
                            <li><strong>Non-passive contact:</strong> Send a brief text to your anchor or buffer contact.</li>
                        </ul>
                    </div>
                `;
            } else if (sopState === "strong") {
                html = `
                    <div style="display:flex; flex-direction:column; gap:0.5rem;">
                        <span style="color:var(--accent-orange); font-weight:bold; font-size:0.85rem;">Expansion SOP (Goal: Build future stability)</span>
                        <p class="text-secondary" style="font-size:0.75rem; margin:0; line-height:1.45;">
                            When energy is strong, expand life range but avoid 'productivity binging' that triggers crashes:
                        </p>
                        <ul style="margin:0; padding-left:1.1rem; font-size:0.75rem; line-height:1.45; color:var(--text-secondary);">
                            <li><strong>Systems Reinforcement:</strong> Run core anchors plus 30 minutes physical exercise.</li>
                            <li><strong>Task Blocks:</strong> 2-3 focused productivity blocks (take breaks between them).</li>
                            <li><strong>Richer connection:</strong> Shared meal, phone call, or detailed conversation.</li>
                            <li><strong>Chosen leisure:</strong> Active leisure (hobbies, reading) rather than passive scrolling.</li>
                            <li><strong>Warning:</strong> Do not burn all your capacity in one day. Protect tomorrow's energy baseline.</li>
                        </ul>
                    </div>
                `;
            }
            detailsBox.innerHTML = html;
        }

        function updateHopeSimProgress() {
            const checks = document.querySelectorAll(".hope-sim-check");
            let totalVal = 0;
            checks.forEach(c => {
                if (c.checked) {
                    totalVal += parseInt(c.getAttribute("data-val") || "25", 10);
                }
            });

            const percentLabel = document.getElementById("label-hope-sim-percent");
            const progressBar = document.getElementById("bar-hope-sim-progress");
            const feedbackText = document.getElementById("text-hope-sim-feedback");

            if (percentLabel) {
                let status = "Pointless";
                if (totalVal === 25) status = "Slight Wins";
                else if (totalVal === 50) status = "Rhythm Locking";
                else if (totalVal === 75) status = "Active Momentum";
                else if (totalVal === 100) status = "Credibility Restored";
                percentLabel.innerText = `${totalVal}% (${status})`;
            }

            if (progressBar) {
                progressBar.style.width = `${totalVal}%`;
            }

            if (feedbackText) {
                let txt = "No anchors checked. Prediction states that effort will fail.";
                if (totalVal === 25) {
                    txt = "25% credibility win. Small outcome registered. Keep the same wake time tomorrow.";
                } else if (totalVal === 50) {
                    txt = "50% credibility win. Circadian rhythm starting to lock. Brain begins predicting payoff.";
                } else if (totalVal === 75) {
                    txt = "75% credibility win. Active momentum building. Energy cost of action is dropping.";
                } else if (totalVal === 100) {
                    txt = "100% credibility win. System failure loop interrupted. Self-trust and expectation of reward restored.";
                }
                feedbackText.innerText = txt;
            }
        }

        function updateTriageExclusionWarning() {
            const checks = document.querySelectorAll(".triage-exclusion-check");
            let checkedCount = 0;
            checks.forEach(c => {
                if (c.checked) checkedCount++;
            });

            const alertEl = document.getElementById("triage-escalation-alert");
            if (alertEl) {
                if (checkedCount > 0) {
                    alertEl.classList.remove("hidden");
                } else {
                    alertEl.classList.add("hidden");
                }
            }
        }

        // ==========================================
        // POLARIS SETTINGS & ARCHIVE LOGIC
        // ==========================================

        function openPolarisSettingsModal() {
            ensurePolarisState();
            const modal = document.getElementById("polaris-settings-modal");
            const input = document.getElementById("input-openai-api-key");
            const status = document.getElementById("api-key-status");
            
            if (input && state.polaris.openaiApiKey) {
                input.value = state.polaris.openaiApiKey;
            }
            if (status) {
                status.innerText = state.polaris.openaiApiKey ? "Key active and loaded." : "No key active. Set one above.";
            }
            if (modal) modal.classList.add("active");
        }

        function closePolarisSettingsModal() {
            const modal = document.getElementById("polaris-settings-modal");
            if (modal) modal.classList.remove("active");
        }

        function savePolarisApiKeyUI() {
            const input = document.getElementById("input-openai-api-key");
            const status = document.getElementById("api-key-status");
            if (input && input.value.trim().startsWith("sk-")) {
                ensurePolarisState();
                state.polaris.openaiApiKey = input.value.trim();
                saveState();
                if (status) status.innerText = "Key active and loaded.";
                showToast("OpenAI API Key saved securely to local storage.", "success");
            } else {
                showToast("Invalid key format. Must start with 'sk-'.", "error");
            }
        }

        function archivePolarisSession() {
            ensurePolarisState();
            if (!state.polaris.chatArchive) state.polaris.chatArchive = [];
            
            const currentHistory = state.polaris.chatHistory || [];
            if (currentHistory.length === 0) {
                showToast("No active session to archive.", "info");
                return;
            }

            // Archive it with a timestamp block
            state.polaris.chatArchive.push({
                archivedAt: new Date().toISOString(),
                messages: [...currentHistory]
            });
            
            // Clear current memory to refresh context
            state.polaris.chatHistory = [];
            saveState();
            renderPolarisChat();
            
            showToast("Session archived. Polaris context window refreshed.", "success");
        }

        function exportPolarisMemory() {
            ensurePolarisState();
            const exportData = {
                exportedAt: new Date().toISOString(),
                profile: state.polaris.profile || {},
                anchors: state.polaris.anchors || {},
                proof: state.polaris.proof || {},
                activeHistory: state.polaris.chatHistory || [],
                archivedSessions: state.polaris.chatArchive || []
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = url;
            a.download = `polaris-memory-archive-${getTodayString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast("Polaris memory exported successfully.", "success");
        }

        // Export so variables/functions are global
        window.COURSE_MODULES = COURSE_MODULES;
        window.COMPENDIUM_TABLES = COMPENDIUM_TABLES;
        window.renderCompendiumSubpanel = renderCompendiumSubpanel;
        window.selectCourseModule = selectCourseModule;
        window.updateModuleCharCount = updateModuleCharCount;
        window.submitCurrentModule = submitCurrentModule;
        window.switchCompendiumTable = switchCompendiumTable;
        window.EVIDENCE_SOURCES = EVIDENCE_SOURCES;
        window.RANKED_IDEAS = RANKED_IDEAS;
        window.SUPPORTER_SCRIPTS = SUPPORTER_SCRIPTS;
        window.switchScriptCategory = switchScriptCategory;
        window.renderEvidenceSubpanel = renderEvidenceSubpanel;
        window.renderEvidenceSources = renderEvidenceSources;
        window.renderRankedIdeas = renderRankedIdeas;
        window.switchEmergencyTab = switchEmergencyTab;
        window.renderEmergencyContactLadder = renderEmergencyContactLadder;
        window.updateEmergencyReliefProgress = updateEmergencyReliefProgress;
        window.calculateDistortion = calculateDistortion;
        window.renderSystemsSubpanel = renderSystemsSubpanel;
        window.switchStateSop = switchStateSop;
        window.updateHopeSimProgress = updateHopeSimProgress;
        window.updateTriageExclusionWarning = updateTriageExclusionWarning;
        window.openPolarisSettingsModal = openPolarisSettingsModal;
        window.closePolarisSettingsModal = closePolarisSettingsModal;
        window.savePolarisApiKeyUI = savePolarisApiKeyUI;
        window.archivePolarisSession = archivePolarisSession;
        window.exportPolarisMemory = exportPolarisMemory;

        window.onload = init;
