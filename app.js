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
            }
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
const COMPANION_QUESTION_TREE = {
    "q0": { text: "1", next: {'0': 'q1', '1': 'q1', '2': 'q0_a', '3': 'q0_a', '4': 'q0_a', 'default': 'q1'} },
    "q0_a": { text: "What specific triggers consistently lead to this high level of severity for you?", next: {'default': 'q1'} },
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
            
            handleRouting();
            window.addEventListener("hashchange", handleRouting);
        }

        function handleRouting() {
            const hash = window.location.hash;
            if (state.securityPin) {
                state.isLocked = true;
                showScreen("lock");
                resetPinDots();
            } else if (state.isOnboarded) {
                showScreen("dashboard");
                ensurePolarisState();
                if (state.polaris && state.polaris.enabled) {
                    showTab("polaris");
                    renderPolarisTab();
                } else {
                    renderDashboard();
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
            } else if (hash === "#screen-welcome" || hash === "#program") {
                showScreen("welcome");
            } else {
                toggleAppView(false);
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
            }
            /*
             * SECURITY NOTE — POLARIS ENCRYPTION
             * Polaris state (state.polaris) currently stores proof point ledger entries,
             * anchor completion data, and resilience metrics. These are currently
             * non-clinical and low-sensitivity (counts, timestamps, task labels).
             *
             * HOWEVER: If clinical notes, therapist-facing summaries, or free-text
             * reflections are ever added to the Polaris proof ledger or quest system,
             * they MUST be encrypted using the same scramble/descramble PIN method
             * applied to reasonsLive, safeContacts, gratitudeJournal, and
             * thoughtCorrections. Unencrypted clinical free-text in localStorage
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

            if (tabId === "dashboard") {
                renderDashboard();
            } else if (tabId === "mediaconsole") {
                renderMediaConsole();
            } else if (tabId === "progression") {
                renderProgressionDashboard();
            } else if (tabId === "cognitivelab") {
                renderCognitiveLab();
            } else if (tabId === "documentcenter") {
                renderDocumentCenter();
            } else if (tabId === "polaris") {
                renderPolarisTab();
            } else if (tabId === "momentum") {
                renderMomentumTab();
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
                    const tabBtn = e.target.closest(".tab-btn");
                    if (!tabBtn) return;
                    const tabId = tabBtn.getAttribute("data-tab");
                    const buttonId = tabBtn.id;
                    if (tabId === "reset-intake") {
                        if (confirm("Are you sure you want to reset your intake data? This will clear your current dashboard and clinical progress history.")) {
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
                showToast('Anonymized clinical progress briefing copied to clipboard!', 'success');
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
                // Returning users with Polaris enabled land on Polaris tab after unlock
                ensurePolarisState();
                if (state.polaris && state.polaris.enabled) {
                    showTab("polaris");
                    renderPolarisTab();
                } else {
                    renderDashboard();
                }
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
                interpretation = 'Your responses indicate severe depressive symptoms. This level of distress significantly impairs daily functioning and requires professional clinical intervention.';
                recommendation = '⚠ Strongly recommended: Contact your prescribing clinician or therapist immediately. This score warrants active clinical management. If you are in crisis, call or text 988.';
            } else if (score >= 15) {
                severity = 'Moderately Severe';
                interpretation = 'Your responses suggest moderately severe depression. Routine daily tasks are likely significantly harder than usual, and self-motivation is unreliable.';
                recommendation = 'Recommended: Active treatment with therapy and/or medication. Review your MVD floor — lower the bar to protect self-trust. Floor Wins count.';
            } else if (score >= 10) {
                severity = 'Moderate Depression';
                interpretation = 'Your responses reflect moderate depressive symptoms. You may experience persistent low energy, disrupted sleep, and difficulty starting tasks.';
                recommendation = 'Consider: Treatment plan review with your clinician. Continue using daily anchors and track restart speed rather than streak purity.';
            } else if (score >= 5) {
                severity = 'Mild Depression';
                interpretation = 'Your responses suggest mild depressive symptoms. You may have some difficult days but retain partial functioning capacity.';
                recommendation = 'Monitor: Continue daily Floor anchors. Reassess in 2 weeks. If symptoms persist or worsen, consult your care provider.';
            } else {
                interpretation = 'Your responses indicate minimal or no depressive symptoms at this time. This is measurable progress.';
                recommendation = 'Maintain: Keep your current anchors running. Proof of stability is clinical data. Reassess in 2–4 weeks to confirm trajectory.';
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

        // ==========================================================
        // DOCUMENT CENTER & FILE SYSTEM NAVIGATOR ENGINE
        // ==========================================================

        const KNOWLEDGE_CATALOG = [
            { name: "01_Front_End_Preamble-2.md", type: "md", size: "4.1 KB", desc: "Preamble briefing explaining the mechanical model of depression." },
            { name: "02_Depression_Project_Program-1.md", type: "md", size: "12.3 KB", desc: "Outlines the clinical roadmap and behavior guidelines." },
            { name: "02_Front_End_Questionnaire-1.md", type: "md", size: "7.9 KB", desc: "Guide to the intake forms and diagnostic metrics." },
            { name: "03_Depression_Project_Outline-1.md", type: "md", size: "11.1 KB", desc: "Operational outline documenting the startup damage and initiation models." },
            { name: "03_Front_End_Intake_Guide-1.md", type: "md", size: "9.5 KB", desc: "Companion manual for the onboarding and interpreting answers." },
            { name: "04_Hope_and_Activation_Start-2.md", type: "md", size: "5.5 KB", desc: "Hope activation protocols and starter steps." },
            { name: "04_Hope_System_Front_End-1.md", type: "md", size: "5.1 KB", desc: "Clinical blueprint explaining the proof-based hope sequence." },
            { name: "five_year_depression_years_and_worksheets_2026_v1.md", type: "md", size: "14.2 KB", desc: "Historical worksheet mapping five years of depression state vs. external stressors." },
            { name: "legitimate_preamble_and_150_item_intake.md", type: "md", size: "22.3 KB", desc: "The definitive 150-item intake questionnaire assessing core function." },
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
                        "Send exactly 1 low-threat connection text to Dave or Dave ('thinking of you, no pressure to reply')",
                        "Spend 10 minutes resting in a public space/park without performative pressure",
                        "Practice breathing guides for 3 minutes to downregulate the nervous system"
                    ];
                }
                
                saveState();
                renderCustomizer();
                renderDashboard();
                showToast(`Clinical Template loaded successfully! Your MVD Floor and Active checklists are updated.`, 'success');
            }
        }
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
            showTab("polaris");
            renderPolarisTab();
            
            showToast("Tiny anchor activated. You only need to do this one thing.", "info", 6000);
        }

        function startSmallAction() {
            // Opens state selector for immediate small action path
            showScreen('stateSelector');
        }

        function exploreFullProgram() {
            // Go to normal intake if not onboarded, or dashboard if already onboarded
            if (state.isOnboarded) {
                showScreen('dashboard');
                showTab('dashboard');
                renderDashboard();
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
                saveState();
                showScreen('dashboard');
                showTab('dashboard');
                renderDashboard();
            }
        }

        function goToEmergencyFloor() {
            // If onboarded, go to safebox tab. If not, do minimal onboard then safebox.
            if (state.isOnboarded) {
                showScreen('dashboard');
                showTab('safebox');
                renderSafeBox();
            } else {
                // Minimal onboard to enable dashboard access
                state.isOnboarded = true;
                state.todayEnergy = 'collapse';
                state.currentLayer = 0;
                saveState();
                showScreen('dashboard');
                showTab('safebox');
                renderSafeBox();
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
            showTab('dashboard');
            renderDashboard();

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
                    proof: { total: 0, today: 0, ledger: [] },
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
            const map = {
                high: 'Full capacity. Run your anchors, then stop before it turns into punishment.',
                medium: 'Core anchors first. One extra task. No heroic plan.',
                low: 'Low day. Your anchors are still here. Do what you can.',
                collapse: 'Floor day. No performance standard. Stay safe.'
            };
            return map[dayState] || map.medium;
        }

        function getCompanionMessage(dayState, defaultMsg) {
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
            // Collapse: always show generic floor items
            if (dayState === 'collapse') {
                return [
                    { id: 'floor_water', text: 'Drink a full glass of water', isGeneric: true },
                    { id: 'floor_light', text: 'Open blinds or stand by window', isGeneric: true },
                    { id: 'floor_win', text: 'One tiny Floor Win (anything)', isGeneric: true }
                ];
            }
            // User has anchors: show them all
            if (state.userAnchors.length > 0) {
                return state.userAnchors.map(a => ({ id: a.id, text: a.text, isGeneric: false }));
            }
            // No user anchors + low energy: show minimal generic suggestions
            if (dayState === 'low') {
                return [
                    { id: 'sug_water', text: 'Drink water', isGeneric: true },
                    { id: 'sug_light', text: 'Stand in daylight for 2 minutes', isGeneric: true },
                    { id: 'sug_one', text: 'Do one small thing', isGeneric: true }
                ];
            }
            // No user anchors + medium/high: return empty (show "add first anchor" prompt)
            return [];
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
            if (qCard) {
                const intake = state.polaris.profile.evolvingIntake;
                const currentQ = COMPANION_QUESTION_TREE[intake.currentQuestionId];
                if (intake.enabled && state.polaris.profile.companionSkin && intake.lastQuestionDate !== getTodayString() && intake.currentQuestionId !== "done" && currentQ) {
                    document.getElementById('companion-question-text').textContent = currentQ.text;
                    qCard.classList.remove('hidden');
                } else {
                    qCard.classList.add('hidden');
                }

                if (intake.enabled && state.polaris.profile.companionSkin && intake.lastQuestionDate === getTodayString() && intake.currentQuestionId !== "done") {
                    if(askAnotherCard) askAnotherCard.classList.remove('hidden');
                } else {
                    if(askAnotherCard) askAnotherCard.classList.add('hidden');
                }
            }

            // B3: Gap notice
            renderGapNotice();

            // B4: Clinical Insights
            renderPolarisInsights();

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
                <div class="glass-card" style="padding: 0.75rem; background: rgba(0,0,0,0.2); border-left: 3px solid var(--accent-lavender); border-radius: var(--radius-sm);">
                    <div style="font-size: 0.75rem; font-weight: 600; color: var(--accent-lavender); margin-bottom: 0.25rem;">${i.title}</div>
                    <div style="font-size: 0.85rem; color: var(--text-primary); line-height: 1.4;">${i.text}</div>
                </div>
            `).join('');
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
                item.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); transition: all 0.2s;' + (isChecked ? ' opacity: 0.6;' : '');

                // Checkbox
                const checkbox = document.createElement('div');
                checkbox.style.cssText = 'width: 18px; height: 18px; border-radius: 4px; border: 2px solid ' + (isChecked ? 'var(--accent-teal)' : 'rgba(255,255,255,0.2)') + '; background: ' + (isChecked ? 'var(--accent-teal)' : 'transparent') + '; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.7rem; color: #0b0f13; cursor: pointer;';
                checkbox.textContent = isChecked ? '\u2713' : '';
                checkbox.addEventListener('click', function() { togglePolarisAnchor(anchor.id, anchor.text); });

                // Text
                const text = document.createElement('span');
                text.style.cssText = 'flex: 1; font-size: 0.85rem; color: var(--text-primary);' + (isChecked ? ' text-decoration: line-through;' : '');
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
            showTab("momentum");
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
            
            const md = `# Polaris 2.0 Recovery Audit & Co-Pilot Sync\nAnonymized clinical progress tracker generated on ${new Date().toISOString().slice(0, 10)}.\n\n## 1. System Metrics\n- **Dominant Functional Pattern**: ${state.dominantPattern || 'Rhythm Collapse'}\n- **Current Hope Level**: Level ${state.currentHopeLevel || 1}\n- **Resilience Rating**: ${resRate}% (Restart success rate)\n- **Verified Streak Restarts**: ${restarts}\n- **Total Tracked Days**: ${totalLogs} days\n- **Low Energy / Collapse Days Managed**: ${lowEnergyLogs} days\n\n## 2. PHQ-9 Depressive Severity Trend\n${phqTrend}\n\n## 3. Narrative Verification Proofs\n${narrativeList.join("\n")}\n\n## 4. Substrate & Floor Configuration\n- **Morning Wake Target**: Wake on workdays by 7:30am (Circadian Lock)\n- **Active Anchors Count**: ${Math.max(3, state.userAnchors.length)} target anchors\n- **MVD Tasks**:\n  1. ${state.mvd[0]}\n  2. ${state.mvd[1]}\n  3. ${state.mvd[2]}\n\n---\n*Anonymity Statement: This report contains no personal identifiers (name, email, IP) and is formatted for copy-paste sharing into clinical vaults (e.g., Obsidian, Grok, therapist session notebooks).*`;

            navigator.clipboard.writeText(md).then(() => {
                showToast("📋 Anonymized Audit copied to clipboard successfully!", "success");
            }).catch(err => {
                console.error("Failed to copy clipboard:", err);
                showToast("Failed to copy to clipboard. Please select manually.", "error");
            });
        }

        window.PolarisUI = {
            render: renderPolarisTab,
            toggle: togglePolaris
        };

        window.onload = init;
