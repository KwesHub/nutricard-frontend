import { useState } from 'react'
import FoodList from './components/FoodList'
import TDEECalculator from './components/TDEECalculator'
import type { UserProfile } from './types'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showTDEE, setShowTDEE] = useState(false)

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
      <div className="mt-8">
        <FoodList userProfile={userProfile} />
      </div>

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
