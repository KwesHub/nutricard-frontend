// Design tokens for the Matchday Programme (see DESIGN.md). Neutrals are CSS variables defined in
// src/index.css so the same `gray-*` / `page` / `fg` classes flip between light and dark themes;
// the tier colours are fixed, because a card keeps its metal in either theme.
const channel = (name) => `rgb(var(--${name}) / <alpha-value>)`

const gray = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [step, channel(`gray-${step}`)]),
)

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        gray,
        page: channel('page'),
        fg: channel('fg'),
        accent: channel('accent'),
        ink: '#0b1120',
        bronze: { light: '#e6b48a', DEFAULT: '#d9a273', dark: '#b97c4f', ink: '#2b1608' },
        silver: { light: '#eef1f5', DEFAULT: '#cfd6de', dark: '#a6b0bc', ink: '#141a22' },
        gold: { light: '#f7d676', DEFAULT: '#e8bf4a', dark: '#c9972a', ink: '#2a1d00' },
        elite: { light: '#3b3aa8', DEFAULT: '#2b2a7a', dark: '#0f766e', ink: '#ffffff' },
      },
    },
  },
  plugins: [],
}
