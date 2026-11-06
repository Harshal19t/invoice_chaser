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
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  
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

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
      })
      if (!response.ok) {
        throw new Error("Server error: " + response.status)
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setSaving(false);
    }
  }

   return (
  <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px" }}>
    <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: 700, color: "#16202B" }}>Add Invoice</h1>
    <p style={{ margin: "0 0 24px 0", color: "#4F5C6B" }}>Paste invoice text and well extract the details.</p>

    <div style={{ background: "#fff", border: "1px solid #D5DBE2", borderRadius: "10px", padding: "24px", marginBottom: "16px" }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Paste invoice text here..."
        style={{ width: "100%", boxSizing: "border-box", padding: "12px", border: "1px solid #D5DBE2", borderRadius: "8px", fontSize: "15px", color: "#16202B", resize: "none", fontFamily: "inherit" }}
      />
      <button
        onClick={handleExtract}
        disabled={loading}
        style={{ marginTop: "12px", background: "#0E6B5C", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
      >
        {loading ? "Extracting..." : "Extract details"}
      </button>
    </div>

    {result && (
      <div style={{ background: "#fff", border: "1px solid #D5DBE2", borderRadius: "10px", padding: "24px" }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: 600, color: "#16202B" }}>Extracted Details</h2>
        {result.needs_review && (
          <div style={{ background: "#FDF1E3", color: "#9A4A06", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontWeight: 500 }}>
            Check these details before saving
          </div>
        )}
        <p style={{ color: "#16202B" }}><strong>Client:</strong> {result.client_name ?? "Not found"}</p>
<p style={{ color: "#16202B" }}><strong>Invoice #:</strong> {result.invoice_number ?? "Not found"}</p>
<p style={{ color: "#16202B" }}><strong>Amount:</strong> {result.currency} {result.amount ?? "Not found"}</p>
<p style={{ color: "#16202B" }}><strong>Issue date:</strong> {result.issue_date ?? "Not found"}</p>
<p style={{ color: "#16202B" }}><strong>Due date:</strong> {result.due_date ?? "Not found"}</p>
<p style={{ color: "#16202B" }}><strong>Confidence:</strong> {result.confidence ? (result.confidence * 100).toFixed(0) + "%" : "Unknown"}</p>
        {result.notes && <p><strong>Notes:</strong> {result.notes}</p>}

        {!saved ? (
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ marginTop: "8px", background: "#0E6B5C", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
          >
            {saving ? "Saving..." : "Save to ledger"}
          </button>
        ) : (
          <p style={{ color: "#0E6B5C", fontWeight: 600 }}>Saved to ledger</p>
        )}
      </div>
    )}

    {error && (
      <p style={{ color: "#9A4A06", fontWeight: 500 }}>{error}</p>
    )}
  </div>
)}