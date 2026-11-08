import os
from supabase import create_client
from app.schemas import InvoiceExtraction

def save_invoice_to_db(invoice: InvoiceExtraction, user_id: str, token: str):
    invoice_dict = invoice.model_dump()
    invoice_dict.pop('needs_review', None)
    if due_date := invoice_dict.get("due_date"):
        invoice_dict["due_date"] = due_date.isoformat()
    if issue_date := invoice_dict.get("issue_date"):
        invoice_dict["issue_date"] = issue_date.isoformat()
    if amount := invoice_dict.get("amount"):
        invoice_dict["amount"] = float(amount)
    invoice_dict["user_id"] = user_id

    # Use user's token so RLS knows who is inserting
    client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    client.auth.set_session(token, "dummy-refresh")
    response = client.table('invoices').insert(invoice_dict).execute()
    return response