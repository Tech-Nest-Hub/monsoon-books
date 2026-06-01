"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, ChevronRight, Clock } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderBook = {
  id: number
  title: string
  author: string
  coverImage: string
}

type OrderItem = {
  id: number
  quantity: number
  priceAtBuy: number
  book: OrderBook
}

type Order = {
  id: number
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  total: number
  createdAt: string
  deliveryAddress: string
  items: OrderItem[]
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

// ─── Timeline steps ───────────────────────────────────────────────────────────

const STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]

function OrderTimeline({ status }: { status: string }) {
  if (status === "CANCELLED") return null
  const currentIdx = STEPS.indexOf(status)

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = idx <= currentIdx
        const isLast = idx === STEPS.length - 1
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                  done
                    ? "bg-neutral-900 border-neutral-900"
                    : "bg-white border-neutral-300"
                }`}
              />
              <span className={`text-[9px] font-medium whitespace-nowrap ${done ? "text-neutral-700" : "text-neutral-400"}`}>
                {STATUS_LABEL[step]}
              </span>
            </div>
            {!isLast && (
              <div className={`h-0.5 w-8 mb-4 mx-0.5 transition-colors ${idx < currentIdx ? "bg-neutral-900" : "bg-neutral-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-NP", {
    year: "numeric", month: "short", day: "numeric",
  })
}

function formatPaymentMethod(method: string) {
  return method === "CASH_ON_DELIVERY" ? "Cash on Delivery"
    : method === "KHALTI" ? "Khalti"
    : method === "ESEWA" ? "eSewa"
    : method
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setOrders(data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse border border-neutral-100 rounded-xl p-5 space-y-3">
            <div className="h-4 w-40 bg-neutral-200 rounded" />
            <div className="h-3 w-24 bg-neutral-100 rounded" />
            <div className="flex gap-3">
              <div className="w-14 h-18 bg-neutral-200 rounded-lg" />
              <div className="w-14 h-18 bg-neutral-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
          <Package className="w-8 h-8 text-neutral-400" />
        </div>
        <div>
          <p className="font-semibold text-neutral-800">No orders yet</p>
          <p className="text-sm text-neutral-400 mt-1">
            Your order history will appear here.
          </p>
        </div>
        <Link
          href="/books"
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition-all"
        >
          Browse books
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Orders</h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          {orders.length} {orders.length === 1 ? "order" : "orders"} total
        </p>
      </div>

      {/* Order cards */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-neutral-200 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-900">
                    {order.orderNumber}
                  </p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(order.createdAt)}</span>
                  <span>·</span>
                  <span>{formatPaymentMethod(order.paymentMethod)}</span>
                </div>
              </div>

              <Link
                href={`/profile/orders/${order.id}`}
                className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Details
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Order body */}
            <div className="px-5 py-4 space-y-4">

              {/* Timeline */}
              <OrderTimeline status={order.status} />

              {/* Book covers strip */}
              <div className="flex gap-2.5 flex-wrap">
                {order.items.slice(0, 5).map((item) => (
                  <Link key={item.id} href={`/books/${item.book.id}`}>
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 hover:opacity-80 transition-opacity">
                      <Image
                        src={item.book.coverImage}
                        alt={item.book.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                      {item.quantity > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] font-bold px-1 rounded-tl">
                          ×{item.quantity}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                {order.items.length > 5 && (
                  <div className="w-12 h-16 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-500">
                    +{order.items.length - 5}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                <p className="text-xs text-neutral-400">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} item
                  {order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
                </p>
                <p className="text-sm font-bold text-neutral-900">
                  NPR {order.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}