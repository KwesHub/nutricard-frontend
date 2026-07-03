import { useState, useMemo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import type { FoodCard as FoodCardType, TimingContext, UserProfile } from '../types'
import { formatRole, formatCategory, formatName, roleColor, statColor } from '../utils/formatting'

const timingScoreToGrade = (score: number): string => {
  if (score >= 85) return 'S'
  if (score >= 70) return 'A'
  if (score >= 55) return 'B'
  if (score >= 40) return 'C'
  if (score >= 25) return 'D'
  return 'F'
}

const timingTabs: { key: TimingContext; label: string }[] = [
  { key: 'MORNING', label: 'Morning' },
  { key: 'PRE_WORKOUT', label: 'Pre-Workout' },
  { key: 'POST_WORKOUT', label: 'Post-Workout' },
  { key: 'EVENING', label: 'Evening' },
  { key: 'NEUTRAL', label: 'Neutral' },
]

const timingInsights: Record<TimingContext, string> = {
  MORNING: 'Ideal for starting the day with sustained energy',
  PRE_WORKOUT: 'Fast fuel for exercise performance',
  POST_WORKOUT: 'Supports recovery and muscle repair',
  EVENING: 'Supports digestion and overnight repair',
  NEUTRAL: 'Works well at any time of day',
}

interface Props {
  card: FoodCardType
  userProfile?: UserProfile | null
}

export default function FoodCard({ card, userProfile }: Props) {
  const { food, nutritionScore } = card

  const parsedTimingScores = useMemo(() => {
    if (!nutritionScore.timingScores) return null
    try {
      return JSON.parse(nutritionScore.timingScores) as Record<TimingContext, number>
    } catch {
      return null
    }
  }, [nutritionScore.timingScores])

  const bestTiming = useMemo<TimingContext>(() => {
    if (!parsedTimingScores) return 'NEUTRAL'
    let best: TimingContext = 'NEUTRAL'
    let max = -1
    for (const key of Object.keys(parsedTimingScores) as TimingContext[]) {
      if (parsedTimingScores[key] > max) { max = parsedTimingScores[key]; best = key }
    }
    return best
  }, [parsedTimingScores])

  const [selectedTiming, setSelectedTiming] = useState<TimingContext>(bestTiming)
  const [servingG, setServingG] = useState(100)

  const scale = servingG / 100

  const scaledStats = useMemo(() => [
    { stat: 'Protein', label: 'Protein Quality', value: Math.min(nutritionScore.proteinQuality * scale, 100) },
    { stat: 'Micros', label: 'Micronutrient Density', value: Math.min(nutritionScore.micronutrientDensity * scale, 100) },
    { stat: 'Energy', label: 'Energy Profile', value: Math.min(nutritionScore.energyProfile * scale, 100) },
    { stat: 'Gut', label: 'Gut Health', value: Math.min(nutritionScore.gutHealth * scale, 100) },
    { stat: 'Phyto', label: 'Phytonutrients', value: Math.min(nutritionScore.phytonutrients * scale, 100) },
  ], [nutritionScore, scale])

  const calories = nutritionScore.kcalPer100g ? Math.round(nutritionScore.kcalPer100g * scale) : null
  const calPct = (calories && userProfile?.tdee) ? (calories / userProfile.tdee * 100) : null

  const synergy = nutritionScore.synergyPotential
  const synergyColor = synergy >= 70 ? 'text-green-400' : synergy >= 40 ? 'text-amber-400' : 'text-red-400'
  const synergyDesc = synergy >= 70
    ? 'Highly versatile — combines well with many foods'
    : synergy >= 40
      ? 'Moderate synergy — works well in balanced meals'
      : 'Best as a standalone — limited combination benefit'

  const bestTimingLabel = timingTabs.find(t => t.key === bestTiming)!.label

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white">{formatName(food.name)}</h2>
          <span
            className={`inline-block mt-1 text-xs font-medium text-white px-2 py-0.5 rounded-full ${roleColor(food.foodRole)}`}
          >
            {formatRole(food.foodRole)}
          </span>
          <p className="text-sm text-gray-400 mt-1">{formatCategory(food.category)}</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-bold text-white">
            {Math.round(nutritionScore.overallScore)}
          </span>
          <span className="text-sm text-gray-400">/100</span>
        </div>
      </div>

      {/* Timing Tabs */}
      {parsedTimingScores && (
      <div className="flex flex-wrap gap-1.5 mb-4">
        {timingTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSelectedTiming(t.key)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              selectedTiming === t.key
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
            <span className="ml-1 opacity-75">({timingScoreToGrade(parsedTimingScores[t.key])})</span>
          </button>
        ))}
      </div>
      )}

      {/* Serving Size */}
      <div className="flex items-center gap-3 mb-2">
        <label className="text-xs text-gray-400">Serving size</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={servingG}
            onChange={(e) => setServingG(Math.max(0, Number(e.target.value)))}
            className="w-16 px-2 py-1 text-sm rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors text-center"
          />
          <span className="text-xs text-gray-400">g</span>
        </div>
      </div>

      {/* Calories */}
      {calories !== null && (
        <div className="mb-4">
          <span className="text-sm text-gray-300">Calories: <span className="font-semibold text-white">~{calories.toLocaleString()} kcal</span></span>
          {calPct !== null && (
            <span className={`ml-2 text-xs font-medium ${
              calPct < 15 ? 'text-green-400' : calPct <= 30 ? 'text-amber-400' : 'text-red-400'
            }`}>
              ({calPct.toFixed(1)}% of your daily budget)
            </span>
          )}
        </div>
      )}

      {/* Radar Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ overflowX: 'auto' }}>
          <RadarChart
            width={420}
            height={340}
            data={scaledStats}
            margin={{ top: 30, right: 80, bottom: 30, left: 80 }}
          >
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis
              dataKey="stat"
              tick={{ fill: '#9ca3af', fontSize: 12, dy: -5 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
            />
            <Radar
              dataKey="value"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
          </RadarChart>
        </div>
      </div>

      {/* Stat Bars */}
      <div className="flex flex-col gap-3">
        {scaledStats.map((d) => (
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

      {/* Synergy Potential */}
      <div className="mt-5 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <span>⚡</span>
          <span className="text-xs font-medium text-gray-300">Synergy Potential</span>
          <span className={`text-xs font-bold ml-auto ${synergyColor}`}>{Math.round(synergy)}/100</span>
        </div>
        <p className="text-xs text-gray-500">{synergyDesc}</p>
      </div>

      {/* Best Timing Insight */}
      <div className="mt-3 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <span>🕐</span>
          <span className="text-xs font-medium text-gray-300">Best timing:</span>
          <span className="text-xs font-bold text-emerald-400">{bestTimingLabel}</span>
        </div>
        <p className="text-xs text-gray-500">{timingInsights[bestTiming]}</p>
      </div>
    </div>
  )
}
