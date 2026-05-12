import streamlit as st
import subprocess
import time
import os
import requests
import json
from datetime import datetime

# --- Page Config ---
st.set_page_config(
    page_title="Neural Research Sentinel - Integrity Dashboard",
    page_icon="⚖️",
    layout="centered"
)

# --- App Header ---
st.title("⚖️ Neural Research Sentinel")
st.subheader("Professional Academic Integrity & Hallucination Detector")
st.markdown("---")

# --- Backend Management (Hidden in Sidebar) ---
with st.sidebar:
    st.header("⚙️ System Configuration")
    backend_url = st.text_input("Backend API URL", "http://127.0.0.1:8000")
    
    # Check Backend Health
    backend_online = False
    try:
        response = requests.get(f"{backend_url}/", timeout=2)
        if response.status_code == 200:
            st.success("✅ System Online")
            backend_online = True
    except:
        st.error("❌ System Offline")
        if st.button("Attempt to Start Server"):
            subprocess.Popen(["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"])
            st.info("Initializing...")
            time.sleep(3)
            st.rerun()

# --- Main Logic ---
st.info("Upload a research document and provide the AI response you wish to verify for hallucinations.")

# Input Section
with st.expander("Step 1: Document Ingestion", expanded=True):
    uploaded_file = st.file_uploader("Upload PDF or DOCX file", type=['pdf', 'docx'])
    query = st.text_input("Verification Query", placeholder="Enter the claim or question to verify...")

if st.button("RUN FORENSIC ANALYSIS", type="primary"):
    if not uploaded_file or not query:
        st.error("Error: Please upload a file and enter a query before scanning.")
    elif not backend_online:
        st.error("Error: Backend server is not reachable. Please check the sidebar.")
    else:
        with st.status("Performing Forensic Scan...") as status:
            try:
                # 1. Upload File
                st.write("Uploading document...")
                files = {"file": (uploaded_file.name, uploaded_file.getvalue())}
                up_res = requests.post(f"{backend_url}/api/upload", files=files)
                
                if up_res.status_code == 200:
                    filename = up_res.json().get("filename")
                    
                    # 2. Analyze Content
                    st.write("Analyzing for hallucinations and AI fabrications...")
                    # IMPORTANT: use the actual AI response text (if provided) rather than a placeholder.
                    # If the user did not provide AI text, send an empty string so the scorer has no pasted-response evidence.
                    ai_response = st.session_state.get("ai_response", "") if "ai_response" in st.session_state else ""
                    an_res = requests.post(
                        f"{backend_url}/api/analyze",
                        json={
                            "filename": filename,
                            "query": query,
                            "response": ai_response,
                        },
                    )
                    
                    if an_res.status_code == 200:
                        st.session_state.last_result = an_res.json()
                        st.session_state.last_filename = uploaded_file.name
                        status.update(label="Analysis Complete!", state="complete", expanded=False)
                    else:
                        st.error(f"Analysis Failed: {an_res.text}")
                else:
                    st.error("Upload Failed")
            except Exception as e:
                st.error(f"Technical Error: {e}")

# --- Display Results ---
if 'last_result' in st.session_state:
    res = st.session_state.last_result
    st.markdown("---")
    st.header("🔍 Forensic Analysis Report")
    
    # Meta Info
    m1, m2 = st.columns(2)
    m1.write(f"**Filename:** {st.session_state.get('last_filename', 'Unknown')}")
    m2.write(f"**Timestamp:** {res.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))}")
    
    # Summary Metrics
    col1, col2, col3 = st.columns(3)
    
    score = res.get('integrity_score', 0)
    col1.metric("Integrity Score", f"{score}%")
    
    status = res.get('status', 'UNKNOWN')
    col2.write("**Status Verdict**")
    if status == "AUTHENTIC":
        col2.success(status)
    elif status == "SUSPICIOUS":
        col2.warning(status)
    else:
        col2.error(status)
        
    h_rate = res.get('hallucination', {}).get('hallucination_rate', 0)
    col3.metric("Hallucination Rate", f"{h_rate}%", delta=f"{h_rate}%", delta_color="inverse")

    st.markdown("### Detailed Insights")
    
    # Findings
    with st.container(border=True):
        st.write("**Detected Forensic Issues:**")
        issues = res.get('issues', [])
        if issues:
            for issue in issues:
                st.write(f"- ⚠️ {issue}")
        else:
            st.write("No major issues detected.")

    # AI Fabrications
    st.write("**AI Fabricated Claims & Predictions:**")
    fab_claims = res.get('fabricated_claims', [])
    if fab_claims:
        for claim in fab_claims:
            st.error(f"DETECTED FABRICATION: {claim}")
    else:
        st.success("No clear AI fabrications detected in this sample.")

    # Verification Details
    with st.expander("Academic Verification Data"):
        ver = res.get('verification', {})
        st.write(f"**Paper found in scholarly databases:** {'✅ Yes' if ver.get('paper_exists') else '❌ No'}")
        st.write(f"**Author verification status:** {'✅ Match' if ver.get('author_match') else '❌ Mismatch'}")
        st.write(f"**Publication year match:** {'✅ Match' if ver.get('year_match') else '❌ Mismatch'}")
        st.write(f"**Source count:** {len(ver.get('sources', {}))}")

        # Per-factor confidence + score explanations
        halluc = res.get("hallucination", {})
        factor_confidences = halluc.get("factor_confidences", {})
        thresholds = halluc.get("thresholds", {})

        st.markdown("---")
        st.subheader("Why this score was assigned")

        weights = halluc.get("weights", {})
        explanations = halluc.get("explanations", [])
        if explanations:
            for item in explanations:
                st.write(f"- {item}")
        else:
            st.write("No specific explanations returned.")

        # Confidence table
        st.write("")
        st.write("**Confidence scores (higher = more suspicious):**")
        for k in ["paper_exists", "author_match", "year_match", "fake_references", "pasted_response"]:
            if k in factor_confidences:
                w = weights.get(k)
                st.write(f"- {k}: {factor_confidences.get(k, 0):.1f}%" + (f" (weight={w})" if w is not None else ""))

        if thresholds:
            st.write("")
            st.write("**Verdict thresholds:**")
            st.write(f"- REAL_MAX: {thresholds.get('REAL_MAX')}")
            st.write(f"- SUSPICIOUS_MAX: {thresholds.get('SUSPICIOUS_MAX')}")

    # Full Raw Data (Optional for advanced users)
    with st.expander("View Raw Forensic Data"):
        st.json(res)
else:
    st.info("System Ready. Please upload a file to begin.")

