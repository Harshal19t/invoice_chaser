from pydantic import BaseModel
from fastapi import FastAPI
from app.extraction import extract_invoice
from app.ledger import save_invoice_to_db
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

@app.post("/invoices")
def save_invoice_endpoint(request: ExtractRequest):
    extracted_data = extract_invoice(request.text)
    save_invoice_to_db(extracted_data)
    return extracted_data