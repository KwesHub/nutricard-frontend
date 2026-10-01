---
name: NutriCard
description: Food scored like football cards, with rarity tiers on a dark page.
colors:
  ink: "#0b1120"
  surface: "#111827"
  surface-raised: "#1f2937"
  line: "#374151"
  text: "#ffffff"
  text-muted: "#9ca3af"
  emerald-bright: "#34d399"
  emerald: "#10b981"
  emerald-deep: "#059669"
  tier-bronze: "#d9a273"
  tier-silver: "#cfd6de"
  tier-gold: "#e8bf4a"
  tier-elite: "#2b2a7a"
  tier-elite-glow: "#0f766e"
  ink-on-bronze: "#2b1608"
  ink-on-silver: "#141a22"
  ink-on-gold: "#2a1d00"
  role-weekly: "#2563eb"
  role-boost: "#9333ea"
  role-treat: "#d97706"
  stat-high: "#22c55e"
  stat-good: "#84cc16"
  stat-mid: "#f59e0b"
  stat-low: "#f97316"
  stat-poor: "#ef4444"
typography:
  display:
    fontFamily: "Barlow Condensed, Impact, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "Barlow Condensed, Impact, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.025em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Barlow Condensed, Impact, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.emerald-deep}"
  tab-active:
    backgroundColor: "{colors.emerald-deep}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "8px 20px"
  input-search:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card-gold:
    backgroundColor: "{colors.tier-gold}"
    textColor: "{colors.ink-on-gold}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  card-elite:
    backgroundColor: "{colors.tier-elite}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  chip-filter:
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: NutriCard

## Overview

**Creative North Star: "The Matchday Programme"**

NutriCard looks like the programme you are handed at a ground on match day: foods are the players, the stats are the story, and a metallic card tells you at a glance who is Elite and who is a Bronze. A dark page keeps the cards bright, and condensed sports type carries every number and name. The tone is confident and tactile, never decorative: solid fills, clear selected states, big numbers.

The system serves two readers at once. A beginner should understand the grid in seconds (rating, tier, name, five stats). A gym-goer gets depth one layer down (card modal, Compare, Meal Builder). Rarity does the first job; plain-language labels do the second. Scores are honest by design, so nothing in the interface may imply medical advice or dress a low score up as a high one.

The dark page is the current implementation, not a binding identity choice. Only the football-card concept and WCAG AA are binding (see PRODUCT.md).

**Key Characteristics:**
- Four rarity tiers (Bronze, Silver, Gold, Elite) give every food a visible rank.
- Condensed display type for numbers and names; a humanist sans for everything you read.
- Flat page and controls; only cards cast shadow and lift on hover.
- Dark ink text on the three light tiers, white on Elite, every pairing AA.
- Emerald is the single interface accent. Tier colours belong to cards only.

## Colors

A near-black navy page, grey surfaces, one emerald accent, and four metallic tier faces that are the only strongly saturated areas on screen.

