from __future__ import annotations

from typing import Dict, List

from .utils import is_malformed_reference


DEFAULT_VERDICT_THRESHOLDS = {
    "REAL_MAX": 25,
    "SUSPICIOUS_MAX": 60,
}

DEFAULT_FACTOR_WEIGHTS = {
    "paper_exists": 40,
    "author_match": 20,
    "year_match": 15,
    "fake_references": 25,  # capped
    "pasted_response": 20,
}


def compute_hallucination_score(
    metadata: Dict,
    verification_result: Dict,
    pasted_response: str = "",
    extracted_text: str = "",
) -> Dict:
    """Compute a 0-100 hallucination risk score.

    Returns `explanations` and per-factor `factor_confidences` so the UI can show why the score was assigned.
    """

    weights = DEFAULT_FACTOR_WEIGHTS

    score = 0
    explanations: List[str] = []

    # Confidence is expressed as 0..100 where higher means *more suspicious*.
    factor_confidences: Dict[str, float] = {
        "paper_exists": 0.0,
        "author_match": 0.0,
        "year_match": 0.0,
        "fake_references": 0.0,
        "pasted_response": 0.0,
    }

    # 1. Evidence from scholarly databases
    if not verification_result.get("paper_exists"):
        score += weights["paper_exists"]
        explanations.append("Paper not found in scholarly databases")
        factor_confidences["paper_exists"] = 100.0
    else:
        factor_confidences["paper_exists"] = 10.0

    if not verification_result.get("author_match"):
        score += weights["author_match"]
        explanations.append("Author mismatch detected")
        factor_confidences["author_match"] = 100.0
    else:
        factor_confidences["author_match"] = 10.0

    if not verification_result.get("year_match"):
        score += weights["year_match"]
        explanations.append("Publication year mismatch")
        factor_confidences["year_match"] = 100.0
    else:
        factor_confidences["year_match"] = 10.0

    # 2. Fake/malformed reference heuristic
    fake_citations = 0
    refs = metadata.get("references") or []
    for ref in refs[:20]:
        if is_malformed_reference(ref):
            fake_citations += 1

    # Convert count to a 0..100 suspiciousness, then to the capped weight.
    # max_fake_citations=12 => 100% confidence (linear)
    max_fake_citations = 12
    fake_ref_conf = min(fake_citations / max_fake_citations, 1.0) * 100.0 if max_fake_citations else 0.0
    factor_confidences["fake_references"] = float(fake_ref_conf)

    citation_penalty = min((fake_ref_conf / 100.0) * weights["fake_references"], weights["fake_references"])
    score += citation_penalty

    if fake_citations > 0:
        explanations.append(f"{fake_citations} suspicious references detected")

    # 3. Pasted Response Comparison (AI Hallucination Detection)
    if pasted_response and extracted_text:
        # Placeholder heuristic (length-based)
        if len(pasted_response) > len(extracted_text) * 1.5:
            score += weights["pasted_response"]
            explanations.append(
                "Response contains significantly more detail than source document (potential fabrication)"
            )
            factor_confidences["pasted_response"] = 100.0
        else:
            factor_confidences["pasted_response"] = 10.0
    else:
        # No evidence => neutral confidence (low suspicion)
        factor_confidences["pasted_response"] = 5.0

    score = min(score, 100)

    # Treat hallucination_rate as the same 0-100 scale
    hallucination_rate = float(score)

    return {
        "hallucination_score": score,
        "hallucination_rate": hallucination_rate,
        "explanations": explanations,
        "fake_citations": fake_citations,
        "factor_confidences": factor_confidences,
        "weights": weights,
        "thresholds": DEFAULT_VERDICT_THRESHOLDS,
    }





