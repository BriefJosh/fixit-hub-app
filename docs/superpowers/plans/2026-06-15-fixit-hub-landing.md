# Fix-It Hub Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public Landing page (`/`) as a set of section components that reproduce `mockups/mockup-d-blend-landing.html` section-for-section (excluding the "Fix-It Hub Live" section, which is Plan 3), wired to the React Router destinations specified in the design spec.

**Architecture:** Each visual section of the mockup becomes its own component under `src/components/layout/` (NavBar, Footer — shared across pages) or `src/components/landing/` (Hero, Ticker, ServicesGrid, TrustBand, HowItWorks, MaintenanceLog, CTA — landing-page-only). `src/data/categories.ts` becomes the shared source of the 6 Phase-1 service categories (icon, color, description, price), consumed by both ServicesGrid and MaintenanceLog. `Landing.tsx` composes all sections in mockup order, with a gap left between ServicesGrid and TrustBand where Plan 3 will insert the Live section. Global CSS effects from the mockup's `<style>` block (wave clip-path, highlight, ticker animation, grain texture, smooth scroll) are ported into `src/index.css` incrementally, one task at a time, alongside the component that needs them.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS (CDN-equivalent config already in `tailwind.config.js` from Plan 1), React Router (`react-router-dom`), lucide-react icons, Vitest + React Testing Library (jsdom).

**Plan sequence:** This is Plan 2 of 6 (Foundation → **Landing** → Live Section → Dashboard → AI Diagnose Backend → AI Diagnose Frontend). Plan 1 (Foundation) is complete and merged to `master`. The "Fix-It Hub Live" section (map, activity feed, counters — `#live` in the mockup, sitting between the services grid and the trust band) is explicitly **out of scope** for this plan; Plan 3 will insert a `<LiveSection />` component into `Landing.tsx` between `<ServicesGrid />` and `<TrustBand />`.

