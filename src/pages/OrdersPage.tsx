// import { ShoppingBag, Search } from 'lucide-react'
// import { useMemo, useState } from 'react'
// import Avatar from '@/components/ui/Avatar'
// import EmptyState from '@/components/ui/EmptyState'
// import StatusBadge from '@/components/ui/StatusBadge'
// import { orders as initialOrders } from '@/data/mockData'
// import type { Order, OrderStatus } from '@/types'

// const FILTERS: (OrderStatus | 'All')[] = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
// const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

// export default function OrdersPage() {
//   const [query, setQuery] = useState('')
//   const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
//   const [orders, setOrders] = useState<Order[]>(initialOrders)

//   const filtered = useMemo(() => {
//     return orders.filter((o) => {
//       const matchesQuery =
//         o.customerName.toLowerCase().includes(query.toLowerCase()) || o.id.toLowerCase().includes(query.toLowerCase())
//       const matchesFilter = filter === 'All' || o.status === filter
//       return matchesQuery && matchesFilter
//     })
//   }, [orders, query, filter])

//   function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
//     setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)))
//   }

//   return (
//     <div>
//       <div>
//         <h2 className="font-display text-2xl font-semibold text-ink">Orders</h2>
//         <p className="mt-1 text-ink-muted">{orders.length} orders across all channels.</p>
//       </div>

//       <div className="mt-6 flex flex-wrap items-center gap-3">
//         <div className="relative max-w-sm flex-1">
//           <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search by order ID or customer..."
//             className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
//           />
//         </div>
//         <div className="flex items-center gap-2 overflow-x-auto">
//           {FILTERS.map((f) => (
//             <button
//               key={f}
//               type="button"
//               onClick={() => setFilter(f)}
//               className={`flex-shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
//                 filter === f ? 'bg-mauve-600 text-white' : 'bg-white text-ink-soft border border-black/5'
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-card">
//         {filtered.length === 0 ? (
//           <EmptyState
//             icon={ShoppingBag}
//             title="No orders found"
//             description="Try a different search term or status filter."
//           />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[680px] border-collapse text-left text-sm">
//               <thead>
//                 <tr className="text-ink-muted">
//                   <th className="px-6 py-4 font-medium">Order ID</th>
//                   <th className="px-6 py-4 font-medium">Customer</th>
//                   <th className="px-6 py-4 font-medium">Date</th>
//                   <th className="px-6 py-4 font-medium">Items</th>
//                   <th className="px-6 py-4 font-medium">Status</th>
//                   <th className="px-6 py-4 text-right font-medium">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((order) => (
//                   <tr key={order.id} className="border-t border-black/5">
//                     <td className="px-6 py-4 font-medium text-ink">{order.id}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2.5">
//                         <Avatar initials={order.customerInitials} size="sm" />
//                         <span className="text-ink-soft">{order.customerName}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-ink-muted">{order.date}</td>
//                     <td className="px-6 py-4 text-ink-soft">{order.items}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//                         <StatusBadge status={order.status} />
//                         <select
//                           value={order.status}
//                           onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
//                           className="rounded-full border border-black/10 bg-cream-soft px-2.5 py-1.5 text-xs text-ink-soft focus:border-mauve-400 focus:outline-none"
//                         >
//                           {STATUS_OPTIONS.map((status) => (
//                             <option key={status} value={status}>
//                               {status}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right font-semibold text-ink">${order.total.toFixed(2)}</td>
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



import { ShoppingBag, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { ImageUpload } from "@/components/ui/ImageUpload";
import StatusBadge from "@/components/ui/StatusBadge";
import { db, collection, getDocs, doc, updateDoc } from "@/config/firebase";
import type { OrderStatus } from "@/types";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  rate: number;
  embroideredText?: string;
  babyAge?: string;
  babyName?: string;
  bow?: string;
  capName?: string;
  contactNumber?: string;
  designImageName?: string;
  designImageUrl?: string;
  embroideryColor?: string;
  embroideryText?: string;
  fontStyle?: string;
  giftMessage?: string;
  giftWrap?: boolean;
  romperName?: string;
  size?: string;
  specialNotes?: string;
}

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  userEmail: string;
  customerInitials: string;
  date: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  trackingBarcodeImageUrl?: string;
}

