"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"

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
  book: { id: number; title: string; coverImage: string }
}

type Order = {
  id: number
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  total: number
  createdAt: string
  user: OrderUser
  items: OrderItem[]
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

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-NP", {
    year: "numeric", month: "short", day: "numeric",
  })
}

function formatPaymentMethod(method: string) {
  return method === "CASH_ON_DELIVERY" ? "COD"
    : method === "KHALTI" ? "Khalti"
    : method === "ESEWA" ? "eSewa"
    : method
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchOrders = useCallback(async (q: string, status: string, p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      if (status) params.set("status", status)
      params.set("page", String(p))

      const res = await fetch(`/api/admin/orders?${params.toString()}`)
      if (!res.ok) return
      const data = await res.json()
      setOrders(data.orders ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }
    searchTimeout.current = setTimeout(() => {
      setPage(1)
      fetchOrders(search, statusFilter, 1)
    }, 350)
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [search, statusFilter, fetchOrders])

  // Page change
  useEffect(() => {
    fetchOrders(search, statusFilter, page)
  }, [page])  // eslint-disable-line

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">Admin</p>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Orders</h1>
        </div>
        <span className="text-sm text-neutral-400">{total} total</span>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, order number, or customer ID..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
          >
            <option value="">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          <span>Order / Customer</span>
          <span>Books</span>
          <span>Method</span>
          <span>Status</span>
          <span>Total</span>
          <span>Date</span>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="divide-y divide-neutral-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 animate-pulse">
                <div className="space-y-1.5">
                  <div className="h-3 w-32 bg-neutral-200 rounded" />
                  <div className="h-3 w-24 bg-neutral-100 rounded" />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-8 h-11 bg-neutral-200 rounded" />
                  <div className="w-8 h-11 bg-neutral-200 rounded" />
                </div>
                <div className="h-3 w-16 bg-neutral-100 rounded self-center" />
                <div className="h-5 w-20 bg-neutral-200 rounded-full self-center" />
                <div className="h-3 w-20 bg-neutral-200 rounded self-center" />
                <div className="h-3 w-16 bg-neutral-100 rounded self-center" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="py-16 text-center text-sm text-neutral-400">
            No orders found{search || statusFilter ? " matching your filters" : ""}.
          </div>
        )}

        {/* Rows */}
        {!loading && orders.length > 0 && (
          <div className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors items-center group"
              >
                {/* Order + customer */}
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 truncate">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">{order.user.email}</p>
                  <p className="text-[10px] text-neutral-300">ID: {order.user.id}</p>
                </div>

                {/* Book covers */}
                <div className="flex gap-1.5">
                  {order.items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="relative w-8 h-11 rounded overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0"
                    >
                      <Image
                        src={item.book.coverImage}
                        alt={item.book.title}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-8 h-11 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-semibold text-neutral-500 shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* Payment method */}
                <span className="text-xs text-neutral-600">
                  {formatPaymentMethod(order.paymentMethod)}
                </span>

                {/* Status badge */}
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border w-fit ${STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>

                {/* Total */}
                <span className="text-sm font-semibold text-neutral-900">
                  NPR {order.total.toLocaleString()}
                </span>

                {/* Date */}
                <span className="text-xs text-neutral-400">
                  {formatDate(order.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-600" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}