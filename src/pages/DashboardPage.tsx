// import { CalendarDays, MessageCircle, Plus } from 'lucide-react'
// import { Link } from 'react-router-dom'
// import StatCard from '@/components/ui/StatCard'
// import StatusBadge from '@/components/ui/StatusBadge'
// import Avatar from '@/components/ui/Avatar'
// import { recentOrders, statSummaries } from '@/data/mockData'
// import { useProduct } from '@/hooks/useProduct'

// export default function DashboardPage() {
//   const { products } = useProduct()
//   const topProducts = products
//     .slice()
//     .sort((a, b) => b.sold - a.sold)
//     .slice(0, 3)

//   return (
//     <div>
//       <div className="flex flex-wrap items-start justify-between gap-4">
//         <div>
//           <h2 className="font-display text-2xl font-semibold text-ink">Overview</h2>
//           <p className="mt-1 text-ink-muted">Welcome back to your nurtured boutique dashboard.</p>
//         </div>
//         <button
//           type="button"
//           className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink-soft shadow-card"
//         >
//           <CalendarDays size={16} />
//           Last 30 Days
//         </button>
//       </div>

//       <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {statSummaries.map((stat) => (
//           <StatCard key={stat.label} stat={stat} />
//         ))}
//       </div>

//       <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
//         <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
//           <div className="flex items-center justify-between">
//             <h3 className="font-display text-lg font-semibold text-ink">Recent Orders</h3>
//             <Link to="/orders" className="text-sm font-medium text-sky-500 hover:underline">
//               View All
//             </Link>
//           </div>

//           <div className="mt-4 overflow-x-auto">
//             <table className="w-full min-w-[560px] border-collapse text-left text-sm">
//               <thead>
//                 <tr className="text-ink-muted">
//                   <th className="pb-3 font-medium">Order ID</th>
//                   <th className="pb-3 font-medium">Customer</th>
//                   <th className="pb-3 font-medium">Date</th>
//                   <th className="pb-3 font-medium">Status</th>
//                   <th className="pb-3 text-right font-medium">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentOrders.map((order) => (
//                   <tr key={order.id} className="border-t border-black/5">
//                     <td className="py-4 font-medium text-ink">{order.id}</td>
//                     <td className="py-4">
//                       <div className="flex items-center gap-2.5">
//                         <Avatar initials={order.customerInitials} size="sm" />
//                         <span className="text-ink-soft">{order.customerName}</span>
//                       </div>
//                     </td>
//                     <td className="py-4 text-ink-muted">{order.date}</td>
//                     <td className="py-4">
//                       <StatusBadge status={order.status} />
//                     </td>
//                     <td className="py-4 text-right font-semibold text-ink">${order.total.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="flex flex-col gap-6">
//           <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
//             <h3 className="font-display text-lg font-semibold text-ink">Quick Actions</h3>
//             <div className="mt-4 flex flex-col gap-3">
//               <Link
//                 to="/products"
//                 className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 py-3.5 text-sm font-medium text-ink-soft transition-colors hover:border-mauve-400 hover:text-mauve-600"
//               >
//                 <Plus size={16} />
//                 Add New Product
//               </Link>
//               <button
//                 type="button"
//                 className="flex items-center gap-3 rounded-xl bg-mint-500 px-4 py-3.5 text-left text-white transition-opacity hover:opacity-90"
//               >
//                 <MessageCircle size={18} />
//                 <span>
//                   <span className="block text-sm font-medium">WhatsApp Inquiries</span>
//                   <span className="block text-xs text-white/80">12 Pending Messages</span>
//                 </span>
//               </button>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
//             <h3 className="font-display text-lg font-semibold text-ink">Top Products</h3>
//             <div className="mt-4 flex flex-col gap-4">
//               {topProducts.map((product) => (
//                 <div key={product.id} className="flex items-center gap-3">
//                   <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blush-100 text-lg">
//                     🧸
//                   </span>
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm font-medium text-ink">{product.name}</p>
//                     <p className="text-xs text-ink-muted">{product.sold} sold</p>
//                   </div>
//                   <span className="text-sm font-semibold text-ink">${product.price}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Link
//         to="/products"
//         className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-mauve-600 text-white shadow-panel transition-transform hover:scale-105"
//         aria-label="Add new product"
//       >
//         <Plus size={22} />
//       </Link>
//     </div>
//   )
// }


