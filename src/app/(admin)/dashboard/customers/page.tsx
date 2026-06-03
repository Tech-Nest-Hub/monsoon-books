"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  MoreVertical,
  User,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle,
  Loader2,
  Clock,
  Package,
  TrendingUp,
} from "lucide-react"

type CustomerStats = {
  totalOrders: number
  totalSpent: number
  lastOrderDate: string | null
  lastOrderNumber: string | null
  lastOrderStatus: string | null
  completionRate: number
}

type Customer = {
  id: number
  name: string
  email: string
  avatar: string | null
  status: "active" | "inactive" | "banned"
  provider: string | null
  location: string
  stats: CustomerStats
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    fetchCustomers()
  }, [searchTerm, statusFilter, currentPage])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/admin/customers?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setCustomers(data.customers)
        setTotalPages(data.pagination.totalPages)
        setTotalCustomers(data.pagination.total)
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (customerId: number, newStatus: string) => {
    setUpdatingStatus(customerId)
    try {
      const response = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, status: newStatus }),
      })
      
      if (response.ok) {
        fetchCustomers()
        if (selectedCustomer?.id === customerId) {
          setSelectedCustomer({ ...selectedCustomer, status: newStatus as any })
        }
      }
    } catch (error) {
      console.error("Failed to update customer status:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "inactive":
        return "bg-yellow-100 text-yellow-700"
      case "banned":
        return "bg-red-100 text-primary"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3.5 h-3.5" />
      case "inactive":
        return <Clock className="w-3.5 h-3.5" />
      case "banned":
        return <Ban className="w-3.5 h-3.5" />
      default:
        return null
    }
  }

  const getOrderStatusColor = (status: string | null) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-600"
      case "SHIPPED":
        return "text-blue-600"
      case "CONFIRMED":
      case "PROCESSING":
        return "text-yellow-600"
      case "CANCELLED":
        return "text-primary"
      default:
        return "text-gray-500"
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
      month: "short",
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

  const getStats = () => {
    const activeCount = customers.filter(c => c.status === "active").length
    const totalOrders = customers.reduce((sum, c) => sum + c.stats.totalOrders, 0)
    const totalRevenue = customers.reduce((sum, c) => sum + c.stats.totalSpent, 0)
    return { activeCount, totalOrders, totalRevenue }
  }

  const stats = getStats()

  if (loading && customers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage and view all customer information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Orders</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Total Spent</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {customer.avatar ? (
                          <Image
                            src={customer.avatar}
                            alt={customer.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(customer.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500">ID: #{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[200px]">{customer.email}</span>
                        </div>
                        {customer.provider && (
                          <p className="text-xs text-gray-400 ml-5">
                            via {customer.provider}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        {customer.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-900">{customer.stats.totalOrders}</span>
                      </div>
                      {customer.stats.lastOrderNumber && (
                        <p className="text-xs text-gray-400 mt-1">
                          Last: {customer.stats.lastOrderNumber}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(customer.stats.totalSpent)}
                      </p>
                      {customer.stats.completionRate > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">
                            {customer.stats.completionRate}% delivered
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                        {getStatusIcon(customer.status)}
                        {customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setShowDetailsModal(true)
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <div className="relative group">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                              onClick={() => handleUpdateStatus(customer.id, "active")}
                              disabled={updatingStatus === customer.id}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Set Active
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(customer.id, "inactive")}
                              disabled={updatingStatus === customer.id}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <Clock className="w-4 h-4 text-yellow-600" />
                              Set Inactive
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(customer.id, "banned")}
                              disabled={updatingStatus === customer.id}
                              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-purple-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <Ban className="w-4 h-4" />
                              Ban Customer
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCustomers)} of {totalCustomers} customers
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowDetailsModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-xl z-50 max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                {selectedCustomer.avatar ? (
                  <Image
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(selectedCustomer.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-gray-500">Customer ID: #{selectedCustomer.id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                      {getStatusIcon(selectedCustomer.status)}
                      {selectedCustomer.status ? selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1) : "Active"}
                    </span>
                    {selectedCustomer.provider && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        {selectedCustomer.provider}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 break-all">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedCustomer.location}</span>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Order Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCustomer.stats.totalOrders}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedCustomer.stats.totalSpent)}</p>
                  </div>
                  {selectedCustomer.stats.lastOrderDate && (
                    <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                      <p className="text-sm text-gray-500">Last Order</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedCustomer.stats.lastOrderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedCustomer.stats.lastOrderDate)}
                      </p>
                      {selectedCustomer.stats.lastOrderStatus && (
                        <p className={`text-sm font-medium mt-1 ${getOrderStatusColor(selectedCustomer.stats.lastOrderStatus)}`}>
                          Status: {selectedCustomer.stats.lastOrderStatus}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex gap-3">
                <Link
                  href={`/admin/orders?customerId=${selectedCustomer.id}`}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-700 transition"
                >
                  View All Orders
                </Link>
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedCustomer.id, "active")
                    setShowDetailsModal(false)
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  Set Active
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedCustomer.id, "banned")
                    setShowDetailsModal(false)
                  }}
                  className="px-4 py-2 border border-red-200 text-primary rounded-lg hover:bg-purple-50 transition"
                >
                  Ban
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}