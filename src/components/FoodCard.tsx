import { useState, useMemo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import type { FoodCard as FoodCardType, MicroBreakdown, ProteinBreakdown, TimingContext, UserProfile } from '../types'
import { tierFor } from '../utils/tier'
import { formatRole, formatCategory, formatName, formatNutrient, formatPctRda, roleColor, statColor } from '../utils/formatting'
import BadgeChip from './BadgeChip'
import FoodPhoto from './FoodPhoto'

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

// Copy explains the gastric-emptying reasoning behind each grade, so the rating reads as
// justified rather than arbitrary (fat/fibre/protein slow the stomach; GI drives blood sugar).
const timingInsights: Record<TimingContext, string> = {
  MORNING: 'Slow-release fuel. Fat, fibre and protein keep it in the stomach longer, for steady energy all morning.',
  PRE_WORKOUT: 'Fast fuel. Little fat or fibre, so it leaves the stomach quickly, and its carbs reach the blood fast.',
  POST_WORKOUT: 'Quick-delivered carbs plus protein to refill glycogen and kick off muscle repair.',
  EVENING: 'Light on the stomach and slow on blood sugar, so it settles easily before sleep.',
  NEUTRAL: 'Balanced fuel that suits any time of day.',
}

interface Props {
  card: FoodCardType
  userProfile?: UserProfile | null
}

export default function FoodCard({ card, userProfile }: Props) {
  const { food, nutritionScore, insights } = card

  const parsedMicro = useMemo<MicroBreakdown | null>(() => {
    if (!nutritionScore.microBreakdown) return null
    try {
      const parsed = JSON.parse(nutritionScore.microBreakdown) as MicroBreakdown
      // Below 10% RDA a nutrient isn't a meaningful contributor — hide it so
      // micronutrient-poor foods don't list e.g. "Iron 3%" as a top nutrient
      return { ...parsed, topNutrients: parsed.topNutrients.filter(n => n.pctRda >= 10) }
    } catch {
      return null
    }
  }, [nutritionScore.microBreakdown])

  const parsedProtein = useMemo<ProteinBreakdown | null>(() => {
    if (!nutritionScore.proteinBreakdown) return null
    try {
      return JSON.parse(nutritionScore.proteinBreakdown) as ProteinBreakdown
    } catch {
      return null
    }
  }, [nutritionScore.proteinBreakdown])

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
  // Open at the food's realistic serving (garlic 10g, olive oil 15g) rather than 100g
  const [servingG, setServingG] = useState(food.servingSizeG || 100)

  // The five scores are per-100g quality ratings — density doesn't drop because you eat
  // less of it. The serving input scales only calories and the TDEE share.
  const stats = useMemo(() => [
    { stat: 'Protein', label: 'Protein Quality', value: nutritionScore.proteinQuality },
    { stat: 'Micros', label: 'Micronutrient Density', value: nutritionScore.micronutrientDensity },
    { stat: 'Gut', label: 'Gut Health', value: nutritionScore.gutHealth },
    { stat: 'Phyto', label: 'Phytonutrients', value: nutritionScore.phytonutrients },
  ], [nutritionScore])

  const calories = nutritionScore.kcalPer100g ? Math.round(nutritionScore.kcalPer100g * servingG / 100) : null
  const calPct = (calories && userProfile?.tdee) ? (calories / userProfile.tdee * 100) : null

  const synergy = nutritionScore.synergyPotential
  const synergyColor = synergy >= 70 ? 'text-green-800 dark:text-green-400' : synergy >= 40 ? 'text-amber-800 dark:text-amber-400' : 'text-red-700 dark:text-red-400'
  const synergyDesc = synergy >= 70
    ? 'Combines well with many foods'
    : synergy >= 40
      ? 'Works well in balanced meals'
      : 'Gains little from being combined'

  const bestTimingLabel = timingTabs.find(t => t.key === bestTiming)!.label
  const tier = tierFor(nutritionScore.overallScore)

  return (
    <div className="w-full">
      {/* Header: the card face in its tier colours */}
      <div className={`${tier.face} ${tier.text} px-6 pb-5 pt-5`}>
        <div className="flex items-start justify-between pr-10">
          <div className="leading-none">
            <span
              className="font-display text-7xl font-bold"
              aria-label={`Overall rating ${Math.round(nutritionScore.overallScore)} out of 100`}
            >
              {Math.round(nutritionScore.overallScore)}
            </span>
            <span className={`block font-display text-base font-semibold uppercase tracking-widest ${tier.subtext}`} aria-hidden="true">
              {tier.label}
            </span>
          </div>
          <div className="space-y-1 pt-1 text-right">
            <span className={`inline-block text-xs font-medium text-white px-2 py-0.5 rounded-full ${roleColor(food.foodRole)}`}>
              {formatRole(food.foodRole)}
            </span>
            {food.frequency && <p className={`text-xs font-medium ${tier.subtext}`}>{food.frequency}</p>}
            <p className={`text-xs font-medium ${tier.subtext}`}>{formatCategory(food.category)}</p>
          </div>
        </div>
        <FoodPhoto name={food.name} className="mt-3 h-44 rounded-xl" />
        <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-none tracking-wide">
          {formatName(food.name)}
        </h2>
        {food.foodRole === 'FLAVOUR' && (
          <p className={`mt-1 text-xs ${tier.subtext}`}>Rated per 100g, used in small amounts</p>
        )}
      </div>

      <div className="p-6">
      {/* Nutrient Badges */}
      {insights?.badges && insights.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {insights.badges.map((b) => (
            <BadgeChip key={`${b.kind}-${b.label}`} badge={b} />
          ))}
        </div>
      )}

      {/* Timing Tabs */}
      {parsedTimingScores && (
      <div className="flex flex-wrap gap-1.5 mb-4">
        {timingTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSelectedTiming(t.key)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              selectedTiming === t.key
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-fg'
            }`}
          >
            {t.label}
            <span className="ml-1">({timingScoreToGrade(parsedTimingScores[t.key])})</span>
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
            aria-label="Serving size in grams"
            value={servingG}
            onChange={(e) => setServingG(Math.max(0, Number(e.target.value)))}
            className="w-16 px-2 py-1 text-sm rounded-lg bg-gray-800 text-fg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/60 focus:border-emerald-500 transition-colors text-center"
          />
          <span className="text-xs text-gray-400">g</span>
        </div>
        <span className="text-[10px] text-gray-400">changes the calories only; the stats are per 100g</span>
      </div>

      {/* Calories */}
      {calories !== null && (
        <div className="mb-4">
          <span className="text-sm text-gray-300">Calories: <span className="font-semibold text-fg">~{calories.toLocaleString()} kcal</span></span>
          {calPct !== null && (
            <span className={`ml-2 text-xs font-medium ${
              calPct < 15 ? 'text-green-800 dark:text-green-400' : calPct <= 30 ? 'text-amber-800 dark:text-amber-400' : 'text-red-700 dark:text-red-400'
            }`}>
              ({calPct.toFixed(1)}% of your daily budget)
            </span>
          )}
        </div>
      )}

      {/* Radar Chart */}
      <div
        role="img"
        aria-label={`Radar chart: ${stats.map(d => `${d.label} ${Math.round(d.value)}`).join(', ')}`}
        style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
      >
        <div style={{ overflowX: 'auto' }}>
          <RadarChart
            width={420}
            height={340}
            data={stats}
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
        {stats.map((d) => (
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

      {/* Why this score — top nutrient contributors */}
      {parsedMicro && parsedMicro.topNutrients.length > 0 && (
        <div className="mt-5 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span>🔬</span>
            <span className="text-xs font-medium text-gray-300">Top nutrients (per 100g)</span>
          </div>
          <div className="flex flex-col gap-2">
            {parsedMicro.topNutrients.map((n) => (
              <div key={n.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">
                    {formatNutrient(n.name)}
                    {n.rare && (
                      <span className="ml-1.5 text-amber-800 dark:text-amber-400" title="Hard to find in most diets">
                        ★ rare
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-300">{formatPctRda(n.pctRda)} RDA</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full">
                  <div
                    className="h-1.5 bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(n.pctRda, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Protein quality drivers — hidden for zero-protein foods where PDCAAS is meaningless */}
      {parsedProtein && parsedProtein.rawProteinG > 0 && (
        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span>💪</span>
            <span className="text-xs font-medium text-gray-300">Protein quality drivers</span>
          </div>
          <p className="text-xs text-gray-400">
            {parsedProtein.rawProteinG.toFixed(1)}g protein per 100g · PDCAAS{' '}
            {parsedProtein.pdcaas.toFixed(2)} · amino completeness{' '}
            {Math.round(parsedProtein.completenessFactor * 100)}%
          </p>
        </div>
      )}

      {/* Standout fact */}
      {insights?.standoutFact && (
        <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span>💡</span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Standout</span>
          </div>
          <p className="text-xs text-emerald-900 dark:text-emerald-100/80">{insights.standoutFact}</p>
        </div>
      )}

      {/* Anti-nutrient watch-out */}
      {insights?.penaltyNote && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span>⚠️</span>
            <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Watch-out</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-100/80">{insights.penaltyNote}</p>
        </div>
      )}

      {/* Synergy Potential */}
      <div className="mt-5 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <span>⚡</span>
          <span className="text-xs font-medium text-gray-300">Synergy Potential</span>
          <span className={`text-xs font-bold ml-auto ${synergyColor}`}>{Math.round(synergy)}/100</span>
        </div>
        <p className="text-xs text-gray-400">{synergyDesc}</p>
      </div>

      {/* Best Timing Insight */}
      <div className="mt-3 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <span aria-hidden="true">🕐</span>
          <span className="text-xs font-medium text-gray-300">Best timing:</span>
          <span className="text-xs font-bold text-accent">{bestTimingLabel}</span>
        </div>
        <p className="text-xs text-gray-400">{timingInsights[bestTiming]}</p>
        <p className="mt-2 text-xs text-gray-400">
          Energy profile <span className="font-semibold text-fg">{Math.round(nutritionScore.energyProfile)}/100</span>:
          how quickly this food's energy arrives. It sets the timing grades, not the overall rating.
        </p>
      </div>
      </div>
    </div>
  )
}
