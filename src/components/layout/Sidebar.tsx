import { LayoutGrid, Package, ShoppingBag, Settings, ShoppingCart, Tags, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/products', label: 'Products', icon: Package, end: false },
  { to: '/categories', label: 'Categories', icon: Tags, end: false },
  { to: '/carts', label: 'Carts', icon: ShoppingCart, end: false },
  { to: '/orders', label: 'Orders', icon: ShoppingBag, end: false },
  { to: '/customers', label: 'Customers', icon: Users, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-black/5 bg-cream-soft px-4 py-6">
      <div className="px-2">
        <h1 className="font-display text-xl font-semibold text-mauve-600">Couplo Admin</h1>
        <p className="mt-0.5 text-xs text-ink-muted">Premium Management</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-blush-100 font-medium text-mauve-600'
                  : 'text-ink-soft hover:bg-black/[0.03]'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 rounded-xl border-t border-black/5 px-2 pt-4">
        <img
          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user?.email ?? 'admin')}`}
          alt=""
          className="h-9 w-9 rounded-full bg-blush-100 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{user?.name ?? 'Admin User'}</p>
          <p className="truncate text-xs text-ink-muted">{user?.role ?? 'Management Suite'}</p>
        </div>
      </div>
    </aside>
  )
}
