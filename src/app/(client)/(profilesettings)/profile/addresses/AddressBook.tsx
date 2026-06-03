"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Home, Briefcase, MapPin } from "lucide-react"
import { AddressDialog } from "./AddressDialog"
import { ShippingAddress } from "@prisma/client"


export default function AddressBook() {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | undefined>()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAddresses(data) })
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = (saved: ShippingAddress) => {
    setAddresses((prev) => {
      const exists = prev.find((a) => a.id === saved.id)
      let updated = exists
        ? prev.map((a) => (a.id === saved.id ? saved : a))
        : [saved, ...prev]
      // If saved is default, unset others in local state
      if (saved.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: a.id === saved.id }))
      }
      return updated
    })
    setEditingAddress(undefined)
  }

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address)
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return
    setDeletingId(id)
    try {
      await fetch(`/api/user/addresses/${id}`, { method: "DELETE" })
      setAddresses((prev) => {
        const filtered = prev.filter((a) => a.id !== id)
        // If deleted was default, promote first remaining
        const hadDefault = prev.find((a) => a.id === id)?.isDefault
        if (hadDefault && filtered.length > 0) {
          filtered[0] = { ...filtered[0], isDefault: true }
        }
        return filtered
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (id: number) => {
    setSettingDefaultId(id)
    try {
      await fetch(`/api/user/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      })
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      )
    } finally {
      setSettingDefaultId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-28 bg-neutral-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neutral-400" />
          <h2 className="text-sm font-semibold text-neutral-800">Saved Addresses</h2>
        </div>
        <button
          onClick={() => { setEditingAddress(undefined); setDialogOpen(true) }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-700 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add address
        </button>
      </div>

      {/* Empty state */}
      {addresses.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl space-y-3">
          <MapPin className="w-8 h-8 text-neutral-300 mx-auto" />
          <p className="text-sm font-medium text-neutral-500">No saved addresses yet</p>
          <button
            onClick={() => { setEditingAddress(undefined); setDialogOpen(true) }}
            className="text-xs text-neutral-900 underline underline-offset-4"
          >
            Add your first address
          </button>
        </div>
      )}

      {/* Address cards */}
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`relative border rounded-xl p-4 transition-all ${
              addr.isDefault
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            {/* Default badge */}
            {addr.isDefault && (
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-white bg-neutral-900 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}

            <div className="flex gap-3">
              {/* Label icon */}
              <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                addr.label === "OFFICE"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-red-50 text-red-500"
              }`}>
                {addr.label === "OFFICE"
                  ? <Briefcase className="w-4 h-4" />
                  : <Home className="w-4 h-4" />
                }
              </div>

              {/* Address info */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-900">{addr.fullName}</p>
                  <span className="text-[10px] font-medium text-neutral-400">{addr.label}</span>
                </div>
                <p className="text-xs text-neutral-600">
                  {addr.street}, {addr.city}, {addr.district}
                  {addr.postalCode && ` - ${addr.postalCode}`}
                </p>
                <p className="text-xs text-neutral-500">{addr.phone}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  disabled={settingDefaultId === addr.id}
                  className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-50"
                >
                  {settingDefaultId === addr.id ? "Setting..." : "Set as default"}
                </button>
              )}
              <button
                onClick={() => handleEdit(addr)}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors ml-auto"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                disabled={deletingId === addr.id}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <AddressDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o)
          if (!o) setEditingAddress(undefined)
        }}
        initialData={editingAddress}
        onSaved={handleSaved}
      />

    </div>
  )
}