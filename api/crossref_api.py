import requests

BASE_URL = "https://api.crossref.org/works"

def search_crossref(title):
    params = {
        "query.title": title,
        "rows": 1
    }
    response = requests.get(BASE_URL, params=params, timeout=10)
    if response.status_code != 200:
        return None
    items = response.json()["message"]["items"]
    if len(items) == 0:
        return None
    return items[0]
