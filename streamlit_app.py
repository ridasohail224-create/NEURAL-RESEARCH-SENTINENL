import streamlit as st
import subprocess
import time
import os
import requests
import json

# --- Page Config ---
st.set_page_config(
    page_title="NEURAL SENTINEL | Forensic Dashboard",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Custom CSS for Cyberpunk Theme ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Inter:wght@400;700;900&display=swap');
    
    :root {
        --cyber-bg: #0a0a0f;
        --cyber-neon: #00f0ff;
        --cyber-alert: #ff003c;
        --cyber-success: #00ff66;
    }
    
    .stApp {
        background-color: var(--cyber-bg);
        color: #e0e0e0;
        font-family: 'Inter', sans-serif;
    }
    
    .main-header {
        font-size: 3rem;
        font-weight: 900;
        letter-spacing: -2px;
        background: linear-gradient(90deg, #00f0ff, #7000ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
    }
    
    .glass-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(0, 240, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        backdrop-filter: blur(10px);
        margin-bottom: 20px;
    }
    
    .metric-value {
        font-family: 'Fira Code', monospace;
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--cyber-neon);
    }
    
    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        text-transform: uppercase;
    }
    </style>
""", unsafe_allow_html=True)

# --- Sidebar ---
with st.sidebar:
    st.image("https://img.icons8.com/nolan/128/security-shield.png", width=80)
    st.markdown("# NEURAL SENTINEL")
    st.markdown("`VERSION 2.0.4-PRO`")
    st.divider()
    st.markdown("### 📊 System Status")
    
    # Check Backend Health
    backend_online = False
    try:
        response = requests.get("http://127.0.0.1:8000/", timeout=2)
        if response.status_code == 200:
            st.success("ONLINE")
            backend_online = True
    except:
        st.error("OFFLINE")
        if st.button("Start Backend Server"):
            subprocess.Popen(["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"])
            st.info("Starting...")
            time.sleep(3)
            st.rerun()

# --- Main Dashboard ---
st.markdown('<h1 class="main-header">FORENSIC ANALYSIS TERMINAL</h1>', unsafe_allow_html=True)
st.markdown("`SECURE NODE: 77-AX-09 | AI-DRIVEN INTEGRITY VERIFICATION`")

col1, col2 = st.columns([1, 2])

with col1:
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    st.subheader("📥 Document Ingestion")
    uploaded_file = st.file_uploader("Upload Research Paper (PDF/DOCX)", type=['pdf', 'docx'])
    query = st.text_input("Analysis Query", placeholder="e.g., Verify methodology and citations...")
    
    if st.button("INITIATE FORENSIC SCAN", use_container_width=True):
        if not uploaded_file or not query:
            st.warning("Please provide both a file and a query.")
        elif not backend_online:
            st.error("Backend is offline. Please start it from the sidebar.")
        else:
            with st.spinner("Decoding Neural Patterns..."):
                try:
                    # Upload
                    files = {"file": (uploaded_file.name, uploaded_file.getvalue())}
                    up_res = requests.post("http://127.0.0.1:8000/api/upload", files=files)
                    if up_res.status_code == 200:
                        filename = up_res.json().get("filename")
                        # Analyze
                        an_res = requests.post("http://127.0.0.1:8000/api/analyze", json={
                            "filename": filename,
                            "query": query,
                            "response": "Manual Scan Triggered via Streamlit Terminal"
                        })
                        if an_res.status_code == 200:
                            st.session_state.result = an_res.json()
                            st.balloons()
                        else:
                            st.error(f"Analysis Failed: {an_res.text}")
                    else:
                        st.error("Upload Failed")
                except Exception as e:
                    st.error(f"Error: {e}")
    st.markdown('</div>', unsafe_allow_html=True)

with col2:
    if 'result' in st.session_state:
        res = st.session_state.result
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        
        # Header Row
        hcol1, hcol2, hcol3 = st.columns(3)
        with hcol1:
            st.markdown(f"### Score\n<div class='metric-value'>{res.get('integrity_score', 0)}%</div>", unsafe_allow_html=True)
        with hcol2:
            status = res.get('status', 'UNKNOWN')
            color = "#00ff66" if status == "AUTHENTIC" else "#ffc107" if status == "SUSPICIOUS" else "#ff003c"
            st.markdown(f"### Status\n<div style='color: {color}; font-weight: bold; font-size: 1.5rem;'>{status}</div>", unsafe_allow_html=True)
        with hcol3:
            h_rate = res.get('hallucination', {}).get('hallucination_rate', 0)
            st.markdown(f"### Hallucination\n<div style='color: #ff003c; font-weight: bold; font-size: 1.5rem;'>{h_rate}%</div>", unsafe_allow_html=True)
        
        st.divider()
        
        # Tabs for details
        tab1, tab2, tab3 = st.tabs(["🔍 Forensic Insights", "📚 Citation Check", "🤖 AI Consistency"])
        
        with tab1:
            st.markdown("#### Detected Issues")
            for issue in res.get('issues', []):
                st.markdown(f"- ⚠️ {issue}")
            
            if res.get('fabricated_claims'):
                st.markdown("#### Potential Fabrications")
                for claim in res.get('fabricated_claims', []):
                    st.error(claim)
                    
        with tab2:
            ver = res.get('verification', {})
            st.markdown(f"**Paper Exists:** {'✅ Yes' if ver.get('paper_exists') else '❌ No'}")
            st.markdown(f"**Author Match:** {'✅ Yes' if ver.get('author_match') else '❌ No'}")
            st.markdown(f"**Citation Validity:** {ver.get('citation_validity', 0)}%")
            
        with tab3:
            hal = res.get('hallucination', {})
            st.markdown("#### Logical Explanations")
            for exp in hal.get('explanations', []):
                st.info(exp)
                
        st.markdown('</div>', unsafe_allow_html=True)
    else:
        st.info("Awaiting Input... Upload a document and click 'Initiate Forensic Scan' to begin analysis.")

