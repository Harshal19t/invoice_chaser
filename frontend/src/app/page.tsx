"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

type Invoice = {
  id: string
  client_name: string | null
  invoice_number: string | null
  amount: number | null
  currency: string | null
  issue_date: string | null
  due_date: string | null
  status: string
  notes: string | null
  confidence: number | null
}

const STATUS_OPTIONS = ["pending", "chased", "paid", "overdue"]

const STATUS_STYLES: Record<string, { background: string; color: string }> = {
  pending: { background: "#FEF3C7", color: "#92400E" },
  chased:  { background: "#DBEAFE", color: "#1E40AF" },
  paid:    { background: "#D1FAE5", color: "#065F46" },
  overdue: { background: "#FEE2E2", color: "#991B1B" },
}

const COLUMNS = [
  { label: "#",          align: "left"   },
  { label: "Client",     align: "left"   },
  { label: "Invoice",    align: "left"   },
  { label: "Amount",     align: "left"   },
  { label: "Issue date", align: "left"   },
  { label: "Due date",   align: "left"   },
  { label: "Status",     align: "center" },
]

const GRID = "50px 180px 120px 130px 130px 130px 140px"

export default function LedgerPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<Record<string, boolean>>({})
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/invoices")
      .then(res => res.json())
      .then(data => { setInvoices(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleStatusChange(invoiceId: string, newStatus: string) {
  setUpdating(prev => ({ ...prev, [invoiceId]: true }))
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token ?? ""

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}/status`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  })

  setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
  setUpdating(prev => ({ ...prev, [invoiceId]: false }))
}

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>

  return (
    <div onClick={() => setOpenDropdown(null)} style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px 0", fontSize: "26px", fontWeight: 700, color: "#16202B" }}>Ledger</h1>
          <p style={{ margin: 0, color: "#6B7280", fontSize: "14px" }}>{invoices.length} invoices</p>
        </div>
        <Link href="/add">
          <button style={{ background: "#0E6B5C", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            + Add invoice
          </button>
        </Link>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", width: "100%" }}>

        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: GRID,
          padding: "10px 24px",
          borderBottom: "1px solid #E5E7EB",
          borderRadius: "12px 12px 0 0",
          background: "#F9FAFB",
        }}>
          {COLUMNS.map(col => (
            <span key={col.label} style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              textAlign: col.align as "left" | "center",
            }}>
              {col.label}
            </span>
          ))}
        </div>

        {invoices.length === 0 && (
          <p style={{ padding: "32px 24px", color: "#6B7280", margin: 0 }}>
            No invoices yet. <Link href="/add" style={{ color: "#0E6B5C", fontWeight: 600 }}>Add one</Link>
          </p>
        )}

        {invoices.map((invoice, i) => {
          const style = STATUS_STYLES[invoice.status] ?? { background: "#F3F4F6", color: "#374151" }
          const isOpen = openDropdown === invoice.id
          const isLast = i === invoices.length - 1

          return (
            <div
              key={invoice.id}
              style={{
                display: "grid",
                gridTemplateColumns: GRID,
                padding: "16px 24px",
                borderBottom: isLast ? "none" : "1px solid #F3F4F6",
                alignItems: "center",
                borderRadius: isLast ? "0 0 12px 12px" : "0",
              }}
            >
              <span style={{ fontSize: "13px", color: "#9CA3AF", fontWeight: 500 }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#16202B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {invoice.client_name ?? "—"}
                </p>
              </div>

              <span style={{ fontSize: "13px", color: "#6B7280" }}>
                {invoice.invoice_number ?? "—"}
              </span>

              <span style={{ fontSize: "14px", fontWeight: 700, color: "#16202B" }}>
                {invoice.currency} {invoice.amount?.toLocaleString() ?? "—"}
              </span>

              <span style={{ fontSize: "13px", color: "#6B7280" }}>
                {invoice.issue_date ?? "—"}
              </span>

              <span style={{ fontSize: "13px", color: "#6B7280" }}>
                {invoice.due_date ?? "—"}
              </span>

              <div
                style={{ position: "relative", display: "flex", justifyContent: "center" }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setOpenDropdown(prev => prev === invoice.id ? null : invoice.id)}
                  disabled={updating[invoice.id]}
                  style={{
                    background: style.background,
                    color: style.color,
                    border: "none",
                    borderRadius: "20px",
                    padding: "5px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    minWidth: "90px",
                    textAlign: "center",
                  }}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </button>

                {isOpen && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 100,
                    minWidth: "120px",
                  }}>
                    {STATUS_OPTIONS.map((s, idx) => (
                      <div
                        key={s}
                        onClick={() => {
                          handleStatusChange(invoice.id, s)
                          setOpenDropdown(null)
                        }}
                        style={{
                          padding: "10px 16px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#16202B",
                          cursor: "pointer",
                          textAlign: "center",
                          background: invoice.status === s ? "#F3F4F6" : "#fff",
                          borderRadius: idx === 0 ? "8px 8px 0 0" : idx === STATUS_OPTIONS.length - 1 ? "0 0 8px 8px" : "0",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                        onMouseLeave={e => (e.currentTarget.style.background = invoice.status === s ? "#F3F4F6" : "#fff")}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}