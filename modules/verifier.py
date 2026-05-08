from __future__ import annotations

from typing import Any, Dict, List, Optional

from api.crossref_api import search_crossref
from api.semanticscholar_api import search_semantic_scholar
from api.arxiv_api import search_arxiv


def _authors_to_strings(authors: List[Dict[str, Any]]) -> List[str]:
    out = []
    for a in authors or []:
        given = a.get("given", "")
        family = a.get("family", "")
        full = f"{given} {family}".strip()
        if full:
            out.append(full)
    return out


def _match_authors(input_authors: List[str], candidate_authors: List[str]) -> bool:
    if not input_authors or not candidate_authors:
        return False
    matches = 0
    for ia in input_authors:
        for ca in candidate_authors:
            if ia.lower() in ca.lower() or ca.lower() in ia.lower():
                matches += 1
                break
    return matches > 0


def verify_paper(metadata: Dict) -> Dict:
    title = metadata.get("title")
    input_authors = metadata.get("authors") or []
    input_year = str(metadata.get("year") or "")

    result = {
        "paper_exists": False,
        "author_match": False,
        "year_match": False,
        "citation_validity": 0,
        "issues": [],
        "sources": {},
    }

    if not title:
        result["issues"].append("Missing title; cannot verify")
        return result

    # CrossRef
    crossref_data = search_crossref(title)
    if crossref_data:
        result["paper_exists"] = True
        result["sources"]["crossref"] = {
            "DOI": crossref_data.get("DOI"),
            "published": crossref_data.get("published-print") or crossref_data.get("published-online"),
        }

        crossref_authors = []
        for a in crossref_data.get("author", []):
            # crossref uses list of objects {given, family}
            crossref_authors.append(" ".join([a.get("given", ""), a.get("family", "")]).strip())

        result["author_match"] = _match_authors(input_authors, crossref_authors)

        # year
        year_block = crossref_data.get("published-print") or crossref_data.get("published-online")
        if year_block and year_block.get("date-parts"):
            real_year = str(year_block["date-parts"][0][0])
            if input_year and real_year == input_year:
                result["year_match"] = True
            elif input_year:
                result["issues"].append("Publication year mismatch (CrossRef)")

    else:
        result["issues"].append("Paper not found in CrossRef")

    # Semantic Scholar (optional enhancement)
    try:
        ss_data = search_semantic_scholar(title)
    except Exception:
        ss_data = None

    if ss_data:
        result["sources"]["semanticscholar"] = {
            "paperId": ss_data.get("paperId"),
            "year": ss_data.get("year"),
        }
        result["paper_exists"] = result["paper_exists"] or True
        ss_authors = [a.get("name") for a in ss_data.get("authors", []) if a.get("name")]
        if not result["author_match"]:
            result["author_match"] = _match_authors(input_authors, ss_authors)
        if not result["year_match"] and ss_data.get("year") and input_year:
            if str(ss_data.get("year")) == input_year:
                result["year_match"] = True

    # arXiv (best-effort text search)
    try:
        arxiv_xml = search_arxiv(title)
        if arxiv_xml and "<entry>" in arxiv_xml:
            result["sources"]["arxiv"] = {"hint": "Entry found"}
            result["paper_exists"] = True
    except Exception:
        pass

    return result

