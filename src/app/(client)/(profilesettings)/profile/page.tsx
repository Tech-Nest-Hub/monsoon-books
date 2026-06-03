"use client"

import { useEffect, useState } from "react"
import { User, Mail, Shield, Pencil, Check, X } from "lucide-react"

type UserProfile = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  provider: string | null
  createdAt?: string
}

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition disabled:bg-neutral-50 disabled:text-neutral-500"

export default function MyProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Edit state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user)
          setFirstName(data.user.firstName)
          setLastName(data.user.lastName)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleEdit = () => {
    setEditing(true)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    if (!profile) return
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
    setEditing(false)
    setError("")
  }

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required")
      return
    }
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to save")
      setProfile(data.user)
      setEditing(false)
      setSuccess("Profile updated successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-40 bg-neutral-200 rounded" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-neutral-200 rounded" />
            <div className="h-3 w-48 bg-neutral-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-16 text-sm text-neutral-400">
        Could not load profile.
      </div>
    )
  }

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
  const fullName = `${profile.firstName} ${profile.lastName}`

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage your personal information</p>
      </div>

      {/* Avatar + name block */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-lg font-semibold text-neutral-900">{fullName}</p>
          <p className="text-sm text-neutral-400">{profile.email}</p>
          {profile.role === "ADMIN" && (
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <Shield className="w-2.5 h-2.5" />
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Personal info form */}
      <div className="space-y-5 border-t border-neutral-100 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-800">Personal Information</h2>
          </div>
          {!editing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-600">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!editing || saving}
              className={inputClass}
            />
          </div>

          {/* Last name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-600">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!editing || saving}
              className={inputClass}
            />
          </div>

          {/* Email — read only always */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-600">
              Email
              <span className="ml-1.5 text-neutral-400 font-normal">(cannot be changed)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
              <input
                value={profile.email}
                disabled
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          {/* Sign-in method */}
          {profile.provider && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Sign-in Method</label>
              <input
                value={profile.provider.charAt(0).toUpperCase() + profile.provider.slice(1)}
                disabled
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-primary bg-purple-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2">
            <Check className="w-4 h-4" />
            {success}
          </p>
        )}

        {/* Save / Cancel */}
        {editing && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-700 text-sm font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-50 transition disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account info — read only */}
      <div className="space-y-3 border-t border-neutral-100 pt-6">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neutral-400" />
          <h2 className="text-sm font-semibold text-neutral-800">Account</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-100">
            <span className="text-neutral-500">Account ID</span>
            <span className="font-mono font-medium text-neutral-700">#{profile.id}</span>
          </div>
          <div className="flex justify-between px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-100">
            <span className="text-neutral-500">Role</span>
            <span className="font-medium text-neutral-700 capitalize">
              {profile.role.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}