"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <button 
  onClick={handleSignOut} 
  onMouseEnter={e => {
    e.currentTarget.style.borderColor = "#9CA3AF"
    e.currentTarget.style.color = "#16202B"
  }}
  onMouseLeave={e => {
    e.currentTarget.style.borderColor = "#E5E7EB"
    e.currentTarget.style.color = "#6B7280"
  }}
  style={{
    background: "transparent",
    color: "#6B7280",
    border: "1px solid #E5E7EB",
    borderRadius: "20px",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  }}>
  Sign out
</button>
  )
}