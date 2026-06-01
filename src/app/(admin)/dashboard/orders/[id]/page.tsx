"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, CreditCard, Package, Truck } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderUser = {
  id: number
  firstName: string
  lastName: string
  email: string
}

type OrderItem = {
  id: number
  quantity: number
  priceAtBuy: number
  book: { id: number; title: string; author: string; coverImage: string }
}

type Payment = {
  id: string
  status: string
  transactionId: string | null
  amount: number
  completedAt: string | null
}

type Order = {
  id: number
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  total: number
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  deliveryAddress: string
  phone: string
  email: string | null
  notes: string | null
  trackingNumber: string | null
  shippedAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  cancelReason: string | null
  createdAt: string
  user: OrderUser
  items: OrderItem[]
  payment: Payment | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED:  "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED:  "bg-green-50 text-green-700 border-green-200",
  CANCELLED:  "bg-red-50 text-red-700 border-red-200",
}

const ALL_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

function formatDate(str: string | null) {
  if (!str) return "—"
  return new Date(str).toLocaleDateString("en-NP", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function formatPaymentMethod(method: string) {
  return method === "CASH_ON_DELIVERY" ? "Cash on Delivery"
    : method === "KHALTI" ? "Khalti"
    : method === "ESEWA" ? "eSewa"
    : method
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Edit state
  const [newStatus, setNewStatus] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [saveMsg, setSaveMsg] = useState("")

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setOrder(data)
          setNewStatus(data.status)
          setTrackingNumber(data.trackingNumber ?? "")
          setCancelReason(data.cancelReason ?? "")
        }
      })
      .finally(() => setLoading(false))
  }, [params.id])

  const handleSave = async () => {
    if (!order) return
    setSaving(true)
    setSaveMsg("")
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || null,
          cancelReason: cancelReason || null,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setOrder((prev) => prev ? { ...prev, ...updated } : prev)
        setSaveMsg("Saved!")
        setTimeout(() => setSaveMsg(""), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 w-48 bg-neutral-200 rounded" />
        <div className="h-28 bg-neutral-100 rounded-xl" />
        <div className="h-48 bg-neutral-100 rounded-xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16 space-y-3">
        <Package className="w-10 h-10 text-neutral-300 mx-auto" />
        <p className="font-semibold text-neutral-700">Order not found</p>
        <button onClick={() => router.back()} className="text-sm text-neutral-500 underline underline-offset-4">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Back + header */}
      <div className="space-y-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to orders
        </button>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">{order.orderNumber}</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Placed {formatDate(order.createdAt)}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* ── Admin controls ── */}
      <div className="border border-neutral-200 rounded-xl p-5 bg-white space-y-4">
        <p className="text-sm font-semibold text-neutral-800">Update Order</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-600">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Tracking */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-600">Tracking Number</label>
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. NP123456789"
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
        </div>

        {/* Cancel reason — only show when cancelling */}
        {newStatus === "CANCELLED" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-600">Cancel Reason</label>
            <input
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {saveMsg && (
            <span className="text-sm text-green-600 font-medium">{saveMsg}</span>
          )}
        </div>
      </div>

      {/* Customer info */}
      <div className="border border-neutral-200 rounded-xl p-5 bg-white space-y-2">
        <p className="text-sm font-semibold text-neutral-800">Customer</p>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm text-neutral-800 font-medium">
              {order.user.firstName} {order.user.lastName}
            </p>
            <p className="text-xs text-neutral-400">{order.user.email}</p>
            <p className="text-xs text-neutral-300 mt-0.5">ID: {order.user.id}</p>
          </div>
          <Link
            href={`/dashboard/customers/${order.user.id}`}
            className="text-xs text-neutral-500 underline underline-offset-4 hover:text-neutral-900 transition-colors"
          >
            View customer
          </Link>
        </div>
      </div>

      {/* Items */}
      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/50">
          <p className="text-sm font-semibold text-neutral-800">
            {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
          </p>
        </div>
        <div className="divide-y divide-neutral-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 px-5 py-4 items-center">
              <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                <Image
                  src={item.book.coverImage}
                  alt={item.book.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate">{item.book.title}</p>
                <p className="text-xs text-neutral-400">{item.book.author}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-neutral-500">×{item.quantity}</p>
                <p className="text-sm font-semibold text-neutral-900">
                  NPR {(item.priceAtBuy * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery + payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="border border-neutral-200 rounded-xl p-5 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <p className="text-sm font-semibold text-neutral-800">Delivery</p>
          </div>
          <div className="space-y-1 text-sm text-neutral-600">
            <p>{order.deliveryAddress}</p>
            <p>{order.phone}</p>
            {order.email && <p>{order.email}</p>}
          </div>
          {order.trackingNumber && (
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-xs font-mono text-neutral-700">{order.trackingNumber}</span>
            </div>
          )}
          {order.notes && (
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 mb-1">Note</p>
              <p className="text-xs text-neutral-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="border border-neutral-200 rounded-xl p-5 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-neutral-400" />
            <p className="text-sm font-semibold text-neutral-800">Payment</p>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>NPR {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>− NPR {order.discount.toLocaleString()}</span>
              </div>
            )}
            {order.shippingCost > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>NPR {order.shippingCost.toLocaleString()}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span>NPR {order.tax.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-100">
              <span>Total</span>
              <span>NPR {order.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-500">
            <div className="flex justify-between">
              <span>Method</span>
              <span>{formatPaymentMethod(order.paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment</span>
              <span className={`font-medium ${
                order.paymentStatus === "COMPLETED" ? "text-green-600"
                : order.paymentStatus === "FAILED" ? "text-red-500"
                : "text-amber-600"
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.payment?.transactionId && (
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="font-mono">{order.payment.transactionId}</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}