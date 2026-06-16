# Fix-It Hub: Booking, Tracking & Chat — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two UI bugs, integrate brand logos, add a 3-step booking page, and a combined tracking + chat post-booking screen.

**Architecture:** Bug fixes are surgical edits to existing files. New features are new React Router routes (`/book/:serviceId`, `/booking-confirmed/:bookingId`) added to the existing Vite + React + Tailwind app. No new dependencies needed — Leaflet and React Router are already installed.

**Tech Stack:** React 19, React Router v7, Leaflet 1.9, Tailwind CSS 3, Vitest + Testing Library, TypeScript

All commands run from inside `app/`.

---

## File Map

| File | Action |
|---|---|
| `public/logo/fih-logo.svg` | **Create** — gradient logo (copied asset) |
| `public/logo/fih-logo-b.svg` | **Create** — black logo (copied asset) |
| `public/logo/fih-logo-y.svg` | **Create** — yellow logo (copied asset) |
| `src/lib/liveSimulation.ts` | **Modify** — add coordinate clamp, reduce spread |
| `src/lib/liveSimulation.test.ts` | **Modify** — add land-bounds assertion |
| `src/components/layout/NavBar.tsx` | **Modify** — logo swap + fix anchor hrefs |
| `src/components/layout/NavBar.test.tsx` | **Modify** — update assertions to match new hrefs + img |
| `src/components/layout/Footer.tsx` | **Modify** — logo swap |
| `src/components/layout/Footer.test.tsx` | **Modify** — query by img alt instead of text |
| `src/data/categories.ts` | **Modify** — add `id` field to interface + each category |
| `src/data/categories.test.ts` | **Modify** — add id assertion |
| `src/data/services.ts` | **Create** — service definitions (problems, base prices) |
| `src/data/services.test.ts` | **Create** — services data tests |
| `src/components/landing/ServicesGrid.tsx` | **Modify** — wrap cards with booking links |
| `src/components/dashboard/QuickCategories.tsx` | **Modify** — wrap cards with booking links |
| `src/App.tsx` | **Modify** — add 2 new routes |
| `src/pages/Booking.tsx` | **Create** — 3-step booking wizard |
| `src/pages/Booking.test.tsx` | **Create** — booking page tests |
| `src/pages/BookingConfirmed.tsx` | **Create** — tracking map + chat |
| `src/pages/BookingConfirmed.test.tsx` | **Create** — confirmed page tests |

---

## Task 1: Copy logo assets to public/

**Files:**
- Create: `public/logo/fih-logo.svg`
- Create: `public/logo/fih-logo-b.svg`
- Create: `public/logo/fih-logo-y.svg`

> No tests for static assets.

- [ ] **Step 1: Create the logo directory and copy files**

Run from the **repository root** (one level above `app/`):

```bash
mkdir -p app/public/logo
cp "logo/fih logo.svg"   app/public/logo/fih-logo.svg
cp "logo/fih logo b.svg" app/public/logo/fih-logo-b.svg
cp "logo/fih logo y.svg" app/public/logo/fih-logo-y.svg
```

- [ ] **Step 2: Verify the files exist**

```bash
ls app/public/logo/
```

Expected output:
```
fih-logo-b.svg  fih-logo.svg  fih-logo-y.svg
```

- [ ] **Step 3: Commit**

```bash
git add public/logo/
git commit -m "feat: add brand logo assets to public"
```

---

## Task 2: Fix NavBar — anchor hrefs + logo swap

**Files:**
- Modify: `src/components/layout/NavBar.test.tsx`
- Modify: `src/components/layout/NavBar.tsx`

- [ ] **Step 1: Update tests to match target state**

Replace the entire content of `src/components/layout/NavBar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NavBar from './NavBar'

describe('NavBar', () => {
  it('renders the Fix-It Hub logo image', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('img', { name: 'Fix-It Hub' })).toBeInTheDocument()
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

  it('links "Services", "How it works", and "Trust" to landing-page anchors', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/#services')
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '/#how')
    expect(screen.getByRole('link', { name: 'Trust' })).toHaveAttribute('href', '/#trust')
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npm test -- NavBar
```

Expected: 2 failures — "Fix-It Hub logo image" not found, anchor hrefs still show `#services` etc.

- [ ] **Step 3: Update NavBar.tsx**

Replace the entire content of `src/components/layout/NavBar.tsx`:

```tsx
import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-mint-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo/fih-logo-b.svg" alt="Fix-It Hub" className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-ink/70">
          <a href="/#services" className="hover:text-brand-ink">Services</a>
          <a href="/#how" className="hover:text-brand-ink">How it works</a>
          <Link to="/ai-diagnose" className="hover:text-brand-ink">AI Diagnostics</Link>
          <a href="/#trust" className="hover:text-brand-ink">Trust</a>
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

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm test -- NavBar
```

