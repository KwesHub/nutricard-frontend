export interface Food {
  id: number
  name: string
  category: string
  foodRole: string
  servingSizeG: number
}

export interface NutritionScore {
  proteinQuality: number
  micronutrientDensity: number
  energyProfile: number
  gutHealth: number
  phytonutrients: number
  bioavailabilityModifier: number
  overallScore: number
}

export interface FoodCard {
  food: Food
  nutritionScore: NutritionScore
}
