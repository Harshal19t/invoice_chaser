import os
from pydantic import BaseModel
from fastapi import FastAPI
from app.extraction import extract_invoice

app = FastAPI()

class ExtractRequest(BaseModel):
    extracted_text: str
    
