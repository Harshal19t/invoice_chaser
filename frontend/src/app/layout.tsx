import Link from "next/link"
import Image from "next/image"
import SignOutButton from "@/components/SignOutButton"
import NavLinks from "@/components/NavLinks"
import remin from "../../public/logo.png"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#EEF1F4", margin: 0, fontFamily: "sans-serif", color: "#16202B" }}>
        <nav style={{
  background: "white",
  borderBottom: "1px solid #E5E7EB",
  padding: "0 24px",  // reduced from 40px
  height: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
  zIndex: 50
}}>
  <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
  <Image src={remin} alt="Remin" width={90} height={40}
    style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
</Link>
  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
    <NavLinks />
    <div style={{ width: "1px", height: "18px", background: "#E5E7EB", margin: "0 12px" }} />
    <SignOutButton />
  </div>
</nav>

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