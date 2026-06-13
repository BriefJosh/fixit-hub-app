# Fix-It Hub Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Fix-It Hub React app's foundation: a Vite + React + TypeScript project configured with the ported Fix-It Hub brand theme (colors, fonts, shadows), a React Router shell with stub pages for all three Phase 1 routes, and a fully unit-tested mock data layer (technicians, appliances, bookings, appliance specs) that later plans build on directly.

**Architecture:** A standard Vite SPA living in `app/` (already its own git repo, currently containing only `docs/`). Tailwind CSS is configured with the `brand`/`mint`/`sun` color tokens, `sans`/`poster` fonts, and `soft`/`card` shadows ported verbatim from `mockups/mockup-d-blend-landing.html`. React Router provides client-side routing across `/` (Landing), `/dashboard` (Dashboard), and `/ai-diagnose` (AI Diagnose) — each currently a placeholder page. The data layer has two parts: static mock records (`src/data/technicians.ts`, `src/data/appliances.ts`, `src/data/bookings.ts`) and a `src/lib/` module of pure, Vitest-covered helpers (`lookupApplianceSpec`, `matchTechnicians`) that read from a shared `data/applianceSpecs.json` dataset. The dev proxy (`/api` → `http://localhost:3001`) and Vitest are wired into `vite.config.ts` so later plans can add the Express backend and component tests without touching project config again.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS 3.4, React Router 7, lucide-react, Vitest 4.

**Plan sequence:** This is **Plan 1 of 6** for Fix-It Hub Phase 1 (per `docs/superpowers/specs/2026-06-14-fixit-hub-web-design.md`): Foundation → Landing → Live Section → Dashboard → AI Diagnose Backend → AI Diagnose Frontend. Each subsequent plan assumes this one is complete.

---

## Task 1: Scaffold the Vite + React + TypeScript project

**Files:**
- Create (via `npm create vite`, then moved into place): `app/package.json`, `app/index.html`, `app/vite.config.ts`, `app/tsconfig.json`, `app/tsconfig.app.json`, `app/tsconfig.node.json`, `app/eslint.config.js`, `app/.gitignore`, `app/README.md`, `app/src/main.tsx`, `app/src/App.tsx`, `app/src/App.css`, `app/src/index.css`, `app/src/assets/*`, `app/public/favicon.svg`, `app/public/icons.svg`

`app/` already contains `docs/` and `.git/` (it has one commit with the design spec). `npm create vite` refuses to scaffold into a non-empty directory without `--overwrite`, and `--overwrite` **deletes existing files including `docs/`** — so scaffold into a throwaway sibling directory first, then move the generated files into `app/`.

- [ ] **Step 1: Scaffold into a sibling temp directory**

Run from the Technopreneur project root (one level above `app/`):

```bash
npm create vite@latest fixit-hub-scaffold -- --template react-ts
```

Expected output ends with:

```
Scaffolding project in .../fixit-hub-scaffold...

Done. Now run:

  npm install
  npm run dev
```

- [ ] **Step 2: Move the generated files into `app/`**

```bash
mv fixit-hub-scaffold/.gitignore app/.gitignore
mv fixit-hub-scaffold/eslint.config.js app/eslint.config.js
mv fixit-hub-scaffold/index.html app/index.html
mv fixit-hub-scaffold/package.json app/package.json
mv fixit-hub-scaffold/public app/public
mv fixit-hub-scaffold/README.md app/README.md
mv fixit-hub-scaffold/src app/src
mv fixit-hub-scaffold/tsconfig.json app/tsconfig.json
mv fixit-hub-scaffold/tsconfig.app.json app/tsconfig.app.json
mv fixit-hub-scaffold/tsconfig.node.json app/tsconfig.node.json
mv fixit-hub-scaffold/vite.config.ts app/vite.config.ts
rmdir fixit-hub-scaffold
```

Verify `app/docs/` is untouched: `ls app/docs/superpowers/specs/` should still show `2026-06-14-fixit-hub-web-design.md`.

- [ ] **Step 3: Rename the package**

`npm create vite` set the package name from the temp directory name. Edit `app/package.json`:

```json
  "name": "fixit-hub-scaffold",
```

→

```json
  "name": "fixit-hub-app",
```

- [ ] **Step 4: Install dependencies**

