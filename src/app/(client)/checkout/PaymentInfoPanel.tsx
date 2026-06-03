"use client"

import { PaymentMethod } from "@prisma/client"


interface PaymentInfoPanelProps {
  paymentMethod: PaymentMethod
}

export function PaymentInfoPanel({ paymentMethod }: PaymentInfoPanelProps) {
  if (paymentMethod === "ESEWA") {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-800">How eSewa payment works:</h3>
        <ol className="space-y-2 text-sm text-neutral-600 list-none">
          {[
            "Login to your eSewa account using your eSewa ID and Password",
            "Ensure your eSewa account is active and has sufficient balance",
            "Enter OTP (one time password) sent to your registered mobile number",
          ].map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="text-xs text-neutral-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
          ⚠️ Login with your eSewa mobile and <strong>PASSWORD</strong> (not MPin)
        </p>
      </div>
    )
  }

  if (paymentMethod === "KHALTI") {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-800">How Khalti payment works:</h3>
        <ol className="space-y-2 text-sm text-neutral-600">
          {[
            "Login to your Khalti account using your registered mobile number",
            "Ensure your Khalti wallet has sufficient balance",
            "Confirm payment using your Khalti MPIN",
          ].map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    )
  }

  // CASH_ON_DELIVERY
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-neutral-800">Cash on Delivery</h3>
      <ul className="space-y-2 text-sm text-neutral-600">
        {[
          "You may pay in cash to our courier upon receiving your parcel at the doorstep.",
          "Before agreeing to receive the parcel, check if your delivery status has been updated to 'Out for Delivery'.",
          "Before receiving, confirm that the airway bill shows that the parcel is from Monsoon Books.",
          "Before you make payment to the courier, confirm your order number, sender information, and tracking number on the parcel.",
        ].map((tip, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="text-neutral-400 mt-0.5 shrink-0">●</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}