// import { CreditCard, ShoppingBag, UserPlus, TrendingUp, type LucideIcon } from 'lucide-react'
// import type { StatSummary } from '@/types'

// const ICONS: Record<StatSummary['icon'], LucideIcon> = {
//   sales: CreditCard,
//   orders: ShoppingBag,
//   customers: UserPlus,
//   products: TrendingUp,
// }

// const ICON_BG: Record<StatSummary['icon'], string> = {
//   sales: 'bg-blush-100 text-mauve-600',
//   orders: 'bg-sky-100 text-sky-500',
//   customers: 'bg-sand-100 text-ink-soft',
//   products: 'bg-blush-100 text-mauve-600',
// }

// export default function StatCard({ stat }: { stat: StatSummary }) {
//   const Icon = ICONS[stat.icon]
//   return (
//     <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
//       <div className="flex items-start justify-between">
//         <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${ICON_BG[stat.icon]}`}>
//           <Icon size={20} strokeWidth={2} />
//         </span>
//         <span
//           className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
//             stat.deltaPositive ? 'bg-mint-100 text-mint-500' : 'bg-sand-100 text-ink-muted'
//           }`}
//         >
//           {stat.delta}
//         </span>
//       </div>
//       <p className="mt-4 text-sm text-ink-muted">{stat.label}</p>
//       <p className="mt-1 font-display text-2xl font-semibold text-ink">{stat.value}</p>
//     </div>
//   )
// }// components/ui/StatCard.tsx






// components/ui/StatCard.tsx
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  stat: {
    label: string
    value: string | number
    change: string
    trend: 'up' | 'down' | 'neutral'
    icon: LucideIcon
    badge?: string | number
  }
}

export default function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon
  
  // Make sure Icon is defined before rendering
  if (!Icon) {
    console.error('Icon is undefined for stat:', stat.label)
    return null
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card relative">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{stat.label}</span>
        <div className="flex items-center gap-2">
          {stat.badge && (
            <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {stat.badge}
            </span>
          )}
          <div className="rounded-full bg-mint-50 p-2 text-mint-600">
            <Icon size={18} />
          </div>
        </div>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{stat.value}</p>
      <p className={`mt-1 text-xs font-medium ${
        stat.trend === 'up' ? 'text-emerald-600' : 
        stat.trend === 'down' ? 'text-red-600' : 
        'text-ink-muted'
      }`}>
        {stat.change}
      </p>
    </div>
  )
}