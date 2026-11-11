import os
from pydantic import BaseModel
from fastapi import FastAPI,File, Header, UploadFile, HTTPException
from app.extraction import extract_invoice
from app.database import supabase
from supabase import create_client
from app.pdf import extract_text_from_pdf
from app.ledger import save_invoice_to_db
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",  "https://toremin.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_user_id(authorization: str) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    response = supabase.auth.get_user(token)
    if not response.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return response.user.id

class ExtractRequest(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/invoices")
def get_invoices(authorization: str = Header(None)):
    token = get_user_id(authorization)  # validates JWT
    # Use user's token so RLS filters to their rows only
    client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    client.auth.set_session(authorization.split(" ")[1], "dummy-refresh")
    response = client.table("invoices").select("*").execute()
    return response.data


@app.get("/invoices/overdue")
def get_overdue_invoices(authorization: str = Header(None)):
    get_user_id(authorization)
    today = date.today().isoformat()
    token = authorization.split(" ")[1]
    client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    client.auth.set_session(token, "dummy-refresh")
    response = client.table("invoices").select("*").in_("status", ["pending", "overdue"]).lt("due_date", today).order("due_date", desc=False).execute()
    return response.data

@app.post("/extract_invoice")    
def extract_invoice_endpoint(request: ExtractRequest, authorization: str = Header(None)):
    get_user_id(authorization)
    extracted_data = extract_invoice(request.text)
    return extracted_data

class ReminderRequest(BaseModel):
    sender_name: str

@app.post("/invoices/{invoice_id}/draft-reminder")
def draft_reminder_endpoint(invoice_id: str, request: ReminderRequest):
    response = supabase.table("invoices").select("*").eq("id", invoice_id).single().execute()
    invoice = response.data
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    from app.reminder import draft_reminder
    email = draft_reminder(invoice, request.sender_name)
    return {"subject": email.subject, "body": email.body}

@app.post("/extract_pdf")
async def extract_pdf_endpoint(file: UploadFile = File(...), authorization: str = Header(None)):
    get_user_id(authorization)
    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf(file_bytes)
    extracted_data = extract_invoice(extracted_text)
    return extracted_data

@app.post("/invoices/{invoice_id}/send-reminder")
def send_reminder_endpoint(invoice_id: str, request: ReminderRequest, authorization: str = Header(None)):
    get_user_id(authorization)
    response = supabase.table("invoices").select("*").eq("id", invoice_id).single().execute()
    invoice = response.data
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    from app.reminder import send_reminder
    result = send_reminder(invoice, request.sender_name)
    token = authorization.split(" ")[1]
    client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    client.auth.set_session(token, "dummy-refresh")
    client.table("invoices").update({"status": "chased"}).eq("id", invoice_id).execute()
    return result

@app.post("/invoices")
def save_invoice_endpoint(request: ExtractRequest, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    token = authorization.split(" ")[1]
    extracted_data = extract_invoice(request.text)
    save_invoice_to_db(extracted_data, user_id, token)
    return extracted_data

@app.post("/save_pdf")
async def save_pdf_endpoint(file: UploadFile = File(...), authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    token = authorization.split(" ")[1]
    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf(file_bytes)
    extracted_data = extract_invoice(extracted_text)
    save_invoice_to_db(extracted_data, user_id, token)
    return extracted_data

class StatusUpdate(BaseModel):
    status: str

@app.patch("/invoices/{invoice_id}/status")
def update_invoice_status(invoice_id: str, request: StatusUpdate, authorization: str = Header(None)):
    get_user_id(authorization)
    token = authorization.split(" ")[1]
    client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    client.auth.set_session(token, "dummy-refresh")
    client.table("invoices").update({"status": request.status}).eq("id", invoice_id).execute()
    return {"status": request.status}