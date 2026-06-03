"use client"

import { CheckCircle2 } from "lucide-react"

interface StepBarProps {
  step: 1 | 2 | 3
}

export function StepBar({ step }: StepBarProps) {
  const steps = ["Review Order", "Payment Method", step === 3 ? "Done" : "Confirm"]
  
  return (
    <div className="flex items-center gap-0 mb-8">
      {[1, 2].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center gap-2 text-sm font-medium ${step >= s ? "text-neutral-900" : "text-neutral-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              step > s ? "bg-neutral-900 border-neutral-900 text-white"
              : step === s ? "border-neutral-900 text-neutral-900"
              : "border-neutral-300 text-neutral-400"
            }`}>
              {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
            </div>
            {steps[s - 1]}
          </div>
          <div className={`w-12 h-0.5 mx-2 ${step > s ? "bg-neutral-900" : "bg-neutral-200"}`} />
        </div>
      ))}
    </div>
  )
}