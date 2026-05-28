'use client'
import { useRef, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LoginForm } from '@/app/(client)/login/LoginDialogForm'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'


type Props = {
  user: {
    id?: number
    firstName: string | null
    lastName: string | null
    email: string
  } | null
}

// Cart trigger button UI
const CartTriggerButton = ({ onClick, itemCount }: { onClick?: () => void; itemCount: number }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-700 text-gray-600 transition-colors relative group"
  >
    <span className="relative">
      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-6" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2.5 bg-red-600 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center leading-none">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </span>
    <span className="text-[10px] font-medium">Cart</span>
  </button>
)

export const CartButton = ({ user }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const { cart, updateQuantity, removeItem, totalItems, refreshCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Only refresh cart when user logs in (not on every render)
  const hasRefreshed = useRef(false)
  useEffect(() => {
    if (user && !hasRefreshed.current) {
      hasRefreshed.current = true
      refreshCart()
    }
  }, [user, refreshCart])

  const handleCartClick = () => {
    if (!user) {
      setIsDialogOpen(true)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleLoginSuccess = () => {
    setIsDialogOpen(false)
    refreshCart()
    setIsOpen(true)
  }

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setLoading(true)
    await updateQuantity(itemId, newQuantity)
    setLoading(false)
  }

  const handleRemoveItem = async (itemId: number) => {
    setLoading(true)
    await removeItem(itemId)
    setLoading(false)
  }

  // If not logged in, show button that opens login dialog
  if (!user) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <div>
            <CartTriggerButton onClick={handleCartClick} itemCount={0} />
          </div>
        </DialogTrigger>
        <DialogContent className="rounded-2xl p-0 ring-0 border-0 shadow-2xl">
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }

  // Logged in - show cart button with dropdown
  const cartItems = cart?.items || []

  return (
    <div className="relative hidden sm:block" ref={dropdownRef}>
      <CartTriggerButton onClick={handleCartClick} itemCount={totalItems} />

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-red-700" />
              <h3 className="text-sm font-semibold text-gray-800">Your Cart</h3>
            </div>
            <span className="text-xs text-gray-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Cart Items */}
          <div className="max-h-96 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">Your cart is empty</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-3 text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 hover:bg-gray-50 transition-colors">
                    {/* Book Cover */}
                    <div className="relative w-16 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {item.book.coverImage && (
                        <Image
                          src={item.book.coverImage}
                          alt={item.book.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {item.book.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{item.book.author}</p>
                      <p className="text-sm font-bold text-red-700 mt-1">
                        NPR {(item.priceAtAdd || item.book.price).toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={loading || item.quantity <= 1}
                          className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={loading || item.quantity >= item.book.stock}
                          className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                          className="ml-auto text-red-500 hover:text-red-700 transition disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-lg font-bold text-gray-900">
                  NPR {(cart?.totalPrice || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Shipping calculated at checkout
              </p>
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/checkout')
                }}
                className="w-full bg-red-700 hover:bg-red-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/cart')
                }}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2.5 rounded-lg border border-gray-300 transition-colors"
              >
                View Cart
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CartButton