export interface Food {
  id: number
  name: string
  category: string
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
}

export interface MicroBreakdown {
  topNutrient: string
  coverage: number
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
  timingScores: TimingScores
  proteinBreakdown: string
  energyBreakdown: string
  gutBreakdown: string
  microBreakdown: string
  energyKcal: number
}

export interface FoodCard {
  food: Food
  nutritionScore: NutritionScore
}

export interface UserProfile {
  age: number
  weightKg: number
  heightCm: number
  sex: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'
  tdee: number
}
