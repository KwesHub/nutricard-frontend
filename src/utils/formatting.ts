// The food's role on the plate. How often to eat it is a separate field (food.frequency).
const ROLE_LABELS: Record<string, string> = {
  BASE: 'Base',
  PROTEIN: 'Protein',
  VEG_FRUIT: 'Veg & fruit',
  BOOSTER: 'Booster',
  FLAVOUR: 'Flavour',
  TREAT: 'Treat',
}

export const formatRole = (role: string) =>
  ROLE_LABELS[role] ??
  role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')

export const formatCategory = (cat: string) => cat.charAt(0) + cat.slice(1).toLowerCase()

export const formatName = (name: string) =>
  name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

export const roleColor = (role: string) => {
  switch (role) {
    // All white-text fills at 5:1 or better
    case 'BASE': return 'bg-amber-800'
    case 'PROTEIN': return 'bg-red-700'
    case 'VEG_FRUIT': return 'bg-emerald-700'
    case 'BOOSTER': return 'bg-purple-600'
    case 'FLAVOUR': return 'bg-slate-600'
    case 'TREAT': return 'bg-pink-700'
    default: return 'bg-slate-600'
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
  manganese: 'Manganese', iodine: 'Iodine', epa: 'EPA (omega-3)', dha: 'DHA (omega-3)', fibre: 'Fibre',
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
