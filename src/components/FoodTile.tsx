import { useState } from 'react'
import type { Food } from '../types'
import { formatCategory, formatName, formatRole } from '../utils/formatting'
import { foodIcon } from '../utils/foodIcons'
import { tierFor } from '../utils/tier'
import BadgeChip from './BadgeChip'

const STAT_LABELS: { key: 'protein' | 'micro' | 'energy' | 'gut' | 'phyto'; short: string; full: string }[] = [
  { key: 'protein', short: 'PRO', full: 'Protein quality' },
  { key: 'micro', short: 'MIC', full: 'Micronutrient density' },
  { key: 'energy', short: 'ENE', full: 'Energy profile' },
  { key: 'gut', short: 'GUT', full: 'Gut health' },
  { key: 'phyto', short: 'PHY', full: 'Phytonutrients' },
]

// Photos live in public/foods/<slug>.jpg; a missing file falls back to the emoji.
function photoUrl(name: string) {
  return `/foods/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`
}

interface Props {
  food: Food
  loading: boolean
  onOpen: () => void
}

export default function FoodTile({ food, loading, onOpen }: Props) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const overall = food.overallScore
  const tier = overall != null ? tierFor(overall) : null
  const face = tier ? tier.face : 'bg-gray-800'
  const text = tier ? tier.text : 'text-white'
  const subtext = tier ? tier.subtext : 'text-gray-300'

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl shadow-lg shadow-black/40 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-within:ring-2 focus-within:ring-white ${face} ${text}`}
    >
      <div className="flex items-start justify-between px-4 pt-3">
        <div className="leading-none">
          <span
            className="font-display text-6xl font-bold"
            aria-label={overall != null ? `Overall rating ${Math.round(overall)} out of 100` : 'Not rated yet'}
          >
            {overall != null ? Math.round(overall) : '–'}
          </span>
          <span className={`block font-display text-sm font-semibold uppercase tracking-widest ${subtext}`} aria-hidden="true">
            {tier ? tier.label : 'Scoring'}
          </span>
        </div>
        <div className={`pt-1 text-right text-xs font-medium ${subtext}`}>
          <p>{formatRole(food.foodRole)}</p>
          <p>{formatCategory(food.category)}</p>
        </div>
      </div>

      <div className="mx-4 mt-2 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-black/10">
        {photoFailed ? (
          <span className="text-7xl" aria-hidden="true">{foodIcon(food.name)}</span>
        ) : (
          <img
            src={photoUrl(food.name)}
            alt=""
            loading="lazy"
            onError={() => setPhotoFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <h2 className="px-4 pt-3 font-display text-3xl font-bold uppercase leading-none tracking-wide">
        <button
          type="button"
          onClick={onOpen}
          aria-disabled={loading}
          className="text-left after:absolute after:inset-0 after:content-[''] focus:outline-none"
        >
          {formatName(food.name)}
        </button>
      </h2>

      {food.stats ? (
        <dl className="mx-4 mt-3 mb-4 grid grid-cols-5 border-t border-current/30 pt-2 text-center">
          {STAT_LABELS.map(s => (
            <div key={s.key}>
              <dt className={`font-display text-xs font-semibold tracking-widest ${subtext}`}>
                <span className="sr-only">{s.full}</span>
                <span aria-hidden="true">{s.short}</span>
              </dt>
              <dd className="font-display text-2xl font-bold leading-tight">{Math.round(food.stats![s.key])}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={`mx-4 mt-3 mb-4 border-t border-current/30 pt-2 text-xs ${subtext}`}>Scores are still being calculated.</p>
      )}

      <div className="relative z-10 mt-auto flex min-h-[3.25rem] flex-wrap content-center gap-1.5 bg-ink/90 px-4 py-3 text-white">
        {loading && <span className="text-xs text-gray-300">Opening card…</span>}
        {!loading && food.badges && food.badges.length > 0
          ? food.badges.map(b => <BadgeChip key={`${b.kind}-${b.label}`} badge={b} />)
          : !loading && <span className="text-xs text-gray-400">Open the card for the full breakdown</span>}
      </div>
    </article>
  )
}
