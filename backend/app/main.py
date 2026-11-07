from pydantic import BaseModel
from fastapi import FastAPI,File, UploadFile
from app.extraction import extract_invoice
from app.database import supabase
from app.pdf import extract_text_from_pdf
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

@app.get("/invoices")
def get_invoices():
    response = supabase.table("invoices").select("*").order("created_at", desc=True).execute()
    return response.data

@app.post("/extract_invoice")    
def extract_invoice_endpoint(request: ExtractRequest):
    extracted_data = extract_invoice(request.text)
    return extracted_data

@app.post("/extract_pdf")
async def extract_pdf_endpoint(file: UploadFile = File(...)):
    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf(file_bytes)
    print("EXTRACTED TEXT:", extracted_text[:500])  # print first 500 chars
    extracted_data = extract_invoice(extracted_text)
    return extracted_data

@app.post("/invoices")
def save_invoice_endpoint(request: ExtractRequest):
    extracted_data = extract_invoice(request.text)
    save_invoice_to_db(extracted_data)
    return extracted_data

@app.post("/save_pdf")
async def save_pdf_endpoint(file: UploadFile = File(...)):
    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf(file_bytes)
    extracted_data = extract_invoice(extracted_text)
    save_invoice_to_db(extracted_data)
    return extracted_data