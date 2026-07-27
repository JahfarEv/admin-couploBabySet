// import { Phone, ShoppingCart, Search } from 'lucide-react'
// import { useMemo, useState } from 'react'
// import Avatar from '@/components/ui/Avatar'
// import EmptyState from '@/components/ui/EmptyState'
// import { carts } from '@/data/mockData'

// export default function CartsPage() {
//   const [query, setQuery] = useState('')

//   const filtered = useMemo(() => {
//     return carts.filter((cart) => {
//       const haystack = `${cart.customerName} ${cart.phone} ${cart.items.map((item) => item.name).join(' ')}`.toLowerCase()
//       return haystack.includes(query.toLowerCase())
//     })
//   }, [query])

//   return (
//     <div>
//       <div className="flex flex-wrap items-start justify-between gap-4">
//         <div>
//           <h2 className="font-display text-2xl font-semibold text-ink">Cart Activity</h2>
//           <p className="mt-1 text-ink-muted">Customers with active carts, phone numbers, and product details.</p>
//         </div>
//       </div>

//       <div className="mt-6 flex flex-wrap items-center gap-3">
//         <div className="relative max-w-sm flex-1">
//           <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search by customer, phone, or item"
//             className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
//           />
//         </div>
//       </div>

//       <div className="mt-6 space-y-4">
//         {filtered.length === 0 ? (
//           <EmptyState
//             icon={ShoppingCart}
//             title="No carts found"
//             description="Try a different search term to find a customer cart."
//           />
//         ) : (
//           filtered.map((cart) => (
//             <div key={cart.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
//               <div className="flex flex-wrap items-start justify-between gap-4">
//                 <div className="flex items-center gap-3">
//                   <Avatar initials={cart.customerInitials} size="md" />
//                   <div>
//                     <h3 className="font-semibold text-ink">{cart.customerName}</h3>
//                     <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
//                       <Phone size={14} />
//                       <span>{cart.phone}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-ink-muted">Added {cart.addedAt}</p>
//                   <p className="mt-1 font-semibold text-ink">${cart.total.toFixed(2)}</p>
//                 </div>
//               </div>

//               <div className="mt-4 rounded-2xl border border-black/5 bg-cream-soft p-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-semibold text-ink">Products in cart</h4>
//                   <span className="text-sm text-ink-muted">{cart.items.length} items</span>
//                 </div>
//                 <div className="mt-3 space-y-2">
//                   {cart.items.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm">
//                       <div>
//                         <p className="text-sm font-medium text-ink">{item.name}</p>
//                         <p className="text-xs text-ink-muted">Qty: {item.quantity}</p>
//                       </div>
//                       <p className="text-sm font-semibold text-ink">${(item.price * item.quantity).toFixed(2)}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }








// import { Phone, ShoppingCart, Search } from 'lucide-react'
// import { useEffect, useMemo, useState } from 'react'
// import Avatar from '@/components/ui/Avatar'
// import EmptyState from '@/components/ui/EmptyState'
// import { db, collection, getDocs, doc, getDoc } from '@/config/firebase'

// export default function CartsPage() {
//   const [query_, setQuery] = useState('')
//   const [carts, setCarts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     let isMounted = true

//     async function fetchCarts() {
//       try {
//         setLoading(true)
//         const cartsSnap = await getDocs(collection(db, 'carts'))

//         // Skip empty/cleared carts
//         const cartDocs = cartsSnap.docs.filter((d) => {
//           const items = d.data().items
//           return Array.isArray(items) && items.length > 0
//         })

//         const enriched = await Promise.all(
//           cartDocs.map(async (cartDoc) => {
//             const userId = cartDoc.id
//             const items = cartDoc.data().items ?? []

//             let customerName = 'Unknown customer'
//             let phone = '—'
//             try {
//               const userSnap = await getDoc(doc(db, 'users', userId))
//               if (userSnap.exists()) {
//                 const u = userSnap.data()
//                 customerName = u.name ?? u.displayName ?? customerName
//                 phone = u.phone ?? u.phoneNumber ?? phone
//               }
//             } catch (e) {
//               console.warn(`Could not load user ${userId}:`, e)
//             }

//             const total = items.reduce(
//               (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 0),
//               0
//             )

//             const latestUpdate = items
//               .map((item) => item.updatedAt)
//               .filter(Boolean)
//               .sort()
//               .at(-1)

