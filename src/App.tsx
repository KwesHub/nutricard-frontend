import FoodList from './components/FoodList'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold text-emerald-400">NutriCard</h1>
      <p className="text-gray-400 mt-2">Food intelligence, FIFA style.</p>
      <div className="mt-8">
        <FoodList />
      </div>
    </div>
  )
}

export default App
