import Link from "next/link"

const reminders = [
  {
    client_name: "Harbour & Pine",
    invoice_number: "INV-2038",
    amount: 2400,
    currency: "GBP",
    days_overdue: 13,
    email_to: "accounts@harbourpine.example",
    email_subject: "Invoice INV-2038: payment now overdue",
    email_body: "Hi Harbour & Pine team,\n\nI'm following up on invoice INV-2038 for £2,400.00, which is now 13 days overdue.\n\nCould you let me know when payment will be made?\n\nThanks"
  },
  {
    client_name: "Kestrel Foods",
    invoice_number: "INV-2036",
    amount: 3150,
    currency: "GBP",
    days_overdue: 7,
    email_to: "pay@kestrelfoods.example",
    email_subject: "Invoice INV-2036: payment overdue",
    email_body: "Hi Kestrel Foods team,\n\nThis is a reminder that invoice INV-2036 for £3,150.00 is now 7 days overdue.\n\nPlease let us know when to expect payment.\n\nThanks"
  }
]

export default function ApprovalsPage() {
  return (
    <div>
      <h1>Approvals</h1>
      <h3>Nothing is sent until approved</h3>
      <Link href="/">Back to Ledger</Link>

      {/* <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Invoice #</th>
            <th>Amount</th>
            <th>Days Overdue</th>
            <th>Email To</th>
            <th>Email Subject</th>
            <th>Email Body</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder) => (
            <tr key={reminder.invoice_number}>
              <td>{reminder.client_name}</td>
              <td>{reminder.invoice_number}</td>
              <td>{reminder.currency}{reminder.amount}</td>
              <td>{reminder.days_overdue} days</td>
              <td>{reminder.email_to}</td>
              <td>{reminder.email_subject}</td>
              <td><pre>{reminder.email_body}</pre></td>
            </tr>
          ))}
        </tbody>
      </table> */}

      {reminders.map((reminder) => (
  <div key={reminder.invoice_number} style={{ border: "1px solid #ccc", padding: "16px", marginTop: "16px" }}>
    <h2>{reminder.client_name} — {reminder.invoice_number}</h2>
    <p>{reminder.currency} {reminder.amount} · {reminder.days_overdue} days overdue</p>
    <p><strong>To:</strong> {reminder.email_to}</p>
    <p><strong>Subject:</strong> {reminder.email_subject}</p>
    <pre style={{ background: "#f5f5f5", padding: "12px" }}>{reminder.email_body}</pre>
    <button>Approve and send</button>
    <button style={{ marginLeft: "8px" }}>Reject</button>
  </div>
))}
    </div>
  )
}
