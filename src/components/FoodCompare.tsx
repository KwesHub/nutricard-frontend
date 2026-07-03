import { useState, useEffect, useMemo } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import type { Food, CompareResult } from '../types'
import { API_BASE_URL } from '../config'
import { formatName, formatRole, roleColor } from '../utils/formatting'

const STATS: { key: keyof CompareResult['foodA']['scores']; label: string; short: string }[] = [
  { key: 'proteinQuality',      label: 'Protein Quality',       short: 'Protein' },
  { key: 'micronutrientDensity',label: 'Micronutrient Density', short: 'Micros'  },
  { key: 'energyProfile',       label: 'Energy Profile',        short: 'Energy'  },
  { key: 'gutHealth',           label: 'Gut Health',            short: 'Gut'     },
  { key: 'phytonutrients',      label: 'Phytonutrients',        short: 'Phyto'   },
]

export default function FoodCompare() {
  const [foods, setFoods] = useState<Food[]>([])
  const [idA, setIdA] = useState('')
  const [idB, setIdB] = useState('')
  const [result, setResult] = useState<CompareResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/foods`).then(r => r.json()).then(setFoods).catch(() => {})
  }, [])

  const sameFood = idA !== '' && idA === idB

  async function compare() {
    if (!idA || !idB || sameFood) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/foods/compare?a=${idA}&b=${idB}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setResult(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Comparison failed')
    } finally {
      setLoading(false)
    }
  }

  const radarData = useMemo(() => {
    if (!result) return []
    return STATS.map(s => ({
      stat: s.short,
      a: result.foodA.scores[s.key],
      b: result.foodB.scores[s.key],
    }))
  }, [result])

  return (
    <div className="max-w-3xl mx-auto">

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row gap-3 items-end mb-6">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1.5">Food A</label>
          <select
            value={idA}
            onChange={e => { setIdA(e.target.value); setResult(null) }}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-emerald-700 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="">Select a food…</option>
            {foods.map(f => (
              <option key={f.id} value={f.id}>{formatName(f.name)}</option>
            ))}
          </select>
        </div>

        <span className="text-gray-600 font-bold pb-2 hidden sm:block">vs</span>

        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1.5">Food B</label>
          <select
            value={idB}
            onChange={e => { setIdB(e.target.value); setResult(null) }}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-blue-700 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">Select a food…</option>
            {foods.map(f => (
              <option key={f.id} value={f.id}>{formatName(f.name)}</option>
            ))}
          </select>
        </div>

        <button
          onClick={compare}
          disabled={!idA || !idB || sameFood || loading}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          {loading ? 'Comparing…' : 'Compare'}
        </button>
      </div>

      {sameFood && (
        <p className="text-amber-400 text-xs mb-4">Select two different foods to compare.</p>
      )}
      {error && (
        <p className="text-red-400 text-xs mb-4">{error}</p>
      )}

      {result && (
        <div className="bg-gray-900 rounded-2xl p-5">

          {/* Food header cards — also serve as radar chart legend */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-emerald-500">
              <span className={`inline-block text-xs font-medium text-white px-2 py-0.5 rounded-full mb-2 ${roleColor(result.foodA.role)}`}>
                {formatRole(result.foodA.role)}
              </span>
              <p className="text-lg font-bold text-white leading-tight">{formatName(result.foodA.name)}</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-emerald-400">{result.foodA.scores.overall.toFixed(1)}</span>
                <span className="text-xs text-gray-500">/ 100</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500">Food A</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500">
              <span className={`inline-block text-xs font-medium text-white px-2 py-0.5 rounded-full mb-2 ${roleColor(result.foodB.role)}`}>
                {formatRole(result.foodB.role)}
              </span>
              <p className="text-lg font-bold text-white leading-tight">{formatName(result.foodB.name)}</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-blue-400">{result.foodB.scores.overall.toFixed(1)}</span>
                <span className="text-xs text-gray-500">/ 100</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-500">Food B</span>
              </div>
            </div>
          </div>

          {/* Overall winner */}
          <div className="mb-5 text-center text-sm font-semibold">
            {result.winner.overall === result.foodA.name
              ? <span className="text-emerald-400">{formatName(result.foodA.name)} wins overall</span>
              : result.winner.overall === result.foodB.name
                ? <span className="text-blue-400">{formatName(result.foodB.name)} wins overall</span>
                : <span className="text-gray-400">Tied overall</span>
            }
          </div>

          {/* Overlaid radar */}
          <div className="flex justify-center mb-5">
            <div style={{ overflowX: 'auto' }}>
              <RadarChart
                width={420} height={280}
                data={radarData}
                margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              >
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: '#9ca3af', fontSize: 12, dy: -5 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Radar dataKey="a" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                <Radar dataKey="b" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
              </RadarChart>
            </div>
          </div>

          {/* Stat-by-stat rows */}
          <div className="flex flex-col gap-2">
            {STATS.map(s => {
              const vA = result.foodA.scores[s.key]
              const vB = result.foodB.scores[s.key]
              const w = result.winner[s.key]
              const aWins = w === result.foodA.name
              const bWins = w === result.foodB.name

              return (
                <div key={s.key} className="grid grid-cols-[1fr_5rem_1fr] items-center gap-2">
                  {/* Food A side */}
                  <div className={`rounded-lg p-2 ${aWins ? 'bg-emerald-950/60' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${aWins ? 'text-emerald-400' : 'text-gray-400'}`}>
                        {vA.toFixed(1)}
                      </span>
                      {aWins && <span className="text-emerald-500 text-xs font-bold">WIN</span>}
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full">
                      <div
                        className="h-1.5 rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${Math.min(vA, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stat label */}
                  <p className="text-[10px] leading-snug text-gray-500 text-center">{s.label}</p>

                  {/* Food B side */}
                  <div className={`rounded-lg p-2 ${bWins ? 'bg-blue-950/60' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      {bWins && <span className="text-blue-500 text-xs font-bold">WIN</span>}
                      <span className={`text-xs font-semibold ml-auto ${bWins ? 'text-blue-400' : 'text-gray-400'}`}>
                        {vB.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full">
                      <div
                        className="h-1.5 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${Math.min(vB, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reset */}
          <button
            onClick={() => setResult(null)}
            className="mt-5 w-full py-2 text-xs text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
          >
            Compare different foods
          </button>
        </div>
      )}
    </div>
  )
}
