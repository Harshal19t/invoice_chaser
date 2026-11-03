from decimal import Decimal
from datetime import date
from app.schemas import InvoiceExtraction

def test_needs_review_false_when_all_fields_present():
    invoice = InvoiceExtraction(
        is_invoice=True,
        invoice_number="INV-001",
        client_name="Client A",
        amount=Decimal("100.00"),
        currency="USD",
        issue_date=date(2023, 1, 1),
        due_date=date(2023, 1, 15),
        confidence=0.9,
        notes="Test invoice"
    )
    assert invoice.needs_review == False
    
def test_needs_review_true_when_due_date_missing():
    invoice = InvoiceExtraction(
        is_invoice=True,
        invoice_number="INV-001",
        client_name="Client A",
        amount=Decimal("100.00"),
        currency="USD",
        issue_date=date(2023, 1, 1),
        due_date=None,
        confidence=0.9,
        notes="Test invoice"
    )
    assert invoice.needs_review == True

def test_needs_review_true_when_low_confidence():
    invoice = InvoiceExtraction(
        is_invoice=True,
        invoice_number="INV-001",
        client_name="Client A",
        amount=Decimal("100.00"),
        currency="USD",
        issue_date=date(2023, 1, 1),
        due_date=date(2023, 1, 15),
        confidence=0.5,
        notes="Test invoice"
    )
    assert invoice.needs_review == True

def test_needs_review_true_when_not_invoice():
    invoice = InvoiceExtraction(
        is_invoice=False,
        invoice_number="INV-001",
        client_name="Client A",
        amount=Decimal("100.00"),
        currency="USD",
        issue_date=date(2023, 1, 1),
        due_date=date(2023, 1, 15),
        confidence=0.9,
        notes="Test invoice"
    )
    assert invoice.needs_review == True