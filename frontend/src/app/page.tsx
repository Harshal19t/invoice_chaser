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
    <div>
      <h1>Ledger</h1>
      <Link href="/add">Add invoice</Link>

      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Invoice #</th>
            <th>Amount</th>
            <th>Due date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: Invoice) => (
            <tr key={invoice.invoice_number}>
              <td>{invoice.client_name}</td>
              <td>{invoice.invoice_number}</td>
              <td>{invoice.currency} {invoice.amount}</td>
              <td>{invoice.due_date}</td>
              <td>{invoice.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
