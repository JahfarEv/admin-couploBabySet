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







import { Search, Users } from 'lucide-react'
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
  totalSpent: number
  joined: string
}

export default function CustomersPage() {
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchCustomers() {
      try {
        setLoading(true)
        const snapshot = await getDocs(collection(db, 'users'))

        const data: Customer[] = snapshot.docs.map((docSnap: any) => {
          const d = docSnap.data()
          const name = d.name ?? 'Unknown customer'

          return {
            id: docSnap.id,
            name,
            email: d.email ?? '—',
            phone: d.phone ?? '—',

            initials: getInitials(name),
            location: d.location ?? '—',
            orders: d.orders ?? 0,
            totalSpent: d.totalSpent ?? 0,
            joined: d.joinedDate ?? '—',
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

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [customers, query],
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

      {error && (
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-card">
        {loading ? (
          <div className="p-8 text-center text-sm text-ink-muted">Loading customers…</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No customers found" description="Try a different search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-ink-muted">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
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
                    <td className="px-6 py-4 text-ink-soft">{customer.phone}</td>
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

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
