import json

try:
    with open('expanded_pubmed_evidence.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    for category, papers in data.items():
        print(f"\n--- CATEGORY: {category} ---")
        for p in papers:
            print(f"PMID: {p['pmid']}")
            print(f"Title: {p['title']}")
            print(f"Authors: {', '.join(p['authors'])}")
            print(f"Journal: {p['journal']} ({p['year']})")
            print("-" * 40)
except Exception as e:
    print("Error:", e)
