from pydantic import BaseModel
from fastapi import FastAPI
from app.extraction import extract_invoice
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
class ExtractRequest(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/extract_invoice")    
def extract_invoice_endpoint(request: ExtractRequest):
    extracted_data = extract_invoice(request.text)
    return extracted_data