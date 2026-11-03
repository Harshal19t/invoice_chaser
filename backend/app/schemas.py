from decimal import Decimal
from datetime import date
from typing import Optional
from pydantic import BaseModel, computed_field

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