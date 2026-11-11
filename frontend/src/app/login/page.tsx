"use client"

import { useState, useEffect } from "react"
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

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
      background: "#F0EDE8",
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "center",
      padding: "40px 24px",
      boxSizing: "border-box",
    }}>
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        maxWidth: "960px",
        gap: isMobile ? "32px" : "60px",
        alignItems: isMobile ? "stretch" : "center",
        overflow: "hidden",
      }}>

        {/* LEFT — logo + text */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <Image
            src={remin}
            alt="Remin"
            width={160}
            height={60}
            style={{ objectFit: "contain", mixBlendMode: "multiply", marginBottom: "24px", display: "block" }}
          />
          <h2 style={{
            fontSize: isMobile ? "32px" : "36px",
            fontWeight: 800,
            color: "#16202B",
            margin: "0 0 14px 0",
            lineHeight: 1.2,
          }}>
            Chase invoices,<br />not clients.
          </h2>
          <p style={{
            fontSize: "15px",
            color: "#6B7280",
            lineHeight: 1.8,
            margin: "0 0 32px 0",
          }}>
            Remin tracks your overdue invoices and sends polite, professional reminder emails — so you get paid faster without the awkward follow-ups.
          </p>
          {!isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "AI-powered invoice extraction",
                "Automated chaser emails",
                "Multi-client ledger",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: "#0E6B5C", display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: "14px", color: "#374151" }}>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — login card */}
        <div style={{
          width: isMobile ? "100%" : "420px",
          flexShrink: 0,
          background: "white",
          borderRadius: "20px",
          padding: isMobile ? "36px 24px" : "48px 44px",
          boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
          boxSizing: "border-box",
        }}>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "24px", fontWeight: 700, color: "#16202B" }}>
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p style={{ margin: "0 0 32px 0", color: "#6B7280", fontSize: "14px" }}>
            {isSignUp ? "Start chasing invoices smarter" : "Sign in to your account"}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%", padding: "12px 14px",
                  border: "1px solid #E5E7EB", borderRadius: "10px",
                  fontSize: "14px", boxSizing: "border-box",
                  outline: "none", background: "#F9FAFB", color: "#16202B",
                }}
              />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", padding: "12px 14px",
                  border: "1px solid #E5E7EB", borderRadius: "10px",
                  fontSize: "14px", boxSizing: "border-box",
                  outline: "none", background: "#F9FAFB", color: "#16202B",
                }}
              />
            </div>

            {error && (
              <p style={{ color: "#DC2626", fontSize: "13px", marginBottom: "16px", background: "#FEF2F2", padding: "10px 12px", borderRadius: "8px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: "#0E6B5C", color: "white",
                border: "none", borderRadius: "10px",
                fontSize: "15px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#6B7280" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: "none", border: "none", color: "#0E6B5C", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "13px" }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}