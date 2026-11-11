"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import SignOutButton from "@/components/SignOutButton"
import NavLinks from "@/components/NavLinks"
import remin from "../../public/logo.png"

export default function NavWrapper() {
  const pathname = usePathname()
  if (pathname === "/login") return null

  return (
    <nav style={{
      background: "white",
      borderBottom: "1px solid #E5E7EB",
      padding: "0 12px",
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Image src={remin} alt="Remin" width={90} height={40}
          style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "2px", minWidth: 0 }}>
        <NavLinks />
        <div style={{ width: "1px", height: "18px", background: "#E5E7EB", margin: "0 6px", flexShrink: 0 }} />
        <SignOutButton />
      </div>
    </nav>
  )
}