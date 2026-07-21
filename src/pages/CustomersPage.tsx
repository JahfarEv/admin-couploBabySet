import { Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import { customers } from '@/data/mockData'

export default function CustomersPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  return (
    <div>
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Customers</h2>
        <p className="mt-1 text-ink-muted">{customers.length} people have shopped with Couplo.</p>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-card">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No customers found" description="Try a different search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-ink-muted">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id} className="border-t border-black/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={customer.initials} />
                        <div>
                          <p className="font-medium text-ink">{customer.name}</p>
                          <p className="text-xs text-ink-muted">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-soft">{customer.location}</td>
                    <td className="px-6 py-4 text-ink-soft">{customer.orders}</td>
                    <td className="px-6 py-4 font-medium text-ink">${customer.totalSpent.toFixed(2)}</td>
                    <td className="px-6 py-4 text-ink-muted">{customer.joined}</td>
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
