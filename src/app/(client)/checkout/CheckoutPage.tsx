"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin, ChevronRight, CheckCircle2, Package,
  Truck, Banknote, Smartphone, ArrowLeft,
  Mail, Plus,
} from "lucide-react"
import type { CartItem, PaymentMethod, ShippingAddress } from "@prisma/client"
import { StepBar } from "./StepBar"
import { PaymentMethodSelector } from "./PaymentMethodSelectorComp"
import { PaymentInfoPanel } from "./PaymentInfoPanel"
import { AddressDialog } from "../(profilesettings)/profile/addresses/AddressDialog"

type CartItemWithBook = CartItem & {
  book: {
    id: number
    title: string
    author: string
    coverImage: string
    price: number
  }
}

type CompletedOrder = {
  id: number
  orderNumber: string
  total: number
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  paymentMethod: string
  email?: string
  items: {
    quantity: number
    book: { title: string; coverImage: string }
  }[]
}


export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedItemIds = searchParams.get("selectedItems")

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [cartItems, setCartItems] = useState<CartItemWithBook[]>([])
  const [checkoutItems, setCheckoutItems] = useState<CartItemWithBook[]>([])
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH_ON_DELIVERY")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  // Load cart + addresses + user
  useEffect(() => {
    const load = async () => {
      try {
        const [cartRes, addrRes, userRes] = await Promise.all([
          fetch("/api/cart"),
          fetch("/api/user/addresses"),
          fetch("/api/user/profile"),
        ])
        const [cartData, addrData, userData] = await Promise.all([
          cartRes.json(), addrRes.json(), userRes.json(),
        ])

        if (cartData.items) {
          setCartItems(cartData.items)
          const ids = selectedItemIds
            ? new Set(selectedItemIds.split(",").map(Number))
            : new Set(cartData.items.map((i: CartItemWithBook) => i.id))
          setCheckoutItems(cartData.items.filter((i: CartItemWithBook) => ids.has(i.id)))
        }

        if (Array.isArray(addrData)) {
          setAddresses(addrData)
          const def = addrData.find((a: ShippingAddress) => a.isDefault)
          if (def) setSelectedAddressId(def.id)
        }

        if (userData.user?.email) setUserEmail(userData.user.email)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedItemIds])

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)

  // Pricing
  const subtotal = checkoutItems.reduce((s, i) => s + i.priceAtAdd * i.quantity, 0)
  const shippingCost = subtotal >= 1000 ? 0 : 100
  const tax = 0
  const discount = 0
  const total = subtotal + shippingCost + tax - discount

  // Place COD order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { setError("Please select a delivery address"); return }
    setError("")
    setPlacing(true)
    try {
      const res = await fetch("/api/checkout/cashondelivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems.map((i) => ({
            bookId: i.bookId,
            quantity: i.quantity,
            priceAtBuy: i.priceAtAdd,
          })),
          addressId: selectedAddressId,
          notes,
          tax,
          shippingCost,
          discount,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to place order")
      setCompletedOrder({ ...data.order, email: userEmail })
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-neutral-400">Loading checkout...</div>
      </div>
    )
  }

  if (checkoutItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center space-y-4">
        <div>
          <p className="text-neutral-500 font-medium">No items selected for checkout</p>
          <Link href="/cart" className="mt-3 inline-block text-sm text-neutral-900 underline underline-offset-4">
            Go to Cart
          </Link>
        </div>
      </div>
    )
  }

  // STEP 3: SUCCESS
  if (step === 3 && completedOrder) {
    const estimatedDate = new Date()
    estimatedDate.setDate(estimatedDate.getDate() + 5)
    const estDateStr = estimatedDate.toLocaleDateString("en-NP", { day: "numeric", month: "short" })

    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Success banner */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900">Thank you for your purchase!</h1>
            <p className="text-3xl font-bold text-neutral-900">NPR {completedOrder.total.toLocaleString()}</p>
            <p className="text-sm text-neutral-500">
              Your order number is{" "}
              <span className="font-bold text-neutral-800">{completedOrder.orderNumber}</span>
            </p>
            {completedOrder.paymentMethod === "CASH_ON_DELIVERY" && (
              <p className="text-sm text-neutral-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                💵 Please have <span className="font-semibold">NPR {completedOrder.total.toLocaleString()}</span> ready on delivery day.
              </p>
            )}
          </div>

          {/* Delivery estimate */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Estimated Delivery</p>
              <p className="text-sm font-bold text-neutral-900">Get by {estDateStr}</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                To track delivery: My Account → My Orders
              </p>
            </div>
          </div>

          {/* Email confirmation */}
          {completedOrder.email && (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                We've sent a confirmation email to{" "}
                <span className="font-semibold">{completedOrder.email}</span> with your order details.
              </p>
            </div>
          )}

          {/* Order summary */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <p className="text-sm font-semibold text-neutral-800">Order Summary</p>
            </div>

            <div className="px-5 py-3 space-y-3">
              {completedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative w-10 h-13 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image src={item.book.coverImage} alt={item.book.title} fill className="object-cover" sizes="40px" />
                  </div>
                  <p className="text-xs text-neutral-700 flex-1 line-clamp-2">{item.book.title}</p>
                  <p className="text-xs text-neutral-500 shrink-0">×{item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-neutral-100 space-y-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Subtotal ({completedOrder.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>NPR {completedOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Shipping Fee</span>
                <span>{completedOrder.shippingCost === 0 ? "Free" : `NPR ${completedOrder.shippingCost}`}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Promotion</span>
                  <span>− NPR {completedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Payment Amount</span>
                <span>NPR {completedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Link
            href="/order"
            className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-700 transition"
          >
            <Package className="w-4 h-4" />
            View Order
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Step bar */}
        <StepBar step={step} />

        {/* STEP 1: REVIEW ORDER */}
        {step === 1 && (
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">

            {/* Left */}
            <div className="space-y-4">

              {/* Address section */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <h2 className="text-sm font-semibold text-neutral-800">Delivery Address</h2>
                  </div>
                  <button
                    onClick={() => setAddressDialogOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add new
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <button
                    onClick={() => setAddressDialogOpen(true)}
                    className="w-full border-2 border-dashed border-neutral-200 rounded-xl py-6 text-sm text-neutral-400 hover:border-neutral-300 transition"
                  >
                    + Add a delivery address
                  </button>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-0.5 accent-neutral-900"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-neutral-900">{addr.fullName}</p>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-white bg-neutral-900 px-1.5 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 mt-0.5">
                            {addr.street}, {addr.city}, {addr.district}
                            {addr.postalCode && ` - ${addr.postalCode}`}
                          </p>
                          <p className="text-xs text-neutral-400">{addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/50">
                  <h2 className="text-sm font-semibold text-neutral-800">
                    {checkoutItems.length} {checkoutItems.length === 1 ? "Item" : "Items"}
                  </h2>
                </div>
                <div className="divide-y divide-neutral-100">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex gap-4 px-5 py-4">
                      <div className="relative w-14 h-[74px] rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                        <Image src={item.book.coverImage} alt={item.book.title} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-sm font-semibold text-neutral-800 line-clamp-2">{item.book.title}</p>
                        <p className="text-xs text-neutral-400">{item.book.author}</p>
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-neutral-900">
                            NPR {(item.priceAtAdd * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2">
                <label className="text-xs font-medium text-neutral-700">Order Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Special delivery instructions..."
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                />
              </div>
            </div>

            {/* Right — order summary */}
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 sticky top-6">
                <h2 className="text-sm font-semibold text-neutral-800">Order Summary</h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Subtotal ({checkoutItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingCost === 0 ? "Free" : `NPR ${shippingCost}`}
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-xs text-green-600">🎉 Free shipping on orders over NPR 1,000</p>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>− NPR {discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-100">
                    <span>Total</span>
                    <span>NPR {total.toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-primary bg-purple-50 border border-red-200 rounded-lg px-3 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  onClick={() => {
                    if (!selectedAddressId) { setError("Please select a delivery address"); return }
                    setError("")
                    setStep(2)
                  }}
                  className="w-full py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-700 transition flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-5">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <PaymentMethodSelector 
              paymentMethod={paymentMethod}
              onChange={setPaymentMethod}
            />

            <PaymentInfoPanel paymentMethod={paymentMethod} />

            {/* Order total reminder */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between">
              <span className="text-sm text-neutral-600">Total to pay</span>
              <span className="text-lg font-bold text-neutral-900">NPR {total.toLocaleString()}</span>
            </div>

            {error && (
              <p className="text-xs text-primary bg-purple-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* Place order / pay */}
            {paymentMethod === "CASH_ON_DELIVERY" && (
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full py-3.5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Banknote className="w-4 h-4" />
                {placing ? "Placing order..." : "Place Order (Cash on Delivery)"}
              </button>
            )}

            {(paymentMethod === "ESEWA" || paymentMethod === "KHALTI") && (
              <button
                disabled
                className="w-full py-3.5 bg-neutral-400 text-white text-sm font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                {paymentMethod === "ESEWA" ? "Pay with eSewa" : "Pay with Khalti"} — Coming soon
              </button>
            )}
          </div>
        )}

      </div>

      {/* Address dialog */}
      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onSaved={(addr) => {
          setAddresses((prev) => {
            const exists = prev.find((a) => a.id === addr.id)
            let updated = exists ? prev.map((a) => a.id === addr.id ? addr : a) : [addr, ...prev]
            if (addr.isDefault) updated = updated.map((a) => ({ ...a, isDefault: a.id === addr.id }))
            return updated
          })
          setSelectedAddressId(addr.id)
        }}
      />
    </div>
  )
}