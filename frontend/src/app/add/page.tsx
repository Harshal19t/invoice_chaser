"use client";
import {useState} from "react";

type InvoiceResult = {
  is_invoice: boolean | null
  invoice_number: string | null
  client_name: string | null
  amount: string | null
  currency: string | null
  issue_date: string | null
  due_date: string | null
  confidence: number | null
  notes: string | null
  needs_review: boolean
}

export default function AddInvoicePage() {
  const [text,setText] = useState("");
  const [loading,setLoading] = useState(false);
  const [result, setResult] = useState<InvoiceResult | null>(null)
  const [error,setError] = useState<string | null>(null);
  
  async function handleExtract() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/extract_invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) {
      throw new Error("Server error: " + response.status)
    }

    const data = await response.json()
    setResult(data)
  } catch (err) {
    setError(err instanceof Error ? err.message : "An unknown error occurred")
  } finally {
    setLoading(false)
  }
  }
    return( 
  <div>
    <h1>Add Invoice</h1>
    <textarea value={text} 
    onChange={(e) => setText(e.target.value)}
    rows={8} 
    placeholder="Paste your invoice text here" />
    <button onClick={handleExtract} disabled={loading}>
      {loading ? "Extracting..." : "Extract details"}
    </button>
    {result && (
  <div>
    <h2>Extracted Details</h2>
    {result.needs_review && (
      <p style={{ color: "orange" }}>⚠️ Check these details before saving</p>
    )}
    <p><strong>Client:</strong> {result.client_name ?? "Not found"}</p>
    <p><strong>Invoice #:</strong> {result.invoice_number ?? "Not found"}</p>
    <p><strong>Amount:</strong> {result.currency} {result.amount ?? "Not found"}</p>
    <p><strong>Issue date:</strong> {result.issue_date ?? "Not found"}</p>
    <p><strong>Due date:</strong> {result.due_date ?? "Not found"}</p>
    <p><strong>Confidence:</strong> {result.confidence ? (result.confidence * 100).toFixed(0) + "%" : "Unknown"}</p>
    {result.notes && <p><strong>Notes:</strong> {result.notes}</p>}
  </div>
)}

{error && (
  <p style={{ color: "red" }}>{error}</p>
)}
  </div>
)}