// Card tiers by overall rating, FIFA-style. The face classes carry their own text colours so each
// tier keeps WCAG AA contrast: dark ink on the three light metals, white on the dark Elite face.
export type TierKey = 'bronze' | 'silver' | 'gold' | 'elite'

export interface Tier {
  key: TierKey
  label: string
  range: string
  face: string
  text: string
  subtext: string
  chip: string
}

export const TIERS: Tier[] = [
  { key: 'bronze', label: 'Bronze', range: 'under 60',
    face: 'bg-gradient-to-br from-[#e6b48a] via-[#d9a273] to-[#b97c4f]',
    text: 'text-[#2b1608]', subtext: 'text-[#2b1608]/75', chip: 'bg-[#d9a273] text-[#2b1608]' },
  { key: 'silver', label: 'Silver', range: '60–74',
    face: 'bg-gradient-to-br from-[#eef1f5] via-[#cfd6de] to-[#a6b0bc]',
    text: 'text-[#141a22]', subtext: 'text-[#141a22]/75', chip: 'bg-[#cfd6de] text-[#141a22]' },
  { key: 'gold', label: 'Gold', range: '75–84',
    face: 'bg-gradient-to-br from-[#f7d676] via-[#e8bf4a] to-[#c9972a]',
    text: 'text-[#2a1d00]', subtext: 'text-[#2a1d00]/75', chip: 'bg-[#e8bf4a] text-[#2a1d00]' },
  { key: 'elite', label: 'Elite', range: '85+',
    face: 'bg-gradient-to-br from-[#3b3aa8] via-[#2b2a7a] to-[#0f766e]',
    text: 'text-white', subtext: 'text-white/80', chip: 'bg-[#3b3aa8] text-white' },
]

export function tierFor(score: number): Tier {
  if (score >= 85) return TIERS[3]
  if (score >= 75) return TIERS[2]
  if (score >= 60) return TIERS[1]
  return TIERS[0]
}
