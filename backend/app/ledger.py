from app.database import supabase
from app.schemas import InvoiceExtraction

def save_invoice_to_db(invoice: InvoiceExtraction):
    invoice_dict = invoice.model_dump()
    invoice_dict.pop('needs_review', None)
    if due_date := invoice_dict.get("due_date"):
        invoice_dict["due_date"] = due_date.isoformat()
    if issue_date := invoice_dict.get("issue_date"):
        invoice_dict["issue_date"] = issue_date.isoformat()
    if amount := invoice_dict.get("amount"):
        invoice_dict["amount"] = float(amount)
    response = supabase.table('invoices').insert(invoice_dict).execute()

    return response