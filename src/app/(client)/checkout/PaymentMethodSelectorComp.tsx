"use client"

export type PaymentMethod = "CASH_ON_DELIVERY" | "ESEWA" | "KHALTI"

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; sub: string; icon: string }[] = [
  { id: "CASH_ON_DELIVERY", label: "Cash on Delivery", sub: "Pay on arrival", icon: "🏠" },
  { id: "ESEWA", label: "eSewa", sub: "Mobile Wallet", icon: "💚" },
  { id: "KHALTI", label: "Khalti", sub: "Mobile Wallet", icon: "💜" },
]

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({ paymentMethod, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-neutral-800">Select Payment Method</h2>

      <div className="grid grid-cols-3 gap-3">
        {PAYMENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all text-center ${
              paymentMethod === opt.id
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <p className="text-xs font-semibold text-neutral-800">{opt.label}</p>
              <p className="text-[10px] text-neutral-400">{opt.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}