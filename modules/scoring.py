from __future__ import annotations

from typing import List


def highlight_suspicious_sections(text: str, hallucination_score: int) -> List[str]:
    suspicious: List[str] = []
    if not text:
        return suspicious

    sentences = text.split(".")
    for sentence in sentences:
        s = sentence.strip()
        if not s:
            continue

        if len(s) > 250 and hallucination_score >= 26:
            suspicious.append(s)

        if "revolutionary" in s.lower() and hallucination_score >= 26:
            suspicious.append(s)

    # De-duplicate while preserving order
    seen = set()
    out = []
    for s in suspicious:
        if s not in seen:
            seen.add(s)
            out.append(s)
    return out[:20]

