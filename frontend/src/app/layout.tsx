import Link from "next/link"
import Image from "next/image"
import SignOutButton from "@/components/SignOutButton"
import NavLinks from "@/components/NavLinks"
import remin from "../../public/logo.png"
import NavWrapper from "@/components/NavWrapper"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#EEF1F4", margin: 0, fontFamily: "sans-serif", color: "#16202B" }}>
        <NavWrapper />
        {children}
      </body>
    </html>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <span style={{
        fontSize: "14px",
        fontWeight: 500,
        color: "#4F5C6B",
        padding: "6px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "block",
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "#F3F4F6")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        {label}
      </span>
    </Link>
  )
}