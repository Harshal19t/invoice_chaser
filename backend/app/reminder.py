import os
import json
import resend
from groq import Groq
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ReminderEmail(BaseModel):
    subject: str
    body: str

SYSTEM_PROMPT = """You are a professional assistant helping freelancers chase unpaid invoices.
Write a polite but firm payment reminder email.
Return JSON with two fields: subject (email subject line) and body (full email body).
Keep the tone professional and friendly. Do not be aggressive.
Address the email to the client by name. Sign off as the invoice sender."""

def draft_reminder(invoice: dict, sender_name: str) -> ReminderEmail:
    user_message = f"""Please draft a payment reminder for this overdue invoice:
Client: {invoice.get('client_name')}
Invoice number: {invoice.get('invoice_number')}
Amount: {invoice.get('currency')} {invoice.get('amount')}
Due date: {invoice.get('due_date')}
Notes: {invoice.get('notes')}
Sender name: {sender_name}"""

    response = client.chat.completions.create(
        model=os.getenv("EXTRACTION_MODEL"),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        response_format={"type": "json_object"},
        max_tokens=1024,
    )
    data = json.loads(response.choices[0].message.content)
    return ReminderEmail(**data)

def send_reminder(invoice: dict, sender_name: str) -> dict:
    resend.api_key = os.getenv("RESEND_API_KEY")
    
    email = draft_reminder(invoice, sender_name)
    
    client_email = invoice.get("client_email")
    if not client_email:
        raise ValueError("No client email on this invoice")
    
    resend.Emails.send({
        "from": "Chaser <onboarding@resend.dev>",
        "to": client_email,
        "subject": email.subject,
        "text": email.body,
    })
    
    return {"subject": email.subject, "body": email.body}