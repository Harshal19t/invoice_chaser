"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push("/")
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push("/")
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EEF1F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <h1 style={{ marginBottom: "8px", fontSize: "24px", fontWeight: 700 }}>
          {isSignUp ? "Create account" : "Sign in"}
        </h1>
        <p style={{ color: "#6B7280", marginBottom: "32px", fontSize: "14px" }}>Chaser — invoice tracking</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <p style={{ color: "#DC2626", fontSize: "14px", marginBottom: "16px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#0E6B5C", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6B7280" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: "none", border: "none", color: "#0E6B5C", fontWeight: 600, cursor: "pointer", padding: 0 }}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  )
}