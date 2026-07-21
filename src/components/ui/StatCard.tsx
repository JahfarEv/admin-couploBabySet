import { CreditCard, ShoppingBag, UserPlus, TrendingUp, type LucideIcon } from 'lucide-react'
import type { StatSummary } from '@/types'

const ICONS: Record<StatSummary['icon'], LucideIcon> = {
  sales: CreditCard,
  orders: ShoppingBag,
  customers: UserPlus,
  products: TrendingUp,
}

const ICON_BG: Record<StatSummary['icon'], string> = {
  sales: 'bg-blush-100 text-mauve-600',
  orders: 'bg-sky-100 text-sky-500',
  customers: 'bg-sand-100 text-ink-soft',
  products: 'bg-blush-100 text-mauve-600',
}

export default function StatCard({ stat }: { stat: StatSummary }) {
  const Icon = ICONS[stat.icon]
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${ICON_BG[stat.icon]}`}>
          <Icon size={20} strokeWidth={2} />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            stat.deltaPositive ? 'bg-mint-100 text-mint-500' : 'bg-sand-100 text-ink-muted'
          }`}
        >
          {stat.delta}
        </span>
      </div>
      <p className="mt-4 text-sm text-ink-muted">{stat.label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink">{stat.value}</p>
    </div>
  )
}
