from __future__ import annotations

from typing import Dict, List

from .utils import is_malformed_reference


def compute_hallucination_score(metadata: Dict, verification_result: Dict, pasted_response: str = "", extracted_text: str = "") -> Dict:
    """Compute a 0-100 hallucination risk score.

    Also returns `hallucination_rate` as a probability-like percentage derived from the same evidence.
    """

    score = 0
    explanations: List[str] = []

    # 1. Evidence from scholarly databases
    if not verification_result.get("paper_exists"):
        score += 40
        explanations.append("Paper not found in scholarly databases")

    if not verification_result.get("author_match"):
        score += 20
        explanations.append("Author mismatch detected")

    if not verification_result.get("year_match"):
        score += 15
        explanations.append("Publication year mismatch")

    # 2. Fake/malformed reference heuristic
    fake_citations = 0
    refs = metadata.get("references") or []
    for ref in refs[:20]:
        if is_malformed_reference(ref):
            fake_citations += 1

    citation_penalty = min(fake_citations * 2, 25)
    score += citation_penalty

    if citation_penalty > 0:
        explanations.append(f"{fake_citations} suspicious references detected")

    # 3. Pasted Response Comparison (AI Hallucination Detection)
    if pasted_response and extracted_text:
        # Simple heuristic: check if significant keywords from response are missing in source
        # For a full system, we would use semantic similarity here.
        # But for now, let's add a placeholder penalty if the response is very long but the source is short.
        if len(pasted_response) > len(extracted_text) * 1.5:
            score += 20
            explanations.append("Response contains significantly more detail than source document (potential fabrication)")

    score = min(score, 100)

    # Treat hallucination_rate as the same 0-100 scale
    hallucination_rate = float(score)

    return {
        "hallucination_score": score,
        "hallucination_rate": hallucination_rate,
        "explanations": explanations,
        "fake_citations": fake_citations,
    }


