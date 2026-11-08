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
      style={{
        background: "none",
        border: "1px solid #D1D5DB",
        borderRadius: "8px",
        padding: "6px 14px",
        fontSize: "14px",
        cursor: "pointer",
        color: "#374151",
      }}
    >
      Sign out
    </button>
  )
}