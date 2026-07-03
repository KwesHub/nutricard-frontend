export interface Food {
  id: number
  name: string
  category: string
  description?: string
  foodRole: string
  servingSizeG: number
}

export type TimingContext = 'MORNING' | 'PRE_WORKOUT' | 'POST_WORKOUT' | 'EVENING' | 'NEUTRAL'

export interface TimingScores {
  MORNING: number
  PRE_WORKOUT: number
  POST_WORKOUT: number
  EVENING: number
  NEUTRAL: number
}

export interface ProteinBreakdown {
  rawProteinG: number
  pdcaas: number
  completenessFactor: number
  bioavailability: number
}

export interface EnergyBreakdown {
  fibreG: number
  gi: number
  sugarsG: number
  unsaturatedRatio: number
}

export interface GutBreakdown {
  fibreG: number
  prebioticBonus: number
  antiNutrientPenalty: number
  omega3Bonus: number
}

export interface MicroBreakdown {
  topNutrient: string
  coveragePct: number
}

export interface NutritionScore {
  proteinQuality: number
  micronutrientDensity: number
  energyProfile: number
  gutHealth: number
  phytonutrients: number
  bioavailabilityModifier: number
  overallScore: number
  synergyPotential: number
  kcalPer100g: number
  energyProfileNeutral: number
  timingScores: string | null
  proteinBreakdown: string
  energyBreakdown: string
  gutBreakdown: string
  microBreakdown: string
}

export interface FoodCard {
  food: Food
  nutritionScore: NutritionScore
}

export interface MealFoodEntry {
  id: number
  food: Food
  quantityG: number
}

export interface MealResult {
  meal: {
    id: number
    name: string
    timingContext: TimingContext
  }
  mealScore: {
    proteinQuality: number
    micronutrientDensity: number
    energyProfile: number
    gutHealth: number
    phytonutrients: number
    overallScore: number
    activeSynergies: string | null
  }
  foods: MealFoodEntry[]
}

export interface UserProfile {
  age: number
  weightKg: number
  heightCm: number
  sex: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'
  tdee: number
}