Expected: 4 passing

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/NavBar.tsx src/components/layout/NavBar.test.tsx
git commit -m "fix: swap NavBar logo to image and fix anchor hrefs for inner pages"
```

---

## Task 3: Fix Footer — logo swap

**Files:**
- Modify: `src/components/layout/Footer.test.tsx`
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Update Footer test**

Replace the entire content of `src/components/layout/Footer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the Fix-It Hub logo image', () => {
    render(<Footer />)
    expect(screen.getByRole('img', { name: 'Fix-It Hub' })).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Footer />)
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

- [ ] **Step 2: Run tests — expect 1 failure**

```bash
npm test -- Footer
```

Expected: "Fix-It Hub logo image" fails (still renders text).

- [ ] **Step 3: Update Footer.tsx**

Replace the entire content of `src/components/layout/Footer.tsx`:

```tsx
export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="mb-3">
            <img src="/logo/fih-logo-y.svg" alt="Fix-It Hub" className="h-7 w-auto" />
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

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm test -- Footer
```

Expected: 4 passing

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx
git commit -m "fix: swap Footer logo to yellow image variant"
```

---

## Task 4: Fix LiveMap — markers placed in the sea

**Files:**
- Modify: `src/lib/liveSimulation.ts`
- Modify: `src/lib/liveSimulation.test.ts`

Root cause: `COORDINATE_SPREAD = 0.18` lets offsets reach lng ~112.84 (Madura Strait). Fix: reduce spread and clamp to Surabaya land bounds.

- [ ] **Step 1: Add land-bounds test**

In `src/lib/liveSimulation.test.ts`, add this block after the existing `createJobMarker` describe block (after line 118):

```ts
describe('createJobMarker land bounds', () => {
  it('always places markers within Surabaya land bounds', () => {
    for (let i = 0; i < 100; i++) {
      const marker = createJobMarker(`bound-test-${i}`)
      expect(marker.lat).toBeGreaterThanOrEqual(-7.35)
      expect(marker.lat).toBeLessThanOrEqual(-7.20)
      expect(marker.lng).toBeGreaterThanOrEqual(112.66)
      expect(marker.lng).toBeLessThanOrEqual(112.79)
    }
  })
})
```

- [ ] **Step 2: Run tests — expect the new test to fail**

```bash
npm test -- liveSimulation
```

Expected: the land-bounds test fails (some markers fall outside due to old spread/no clamping).

- [ ] **Step 3: Update liveSimulation.ts**

Replace the entire content of `src/lib/liveSimulation.ts`:

```ts
import { LIVE_AREAS, LIVE_CATEGORIES, LIVE_CENTER } from '../data/liveActivity'

export type JobStatus = 'In progress' | 'Completed'

export interface JobMarker {
  id: string
  lat: number
  lng: number
  category: string
  color: string
  area: string
  status: JobStatus
  rating: number
}

export interface FeedItem {
  id: string
  category: string
  color: string
  area: string
  status: JobStatus
  rating: number
  timeLabel: string
}

const COMPLETION_THRESHOLD = 0.8
const COORDINATE_SPREAD = 0.09
const COMPLETED_COLOR = '#FFD21E'

const LAT_BOUNDS: [number, number] = [-7.35, -7.20]
const LNG_BOUNDS: [number, number] = [112.66, 112.79]

function clamp(value: number, bounds: [number, number]): number {
  return Math.max(bounds[0], Math.min(bounds[1], value))
}

export function pickRandomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function jitterCount(current: number, min: number, max: number): number {
  const next = current + (Math.random() < 0.5 ? -1 : 1)
  return Math.max(min, Math.min(max, next))
}

export function randomRating(): number {
  return Math.round((4.3 + Math.random() * 0.7) * 10) / 10
}

export function isJobCompleted(): boolean {
  return Math.random() > COMPLETION_THRESHOLD
}

export function randomOffset(spread: number): number {
  return (Math.random() - 0.5) * spread
}

export function createJobMarker(id: string): JobMarker {
  const category = pickRandomItem(LIVE_CATEGORIES)
  const completed = isJobCompleted()

  return {
    id,
    lat: clamp(LIVE_CENTER[0] + randomOffset(COORDINATE_SPREAD), LAT_BOUNDS),
    lng: clamp(LIVE_CENTER[1] + randomOffset(COORDINATE_SPREAD), LNG_BOUNDS),
    category: category.name,
    color: completed ? COMPLETED_COLOR : category.color,
    area: pickRandomItem(LIVE_AREAS),
    status: completed ? 'Completed' : 'In progress',
    rating: randomRating(),
  }
}

