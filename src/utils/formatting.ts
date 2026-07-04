export const formatRole = (role: string) =>
  role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')

export const formatCategory = (cat: string) => cat.charAt(0) + cat.slice(1).toLowerCase()

export const formatName = (name: string) =>
  name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

export const roleColor = (role: string) => {
  switch (role) {
    case 'DAILY_DRIVER': return 'bg-emerald-600'
    case 'WEEKLY_ANCHOR': return 'bg-blue-600'
    case 'BOOSTER': return 'bg-purple-600'
    case 'PANTRY': return 'bg-gray-600'
    case 'OCCASIONAL': return 'bg-amber-600'
    default: return 'bg-gray-600'
  }
}

const NUTRIENT_LABELS: Record<string, string> = {
  vitaminA: 'Vitamin A', vitaminC: 'Vitamin C', vitaminD: 'Vitamin D',
  vitaminE: 'Vitamin E', vitaminK: 'Vitamin K', vitaminB1: 'Vitamin B1',
  vitaminB2: 'Vitamin B2', vitaminB3: 'Vitamin B3', vitaminB6: 'Vitamin B6',
  vitaminB12: 'Vitamin B12', folate: 'Folate', calcium: 'Calcium',
  iron: 'Iron', magnesium: 'Magnesium', phosphorus: 'Phosphorus',
  potassium: 'Potassium', zinc: 'Zinc', selenium: 'Selenium', copper: 'Copper',
  choline: 'Choline', pantothenicAcid: 'Pantothenic acid (B5)', biotin: 'Biotin',
  manganese: 'Manganese', iodine: 'Iodine', epa: 'EPA (omega-3)', dha: 'DHA (omega-3)',
}

export const formatNutrient = (key: string) => NUTRIENT_LABELS[key] ?? key

export const formatPctRda = (pct: number) =>
  pct >= 999 ? '999%+' : `${Math.round(pct)}%`

export const statColor = (value: number) => {
  if (value >= 80) return 'bg-green-500'
  if (value >= 60) return 'bg-lime-500'
  if (value >= 40) return 'bg-amber-500'
  if (value >= 20) return 'bg-orange-500'
  return 'bg-red-500'
}
