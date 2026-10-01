import { useEffect, useState } from 'react'
import type { Food, FoodCard as FoodCardType, UserProfile } from '../types'
import { formatRole, formatCategory, formatName, roleColor } from '../utils/formatting'
import { API_BASE_URL } from '../config'
import FoodCard from './FoodCard'
import BadgeChip from './BadgeChip'
import Modal from './Modal'
import { foodIcon } from '../utils/foodIcons'

interface Props {
  userProfile: UserProfile | null
}

export default function FoodList({ userProfile }: Props) {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'name'>('default')
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
  if (error) return <p className="text-red-400">Error: {error}</p>
  if (foods.length === 0) return <p className="text-gray-400">No foods found.</p>

  const filtered = foods.filter((f) => {
    const q = search.toLowerCase()
    const matchesSearch =
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.foodRole.toLowerCase().includes(q)
    const matchesRole = !roleFilter || f.foodRole === roleFilter
    return matchesSearch && matchesRole
  })
  if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.overallScore ?? -1) - (a.overallScore ?? -1))
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  const roles: { label: string; value: string | null; bg: string }[] = [
    { label: 'All', value: null, bg: 'bg-gray-600' },
    { label: 'Eat daily', value: 'DAILY_DRIVER', bg: 'bg-emerald-600' },
    { label: '2–3× a week', value: 'WEEKLY_ANCHOR', bg: 'bg-blue-600' },
    { label: 'Small boost', value: 'BOOSTER', bg: 'bg-purple-600' },
    { label: 'Flavour staple', value: 'PANTRY', bg: 'bg-gray-600' },
    { label: 'Treat', value: 'OCCASIONAL', bg: 'bg-amber-600' },
  ]

  return (
    <div>
      <input
        type="text"
        placeholder="Search foods..."
        aria-label="Search foods"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
      />
      <details className="mb-4 text-sm text-gray-400">
        <summary className="cursor-pointer text-emerald-400 hover:text-emerald-300">How do scores work?</summary>
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
              className={`px-3 py-1 text-xs font-medium text-white rounded-full transition-opacity ${r.bg} ${
                isActive ? 'opacity-100' : 'opacity-70'
              }`}
            >
              {r.label}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="food-sort" className="text-xs text-gray-400">Sort by</label>
        <select
          id="food-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-2 py-1 text-xs rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="default">Default</option>
          <option value="rating">Top rated</option>
          <option value="name">A–Z</option>
        </select>
      </div>
      {cardError && (
        <p className="mb-3 text-sm text-red-400">Failed to load card: {cardError}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((food) => (
          <div key={food.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-white">
                <span aria-hidden="true" className="mr-2">{foodIcon(food.name)}</span>
                {formatName(food.name)}
              </h2>
              {food.overallScore != null && (
                <span
                  className="shrink-0 text-right leading-none"
                  aria-label={`Overall rating ${Math.round(food.overallScore)} out of 100`}
                >
                  <span className="text-2xl font-bold text-white" aria-hidden="true">{Math.round(food.overallScore)}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5" aria-hidden="true">OVR</span>
                </span>
              )}
            </div>
            <span className={`self-start text-xs font-medium text-white px-2 py-0.5 rounded-full ${roleColor(food.foodRole)}`}>
              {formatRole(food.foodRole)}
            </span>
            <p className="text-sm text-gray-400">{formatCategory(food.category)}</p>
            {food.badges && food.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {food.badges.map((b) => (
                  <BadgeChip key={`${b.kind}-${b.label}`} badge={b} />
                ))}
              </div>
            )}
            <button
              onClick={() => handleViewCard(food.id)}
              aria-disabled={loadingId === food.id}
              aria-label={`View ${formatName(food.name)} card`}
              className="mt-auto bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors aria-disabled:opacity-50"
            >
              {loadingId === food.id ? 'Loading…' : 'View Card'}
            </button>
          </div>
        ))}
      </div>

      {selectedCard && (
        <Modal onClose={() => setSelectedCard(null)} label={`${formatName(selectedCard.food.name)} nutrition card`}>
          <FoodCard card={selectedCard} userProfile={userProfile} />
        </Modal>
      )}
    </div>
  )
}