export function createFeedItem(id: string): FeedItem {
  const category = pickRandomItem(LIVE_CATEGORIES)
  const completed = isJobCompleted()

  return {
    id,
    category: category.name,
    color: category.color,
    area: pickRandomItem(LIVE_AREAS),
    status: completed ? 'Completed' : 'In progress',
    rating: randomRating(),
    timeLabel: 'Just now',
  }
}
```

- [ ] **Step 4: Run all liveSimulation tests — expect all pass**

```bash
npm test -- liveSimulation
```

Expected: all passing (including the new land-bounds test running 100 times).

- [ ] **Step 5: Commit**

```bash
git add src/lib/liveSimulation.ts src/lib/liveSimulation.test.ts
git commit -m "fix: clamp LiveMap markers to Surabaya land bounds, prevent sea placement"
```

---

## Task 5: Add service IDs to categories + create services data

**Files:**
- Modify: `src/data/categories.ts`
- Modify: `src/data/categories.test.ts`
- Create: `src/data/services.ts`
- Create: `src/data/services.test.ts`

- [ ] **Step 1: Write failing test for category ids**

Add this test to `src/data/categories.test.ts` (append after line 24, before the final `)`):

```ts
  it('gives every category a non-empty id in kebab-case', () => {
    for (const category of categories) {
      expect(category.id).toMatch(/^[a-z]+(-[a-z]+)*$/)
    }
  })
```

- [ ] **Step 2: Run — expect failure**

```bash
npm test -- categories
```

Expected: "non-empty id in kebab-case" fails — `category.id` is undefined.

- [ ] **Step 3: Write failing tests for services**

Create `src/data/services.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getService, services } from './services'

describe('services', () => {
  it('lists a definition for every category', () => {
    const ids = services.map((s) => s.id)
    expect(ids).toContain('ac-hvac')
    expect(ids).toContain('refrigerator')
    expect(ids).toContain('washing-machine')
    expect(ids).toContain('television')
    expect(ids).toContain('oven')
    expect(ids).toContain('water-heater')
  })

  it('gives every service a name, positive basePrice, and at least 3 problems', () => {
    for (const service of services) {
      expect(service.name.length).toBeGreaterThan(0)
      expect(service.basePrice).toBeGreaterThan(0)
      expect(service.problems.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('getService returns the correct definition for a known id', () => {
    const result = getService('ac-hvac')
    expect(result).toBeDefined()
    expect(result?.name).toBe('AC & HVAC')
    expect(result?.basePrice).toBe(150000)
  })

  it('getService returns undefined for an unknown id', () => {
    expect(getService('unknown-id')).toBeUndefined()
  })
})
```

- [ ] **Step 4: Run — expect failure**

```bash
npm test -- services
```

Expected: fails — `services.ts` does not exist yet.

- [ ] **Step 5: Add id to categories.ts**

Replace the entire content of `src/data/categories.ts`:

```ts
import type { LucideIcon } from 'lucide-react'
import { Droplets, Microwave, Refrigerator, Tv, WashingMachine, Wind } from 'lucide-react'

export interface ServiceCategory {
  id: string
  name: string
  icon: LucideIcon
  iconColor: string
  description: string
  priceFrom: string
}

export const categories: ServiceCategory[] = [
  {
    id: 'ac-hvac',
    name: 'AC & HVAC',
    icon: Wind,
    iconColor: 'text-brand',
    description: 'Cleaning, refrigerant, install',
    priceFrom: 'Rp 150k',
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    icon: Refrigerator,
    iconColor: 'text-blue-500',
    description: 'Cooling, compressor, seals',
    priceFrom: 'Rp 120k',
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    icon: WashingMachine,
    iconColor: 'text-purple-500',
    description: 'Drainage, drum, motor',
    priceFrom: 'Rp 130k',
  },
  {
    id: 'television',
    name: 'Television',
    icon: Tv,
    iconColor: 'text-amber-500',
    description: 'Panel, power, backlight',
    priceFrom: 'Rp 100k',
  },
  {
    id: 'oven',
    name: 'Oven',
    icon: Microwave,
    iconColor: 'text-red-400',
    description: 'Heating, wiring, control',
    priceFrom: 'Rp 110k',
  },
  {
    id: 'water-heater',
    name: 'Water Heater',
    icon: Droplets,
    iconColor: 'text-sun',
    description: 'Element, thermostat, leaks',
    priceFrom: 'Rp 140k',
  },
]
```

- [ ] **Step 6: Create services.ts**

Create `src/data/services.ts`:

```ts
export interface ServiceDefinition {
  id: string
  name: string
  basePrice: number
  problems: string[]
}

export const services: ServiceDefinition[] = [
  {
    id: 'ac-hvac',
    name: 'AC & HVAC',
    basePrice: 150000,
    problems: ['Routine service', 'Not cooling', 'Water leaking', 'Strange noise', "Won't turn on", 'Other'],
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    basePrice: 120000,
    problems: ['Not cooling', 'Freezer icing up', 'Strange noise', 'Water leaking', "Won't start", 'Other'],
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    basePrice: 130000,
    problems: ["Won't spin", 'Leaking water', 'Not draining', "Won't power on", 'Error code', 'Other'],
  },
  {
    id: 'television',
    name: 'Television',
    basePrice: 100000,
    problems: ['No picture', 'No sound', 'Screen cracked', "Won't turn on", 'Remote not working', 'Other'],
  },
  {
    id: 'oven',
    name: 'Oven',
    basePrice: 110000,
    problems: ['Not heating', 'Temperature off', 'Door not closing', 'Control panel fault', "Won't turn on", 'Other'],
  },
  {
    id: 'water-heater',
    name: 'Water Heater',
    basePrice: 140000,
    problems: ['No hot water', 'Leaking', 'Strange smell', 'Pilot light out', 'Thermostat issue', 'Other'],
  },
]

export function getService(id: string): ServiceDefinition | undefined {
  return services.find((s) => s.id === id)
}
```

- [ ] **Step 7: Run all — expect all pass**

```bash
npm test -- categories services
```

Expected: all passing

- [ ] **Step 8: Commit**

```bash
git add src/data/categories.ts src/data/categories.test.ts src/data/services.ts src/data/services.test.ts
git commit -m "feat: add service IDs to categories and create services data with problem lists"
```

---

## Task 6: Wire booking links in ServicesGrid and QuickCategories

**Files:**
- Modify: `src/components/landing/ServicesGrid.tsx`
- Modify: `src/components/dashboard/QuickCategories.tsx`

- [ ] **Step 1: Update ServicesGrid.tsx**

Replace the entire content of `src/components/landing/ServicesGrid.tsx`:

```tsx
import { Link } from 'react-router-dom'
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
            <Link
              key={category.id}
              to={`/book/${category.id}`}
              className="group relative rounded-3xl bg-mint-50 p-7 overflow-hidden hover:bg-brand hover:text-white transition"
            >
              <Icon className={`w-9 h-9 ${category.iconColor} group-hover:text-white`} />
              <h3 className="font-extrabold text-xl mt-4">{category.name}</h3>
              <p className="text-sm opacity-60 mt-1">
                {category.description} · from {category.priceFrom}
              </p>
              <ArrowUpRight className="w-6 h-6 absolute top-6 right-6 opacity-30 group-hover:opacity-100" />
            </Link>
          )
        })}
        <Link
          to={`/book/${featuredCategory.id}`}
          className="group relative rounded-3xl bg-brand-ink text-white p-7 overflow-hidden hover:bg-brand transition"
        >
          <FeaturedIcon className="w-9 h-9 text-sun" />
          <h3 className="font-extrabold text-xl mt-4">{featuredCategory.name}</h3>
          <p className="text-sm opacity-70 mt-1">
            {featuredCategory.description} · from {featuredCategory.priceFrom}
          </p>
          <span className="text-xs font-bold text-sun mt-3 inline-block">+ 8 more categories →</span>
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update QuickCategories.tsx**

