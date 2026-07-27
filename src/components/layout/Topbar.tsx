import { Bell, HelpCircle, LogOut, Search } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function Topbar({ searchPlaceholder = 'Search for orders, products...' }: { searchPlaceholder?: string }) {
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="flex items-center gap-4 border-b border-black/5 bg-cream px-8 py-5">
      {/* <div className="relative flex-1 max-w-md">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
        />
      </div> */}

      <div className="ml-auto flex items-center gap-4">
        {/* <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-black/[0.04]"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-black/[0.04]"
          aria-label="Help"
        >
          <HelpCircle size={19} />
        </button> */}
        <div className="h-6 w-px bg-black/10" />
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="font-display text-lg font-semibold text-mauve-600"
          >
            Couplo Baby Set
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-panel">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink-soft hover:bg-blush-50"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
