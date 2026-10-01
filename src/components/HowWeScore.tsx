import type { ReactNode } from 'react'
import { TIERS } from '../utils/tier'

// Static explainer of the scoring rules. Every number here mirrors the backend (ScoringService,
// FoodVersatility, DataSeeder.FOOD_GUIDE); if a rule changes there, change it here too.

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10 first:mt-0">
      <h2 id={id} className="font-display text-3xl font-bold uppercase tracking-wide text-fg">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-300">{children}</div>
    </section>
  )
}

function Rule({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-gray-900">
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-gray-800 first:border-t-0">
              <th scope="row" className="w-1/3 px-4 py-2.5 align-top font-semibold text-fg">{k}</th>
              <td className="px-4 py-2.5 text-gray-300">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-fg">
      {children}
    </a>
  )
}

export default function HowWeScore() {
  return (
    <article className="max-w-3xl">
      <p className="text-base text-gray-300">
        Every food gets a card, like a player in a football game. This page explains every number on it,
        where the data comes from, and what the scores don't tell you.
      </p>

      <Section id="stats" title="The four quality stats">
        <p>Each is 0 to 100 and describes 100g of the food, not a serving.</p>
        <Rule rows={[
          ['Protein quality', 'Half for how much protein there is (full marks at 22g per 100g), half for how good it is (PDCAAS, the standard digestibility score, times amino-acid completeness). The quality half only counts in proportion to the amount, so a food with no protein scores 0.'],
          ['Micronutrient density', '27 nutrients (vitamins, minerals, omega-3s and fibre), each as a share of its daily target per 100 calories, capped at 100% so one huge amount can\'t carry the score. Foods under 50 calories per 100g are scored as if they had 50, so a tomato isn\'t inflated. Nutrients most people fall short on count more. The result is put on a curve that approaches 100 but never reaches it.'],
          ['Gut health', 'Fibre (up to 60 points at 10g per 100g), plus bonuses for prebiotic fibre, live cultures and omega-3, minus a small penalty for anti-nutrients such as phytates.'],
          ['Phytonutrients', 'Plant compounds like polyphenols and carotenoids. Animal foods score close to 0. Plant values are currently set by hand from the research; replacing them with measured data is planned.'],
        ]} />
        <p>
          <strong className="text-fg">Which nutrients count more:</strong> calcium, potassium, vitamin D and fibre count double,
          because the US Dietary Guidelines name them as nutrients of public health concern. Nutrients commonly
          under-eaten in UK and US surveys count 1.5 times. The rest count once.
        </p>
      </Section>

      <Section id="overall" title="The overall rating">
        <p>
          The overall rating is a food&apos;s <strong className="text-fg">two best quality stats</strong>, weighted 60% and 40%.
          Most foods are genuinely good at two things. Salmon is protein and micronutrients; oats are gut health and
          phytonutrients. Counting a third stat would mark salmon down for having no fibre, which it was never for.
        </p>
        <div className="flex flex-wrap gap-2" aria-label="Card tiers">
          {TIERS.map(t => (
            <span key={t.key} className={`rounded-full px-3 py-1 text-xs font-semibold ${t.chip}`}>
              {t.label} {t.range}
            </span>
          ))}
        </div>
      </Section>

      <Section id="timing" title="Energy and timing">
        <p>
          The energy profile measures how a food&apos;s energy arrives: how fast it leaves the stomach (fat, fibre and
          protein slow it down) and how fast its sugar reaches the blood (its glycaemic index). Each time of day has an
          ideal point. Before training you want fast and fast; in the evening, gentle on the stomach and slow on blood
          sugar. The timing grades (S to F) come from how close a food sits to each point.
        </p>
        <p>
          Energy is <strong className="text-fg">not</strong> part of the overall rating. It tells you when a food suits
          you, not how good the food is.
        </p>
      </Section>

      <Section id="highlights" title="The highlights on each card">
        <Rule rows={[
          ['★ Shortfall nutrients', 'A nutrient most diets fall short on, at 30% or more of the daily target per 100g. Other nutrients need 50%.'],
          ['High protein', 'At least 20% of calories from protein, and at least 5g per 100g.'],
          ['High fibre', 'At least 6g per 100g, or 3g per 100 calories, and at least 3g per 100g.'],
          ['High omega-3 (EPA + DHA)', 'At least 80mg of EPA and DHA per 100g and per 100 calories.'],
          ['High monounsaturated fat', 'At least 45% of the fat is monounsaturated, and it gives more than 20% of the calories.'],
          ['🌿 Plant compounds', 'A compound the food is known for, with a measured amount: anthocyanins in blueberries, lycopene in tomatoes, sulforaphane in broccoli.'],
          ['ⓘ Good to know', 'Context, not a warning. Plant omega-3 converts poorly to the forms your body uses; red meat has an NHS limit.'],
          ['⚠ / ⛔ Watch and limits', 'Anti-nutrients and how to reduce them; hard limits such as two Brazil nuts a day.'],
        ]} />
        <p>
          The four &quot;high&quot; labels use the legal definitions food labels must meet in the UK and EU
          (<Source href="https://www.legislation.gov.uk/eur/2006/1924/annex">Regulation 1924/2006</Source>). We add the
          per-100g minimums ourselves: by the law alone, spinach would be &quot;high protein&quot; because it has so few
          calories that its 2.9g of protein is half of them.
        </p>
      </Section>

      <Section id="roles" title="Roles and how often">
        <p>
          The role says what part of the plate a food is: Base, Protein, Veg &amp; fruit, Nuts &amp; seeds, Flavour or
          Treat. The how-often line comes from published advice and says which way it points.
        </p>
        <Rule rows={[
          ['Daily, part of 5 a day', 'NHS 5 A Day. Beans and lentils count once, however much you eat; sweet potato counts.'],
          ['At least 2× a week', 'Oily fish. NHS advice is a minimum of two portions of fish a week, one of them oily.'],
          ['Up to 70g a day', 'Red meat. NHS advice is a ceiling, chosen so people can cut down without falling short on iron.'],
          ['No set limit', 'Eggs and chicken. The NHS sets no limit.'],
          ['Max 2 a day', 'Brazil nuts, because of the safe upper limit for selenium.'],
          ['Now and then', 'Treats. Honey counts as free sugar, which the NHS caps at 30g a day for adults.'],
        ]} />
      </Section>

      <Section id="versatility" title="Versatility and pairings">
        <p>
          <strong className="text-fg">Versatility</strong> is how well a food works as a base for others, from three stated
          traits: how neutral its flavour is, whether it works sweet and savoury, and whether it can be the base of a
          meal. White rice scores 100; garlic scores 20.
        </p>
        <p>
          <strong className="text-fg">Pairs well with</strong> lists foods that help each other, such as beans with a
          real dose of vitamin C (pepper, kiwi or broccoli) for iron. A squeeze of lemon isn&apos;t on the list: it has
          too little vitamin C to make a difference.
        </p>
      </Section>

      <Section id="data" title="Where the data comes from">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Nutrients: <Source href="https://fdc.nal.usda.gov/">USDA FoodData Central</Source>, using the entry for the food as it&apos;s eaten (cooked rice and lentils, not dry).</li>
          <li>Polyphenols: <Source href="http://phenol-explorer.eu/">Phenol-Explorer</Source>, a research database of measured plant compounds.</li>
          <li>How often to eat: <Source href="https://www.nhs.uk/live-well/eat-well/5-a-day/5-a-day-what-counts/">NHS</Source> guidance and the EFSA selenium limit.</li>
          <li>Label definitions: <Source href="https://www.legislation.gov.uk/eur/2006/1924/annex">Regulation 1924/2006</Source>.</li>
        </ul>
      </Section>

      <Section id="checked" title="How we checked it">
        <p>
          Every food&apos;s card was audited against its USDA record. That found seven foods matched to the wrong entry,
          including kidney beans recorded as pinto beans and whole-wheat spaghetti recorded as crunchy restaurant noodles. All
          seven were fixed.
        </p>
        <p>
          Each scoring rule was then tested by comparing the ranking it produced with a ranking of the same foods made
          separately, in the owner&apos;s own nutrition notes. Two proposals we liked were dropped because they agreed
          with it less than the rules we kept.
        </p>
      </Section>

      <Section id="limits" title="What the scores don't tell you">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>They rate foods, not diets. A varied plate matters more than any one card.</li>
          <li>They describe 100g. Garlic and lemon are rated per 100g but used in small amounts.</li>
          <li>Some inputs are judgement: plant phytonutrient values and versatility traits are set by hand.</li>
          <li>They aren&apos;t medical advice. If you have a condition or take medication, ask a professional.</li>
        </ul>
      </Section>
    </article>
  )
}
