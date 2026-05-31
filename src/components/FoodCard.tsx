import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts'
import type { FoodCard as FoodCardType } from '../types'

const formatRole = (role: string) =>
  role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')

const statColor = (value: number) => {
  if (value >= 80) return 'bg-green-500'
  if (value >= 60) return 'bg-lime-500'
  if (value >= 40) return 'bg-amber-500'
  if (value >= 20) return 'bg-orange-500'
  return 'bg-red-500'
}

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

interface Props {
  card: FoodCardType
}

export default function FoodCard({ card }: Props) {
  const { food, nutritionScore } = card

  const radarData = [
    { stat: 'Protein', label: 'Protein Quality', value: nutritionScore.proteinQuality },
    { stat: 'Micros', label: 'Micronutrient Density', value: nutritionScore.micronutrientDensity },
    { stat: 'Energy', label: 'Energy Profile', value: nutritionScore.energyProfile },
    { stat: 'Gut', label: 'Gut Health', value: nutritionScore.gutHealth },
    { stat: 'Phyto', label: 'Phytonutrients', value: nutritionScore.phytonutrients },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
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

      {/* Radar Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ overflowX: 'auto', outline: 'none', border: 'none' }}>
          <RadarChart
            width={420}
            height={340}
            data={radarData}
            margin={{ top: 30, right: 80, bottom: 30, left: 80 }}
          >
            <PolarGrid stroke="#374151" strokeWidth={0.5} />
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
              dot={false}
              activeDot={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{ background: '#1f2937', padding: '8px 12px', borderRadius: '8px', border: '1px solid #374151' }}>
                      <p style={{ color: '#10b981', margin: 0, fontWeight: 'bold' }}>{payload[0].payload.stat}</p>
                      <p style={{ color: 'white', margin: 0 }}>{Number(payload[0].value).toFixed(1)}</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </RadarChart>
        </div>
      </div>

      {/* Stat Bars */}
      <div className="flex flex-col gap-3">
        {radarData.map((d) => (
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
    </div>
  )
}
