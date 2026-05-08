import os
from typing import Any, Dict

import gradio as gr

from modules.database import save_analysis
from modules.embeddings import add_document
from modules.extractor import extract_text
from modules.hallucination import compute_hallucination_score
from modules.parser import extract_metadata
from modules.scoring import highlight_suspicious_sections
from modules.verifier import verify_paper


def analyze_document(file_obj) -> Dict[str, Any]:
    # Gradio provides a tempfile-like object with .name
    file_path = file_obj.name

    text = extract_text(file_path)
    metadata = extract_metadata(text)

    verification = verify_paper(metadata)
    hallucination = compute_hallucination_score(metadata, verification)

    score = hallucination["hallucination_score"]
    if score <= 25:
        verdict = "REAL"
    elif score <= 60:
        verdict = "SUSPICIOUS"
    else:
        verdict = "FAKE"

    suspicious_sections = highlight_suspicious_sections(text, score)

    result = {
        "metadata": metadata,
        "verification": verification,
        "hallucination": hallucination,
        # Top-level convenience fields for the UI
        "hallucination_rate": hallucination.get("hallucination_rate"),
        "hallucination_score": hallucination.get("hallucination_score"),
        "verdict": verdict,
        "suspicious_sections": suspicious_sections,
    }


    # Optional: store embeddings for future retrieval (best-effort)
    try:
        add_document(metadata.get("title") or "paper", index_path=os.path.join("data", "faiss", "papers.index"))
    except Exception:
        pass

    # Store in MongoDB (best-effort)
    try:
        save_analysis(result)
    except Exception:
        pass

    return result


with gr.Blocks(title="Research Paper Authenticity Detector") as demo:
    gr.Markdown("# Research Paper Authenticity Detector")
    gr.Markdown("Upload a paper (PDF/DOCX/TXT). The app extracts metadata, verifies existence via scholarly APIs, and scores hallucination risk.")

    file_in = gr.File(label="Upload Research Paper", file_types=[".pdf", ".docx", ".txt"])
    out = gr.JSON(label="Analysis Result")

    btn = gr.Button("Analyze")
    btn.click(fn=analyze_document, inputs=file_in, outputs=out)


demo.launch()

