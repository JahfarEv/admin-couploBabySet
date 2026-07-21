const PALETTE = ['bg-blush-200 text-mauve-600', 'bg-mint-100 text-mint-500', 'bg-sky-100 text-sky-500', 'bg-sand-100 text-ink-soft']

function hashToIndex(value: string, mod: number) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 997
  }
  return hash % mod
}

export default function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' }) {
  const colorClass = PALETTE[hashToIndex(initials, PALETTE.length)]
  const sizeClass = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
  return (
    <span
      className={`inline-flex flex-shrink-0 items-center justify-center rounded-full font-semibold ${colorClass} ${sizeClass}`}
    >
      {initials}
    </span>
  )
}
