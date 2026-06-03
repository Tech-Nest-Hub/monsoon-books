import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { signOut } from "@/app/auth/callback/action/auth"
import DashboardLayout from "@/app/(admin)/DashboardLayout"


const DashboardPage = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: user?.id },
  })

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/")
  }

  // Fetch dashboard stats
  const totalBooks = await prisma.book.count()
  const totalCategories = await prisma.category.count()
  const totalOrders = await prisma.order.count()
  const totalUsers = await prisma.user.count()

  const recentBooks = await prisma.book.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })

  return (
   
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary to-orange-600 p-8 text-white shadow-2xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              Welcome back, {dbUser?.firstName}! 👋
            </h1>
            <p className="text-red-100 text-lg">Manage your bookstore and track your business performance</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Books */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 hover:border-red-300">
            <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-semibold">Total Books</h3>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{totalBooks}</p>
              <p className="text-sm text-slate-500 mt-1">In your catalog</p>
            </div>
          </div>

          {/* Categories */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100 hover:border-orange-300">
            <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-semibold">Categories</h3>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{totalCategories}</p>
              <p className="text-sm text-slate-500 mt-1">Active categories</p>
            </div>
          </div>

          {/* Orders */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300">
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-semibold">Orders</h3>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{totalOrders}</p>
              <p className="text-sm text-slate-500 mt-1">Total orders</p>
            </div>
          </div>

          {/* Users */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
            <div className="absolute inset-0 bg-linear-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-semibold">Users</h3>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{totalUsers}</p>
              <p className="text-sm text-slate-500 mt-1">Registered users</p>
            </div>
          </div>
        </div>

        {/* Recent Books */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
          <div className="p-6 border-b border-red-100 bg-linear-to-r from-purple-50 to-orange-50">
            <h2 className="text-xl font-bold text-slate-900">Recent Books</h2>
            <p className="text-sm text-slate-600 mt-1">Latest additions to your catalog</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                          </svg>
                        </div>
                        <span className="font-medium text-slate-900 line-clamp-1">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-red-100 rounded-full">
                        {book.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">₹{book.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${book.stock > 0 ? "bg-green-500" : "bg-primary"}`}></div>
                        <span className={`text-sm font-medium ${book.stock > 0 ? "text-green-700" : "text-primary"}`}>
                          {book.stock} units
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/dashboard/books/new" className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-orange-600 p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Add New Book</h3>
              <p className="text-red-100 text-sm">Add a new book to your catalog</p>
            </div>
          </a>

          <a href="/dashboard/categories" className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Manage Categories</h3>
              <p className="text-blue-100 text-sm">View and edit book categories</p>
            </div>
          </a>

          <a href="/dashboard/books" className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">All Books</h3>
              <p className="text-purple-100 text-sm">Browse your entire inventory</p>
            </div>
          </a>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Account Information</h2>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div>
              <p className="text-sm text-slate-600 font-semibold mb-1">Name</p>
              <p className="text-lg text-slate-900 font-medium">{dbUser?.firstName} {dbUser?.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 font-semibold mb-1">Email</p>
              <p className="text-lg text-slate-900 font-medium">{dbUser?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 font-semibold mb-1">Role</p>
              <p className="text-lg">
                <span className="inline-block px-3 py-1 text-sm font-bold text-white bg-linear-to-r from-primary to-orange-600 rounded-full">
                  {dbUser?.role}
                </span>
              </p>
            </div>
          </div>

          <form action={signOut}>
            <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-primary to-orange-600 text-white rounded-lg font-bold hover:from-primary hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
              Sign Out
            </button>
          </form>
        </div>
      </div>

  )
}

export default DashboardPage;