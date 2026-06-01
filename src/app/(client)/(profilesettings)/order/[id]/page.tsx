"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderBook = {
  id: number
  title: string
  author: string
  coverImage: string
  publisher: string | null
}

type OrderItem = {
  id: number
  quantity: number
  priceAtBuy: number
  book: OrderBook
}

type Payment = {
  id: string
  status: string
  transactionId: string | null
  amount: number
  paymentMethod: string | null
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
  createdAt: string
  cancelledAt: string | null
  cancelReason: string | null
  items: OrderItem[]
  payment: Payment | null
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED:  "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED:  "bg-green-50 text-green-700 border-green-200",
  CANCELLED:  "bg-red-50 text-red-700 border-red-200",
}

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "Pending",
  CONFIRMED:  "Confirmed",
  PROCESSING: "Processing",
  SHIPPED:    "Shipped",
  DELIVERED:  "Delivered",
  CANCELLED:  "Cancelled",
}

const STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]

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

// ─── Timeline ─────────────────────────────────────────────────────────────────

function OrderTimeline({ status }: { status: string }) {
  if (status === "CANCELLED") return null
  const currentIdx = STEPS.indexOf(status)

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
        Order Progress
      </p>
      <div className="flex items-start gap-0">
        {STEPS.map((step, idx) => {
          const done = idx <= currentIdx
          const isLast = idx === STEPS.length - 1
          return (
            <div key={step} className="flex items-start">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full border-2 mt-0.5 transition-colors ${
                  done ? "bg-neutral-900 border-neutral-900" : "bg-white border-neutral-300"
                }`} />
                <span className={`text-[10px] font-medium text-center w-14 leading-tight ${
                  done ? "text-neutral-700" : "text-neutral-400"
                }`}>
                  {STATUS_LABEL[step]}
                </span>
              </div>
              {!isLast && (
                <div className={`h-0.5 w-10 mt-1.5 transition-colors ${
                  idx < currentIdx ? "bg-neutral-900" : "bg-neutral-200"
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setOrder(data)
      })
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 w-48 bg-neutral-200 rounded" />
        <div className="h-32 bg-neutral-100 rounded-xl" />
        <div className="h-48 bg-neutral-100 rounded-xl" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-16 space-y-3">
        <Package className="w-10 h-10 text-neutral-300 mx-auto" />
        <p className="font-semibold text-neutral-700">Order not found</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-neutral-500 underline underline-offset-4"
        >
          Go back
        </button>
      </div>
    )
  }

  const isCancelled = order.status === "CANCELLED"

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
            <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-400">
              <Clock className="w-3 h-3" />
              <span>Placed {formatDate(order.createdAt)}</span>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div className="border border-neutral-200 rounded-xl p-5 bg-white">
          <OrderTimeline status={order.status} />
          {order.trackingNumber && (
            <p className="mt-4 text-xs text-neutral-500">
              Tracking: <span className="font-mono font-semibold text-neutral-800">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      )}

      {/* Cancelled reason */}
      {isCancelled && order.cancelReason && (
        <div className="border border-red-200 bg-red-50 rounded-xl px-5 py-4">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Cancellation Reason</p>
          <p className="text-sm text-red-700">{order.cancelReason}</p>
          {order.cancelledAt && (
            <p className="text-xs text-red-400 mt-1">Cancelled on {formatDate(order.cancelledAt)}</p>
          )}
        </div>
      )}

      {/* Items */}
      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/50">
          <p className="text-sm font-semibold text-neutral-800">
            {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
          </p>
        </div>
        <div className="divide-y divide-neutral-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 px-5 py-4">
              <Link href={`/books/${item.book.id}`} className="shrink-0">
                <div className="relative w-14 h-[74px] rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 hover:opacity-80 transition-opacity">
                  <Image
                    src={item.book.coverImage}
                    alt={item.book.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0 space-y-0.5">
                <Link href={`/books/${item.book.id}`}>
                  <p className="text-sm font-semibold text-neutral-800 line-clamp-2 hover:text-neutral-600 transition-colors">
                    {item.book.title}
                  </p>
                </Link>
                <p className="text-xs text-neutral-400">{item.book.author}</p>
                {item.book.publisher && (
                  <p className="text-xs text-neutral-400">{item.book.publisher}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-neutral-900">
                    NPR {(item.priceAtBuy * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two column: delivery + payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Delivery info */}
        <div className="border border-neutral-200 rounded-xl p-5 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <p className="text-sm font-semibold text-neutral-800">Delivery Info</p>
          </div>
          <div className="space-y-1 text-sm text-neutral-600">
            <p>{order.deliveryAddress}</p>
            <p>{order.phone}</p>
            {order.email && <p>{order.email}</p>}
          </div>
          {order.notes && (
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 font-medium mb-1">Note</p>
              <p className="text-xs text-neutral-600">{order.notes}</p>
            </div>
          )}
          {order.deliveredAt && (
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-400">
                Delivered: {formatDate(order.deliveredAt)}
              </p>
            </div>
          )}
        </div>

        {/* Payment summary */}
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
          <div className="pt-2 border-t border-neutral-100 space-y-1">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Method</span>
              <span>{formatPaymentMethod(order.paymentMethod)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Payment Status</span>
              <span className={`font-medium ${
                order.paymentStatus === "COMPLETED" ? "text-green-600"
                : order.paymentStatus === "FAILED" ? "text-red-500"
                : "text-amber-600"
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.payment?.transactionId && (
              <div className="flex justify-between text-xs text-neutral-500">
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