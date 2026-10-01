// Emoji per food, keyed on the exact seeded food name. Foods without an entry fall back to a
// plate, so a newly seeded food never renders blank.
const FOOD_ICONS: Record<string, string> = {
  'Sardines': '🐟', 'Oats': '🌾', 'Garlic': '🧄', 'Eggs': '🥚', 'Chicken breast': '🍗',
  'Beef mince 10%': '🥩', 'Sweet potato': '🍠', 'Brown rice': '🍚', 'White rice': '🍚',
  'Pearl barley': '🌾', 'Whole-wheat spaghetti': '🍝', 'Red lentils': '🫘', 'Green lentils': '🫘',
  'Red kidney beans': '🫘', 'Peas': '🫛', 'Spinach': '🥬', 'Apple': '🍎', 'Banana': '🍌',
  'Kiwi': '🥝', 'Blueberries': '🫐', 'Ginger': '🫚', 'Honey': '🍯', 'Peanut butter': '🥜',
  'Tahini': '🥄', 'Olive oil': '🫒', 'Dark chocolate 70%': '🍫', 'Salmon': '🐟',
  'Greek yogurt': '🥛', 'Broccoli': '🥦', 'Avocado': '🥑', 'Quinoa': '🌾', 'Black beans': '🫘',
  'Walnuts': '🌰', 'Cottage cheese': '🧀', 'Lemon': '🍋', 'Flaxseed': '🌱', 'Chia seeds': '🌱',
  'Sweet corn': '🌽', 'Bell pepper': '🫑', 'Tomato': '🍅', 'Brazil nuts': '🌰',
}

export function foodIcon(name: string): string {
  return FOOD_ICONS[name] ?? '🍽️'
}
