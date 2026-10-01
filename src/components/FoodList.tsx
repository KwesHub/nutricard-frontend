import { useEffect, useState } from 'react'
import type { Food, FoodCard as FoodCardType, UserProfile } from '../types'
import { formatName } from '../utils/formatting'
import { API_BASE_URL } from '../config'
import FoodCard from './FoodCard'
import Modal from './Modal'
import FoodTile from './FoodTile'
import { TIERS, tierFor } from '../utils/tier'
import type { TierKey } from '../utils/tier'

interface Props {
  userProfile: UserProfile | null
}

type SortKey = 'default' | 'rating' | 'name' | 'protein' | 'micro' | 'gut' | 'phyto' | 'energy'

export default function FoodList({ userProfile }: Props) {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [tierFilter, setTierFilter] = useState<TierKey | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('default')
  const [selectedCard, setSelectedCard] = useState<FoodCardType | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [cardError, setCardError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/foods`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setFoods(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function handleViewCard(id: number) {
    if (loadingId !== null) return
    setLoadingId(id)
    setCardError(null)
    fetch(`${API_BASE_URL}/foods/${id}/card`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setSelectedCard(data))
      .catch((err) => setCardError(err.message))
      .finally(() => setLoadingId(null))
  }

  if (loading) return <p className="text-gray-400">Loading foods…</p>
  if (error) return <p className="text-red-700 dark:text-red-400">Error: {error}</p>
  if (foods.length === 0) return <p className="text-gray-400">No foods found.</p>

  const filtered = foods.filter((f) => {
    const q = search.toLowerCase()
    const matchesSearch =
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.foodRole.toLowerCase().includes(q)
    const matchesRole = !roleFilter || f.foodRole === roleFilter
    const matchesTier = !tierFilter || (f.overallScore != null && tierFor(f.overallScore).key === tierFilter)
    return matchesSearch && matchesRole && matchesTier
  })
  if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy !== 'default') {
    // Foods without a score yet (mid warm-up) sort last
    const value = (f: Food) => (sortBy === 'rating' ? f.overallScore : f.stats?.[sortBy]) ?? -1
    filtered.sort((a, b) => value(b) - value(a))
  }

  const roles: { label: string; value: string | null; bg: string }[] = [
    { label: 'All', value: null, bg: 'bg-slate-600' },
    { label: 'Eat daily', value: 'DAILY_DRIVER', bg: 'bg-emerald-700' },
    { label: '2–3× a week', value: 'WEEKLY_ANCHOR', bg: 'bg-blue-600' },
    { label: 'Small boost', value: 'BOOSTER', bg: 'bg-purple-600' },
    { label: 'Flavour staple', value: 'PANTRY', bg: 'bg-slate-600' },
    { label: 'Treat', value: 'OCCASIONAL', bg: 'bg-amber-700' },
  ]

  return (
    <div>
      <input
        type="text"
        placeholder="Search foods..."
        aria-label="Search foods"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800 text-fg placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
      />
      <details className="mb-4 text-sm text-gray-400">
        <summary className="cursor-pointer text-accent hover:text-emerald-900 dark:hover:text-emerald-300">How do scores work?</summary>
        <p className="mt-2 max-w-2xl">
          Every food gets five 0–100 stats (protein quality, micronutrient density, energy profile, gut
          health, phytonutrients) and an overall rating built from its four best stats. Stats describe
          100g of the food, not a serving. Micronutrient density is nutrients per calorie, so a spinach
          leaf can out-score peanut butter without being a meal. 50 is solid, 80+ is exceptional.
        </p>
      </details>
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map((r) => {
          const isActive = roleFilter === r.value
          return (
            <button
              key={r.label}
              onClick={() => setRoleFilter(isActive ? null : r.value)}
              aria-pressed={isActive}
              className={`px-3 py-1 text-xs font-medium text-white rounded-full ${r.bg} ${
                isActive ? 'ring-2 ring-fg ring-offset-2 ring-offset-page' : 'hover:brightness-110'
              }`}
            >
              {r.label}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-gray-400">Card tier</span>
        {TIERS.map((t) => {
          const isActive = tierFilter === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTierFilter(isActive ? null : t.key)}
              aria-pressed={isActive}
              className={`px-3 py-1 text-xs font-semibold rounded-full ${t.chip} ${
                isActive ? 'ring-2 ring-fg ring-offset-2 ring-offset-page' : 'hover:brightness-110'
              }`}
            >
              {t.label} <span className="font-normal">{t.range}</span>
            </button>
          )
        })}
        <label htmlFor="food-sort" className="text-xs text-gray-400">Sort by</label>
        <select
          id="food-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-2 py-1 text-xs rounded-lg bg-gray-800 text-fg border border-gray-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="default">Default</option>
          <option value="rating">Top rated</option>
          <option value="protein">Protein quality</option>
          <option value="micro">Micronutrient density</option>
          <option value="gut">Gut health</option>
          <option value="phyto">Phytonutrients</option>
          <option value="energy">Energy profile</option>
          <option value="name">A–Z</option>
        </select>
      </div>
      {cardError && (
        <p className="mb-3 text-sm text-red-700 dark:text-red-400">Failed to load card: {cardError}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((food) => (
          <FoodTile
            key={food.id}
            food={food}
            loading={loadingId === food.id}
            onOpen={() => handleViewCard(food.id)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-gray-400">No foods match those filters. Clear the search or pick a different tier.</p>
      )}

      {selectedCard && (
        <Modal onClose={() => setSelectedCard(null)} label={`${formatName(selectedCard.food.name)} nutrition card`} flush>
          <FoodCard card={selectedCard} userProfile={userProfile} />
        </Modal>
      )}
    </div>
  )
}
