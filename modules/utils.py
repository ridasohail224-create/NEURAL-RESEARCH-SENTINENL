import os
import re
from typing import Optional


def safe_first_line_title(text: str, max_chars: int = 300) -> Optional[str]:
    if not text:
        return None
    first_line = text.splitlines()[0].strip()
    if not first_line:
        return None
    return first_line[:max_chars]


def extract_year(text: str) -> Optional[str]:
    if not text:
        return None
    m = re.search(r"(19|20)\d{2}", text)
    return m.group(0) if m else None


def normalize_text(text: str) -> str:
    if not text:
        return ""
    # collapse whitespace
    return re.sub(r"\s+", " ", text).strip()


def is_malformed_reference(ref: str) -> bool:
    ref = (ref or "").strip()
    if len(ref) < 10:
        return True
    # crude checks
    if re.search(r"^(\[?\d+\]?)\s*$", ref):
        return True
    if re.search(r"(http(s)?://)?\s*$", ref) and len(ref) < 25:
        return True
    return False

