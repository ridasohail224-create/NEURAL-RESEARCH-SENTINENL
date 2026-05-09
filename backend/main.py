import os
import sys
import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional

# Add parent directory to sys.path so modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from modules.database import save_analysis, get_recent_scans
from modules.extractor import extract_text
from modules.parser import extract_metadata
from modules.verifier import verify_paper
from modules.hallucination import compute_hallucination_score
from modules.scoring import highlight_suspicious_sections

app = FastAPI(title="Neural Research Sentinel", version="1.0")

# Serve uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    filename: str
    query: str = ""
    response: str = ""

class VerifyCitationRequest(BaseModel):
    citation: str

@app.get("/")
def root():
    return {"message": "Neural Research Sentinel API is running."}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    return {"message": "File uploaded successfully", "filename": file.filename}

@app.post("/api/analyze")
async def analyze_content(req: AnalyzeRequest):
    file_path = f"uploads/{req.filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        print(f"[*] Starting analysis for: {req.filename}")
        
        print("[1/5] Extracting text...")
        text = extract_text(file_path)
        
        print("[2/5] Parsing metadata...")
        metadata = extract_metadata(text)
        
        print("[3/5] Verifying paper with scholarly APIs...")
        verification = verify_paper(metadata)
        
        print("[4/5] Computing hallucination score...")
        hallucination = compute_hallucination_score(metadata, verification, pasted_response=req.response, extracted_text=text)
        
        score = hallucination["hallucination_score"]
        if score <= 25:
            verdict = "VERIFIED"
        elif score <= 60:
            verdict = "SUSPICIOUS"
        else:
            verdict = "FABRICATED"
            
        print("[5/5] Highlighting suspicious sections...")
        suspicious_sections = highlight_suspicious_sections(text, score)
        
        # Integrity score is inverted logic
        integrity_score = 100 - score
        
        # Format the timestamp
        now = datetime.datetime.now()
        timestamp_str = now.strftime("%Y-%m-%d %H:%M:%S")
        
        result = {
            "filename": req.filename,
            "timestamp": timestamp_str,
            "integrity_score": integrity_score,
            "status": verdict,
            "issues": hallucination.get("explanations", []),
            "fabricated_claims": suspicious_sections,
            "metadata": metadata,
            "verification": verification,
            "hallucination": hallucination,
            "score": integrity_score
        }
        
        # Store in MongoDB
        try:
            save_analysis(result.copy())
        except Exception as e:
            print(f"Error saving to db: {e}")

        # Index for Semantic Search (Premium Feature)
        try:
            from modules.embeddings import add_document
            # Use metadata title and first 1000 chars of text for indexing
            index_text = f"{metadata.get('title', '')} {text[:1000]}"
            add_document(index_text, index_path=os.path.join("data", "faiss", "papers.index"))
        except Exception as e:
            print(f"Error indexing document: {e}")
            
        return result
        
    except Exception as e:
        import traceback
        error_msg = str(e)
        print(f"[!] Analysis Error: {error_msg}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis Error: {error_msg}")

@app.post("/api/verify-citation")
async def verify_citation(req: VerifyCitationRequest):
    return {
        "exists": False,
        "doi_valid": False,
        "matched_paper": None
    }

@app.get("/api/recent-scans")
async def get_recent_scans_api():
    try:
        scans = get_recent_scans(limit=10)
        # Add id for frontend mapping
        for idx, scan in enumerate(scans):
            if "id" not in scan:
                scan["id"] = str(idx)
        return scans
    except Exception as e:
        print(f"Error fetching recent scans: {e}")
        return []

# Serve static files for frontend (Must be at the very end)
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
