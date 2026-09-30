# NutriCard frontend

[![CI](https://github.com/KwesHub/nutricard-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/KwesHub/nutricard-frontend/actions/workflows/ci.yml)

The web app for [NutriCard](https://github.com/KwesHub/nutricard-api), an API that scores foods like football cards: five stats out of 100, an overall rating, and a grade for when to eat it.

<!-- Add the live demo link here once confirmed (Vercel). -->

## What's in it

The app has three tabs and a calorie calculator.

- **Food Database.** A grid of 41 foods with search and role filters (eat daily, 2-3 times a week, small boost, flavour staple, treat). Opening a food shows its card: a radar chart and bars for the five stats, badges for its standout nutrients and anything to watch out for, and a grade from S to F for each time of day. A serving-size box scales the calories and shows them as a share of your daily budget. Foods you eat for taste, such as garlic or honey, have no time-of-day grades.
- **Meal Builder.** Add foods, set the grams and the time of day, and score the meal. The result shows the combined stats, any food synergies, the nutrients the meal leaves short, and foods that would fill them.
- **Compare.** Pick two foods for an overlaid radar chart, the winner on each stat, the nutrients only one of them has, and the nutrients where one has clearly more.
- **Set Calories.** A calculator that estimates your daily calories from your age, weight, height, sex and activity level (the Mifflin-St Jeor equation). It feeds the "% of your daily budget" figure on cards.

## Stack

React 19, TypeScript in strict mode, Vite, Tailwind CSS 3 and Recharts.

## Running it

You need Node 22 and the [API](https://github.com/KwesHub/nutricard-api) running.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173 and expects the API at `http://localhost:8080`. To point it somewhere else, set `VITE_API_BASE_URL`:

```bash
VITE_API_BASE_URL=https://your-api.example.com npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then a production build in `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build locally |

GitHub Actions runs the lint and the build on every push.

## How it's organised

```
src/
  App.tsx            tabs, the calorie profile, the calculator modal
  config.ts          API base URL
  types.ts           TypeScript types for the API's JSON
  utils/formatting.ts  labels and colours
  components/
    FoodList.tsx  FoodCard.tsx  FoodCompare.tsx
    MealBuilder.tsx  MealCard.tsx
    TDEECalculator.tsx  BadgeChip.tsx  Modal.tsx
```

There is no router and no global state library. Each component keeps its own state and calls the API with `fetch`, which is simple at this size. If more views needed the same calls, I'd move them into one small API module.

Several fields on a food's score (the timing grades and the four breakdowns) arrive from the API as JSON stored in a text column, so the app parses them with `JSON.parse`. `types.ts` describes their shape and has to be kept in step with the API by hand. It has drifted before. There is no runtime check on the parsed data.

## Known limitations

- There are no tests yet. I would start with the formatting helpers, the card with a missing time-of-day score (this crashed once), and the meal builder's handling of a food added twice.
- The API returns a 503 when it cannot reach USDA for a food it has not scored yet. The app shows the raw error (`Failed to load card: HTTP 503`) with no retry.
- The meal builder and the food grid are functional but plain. A visual polish pass is still to do.

## Deployment

The frontend is built with `npm run build` and hosted on Vercel. Set `VITE_API_BASE_URL` to the API's address there, and add the frontend's address to the API's `CORS_ORIGINS`.
