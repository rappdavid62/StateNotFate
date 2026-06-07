import re

studies = [
    # Behavioral Activation
    {
        "category": "Behavioral Activation",
        "badge_class": "badge badge-high",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-teal-dim); color: var(--text-primary);",
        "link_color": "var(--accent-teal)",
        "title": "Moderators, mediators, and components of a standalone smartphone application for postpartum depression",
        "authors": "Borja T, et al.",
        "journal": "Archives of Women's Mental Health",
        "year": "2026",
        "findings": "App-based depression symptom reduction was directly mediated by increases in Behavioral Activation (BA) and Response-Contingent Positive Reinforcement. Higher engagement with specific app components led to greater symptom reduction.",
        "evidence_category": "Evidence",
        "pmid": "42171809"
    },
    {
        "category": "Behavioral Activation",
        "badge_class": "badge badge-high",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-teal-dim); color: var(--text-primary);",
        "link_color": "var(--accent-teal)",
        "title": "Smartphone CBT engagement and depressive symptoms: secondary analysis of the RESiLIENT trial",
        "authors": "Luo Y, et al.",
        "journal": "Psychological Medicine",
        "year": "2026",
        "findings": "Early lesson engagement (weeks 0-3) drives sustained, long-term reduction in PHQ-9 depressive symptoms up to 26 weeks, showing that immediate 'first moves' are key predictors of recovery.",
        "evidence_category": "Evidence",
        "pmid": "42124392"
    },
    {
        "category": "Behavioral Activation",
        "badge_class": "badge badge-high",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-teal-dim); color: var(--text-primary);",
        "link_color": "var(--accent-teal)",
        "title": "Behavioral activation for smoking cessation may improve bodily pain in adults with lifetime major depressive disorder",
        "authors": "Powers JM, et al.",
        "journal": "Journal of Affective Disorders",
        "year": "2026",
        "findings": "Behavioral activation (BA) produced clinically meaningful reductions in chronic bodily pain in adults with lifetime major depressive disorder, showing transdiagnostic metabolic/physical benefits.",
        "evidence_category": "Evidence",
        "pmid": "42025640"
    },
    {
        "category": "Behavioral Activation",
        "badge_class": "badge badge-high",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-teal-dim); color: var(--text-primary);",
        "link_color": "var(--accent-teal)",
        "title": "Effects of an imagery-enhanced behavioral activation intervention on depressive symptoms and activation levels: Results from the WIMBA-trial",
        "authors": "Heise M, et al.",
        "journal": "Journal of Affective Disorders",
        "year": "2026",
        "findings": "Using mental imagery (rather than verbal reasoning) to schedule rewarding activities significantly increases anticipated pleasure, daily activation levels, and symptom reduction in depression.",
        "evidence_category": "Evidence",
        "pmid": "41985751"
    },
    {
        "category": "Behavioral Activation",
        "badge_class": "badge badge-high",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-teal-dim); color: var(--text-primary);",
        "link_color": "var(--accent-teal)",
        "title": "Behavioral activation and prevention of depression in at-risk adults: A meta-analysis",
        "authors": "Rochelle NS, Hoyer J",
        "journal": "Journal of Affective Disorders",
        "year": "2026",
        "findings": "Meta-analysis confirming that structured behavioral activation (combining activity scheduling and monitoring) significantly reduces subthreshold symptoms and acts as an effective preventive measure.",
        "evidence_category": "Evidence",
        "pmid": "41951156"
    },
    # Circadian Sync
    {
        "category": "Circadian Sync",
        "badge_class": "badge badge-medium",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-lavender-dim); color: var(--text-primary);",
        "link_color": "var(--accent-lavender)",
        "title": "The impact of bright light therapy on non-motor symptoms in patients with Parkinson's disease",
        "authors": "Geng J, et al.",
        "journal": "Frontiers in Neurology",
        "year": "2026",
        "findings": "Systematic review confirming bright light therapy (BLT) improves sleep disturbances and serves as a highly practical non-pharmacological option for home self-management.",
        "evidence_category": "Evidence",
        "pmid": "41853181"
    },
    {
        "category": "Circadian Sync",
        "badge_class": "badge badge-medium",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-lavender-dim); color: var(--text-primary);",
        "link_color": "var(--accent-lavender)",
        "title": "The impact of timing on bright light therapy: Alleviating anhedonia and circadian rhythm disturbances",
        "authors": "Li X, et al.",
        "journal": "Journal of Affective Disorders",
        "year": "2026",
        "findings": "Morning bright light therapy (BLT) at 10,000 lux significantly alleviates physical anhedonia by shifting the melatonin peak phase, proving the biological value of morning light exposure.",
        "evidence_category": "Evidence",
        "pmid": "41785919"
    },
    {
        "category": "Circadian Sync",
        "badge_class": "badge badge-medium",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-lavender-dim); color: var(--text-primary);",
        "link_color": "var(--accent-lavender)",
        "title": "The effect of bright light therapy on glycemic control and cortisol rhythmicity in depression",
        "authors": "Fang J, et al.",
        "journal": "Frontiers in Psychiatry",
        "year": "2026",
        "findings": "Depressed patients receiving BLT showed significant reductions in fasting blood glucose and cortisol mesor, indicating BLT directly regulates cortisol rhythmicity and metabolic health.",
        "evidence_category": "Evidence",
        "pmid": "41756577"
    },
    {
        "category": "Circadian Sync",
        "badge_class": "badge badge-medium",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-lavender-dim); color: var(--text-primary);",
        "link_color": "var(--accent-lavender)",
        "title": "Establishing Triple Chronotherapy as a fast-acting add-on treatment for depression in inpatient settings",
        "authors": "Ferrara P, et al.",
        "journal": "Journal of Affective Disorders",
        "year": "2026",
        "findings": "Adjunctive chronotherapy (combining light therapy, sleep deprivation, and sleep phase advance) produces rapid, fast-acting antidepressant effects by restoring disrupted biological circadian rhythms.",
        "evidence_category": "Evidence",
        "pmid": "41284534"
    },
    # Shame & Resilience
    {
        "category": "Shame & Resilience",
        "badge_class": "badge badge-collapse",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: rgba(230, 40, 60, 0.15); color: var(--accent-red); border: 1px solid rgba(230, 40, 60, 0.2);",
        "link_color": "var(--accent-red)",
        "title": "From Interpersonal Experiences to Proximal Minority Processes and Mental Health",
        "authors": "Seabra D, et al.",
        "journal": "International Journal of Sexual Health",
        "year": "2026",
        "findings": "Identified profiles of resilience vs. shame, emphasizing that early safeness/warmth memories and traumatic shame shape mental health, validating self-compassion models.",
        "evidence_category": "Evidence",
        "pmid": "42205348"
    },
    {
        "category": "Shame & Resilience",
        "badge_class": "badge badge-collapse",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: rgba(230, 40, 60, 0.15); color: var(--accent-red); border: 1px solid rgba(230, 40, 60, 0.2);",
        "link_color": "var(--accent-red)",
        "title": "Hemispheric dissociation of anxiety and autonomic arousal during lateral visual field viewing",
        "authors": "Schiffer F.",
        "journal": "Frontiers in Human Neuroscience",
        "year": "2026",
        "findings": "Case report showing rapid shifts in shame, self-appraisal, and pulse rate (85 vs 105 bpm) when viewing through left vs. right visual fields, indicating distinct sub-selves exist.",
        "evidence_category": "Inference",
        "pmid": "42220893"
    },
    {
        "category": "Shame & Resilience",
        "badge_class": "badge badge-collapse",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: rgba(230, 40, 60, 0.15); color: var(--accent-red); border: 1px solid rgba(230, 40, 60, 0.2);",
        "link_color": "var(--accent-red)",
        "title": "Comparative Effectiveness of Resilience-Focused Psychological Interventions: A Network Meta-Analysis",
        "authors": "Janitra FE, et al.",
        "journal": "Psycho-Oncology",
        "year": "2026",
        "findings": "Network meta-analysis ranking resilience-focused psychological therapies, demonstrating their direct and robust efficacy in building clinical resilience and mitigating depression/anxiety.",
        "evidence_category": "Evidence",
        "pmid": "42234575"
    },
    {
        "category": "Shame & Resilience",
        "badge_class": "badge badge-collapse",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: rgba(230, 40, 60, 0.15); color: var(--accent-red); border: 1px solid rgba(230, 40, 60, 0.2);",
        "link_color": "var(--accent-red)",
        "title": "Understanding the Influence of Experiential Psychotherapy Among Men: A Systematic Review",
        "authors": "Ayot HK.",
        "journal": "International Journal of Offender Therapy and Comparative Criminology",
        "year": "2026",
        "findings": "Systematic review of experiential therapies (such as ACT and somatic mindfulness) showing significant reductions in emotional dysregulation and traumatic shame compared to verbal-only therapy.",
        "evidence_category": "Evidence",
        "pmid": "42227754"
    },
    # mHealth Safety
    {
        "category": "mHealth Safety",
        "badge_class": "badge badge-low",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-orange-dim); color: var(--text-primary);",
        "link_color": "var(--accent-orange)",
        "title": "Mobile health for psychosocial screening: potential, challenges, and future directions",
        "authors": "Hernawaty T, et al.",
        "journal": "Cancer Management and Research",
        "year": "2026",
        "findings": "mHealth platforms demonstrate robust feasibility and high acceptability for continuous screening, tracking distress, and enhancing patient-provider triage.",
        "evidence_category": "Evidence",
        "pmid": "42181584"
    },
    {
        "category": "mHealth Safety",
        "badge_class": "badge badge-low",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-orange-dim); color: var(--text-primary);",
        "link_color": "var(--accent-orange)",
        "title": "Comparison of mHealth-supported and centre-based exercise delivery models: a randomized controlled trial",
        "authors": "Yang X, et al.",
        "journal": "BMC Cardiovascular Disorders",
        "year": "2026",
        "findings": "Home-based mHealth platform with real-time feedback and monitoring resulted in significantly greater physiological improvement and lower anxiety/depression than center-based models.",
        "evidence_category": "Evidence",
        "pmid": "42177443"
    },
    {
        "category": "mHealth Safety",
        "badge_class": "badge badge-low",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-orange-dim); color: var(--text-primary);",
        "link_color": "var(--accent-orange)",
        "title": "Safety and preliminary efficacy of Aurora: a pilot digital CBT intervention in Mexico",
        "authors": "Zárate E, et al.",
        "journal": "Frontiers in Psychiatry",
        "year": "2026",
        "findings": "Evaluated the safety of the digital CBT intervention 'Aurora', reporting zero treatment-related adverse events and high participant safety when used as adjunctive support.",
        "evidence_category": "Evidence",
        "pmid": "42131188"
    },
    {
        "category": "mHealth Safety",
        "badge_class": "badge badge-low",
        "badge_style": "display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 0.5rem; background: var(--accent-orange-dim); color: var(--text-primary);",
        "link_color": "var(--accent-orange)",
        "title": "iCARE Self-Guided Digital Intervention: Formative Research Using User-Centered Design",
        "authors": "Marti-Castaner M, et al.",
        "journal": "JMIR Formative Research",
        "year": "2026",
        "findings": "User-centered design findings demonstrating high user engagement and safety protocols in a self-guided mobile health application designed for stepped mental health care.",
        "evidence_category": "Evidence",
        "pmid": "42126919"
    }
]