**Canonical category vocabulary** (from Plan 1's Post-Implementation Note — `docs/superpowers/plans/2026-06-14-fixit-hub-foundation.md`): `AC & HVAC`, `Refrigerator`, `Washing Machine`, `Television`, `Oven`, `Water Heater`. `src/data/categories.ts` (Task 2) uses these exact 6 strings, in this exact order, as the `name` field — this keeps the data file directly reusable by Plan 4 (Dashboard) and Plan 6 (AI Diagnose) without any alias mapping.

---

### Task 1: Component testing infrastructure (jsdom + Testing Library)

**Files:**
- Modify: `app/package.json`, `app/package-lock.json`
- Modify: `app/vite.config.ts`
- Create: `app/src/test/setup.ts`

This plan is the first to test React components. Plan 1's `vite.config.ts` set `test.environment: 'node'`, which works for the pure-function tests in `src/lib/` and `src/data/`, but `@testing-library/react` requires a DOM (`jsdom`). This task adds the testing-library packages, switches the test environment to `jsdom`, and adds a setup file for `jest-dom` matchers — without changing any application code.

- [ ] **Step 1: Install testing-library dependencies**

Run:
```bash
cd app
npm install -D jsdom @testing-library/react @testing-library/jest-dom
```
Expected: `package.json` and `package-lock.json` gain `jsdom`, `@testing-library/react`, and `@testing-library/jest-dom` (plus transitive deps) under `devDependencies`.

- [ ] **Step 2: Create the Testing Library setup file**

Create `app/src/test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Switch the test environment to jsdom and register the setup file**

Replace `app/vite.config.ts` with:
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
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 4: Verify Plan 1's existing tests still pass under jsdom**

Run: `npm run test`
Expected: `Test Files  2 passed (2)` and `Tests  9 passed (9)` — same counts as Plan 1, now running under `jsdom` instead of `node`.

- [ ] **Step 5: Verify the production build still succeeds**

Run: `npm run build`
Expected: builds successfully with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add component testing infrastructure (jsdom + Testing Library)"
```

---

### Task 2: Shared service category data

**Files:**
- Create: `app/src/data/categories.ts`
- Create: `app/src/data/categories.test.ts`

The Services grid (Task 6) and the Maintenance Log (Task 8) both need icon/color/description/price metadata per appliance category. This task creates that shared data file using the canonical category vocabulary so later plans (Dashboard quick-grid, AI Diagnose category lookups) can reuse it directly.

- [ ] **Step 1: Write the failing test**

Create `app/src/data/categories.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { categories } from './categories'

describe('categories', () => {
  it('lists the 6 Phase 1 categories in the canonical order', () => {
    expect(categories.map((category) => category.name)).toEqual([
      'AC & HVAC',
      'Refrigerator',
      'Washing Machine',
      'Television',
      'Oven',
      'Water Heater',
    ])
  })

  it('gives every category an icon, color, description, and starting price', () => {
    for (const category of categories) {
      expect(category.icon).toBeTruthy()
      expect(category.iconColor).toMatch(/^text-/)
      expect(category.description.length).toBeGreaterThan(0)
      expect(category.priceFrom).toMatch(/^Rp \d+k$/)
    }
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- src/data/categories.test.ts`
Expected: FAIL — Vitest cannot resolve the module `./categories` because `src/data/categories.ts` does not exist yet.

- [ ] **Step 3: Implement the category data**

Create `app/src/data/categories.ts`:
```ts
import type { LucideIcon } from 'lucide-react'
import { Droplets, Microwave, Refrigerator, Tv, WashingMachine, Wind } from 'lucide-react'

export interface ServiceCategory {
  name: string
  icon: LucideIcon
  iconColor: string
  description: string
  priceFrom: string
}

export const categories: ServiceCategory[] = [
  {
    name: 'AC & HVAC',
    icon: Wind,
    iconColor: 'text-brand',
    description: 'Cleaning, refrigerant, install',
    priceFrom: 'Rp 150k',
  },
  {
    name: 'Refrigerator',
    icon: Refrigerator,
    iconColor: 'text-blue-500',
    description: 'Cooling, compressor, seals',
    priceFrom: 'Rp 120k',
  },
  {
    name: 'Washing Machine',
    icon: WashingMachine,
    iconColor: 'text-purple-500',
    description: 'Drainage, drum, motor',
    priceFrom: 'Rp 130k',
  },
  {
    name: 'Television',
    icon: Tv,
    iconColor: 'text-amber-500',
    description: 'Panel, power, backlight',
    priceFrom: 'Rp 100k',
  },
  {
    name: 'Oven',
    icon: Microwave,
    iconColor: 'text-red-400',
    description: 'Heating, wiring, control',
    priceFrom: 'Rp 110k',
  },
  {
    name: 'Water Heater',
    icon: Droplets,
    iconColor: 'text-sun',
    description: 'Element, thermostat, leaks',
    priceFrom: 'Rp 140k',
  },
]
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm run test -- src/data/categories.test.ts`
Expected: `Test Files  1 passed (1)`, `Tests  2 passed (2)`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add shared service category data"
```

---

### Task 3: Layout components — NavBar and Footer

**Files:**
- Create: `app/src/components/layout/NavBar.tsx`
- Create: `app/src/components/layout/NavBar.test.tsx`
- Create: `app/src/components/layout/Footer.tsx`
- Create: `app/src/components/layout/Footer.test.tsx`
- Modify: `app/src/index.css`

NavBar reproduces the mockup's sticky header. Per the design spec's routing rules: "Services" → `#services`, "How it works" → `#how`, "AI Diagnostics" → `/ai-diagnose` (a real route, via `Link`), "Trust" → `#trust`, and both "Log in" and "Sign up" → `/dashboard`. Footer reproduces the mockup's dark footer with no functional links (matches mockup, which uses plain text/`#` placeholders for these columns).

- [ ] **Step 1: Write the failing NavBar test**

Create `app/src/components/layout/NavBar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NavBar from './NavBar'

describe('NavBar', () => {
  it('renders the Fix-It Hub brand', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByText('Fix-It Hub')).toBeInTheDocument()
  })

  it('routes "AI Diagnostics" to /ai-diagnose', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'AI Diagnostics' })).toHaveAttribute('href', '/ai-diagnose')
  })

  it('routes "Log in" and "Sign up" to /dashboard', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/dashboard')
  })

  it('links "Services", "How it works", and "Trust" to in-page anchors', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '#services')
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how')
    expect(screen.getByRole('link', { name: 'Trust' })).toHaveAttribute('href', '#trust')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- src/components/layout/NavBar.test.tsx`
Expected: FAIL — Vitest cannot resolve the module `./NavBar` because `src/components/layout/NavBar.tsx` does not exist yet.

- [ ] **Step 3: Implement NavBar**

Create `app/src/components/layout/NavBar.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-mint-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-brand grid place-items-center text-white">
            <Wrench className="w-5 h-5" />
          </span>
          <span className="font-extrabold text-lg tracking-tight">Fix-It Hub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-ink/70">
          <a href="#services" className="hover:text-brand-ink">Services</a>
          <a href="#how" className="hover:text-brand-ink">How it works</a>
          <Link to="/ai-diagnose" className="hover:text-brand-ink">AI Diagnostics</Link>
          <a href="#trust" className="hover:text-brand-ink">Trust</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="hidden sm:block text-sm font-semibold text-brand-ink/70 hover:text-brand-ink">
            Log in
          </Link>
          <Link to="/dashboard" className="text-sm font-bold text-white bg-brand hover:bg-brand-600 px-4 py-2 rounded-full shadow-card">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm run test -- src/components/layout/NavBar.test.tsx`
Expected: `Test Files  1 passed (1)`, `Tests  4 passed (4)`.

- [ ] **Step 5: Write the failing Footer test**

Create `app/src/components/layout/Footer.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the brand and tagline', () => {
    render(<Footer />)
    expect(screen.getByText('Fix-It Hub')).toBeInTheDocument()
    expect(screen.getByText(/trusted, AI-powered appliance repair platform/)).toBeInTheDocument()
  })

  it('renders the services and company link columns', () => {
    render(<Footer />)
    expect(screen.getByText('AC & HVAC')).toBeInTheDocument()
    expect(screen.getByText('For Technicians')).toBeInTheDocument()
  })

  it('renders the copyright line', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Fix-It Hub/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test and verify it fails**

Run: `npm run test -- src/components/layout/Footer.test.tsx`
Expected: FAIL — Vitest cannot resolve the module `./Footer` because `src/components/layout/Footer.tsx` does not exist yet.

- [ ] **Step 7: Implement Footer**

Create `app/src/components/layout/Footer.tsx`:
```tsx
import { Wrench } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-8 rounded-lg bg-brand grid place-items-center">
              <Wrench className="w-4 h-4" />
            </span>
            <span className="font-extrabold">Fix-It Hub</span>
          </div>
          <p className="text-white/50">The trusted, AI-powered appliance repair platform in Indonesia.</p>
        </div>
        <div>
          <p className="font-bold mb-3">Services</p>
          <ul className="space-y-2 text-white/55">
            <li>AC & HVAC</li>
            <li>Refrigerator</li>
            <li>Washing Machine</li>
            <li>Television</li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-3">Company</p>
          <ul className="space-y-2 text-white/55">
            <li>About</li>
            <li>For Technicians</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-3">Get the app</p>
          <p className="text-white/55 mb-3">Available on iOS & Android.</p>
          <div className="flex gap-2">
            <span className="px-3 py-2 rounded-lg bg-white/10 text-xs font-semibold">App Store</span>
            <span className="px-3 py-2 rounded-lg bg-white/10 text-xs font-semibold">Google Play</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © 2026 Fix-It Hub · Technopreneur Project
      </div>
    </footer>
  )
}
```

- [ ] **Step 8: Run the test and verify it passes**

Run: `npm run test -- src/components/layout/Footer.test.tsx`
Expected: `Test Files  1 passed (1)`, `Tests  3 passed (3)`.

- [ ] **Step 9: Add smooth in-page scrolling for the nav anchors**

Replace `app/src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 10: Run the full test suite and build**

