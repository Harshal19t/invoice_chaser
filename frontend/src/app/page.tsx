import Link from "next/link"

type Invoice = {
  id: string
  client_name: string | null
  invoice_number: string | null
  amount: number | null
  currency: string | null
  issue_date: string | null
  due_date: string | null
  status: string | null
  notes: string | null
  confidence: number | null
  is_invoice: boolean | null
  created_at: string
}
// const invoices = [
//   // fill in 3 objects with: client_name, invoice_number, amount, currency, due_date, status
//   {
//     client_name: "John Doe",
//     invoice_number: "INV-001",
//     amount: 1000,
//     currency: "USD",
//     due_date: "2023-12-31",
//     status: "Pending"
//   },
//   {
//     client_name: "Jane Smith",
//     invoice_number: "INV-002",
//     amount: 2000,
//     currency: "USD",
//     due_date: "2023-12-31",
//     status: "Paid"
//   },
//   {
//     client_name: "Bob Johnson",
//     invoice_number: "INV-003",
//     amount: 1500,
//     currency: "USD",
//     due_date: "2023-12-31",
//     status: "Overdue"
//   }
// ]

export default async function LedgerPage() {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/invoices", {
    cache: "no-store"
  })
  const invoices = await response.json()

  return (
  <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
      <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#16202B" }}>Ledger</h1>
      <Link href="/add" style={{ background: "#0E6B5C", color: "#fff", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>Add invoice</Link>
    </div>

    <div style={{ background: "#fff", border: "1px solid #D5DBE2", borderRadius: "10px", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F7F9FA", borderBottom: "1px solid #D5DBE2" }}>
            <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "14px", color: "#4F5C6B", fontWeight: 500 }}>Client</th>
            <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "14px", color: "#4F5C6B", fontWeight: 500 }}>Invoice #</th>
            <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "14px", color: "#4F5C6B", fontWeight: 500 }}>Amount</th>
            <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "14px", color: "#4F5C6B", fontWeight: 500 }}>Due date</th>
            <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "14px", color: "#4F5C6B", fontWeight: 500 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: Invoice) => (
            <tr key={invoice.invoice_number} style={{ borderBottom: "1px solid #D5DBE2" }}>
              <td style={{ padding: "14px 20px", fontWeight: 600, color: "#16202B" }}>{invoice.client_name}</td>
              <td style={{ padding: "14px 20px", color: "#16202B" }}>{invoice.invoice_number}</td>
              <td style={{ padding: "14px 20px", fontWeight: 600, color: "#16202B" }}>{invoice.currency} {invoice.amount}</td>
              <td style={{ padding: "14px 20px", color: "#16202B" }}>{invoice.due_date}</td>
              <td style={{ padding: "14px 20px", color: "#16202B" }}>{invoice.status ?? "pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
}
