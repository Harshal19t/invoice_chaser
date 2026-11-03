from pydantic import BaseModel
from fastapi import FastAPI
from app.extraction import extract_invoice

app = FastAPI()

class ExtractRequest(BaseModel):
    extracted_text: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/extract_invoice")    
def extract_invoice_endpoint(request: ExtractRequest):
    extracted_data = extract_invoice(request.extracted_text)
    return extracted_data