Run:
```bash
npm run test
npm run build
```
Expected: all tests pass (Plan 1's 9 + this task's 7 = 16), build succeeds.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Add NavBar and Footer layout components"
```

---

### Task 4: Hero section

**Files:**
- Create: `app/src/components/landing/Hero.tsx`
- Create: `app/src/components/landing/Hero.test.tsx`
- Modify: `app/src/index.css`

The Hero reproduces the mockup's green "wave" hero: poster headline with a yellow `.hl` highlight, the decorative booking search bar (its "Find a technician" button routes to `/dashboard` per the design spec's "single consistent enter-the-app destination" rule), and the "AI Diagnostic Engine" widget whose three CTAs ("Upload Photo", "Upload Video", "Match me a technician") all route to `/ai-diagnose` per the design spec.

- [ ] **Step 1: Write the failing test**

Create `app/src/components/landing/Hero.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the poster headline', () => {
    render(<Hero />, { wrapper: MemoryRouter })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Trusted repair/)
  })

  it('routes "Find a technician" to /dashboard', () => {
    render(<Hero />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Find a technician' })).toHaveAttribute('href', '/dashboard')
  })

  it('routes the AI Diagnostic Engine CTAs to /ai-diagnose', () => {
    render(<Hero />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: /Upload Photo/ })).toHaveAttribute('href', '/ai-diagnose')
    expect(screen.getByRole('link', { name: /Upload Video/ })).toHaveAttribute('href', '/ai-diagnose')
    expect(screen.getByRole('link', { name: /Match me a technician/ })).toHaveAttribute('href', '/ai-diagnose')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- src/components/landing/Hero.test.tsx`
Expected: FAIL — Vitest cannot resolve the module `./Hero` because `src/components/landing/Hero.tsx` does not exist yet.

- [ ] **Step 3: Add Hero-specific global styles**

Replace `app/src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

.wave {
  clip-path: ellipse(150% 100% at 50% 0%);
}

.hl {
  background: #ffd21e;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0 0.12em;
}
```

- [ ] **Step 4: Implement Hero**

Create `app/src/components/landing/Hero.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Camera, Clock, MapPin, Search, ShieldCheck, Sparkles, Star, Video } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-brand wave text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 2px, transparent 2px)', backgroundSize: '34px 34px' }}
      />
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-28 grid lg:grid-cols-[1.05fr,0.95fr] gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/15 border border-white/25 rounded-full px-3 py-1.5 mb-5">
            <ShieldCheck className="w-4 h-4 text-sun" /> Verified & certified technicians only
          </span>
          <h1 className="font-poster uppercase leading-[0.9] tracking-tight text-6xl lg:text-7xl">
            Trusted repair.<br />Fix it before<br />it <span className="hl">breaks.</span>
          </h1>
          <p className="mt-6 text-white/85 text-lg max-w-md">
            Book a background-checked technician for your AC, fridge, washer and more — at a fixed price you see before you book.
          </p>

          <div className="mt-7 bg-white rounded-2xl p-2 shadow-soft flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-mint-50">
              <Search className="w-5 h-5 text-brand" />
              <input
                className="bg-transparent w-full text-brand-ink placeholder:text-brand-ink/40 text-sm font-medium outline-none"
                placeholder="What needs fixing? e.g. AC not cooling"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-mint-50 sm:w-36">
              <MapPin className="w-5 h-5 text-brand" />
              <input
                className="bg-transparent w-full text-brand-ink placeholder:text-brand-ink/40 text-sm font-medium outline-none"
                placeholder="Surabaya"
              />
            </div>
            <Link
              to="/dashboard"
              className="bg-brand-ink text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-black whitespace-nowrap inline-flex items-center justify-center"
            >
              Find a technician
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-4 h-4 text-sun fill-sun" /> 4.9 avg rating
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-sun" /> Fixed, upfront pricing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sun" /> Same-day slots
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl shadow-soft p-5 border-4 border-brand-ink text-brand-ink">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold tracking-wider text-brand">⚡ AI DIAGNOSTIC ENGINE</span>
              <span className="text-[11px] font-bold text-brand-ink/40">85% accuracy</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/ai-diagnose"
                className="rounded-2xl border-2 border-dashed border-mint-200 bg-mint-50 py-6 grid place-items-center gap-1.5 hover:border-brand transition"
              >
                <Camera className="w-7 h-7 text-brand" />
                <span className="text-sm font-bold">Upload Photo</span>
              </Link>
              <Link
                to="/ai-diagnose"
                className="rounded-2xl border-2 border-dashed border-mint-200 bg-mint-50 py-6 grid place-items-center gap-1.5 hover:border-brand transition"
              >
                <Video className="w-7 h-7 text-brand" />
                <span className="text-sm font-bold">Upload Video</span>
              </Link>
            </div>
            <div className="mt-3 bg-brand-ink text-white rounded-2xl p-4 text-sm">
              <p className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sun" /> <span className="text-white/70">AI found:</span> <b>AC low on refrigerant</b>
              </p>
              <Link
                to="/ai-diagnose"
                className="mt-3 w-full bg-brand font-bold py-2.5 rounded-xl hover:bg-brand-600 inline-flex items-center justify-center gap-2"
              >
                Match me a technician <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm run test -- src/components/landing/Hero.test.tsx`
Expected: `Test Files  1 passed (1)`, `Tests  3 passed (3)`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Hero section"
```

