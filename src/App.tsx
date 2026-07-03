import { useState } from 'react'
import FoodList from './components/FoodList'
import MealBuilder from './components/MealBuilder'
import FoodCompare from './components/FoodCompare'
import TDEECalculator from './components/TDEECalculator'
import type { UserProfile } from './types'

type View = 'foods' | 'meal' | 'compare'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showTDEE, setShowTDEE] = useState(false)
  const [view, setView] = useState<View>('foods')

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">NutriCard</h1>
          <p className="text-gray-400 mt-2">Food intelligence, FIFA style.</p>
        </div>
        <button
          onClick={() => setShowTDEE(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {userProfile ? `${userProfile.tdee.toLocaleString()} kcal` : 'Set Calories'}
        </button>
      </div>

      <div className="flex gap-1 mt-6 mb-6 bg-gray-900 rounded-xl p-1 w-fit">
        <button
          onClick={() => setView('foods')}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'foods' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Food Database
        </button>
        <button
          onClick={() => setView('meal')}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'meal' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Meal Builder
        </button>
        <button
          onClick={() => setView('compare')}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'compare' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Compare
        </button>
      </div>

      {view === 'foods' && <FoodList userProfile={userProfile} />}
      {view === 'meal' && <MealBuilder userProfile={userProfile} />}
      {view === 'compare' && <FoodCompare />}

      {showTDEE && (
        <TDEECalculator
          onClose={() => setShowTDEE(false)}
          onSave={(profile) => {
            setUserProfile(profile)
            setShowTDEE(false)
          }}
        />
      )}
    </div>
  )
}

export default App