```bash
cd app
npm install
```

Expected output ends with something like `added 152 packages` and `found 0 vulnerabilities`.

- [ ] **Step 5: Verify the default scaffold builds**

```bash
npm run build
```

Expected: ends with `✓ built in ...` and no errors. This confirms the scaffold itself is healthy before we start customizing it.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Vite + React + TypeScript project"
```

---

## Task 2: Configure Tailwind CSS with the Fix-It Hub brand theme

**Files:**
- Create: `app/tailwind.config.ts`, `app/postcss.config.js`
- Modify: `app/src/index.css`, `app/index.html`

- [ ] **Step 1: Install Tailwind and its PostCSS dependencies**

```bash
npm install -D tailwindcss@^3 postcss autoprefixer
```

- [ ] **Step 2: Create `app/tailwind.config.ts`**

These color/font/shadow values are ported verbatim from `mockups/mockup-d-blend-landing.html`'s inline `tailwind.config`.

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        poster: ['Anton', 'sans-serif'],
      },
      colors: {
        brand: { DEFAULT: '#15B877', 600: '#0FA869', 700: '#0E8C58', ink: '#0A1A13' },
        mint: { 50: '#F1FBF6', 100: '#E3F7EC', 200: '#CDEFDC', 300: '#86E0B8' },
        sun: { DEFAULT: '#FFD21E', 600: '#F5B100' },
      },
      boxShadow: {
        soft: '0 16px 50px -16px rgba(10,26,19,0.22)',
        card: '0 4px 24px -10px rgba(10,26,19,0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 3: Create `app/postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Replace `app/src/index.css`**

Replace the entire file contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Add brand fonts and title to `app/index.html`**

Edit `app/index.html`. Find:

```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
```

Replace with:

```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <title>Fix-It Hub</title>
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: succeeds. The "No utility classes were detected" warning is expected at this point — `App.tsx` hasn't been touched yet (that's Task 3).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Configure Tailwind CSS with Fix-It Hub brand theme"
```

---

## Task 3: Add React Router shell with stub pages

**Files:**
- Create: `app/src/pages/Landing.tsx`, `app/src/pages/Dashboard.tsx`, `app/src/pages/AIDiagnose.tsx`
- Modify: `app/src/App.tsx`
- Delete: `app/src/App.css`, `app/src/assets/` (and its contents), `app/public/icons.svg`

- [ ] **Step 1: Install React Router and lucide-react**

```bash
npm install react-router-dom lucide-react
```

- [ ] **Step 2: Remove unused scaffold assets**

```bash
rm -rf src/App.css src/assets public/icons.svg
```

- [ ] **Step 3: Create `app/src/pages/Landing.tsx`**

```tsx
import { Wrench } from 'lucide-react'

function Landing() {
  return (
    <main className="min-h-screen bg-mint-50 flex items-center justify-center font-sans text-brand-ink">
      <div className="text-center px-6">
        <Wrench className="w-10 h-10 text-brand mx-auto" />
        <h1 className="font-poster text-5xl sm:text-6xl tracking-wide mt-4">FIX-IT HUB</h1>
        <p className="mt-3 text-brand-ink/60">Landing page — built in a later plan.</p>
      </div>
    </main>
  )
}

export default Landing
```

- [ ] **Step 4: Create `app/src/pages/Dashboard.tsx`**

```tsx
import { LayoutDashboard } from 'lucide-react'

function Dashboard() {
  return (
    <main className="min-h-screen bg-mint-50 flex items-center justify-center font-sans text-brand-ink">
      <div className="text-center px-6">
        <LayoutDashboard className="w-10 h-10 text-brand mx-auto" />
        <h1 className="font-poster text-5xl sm:text-6xl tracking-wide mt-4">DASHBOARD</h1>
        <p className="mt-3 text-brand-ink/60">Dashboard — built in a later plan.</p>
      </div>
    </main>
  )
}

export default Dashboard
```

- [ ] **Step 5: Create `app/src/pages/AIDiagnose.tsx`**

