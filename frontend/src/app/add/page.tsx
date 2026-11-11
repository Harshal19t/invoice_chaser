"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

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

function useWindowWidth() {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 0
  )
  useEffect(() => {
    function handleResize() { setWidth(window.innerWidth) }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return width
}

export default function AddInvoicePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const width = useWindowWidth()
  const isMobile = width > 0 && width < 900

  async function handleExtract() {
    setLoading(true)
    setError(null)
    setResult(null)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ""
    try {
      let response
      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/extract_pdf", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        })
      } else {
        response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/extract_invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ text }),
        })
      }
      if (!response.ok) throw new Error("Server error: " + response.status)
      setResult(await response.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ""
    try {
      let response
      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/save_pdf", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        })
      } else {
        response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ text }),
        })
      }
      if (!response.ok) throw new Error("Server error: " + response.status)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const uploadCard = (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E6B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#16202B" }}>Upload PDF</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>Import invoice file</p>
        </div>
      </div>
      <label
        style={{ display: "block", border: "1.5px dashed #D1D5DB", borderRadius: "8px", padding: "16px", textAlign: "center", cursor: "pointer", color: "#6B7280", fontSize: "13px", transition: "border-color 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#0E6B5C"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#D1D5DB"}
      >
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} style={{ display: "none" }} />
        {file ? (
          <span style={{ color: "#0E6B5C", fontWeight: 500 }}>{file.name}</span>
        ) : (
          <>
            <span style={{ display: "block", fontSize: "22px", marginBottom: "4px" }}></span>
            Click to select a PDF
          </>
        )}
      </label>
      {file && (
        <button
          onClick={handleExtract}
          disabled={loading}
          onMouseEnter={e => e.currentTarget.style.background = "#0a5a4d"}
          onMouseLeave={e => e.currentTarget.style.background = "#0E6B5C"}
          style={{ marginTop: "12px", width: "100%", background: "#0E6B5C", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
        >
          {loading ? "Extracting..." : "Extract from PDF"}
        </button>
      )}
    </div>
  )

  const resultsCard = result && (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E6B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#16202B" }}>Extracted Details</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>Review before saving</p>
        </div>
      </div>
      {result.needs_review && (
        <div style={{ background: "#FDF1E3", color: "#9A4A06", padding: "8px 12px", borderRadius: "6px", marginBottom: "12px", fontSize: "13px", fontWeight: 500 }}>
          Check these details before saving
        </div>
      )}
      {[
        { label: "Client", value: result.client_name },
        { label: "Invoice #", value: result.invoice_number },
        { label: "Amount", value: result.currency && result.amount ? `${result.currency} ${result.amount}` : result.amount },
        { label: "Issue date", value: result.issue_date },
        { label: "Due date", value: result.due_date },
        { label: "Confidence", value: result.confidence ? (result.confidence * 100).toFixed(0) + "%" : null },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F4F6", fontSize: "13px" }}>
          <span style={{ color: "#6B7280" }}>{label}</span>
          <span style={{ color: "#16202B", fontWeight: 500 }}>{value ?? "—"}</span>
        </div>
      ))}
      {!saved ? (
        <button
          onClick={handleSave}
          disabled={saving}
          onMouseEnter={e => e.currentTarget.style.background = "#0a5a4d"}
          onMouseLeave={e => e.currentTarget.style.background = "#0E6B5C"}
          style={{ marginTop: "14px", width: "100%", background: "#0E6B5C", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
        >
          {saving ? "Saving..." : "Save to ledger"}
        </button>
      ) : (
        <p style={{ marginTop: "14px", color: "#0E6B5C", fontWeight: 600, fontSize: "14px", textAlign: "center" }}>✓ Saved to ledger</p>
      )}
    </div>
  )

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: isMobile ? "24px 16px" : "48px 40px" }}>
      <h1 style={{ margin: "0 0 4px 0", fontSize: isMobile ? "22px" : "26px", fontWeight: 700, color: "#16202B" }}>Add Invoice</h1>
      <p style={{ margin: "0 0 24px 0", color: "#6B7280", fontSize: "14px" }}>Paste invoice text or upload a PDF to extract details.</p>

      {isMobile ? (
        // MOBILE — stacked layout
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {uploadCard}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#16202B" }}>Or paste invoice text</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="Paste invoice text here..."
              style={{ width: "100%", boxSizing: "border-box", padding: "12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", color: "#16202B", resize: "none", fontFamily: "inherit", lineHeight: 1.6, outline: "none" }}
            />
            <button
              onClick={handleExtract}
              disabled={loading}
              onMouseEnter={e => e.currentTarget.style.background = "#0a5a4d"}
              onMouseLeave={e => e.currentTarget.style.background = "#0E6B5C"}
              style={{ width: "100%", background: "#0E6B5C", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
            >
              {loading ? "Extracting..." : "Extract details"}
            </button>
          </div>
          {resultsCard}
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#991B1B" }}>{error}</div>
          )}
        </div>
      ) : (
        // DESKTOP — two column layout
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={14}
              placeholder="Paste invoice text here..."
              style={{ width: "100%", boxSizing: "border-box", padding: "14px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", color: "#16202B", resize: "none", fontFamily: "inherit", lineHeight: 1.6, outline: "none" }}
            />
            <button
              onClick={handleExtract}
              disabled={loading}
              onMouseEnter={e => e.currentTarget.style.background = "#0a5a4d"}
              onMouseLeave={e => e.currentTarget.style.background = "#0E6B5C"}
              style={{ alignSelf: "flex-end", background: "#0E6B5C", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
            >
              {loading ? "Extracting..." : "Extract details"}
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {uploadCard}
            {resultsCard}
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#991B1B" }}>{error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}