"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Ledger" },
  { href: "/add", label: "Add invoice" },
  { href: "/approvals", label: "Approvals" },
]

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <>
      {links.map(({ href, label }) => {
        const isActive = pathname === href
        return (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <span style={{
              fontSize: "13px",
              fontWeight: 500,
              color: isActive ? "#ffffff" : "#6B7280",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              display: "block",
              background: isActive ? "#16202B" : "transparent",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { 
  if (!isActive) {
    e.currentTarget.style.color = "#16202B"
    e.currentTarget.style.background = "#F3F4F6"
  }
}}
onMouseLeave={e => { 
  if (!isActive) {
    e.currentTarget.style.color = "#6B7280"
    e.currentTarget.style.background = "transparent"
  }
}}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </>
  )
}