```tsx
import { ScanSearch } from 'lucide-react'

function AIDiagnose() {
  return (
    <main className="min-h-screen bg-mint-50 flex items-center justify-center font-sans text-brand-ink">
      <div className="text-center px-6">
        <ScanSearch className="w-10 h-10 text-brand mx-auto" />
        <h1 className="font-poster text-5xl sm:text-6xl tracking-wide mt-4">AI DIAGNOSE</h1>
        <p className="mt-3 text-brand-ink/60">AI Diagnose flow — built in a later plan.</p>
      </div>
    </main>
  )
}

export default AIDiagnose
```

- [ ] **Step 6: Replace `app/src/App.tsx`**

Replace the entire file contents with:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AIDiagnose from './pages/AIDiagnose'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-diagnose" element={<AIDiagnose />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

`src/main.tsx` is untouched — it already imports `./App.tsx` and `./index.css` by default.

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: succeeds with no errors and no "no utility classes" warning this time (the stub pages use Tailwind classes).

- [ ] **Step 8: Verify the dev server serves the app**

```bash
npm run dev &
sleep 2
curl -s http://localhost:5173/ | grep -o '<div id="root"></div>'
kill %1
```

Expected: prints `<div id="root"></div>` (confirms the dev server is up and serving `index.html`; the three routes render client-side via React Router).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add React Router shell with stub pages for all three routes"
```

---

## Task 4: Configure the dev API proxy and Vitest

**Files:**
- Modify: `app/vite.config.ts`, `app/package.json`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Replace `app/vite.config.ts`**

Replace the entire file contents with:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
})
```

This proxies `/api/*` to the Express server that a later plan (AI Diagnose Backend) will add on port 3001. The `test` block configures Vitest to run in this same config file.

- [ ] **Step 3: Add a `test` script to `app/package.json`**

Find:

```json
    "lint": "eslint .",
    "preview": "vite preview"
```

Replace with:

```json
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run"
```

- [ ] **Step 4: Verify build still passes**

```bash
npm run build
```

Expected: succeeds (the `test` block in `vite.config.ts` is type-checked by `tsconfig.node.json`, which already includes `vite.config.ts`).

- [ ] **Step 5: Verify Vitest runs (with zero tests so far)**

```bash
npm run test
```

Expected output includes `No test files found` — this is expected; Task 7 and Task 8 add the first tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Configure dev API proxy and Vitest"
```

---

## Task 5: Mock data — technicians

**Files:**
- Create: `app/src/data/technicians.ts`

- [ ] **Step 1: Create `app/src/data/technicians.ts`**

Names, ratings, specialties, and badges are ported from `mockups/mockup-c-dashboard.html`'s "Top-rated technicians" section, extended with two additional technicians (Television, Oven/Water Heater) so every Phase 1 service category has at least one specialist for `matchTechnicians` (Task 8) to match against.

```ts
export interface Technician {
  id: string
  name: string
  avatarSeed: string
  avatarColor: string
  rating: number
  reviewCount: number
  specialties: string[]
  area: string
  verified: boolean
  completedJobs: number
  yearsExperience: number
  badges: string[]
  priceFrom: string
}

