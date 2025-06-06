from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests # Using requests to check URLs

app = FastAPI()

# Origins for CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    is_scam: bool
    confidence: float
    explanation: str

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """
    Analyzes the text for scams.
    This is a dummy implementation.
    """
    text = request.text.lower()
    is_scam = False
    confidence = 0.0
    explanation = "This is a basic check."

    scam_keywords = ["free money", "urgent", "act now", "limited time", "winner", "claim your prize", "guaranteed"]
    
    found_keywords = [keyword for keyword in scam_keywords if keyword in text]

    if found_keywords:
        is_scam = True
        confidence = 0.8
        explanation = f"Detected keywords often used in scams: {', '.join(found_keywords)}."

    # A simple URL check could be added here later
    # For now, just a placeholder
    if "http://" in text or "https://" in text:
        explanation += " Contains links, which should always be checked carefully before clicking."

    if not is_scam:
        explanation = "No obvious scam keywords found, but always be cautious."
        confidence = 0.2

    return AnalysisResponse(is_scam=is_scam, confidence=confidence, explanation=explanation)

@app.get("/")
def read_root():
    return {"message": "Anti-Scam AI Agent API is running."} 