Replace the entire content of `src/components/dashboard/QuickCategories.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { categories } from '../../data/categories'

export default function QuickCategories() {
  return (
    <section>
      <h2 className="font-extrabold text-lg mb-4">Our services</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link
              key={category.id}
              to={`/book/${category.id}`}
              className="bg-white rounded-2xl p-4 text-center shadow-card hover:shadow-soft transition"
            >
              <span className="w-11 h-11 mx-auto rounded-xl bg-mint-100 grid place-items-center">
                <Icon className={`w-5 h-5 ${category.iconColor}`} />
              </span>
              <p className="text-xs font-bold mt-2">{category.name}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run all tests — verify nothing broken**

```bash
npm test
```

Expected: all existing tests pass. (ServicesGrid and QuickCategories tests may need MemoryRouter — check if existing tests wrap with a router. If they fail with "useNavigate must be in a Router", add `{ wrapper: MemoryRouter }` to their render calls.)

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/ServicesGrid.tsx src/components/dashboard/QuickCategories.tsx
git commit -m "feat: link service cards to booking page"
```

---

## Task 7: Add new routes to App.tsx

**Files:**
- Modify: `src/App.tsx`

> No unit test for routing config — the pages' own tests cover rendering. This is committed before the page files exist; TypeScript will error until Task 8 creates `Booking.tsx`. That's fine — commit after the pages exist in Tasks 8 and 11.

- [ ] **Step 1: Update App.tsx**

Replace the entire content of `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AIDiagnose from './pages/AIDiagnose'
import Booking from './pages/Booking'
import BookingConfirmed from './pages/BookingConfirmed'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-diagnose" element={<AIDiagnose />} />
        <Route path="/book/:serviceId" element={<Booking />} />
        <Route path="/booking-confirmed/:bookingId" element={<BookingConfirmed />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

> Do NOT commit yet. The imports reference files that don't exist until Tasks 8 and 11. Commit at the end of Task 11.

---

## Task 8: Booking page — Step 1 (Problem selection)

**Files:**
- Create: `src/pages/Booking.test.tsx`
- Create: `src/pages/Booking.tsx`

- [ ] **Step 1: Write failing tests for Step 1**

Create `src/pages/Booking.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Booking from './Booking'

