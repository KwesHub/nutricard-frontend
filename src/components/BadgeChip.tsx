import { useState } from 'react'
import type { Badge } from '../types'
import { formatNutrient } from '../utils/formatting'

const kindStyle: Record<Badge['kind'], string> = {
  strength: 'border-emerald-700 text-emerald-300',
  rare: 'border-amber-700 text-amber-300',
  watch: 'border-red-900 text-red-300',
}

export default function BadgeChip({ badge }: { badge: Badge }) {
  const [open, setOpen] = useState(false)
  const hasDetail = !!badge.detail

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => hasDetail && setOpen(o => !o)}
        title={badge.detail ?? undefined}
        className={`text-xs px-2 py-0.5 rounded-full border ${kindStyle[badge.kind]} ${
          hasDetail ? 'cursor-pointer hover:bg-gray-800' : 'cursor-default'
        }`}
      >
        {badge.kind === 'watch' ? `⚠ ${badge.label}` : formatNutrient(badge.label)}
        {badge.kind === 'rare' && <span className="ml-1 text-amber-400">★</span>}
      </button>
      {open && hasDetail && (
        <span
          onClick={() => setOpen(false)}
          className="absolute left-0 top-full mt-1 z-20 w-56 p-2 rounded-lg bg-gray-800 border border-gray-600 text-xs text-gray-200 shadow-lg cursor-pointer"
        >
          {badge.detail}
        </span>
      )}
    </span>
  )
}
