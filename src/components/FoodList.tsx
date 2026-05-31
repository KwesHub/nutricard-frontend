import { useEffect, useState } from 'react'
import type { Food, FoodCard as FoodCardType } from '../types'
import FoodCard from './FoodCard'

const formatRole = (role: string) =>
  role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')

const formatCategory = (cat: string) => cat.charAt(0) + cat.slice(1).toLowerCase()

const formatName = (name: string) =>
  name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

const roleColor = (role: string) => {
  switch (role) {
    case 'DAILY_DRIVER': return 'bg-emerald-600'
    case 'WEEKLY_ANCHOR': return 'bg-blue-600'
    case 'BOOSTER': return 'bg-purple-600'
    case 'PANTRY': return 'bg-gray-600'
    case 'OCCASIONAL': return 'bg-amber-600'
    default: return 'bg-gray-600'
  }
}

export default function FoodList() {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<FoodCardType | null>(null)
  const [cardLoading, setCardLoading] = useState(false)

  useEffect(() => {
    fetch('http://localhost:8080/foods')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setFoods(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function handleViewCard(id: number) {
    setCardLoading(true)
    fetch(`http://localhost:8080/foods/${id}/card`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setSelectedCard(data))
      .catch((err) => alert(`Failed to load card: ${err.message}`))
      .finally(() => setCardLoading(false))
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

  const roles: { label: string; value: string | null; bg: string }[] = [
    { label: 'All', value: null, bg: 'bg-gray-600' },
    { label: 'Daily Driver', value: 'DAILY_DRIVER', bg: 'bg-emerald-600' },
    { label: 'Weekly Anchor', value: 'WEEKLY_ANCHOR', bg: 'bg-blue-600' },
    { label: 'Booster', value: 'BOOSTER', bg: 'bg-purple-600' },
    { label: 'Pantry', value: 'PANTRY', bg: 'bg-gray-600' },
    { label: 'Occasional', value: 'OCCASIONAL', bg: 'bg-amber-600' },
  ]

  return (
    <div>
      <input
        type="text"
        placeholder="Search foods..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map((r) => {
          const isActive = roleFilter === r.value
          return (
            <button
              key={r.label}
              onClick={() => setRoleFilter(isActive ? null : r.value)}
              className={`px-3 py-1 text-xs font-medium text-white rounded-full transition-opacity ${r.bg} ${
                isActive ? 'opacity-100' : 'opacity-70'
              }`}
            >
              {r.label}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((food) => (
          <div key={food.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">{formatName(food.name)}</h2>
            <span className={`self-start text-xs font-medium text-white px-2 py-0.5 rounded-full ${roleColor(food.foodRole)}`}>
              {formatRole(food.foodRole)}
            </span>
            <p className="text-sm text-gray-400">{formatCategory(food.category)}</p>
            <button
              onClick={() => handleViewCard(food.id)}
              disabled={cardLoading}
              className="mt-auto bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {cardLoading ? 'Loading…' : 'View Card'}
            </button>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div className="relative bg-gray-900 rounded-2xl p-6 w-full overflow-y-auto" style={{ maxWidth: '600px', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold z-10"
            >
              ✕
            </button>
            <FoodCard card={selectedCard} />
          </div>
        </div>
      )}
    </div>
  )
}
