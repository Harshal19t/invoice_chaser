"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const links = [
  { href: "/", label: "Ledger" },
  { href: "/add", label: "Add invoice" },
  { href: "/approvals", label: "Approvals" },
]

function useWindowWidth() {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 0
  )
  useEffect(() => {
    function handleResize() { setWidth(window.innerWidth) }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return width
}

export default function NavLinks() {
  const pathname = usePathname()
  const width = useWindowWidth()
  const isMobile = width > 0 && width < 900

  if (isMobile) {
    return (
      <>
        {links.map(({ href, label }) => {
          const isActive = pathname === href
          const shortLabel = label === "Add invoice" ? "Add" : label
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <span style={{
                fontSize: "12px",
                fontWeight: 500,
                color: isActive ? "#ffffff" : "#6B7280",
                padding: "5px 10px",
                borderRadius: "20px",
                cursor: "pointer",
                display: "block",
                background: isActive ? "#16202B" : "transparent",
                whiteSpace: "nowrap",
              }}>
                {shortLabel}
              </span>
            </Link>
          )
        })}
      </>
    )
  }

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
              whiteSpace: "nowrap",
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