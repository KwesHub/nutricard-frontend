import { useState } from 'react'
import type { UserProfile } from '../types'
import Modal from './Modal'

interface Props {
  onClose: () => void
  onSave: (profile: UserProfile) => void
}

const activityLevels: { label: string; value: UserProfile['activityLevel']; multiplier: number }[] = [
  { label: 'Sedentary', value: 'sedentary', multiplier: 1.2 },
  { label: 'Lightly Active', value: 'light', multiplier: 1.375 },
  { label: 'Moderately Active', value: 'moderate', multiplier: 1.55 },
  { label: 'Very Active', value: 'active', multiplier: 1.725 },
  { label: 'Athlete', value: 'athlete', multiplier: 1.9 },
]

export default function TDEECalculator({ onClose, onSave }: Props) {
  const [age, setAge] = useState<number | ''>('')
  const [weightKg, setWeightKg] = useState<number | ''>('')
  const [heightCm, setHeightCm] = useState<number | ''>('')
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>('moderate')
  const [tdee, setTdee] = useState<number | null>(null)

  function calculate() {
    if (!age || !weightKg || !heightCm) return
    const bmr =
      sex === 'male'
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    const multiplier = activityLevels.find((a) => a.value === activityLevel)!.multiplier
    setTdee(Math.round(bmr * multiplier))
  }

  function handleSave() {
    if (!tdee || !age || !weightKg || !heightCm) return
    onSave({ age, weightKg, heightCm, sex, activityLevel, tdee })
  }

  return (
    <Modal onClose={onClose} maxWidth={480}>
        <h2 className="text-xl font-bold text-white mb-1">TDEE Calculator</h2>
        <p className="text-sm text-gray-400 mb-5">Calculate your daily calorie needs</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              placeholder="25"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
              placeholder="70"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Height (cm)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : '')}
              placeholder="175"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Sex</label>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    sex === s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Activity Level</label>
            <div className="flex flex-wrap gap-2">
              {activityLevels.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setActivityLevel(a.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activityLevel === a.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!age || !weightKg || !heightCm}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate
          </button>

          {tdee !== null && (
            <div className="text-center">
              <p className="text-gray-400 text-sm">Your daily calorie needs:</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">
                {tdee.toLocaleString()} kcal
              </p>
              <button
                onClick={handleSave}
                className="mt-4 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>
    </Modal>
  )
}
