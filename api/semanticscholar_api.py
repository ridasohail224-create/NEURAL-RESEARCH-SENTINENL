import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY")

def search_semantic_scholar(title):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        "query": title,
        "limit": 1,
        "fields": "title,authors,year,citationCount"
    }
    headers = {
        "x-api-key": API_KEY
    } if API_KEY and API_KEY != "your_semantic_scholar_key" else {}
    
    response = requests.get(url, params=params, headers=headers, timeout=10)
    if response.status_code != 200:
        return None
    data = response.json()
    if len(data.get("data", [])) == 0:
        return None
    return data["data"][0]
