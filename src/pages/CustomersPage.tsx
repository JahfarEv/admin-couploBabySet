// import { Search, Users } from 'lucide-react'
// import { useMemo, useState } from 'react'
// import Avatar from '@/components/ui/Avatar'
// import EmptyState from '@/components/ui/EmptyState'
// import { customers } from '@/data/mockData'

// export default function CustomersPage() {
//   const [query, setQuery] = useState('')

//   const filtered = useMemo(
//     () =>
//       customers.filter(
//         (c) =>
//           c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()),
//       ),
//     [query],
//   )

//   return (
//     <div>
//       <div>
//         <h2 className="font-display text-2xl font-semibold text-ink">Customers</h2>
//         <p className="mt-1 text-ink-muted">{customers.length} people have shopped with Couplo.</p>
//       </div>

//       <div className="mt-6 relative max-w-sm">
//         <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search by name or email..."
//           className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
//         />
//       </div>

//       <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-card">
//         {filtered.length === 0 ? (
//           <EmptyState icon={Users} title="No customers found" description="Try a different search term." />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[680px] border-collapse text-left text-sm">
//               <thead>
//                 <tr className="text-ink-muted">
//                   <th className="px-6 py-4 font-medium">Customer</th>
//                   <th className="px-6 py-4 font-medium">Location</th>
//                   <th className="px-6 py-4 font-medium">Orders</th>
//                   <th className="px-6 py-4 font-medium">Total Spent</th>
//                   <th className="px-6 py-4 font-medium">Joined</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((customer) => (
//                   <tr key={customer.id} className="border-t border-black/5">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <Avatar initials={customer.initials} />
//                         <div>
//                           <p className="font-medium text-ink">{customer.name}</p>
//                           <p className="text-xs text-ink-muted">{customer.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-ink-soft">{customer.location}</td>
//                     <td className="px-6 py-4 text-ink-soft">{customer.orders}</td>
//                     <td className="px-6 py-4 font-medium text-ink">${customer.totalSpent.toFixed(2)}</td>
//                     <td className="px-6 py-4 text-ink-muted">{customer.joined}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }







import { Search, Users, ArrowUpDown, CalendarDays, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import { db, collection, getDocs } from '@/config/firebase'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  initials: string
  location: string
  orders: number
  joined: string
  joinedTimestamp: number // epoch ms for sorting/filtering
}

type SortField = 'name' | 'orders' | 'joined'
type SortDirection = 'asc' | 'desc'

const SORT_OPTIONS: { label: string; field: SortField; dir: SortDirection }[] = [
  { label: 'Name A–Z', field: 'name', dir: 'asc' },
  { label: 'Name Z–A', field: 'name', dir: 'desc' },
  { label: 'Most Orders', field: 'orders', dir: 'desc' },
  { label: 'Fewest Orders', field: 'orders', dir: 'asc' },
  { label: 'Newest First', field: 'joined', dir: 'desc' },
  { label: 'Oldest First', field: 'joined', dir: 'asc' },
]

