from decimal import Decimal
from datetime import date
from typing import Optional
from pydantic import BaseModel, computed_field, field_validator

class InvoiceExtraction(BaseModel):
    is_invoice: Optional[bool] = None
    invoice_number: Optional[str] = None
    client_name: Optional[str] = None
    amount: Optional[Decimal] = None
    currency: Optional[str] = None
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    confidence: Optional[float] = None
    notes: Optional[str] = None

    @computed_field
    @property   
    def needs_review(self) -> bool:
        if self.confidence is None or self.confidence < 0.8:
            return True
        if self.amount is None:
            return True
        if not self.currency:
            return True
        if not self.due_date:
            return True
        if self.is_invoice is None or self.is_invoice is False:
            return True
        return False

@field_validator("issue_date", "due_date", mode="before")
@classmethod
def parse_date(cls, v):
    if v is None:
        return None
    if isinstance(v, str):
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d %B %Y", "%B %d, %Y", "%d %b %Y", "%B %d %Y"):
            try:
                from datetime import datetime
                return datetime.strptime(v, fmt).date()
            except ValueError:
                continue
    return v