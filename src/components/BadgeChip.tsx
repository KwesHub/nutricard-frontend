import { useState } from 'react'
import type { Badge } from '../types'
import { formatNutrient } from '../utils/formatting'

const kindStyle: Record<Badge['kind'], string> = {
  strength: 'border-emerald-700 text-emerald-800 dark:text-emerald-300',
  rare: 'border-amber-700 text-amber-900 dark:text-amber-300',
  watch: 'border-red-700 text-red-800 dark:border-red-900 dark:text-red-300',
  cap: 'border-orange-700 text-orange-900 dark:border-orange-800 dark:text-orange-300',
  info: 'border-slate-500 text-slate-700 dark:text-slate-300',
  compound: 'border-teal-700 text-teal-800 dark:text-teal-300',
}

// On the card's always-dark band the dark-theme colours apply whatever the page theme is.
const kindStyleOnDark: Record<Badge['kind'], string> = {
  strength: 'border-emerald-700 text-emerald-300',
  rare: 'border-amber-700 text-amber-300',
  watch: 'border-red-900 text-red-300',
  cap: 'border-orange-800 text-orange-300',
  info: 'border-slate-500 text-slate-300',
  compound: 'border-teal-700 text-teal-300',
}

function chipText(badge: Badge) {
  if (badge.kind === 'watch') return `⚠ ${badge.label}`
  if (badge.kind === 'cap') return `⛔ ${badge.label}`
  if (badge.kind === 'info') return `ⓘ ${badge.label}`
  if (badge.kind === 'compound') return `🌿 ${badge.label}`
  return formatNutrient(badge.label)
}

export default function BadgeChip({ badge, onDark = false }: { badge: Badge; onDark?: boolean }) {
  const [open, setOpen] = useState(false)
  const hasDetail = !!badge.detail

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => hasDetail && setOpen(o => !o)}
        title={badge.detail ?? undefined}
        className={`text-xs px-2 py-0.5 rounded-full border ${(onDark ? kindStyleOnDark : kindStyle)[badge.kind]} ${
          hasDetail ? 'cursor-pointer hover:bg-gray-800' : 'cursor-default'
        }`}
      >
        {chipText(badge)}
        {badge.kind === 'rare' && <span className={`ml-1 ${onDark ? 'text-amber-400' : 'text-amber-800 dark:text-amber-400'}`}>★</span>}
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
