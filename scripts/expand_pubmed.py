import urllib.request
import urllib.parse
import json
import xml.etree.ElementTree as ET
import time
import ssl

# Create unverified SSL context to handle self-signed certificates in corporate/sandboxed environments
ssl_context = ssl._create_unverified_context()

def search_pubmed(query, max_results=5):
    encoded_query = urllib.parse.quote_plus(query)
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={encoded_query}&retmode=json&retmax={max_results}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ssl_context) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data.get('esearchresult', {}).get('idlist', [])
    except Exception as e:
        print(f"Error searching for '{query}': {e}")
        return []

def fetch_details(pmids):
    if not pmids:
        return []
    ids = ",".join(pmids)
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={ids}&retmode=xml"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ssl_context) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            articles = []
            for article in root.findall('.//PubmedArticle'):
                pmid = article.find('.//PMID').text
                title = article.find('.//ArticleTitle')
                title_text = title.text if title is not None else "No Title"
                if title_text is None and title is not None:
                    title_text = "".join(title.itertext())
                
                abstract_nodes = article.findall('.//AbstractText')
                abstract_parts = []
                for node in abstract_nodes:
                    label = node.attrib.get('Label')
                    text = "".join(node.itertext())
                    if label:
                        abstract_parts.append(f"{label}: {text}")
                    else:
                        abstract_parts.append(text)
                abstract = "\n".join(abstract_parts) if abstract_parts else "No abstract available."
                
                journal = article.find('.//Journal/Title')
                journal_title = journal.text if journal is not None else "Unknown Journal"
                pub_date = article.find('.//JournalIssue/PubDate')
                year = "Unknown Year"
                if pub_date is not None:
                    year_node = pub_date.find('Year')
                    if year_node is not None:
                        year = year_node.text
                    else:
                        medline_node = pub_date.find('MedlineDate')
                        if medline_node is not None:
                            year = medline_node.text.split()[0]
                
                author_list = []
                for author in article.findall('.//AuthorList/Author'):
                    last_name = author.find('LastName')
                    initials = author.find('Initials')
                    if last_name is not None and initials is not None:
                        author_list.append(f"{last_name.text} {initials.text}")
                    elif last_name is not None:
                        author_list.append(last_name.text)
                
                articles.append({
                    'pmid': pmid,
                    'title': title_text,
                    'authors': author_list,
                    'journal': journal_title,
                    'year': year,
                    'abstract': abstract
                })
            return articles
    except Exception as e:
        print(f"Error fetching details for {ids}: {e}")
        return []

# Define more comprehensive queries to fetch expanded set of studies
queries = {
    'Behavioral Activation': '"behavioral activation" AND "depression" AND ("systematic review"[pt] OR "meta-analysis"[pt] OR "clinical trial"[pt])',
    'Circadian Synchronization': '("bright light therapy" OR "morning light" OR "circadian phase shift") AND "depression" AND ("systematic review"[pt] OR "meta-analysis"[pt] OR "clinical trial"[pt])',
    'Streak break shame vs Resilience': '("self-compassion" OR "acceptance and commitment therapy" OR "shame" OR "shame-free") AND "depression" AND ("psychology" OR "behavioral")',
    'Digital Mental Health Feasibility': '("digital intervention" OR "smartphone app" OR "mobile health") AND "depression" AND ("safety" OR "feasibility" OR "clinical study")',
    'Micro-Habits & Tiny Steps': '("implementation intentions" OR "habit formation" OR "micro-habits" OR "small changes") AND ("depression" OR "health behavior change")'
}

results = {}
for category, q in queries.items():
    print(f"Querying PubMed for '{category}'...")
    pmids = search_pubmed(q, max_results=5)
    print(f"Found PMIDs: {pmids}")
    details = fetch_details(pmids)
    results[category] = details
    time.sleep(1.5)

with open('expanded_pubmed_evidence.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print("Finished. Results written to expanded_pubmed_evidence.json")
