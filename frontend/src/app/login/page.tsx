"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import Image from "next/image"
import remin from "../../../public/logo.png"

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
      else { router.push("/"); router.refresh() }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F3EE",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "32px" }}>
        <Image src={remin} alt="Remin" width={160} height={60}
          style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
      </div>

      {/* Card */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <h1 style={{ margin: "0 0 6px 0", fontSize: "22px", fontWeight: 700, color: "#16202B", textAlign: "center" }}>
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p style={{ margin: "0 0 28px 0", color: "#6B7280", fontSize: "14px", textAlign: "center" }}>
          {isSignUp ? "Start chasing invoices smarter" : "Sign in to your account"}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ width: "100%", padding: "11px 14px", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", outline: "none", color: "#16202B", background: "#FAFAFA" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: "100%", padding: "11px 14px", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", outline: "none", color: "#16202B", background: "#FAFAFA" }}
            />
          </div>

          {error && (
            <p style={{ color: "#DC2626", fontSize: "13px", marginBottom: "14px", background: "#FEF2F2", padding: "10px 12px", borderRadius: "8px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#0E6B5C", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#6B7280" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: "none", border: "none", color: "#0E6B5C", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: "13px" }}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  )
}