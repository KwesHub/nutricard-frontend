// Card tiers by overall rating, FIFA-style. Cut-offs 80/70/55 were set after the 2026-10-01 scoring
// audit, which made the overall stricter (see SCORING_AUDIT.md). The colours are tokens in tailwind.config.js
// (bronze, silver, gold, elite); each has an `ink` text colour that keeps WCAG AA contrast on
// its face: dark ink on the three light metals, white on the dark Elite face. Subtext is ink at 95%
// opacity: lower fails AA on the darkest gradient stop (bronze needs 95%).
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
  { key: 'bronze', label: 'Bronze', range: 'under 55',
    face: 'bg-gradient-to-br from-bronze-light via-bronze to-bronze-dark',
    text: 'text-bronze-ink', subtext: 'text-bronze-ink/95', chip: 'bg-bronze text-bronze-ink' },
  { key: 'silver', label: 'Silver', range: '55–69',
    face: 'bg-gradient-to-br from-silver-light via-silver to-silver-dark',
    text: 'text-silver-ink', subtext: 'text-silver-ink/95', chip: 'bg-silver text-silver-ink' },
  { key: 'gold', label: 'Gold', range: '70–79',
    face: 'bg-gradient-to-br from-gold-light via-gold to-gold-dark',
    text: 'text-gold-ink', subtext: 'text-gold-ink/95', chip: 'bg-gold text-gold-ink' },
  { key: 'elite', label: 'Elite', range: '80+',
    face: 'bg-gradient-to-br from-elite-light via-elite to-elite-dark',
    text: 'text-elite-ink', subtext: 'text-elite-ink/95', chip: 'bg-elite text-elite-ink' },
]

export function tierFor(score: number): Tier {
  if (score >= 80) return TIERS[3]
  if (score >= 70) return TIERS[2]
  if (score >= 55) return TIERS[1]
  return TIERS[0]
}
