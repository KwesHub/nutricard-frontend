import type { Badge } from '../types'
import { formatNutrient } from '../utils/formatting'

const kindStyle: Record<Badge['kind'], string> = {
  strength: 'border-emerald-700 text-emerald-300',
  rare: 'border-amber-700 text-amber-300',
  watch: 'border-red-900 text-red-300',
}

export default function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${kindStyle[badge.kind] ?? kindStyle.strength}`}>
      {badge.kind === 'watch' ? `⚠ ${badge.label}` : formatNutrient(badge.label)}
      {badge.kind === 'rare' && (
        <span className="ml-1 text-amber-400" title="Hard to find in most diets">★</span>
      )}
    </span>
  )
}
