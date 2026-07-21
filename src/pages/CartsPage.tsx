import { Phone, ShoppingCart, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import { carts } from '@/data/mockData'

export default function CartsPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return carts.filter((cart) => {
      const haystack = `${cart.customerName} ${cart.phone} ${cart.items.map((item) => item.name).join(' ')}`.toLowerCase()
      return haystack.includes(query.toLowerCase())
    })
  }, [query])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Cart Activity</h2>
          <p className="mt-1 text-ink-muted">Customers with active carts, phone numbers, and product details.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer, phone, or item"
            className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="No carts found"
            description="Try a different search term to find a customer cart."
          />
        ) : (
          filtered.map((cart) => (
            <div key={cart.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={cart.customerInitials} size="md" />
                  <div>
                    <h3 className="font-semibold text-ink">{cart.customerName}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                      <Phone size={14} />
                      <span>{cart.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink-muted">Added {cart.addedAt}</p>
                  <p className="mt-1 font-semibold text-ink">${cart.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-black/5 bg-cream-soft p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">Products in cart</h4>
                  <span className="text-sm text-ink-muted">{cart.items.length} items</span>
                </div>
                <div className="mt-3 space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-ink">{item.name}</p>
                        <p className="text-xs text-ink-muted">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-ink">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