// pages/DashboardPage.tsx
import { CalendarDays, MessageCircle, Plus, DollarSign, ShoppingBag, Package, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { useProduct } from '@/hooks/useProduct'
import { db, collection, getDocs, query, where, orderBy, limit } from '@/config/firebase'
import type { LucideIcon } from 'lucide-react'

interface StatSummary {
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  badge?: string | number
}

interface OrderItem {
  id: string
  productName: string
  quantity: number
  rate: number
  embroideredText?: string
}

interface Order {
  id: string
  customerName: string
  userEmail: string
  customerInitials: string
  date: string
  items: OrderItem[]
  status: string
  total: number
}

export default function DashboardPage() {
  const { products } = useProduct()
  const [stats, setStats] = useState<StatSummary[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const topProducts = products
    .slice()
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3)

  // Helper function to get initials
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  // Helper function to format date
  const formatDate = (value: any) => {
    if (!value) return "";
    const date = value?.toDate ? value.toDate() : new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  useEffect(() => {
    let isMounted = true

    async function fetchDashboardData() {
      try {
        setLoading(true)
        
        // Fetch all orders for statistics
        const ordersSnapshot = await getDocs(collection(db, 'orders'))
        const orders = ordersSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }))

        console.log('All orders:', orders) // Debug log

        // Fetch recent 5 orders (sorted by createdAt or orderDate)
        const recentOrdersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
        
        const recentOrdersData: Order[] = recentOrdersSnapshot.docs.map((docSnap: any) => {
          const d = docSnap.data()
          const items: OrderItem[] = (d.items ?? []).map((item: any, i: number) => ({
            id: `${docSnap.id}-${i}`,
            productName: item.productName ?? item.product?.name ?? "Unknown item",
            quantity: item.quantity ?? item.qty ?? 1,
            rate: item.rate ?? item.price ?? item.product?.price ?? 0,
            embroideredText: item.embroideredText ?? undefined,
          }))

          const total = items.reduce(
            (sum, item) => sum + item.rate * item.quantity,
            0,
          )

          return {
            id: d.orderId ?? docSnap.id,
            customerName: d.userName ?? d.customerName ?? "Unknown customer",
            userEmail: d.userEmail ?? d.customerEmail ?? "Unknown email",
            customerInitials: getInitials(d.userName ?? d.customerName ?? ""),
            date: formatDate(d.orderDate || d.createdAt),
            items,
            status: d.status ?? "Pending",
            total: total || d.total || 0,
          }
        })

        // Calculate statistics
        const totalOrders = orders.length
        
        // Calculate total revenue from DELIVERED orders only
        let totalRevenue = 0
        let deliveredOrders = 0
        
        orders.forEach((order: any) => {
          const orderStatus = order.status?.toLowerCase()
          
          if (orderStatus === 'delivered') {
            deliveredOrders++
            if (order.items && Array.isArray(order.items)) {
              const orderTotal = order.items.reduce((sum: number, item: any) => {
                const price = item.rate || item.price || item.product?.price || 0
                const quantity = item.quantity || item.qty || 1
                return sum + (price * quantity)
              }, 0)
              totalRevenue += orderTotal
            } else if (order.total) {
              totalRevenue += order.total
            }
          }
        })

        // Get pending orders count
        const pendingOrdersQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'pending')
        )
        const pendingSnapshot = await getDocs(pendingOrdersQuery)
        const pendingOrders = pendingSnapshot.size

        // Also check for 'Pending' (capitalized)
        const pendingCapitalizedQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'Pending')
        )
        const pendingCapitalizedSnapshot = await getDocs(pendingCapitalizedQuery)
        const totalPendingOrders = pendingOrders + pendingCapitalizedSnapshot.size

        // Get processing orders count
        const processingOrdersQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'Confirm and Processing')
        )
        const processingSnapshot = await getDocs(processingOrdersQuery)
        const processingOrders = processingSnapshot.size

        // Calculate growth (last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        let recentOrdersCount = 0
        let recentDeliveredRevenue = 0
        
        orders.forEach((order: any) => {
          const orderDate = order.orderDate || order.createdAt
          if (orderDate) {
            const date = new Date(orderDate)
            if (date >= thirtyDaysAgo) {
              recentOrdersCount++
              const orderStatus = order.status?.toLowerCase()
              if (orderStatus === 'delivered') {
                if (order.items && Array.isArray(order.items)) {
                  const orderTotal = order.items.reduce((sum: number, item: any) => {
                    const price = item.rate || item.price || item.product?.price || 0
                    const quantity = item.quantity || item.qty || 1
                    return sum + (price * quantity)
                  }, 0)
                  recentDeliveredRevenue += orderTotal
                } else if (order.total) {
                  recentDeliveredRevenue += order.total
                }
              }
            }
          }
        })

        const sixtyDaysAgo = new Date()
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
        
        let previousOrdersCount = 0
        let previousRevenue = 0
        
        orders.forEach((order: any) => {
          const orderDate = order.orderDate || order.createdAt
          if (orderDate) {
            const date = new Date(orderDate)
            if (date >= sixtyDaysAgo && date < thirtyDaysAgo) {
              previousOrdersCount++
              const orderStatus = order.status?.toLowerCase()
              if (orderStatus === 'delivered') {
                if (order.items && Array.isArray(order.items)) {
                  const orderTotal = order.items.reduce((sum: number, item: any) => {
                    const price = item.rate || item.price || item.product?.price || 0
                    const quantity = item.quantity || item.qty || 1
                    return sum + (price * quantity)
                  }, 0)
                  previousRevenue += orderTotal
                } else if (order.total) {
                  previousRevenue += order.total
                }
              }
            }
          }
        })

        // Calculate growth percentages
        const orderGrowth = previousOrdersCount === 0 
          ? 100 
          : ((recentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100

        const revenueGrowth = previousRevenue === 0 
          ? 100 
          : ((totalRevenue - previousRevenue) / previousRevenue) * 100

        // Get total products
        const totalProducts = products.length

        if (isMounted) {
          // Update stats with ₹ currency
          const newStats: StatSummary[] = [
            {
              label: 'Total Revenue',
              value: `₹${totalRevenue.toFixed(2)}`,
              change: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
              trend: revenueGrowth >= 0 ? 'up' : 'down',
              icon: DollarSign,
            },
            {
              label: 'Total Orders',
              value: totalOrders,
              change: `${orderGrowth >= 0 ? '+' : ''}${orderGrowth.toFixed(1)}%`,
              trend: orderGrowth >= 0 ? 'up' : 'down',
              icon: ShoppingBag,
            },
            {
              label: 'Total Products',
              value: totalProducts,
              change: '0%',
              trend: 'neutral',
              icon: Package,
            },
            {
              label: 'Pending Orders',
              value: totalPendingOrders,
              change: `${totalPendingOrders} pending, ${processingOrders} confirm and processing`,
              trend: totalPendingOrders > 0 ? 'down' : 'neutral',
              icon: Clock,
              badge: totalPendingOrders > 0 ? totalPendingOrders : undefined,
            },
          ]
          
          setStats(newStats)
          setRecentOrders(recentOrdersData)
          setError(null)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        if (isMounted) {
          setError('Could not load dashboard data. Please try again.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
    }
  }, [products])

  // Loading skeleton component
  const StatSkeleton = () => (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-gray-200"></div>
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        </div>
        <div className="mt-2 h-8 w-32 rounded bg-gray-200"></div>
        <div className="mt-1 h-4 w-20 rounded bg-gray-200"></div>
      </div>
    </div>
  )

  // Loading skeleton for orders table
  const OrderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-t border-black/5 py-4">
          <div className="h-4 w-20 rounded bg-gray-200"></div>
          <div className="flex items-center gap-2.5 flex-1">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <div className="h-4 w-24 rounded bg-gray-200"></div>
          </div>
          <div className="h-4 w-24 rounded bg-gray-200"></div>
          <div className="h-6 w-20 rounded-full bg-gray-200"></div>
          <div className="h-4 w-16 rounded bg-gray-200 ml-auto"></div>
        </div>
      ))}
    </div>
  )

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

      {error && (
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))
        ) : (
          stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))
        )}
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
            {loading ? (
              <OrderSkeleton />
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center text-sm text-ink-muted">
                No recent orders found.
              </div>
            ) : (
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
                      <td className="py-4 font-medium text-ink">
                        {order.id}
                      </td>
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
                      <td className="py-4 text-right font-semibold text-ink">
                        ₹{order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
              <Link
                to="/categories"
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 py-3.5 text-sm font-medium text-ink-soft transition-colors hover:border-mauve-400 hover:text-mauve-600"
              >
                <Plus size={16} />
                Add New Category
              </Link>
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
                  <span className="text-sm font-semibold text-ink">₹{product.price}</span>
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