export default function CustomersPage() {
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortIndex, setSortIndex] = useState(0) // default: Name A–Z
  const [showNoOrders, setShowNoOrders] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function fetchCustomers() {
      try {
        setLoading(true)
        const [usersSnap, ordersSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'orders'))
        ])

        const orderCountsByEmail: Record<string, number> = {}
        const orderCountsById: Record<string, number> = {}

        ordersSnap.forEach((doc: any) => {
          const d = doc.data()
          if (d.userEmail) {
            orderCountsByEmail[d.userEmail] = (orderCountsByEmail[d.userEmail] || 0) + 1
          }
          if (d.userId) {
            orderCountsById[d.userId] = (orderCountsById[d.userId] || 0) + 1
          }
        })

        const data: Customer[] = usersSnap.docs.map((docSnap: any) => {
          const d = docSnap.data()
          const name = d.name ?? 'Unknown customer'
          const email = d.email ?? '—'
          
          let ordersCount = d.orders ?? 0
          if (d.email && orderCountsByEmail[d.email]) {
            ordersCount = orderCountsByEmail[d.email]
          } else if (orderCountsById[docSnap.id]) {
            ordersCount = orderCountsById[docSnap.id]
          }

          const joinedRaw = d.joinedDate ?? d.createdAt ?? null
          const joinedTimestamp = parseToTimestamp(joinedRaw)

          return {
            id: docSnap.id,
            name,
            email,
            phone: d.phone ?? '—',
            initials: getInitials(name),
            location: d.location ?? '—',
            orders: ordersCount,
            joined: formatDate(joinedRaw),
            joinedTimestamp,
          }
        })

        if (isMounted) setCustomers(data)
      } catch (err) {
        console.error('Failed to fetch customers:', err)
        if (isMounted) setError('Could not load customers. Please try again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCustomers()
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const sort = SORT_OPTIONS[sortIndex]
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null
    // Add 1 day to dateTo so that the end date is inclusive (covers full day)
    const toTs = dateTo ? new Date(dateTo).getTime() + 86_400_000 : null

    return customers
      .filter((c) => {
        // Text search
        const q = query.toLowerCase()
        const matchesQuery =
          c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
        if (!matchesQuery) return false

        // Date range filter
        if (fromTs && c.joinedTimestamp < fromTs) return false
        if (toTs && c.joinedTimestamp > toTs) return false

        // No orders filter
        if (showNoOrders && c.orders !== 0) return false

        return true
      })
      .sort((a, b) => {
        let cmp = 0
        switch (sort.field) {
          case 'name':
            cmp = a.name.localeCompare(b.name)
            break
          case 'orders':
            cmp = a.orders - b.orders
            break
          case 'joined':
            cmp = a.joinedTimestamp - b.joinedTimestamp
            break
        }
        return sort.dir === 'asc' ? cmp : -cmp
      })
  }, [customers, query, dateFrom, dateTo, sortIndex, showNoOrders])

  const hasActiveFilters = dateFrom || dateTo || showNoOrders

  function clearFilters() {
    setDateFrom('')
    setDateTo('')
    setShowNoOrders(false)
  }

  return (
    <div>
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Customers</h2>
        <p className="mt-1 text-ink-muted">{customers.length} people have shopped with Couplo.</p>
      </div>

      {/* Search + Filters toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown size={14} className="text-ink-faint" />
          <select
            value={sortIndex}
            onChange={(e) => setSortIndex(Number(e.target.value))}
            className="rounded-full border border-black/5 bg-white px-3 py-2.5 text-xs font-medium text-ink-soft focus:border-mauve-400 focus:outline-none"
          >
            {SORT_OPTIONS.map((opt, i) => (
              <option key={opt.label} value={i}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* No-orders toggle */}
        <button
          type="button"
          onClick={() => setShowNoOrders((v) => !v)}
          className={`flex-shrink-0 rounded-full px-3.5 py-2.5 text-xs font-medium transition-colors ${
            showNoOrders
              ? 'bg-mauve-600 text-white'
              : 'bg-white text-ink-soft border border-black/5'
          }`}
        >
          No Orders
        </button>
      </div>

      {/* Date range filters */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <CalendarDays size={14} className="text-ink-faint" />
        <span className="text-xs font-medium text-ink-muted">Joined:</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-full border border-black/5 bg-white px-3 py-2 text-xs text-ink-soft focus:border-mauve-400 focus:outline-none"
        />
        <span className="text-xs text-ink-faint">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-full border border-black/5 bg-white px-3 py-2 text-xs text-ink-soft focus:border-mauve-400 focus:outline-none"
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="mt-4 text-xs text-ink-faint">
          Showing {filtered.length} of {customers.length} customers
        </p>
      )}

      <div className="mt-3 rounded-2xl border border-black/5 bg-white shadow-card">
        {loading ? (
          <div className="p-8 text-center text-sm text-ink-muted">Loading customers…</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No customers found" description="Try a different search term or adjust your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-ink-muted">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
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
                    <td className="px-6 py-4 text-ink-soft">{customer.phone}</td>
                    <td className="px-6 py-4 text-ink-soft">{customer.orders}</td>
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

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Parse Firestore timestamp, ISO string, or date string into epoch ms. Returns 0 if unparseable. */
function parseToTimestamp(value: any): number {
  if (!value) return 0
  if (value?.toDate) return value.toDate().getTime()
  if (value?.seconds) return value.seconds * 1000
  const d = new Date(value)
  return isNaN(d.getTime()) ? 0 : d.getTime()
}

/** Format a raw date value to a readable string like "13 Aug 2026". */
function formatDate(value: any): string {
  if (!value) return '—'
  const ts = parseToTimestamp(value)
  if (ts === 0) return String(value)
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
