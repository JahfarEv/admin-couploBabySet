import { ShoppingBag, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'
import { orders as initialOrders } from '@/data/mockData'
import type { Order, OrderStatus } from '@/types'

const FILTERS: (OrderStatus | 'All')[] = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrdersPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery =
        o.customerName.toLowerCase().includes(query.toLowerCase()) || o.id.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'All' || o.status === filter
      return matchesQuery && matchesFilter
    })
  }, [orders, query, filter])

  function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)))
  }

  return (
    <div>
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Orders</h2>
        <p className="mt-1 text-ink-muted">{orders.length} orders across all channels.</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
                filter === f ? 'bg-mauve-600 text-white' : 'bg-white text-ink-soft border border-black/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders found"
            description="Try a different search term or status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-ink-muted">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-t border-black/5">
                    <td className="px-6 py-4 font-medium text-ink">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={order.customerInitials} size="sm" />
                        <span className="text-ink-soft">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{order.date}</td>
                    <td className="px-6 py-4 text-ink-soft">{order.items}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="rounded-full border border-black/10 bg-cream-soft px-2.5 py-1.5 text-xs text-ink-soft focus:border-mauve-400 focus:outline-none"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-ink">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