export const technicians: Technician[] = [
  {
    id: 'agus-wibowo',
    name: 'Agus Wibowo',
    avatarSeed: 'AW',
    avatarColor: 'bg-brand',
    rating: 4.9,
    reviewCount: 128,
    specialties: ['AC & HVAC', 'Daikin'],
    area: 'Gubeng, Surabaya',
    verified: true,
    completedJobs: 156,
    yearsExperience: 8,
    badges: ['Daikin Certified', 'Top Rated'],
    priceFrom: 'Rp 150.000',
  },
  {
    id: 'sari-rahma',
    name: 'Sari Rahma',
    avatarSeed: 'SR',
    avatarColor: 'bg-blue-500',
    rating: 4.8,
    reviewCount: 96,
    specialties: ['Refrigerator', 'Samsung'],
    area: 'Wonokromo, Surabaya',
    verified: true,
    completedJobs: 110,
    yearsExperience: 6,
    badges: ['Samsung Partner', 'Fast reply'],
    priceFrom: 'Rp 120.000',
  },
  {
    id: 'dimas-lesmana',
    name: 'Dimas Lesmana',
    avatarSeed: 'DL',
    avatarColor: 'bg-purple-500',
    rating: 4.9,
    reviewCount: 142,
    specialties: ['Washing Machine', 'LG'],
    area: 'Tegalsari, Surabaya',
    verified: true,
    completedJobs: 165,
    yearsExperience: 5,
    badges: ['LG Certified', 'Top Rated'],
    priceFrom: 'Rp 130.000',
  },
  {
    id: 'putri-anjani',
    name: 'Putri Anjani',
    avatarSeed: 'PA',
    avatarColor: 'bg-amber-500',
    rating: 4.7,
    reviewCount: 64,
    specialties: ['Television', 'LG', 'Samsung'],
    area: 'Sukolilo, Surabaya',
    verified: true,
    completedJobs: 80,
    yearsExperience: 4,
    badges: ['Electronics Specialist', 'Fast reply'],
    priceFrom: 'Rp 100.000',
  },
  {
    id: 'rendra-saputra',
    name: 'Rendra Saputra',
    avatarSeed: 'RS',
    avatarColor: 'bg-cyan-500',
    rating: 4.8,
    reviewCount: 110,
    specialties: ['Water Heater', 'Oven', 'Ariston', 'Modena'],
    area: 'Rungkut, Surabaya',
    verified: true,
    completedJobs: 135,
    yearsExperience: 7,
    badges: ['Multi-brand Certified', 'Top Rated'],
    priceFrom: 'Rp 140.000',
  },
]
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: succeeds (the file isn't imported anywhere yet, but `tsc -b` still type-checks all files under `src/`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add mock technicians data"
```

---

## Task 6: Mock data — appliances and bookings

**Files:**
- Create: `app/src/data/appliances.ts`, `app/src/data/bookings.ts`

- [ ] **Step 1: Create `app/src/data/appliances.ts`**

Ported from the "My appliances" section of `mockups/mockup-c-dashboard.html` (AC Daikin 78%, Fridge Samsung 91%, Washer LG 55% overdue), with invented model numbers and service dates filled in for fields the mockup didn't show.

```ts
export interface Appliance {
  id: string
  name: string
  brand: string
  model: string
  category: string
  healthPercent: number
  status: 'Excellent' | 'Good' | 'Needs attention'
  lastService: string
  nextServiceDue: string
}

export const appliances: Appliance[] = [
  {
    id: 'ac-daikin-1',
    name: 'AC Daikin 1PK',
    brand: 'Daikin',
    model: 'FTV25AXV14',
    category: 'AC & HVAC',
    healthPercent: 78,
    status: 'Good',
    lastService: 'Mar 2026',
    nextServiceDue: 'Sep 2026',
  },
  {
    id: 'fridge-samsung-1',
    name: 'Fridge Samsung 2P',
    brand: 'Samsung',
    model: 'RT29K5034S8',
    category: 'Refrigerator',
    healthPercent: 91,
    status: 'Excellent',
    lastService: 'Jan 2026',
    nextServiceDue: 'Jan 2027',
  },
  {
    id: 'washer-lg-1',
    name: 'Washer LG',
    brand: 'LG',
    model: 'T2108VSAM',
    category: 'Washing Machine',
    healthPercent: 55,
    status: 'Needs attention',
    lastService: 'Aug 2025',
    nextServiceDue: 'Feb 2026 (overdue)',
  },
]
```

- [ ] **Step 2: Create `app/src/data/bookings.ts`**

Ported from the "Upcoming" booking card in `mockups/mockup-c-dashboard.html` (Agus Wibowo, AC & HVAC Specialist, Mon 5 · 09:00, Rp 165.000).

```ts
export interface Booking {
  id: string
  service: string
  technicianId: string
  technician: string
  date: string
  price: string
  status: 'confirmed' | 'in-progress' | 'completed'
}

export const bookings: Booking[] = [
  {
    id: 'bk-1',
    service: 'AC & HVAC Specialist',
    technicianId: 'agus-wibowo',
    technician: 'Agus Wibowo',
    date: 'Mon, 5 Jun · 09:00',
    price: 'Rp 165.000',
    status: 'confirmed',
  },
]
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add mock appliances and bookings data"
```

---

## Task 7: Appliance specs dataset and `lookupApplianceSpec` (TDD)

**Files:**
- Create: `app/data/applianceSpecs.json`, `app/src/lib/applianceSpecs.ts`
- Test: `app/src/lib/applianceSpecs.test.ts`
- Modify: `app/tsconfig.app.json`

`data/applianceSpecs.json` lives at the `app/` root (sibling to `src/`), per the design spec, so the Express backend (added in a later plan) can read it directly from disk without going through the frontend build.

- [ ] **Step 1: Create `app/data/applianceSpecs.json`**

One "exact" entry per category (brand + model matching the mock appliances/demo data) plus one category-level "typical" entry (empty `brand`/`model`, `isTypical: true`) for every one of the six Phase 1 categories.

```json
[
  {
    "category": "AC & HVAC",
    "brand": "Daikin",
    "model": "FTV25AXV14",
    "weightKg": 8.5,
    "capacity": "9,000 BTU/h (1 PK)",
    "powerW": 720,
    "dimensions": "770 x 195 x 295 mm (indoor unit)",
    "isTypical": false
  },
  {
    "category": "AC & HVAC",
    "brand": "",
    "model": "",
    "weightKg": 9,
    "capacity": "9,000 BTU/h (1 PK)",
    "powerW": 750,
    "dimensions": "800 x 200 x 300 mm (indoor unit)",
    "isTypical": true
  },
  {
    "category": "Refrigerator",
    "brand": "Samsung",
    "model": "RT29K5034S8",
    "weightKg": 58,
    "capacity": "293 L",
    "powerW": 100,
    "dimensions": "550 x 660 x 1780 mm",
    "isTypical": false
  },
  {
    "category": "Refrigerator",
    "brand": "",
    "model": "",
    "weightKg": 60,
    "capacity": "300 L",
    "powerW": 120,
    "dimensions": "600 x 650 x 1750 mm",
    "isTypical": true
  },
  {
    "category": "Washing Machine",
    "brand": "LG",
    "model": "T2108VSAM",
    "weightKg": 38,
    "capacity": "8 kg",
    "powerW": 350,
    "dimensions": "600 x 900 x 600 mm",
    "isTypical": false
  },
  {
    "category": "Washing Machine",
    "brand": "",
    "model": "",
    "weightKg": 40,
    "capacity": "8 kg",
    "powerW": 380,
    "dimensions": "600 x 900 x 600 mm",
    "isTypical": true
  },
  {
    "category": "Television",
    "brand": "Samsung",
    "model": "UA32T4003",
    "weightKg": 4.3,
    "capacity": "32 in",
    "powerW": 45,
    "dimensions": "726 x 421 x 81 mm",
    "isTypical": false
  },
  {
    "category": "Television",
    "brand": "",
    "model": "",
    "weightKg": 5,
    "capacity": "32 in",
    "powerW": 60,
    "dimensions": "730 x 430 x 85 mm",
    "isTypical": true
  },
  {
    "category": "Oven",
    "brand": "Sharp",
    "model": "R-222Y(S)",
    "weightKg": 8,
    "capacity": "20 L",
    "powerW": 800,
    "dimensions": "452 x 262 x 328 mm",
    "isTypical": false
  },
  {
    "category": "Oven",
    "brand": "",
    "model": "",
    "weightKg": 9,
    "capacity": "23 L",
    "powerW": 850,
    "dimensions": "460 x 270 x 340 mm",
    "isTypical": true
  },
  {
    "category": "Water Heater",
    "brand": "Ariston",
    "model": "Andris RS 15",
    "weightKg": 14,
    "capacity": "15 L",
    "powerW": 1200,
    "dimensions": "365 x 365 x 375 mm",
    "isTypical": false
  },
  {
    "category": "Water Heater",
    "brand": "",
    "model": "",
    "weightKg": 15,
    "capacity": "15 L",
    "powerW": 1200,
    "dimensions": "370 x 370 x 380 mm",
    "isTypical": true
  }
]
```

- [ ] **Step 2: Enable JSON imports in `app/tsconfig.app.json`**

Find:

```json
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```

Replace with:

```json
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
```

Then find:

```json
  "include": ["src"]
```

Replace with:

```json
  "include": ["src", "data"]
```

- [ ] **Step 3: Write the failing test — `app/src/lib/applianceSpecs.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { lookupApplianceSpec } from './applianceSpecs'

describe('lookupApplianceSpec', () => {
  it('returns an exact match when category, brand, and model all match', () => {
    const result = lookupApplianceSpec('AC & HVAC', 'Daikin', 'FTV25AXV14')
    expect(result?.specsSource).toBe('exact')
    expect(result?.spec.brand).toBe('Daikin')
    expect(result?.spec.weightKg).toBe(8.5)
  })

  it('falls back to category-typical when the model is unrecognized', () => {
    const result = lookupApplianceSpec('AC & HVAC', 'Daikin', 'UnknownModel123')
    expect(result?.specsSource).toBe('category-typical')
    expect(result?.spec.isTypical).toBe(true)
    expect(result?.spec.category).toBe('AC & HVAC')
  })

  it('falls back to category-typical when brand and model are omitted', () => {
    const result = lookupApplianceSpec('Refrigerator')
    expect(result?.specsSource).toBe('category-typical')
    expect(result?.spec.category).toBe('Refrigerator')
  })

  it('matches categories case-insensitively', () => {
    const result = lookupApplianceSpec('refrigerator')
    expect(result?.spec.category).toBe('Refrigerator')
  })

  it('returns null for a category with no data at all', () => {
    const result = lookupApplianceSpec('Dishwasher')
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 4: Run the test and verify it fails**

```bash
npm run test
```

Expected: FAIL — `Cannot find module './applianceSpecs'` (or similar resolution error), since `app/src/lib/applianceSpecs.ts` doesn't exist yet.

- [ ] **Step 5: Implement `app/src/lib/applianceSpecs.ts`**

```ts
import specs from '../../data/applianceSpecs.json'

export interface ApplianceSpec {
  category: string
  brand: string
  model: string
  weightKg: number
  capacity: string
  powerW: number
  dimensions: string
  isTypical: boolean
}

export interface SpecLookupResult {
  spec: ApplianceSpec
  specsSource: 'exact' | 'category-typical'
}

const allSpecs = specs as ApplianceSpec[]

export function lookupApplianceSpec(
  category: string,
  brand?: string,
  model?: string
): SpecLookupResult | null {
  const categoryLower = category.toLowerCase()

  if (brand && model) {
    const exact = allSpecs.find(
      (s) =>
        !s.isTypical &&
        s.category.toLowerCase() === categoryLower &&
        s.brand.toLowerCase() === brand.toLowerCase() &&
        s.model.toLowerCase() === model.toLowerCase()
    )
    if (exact) return { spec: exact, specsSource: 'exact' }
  }

  const typical = allSpecs.find((s) => s.isTypical && s.category.toLowerCase() === categoryLower)
  if (typical) return { spec: typical, specsSource: 'category-typical' }

  return null
}
```

- [ ] **Step 6: Run the test and verify it passes**

```bash
npm run test
```

Expected: PASS — 5 tests pass.

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: succeeds (confirms `resolveJsonModule` and the `data` include path are correctly configured for `tsc -b`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add appliance specs dataset and lookupApplianceSpec helper"
```

---

## Task 8: `matchTechnicians` helper (TDD)

**Files:**
- Create: `app/src/lib/technicianMatch.ts`
- Test: `app/src/lib/technicianMatch.test.ts`

- [ ] **Step 1: Write the failing test — `app/src/lib/technicianMatch.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { matchTechnicians } from './technicianMatch'
import type { Technician } from '../data/technicians'

const baseTech = (overrides: Partial<Technician>): Technician => ({
  id: 'id',
  name: 'name',
  avatarSeed: 'XX',
  avatarColor: 'bg-brand',
  rating: 4.5,
  reviewCount: 10,
  specialties: [],
  area: 'Surabaya',
  verified: true,
  completedJobs: 10,
  yearsExperience: 1,
  badges: [],
  priceFrom: 'Rp 100.000',
  ...overrides,
})

const techs: Technician[] = [
  baseTech({ id: 't1', specialties: ['AC & HVAC', 'Daikin'], rating: 4.9 }),
  baseTech({ id: 't2', specialties: ['Refrigerator', 'Samsung'], rating: 4.8 }),
  baseTech({ id: 't3', specialties: ['Washing Machine', 'LG'], rating: 4.9 }),
]

describe('matchTechnicians', () => {
  it('ranks a technician matching both category and brand first', () => {
    const result = matchTechnicians('AC & HVAC', 'Daikin', techs, 3)
    expect(result[0].id).toBe('t1')
  })

  it('ranks a category-only match above unrelated technicians', () => {
    const result = matchTechnicians('Refrigerator', 'LG', techs, 3)
    expect(result[0].id).toBe('t2')
  })

  it('respects the limit', () => {
    const result = matchTechnicians('AC & HVAC', 'Daikin', techs, 2)
    expect(result).toHaveLength(2)
  })

  it('fills remaining slots with top-rated technicians when fewer than limit match', () => {
    const result = matchTechnicians('Television', 'Sony', techs, 3)
    expect(result.map((t) => t.id)).toEqual(['t1', 't3', 't2'])
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
npm run test
```

Expected: FAIL — `Cannot find module './technicianMatch'` (or similar), since `app/src/lib/technicianMatch.ts` doesn't exist yet.

- [ ] **Step 3: Implement `app/src/lib/technicianMatch.ts`**

```ts
import type { Technician } from '../data/technicians'

export function matchTechnicians(
  category: string,
  brand: string | undefined,
  technicians: Technician[],
  limit = 3
): Technician[] {
  const categoryLower = category.toLowerCase()
  const brandLower = brand?.toLowerCase()

  const scored = technicians.map((tech) => {
    const specialtiesLower = tech.specialties.map((s) => s.toLowerCase())
    let score = 0
    if (specialtiesLower.includes(categoryLower)) score += 2
    if (brandLower && specialtiesLower.includes(brandLower)) score += 1
    return { tech, score }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.tech.rating - a.tech.rating
  })

  return scored.slice(0, limit).map((entry) => entry.tech)
}
```

- [ ] **Step 4: Run the test and verify it passes**

```bash
npm run test
```

Expected: PASS — all 9 tests pass (5 from Task 7 + 4 from this task).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add matchTechnicians helper"
```

---

## Task 9: Environment template, gitignore, and final verification

**Files:**
- Create: `app/.env.example`
- Modify: `app/.gitignore`

- [ ] **Step 1: Create `app/.env.example`**

```
# Optional: enables live AI vision calls for POST /api/diagnose.
# Leave unset to run the AI Diagnose flow in demo mode.
ANTHROPIC_API_KEY=

# Optional: enables the branded Mapbox map for the "Fix-It Hub Live" section.
# Leave unset to use the Leaflet + CARTO dark-tile fallback.
VITE_MAPBOX_TOKEN=
```

- [ ] **Step 2: Add `.env` to `app/.gitignore`**

Append to the end of `app/.gitignore`:

```

# Environment variables
.env
.env.local
```

(`.env.example` is intentionally not matched by these patterns and stays tracked.)

- [ ] **Step 3: Full verification pass**

```bash
npm run build
```

Expected: succeeds.

```bash
npm run test
```

Expected: all 9 tests pass.

```bash
npm run dev &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/dashboard
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/ai-diagnose
kill %1
```

Expected: `200` for all three routes (Vite's dev server falls back to `index.html` for client-side routes; React Router renders the matching stub page in the browser).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add env template and finish Phase 1 foundation"
```

---

## Self-Review Notes

- **Spec coverage**: This plan covers the "Tech stack" section's scaffold (Vite/React/TS/Tailwind/Router/lucide-react/Vitest), the dev proxy config, and the "Data layer" section in full (`technicians.ts`, `appliances.ts`, `bookings.ts`, `applianceSpecs.json` + `lookupApplianceSpec`). It deliberately does NOT cover: Landing/Dashboard/AI Diagnose page content, the Live section, Mapbox/Leaflet, p5.js, or the Express backend — those are Plans 2–6.
- **Field-shape deviation from spec**: the spec's illustrative `applianceSpecs.json` shape uses `capacityBTUorLiters` (implying a number). This plan uses `capacity: string` instead (e.g. `"9,000 BTU/h (1 PK)"`, `"293 L"`, `"8 kg"`, `"32 in"`), since a single numeric field can't represent BTU, liters, kg, and inches consistently across categories. The spec explicitly allows field shapes to be "finalized during implementation."
- **`matchTechnicians` fallback behavior**: with only 5 technicians and mostly 1 specialist per category, returning only score>0 matches would often yield fewer than 3 results — but the AI Diagnose result step (Plan 6) needs exactly 3 cards. The implemented stable-sort-by-score-then-rating approach naturally backfills with top-rated technicians, satisfying this without extra branching.
