import { useState, useEffect } from 'react'
import type { Food, MealResult, UserProfile, TimingContext } from '../types'
import { API_BASE_URL } from '../config'
import { formatName, formatRole, roleColor } from '../utils/formatting'
import Modal from './Modal'
import MealCard from './MealCard'

interface MealItem {
  food: Food
  quantityG: number
}

const TIMING_OPTIONS: { value: TimingContext; label: string }[] = [
  { value: 'MORNING',      label: 'Morning' },
  { value: 'PRE_WORKOUT',  label: 'Pre-Workout' },
  { value: 'POST_WORKOUT', label: 'Post-Workout' },
  { value: 'EVENING',      label: 'Evening' },
  { value: 'NEUTRAL',      label: 'Anytime' },
]

interface Props {
  userProfile: UserProfile | null
}

export default function MealBuilder({ userProfile }: Props) {
  const [foods, setFoods] = useState<Food[]>([])
  const [foodsLoading, setFoodsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [mealItems, setMealItems] = useState<MealItem[]>([])
  const [timing, setTiming] = useState<TimingContext>('NEUTRAL')
  const [scoring, setScoring] = useState(false)
  const [result, setResult] = useState<MealResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/foods`)
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(() => {})
      .finally(() => setFoodsLoading(false))
  }, [])

  function addFood(food: Food) {
    setMealItems(prev => {
      const existing = prev.find(i => i.food.id === food.id)
      if (existing) {
        return prev.map(i =>
          i.food.id === food.id
            ? { ...i, quantityG: i.quantityG + food.servingSizeG }
            : i
        )
      }
      return [...prev, { food, quantityG: food.servingSizeG }]
    })
  }

  function removeFood(foodId: number) {
    setMealItems(prev => prev.filter(i => i.food.id !== foodId))
  }

  function updateQuantity(foodId: number, raw: number) {
    const quantityG = Math.max(1, raw)
    setMealItems(prev => prev.map(i => i.food.id === foodId ? { ...i, quantityG } : i))
  }

  async function scoreMeal() {
    if (mealItems.length === 0) return
    setScoring(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'My Meal',
          timingContext: timing,
          foods: mealItems.map(i => ({ foodId: i.food.id, quantityG: i.quantityG })),
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to score meal')
    } finally {
      setScoring(false)
    }
  }

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  )

  const inMealIds = new Set(mealItems.map(i => i.food.id))
  const totalG = mealItems.reduce((sum, i) => sum + i.quantityG, 0)

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* ── Meal queue (left panel on desktop, top on mobile) ── */}
      <div className="lg:w-72 shrink-0">
        <div className="bg-gray-900 rounded-xl p-4 lg:sticky lg:top-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Your Meal
          </h2>

          {/* Timing */}
          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-1.5 block">When are you eating this?</label>
            <div className="flex flex-wrap gap-1">
              {TIMING_OPTIONS.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTiming(t.value)}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    timing === t.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          {mealItems.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">
              Click foods on the right to add them here
            </p>
          ) : (
            <div className="flex flex-col gap-2 mb-4">
              {mealItems.map(item => (
                <div key={item.food.id} className="flex items-center gap-2">
                  <span className="text-sm text-white flex-1 truncate min-w-0">
                    {formatName(item.food.name)}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={item.quantityG}
                    onChange={e => updateQuantity(item.food.id, Number(e.target.value))}
                    className="w-14 px-1.5 py-1 text-xs rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-500 text-center"
                  />
                  <span className="text-xs text-gray-500">g</span>
                  <button
                    onClick={() => removeFood(item.food.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors text-sm shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-1">
                {mealItems.length} food{mealItems.length !== 1 ? 's' : ''} · {totalG}g total
              </p>
            </div>
          )}

          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

          <button
            onClick={scoreMeal}
            disabled={mealItems.length === 0 || scoring}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {scoring ? 'Scoring…' : 'Score Meal'}
          </button>
        </div>
      </div>

      {/* ── Food browser (right panel on desktop, bottom on mobile) ── */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
        />

        {foodsLoading ? (
          <p className="text-gray-400">Loading foods…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(food => {
              const inMeal = inMealIds.has(food.id)
              const currentQty = mealItems.find(i => i.food.id === food.id)?.quantityG
              return (
                <div key={food.id} className="bg-gray-900 rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {formatName(food.name)}
                    </p>
                    {inMeal && (
                      <span className="text-xs text-emerald-400 font-medium shrink-0">
                        {currentQty}g
                      </span>
                    )}
                  </div>
                  <span className={`self-start text-xs font-medium text-white px-2 py-0.5 rounded-full ${roleColor(food.foodRole)}`}>
                    {formatRole(food.foodRole)}
                  </span>
                  <button
                    onClick={() => addFood(food)}
                    className={`mt-auto text-xs font-medium py-1.5 px-3 rounded-lg transition-colors ${
                      inMeal
                        ? 'bg-emerald-900 text-emerald-300 hover:bg-emerald-800'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {inMeal ? `+ Add ${food.servingSizeG}g more` : '+ Add to Meal'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {result && (
        <Modal onClose={() => setResult(null)} maxWidth={640}>
          <MealCard result={result} userProfile={userProfile} />
        </Modal>
      )}
    </div>
  )
}