function renderBooking(serviceId = 'ac-hvac') {
  return render(
    <MemoryRouter initialEntries={[`/book/${serviceId}`]}>
      <Routes>
        <Route path="/book/:serviceId" element={<Booking />} />
        <Route path="/booking-confirmed/001" element={<div>Confirmed</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Booking — Step 1', () => {
  it('renders the service name as the headline', () => {
    renderBooking('ac-hvac')
    expect(screen.getByRole('heading', { name: /AC & HVAC/i })).toBeInTheDocument()
  })

  it('shows "Service not found" for an unknown service id', () => {
    renderBooking('does-not-exist')
    expect(screen.getByText(/service not found/i)).toBeInTheDocument()
  })

  it('renders the problem checklist for the service', () => {
    renderBooking('ac-hvac')
    expect(screen.getByRole('checkbox', { name: 'Not cooling' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Routine service' })).toBeInTheDocument()
  })

  it('shows a price estimate that updates when a problem is checked', () => {
    renderBooking('ac-hvac')
    expect(screen.getByText(/Rp 150\.000/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Not cooling' }))
    expect(screen.getByText(/Rp 175\.000/)).toBeInTheDocument()
  })

  it('advances to step 2 when Next is clicked', () => {
    renderBooking('ac-hvac')
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('heading', { name: /schedule/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect all failures**

```bash
npm test -- Booking
```

Expected: all 5 tests fail — `Booking.tsx` does not exist.

- [ ] **Step 3: Create Booking.tsx with Step 1 implemented**

Create `src/pages/Booking.tsx`:

```tsx
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { getService } from '../data/services'

type Step = 1 | 2 | 3
type PropertyType = 'House' | 'Apartment' | 'Other'
type TimeSlot = 'Morning (07:00–10:00)' | 'Afternoon (10:00–14:00)' | 'Evening (14:00–18:00)'

const TIME_SLOTS: TimeSlot[] = [
  'Morning (07:00–10:00)',
  'Afternoon (10:00–14:00)',
  'Evening (14:00–18:00)',
]

const APARTMENT_SURCHARGE = 20000
const PLATFORM_FEE = 11000
const PROBLEM_PRICE = 25000

function formatRp(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`
}

function StepPill({ n, active }: { n: number; active: boolean }) {
  return (
    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center
      ${active ? 'bg-brand text-white' : 'bg-mint-100 text-brand-ink/40'}`}>
      {n}
    </span>
  )
}

function Calendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  const startPad = (firstDay.getDay() + 6) % 7

  const days: (Date | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewYear, viewMonth, d))

  const monthLabel = firstDay.toLocaleString('en', { month: 'long', year: 'numeric' })

  function prev() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
  }
  function next() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
  }

  return (
    <div className="bg-white rounded-2xl border border-mint-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} aria-label="Previous month" className="p-1 rounded-full hover:bg-mint-50">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-sm">{monthLabel}</span>
        <button onClick={next} aria-label="Next month" className="p-1 rounded-full hover:bg-mint-50">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-brand-ink/50 mb-2 text-center">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <span key={`pad-${i}`} />
          const isPast = d < today
          const isSelected = selected?.toDateString() === d.toDateString()
          const isToday = d.toDateString() === today.toDateString()
          return (
            <button
              key={d.toISOString()}
              disabled={isPast}
              onClick={() => onSelect(d)}
              aria-label={d.toLocaleDateString('en', { day: 'numeric', month: 'short' })}
              className={`text-sm rounded-full w-8 h-8 mx-auto flex items-center justify-center font-medium transition
                ${isPast ? 'text-brand-ink/20 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-brand text-white' : ''}
                ${!isPast && !isSelected && isToday ? 'bg-mint-100 font-bold' : ''}
                ${!isPast && !isSelected && !isToday ? 'hover:bg-mint-100' : ''}
              `}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Booking() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const service = getService(serviceId ?? '')

  const [step, setStep] = useState<Step>(1)
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [propertyType, setPropertyType] = useState<PropertyType>('House')

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-brand-ink">
        <p className="text-brand-ink/50">Service not found.</p>
      </div>
    )
  }

  const problemsTotal = selectedProblems.length * PROBLEM_PRICE
  const apartmentSurcharge = propertyType === 'Apartment' ? APARTMENT_SURCHARGE : 0
  const subtotal = service.basePrice + problemsTotal
  const total = subtotal + apartmentSurcharge + PLATFORM_FEE

  function toggleProblem(p: string) {
    setSelectedProblems((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  return (
    <div className="min-h-screen bg-mint-50 font-sans text-brand-ink antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-mint-100">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink/60 hover:text-brand-ink">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <img src="/logo/fih-logo-b.svg" alt="Fix-It Hub" className="h-7 w-auto" />
          <div className="flex gap-1.5">
            {([1, 2, 3] as const).map((n) => <StepPill key={n} n={n} active={step === n} />)}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* ── Step 1: Problem ── */}
        {step === 1 && (
          <div>
            <h1 className="font-poster uppercase text-5xl mb-1">{service.name}</h1>
            <p className="text-brand-ink/60 mb-8">What's going on?</p>
            <div className="space-y-3 mb-6">
              {service.problems.map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 cursor-pointer border border-mint-100 hover:border-brand transition"
                >
                  <input
                    type="checkbox"
                    className="accent-brand w-4 h-4"
                    checked={selectedProblems.includes(p)}
                    onChange={() => toggleProblem(p)}
                  />
                  <span className="font-semibold">{p}</span>
                </label>
              ))}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue (optional)"
              className="w-full border border-mint-100 rounded-2xl px-5 py-4 text-sm resize-none focus:outline-none focus:border-brand mb-6 bg-white"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-ink/60">
                Estimated: <span className="font-bold text-brand-ink">{formatRp(subtotal)}</span>
              </span>
              <button
                onClick={() => setStep(2)}
                className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-600 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Schedule ── */}
        {step === 2 && (
          <div>
            <h1 className="font-poster uppercase text-5xl mb-1">Schedule</h1>
            <p className="text-brand-ink/60 mb-8">When do you need us?</p>
            <Calendar selected={selectedDate} onSelect={setSelectedDate} />
            <div className="grid grid-cols-3 gap-3 mt-6 mb-8">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-2xl py-4 px-2 text-sm font-bold border-2 transition
                    ${selectedSlot === slot
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white border-mint-100 hover:border-brand text-brand-ink'}`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="text-sm font-semibold text-brand-ink/60 hover:text-brand-ink">
                ← Back
              </button>
              <button
                disabled={!selectedDate || !selectedSlot}
                onClick={() => setStep(3)}
                className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && (
          <div>
            <h1 className="font-poster uppercase text-5xl mb-1">Confirm</h1>
            <p className="text-brand-ink/60 mb-8">Review your booking</p>

            {/* Address */}
            <div className="bg-white rounded-2xl p-5 border border-mint-100 mb-4">
              <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-wide mb-1">Location</p>
              <p className="font-semibold">Tower 1 ITS, Sukolilo, Surabaya 60111</p>
            </div>

            {/* Property type */}
            <div className="bg-white rounded-2xl p-5 border border-mint-100 mb-4">
              <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-wide mb-3">Property type</p>
              <div className="space-y-2">
                {(['House', 'Apartment', 'Other'] as PropertyType[]).map((t) => (
                  <label key={t} className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-3 font-semibold">
                      <input
                        type="radio"
                        name="propertyType"
                        className="accent-brand"
                        checked={propertyType === t}
                        onChange={() => setPropertyType(t)}
                      />
                      {t}
                    </span>
                    <span className="text-sm text-brand-ink/50">
                      {t === 'Apartment' ? `+${formatRp(APARTMENT_SURCHARGE)}` : 'Rp 0'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl p-5 border border-mint-100 mb-8">
              <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-wide mb-4">Order summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{service.name}</span>
                  <span>{formatRp(service.basePrice)}</span>
                </div>
                {selectedProblems.length > 0 && (
                  <div className="flex justify-between text-brand-ink/60">
                    <span>{selectedProblems.join(', ')}</span>
                    <span>+{formatRp(problemsTotal)}</span>
                  </div>
                )}
                {selectedDate && selectedSlot && (
                  <p className="text-brand-ink/60 text-xs mt-1">
                    {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {selectedSlot}
                  </p>
                )}
                {propertyType === 'Apartment' && (
                  <div className="flex justify-between text-brand-ink/60">
                    <span>Apartment surcharge</span>
                    <span>+{formatRp(APARTMENT_SURCHARGE)}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-ink/60">
                  <span>Platform fee</span>
                  <span>{formatRp(PLATFORM_FEE)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base pt-2 border-t border-mint-100">
                  <span>Total</span>
                  <span>{formatRp(total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="text-sm font-semibold text-brand-ink/60 hover:text-brand-ink">
                ← Back
              </button>
              <button
                onClick={() => navigate('/booking-confirmed/001')}
                className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-600 transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Run Booking tests — expect Step 1 tests pass**

```bash
npm test -- Booking
```

Expected: 5 tests pass (Step 1 tests work; Step 2/3 tests not written yet).

- [ ] **Step 5: Add Step 2 and Step 3 tests to Booking.test.tsx**

Append the following describe blocks to `src/pages/Booking.test.tsx`:

```tsx
describe('Booking — Step 2', () => {
  it('shows the schedule heading after clicking Next', () => {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('heading', { name: /schedule/i })).toBeInTheDocument()
  })

  it('disables Next until a date and time slot are both selected', () => {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('enables Next after selecting a time slot (date auto-selected from today)', () => {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    // Select today's date (find a non-disabled day button)
    const dayButtons = screen.getAllByRole('button').filter(
      (b) => !b.hasAttribute('disabled') && /^\d+$/.test(b.textContent ?? '')
    )
    fireEvent.click(dayButtons[0])
    fireEvent.click(screen.getByRole('button', { name: /morning/i }))
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })
})

describe('Booking — Step 3', () => {
  function advanceToStep3() {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    const dayButtons = screen.getAllByRole('button').filter(
      (b) => !b.hasAttribute('disabled') && /^\d+$/.test(b.textContent ?? '')
    )
    fireEvent.click(dayButtons[0])
    fireEvent.click(screen.getByRole('button', { name: /morning/i }))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
  }

  it('shows the confirm heading and Tower 1 ITS address', () => {
    advanceToStep3()
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument()
    expect(screen.getByText(/Tower 1 ITS/)).toBeInTheDocument()
  })

  it('shows the platform fee in the order summary', () => {
    advanceToStep3()
    expect(screen.getByText('Platform fee')).toBeInTheDocument()
  })

  it('navigates to /booking-confirmed/001 when Confirm Booking is clicked', () => {
    advanceToStep3()
    fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }))
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run all Booking tests — expect all pass**

```bash
npm test -- Booking
```

Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add src/pages/Booking.tsx src/pages/Booking.test.tsx
git commit -m "feat: add 3-step Booking page with problem selection, schedule, and confirm"
```

---

## Task 9: BookingConfirmed — tracking map + chat

**Files:**
- Create: `src/pages/BookingConfirmed.test.tsx`
- Create: `src/pages/BookingConfirmed.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/pages/BookingConfirmed.test.tsx`:

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BookingConfirmed from './BookingConfirmed'

function renderConfirmed() {
  return render(
    <MemoryRouter initialEntries={['/booking-confirmed/001']}>
      <Routes>
        <Route path="/booking-confirmed/:bookingId" element={<BookingConfirmed />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('BookingConfirmed', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a Leaflet map container', () => {
    const { container } = renderConfirmed()
    expect(container.querySelector('.leaflet-container')).toBeInTheDocument()
  })

  it('shows the technician name and status', () => {
    renderConfirmed()
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument()
    expect(screen.getByText(/on the way/i)).toBeInTheDocument()
  })

  it('shows the opening message from the technician', () => {
    renderConfirmed()
    expect(screen.getByText(/I'm on my way/i)).toBeInTheDocument()
  })

  it('allows sending a message and shows an auto-reply', async () => {
    vi.useFakeTimers()
    renderConfirmed()

    const input = screen.getByPlaceholderText(/message budi/i)
    fireEvent.change(input, { target: { value: 'Almost there?' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(screen.getByText('Almost there?')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText(/got it|sure, no problem|thanks for letting me know/i)).toBeInTheDocument()
  })

  it('disables the send button when input is empty', () => {
    renderConfirmed()
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run — expect all failures**

```bash
npm test -- BookingConfirmed
```

Expected: all 5 fail — file does not exist.

- [ ] **Step 3: Create BookingConfirmed.tsx**

Create `src/pages/BookingConfirmed.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Send } from 'lucide-react'

const USER_LOCATION: [number, number] = [-7.2756, 112.7961]
const TECH_START: [number, number] = [-7.2856, 112.7861]
const ANIMATION_STEPS = 45
const ANIMATION_INTERVAL_MS = 1000

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

interface Message {
  id: string
  from: 'technician' | 'user'
  text: string
  time: string
}

const AUTO_REPLIES = [
  'Got it! See you soon.',
  'Sure, no problem at all.',
  'Thanks for letting me know!',
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function timestamp() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
}

export default function BookingConfirmed() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [arrived, setArrived] = useState(false)
  const [eta, setEta] = useState(8)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'opening',
      from: 'technician',
      text: "Hi! I'm on my way. Should arrive in about 8 minutes. Please make sure the appliance is accessible.",
      time: timestamp(),
    },
  ])
  const [input, setInput] = useState('')
  const replyIndexRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const container = mapRef.current
    if (!container) return

    const map = L.map(container, {
      center: USER_LOCATION,
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: false,
    })

    L.tileLayer(TILE_URL, { subdomains: 'abcd', attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map)

    const userIcon = L.divIcon({
      className: '',
      html: '<span style="width:16px;height:16px;background:#15B877;border:3px solid white;border-radius:50%;display:block;box-shadow:0 0 0 4px #15B87733"></span>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    L.marker(USER_LOCATION, { icon: userIcon }).addTo(map)

    const techIcon = L.divIcon({
      className: '',
      html: '<span style="width:14px;height:14px;background:#FFD21E;border:3px solid white;border-radius:50%;display:block"></span>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    })
    const techMarker = L.marker(TECH_START, { icon: techIcon }).addTo(map)

    let step = 0
    const interval = setInterval(() => {
      step += 1
      const t = step / ANIMATION_STEPS
      techMarker.setLatLng([lerp(TECH_START[0], USER_LOCATION[0], t), lerp(TECH_START[1], USER_LOCATION[1], t)])
      setEta(Math.max(0, Math.round((1 - t) * 8)))
      if (step >= ANIMATION_STEPS) {
        clearInterval(interval)
        setArrived(true)
      }
    }, ANIMATION_INTERVAL_MS)

    return () => {
      clearInterval(interval)
      map.remove()
    }
  }, [])

  function sendMessage() {
    if (!input.trim()) return
    const userMsg: Message = { id: `u-${Date.now()}`, from: 'user', text: input.trim(), time: timestamp() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    const replyText = AUTO_REPLIES[replyIndexRef.current % AUTO_REPLIES.length]
    replyIndexRef.current += 1
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `t-${Date.now()}`, from: 'technician', text: replyText, time: timestamp() },
      ])
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-mint-50 font-sans text-brand-ink antialiased flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-mint-100 px-6 h-14 flex items-center relative">
        <Link to="/dashboard" className="text-sm font-semibold text-brand-ink/60 hover:text-brand-ink flex items-center gap-1">
          ← Dashboard
        </Link>
        <img
          src="/logo/fih-logo-b.svg"
          alt="Fix-It Hub"
          className="h-7 w-auto absolute left-1/2 -translate-x-1/2"
        />
      </header>

      {/* Map */}
      <div ref={mapRef} className="h-72 w-full flex-shrink-0" />

      {/* Status bar */}
      <div className="bg-white border-b border-mint-100 px-6 py-4 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
            BS
          </span>
          <div>
            <p className="font-extrabold text-sm">Budi Santoso</p>
            <p className="text-xs text-brand-ink/50">Verified Pro · ⭐ 4.9</p>
          </div>
        </div>
        <div className="text-right">
          {arrived ? (
            <p className="font-bold text-brand text-sm">Arrived ✓</p>
          ) : (
            <>
              <p className="flex items-center gap-1.5 font-bold text-sm justify-end">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse inline-block" />
                On the way
              </p>
              <p className="text-xs text-brand-ink/50">~{eta} min</p>
            </>
          )}
        </div>
      </div>

      {/* Chat thread */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-6 pb-28 overflow-y-auto">
        <p className="text-xs text-center text-brand-ink/40 mb-6 font-semibold uppercase tracking-wide">Today</p>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-3 text-sm font-medium
                  ${msg.from === 'user'
                    ? 'bg-brand text-white rounded-2xl rounded-br-none'
                    : 'bg-white text-brand-ink rounded-2xl rounded-bl-none border border-mint-100'}`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-white/60' : 'text-brand-ink/40'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky input bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-mint-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Message Budi…"
            className="flex-1 border border-mint-100 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand"
          />
          <button
            disabled={!input.trim()}
            onClick={sendMessage}
            aria-label="Send"
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-600 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run BookingConfirmed tests — expect all pass**

```bash
npm test -- BookingConfirmed
```

Expected: all 5 pass

- [ ] **Step 5: Run the full test suite**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 6: Commit App.tsx + new pages together**

```bash
git add src/App.tsx src/pages/BookingConfirmed.tsx src/pages/BookingConfirmed.test.tsx
git commit -m "feat: add BookingConfirmed page with live tracking map and technician chat"
```

---

## Done — Verification Checklist

After all tasks are complete, start the dev server and verify manually:

```bash
npm run dev
```

- [ ] NavBar shows the Fix-It Hub black logo (no wrench icon/text)
- [ ] Footer shows the yellow logo on dark background
- [ ] Clicking "Services" / "How it works" / "Trust" from `/ai-diagnose` navigates to `/#services` etc.
- [ ] LiveMap preview has all dots on land (none in the sea east of Surabaya)
- [ ] Clicking an AC & HVAC card → `/book/ac-hvac` → Step 1 shows "AC & HVAC" headline + problem list
- [ ] Checking problems updates the price estimate
- [ ] Step 2 calendar renders current month; Next disabled until date + slot selected
- [ ] Step 3 shows Tower 1 ITS address, order summary, platform fee
- [ ] "Confirm Booking" navigates to `/booking-confirmed/001`
- [ ] Tracking map shows two pins; technician pin moves toward your location over ~45s
- [ ] ETA counts down; "Arrived ✓" appears when animation completes
- [ ] Typing and sending a message → auto-reply appears after ~1.5s
