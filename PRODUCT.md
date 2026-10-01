# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, beginners first. The front door is someone who "doesn't know where to start" with nutrition: they browse foods to learn what is good and why. Gym-goers use the same app for depth: when to eat a food around training, how a meal scores, how two foods compare. The wider group named in the project's plans is gym-goers, the nutrition-curious and the culinary-curious.

## Product Purpose

NutriCard scores foods the way football games score players. Each food gets five 0-100 stats (protein quality, micronutrient density, energy profile, gut health, phytonutrients), an overall rating, a plain-language eating frequency, and a grade for each time of day. A meal builder scores combinations of foods and a compare view puts two foods side by side. Data comes from USDA FoodData Central.

Right now it is a portfolio and interview piece, with a live technical interview around 2026-10-09 (exact date unconfirmed). The owner intends to build it out for a public release later, possibly promoted through fitness social media. Design and code decisions should hold up under both: interview-ready now, release-ready later.

## Positioning

Foods as collectible cards with comparable stats, plus timing-aware grades ("when to eat it") and meal-level scoring. A neighbouring calorie or macro tracker could not truthfully copy the card-and-stats framing together with the gastric-emptying timing model.

## Operating Context

No accounts, no login, no pagination. The only personal input is the optional calorie calculator (Mifflin-St Jeor), which feeds the "% of your daily budget" figure on food cards. Frontend is a single-page app with three tabs (Food Database, Meal Builder, Compare) and the calculator. The API is a separate repository.

## Capabilities and Constraints

- 41 seeded foods. Stats describe 100g of a food, not a serving; the serving-size box scales calories only.
- Micronutrient density is nutrients per 100 kcal, scored on a saturating curve so no food reaches 100.
- Cards are tiered by overall rating: Bronze (under 60), Silver (60-74), Gold (75-84), Elite (85+).
- Foods eaten for taste (garlic, honey) have no time-of-day grades.
- A planned page that teaches what micronutrients do and what the scores mean. Not built yet; scope undecided.
- The API deploys to Railway on a push to its `master`; the frontend deploys to Vercel on a push to `main`. The owner pushes deliberately.
- Undecided: editorial voice for educational copy; whether the dark page background is part of the identity.

## Brand Commitments

- The football-card ("FIFA cards for food") concept is the product's central idea.
- Honest scoring is binding. Scores rate food quality, never give medical advice, and are never inflated to look better.
- Everything else about look and voice is open; the owner wants to decide by looking at what gets built.

## Evidence on Hand

Real, current data: 41 foods scored from USDA data, 59 backend tests including a golden-file test, CI on both repositories. Food photos are not yet sourced (a photo slot with an emoji fallback exists). No testimonials, user numbers, or benchmarks exist; do not invent any.

## Product Principles

1. Beginners first, depth on demand: the grid should make sense in seconds, the card and compare views carry the detail.
2. Honest scores over impressive scores. Explain what a number means and what it does not.
3. Teach as you show: every stat and badge should be explainable in plain language where it appears.
4. Accessible by default, to WCAG AA, as a deliberate and demonstrable standard.

## Accessibility & Inclusion

Target standard: WCAG 2.1 AA, which the owner wants to be able to speak to in the interview. Already in place: dialog semantics with focus management, labelled controls, text alternatives for charts, AA-contrast secondary text. Not yet audited end to end.
