import json

with open('expanded_pubmed_evidence.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

target_pmids = [
    '41985751', '41951156', # BA
    '41284534', # Chronotherapy
    '42234575', '42227754', # Resilience/Shame
    '42131188', '42126919'  # Digital CBT
]

for cat, papers in data.items():
    for p in papers:
        if p['pmid'] in target_pmids:
            print(f"[{cat}] PMID: {p['pmid']}")
            print(f"Title: {p['title']}")
            print(f"Abstract: {p['abstract'][:600]}")
            print("-" * 50)
