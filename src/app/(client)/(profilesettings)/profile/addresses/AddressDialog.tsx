"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Home, Briefcase, X } from "lucide-react"
import { ShippingAddress } from "@prisma/client"

// Nepal districts for the dropdown
const NEPAL_DISTRICTS = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura",
  "Banke", "Bara", "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan",
  "Dadeldhura", "Dailekh", "Dang", "Darchula", "Dhading", "Dhankuta",
  "Dhanusa", "Dholkha", "Dolpa", "Doti", "Eastern Rukum", "Gorkha",
  "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla", "Kailali",
  "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu", "Kavrepalanchok",
  "Khotang", "Lalitpur", "Lamjung", "Mahottari", "Makwanpur", "Manang",
  "Morang", "Mugu", "Mustang", "Myagdi", "Nawalpur", "Nuwakot",
  "Okhaldhunga", "Palpa", "Panchthar", "Parbat", "Parsa", "Pyuthan",
  "Ramechhap", "Rasuwa", "Rautahat", "Rolpa", "Rupandehi", "Salyan",
  "Sankhuwasabha", "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha",
  "Solukhumbu", "Sunsari", "Surkhet", "Syangja", "Taplejung", "Terhathum",
  "Udayapur", "Western Rukum",
]



interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ShippingAddress        // if provided → edit mode
  onSaved: (address: ShippingAddress) => void
}

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition disabled:opacity-50"

export function AddressDialog({ open, onOpenChange, initialData, onSaved }: AddressDialogProps) {
  const isEditing = !!initialData

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [label, setLabel] = useState<"HOME" | "OFFICE">("HOME")
  const [isDefault, setIsDefault] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName)
      setPhone(initialData.phone)
      setStreet(initialData.street)
      setCity(initialData.city)
      setDistrict(initialData.district)
      setPostalCode(initialData.postalCode ?? "")
      setLabel(initialData.label as "HOME" | "OFFICE")
      setIsDefault(initialData.isDefault)
    } else {
      setFullName(""); setPhone(""); setStreet("")
      setCity(""); setDistrict(""); setPostalCode("")
      setLabel("HOME"); setIsDefault(false)
    }
    setError("")
  }, [initialData, open])

  const handleSave = async () => {
    setError("")
    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !district) {
      setError("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      const url = isEditing
        ? `/api/user/addresses/${initialData.id}`
        : "/api/user/addresses"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, street, city, district, postalCode, label, isDefault }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to save")

      onSaved(data)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden">

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-lg font-bold text-neutral-900">
            {isEditing ? "Edit Shipping Address" : "Add new Shipping Address"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Row 1 — Full name + District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your first and last name"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700">
                District <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={inputClass}
              >
                <option value="">Please choose your district</option>
                {NEPAL_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 — Phone + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                type="tel"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kathmandu"
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3 — Street + Postal code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700">
                Building / House No / Street <span className="text-red-500">*</span>
              </label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House# 12, Street# 5"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700">
                Postal Code <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 44600"
                className={inputClass}
              />
            </div>
          </div>

          {/* Label picker */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-700">
              Select a label for effective delivery:
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLabel("HOME")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  label === "HOME"
                    ? "border-red-500 text-red-600 bg-red-50"
                    : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                }`}
              >
                <Home className="w-4 h-4" />
                HOME
              </button>
              <button
                type="button"
                onClick={() => setLabel("OFFICE")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  label === "OFFICE"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                OFFICE
              </button>
            </div>
          </div>

          {/* Set as default checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 accent-neutral-900"
            />
            <span className="text-sm text-neutral-700">Set as default address</span>
          </label>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-end gap-3 bg-neutral-50/50">
          <button
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add Address"}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  )
}