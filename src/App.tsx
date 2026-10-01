import { useEffect, useState } from 'react'
import FoodList from './components/FoodList'
import MealBuilder from './components/MealBuilder'
import FoodCompare from './components/FoodCompare'
import TDEECalculator from './components/TDEECalculator'
import HowWeScore from './components/HowWeScore'
import type { UserProfile } from './types'

type View = 'foods' | 'meal' | 'compare' | 'about'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showTDEE, setShowTDEE] = useState(false)
  const [view, setView] = useState<View>('foods')
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  function toggleTheme() {
    const next = !dark
    setDark(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      // private mode: the choice just won't persist
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <main className="min-h-screen bg-page text-fg p-4 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-wide text-accent">NutriCard</h1>
          <p className="text-gray-400 mt-2">Food intelligence, FIFA style.</p>
        </div>
        <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-pressed={dark}
          className="bg-gray-800 hover:bg-gray-700 text-fg text-sm font-medium py-2 px-3 rounded-lg transition-colors"
        >
          <span aria-hidden="true">{dark ? '☾' : '☀'}</span> Dark mode</button>
        <button
          onClick={() => setShowTDEE(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
        >
          {userProfile ? `${userProfile.tdee.toLocaleString()} kcal` : 'Set Calories'}
        </button>
        </div>
      </header>

      <nav aria-label="Sections" className="flex flex-wrap gap-1 mt-6 mb-6 bg-gray-900 rounded-xl p-1 w-fit max-w-full">
        <button
          onClick={() => setView('foods')}
          aria-current={view === 'foods' ? 'page' : undefined}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'foods' ? 'bg-emerald-700 text-white' : 'text-gray-400 hover:text-fg'
          }`}
        >
          Food Database
        </button>
        <button
          onClick={() => setView('meal')}
          aria-current={view === 'meal' ? 'page' : undefined}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'meal' ? 'bg-emerald-700 text-white' : 'text-gray-400 hover:text-fg'
          }`}
        >
          Meal Builder
        </button>
        <button
          onClick={() => setView('compare')}
          aria-current={view === 'compare' ? 'page' : undefined}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'compare' ? 'bg-emerald-700 text-white' : 'text-gray-400 hover:text-fg'
          }`}
        >
          Compare
        </button>
        <button
          onClick={() => setView('about')}
          aria-current={view === 'about' ? 'page' : undefined}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
            view === 'about' ? 'bg-emerald-700 text-white' : 'text-gray-400 hover:text-fg'
          }`}
        >
          How we score
        </button>
      </nav>

      {view === 'foods' && <FoodList userProfile={userProfile} onOpenGuide={() => setView('about')} />}
      {view === 'meal' && <MealBuilder userProfile={userProfile} />}
      {view === 'compare' && <FoodCompare />}
      {view === 'about' && <HowWeScore />}

      {showTDEE && (
        <TDEECalculator
          onClose={() => setShowTDEE(false)}
          onSave={(profile) => {
            setUserProfile(profile)
            setShowTDEE(false)
          }}
        />
      )}
      <footer className="mt-10 text-xs text-gray-400">
        Food photos from Pixabay and Wikimedia Commons contributors, free to use.{' '}
        <a href="/foods/credits.json" className="underline hover:text-fg">Photographer credits</a>
      </footer>
    </main>
  )
}

export default App
