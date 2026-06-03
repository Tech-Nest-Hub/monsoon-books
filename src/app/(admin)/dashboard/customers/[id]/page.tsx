"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  Ban,
  Truck,
  XCircle,
  Loader2,
  TrendingUp,
  Phone,
  Star,
} from "lucide-react"

type CustomerOrder = {
  id: number
  orderNumber: string
  total: number
  status: string
  createdAt: string
  itemsCount: number
}

type CustomerDetails = {
  id: number
  name: string
  email: string
  avatar: string | null
  phone: string | null
  status: "active" | "inactive" | "banned"
  provider: string | null
  joinDate: string
  location: string
  stats: {
    totalOrders: number
    totalSpent: number
    averageOrderValue: number
    completionRate: number
    lastOrderDate: string | null
  }
  recentOrders: CustomerOrder[]
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id

  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showBanConfirm, setShowBanConfirm] = useState(false)

  useEffect(() => {
    fetchCustomerDetails()
  }, [customerId])

  const fetchCustomerDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`)
      const data = await response.json()
      
      if (response.ok) {
        setCustomer(data.customer)
      } else {
        console.error("Failed to fetch customer:", data.error)
      }
    } catch (error) {
      console.error("Error fetching customer:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const response = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: parseInt(customerId as string), status: newStatus }),
      })
      
      if (response.ok) {
        setCustomer(prev => prev ? { ...prev, status: newStatus as any } : null)
        setShowBanConfirm(false)
      }
    } catch (error) {
      console.error("Failed to update customer status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "inactive":
        return "bg-yellow-100 text-yellow-700"
      case "banned":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "inactive":
        return <Clock className="w-4 h-4" />
      case "banned":
        return <Ban className="w-4 h-4" />
      default:
        return null
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-600 bg-green-50"
      case "SHIPPED":
        return "text-blue-600 bg-blue-50"
      case "CONFIRMED":
      case "PROCESSING":
        return "text-yellow-600 bg-yellow-50"
      case "CANCELLED":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="w-3.5 h-3.5" />
      case "SHIPPED":
        return <Truck className="w-3.5 h-3.5" />
      case "CONFIRMED":
      case "PROCESSING":
        return <Package className="w-3.5 h-3.5" />
      case "CANCELLED":
        return <XCircle className="w-3.5 h-3.5" />
      default:
        return <Clock className="w-3.5 h-3.5" />
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Customer not found</h2>
            <p className="text-gray-500 mb-6">The customer you're looking for doesn't exist.</p>
            <Link
              href="/admin/customers"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Customers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header with back button */}
        <div className="mb-6">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {customer.avatar ? (
                  <Image
                    src={customer.avatar}
                    alt={customer.name}
                    width={100}
                    height={100}
                    className="rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-3xl font-bold mx-auto">
                    {getInitials(customer.name)}
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900 mt-4">{customer.name}</h2>
                <p className="text-gray-500 text-sm">Customer ID: #{customer.id}</p>
                
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                    {getStatusIcon(customer.status)}
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                  {customer.provider && (
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      {customer.provider}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{customer.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Joined {formatDate(customer.joinDate)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 flex gap-2">
                <button
                  onClick={() => handleUpdateStatus("active")}
                  disabled={updatingStatus || customer.status === "active"}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleUpdateStatus("inactive")}
                  disabled={updatingStatus || customer.status === "inactive"}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Inactive
                </button>
                <button
                  onClick={() => setShowBanConfirm(true)}
                  disabled={updatingStatus || customer.status === "banned"}
                  className="flex-1 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ban
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-xs">Total Orders</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{customer.stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs">Total Spent</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer.stats.totalSpent)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">Avg. Order</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(customer.stats.averageOrderValue)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Package className="w-4 h-4" />
                  <span className="text-xs">Completion Rate</span>
                </div>
                <p className="text-lg font-bold text-green-600">{customer.stats.completionRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-green-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${customer.stats.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <p className="text-sm text-gray-500 mt-1">Latest {customer.recentOrders.length} orders</p>
              </div>

              {customer.recentOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {customer.recentOrders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-semibold text-gray-900 hover:text-red-600 transition"
                          >
                            {order.orderNumber}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                              {getOrderStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {customer.stats.totalOrders > customer.recentOrders.length && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <Link
                    href={`/admin/orders?customerId=${customer.id}`}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1"
                  >
                    View all {customer.stats.totalOrders} orders
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ban Confirmation Modal */}
      {showBanConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowBanConfirm(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Ban Customer?</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to ban <strong>{customer.name}</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              This will prevent them from placing new orders and accessing their account.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBanConfirm(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus("banned")}
                disabled={updatingStatus}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {updatingStatus ? "Banning..." : "Yes, Ban Customer"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}