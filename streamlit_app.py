import streamlit as st
import subprocess
import time
import os
import requests

st.set_page_config(page_title="Neural Research Sentinel", layout="wide")

# 1. Start Backend in background
if 'backend_started' not in st.session_state:
    st.info("Starting Backend Server...")
    # Run uvicorn in background
    subprocess.Popen(["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"])
    st.session_state.backend_started = True
    time.sleep(5) # Wait for startup

# 2. UI Header
st.title("🛡️ Neural Research Sentinel")
st.markdown("---")

# 3. Check Backend Health
try:
    response = requests.get("http://localhost:8000/")
    if response.status_code == 200:
        st.success("Backend is Online!")
    else:
        st.warning("Backend is starting...")
except:
    st.error("Waiting for Backend...")

# 4. Embed Frontend
# Since Streamlit Cloud doesn't easily serve static folders, 
# we point users to the local API or provide a Streamlit UI version.
st.info("Note: Streamlit Community Cloud is best for Python UIs. For the full Cyberpunk React UI, Hugging Face or Vercel is recommended.")

# Simple Streamlit fallback UI
st.header("Quick Scan (Streamlit Version)")
uploaded_file = st.file_uploader("Upload Research Document", type=['pdf', 'docx'])
query = st.text_input("Ask a question about the document")

if st.button("Initiate Forensic Scan"):
    if uploaded_file and query:
        with st.spinner("Analyzing..."):
            # Call our local FastAPI
            files = {"file": (uploaded_file.name, uploaded_file.getvalue())}
            up_res = requests.post("http://localhost:8000/api/upload", files=files)
            if up_res.status_code == 200:
                filename = up_res.json().get("filename")
                an_res = requests.post("http://localhost:8000/api/analyze", json={
                    "filename": filename,
                    "query": query,
                    "response": "Manual Scan"
                })
                if an_res.status_code == 200:
                    st.json(an_res.json())
                else:
                    st.error("Analysis Failed")
            else:
                st.error("Upload Failed")
    else:
        st.warning("Please upload a file and enter a query.")
