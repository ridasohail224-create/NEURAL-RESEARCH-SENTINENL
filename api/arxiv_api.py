import requests

def search_arxiv(title):
    url = f"http://export.arxiv.org/api/query?search_query=all:{title}&start=0&max_results=1"
    response = requests.get(url, timeout=10)
    return response.text
