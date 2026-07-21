import { CalendarDays, MessageCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { recentOrders, statSummaries } from '@/data/mockData'
import { useProduct } from '@/hooks/useProduct'

export default function DashboardPage() {
  const { products } = useProduct()
  const topProducts = products
    .slice()
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3)

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Overview</h2>
          <p className="mt-1 text-ink-muted">Welcome back to your nurtured boutique dashboard.</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink-soft shadow-card"
        >
          <CalendarDays size={16} />
          Last 30 Days
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statSummaries.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink">Recent Orders</h3>
            <Link to="/orders" className="text-sm font-medium text-sky-500 hover:underline">
              View All
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-ink-muted">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-black/5">
                    <td className="py-4 font-medium text-ink">{order.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={order.customerInitials} size="sm" />
                        <span className="text-ink-soft">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-ink-muted">{order.date}</td>
                    <td className="py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 text-right font-semibold text-ink">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold text-ink">Quick Actions</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 py-3.5 text-sm font-medium text-ink-soft transition-colors hover:border-mauve-400 hover:text-mauve-600"
              >
                <Plus size={16} />
                Add New Product
              </Link>
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl bg-mint-500 px-4 py-3.5 text-left text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle size={18} />
                <span>
                  <span className="block text-sm font-medium">WhatsApp Inquiries</span>
                  <span className="block text-xs text-white/80">12 Pending Messages</span>
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold text-ink">Top Products</h3>
            <div className="mt-4 flex flex-col gap-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blush-100 text-lg">
                    🧸
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-ink-muted">{product.sold} sold</p>
                  </div>
                  <span className="text-sm font-semibold text-ink">${product.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/products"
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-mauve-600 text-white shadow-panel transition-transform hover:scale-105"
        aria-label="Add new product"
      >
        <Plus size={22} />
      </Link>
    </div>
  )
}
