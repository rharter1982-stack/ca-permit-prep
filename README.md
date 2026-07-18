# CA Permit Prep

A standalone study guide and realistic practice-test app for the **California DMV learner's permit** (instruction permit), tuned for applicants who are **17½ or older** — the age where the DMV lets you get a permit without Driver Education/Training certificates.

**Live app:** https://rharter1982-stack.github.io/ca-permit-prep/

## Features

- **Home / Roadmap** — step-by-step path from MyDMV account to provisional license, with the 17½-rule explained, key numbers, and a DMV appointment checklist
- **Study Guide** — 14 topics of handbook-accurate facts (signs, right-of-way, speed limits, parking, railroad crossings, school buses, DUI/zero-tolerance, provisional restrictions, testing process)
- **Sign Recognition** — flashcards and a quiz built from SVG shapes/colors (no copyrighted sign images)
- **Practice Exam** — mirrors the real 46-question minor's knowledge test: 38/46 to pass, one question at a time, immediate right/wrong feedback, no going back, full missed-question review at the end
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