//             return {
//               id: userId,
//               customerName,
//               customerInitials: getInitials(customerName),
//               phone,
//               items: items.map((item, i) => ({
//                 id: `${item.productId ?? i}-${i}`,
//                 name: item.product?.name ?? 'Unknown item',
//                 quantity: item.quantity ?? 1,
//                 price: item.product?.price ?? 0,
//                 selectedColor: item.selectedColor,
//                 selectedSize: item.selectedSize,
//               })),
//               total,
//               addedAt: latestUpdate ? formatDate(new Date(latestUpdate)) : '',
//             }
//           })
//         )

//         if (isMounted) setCarts(enriched)
//       } catch (err) {
//         console.error('Failed to fetch carts:', err)
//         if (isMounted) setError('Could not load cart activity. Please try again.')
//       } finally {
//         if (isMounted) setLoading(false)
//       }
//     }

//     fetchCarts()
//     return () => { isMounted = false }
//   }, [])

//   const filtered = useMemo(() => {
//     return carts.filter((cart) => {
//       const haystack = `${cart.customerName} ${cart.phone} ${cart.items.map((item) => item.name).join(' ')}`.toLowerCase()
//       return haystack.includes(query_.toLowerCase())
//     })
//   }, [carts, query_])

//   return (
//     <div>
//       <div className="flex flex-wrap items-start justify-between gap-4">
//         <div>
//           <h2 className="font-display text-2xl font-semibold text-ink">Cart Activity</h2>
//           <p className="mt-1 text-ink-muted">Customers with active carts, phone numbers, and product details.</p>
//         </div>
//       </div>

//       <div className="mt-6 flex flex-wrap items-center gap-3">
//         <div className="relative max-w-sm flex-1">
//           <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
//           <input
//             type="text"
//             value={query_}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search by customer, phone, or item"
//             className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
//           />
//         </div>
//       </div>

//       <div className="mt-6 space-y-4">
//         {loading ? (
//           <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm text-ink-muted">
//             Loading cart activity…
//           </div>
//         ) : error ? (
//           <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-600">
//             {error}
//           </div>
//         ) : filtered.length === 0 ? (
//           <EmptyState
//             icon={ShoppingCart}
//             title="No carts found"
//             description="Try a different search term to find a customer cart."
//           />
//         ) : (
//           filtered.map((cart) => (
//             <div key={cart.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
//               <div className="flex flex-wrap items-start justify-between gap-4">
//                 <div className="flex items-center gap-3">
//                   <Avatar initials={cart.customerInitials} size="md" />
//                   <div>
//                     <h3 className="font-semibold text-ink">{cart.customerName}</h3>
//                     <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
//                       <Phone size={14} />
//                       <span>{cart.phone}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-ink-muted">Added {cart.addedAt}</p>
//                   <p className="mt-1 font-semibold text-ink">${cart.total.toFixed(2)}</p>
//                 </div>
//               </div>

//               <div className="mt-4 rounded-2xl border border-black/5 bg-cream-soft p-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-semibold text-ink">Products in cart</h4>
//                   <span className="text-sm text-ink-muted">{cart.items.length} items</span>
//                 </div>
//                 <div className="mt-3 space-y-2">
//                   {cart.items.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm">
//                       <div>
//                         <p className="text-sm font-medium text-ink">{item.name}</p>
//                         <p className="text-xs text-ink-muted">Qty: {item.quantity}</p>
//                       </div>
//                        <p className="text-sm font-semibold text-ink">${(item.price * item.quantity).toFixed(2)}</p>
//                       <p className="text-sm font-semibold text-ink">${(item.price * item.quantity).toFixed(2)}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// function getInitials(name = '') {
//   return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
// }

// function formatDate(date) {
//   return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
// }







import { Phone, ShoppingCart, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import { db, collection, getDocs, doc, getDoc } from '@/config/firebase'

interface Customization {
  babyAge?: string
  babyName?: string
  embroideredText?: string
  embroideryColor?: string
  embroideryText?: string
  fontStyle?: string
  giftMessage?: string
  giftWrap?: boolean
  specialNotes?: string
}

interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
  selectedColor?: string | null
  selectedSize?: string | null
  customization?: Customization | null
}

interface Cart {
  id: string
  customerName: string
  customerInitials: string
  phone: string
  items: CartItem[]
  total: number
  addedAt: string
}

