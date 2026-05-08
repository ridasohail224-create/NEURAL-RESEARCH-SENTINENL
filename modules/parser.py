from __future__ import annotations

import re
from typing import Dict, List, Optional

import spacy

from .utils import safe_first_line_title, extract_year


# Load spaCy once
_nlp = None


def get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp


def _extract_abstract(text: str) -> str:
    # best-effort regex
    m = re.search(
        r"abstract\s*(.*?)(introduction|keywords|1\.|\n\s*1\s+|\Z)",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    return m.group(1).strip() if m else ""


def _extract_references(text: str) -> List[str]:
    m = re.search(
        r"(references|bibliography)(.*)",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not m:
        return []
    refs_text = m.group(2)
    # split on newlines; keep non-empty
    refs = [r.strip() for r in refs_text.splitlines() if r.strip()]
    return refs


def _extract_authors(text: str, max_authors: int = 10) -> List[str]:
    nlp = get_nlp()
    doc = nlp(text[:3000])
    persons = []
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            persons.append(ent.text)
    # unique while preserving order
    seen = set()
    out = []
    for p in persons:
        pl = p.lower()
        if pl not in seen:
            seen.add(pl)
            out.append(p)
        if len(out) >= max_authors:
            break
    return out


def extract_metadata(text: str) -> Dict:
    title = safe_first_line_title(text, max_chars=300)
    year = extract_year(text)
    abstract = _extract_abstract(text)
    authors = _extract_authors(text)
    references = _extract_references(text)

    return {
        "title": title,
        "authors": authors,
        "year": year,
        "abstract": abstract,
        "references": references,
    }