---

### Task 5: Ticker and How It Works sections

**Files:**
- Create: `app/src/components/landing/Ticker.tsx`
- Create: `app/src/components/landing/Ticker.test.tsx`
- Create: `app/src/components/landing/HowItWorks.tsx`
- Create: `app/src/components/landing/HowItWorks.test.tsx`
- Modify: `app/src/index.css`

Ticker is the scrolling category marquee directly below the hero, using the mockup's `.ticker`/`@keyframes scroll` animation duplicated twice for a seamless loop. HowItWorks is the "Book a fix in three steps" section using the mockup's `.grain` texture and the `.hl` highlight added in Task 4. Neither section has data dependencies or routing, so they're grouped in one task.

- [ ] **Step 1: Write the failing Ticker test**

Create `app/src/components/landing/Ticker.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Ticker from './Ticker'

describe('Ticker', () => {
  it('renders two copies of the scrolling category list for a seamless loop', () => {
    render(<Ticker />)
    expect(screen.getAllByText(/AC & HVAC ✦ Refrigerator ✦ Washing Machine/)).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Write the failing HowItWorks test**

Create `app/src/components/landing/HowItWorks.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HowItWorks from './HowItWorks'

describe('HowItWorks', () => {
  it('renders the heading and all three steps', () => {
    render(<HowItWorks />)
    expect(screen.getByRole('heading', { name: /Book a fix in three steps/ })).toBeInTheDocument()
    expect(screen.getByText('Tell us the problem')).toBeInTheDocument()
    expect(screen.getByText('Pick a technician & slot')).toBeInTheDocument()
    expect(screen.getByText("Relax — it's logged")).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run both tests and verify they fail**

Run:
```bash
npm run test -- src/components/landing/Ticker.test.tsx src/components/landing/HowItWorks.test.tsx
```
Expected: FAIL — Vitest cannot resolve `./Ticker` or `./HowItWorks` because neither file exists yet.

- [ ] **Step 4: Add Ticker and grain-texture global styles**

Replace `app/src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

.wave {
  clip-path: ellipse(150% 100% at 50% 0%);
}

.hl {
  background: #ffd21e;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0 0.12em;
}

.ticker {
  animation: scroll 24s linear infinite;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.grain {
  background-image: radial-gradient(circle at 1px 1px, rgba(10, 26, 19, 0.05) 1px, transparent 0);
  background-size: 20px 20px;
}
```

- [ ] **Step 5: Implement Ticker**

Create `app/src/components/landing/Ticker.tsx`:
```tsx
const TICKER_TEXT =
  'AC & HVAC ✦ Refrigerator ✦ Washing Machine ✦ Television ✦ Oven ✦ Water Heater ✦ Verified Technicians ✦ Fixed Pricing ✦'

export default function Ticker() {
  return (
    <div className="bg-brand-ink text-white overflow-hidden py-3 -rotate-1 -mt-6 relative z-20 shadow-soft">
      <div className="ticker whitespace-nowrap font-poster uppercase text-2xl tracking-wide flex gap-8">
        <span>{TICKER_TEXT}</span>
        <span>{TICKER_TEXT}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Implement HowItWorks**

Create `app/src/components/landing/HowItWorks.tsx`:
```tsx
const STEPS = [
  {
    number: '01',
    title: 'Tell us the problem',
    description: 'Describe the issue or let our AI diagnose it from a photo or video in seconds.',
  },
  {
    number: '02',
    title: 'Pick a technician & slot',
    description: 'Compare verified technicians by rating, price, and availability near you.',
  },
  {
    number: '03',
    title: "Relax — it's logged",
    description: "We track the job, the parts used, and add it to your appliance's maintenance log.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="grain bg-mint-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poster uppercase text-5xl mb-10">
          Book a fix in <span className="hl">three steps.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.number} className="bg-white rounded-3xl p-7 shadow-soft">
              <span className="font-poster text-4xl text-mint-200">{step.number}</span>
              <h3 className="font-extrabold text-xl mt-3">{step.title}</h3>
              <p className="text-sm text-brand-ink/60 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Run both tests and verify they pass**

Run:
```bash
npm run test -- src/components/landing/Ticker.test.tsx src/components/landing/HowItWorks.test.tsx
```
Expected: `Test Files  2 passed (2)`, `Tests  2 passed (2)`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add Ticker and How It Works sections"
```

---

### Task 6: Services grid section

**Files:**
- Create: `app/src/components/landing/ServicesGrid.tsx`
- Create: `app/src/components/landing/ServicesGrid.test.tsx`

Reproduces the mockup's 6-card services grid using `src/data/categories.ts` (Task 2). The first 5 categories render via `.map()` with shared card styling; the 6th (Water Heater) is rendered with the mockup's special dark "featured" card styling and the "+ 8 more categories →" badge.

- [ ] **Step 1: Write the failing test**

Create `app/src/components/landing/ServicesGrid.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { categories } from '../../data/categories'
import ServicesGrid from './ServicesGrid'

describe('ServicesGrid', () => {
  it('renders a heading for every category', () => {
    render(<ServicesGrid />)
    for (const category of categories) {
      expect(screen.getByRole('heading', { name: category.name })).toBeInTheDocument()
    }
  })

  it('renders the featured "more categories" badge on the last card', () => {
    render(<ServicesGrid />)
    expect(screen.getByText('+ 8 more categories →')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- src/components/landing/ServicesGrid.test.tsx`
Expected: FAIL — Vitest cannot resolve the module `./ServicesGrid` because `src/components/landing/ServicesGrid.tsx` does not exist yet.

- [ ] **Step 3: Implement ServicesGrid**

Create `app/src/components/landing/ServicesGrid.tsx`:
```tsx
import { ArrowUpRight } from 'lucide-react'
import { categories } from '../../data/categories'

export default function ServicesGrid() {
  const gridCategories = categories.slice(0, 5)
  const featuredCategory = categories[5]
  const FeaturedIcon = featuredCategory.icon

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <h2 className="font-poster uppercase text-5xl">
          Pick your <span className="hl">trouble.</span>
        </h2>
        <p className="text-brand-ink/55 max-w-sm">
          Every category is staffed by background-checked, brand-certified specialists near you.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {gridCategories.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.name}
              className="group relative rounded-3xl bg-mint-50 p-7 overflow-hidden hover:bg-brand hover:text-white transition"
            >
              <Icon className={`w-9 h-9 ${category.iconColor} group-hover:text-white`} />
              <h3 className="font-extrabold text-xl mt-4">{category.name}</h3>
              <p className="text-sm opacity-60 mt-1">
                {category.description} · from {category.priceFrom}
              </p>
              <ArrowUpRight className="w-6 h-6 absolute top-6 right-6 opacity-30 group-hover:opacity-100" />
            </div>
          )
        })}
        <div className="group relative rounded-3xl bg-brand-ink text-white p-7 overflow-hidden hover:bg-brand transition">
          <FeaturedIcon className="w-9 h-9 text-sun" />
          <h3 className="font-extrabold text-xl mt-4">{featuredCategory.name}</h3>
          <p className="text-sm opacity-70 mt-1">
            {featuredCategory.description} · from {featuredCategory.priceFrom}
          </p>
          <span className="text-xs font-bold text-sun mt-3 inline-block">+ 8 more categories →</span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm run test -- src/components/landing/ServicesGrid.test.tsx`
Expected: `Test Files  1 passed (1)`, `Tests  2 passed (2)`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Services grid section"
```

---

### Task 7: Trust band section

**Files:**
- Create: `app/src/components/landing/TrustBand.tsx`
- Create: `app/src/components/landing/TrustBand.test.tsx`

Reproduces the mockup's 4-card trust band (`#trust`). Per the design spec, the "AI diagnostics" card routes to `/ai-diagnose`; the other three cards are informational only (no link), matching the mockup.

- [ ] **Step 1: Write the failing test**

Create `app/src/components/landing/TrustBand.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import TrustBand from './TrustBand'

describe('TrustBand', () => {
  it('renders all four guarantees', () => {
    render(<TrustBand />, { wrapper: MemoryRouter })
    expect(screen.getByRole('heading', { name: 'Verified network' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fixed pricing' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI diagnostics' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Maintenance log' })).toBeInTheDocument()
  })

  it('routes the "AI diagnostics" card to /ai-diagnose', () => {
    render(<TrustBand />, { wrapper: MemoryRouter })
    const heading = screen.getByRole('heading', { name: 'AI diagnostics' })
    expect(heading.closest('a')).toHaveAttribute('href', '/ai-diagnose')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- src/components/landing/TrustBand.test.tsx`
Expected: FAIL — Vitest cannot resolve the module `./TrustBand` because `src/components/landing/TrustBand.tsx` does not exist yet.

- [ ] **Step 3: Implement TrustBand**

Create `app/src/components/landing/TrustBand.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { CalendarCheck, ScanSearch, ShieldCheck, Tag } from 'lucide-react'

export default function TrustBand() {
  return (
    <section id="trust" className="bg-brand-ink text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poster uppercase text-5xl mb-10">
          Who's really <span className="hl text-brand-ink">fixing it?</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <ShieldCheck className="w-8 h-8 text-sun" />
            <h3 className="font-extrabold text-lg mt-4">Verified network</h3>
            <p className="text-sm text-white/55 mt-1">Every technician passes a background check and skills certification.</p>
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <Tag className="w-8 h-8 text-sun" />
            <h3 className="font-extrabold text-lg mt-4">Fixed pricing</h3>
            <p className="text-sm text-white/55 mt-1">See the price before you book — no surprise call-out fees.</p>
          </div>
          <Link to="/ai-diagnose" className="rounded-3xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition block">
            <ScanSearch className="w-8 h-8 text-sun" />
            <h3 className="font-extrabold text-lg mt-4">AI diagnostics</h3>
            <p className="text-sm text-white/55 mt-1">Snap a photo or video and get an instant likely-cause estimate.</p>
          </Link>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <CalendarCheck className="w-8 h-8 text-sun" />
            <h3 className="font-extrabold text-lg mt-4">Maintenance log</h3>
            <p className="text-sm text-white/55 mt-1">Every job is logged so you know exactly what's been done — and what's next.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm run test -- src/components/landing/TrustBand.test.tsx`
Expected: `Test Files  1 passed (1)`, `Tests  2 passed (2)`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Trust band section"
```

---

### Task 8: Maintenance log section

**Files:**
- Create: `app/src/components/landing/MaintenanceLog.tsx`
- Create: `app/src/components/landing/MaintenanceLog.test.tsx`

Reproduces the mockup's "Make it last longer" section with the "My Appliances" card, listing the 3 appliances from `src/data/appliances.ts` (Plan 1) with their health percentages, plus the "Home health 78%" badge and the "See your home health" CTA, which routes to `/dashboard`. Each appliance row's icon/color comes from looking up `appliance.category` in `src/data/categories.ts` (Task 2) — both files use the same canonical category names, so the lookup is a direct match.

- [ ] **Step 1: Write the failing test**

Create `app/src/components/landing/MaintenanceLog.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { appliances } from '../../data/appliances'
import MaintenanceLog from './MaintenanceLog'

describe('MaintenanceLog', () => {
  it('lists every appliance with its health percentage', () => {
    render(<MaintenanceLog />, { wrapper: MemoryRouter })
    for (const appliance of appliances) {
      expect(screen.getByText(appliance.name)).toBeInTheDocument()
      expect(screen.getByText(`${appliance.healthPercent}%`)).toBeInTheDocument()
    }
  })

  it('flags the appliance that needs attention', () => {
    render(<MaintenanceLog />, { wrapper: MemoryRouter })
    expect(screen.getByText('Needs attention')).toBeInTheDocument()
  })

  it('routes "See your home health" to /dashboard', () => {
    render(<MaintenanceLog />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: /See your home health/ })).toHaveAttribute('href', '/dashboard')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- src/components/landing/MaintenanceLog.test.tsx`
Expected: FAIL — Vitest cannot resolve the module `./MaintenanceLog` because `src/components/landing/MaintenanceLog.tsx` does not exist yet.

- [ ] **Step 3: Implement MaintenanceLog**

Create `app/src/components/landing/MaintenanceLog.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { appliances } from '../../data/appliances'
import { categories } from '../../data/categories'

export default function MaintenanceLog() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-poster uppercase text-5xl">
            Make it <span className="hl">last longer.</span>
          </h2>
          <p className="mt-4 text-brand-ink/60 max-w-md">
            Every repair, service, and part replacement is logged automatically — so you always know your appliances' health and what's due next.
          </p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-brand hover:text-brand-700">
            See your home health <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-mint-50 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg">My Appliances</h3>
            <span className="text-xs font-bold bg-brand text-white px-3 py-1 rounded-full">Home health 78%</span>
          </div>
          <div className="space-y-3">
            {appliances.map((appliance) => {
              const category = categories.find((c) => c.name === appliance.category)
              const Icon = category?.icon
              return (
                <div key={appliance.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-card">
                  {Icon && <Icon className={`w-7 h-7 ${category?.iconColor}`} />}
                  <div className="flex-1">
                    <p className="font-bold text-sm">{appliance.name}</p>
                    <p className="text-xs text-brand-ink/50">{appliance.brand} · {appliance.model}</p>
                    {appliance.status === 'Needs attention' && (
                      <p className="text-xs text-red-400 font-semibold mt-1">Needs attention</p>
                    )}
                  </div>
                  <span className="font-extrabold text-lg">{appliance.healthPercent}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm run test -- src/components/landing/MaintenanceLog.test.tsx`
Expected: `Test Files  1 passed (1)`, `Tests  3 passed (3)`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Maintenance log section"
```

---

### Task 9: CTA section

**Files:**
- Create: `app/src/components/landing/CTA.tsx`
- Create: `app/src/components/landing/CTA.test.tsx`

Reproduces the mockup's closing CTA band ("Stop guessing. Start fixing."). The mockup's two buttons ("Book a repair" and "Become a technician") are plain `<a href="#">` placeholders; per the design spec's "single consistent enter-the-app destination" principle, both route to `/dashboard` instead of dead `#` links.

- [ ] **Step 1: Write the failing test**

Create `app/src/components/landing/CTA.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import CTA from './CTA'

describe('CTA', () => {
  it('renders the poster headline', () => {
    render(<CTA />, { wrapper: MemoryRouter })
    expect(screen.getByRole('heading', { name: /Stop guessing/ })).toBeInTheDocument()
  })

  it('routes both buttons to /dashboard', () => {
    render(<CTA />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Book a repair' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: 'Become a technician' })).toHaveAttribute('href', '/dashboard')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- src/components/landing/CTA.test.tsx`
Expected: FAIL — Vitest cannot resolve the module `./CTA` because `src/components/landing/CTA.tsx` does not exist yet.

- [ ] **Step 3: Implement CTA**

Create `app/src/components/landing/CTA.tsx`:
```tsx
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="bg-brand text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-poster uppercase text-5xl lg:text-6xl">Stop guessing. Start fixing.</h2>
        <p className="mt-4 text-white/85 max-w-lg mx-auto">
          Join thousands of households across Indonesia who trust Fix-It Hub for fast, fair, and verified appliance repair.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/dashboard" className="bg-brand-ink text-white font-bold px-7 py-3.5 rounded-full hover:bg-black">
            Book a repair
          </Link>
          <Link to="/dashboard" className="bg-sun text-brand-ink font-bold px-7 py-3.5 rounded-full hover:brightness-105">
            Become a technician
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm run test -- src/components/landing/CTA.test.tsx`
Expected: `Test Files  1 passed (1)`, `Tests  2 passed (2)`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add CTA section"
```

---

### Task 10: Compose the Landing page and final verification

**Files:**
- Modify: `app/src/pages/Landing.tsx`
- Create: `app/src/pages/Landing.test.tsx`

Composes all sections built in Tasks 3-9 into `Landing.tsx`, in mockup order, replacing the Plan 1 placeholder. A gap is intentionally left between `<ServicesGrid />` and `<TrustBand />` for Plan 3 to insert the Live section.

- [ ] **Step 1: Write the failing test**

Create `app/src/pages/Landing.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Landing from './Landing'

describe('Landing', () => {
  it('renders all major sections', () => {
    render(<Landing />, { wrapper: MemoryRouter })
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Trusted repair/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Pick your trouble/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Who's really fixing it?" })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Book a fix in three steps/ })).toBeInTheDocument()
    expect(screen.getByText('My Appliances')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Stop guessing/ })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm run test -- src/pages/Landing.test.tsx`
Expected: FAIL — the current `Landing.tsx` (Plan 1 placeholder) renders only a `<main>` with "FIX-IT HUB" text, so `getByRole('banner')` (and every subsequent assertion) fails to find a match.

- [ ] **Step 3: Implement the Landing page composition**

Replace `app/src/pages/Landing.tsx` with:
```tsx
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import Hero from '../components/landing/Hero'
import Ticker from '../components/landing/Ticker'
import ServicesGrid from '../components/landing/ServicesGrid'
import TrustBand from '../components/landing/TrustBand'
import HowItWorks from '../components/landing/HowItWorks'
import MaintenanceLog from '../components/landing/MaintenanceLog'
import CTA from '../components/landing/CTA'

function Landing() {
  return (
    <div className="font-sans text-brand-ink bg-white antialiased">
      <NavBar />
      <Hero />
      <Ticker />
      <ServicesGrid />
      {/* Plan 3 inserts <LiveSection /> here, between Services and Trust */}
      <TrustBand />
      <HowItWorks />
      <MaintenanceLog />
      <CTA />
      <Footer />
    </div>
  )
}

export default Landing
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm run test -- src/pages/Landing.test.tsx`
Expected: `Test Files  1 passed (1)`, `Tests  1 passed (1)`.

- [ ] **Step 5: Run the full test suite and build**

Run:
```bash
npm run test
npm run build
```
Expected: all tests pass with 0 failures, build succeeds.

- [ ] **Step 6: Verify all three routes still render via the dev server**

Run:
```bash
npm run dev &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/dashboard
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/ai-diagnose
kill %1
```
Expected: `200` for all three routes.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Compose Landing page from section components"
```

---

## Self-Review Notes

**1. Spec coverage:**
- Sticky nav with the design spec's exact routing rules (Services/How it works/Trust → anchors, AI Diagnostics → `/ai-diagnose`, Log in & Sign up → `/dashboard`) → Task 3.
- Wave hero, poster headline, decorative booking bar ("Find a technician" → `/dashboard`), AI Diagnostic Engine widget (all 3 CTAs → `/ai-diagnose`) → Task 4.
- Category ticker and "How it works" 3-step section → Task 5.
- Services grid (6 canonical categories) → Task 6 (data in Task 2).
- Trust band (4 guarantees, "AI diagnostics" → `/ai-diagnose`) → Task 7.
- Maintenance log ("My Appliances" from Plan 1's `appliances.ts`, "See your home health" → `/dashboard`) → Task 8.
- Closing CTA ("Book a repair" / "Become a technician" → `/dashboard`) → Task 9.
- Footer → Task 3.
- Full-page composition + route smoke test → Task 10.
- Fix-It Hub Live section (`#live`, map + activity feed + counters) is **out of scope** — explicitly deferred to Plan 3, which will insert `<LiveSection />` between `<ServicesGrid />` and `<TrustBand />` (placeholder comment left in Task 10's `Landing.tsx`).

**2. Placeholder scan:** No TBD/TODO markers. Every task has complete component code, complete test code, and exact commands with expected output.

**3. Type consistency:**
- `ServiceCategory.icon: LucideIcon` (Task 2) is consumed identically in Task 6 (`category.icon` rendered as `<Icon />`) and Task 8 (`category?.icon` — optional because `Array.find` can return `undefined`, guarded with `Icon &&`).
- `Appliance` fields (`name`, `category`, `healthPercent`, `brand`, `model`, `status`) from Plan 1's `src/data/appliances.ts` are used as-is in Task 8 — no renaming.
- `categories[name]` values (`'AC & HVAC'`, `'Refrigerator'`, `'Washing Machine'`) match `appliances[].category` values exactly (both Plan 1 and Task 2 use the canonical vocabulary), so Task 8's `categories.find((c) => c.name === appliance.category)` always resolves for the 3 seeded appliances.

**4. Deliberate deviations from the mockup (for design-fidelity awareness during review):**
- The mockup's 5th services card heading reads "Oven / Microwave"; Task 2/6 use the canonical name "Oven" instead, to keep `categories.ts` directly reusable by Plan 4/6 without alias mapping. The description/price text ("Heating, wiring, control · from Rp 110k") is preserved.
- The mockup's booking-bar "Find a technician" and AI-widget CTAs are `<button>` elements with no real action; Task 4 converts them to `<Link>` per the design spec's routing rules, adding `inline-flex items-center justify-center` to the search-bar button only (the AI-widget links already had `grid`/`inline-flex` display classes in the mockup).
- The mockup's CTA-section buttons and "AI diagnostics" trust card are `<a href="#">`/`<div>` placeholders; Tasks 7 and 9 convert them to `<Link>` targeting `/dashboard` and `/ai-diagnose` respectively (the AI diagnostics card additionally gains `hover:bg-white/10 transition block` for click affordance).
- Footer's "Services" and "Company" link columns and the "Get the app" store badges remain static text/spans (no links), matching the mockup exactly.

**5. Post-plan verification:** Task 10 Step 6's curl check only confirms the dev server responds with `200` — a Vite SPA returns `200` with an empty `#root` even if React throws during render, so it is a liveness ping, not a render check. The real regression net is `Landing.test.tsx` (Task 10), which renders the full composed tree under jsdom and fails on any composition-time error. After all 10 tasks are merged, do a final Playwright pass on `/` (navigate, snapshot, check console for errors) — the same render-and-look verification done at the end of Plan 1 — before considering Plan 2 done.