export default function CartsPage() {
  const [query_, setQuery] = useState('')
  const [carts, setCarts] = useState<Cart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchCarts() {
      try {
        setLoading(true)
        const cartsSnap = await getDocs(collection(db, 'carts'))

        // Skip empty/cleared carts
        const cartDocs = cartsSnap.docs.filter((d) => {
          const items = d.data().items
          return Array.isArray(items) && items.length > 0
        })

        const enriched = await Promise.all(
          cartDocs.map(async (cartDoc) => {
            const userId = cartDoc.id
            const items = cartDoc.data().items ?? []

            let customerName = 'Unknown customer'
            let phone = '—'
            try {
              const userSnap = await getDoc(doc(db, 'users', userId))
              if (userSnap.exists()) {
                const u = userSnap.data()
                customerName = u.name ?? u.displayName ?? customerName
                phone = u.phone ?? u.phoneNumber ?? phone
              }
            } catch (e) {
              console.warn(`Could not load user ${userId}:`, e)
            }

            const total = items.reduce(
              (sum: number, item: any) => sum + (item.product?.price ?? 0) * (item.quantity ?? 0),
              0
            )

            const latestUpdate = items
              .map((item: any) => item.updatedAt)
              .filter(Boolean)
              .sort()
              .at(-1)

            const mappedItems: CartItem[] = items.map((item: any, i: number) => ({
              id: `${item.productId ?? i}-${i}`,
              name: item.product?.name ?? 'Unknown item',
              quantity: item.quantity ?? 1,
              price: item.product?.price ?? 0,
              selectedColor: item.selectedColor,
              selectedSize: item.selectedSize,
              customization: item.customization ?? null,
            }))

            const cart: Cart = {
              id: userId,
              customerName,
              customerInitials: getInitials(customerName),
              phone,
              items: mappedItems,
              total,
              addedAt: latestUpdate ? formatDate(new Date(latestUpdate)) : '',
            }
            return cart
          })
        )

        if (isMounted) setCarts(enriched)
      } catch (err) {
        console.error('Failed to fetch carts:', err)
        if (isMounted) setError('Could not load cart activity. Please try again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCarts()
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    return carts.filter((cart) => {
      const haystack = `${cart.customerName} ${cart.phone} ${cart.items.map((item) => item.name).join(' ')}`.toLowerCase()
      return haystack.includes(query_.toLowerCase())
    })
  }, [carts, query_])

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
            value={query_}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer, phone, or item"
            className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm text-ink-muted">
            Loading cart activity…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-600">
            {error}
          </div>
        ) : filtered.length === 0 ? (
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
                    <div key={item.id} className="rounded-xl bg-white px-3 py-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-ink">{item.name}</p>
                          <p className="text-xs text-ink-muted">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-ink">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      {item.customization && hasCustomization(item.customization) && (
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-black/5 pt-2 text-xs text-ink-muted">
                          {/* {item.customization.babyName && (
                            <span>
                              <span className="font-medium text-ink">Baby:</span> {item.customization.babyName}
                            </span>
                          )} */}
                          {item.customization.embroideredText && (
                            <span>
                              <span className="font-medium text-ink">Embroidery:</span> "{item.customization.embroideredText}"
                            </span>
                          )}
                          {/* {item.customization.embroideryColor && (
                            <span>
                              <span className="font-medium text-ink">Color:</span> {item.customization.embroideryColor}
                            </span>
                          )}
                          {item.customization.fontStyle && (
                            <span>
                              <span className="font-medium text-ink">Font:</span> {item.customization.fontStyle}
                            </span>
                          )}
                          {item.customization.giftWrap && (
                            <span className="font-medium text-mauve-500">🎁 Gift wrap</span>
                          )}
                          {item.customization.giftMessage && (
                            <span>
                              <span className="font-medium text-ink">Gift note:</span> "{item.customization.giftMessage}"
                            </span>
                          )}
                          {item.customization.specialNotes && (
                            <span>
                              <span className="font-medium text-ink">Notes:</span> {item.customization.specialNotes}
                            </span>
                          )} */}
                        </div>
                      )}
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

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function hasCustomization(c: Customization) {
  return Boolean(
    c.babyName || c.embroideredText || c.embroideryColor || c.fontStyle || c.giftWrap || c.giftMessage || c.specialNotes
  )
}