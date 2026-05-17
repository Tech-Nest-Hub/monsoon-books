'use client'
import { useRef, useState, useEffect } from 'react'
import { signOut } from '@/app/auth/callback/action/auth'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LoginForm } from '../login/LoginDialogForm'
import { BoxIcon, HeartIcon, SettingsIcon, UserIcon } from 'lucide-react'

type Props = {
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  } | null
}

const MENU_ITEMS = [
  {
    label: 'My orders',
    href: '/orders',
    icon: BoxIcon,
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: HeartIcon,
  },
  {
    label: 'Reviews',
    href: '/reviews',
    icon: UserIcon,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
]

// Shared trigger button UI
const TriggerButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-700 text-gray-600 transition-colors group"
  >
    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
    <span className="text-[10px] font-medium">Account</span>
  </button>
)

export const AccountButton = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Logged OUT — open login dialog ──────────────────────────────────────
  if (!user) {
    return (
      <Dialog>
        <DialogTrigger>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="rounded-2xl p-0 ring-0 border-0 shadow-2xl">
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }

  // ── Logged IN — show dropdown ────────────────────────────────────────────
  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?'

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

  return (
    <div className="relative hidden sm:block" ref={dropdownRef}>
      <TriggerButton onClick={() => setIsOpen((v) => !v)} />

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-b border-red-100">
            <div className="w-8 h-8 rounded-full bg-red-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
              <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {MENU_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                {(() => {
                  const Icon = item.icon
                  return <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                })()}
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Sign out */}
          <div className="p-3 border-t border-gray-100">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  )
}

export default AccountButton