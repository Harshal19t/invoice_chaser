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
  <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px" }}>
    <h1 style={{ margin: "0 0 4px 0", fontSize: "28px", fontWeight: 700, color: "#16202B" }}>Approvals</h1>
    <p style={{ margin: "0 0 24px 0", color: "#4F5C6B" }}>Nothing is sent until you approve it.</p>

    {reminders.map((reminder) => (
      <div key={reminder.invoice_number} style={{ background: "#fff", border: "1px solid #D5DBE2", borderRadius: "10px", padding: "24px", marginBottom: "16px" }}>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 600, color: "#16202B" }}>{reminder.client_name}</h2>
        <p style={{ margin: "0 0 16px 0", color: "#9A4A06", fontWeight: 600 }}>{reminder.invoice_number} · {reminder.currency} {reminder.amount} · {reminder.days_overdue} days overdue</p>
        <p style={{ margin: "0 0 4px 0", color: "#4F5C6B" }}><strong style={{ color: "#16202B" }}>To:</strong> {reminder.email_to}</p>
        <p style={{ margin: "0 0 12px 0", color: "#4F5C6B" }}><strong style={{ color: "#16202B" }}>Subject:</strong> {reminder.email_subject}</p>
        <pre style={{ background: "#F7F9FA", border: "1px solid #D5DBE2", borderRadius: "8px", padding: "16px", fontSize: "14px", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: "0 0 16px 0" }}>{reminder.email_body}</pre>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ background: "#0E6B5C", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>Approve and send</button>
          <button style={{ background: "#fff", color: "#9A4A06", border: "1px solid #D5DBE2", padding: "10px 22px", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>Reject</button>
        </div>
      </div>
    ))}
  </div>
)
}
