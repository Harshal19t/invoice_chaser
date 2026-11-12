"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

type Invoice = {
  id: string
  client_name: string
  invoice_number: string
  amount: number
  currency: string
  due_date: string
  status: string
}

type DraftedEmail = {
  subject: string
  body: string
}

export default function ApprovalsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState<Record<string, DraftedEmail>>({})
  const [drafting, setDrafting] = useState<Record<string, boolean>>({})
  const [sending, setSending] = useState<Record<string, boolean>>({})
  const [senderName, setSenderName] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetch(process.env.NEXT_PUBLIC_API_URL + "/invoices/overdue", {
        headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
      })
        .then(res => res.json())
        .then(data => { setInvoices(Array.isArray(data) ? data : []); setLoading(false) })
        .catch(() => setLoading(false))
    })
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  async function handleDraft(invoice: Invoice) {
    setDrafting(prev => ({ ...prev, [invoice.id]: true }))
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ""

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoice.id}/draft-reminder`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender_name: senderName || "Your Name" }),
    })
    const data = await res.json()
    setDrafts(prev => ({ ...prev, [invoice.id]: data }))
    setDrafting(prev => ({ ...prev, [invoice.id]: false }))
  }

  async function handleSend(invoice: Invoice) {
    // Fire and forget — don't await
    setSending(prev => ({ ...prev, [invoice.id]: true }))
    setInvoices(prev => prev.filter(i => i.id !== invoice.id))
    showToast(`Email to ${invoice.client_name} is being sent...`)

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ""

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoice.id}/send-reminder`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender_name: senderName || "Your Name" }),
    }).then(() => {
      showToast(`✓ Email sent to ${invoice.client_name}`)
    }).catch(() => {
      showToast(`Failed to send email to ${invoice.client_name}`)
    })

    setSending(prev => ({ ...prev, [invoice.id]: false }))
  }

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>

  const width = typeof window !== "undefined" ? window.innerWidth : 900
  const isMobile = width < 900

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 32px" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: "#16202B", color: "white", padding: "12px 24px",
          borderRadius: "10px", fontSize: "14px", fontWeight: 500,
          zIndex: 999, boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}

      <h1 style={{ margin: "0 0 8px 0", fontSize: isMobile ? "22px" : "28px", fontWeight: 700, color: "#16202B" }}>Approvals</h1>
      <p style={{ margin: "0 0 24px 0", color: "#4F5C6B" }}>Overdue invoices waiting for a chaser email.</p>

      <div style={{ marginBottom: "32px" }}>
        <label style={{ fontSize: "14px", fontWeight: 500, color: "#16202B", display: "block", marginBottom: "6px" }}>Your name (used in email sign-off)</label>
        <input
          value={senderName}
          onChange={e => setSenderName(e.target.value)}
          placeholder="e.g. Alex Johnson"
          style={{ padding: "10px 12px", border: "1px solid #D5DBE2", borderRadius: "8px", fontSize: "14px", width: isMobile ? "100%" : "300px", boxSizing: "border-box" }}
        />
      </div>

      {invoices.length === 0 && (
        <p style={{ color: "#4F5C6B" }}>No overdue invoices. Nice work!</p>
      )}

      {invoices.map(invoice => (
        <div key={invoice.id} style={{ background: "#fff", border: "1px solid #D5DBE2", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ margin: "0 0 2px 0", fontWeight: 700, fontSize: "16px", color: "#16202B" }}>{invoice.client_name}</p>
          <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#4F5C6B" }}>
            {invoice.invoice_number} · {invoice.currency} {invoice.amount} · Due {invoice.due_date}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => handleDraft(invoice)}
              disabled={drafting[invoice.id]}
              style={{ background: "#0E6B5C", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", flex: isMobile ? "1" : "none" }}
            >
              {drafting[invoice.id] ? "Drafting..." : "Draft reminder"}
            </button>
            {drafts[invoice.id] && (
              <button
                onClick={() => handleSend(invoice)}
                disabled={sending[invoice.id]}
                style={{ background: "#1D4ED8", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", flex: isMobile ? "1" : "none" }}
              >
                Send email
              </button>
            )}
          </div>

          {drafts[invoice.id] && (
            <div style={{ background: "#F8FAFB", border: "1px solid #D5DBE2", borderRadius: "8px", padding: "16px", marginTop: "12px" }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: 600, fontSize: "14px", color: "#16202B" }}>
                Subject: {drafts[invoice.id].subject}
              </p>
              <pre style={{ margin: 0, fontSize: "13px", color: "#374151", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                {drafts[invoice.id].body}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}