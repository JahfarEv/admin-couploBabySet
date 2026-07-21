const STYLES: Record<string, string> = {
  Shipped: 'bg-sky-100 text-sky-500',
  Delivered: 'bg-mint-100 text-mint-500',
  Pending: 'bg-blush-100 text-mauve-500',
  Processing: 'bg-blush-100 text-mauve-500',
  Cancelled: 'bg-sand-100 text-ink-muted',
  Active: 'bg-mint-100 text-mint-500',
  Draft: 'bg-sand-100 text-ink-muted',
  'Out of Stock': 'bg-blush-100 text-mauve-500',
}

export default function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? 'bg-sand-100 text-ink-muted'
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}