html_cards = []
for i, s in enumerate(studies, 1):
    card_html = f"""            <!-- Study {i}: {s['title'][:30]} -->
            <article class="source-card" data-source-card style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                <div>
                    <span class="{s['badge_class']}" style="{s['badge_style']}">{s['category']}</span>
                    <h2 style="font-size: 1.05rem; line-height: 1.35; margin-bottom: 0.5rem; font-weight: 600;">{s['title']}</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">{s['authors']} — <em>{s['journal']}, {s['year']}</em></p>
                    <p style="font-size: 0.88rem; line-height: 1.45; color: var(--text-secondary); margin-bottom: 1rem;"><strong>Clinical Findings:</strong> {s['findings']}</p>
                </div>
                <div style="border-top: 1px solid var(--card-border); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
                    <span style="color: var(--text-muted);">Evidence Category: <strong>{s['evidence_category']}</strong></span>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/{s['pmid']}" target="_blank" style="color: {s['link_color']}; text-decoration: none; font-weight: 600;">PMID: {s['pmid']} ➔</a>
                </div>
            </article>"""
    html_cards.append(card_html)

new_cards_content = "\n\n".join(html_cards)

with open('evidence.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'(<section class="source-list"[^>]*>).*?(</section>)'
replaced, count = re.subn(pattern, r'\1\n' + new_cards_content + r'\n            \2', content, flags=re.DOTALL)

if count > 0:
    with open('evidence.html', 'w', encoding='utf-8') as f:
        f.write(replaced)
    print(f"Successfully injected {len(studies)} studies into evidence.html")
else:
    print("Error: Could not locate the target source-list section in evidence.html")
