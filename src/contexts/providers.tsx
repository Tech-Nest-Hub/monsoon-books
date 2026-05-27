// app/providers.tsx
'use client'

import { CartProvider } from "./CardContext"


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}