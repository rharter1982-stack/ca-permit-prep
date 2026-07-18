# CA Permit Prep

A standalone study guide and realistic practice-test app for the **California DMV learner's permit** (instruction permit). Pick your age bracket — Under 15½, 15½–17½, 17½–18, or 18+ — and the rules, roadmap, checklist, and even the exam format adjust to match.

**Live app:** https://rharter1982-stack.github.io/ca-permit-prep/

## Features

- **Home** — age selector plus one-tap navigation cards to every section
- **Rules & Requirements** — age-tailored step-by-step roadmap, key numbers, and DMV appointment checklist (including the little-known 17½ rule that waives Driver Ed for the permit)
- **Study Guide** — 14 topics of handbook-accurate facts (signs, right-of-way, speed limits, parking, railroad crossings, school buses, DUI/zero-tolerance, provisional restrictions, testing process)
- **Sign Recognition** — flashcards and a quiz built from SVG shapes/colors (no copyrighted sign images)
- **Practice Exam** — mirrors the real DMV knowledge test for your age bracket: 46 questions / 38 to pass for minors, 36 questions / 30 to pass for adults; one question at a time, immediate right/wrong feedback, no going back, full missed-question review at the end
- **Quick Quiz** — pick a topic and length, relaxed practice with instant explanations
- **Progress** — attempt history and per-topic accuracy, stored only in your browser's `localStorage`

## Running locally

No build step, no dependencies — it's plain HTML/CSS/JS:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Deployment

Pushes to `main` deploy automatically to GitHub Pages via `.github/workflows/pages.yml`.

## Disclaimer

Educational tool only — not affiliated with or endorsed by the California DMV. Content is adapted from the California Driver Handbook and DMV Fast Facts publications. Always confirm current rules, fees, and appointment requirements at [dmv.ca.gov](https://www.dmv.ca.gov/) before your visit.
