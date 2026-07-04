import { useMemo } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import type { MealResult, UserProfile } from '../types'
import { formatName, formatNutrient, formatRole, roleColor, statColor } from '../utils/formatting'

interface Props {
  result: MealResult
  userProfile?: UserProfile | null
}

const timingLabel: Record<string, string> = {
  MORNING: 'Morning',
  PRE_WORKOUT: 'Pre-Workout',
  POST_WORKOUT: 'Post-Workout',
  EVENING: 'Evening',
  NEUTRAL: 'Anytime',
}

export default function MealCard({ result, userProfile: _userProfile }: Props) {
  const { meal, mealScore, foods, nutrientAnalysis } = result

  const stats = useMemo(() => [
    { stat: 'Protein', label: 'Protein Quality',        value: mealScore.proteinQuality },
    { stat: 'Micros',  label: 'Micronutrient Density',  value: mealScore.micronutrientDensity },
    { stat: 'Energy',  label: 'Energy Profile',         value: mealScore.energyProfile },
    { stat: 'Gut',     label: 'Gut Health',             value: mealScore.gutHealth },
    { stat: 'Phyto',   label: 'Phytonutrients',         value: mealScore.phytonutrients },
  ], [mealScore])

  const synergies = useMemo(() => {
    if (!mealScore.activeSynergies) return []
    return mealScore.activeSynergies
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }, [mealScore.activeSynergies])

  const totalG = foods.reduce((sum, f) => sum + f.quantityG, 0)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{meal.name}</h2>
          <span className="inline-block mt-1 text-xs font-medium bg-emerald-700 text-white px-2 py-0.5 rounded-full">
            {timingLabel[meal.timingContext] ?? meal.timingContext}
          </span>
        </div>
        <div className="text-right">
          <span className="text-4xl font-bold text-white">{Math.round(mealScore.overallScore)}</span>
          <span className="text-sm text-gray-400">/100</span>
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ overflowX: 'auto' }}>
          <RadarChart
            width={420} height={300}
            data={stats}
            margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
          >
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: '#9ca3af', fontSize: 12, dy: -5 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
          </RadarChart>
        </div>
      </div>

      {/* Stat Bars */}
      <div className="flex flex-col gap-3 mb-5">
        {stats.map(d => (
          <div key={d.stat}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{d.label}</span>
              <span className="text-xs text-gray-300">{d.value.toFixed(1)}</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div
                className={`h-2 ${statColor(d.value)} rounded-full`}
                style={{ width: `${Math.min(d.value, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Synergies */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <p className="text-xs font-semibold text-gray-300 mb-2">
          Active Synergies{synergies.length > 0 ? ` (${synergies.length})` : ''}
        </p>
        {synergies.length === 0 ? (
          <p className="text-xs text-gray-500">
            No synergies detected — try combining fish with garlic, or adding vitamin C-rich foods alongside iron sources.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {synergies.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-emerald-300">
                <span className="text-emerald-500 mt-0.5 shrink-0">⚡</span>
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Nutrient gaps + fill suggestions */}
      {nutrientAnalysis && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-xs font-semibold text-gray-300 mb-2">
            Nutrient Gaps{nutrientAnalysis.gaps.length > 0 ? ` (${nutrientAnalysis.gaps.length})` : ''}
          </p>
          {nutrientAnalysis.gaps.length === 0 ? (
            <p className="text-xs text-emerald-400">
              This meal touches every nutrient we track — nicely balanced.
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2">
                Barely present in this meal — worth covering here or later today:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {nutrientAnalysis.gaps.map(g => (
                  <span
                    key={g.name}
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      g.rare
                        ? 'border-amber-700 text-amber-300'
                        : 'border-gray-600 text-gray-400'
                    }`}
                  >
                    {formatNutrient(g.name)}
                    {g.rare && <span className="ml-1 text-amber-400" title="Hard to find in most diets">★</span>}
                  </span>
                ))}
              </div>
              {nutrientAnalysis.suggestions.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {nutrientAnalysis.suggestions.map(s => (
                    <div key={s.foodId} className="flex items-start gap-2 text-xs">
                      <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                      <span className="text-gray-300">
                        Add <span className="font-semibold text-white">{formatName(s.foodName)}</span>
                        <span className="text-gray-500">
                          {' '}→ covers {s.covers.map(formatNutrient).join(', ')}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Ingredients */}
      <div className="p-3 bg-gray-800 rounded-lg">
        <p className="text-xs font-semibold text-gray-300 mb-2">
          Ingredients · {totalG}g total
        </p>
        <div className="flex flex-col gap-1.5">
          {foods.map(f => (
            <div key={f.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${roleColor(f.food.foodRole)}`} />
                <span className="text-xs text-gray-300 truncate">{formatName(f.food.name)}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded text-white ${roleColor(f.food.foodRole)}`}>
                  {formatRole(f.food.foodRole)}
                </span>
                <span className="text-xs text-gray-400 w-10 text-right">{f.quantityG}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
