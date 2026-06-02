"use client"

import { useState } from "react"

interface NewsletterProps {
  className?: string
  inputClassName?: string
  buttonClassName?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function Newsletter({ 
  className = "", 
  inputClassName = "", 
  buttonClassName = "",
  onSuccess,
  onError 
}: NewsletterProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const subscribe = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      onError?.("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus("success")
        setMessage("Subscribed successfully!")
        setEmail("")
        onSuccess?.()
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatus("idle")
          setMessage("")
        }, 3000)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe")
        onError?.(data.error || "Failed to subscribe")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
      onError?.("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      subscribe()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-[#c10617]/20 focus-within:border-[#c10617] transition-all duration-300">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="your@email.com"
          disabled={isLoading}
          className={`flex-1 px-3 py-2 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
        />
        <button
          onClick={subscribe}
          disabled={isLoading}
          className={`px-4 py-2 bg-[#c10617] text-white hover:bg-[#a00513] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
        >
          {isLoading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7m0 0l-7 7m7-7H6" />
            </svg>
          )}
        </button>
      </div>
      {message && (
        <p className={`text-xs ${
          status === "success" ? "text-green-600" : "text-red-600"
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}