import io
from pypdf import PdfReader

def extract_text_from_pdf(file_bytes: bytes):
    with io.BytesIO(file_bytes) as pdf_file: 
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text