const FILTERS: (OrderStatus | "All")[] = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [uploadingBarcodeId, setUploadingBarcodeId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "orders"));

        const data: Order[] = snapshot.docs.map((docSnap: any) => {
          const d = docSnap.data();
          const items: OrderItem[] = (d.items ?? []).map(
            (item: any, i: number) => {
              const c = item.customization || {};
              return {
                id: `${docSnap.id}-${i}`,
                productName:
                  item.productName ?? item.product?.name ?? "Unknown item",
                quantity: item.quantity ?? 1,
                rate: item.rate ?? item.product?.price ?? 0,
                embroideredText: item.embroideredText ?? c.embroideredText ?? undefined,
                babyAge: item.babyAge ?? c.babyAge ?? undefined,
                babyName: item.babyName ?? c.babyName ?? undefined,
                bow: item.bow ?? c.bow ?? undefined,
                capName: item.capName ?? c.capName ?? undefined,
                contactNumber: item.contactNumber ?? c.contactNumber ?? undefined,
                designImageName: item.designImageName ?? c.designImageName ?? undefined,
                designImageUrl: item.designImageUrl ?? c.designImageUrl ?? undefined,
                embroideryColor: item.embroideryColor ?? c.embroideryColor ?? undefined,
                embroideryText: item.embroideryText ?? c.embroideryText ?? undefined,
                fontStyle: item.fontStyle ?? c.fontStyle ?? undefined,
                giftMessage: item.giftMessage ?? c.giftMessage ?? undefined,
                giftWrap: item.giftWrap ?? c.giftWrap ?? undefined,
                romperName: item.romperName ?? c.romperName ?? undefined,
                size: item.size ?? item.selectedSize ?? c.size ?? c.selectedSize ?? undefined,
                specialNotes: item.specialNotes ?? c.specialNotes ?? undefined,
              };
            },
          );

          const total = items.reduce(
            (sum, item) => sum + item.rate * item.quantity,
            0,
          );

          return {
            id: docSnap.id,
            orderId: d.orderId ?? docSnap.id,
            customerName: d.userName ?? "Unknown customer",
            userEmail: d.userEmail ?? "Unknown customer",

            customerInitials: getInitials(d.userName ?? ""),
            date: formatOrderDate(d.orderDate),
            items,
            status: (d.status as OrderStatus) ?? "Pending",
            total,
            trackingBarcodeImageUrl: d.trackingBarcodeImageUrl ?? "",
          };
        });

        if (isMounted) setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (isMounted) setError("Could not load orders. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

const filtered = useMemo(() => {
  return orders.filter((o) => {
    const search = query.toLowerCase();

    const matchesQuery =
      (o.customerName || "").toLowerCase().includes(search) ||
      (o.userEmail || "").toLowerCase().includes(search) ||
      (o.orderId || "").toLowerCase().includes(search) ||
      (o.id || "").toLowerCase().includes(search);

    const matchesFilter =
      filter === "All" ||
      (o.status || "").toLowerCase() === filter.toLowerCase();

    return matchesQuery && matchesFilter;
  });
}, [orders, query, filter]);

  async function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    const previous = orders.find((o) => o.id === orderId)?.status;
    // Optimistic update
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order,
      ),
    );
    setUpdatingId(orderId);

    try {
      await updateDoc(doc(db, "orders", orderId), { status: nextStatus });
    } catch (err) {
      console.error(`Failed to update order ${orderId}:`, err);
      // Revert on failure
      if (previous) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: previous } : order,
          ),
        );
      }
      setError("Could not update order status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleBarcodeImageUpload(orderId: string, imageUrl: string) {
    const previous = orders.find(
      (o) => o.id === orderId,
    )?.trackingBarcodeImageUrl;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, trackingBarcodeImageUrl: imageUrl }
          : order,
      ),
    );

    try {
      await updateDoc(doc(db, "orders", orderId), {
        trackingBarcodeImageUrl: imageUrl,
      });
    } catch (err) {
      console.error(`Failed to update barcode image for order ${orderId}:`, err);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, trackingBarcodeImageUrl: previous ?? "" }
            : order,
        ),
      );
      setError("Could not update tracking barcode image. Please try again.");
    }
  }

  return (
    <div>
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Orders</h2>
        <p className="mt-1 text-ink-muted">
          {orders.length} orders across all channels.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
          />
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
                filter === f
                  ? "bg-mauve-600 text-white"
                  : "bg-white text-ink-soft border border-black/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-card">
        {loading ? (
          <div className="p-8 text-center text-sm text-ink-muted">
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
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
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-black/5 align-top"
                  >
                    <td className="px-6 py-4 font-medium text-ink">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={order.customerInitials} size="sm" />
                        <span className="text-ink-soft">
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {order.userEmail}
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{order.date}</td>
                    <td className="px-6 py-4 text-ink-soft">
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="border-b border-black/5 pb-3 last:border-0 last:pb-0">
                            <div className="font-medium text-ink">
                              {item.productName} × {item.quantity}
                            </div>
                            <div className="mt-1 flex flex-col gap-0.5 text-xs text-ink-muted">
                              {item.babyAge && <div><span className="font-medium">Baby Age:</span> {item.babyAge}</div>}
                              {item.babyName && <div><span className="font-medium">Baby Name:</span> {item.babyName}</div>}
                              {item.bow && <div><span className="font-medium">Bow:</span> {item.bow}</div>}
                              {item.capName && <div><span className="font-medium">Cap Name:</span> {item.capName}</div>}
                              {item.contactNumber && <div><span className="font-medium">Contact:</span> {item.contactNumber}</div>}
                              {(item.embroideredText || item.embroideryText) && <div><span className="font-medium">Embroidered Text:</span> {item.embroideredText || item.embroideryText}</div>}
                              {item.embroideryColor && <div><span className="font-medium">Embroidery Color:</span> {item.embroideryColor}</div>}
                              {item.fontStyle && <div><span className="font-medium">Font Style:</span> {item.fontStyle}</div>}
                              {item.giftMessage && <div><span className="font-medium">Gift Message:</span> {item.giftMessage}</div>}
                              {item.giftWrap && <div><span className="font-medium">Gift Wrap:</span> Yes</div>}
                              {item.romperName && <div><span className="font-medium">Romper Name:</span> {item.romperName}</div>}
                              {item.size && <div><span className="font-medium">Size:</span> {item.size}</div>}
                              {item.specialNotes && <div><span className="font-medium">Special Notes:</span> {item.specialNotes}</div>}
                              {item.designImageUrl && (
                                <div className="mt-2">
                                  <span className="font-medium block mb-1">Design Image:</span>
                                  <a href={item.designImageUrl} target="_blank" rel="noreferrer">
                                    <img src={item.designImageUrl} alt={item.designImageName || 'Design'} className="w-16 h-16 object-cover rounded border border-black/10" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex min-w-56 flex-col gap-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus,
                            )
                          }
                          className="rounded-full border border-black/10 bg-cream-soft px-2.5 py-1.5 text-xs text-ink-soft focus:border-mauve-400 focus:outline-none disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        </div>
                        {order.status === "Shipped" && (
                          <div className="rounded-xl border border-black/5 bg-cream-soft p-3">
                            <p className="mb-2 text-xs font-medium text-ink-soft">
                              Tracking Barcode
                            </p>
                            <ImageUpload
                              currentImage={order.trackingBarcodeImageUrl}
                              disabled={
                                updatingId === order.id ||
                                uploadingBarcodeId === order.id
                              }
                              onUploadStateChange={(isUploading) =>
                                setUploadingBarcodeId(
                                  isUploading ? order.id : null,
                                )
                              }
                              onImageUpload={(imageUrl) =>
                                handleBarcodeImageUpload(order.id, imageUrl)
                              }
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-ink">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatOrderDate(value: any) {
  if (!value) return "";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
