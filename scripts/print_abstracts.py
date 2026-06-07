import json

with open('expanded_pubmed_evidence.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for p in data['Micro-Habits & Tiny Steps']:
    print(f"PMID: {p['pmid']}")
    print(f"Title: {p['title']}")
    print(f"Abstract: {p['abstract'][:500]}")
    print("-" * 50)
