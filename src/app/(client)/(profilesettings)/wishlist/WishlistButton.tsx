'use client'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import LoginForm from '../../login/LoginDialogForm'


type Props = {
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  } | null
}

// Shared trigger button UI
const WishlistTriggerButton = ({ onClick }: { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="hidden sm:flex flex-col items-center gap-0.5 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-700 text-gray-600 transition-colors group"
  >
    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
    <span className="text-[10px] font-medium">Wishlist</span>
  </div>
)

export const WishlistButton = ({ user }: Props) => {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleWishlistClick = () => {
    if (user) {
      // If logged in, navigate to wishlist page
      router.push('/wishlist')
    } else {
      // If not logged in, open login dialog
      setIsDialogOpen(true)
    }
  }

  // If user is logged in, just show the button that navigates
  if (user) {
    return <WishlistTriggerButton onClick={handleWishlistClick} />
  }

  // If not logged in, show button that opens login dialog
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <WishlistTriggerButton />
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-0 ring-0 border-0 shadow-2xl">
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}