### Primary
- **Emerald** (#10b981): primary buttons and calls to action ("Set Calories"). The one interface accent.
- **Emerald Bright** (#34d399): the wordmark and text links (e.g. "How do scores work?"). Text-only use, since it is for dark backgrounds.
- **Emerald Deep** (#059669): the selected tab and button hover; where something is on or pressed.

### Secondary (card tiers)
- **Bronze** (#d9a273): overall under 60. Gradient #e6b48a → #b97c4f. Text #2b1608.
- **Silver** (#cfd6de): overall 60 to 74. Gradient #eef1f5 → #a6b0bc. Text #141a22.
- **Gold** (#e8bf4a): overall 75 to 84. Gradient #f7d676 → #c9972a. Text #2a1d00.
- **Elite** (#2b2a7a to #0f766e): overall 85 and above. Indigo-to-teal gradient from #3b3aa8. White text.

### Tertiary (meaning colours)
- **Role chips**: Eat daily emerald (#059669), 2–3× a week blue (#2563eb), Small boost purple (#9333ea), Flavour staple grey (#4b5563), Treat amber (#d97706).
- **Stat bars**: green (#22c55e) 80+, lime (#84cc16) 60+, amber (#f59e0b) 40+, orange (#f97316) 20+, red (#ef4444) below 20.

### Neutral
- **Ink** (#0b1120): the page, and the badge band at the foot of each card.
- **Surface** (#111827): modals and panels.
- **Surface Raised** (#1f2937): inputs, selects, inactive chips.
- **Line** (#374151): input borders and dividers.
- **Text** (#ffffff) and **Text Muted** (#9ca3af): body and secondary text. Muted is the lightest allowed for small secondary text (AA on Surface and Ink); never go darker than gray-400.

### Named Rules
**The Tier Is Earned Rule.** A card's tier comes only from its overall rating (Bronze under 60, Silver 60–74, Gold 75–84, Elite 85+). Never recolour a card for emphasis, and never use tier colours on interface chrome.

**The One Voice Rule.** Emerald is the only accent on the interface itself. A screen has a handful of emerald elements, not a wash of them.

**The Pair Rule.** Every tier face is paired with its own text colour. Don't put white text on Silver or Gold, or dark text on Elite.

## Typography

**Display Font:** Barlow Condensed (with Impact, sans-serif)
**Body Font:** DM Sans (with system-ui, sans-serif)

**Character:** Barlow Condensed is the sports-kit face: tall, tight and numeric, used for ratings, names and stat labels. DM Sans keeps explanations and controls friendly and legible next to it.

### Hierarchy
- **Display** (700, 3.75rem / 60px, line-height 1): the overall rating on a card.
- **Headline** (700, 1.875rem / 30px, uppercase, tracking 0.025em): the food name on a grid card; the wordmark at 3rem.
- **Title** (700, 1.125rem, 1.4): modal and section titles in DM Sans.
- **Body** (400, 0.875rem, 1.5): descriptions and explanations. Keep line length under 75ch.
- **Label** (600, 0.75rem, tracking 0.1em, uppercase): stat abbreviations (PRO, MIC, ENE, GUT, PHY) and tier names.

### Named Rules
**The Numbers Are Condensed Rule.** Any figure the user compares (rating, stat value, calories) is set in Barlow Condensed. Prose and controls are never condensed.

**The Spell-It-Out Rule.** Abbreviations such as PRO and MIC are visual shorthand only. Each carries a screen-reader label with the full name, and the full name appears wherever there is room.

## Layout

A single full-width page with 16px side padding on phones and 32px from the small breakpoint up. The header holds the wordmark and the calorie button; below it a section nav, search, filters, then the card grid. The grid is one column on phones, two from 640px, three from 1024px and four from 1280px, with a 20px gap. Controls wrap rather than scroll. Modals centre with a 16px margin, cap at 90% of viewport height and scroll inside.

Spacing runs on a 4px base: 4, 8, 16, 20, 32. Filter rows sit 16px apart; a card's inner padding is 16px horizontally.

## Elevation & Depth

Flat by default, lifted only where a thing is a card. The page, inputs, chips and buttons carry no shadow; separation comes from surface tone (Ink, Surface, Surface Raised) and 1px lines. Cards cast a soft black shadow and rise 4px on hover; users who prefer reduced motion get no movement.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)`): grid cards.
- **Popover** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)`): badge detail popovers.

### Named Rules
**The Flat-Page Rule.** Only cards and popovers may have a shadow. If something else seems to need one, it needs a surface tone instead.

## Shapes

Soft, rounded rectangles throughout. Cards and modals use 16px corners, the photo slot and tab bar 12px, buttons and inputs 8px, and every chip is fully round. The card photo slot is a fixed 144px-tall rectangle that crops its image to fill.

## Components

### Buttons
- **Shape:** 8px radius.
- **Primary:** Emerald fill (#10b981), white text, 8px 16px padding, medium weight.
- **Hover / Focus:** darkens to Emerald Deep (#059669) with a 150ms colour transition; keyboard focus keeps the browser focus ring and must stay visible.
- **Disabled:** 40–50% opacity; use `aria-disabled` while loading so focus is not lost.

### Chips
- **Style:** fully round, 4px 12px, white text on a solid fill. Role chips use the role colours; tier chips use the tier faces with their paired text colour.
- **State:** selected is full opacity (tier chips also get a white ring); unselected is 70–80% opacity. Always expose `aria-pressed`.

### Food card (signature component)
The recurring unit of the whole system: a portrait tile in its tier colours.
- **Corner Style:** 16px.
- **Layout, top to bottom:** rating (Display) with tier name beneath, role and category at top right; a 144px photo slot (emoji fallback); the food name as the single button that stretches over the whole card; a five-stat strip (label, then value); a dark Ink band at the foot holding badges.
- **States:** hover lifts 4px; keyboard focus draws a white 2px ring around the whole card.
- **Accessibility:** the food name is the card's accessible name; the rating and stat labels are read in full.

### Inputs / Fields
- **Style:** Surface Raised (#1f2937) fill, 1px Line border, 8px radius, white text, muted placeholder.
- **Focus:** border shifts to emerald.

### Navigation
A pill-shaped segmented bar on Surface. The active section is Emerald Deep with white text and `aria-current="page"`; inactive sections are muted text that turns white on hover. Labels wrap on phones.

### Modals
Surface (#111827) panel, 16px radius, centred over an 80% black scrim. Role dialog, Escape closes, focus is trapped and returned to the opener. Close button top-right; the content must leave room so it never covers the score.

## Do's and Don'ts

### Do:
- **Do** set every comparable number in Barlow Condensed.
- **Do** keep text on a tier face in that tier's paired ink colour (#2b1608, #141a22, #2a1d00, or white on Elite).
- **Do** keep small secondary text at gray-400 (#9ca3af) or lighter on dark surfaces.
- **Do** give every control a visible label or `aria-label` that names what it acts on ("Sardines", not "View Card").
- **Do** respect reduced motion: no hover lift or movement when the user asks for less.
- **Do** keep explanations short and plain; explain what a number means and what it does not.

### Don't:
- **Don't** colour interface elements with tier colours or recolour a card to draw attention.
- **Don't** add shadows to buttons, chips, inputs or the page.
- **Don't** spread emerald across a screen; it is the one accent.
- **Don't** present a score as health or medical advice, or word a low score to sound better than it is.
- **Don't** drop below WCAG AA contrast, or rely on colour alone to carry meaning.
