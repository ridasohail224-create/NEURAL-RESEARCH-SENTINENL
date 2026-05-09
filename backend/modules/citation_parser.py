"""
Citation Parser Module - Neural Research Sentinel
Extracts and validates citations from academic papers.
"""
import re
import requests
import os
from typing import List, Dict, Any

CROSSREF_EMAIL = os.getenv("CROSSREF_EMAIL", "sentinel@research.ai")

# Regex patterns for common citation styles
DOI_PATTERN = re.compile(r'\b(10\.\d{4,9}/[-._;()/:A-Z0-9]+)\b', re.IGNORECASE)
APA_PATTERN = re.compile(
    r'([A-Z][a-z]+(?:,\s[A-Z]\.)+(?:\s&\s[A-Z][a-z]+(?:,\s[A-Z]\.)+)*)\s*\((\d{4})\)\.\s*(.+?)\.\s*([A-Za-z\s]+),\s*(\d+)',
    re.DOTALL
)

def extract_citations(text: str) -> List[Dict[str, Any]]:
    """Extract all citations from text using regex patterns."""
    citations = []
    
    # Extract DOIs
    dois = DOI_PATTERN.findall(text)
    for doi in set(dois):
        citations.append({
            "type": "doi",
            "raw": doi,
            "doi": doi,
            "validated": False
        })
    
    # Extract bracketed references like [1], [2,3], [Smith, 2020]
    bracket_refs = re.findall(r'\[([A-Za-z0-9,\s]+)\]', text)
    for ref in bracket_refs:
        if any(c.isdigit() for c in ref):
            citations.append({
                "type": "bracket_ref",
                "raw": f"[{ref}]",
                "doi": None,
                "validated": False
            })
    
    # Extract numbered references from bibliography section
    bib_pattern = re.compile(
        r'(?:^|\n)\s*\[?\d+\]?\s*([A-Z][a-z]+.{10,200}(?:doi:|DOI:|https?://doi\.org/)?(10\.\d{4,9}/[^\s]+)?)',
        re.MULTILINE
    )
    bib_refs = bib_pattern.findall(text)
    for ref_text, doi in bib_refs:
        citations.append({
            "type": "bibliography",
            "raw": ref_text.strip(),
            "doi": doi if doi else None,
            "validated": False
        })
    
    return citations[:30]  # Limit to 30 citations max


def validate_doi(doi: str) -> Dict[str, Any]:
    """
    Validate a DOI using CrossRef API.
    Returns metadata if valid, error info if not.
    """
    try:
        url = f"https://api.crossref.org/works/{doi}"
        headers = {"User-Agent": f"NeuralSentinel/1.0 (mailto:{CROSSREF_EMAIL})"}
        resp = requests.get(url, headers=headers, timeout=8)
        
        if resp.status_code == 200:
            data = resp.json().get("message", {})
            authors = data.get("author", [])
            author_names = [
                f"{a.get('given', '')} {a.get('family', '')}".strip()
                for a in authors[:3]
            ]
            return {
                "valid": True,
                "title": data.get("title", [""])[0] if data.get("title") else "",
                "authors": author_names,
                "journal": data.get("container-title", [""])[0] if data.get("container-title") else "",
                "year": str(data.get("published", {}).get("date-parts", [[""]])[0][0]),
                "doi": doi,
                "source": "crossref"
            }
        else:
            return {"valid": False, "doi": doi, "error": f"CrossRef returned {resp.status_code}"}
    except requests.exceptions.Timeout:
        return {"valid": False, "doi": doi, "error": "CrossRef timeout"}
    except Exception as e:
        return {"valid": False, "doi": doi, "error": str(e)}


def check_fake_journal(journal_name: str) -> Dict[str, Any]:
    """
    Heuristic check for predatory/fake journals.
    """
    if not journal_name:
        return {"suspicious": False, "reason": "No journal name"}
    
    # Known suspicious patterns in journal names
    suspicious_keywords = [
        "international journal of advanced",
        "global journal of",
        "american journal of innovations",
        "european academic research",
        "world journal of science",
        "ijstr", "ijaer", "ijert",
    ]
    journal_lower = journal_name.lower()
    
    for keyword in suspicious_keywords:
        if keyword in journal_lower:
            return {
                "suspicious": True,
                "reason": f"Journal name matches known predatory pattern: '{keyword}'",
                "penalty": 20
            }
    
    # Very short journal names are suspicious
    if len(journal_name) < 5:
        return {
            "suspicious": True,
            "reason": "Suspiciously short journal name",
            "penalty": 10
        }
    
    return {"suspicious": False, "reason": "Journal name appears legitimate", "penalty": 0}


def parse_citation_metadata(citation_text: str) -> Dict[str, Any]:
    """Parse basic metadata from a raw citation string."""
    metadata = {
        "raw": citation_text,
        "year": None,
        "authors": [],
        "title": None,
        "doi": None
    }
    
    # Extract year
    year_match = re.search(r'\b(19|20)\d{2}\b', citation_text)
    if year_match:
        metadata["year"] = year_match.group()
    
    # Extract DOI
    doi_match = DOI_PATTERN.search(citation_text)
    if doi_match:
        metadata["doi"] = doi_match.group()
    
    return metadata
