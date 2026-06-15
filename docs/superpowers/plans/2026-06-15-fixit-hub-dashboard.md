# Fix-It Hub Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the logged-in Dashboard page (`/dashboard`) as a set of section components that reproduce the content of `mockups/mockup-c-dashboard.html` (home health hero, quick categories, my appliances, upcoming booking, AI promo, recommended technicians), replacing the Plan 1 placeholder.

**Architecture:** The Dashboard is composed of presentational section components under `src/components/dashboard/`, each reading directly from the existing `src/data/*` modules (`appliances`, `bookings`, `technicians`, `categories`) — no new data files, no new business logic, no new routes. The page reuses the shared `NavBar`/`Footer` site shell (same as `Landing` and `AIDiagnose`) instead of mockup-c's separate sidebar/topbar app-shell, keeping single-page-app navigation consistent across all three existing routes.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS (`tailwind.config.ts` from Plan 1), React Router (`react-router-dom`), lucide-react icons, Vitest + React Testing Library (jsdom).

---

## Context for the implementer

- `App.tsx` already routes `/dashboard` to `Dashboard` — **no routing changes needed**.
- `src/data/appliances.ts`, `src/data/bookings.ts`, `src/data/technicians.ts`, `src/data/categories.ts` already exist and are fully populated (built in Plans 1-2 specifically so Plan 4 could consume them without changes). **Do not modify these files.**
- `src/components/landing/MaintenanceLog.tsx` (Landing page) already shows a "My Appliances" preview with a hardcoded **"Home health 78%"** badge, taken from the mockups. Task 1 below reuses this same `78%` figure for cross-page consistency — do not compute a different "home health" number.
- Follow existing component conventions: components take no props and import data directly (see `ServicesGrid.tsx`, `MaintenanceLog.tsx`, `TrustBand.tsx`). Tests follow the `render(<X />, { wrapper: MemoryRouter })` + `@testing-library/react` + `vitest` pattern seen in `CTA.test.tsx` / `ServicesGrid.test.tsx`. Only wrap in `MemoryRouter` when the component renders a react-router `<Link>`.
- Run a single test file with: `npx vitest run <path>`. Run the full suite with `npm test`.

---

## File Structure

- Create: `src/components/dashboard/HeroSection.tsx` + `.test.tsx`
- Create: `src/components/dashboard/QuickCategories.tsx` + `.test.tsx`
- Create: `src/components/dashboard/MyAppliances.tsx` + `.test.tsx`
- Create: `src/components/dashboard/UpcomingBooking.tsx` + `.test.tsx`
- Create: `src/components/dashboard/AIPromo.tsx` + `.test.tsx`
- Create: `src/components/dashboard/RecommendedTechnicians.tsx` + `.test.tsx`
- Modify: `src/pages/Dashboard.tsx` (replace the Plan 1 placeholder entirely)
- Create: `src/pages/Dashboard.test.tsx`

---

### Task 1: Hero section (greeting + home health summary)

**Files:**
- Create: `src/components/dashboard/HeroSection.tsx`
- Test: `src/components/dashboard/HeroSection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HeroSection from './HeroSection'

describe('HeroSection', () => {
  it('renders the greeting and home health summary', () => {
    render(<HeroSection />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: /Good morning, Budi/ })).toBeInTheDocument()
    expect(screen.getByText('78%')).toBeInTheDocument()
    expect(screen.getByText('1 appliance needs attention')).toBeInTheDocument()
  })

  it('links "Diagnose with AI" to /ai-diagnose and "Book a technician" to the technicians section', () => {
    render(<HeroSection />, { wrapper: MemoryRouter })

    expect(screen.getByRole('link', { name: /Diagnose with AI/ })).toHaveAttribute('href', '/ai-diagnose')
    expect(screen.getByRole('link', { name: /Book a technician/ })).toHaveAttribute('href', '#technicians')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/dashboard/HeroSection.test.tsx`
Expected: FAIL — `HeroSection.tsx` does not exist yet.

- [ ] **Step 3: Write the implementation**

```tsx
import { Link } from 'react-router-dom'
import { CalendarPlus, MapPin, ScanSearch } from 'lucide-react'
import { appliances } from '../../data/appliances'

export default function HeroSection() {
  const needsAttentionCount = appliances.filter((appliance) => appliance.status === 'Needs attention').length

  return (
    <section className="rounded-3xl bg-brand text-white p-7 md:p-9 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-16 w-64 h-64 rounded-full bg-white/10" />
      <div className="absolute right-16 -top-12 w-40 h-40 rounded-full bg-white/10" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-white/80 text-sm flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Surabaya, Jawa Timur
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Good morning, Budi 👋</h1>
          <p className="text-white/80 mt-1.5">Something wrong with a home appliance? Let&apos;s fix it.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/ai-diagnose"
              className="bg-white text-brand-ink font-bold text-sm px-5 py-2.5 rounded-full hover:bg-mint-50 inline-flex items-center gap-2"
            >
              <ScanSearch className="w-4 h-4 text-brand" /> Diagnose with AI
            </Link>
            <a
              href="#technicians"
              className="bg-brand-ink/30 border border-white/30 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-brand-ink/50 inline-flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" /> Book a technician
            </a>
          </div>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center min-w-[160px]">
          <p className="text-xs text-white/70 font-semibold">HOME HEALTH</p>
          <p className="text-5xl font-extrabold mt-1">78%</p>
          {needsAttentionCount > 0 && (
            <p className="text-xs text-sun font-semibold mt-1">{needsAttentionCount} appliance needs attention</p>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/dashboard/HeroSection.test.tsx`
Expected: PASS (2/2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/HeroSection.tsx src/components/dashboard/HeroSection.test.tsx
git commit -m "Add dashboard hero section with home health summary"
```

---

### Task 2: Quick categories section

**Files:**
- Create: `src/components/dashboard/QuickCategories.tsx`
- Test: `src/components/dashboard/QuickCategories.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { categories } from '../../data/categories'
import QuickCategories from './QuickCategories'

describe('QuickCategories', () => {
  it('renders a card for every service category', () => {
    render(<QuickCategories />)

    expect(screen.getByRole('heading', { name: 'Our services' })).toBeInTheDocument()
    for (const category of categories) {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/dashboard/QuickCategories.test.tsx`
Expected: FAIL — `QuickCategories.tsx` does not exist yet.

- [ ] **Step 3: Write the implementation**

```tsx
import { categories } from '../../data/categories'

export default function QuickCategories() {
  return (
    <section>
      <h2 className="font-extrabold text-lg mb-4">Our services</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <div key={category.name} className="bg-white rounded-2xl p-4 text-center shadow-card">
              <span className="w-11 h-11 mx-auto rounded-xl bg-mint-100 grid place-items-center">
                <Icon className={`w-5 h-5 ${category.iconColor}`} />
              </span>
              <p className="text-xs font-bold mt-2">{category.name}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/dashboard/QuickCategories.test.tsx`
Expected: PASS (1/1 test)

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/QuickCategories.tsx src/components/dashboard/QuickCategories.test.tsx
git commit -m "Add dashboard quick categories section"
```

---

### Task 3: My appliances section

**Files:**
- Create: `src/components/dashboard/MyAppliances.tsx`
- Test: `src/components/dashboard/MyAppliances.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { appliances } from '../../data/appliances'
import MyAppliances from './MyAppliances'

describe('MyAppliances', () => {
  it('renders a row for every appliance with its health percentage', () => {
    render(<MyAppliances />)

    expect(screen.getByRole('heading', { name: 'My appliances' })).toBeInTheDocument()
    for (const appliance of appliances) {
      expect(screen.getByText(appliance.name)).toBeInTheDocument()
    }
    expect(screen.getByText('91%')).toBeInTheDocument()
  })

  it('shows a "Book now" link to the technicians section for appliances needing attention', () => {
    render(<MyAppliances />)

    expect(screen.getByRole('link', { name: 'Book now' })).toHaveAttribute('href', '#technicians')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/dashboard/MyAppliances.test.tsx`
Expected: FAIL — `MyAppliances.tsx` does not exist yet.

- [ ] **Step 3: Write the implementation**

```tsx
import { Plus } from 'lucide-react'
import { appliances } from '../../data/appliances'
import { categories } from '../../data/categories'

export default function MyAppliances() {
  return (
    <section className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-extrabold text-lg">My appliances</h2>
        <button type="button" className="text-sm font-bold text-brand inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {appliances.map((appliance) => {
          const categoryMeta = categories.find((category) => category.name === appliance.category)
          const Icon = categoryMeta?.icon
          const needsAttention = appliance.status === 'Needs attention'

          return (
            <div
              key={appliance.id}
              className={`flex items-center gap-4 p-3 rounded-2xl border ${
                needsAttention ? 'border-red-100 bg-red-50/40' : 'border-mint-100'
              }`}
            >
              <span className="w-12 h-12 rounded-xl bg-mint-100 grid place-items-center">
                {Icon && <Icon className={`w-6 h-6 ${categoryMeta?.iconColor ?? 'text-brand'}`} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{appliance.name}</p>
                {needsAttention ? (
                  <p className="text-xs text-red-400 font-semibold">Needs attention · service overdue</p>
                ) : (
                  <p className="text-xs text-brand-ink/45">
                    {appliance.model} · last serviced {appliance.lastService}
                  </p>
                )}
                <div className={`h-1.5 rounded-full mt-2 w-40 max-w-full ${needsAttention ? 'bg-red-100' : 'bg-mint-100'}`}>
                  <div
                    className={`h-full rounded-full ${needsAttention ? 'bg-red-400' : 'bg-brand'}`}
                    style={{ width: `${appliance.healthPercent}%` }}
                  />
                </div>
              </div>
              {needsAttention ? (
                <a
                  href="#technicians"
                  className="text-xs font-bold text-white bg-brand px-3 py-2 rounded-lg hover:bg-brand-600"
                >
                  Book now
                </a>
              ) : (
                <div className="text-right">
                  <p className="font-extrabold text-brand">{appliance.healthPercent}%</p>
                  <p className="text-[11px] text-brand-ink/45">{appliance.status}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/dashboard/MyAppliances.test.tsx`
Expected: PASS (2/2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/MyAppliances.tsx src/components/dashboard/MyAppliances.test.tsx
git commit -m "Add dashboard my appliances section"
```

---

### Task 4: Upcoming booking and AI promo widgets

**Files:**
- Create: `src/components/dashboard/UpcomingBooking.tsx`
- Test: `src/components/dashboard/UpcomingBooking.test.tsx`
- Create: `src/components/dashboard/AIPromo.tsx`
- Test: `src/components/dashboard/AIPromo.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/dashboard/UpcomingBooking.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { bookings } from '../../data/bookings'
import UpcomingBooking from './UpcomingBooking'

describe('UpcomingBooking', () => {
  it('renders the technician, date, and price for the first booking', () => {
    render(<UpcomingBooking />)

    const booking = bookings[0]
    expect(screen.getByRole('heading', { name: 'Upcoming' })).toBeInTheDocument()
    expect(screen.getByText(booking.technician)).toBeInTheDocument()
    expect(screen.getByText(booking.date)).toBeInTheDocument()
    expect(screen.getByText(booking.price)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Track' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Message' })).toBeInTheDocument()
  })
})
```

```tsx
// src/components/dashboard/AIPromo.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AIPromo from './AIPromo'

describe('AIPromo', () => {
  it('links "Start scan" to /ai-diagnose', () => {
    render(<AIPromo />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: 'Auto-diagnose via camera' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Start scan/ })).toHaveAttribute('href', '/ai-diagnose')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/dashboard/UpcomingBooking.test.tsx src/components/dashboard/AIPromo.test.tsx`
Expected: FAIL — neither component exists yet.

- [ ] **Step 3: Write the implementations**

```tsx
// src/components/dashboard/UpcomingBooking.tsx
import { Calendar } from 'lucide-react'
import { bookings } from '../../data/bookings'
import { technicians } from '../../data/technicians'

export default function UpcomingBooking() {
  const booking = bookings[0]
  const technician = technicians.find((tech) => tech.id === booking.technicianId)

  return (
    <section className="bg-white rounded-3xl shadow-card p-6">
      <h2 className="font-extrabold text-lg mb-4">Upcoming</h2>
      <div className="rounded-2xl bg-mint-50 p-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-10 h-10 rounded-full text-white grid place-items-center text-xs font-bold ${technician?.avatarColor ?? 'bg-brand'}`}
          >
            {technician?.avatarSeed}
          </span>
          <div>
            <p className="font-bold text-sm">{booking.technician}</p>
            <p className="text-xs text-brand-ink/45">
              {booking.service} · {technician?.rating}★
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-brand-ink/60">
            <Calendar className="w-4 h-4" /> {booking.date}
          </span>
          <span className="font-extrabold text-brand">{booking.price}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" className="flex-1 bg-brand text-white text-xs font-bold py-2 rounded-lg hover:bg-brand-600">
            Track
          </button>
          <button type="button" className="flex-1 bg-white border border-mint-200 text-xs font-bold py-2 rounded-lg">
            Message
          </button>
        </div>
      </div>
    </section>
  )
}
```

```tsx
// src/components/dashboard/AIPromo.tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function AIPromo() {
  return (
    <section className="bg-brand-ink text-white rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-brand/30 blur-2xl" />
      <span className="text-xs font-extrabold text-brand uppercase tracking-wide">AI diagnostic engine</span>
      <h3 className="font-bold text-lg mt-2 leading-snug">Auto-diagnose via camera</h3>
      <p className="text-sm text-white/60 mt-1">Upload a photo → AI spots the issue → matches a technician.</p>
      <Link
        to="/ai-diagnose"
        className="mt-4 inline-flex items-center gap-2 bg-brand font-bold text-sm px-4 py-2 rounded-full hover:bg-brand-600"
      >
        Start scan <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/dashboard/UpcomingBooking.test.tsx src/components/dashboard/AIPromo.test.tsx`
Expected: PASS (2/2 tests total)

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/UpcomingBooking.tsx src/components/dashboard/UpcomingBooking.test.tsx src/components/dashboard/AIPromo.tsx src/components/dashboard/AIPromo.test.tsx
git commit -m "Add dashboard upcoming booking and AI promo widgets"
```

---

### Task 5: Recommended technicians section

**Files:**
- Create: `src/components/dashboard/RecommendedTechnicians.tsx`
- Test: `src/components/dashboard/RecommendedTechnicians.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { technicians } from '../../data/technicians'
import RecommendedTechnicians from './RecommendedTechnicians'

describe('RecommendedTechnicians', () => {
  it('renders a card for the top 3 technicians with a Book action', () => {
    render(<RecommendedTechnicians />)

    expect(screen.getByRole('heading', { name: 'Top-rated technicians near you' })).toBeInTheDocument()

    const featured = technicians.slice(0, 3)
    for (const tech of featured) {
      expect(screen.getByText(tech.name)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: `Book ${tech.name}` })).toBeInTheDocument()
    }
  })

  it('does not render technicians beyond the top 3', () => {
    render(<RecommendedTechnicians />)

    const remaining = technicians.slice(3)
    for (const tech of remaining) {
      expect(screen.queryByText(tech.name)).not.toBeInTheDocument()
    }
  })

  it('has an id of "technicians" for in-page navigation', () => {
    render(<RecommendedTechnicians />)

    expect(document.getElementById('technicians')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/dashboard/RecommendedTechnicians.test.tsx`
Expected: FAIL — `RecommendedTechnicians.tsx` does not exist yet.

- [ ] **Step 3: Write the implementation**

```tsx
import { BadgeCheck, Star } from 'lucide-react'
import { technicians } from '../../data/technicians'

const FEATURED_COUNT = 3

export default function RecommendedTechnicians() {
  const featured = technicians.slice(0, FEATURED_COUNT)

  return (
    <section id="technicians">
      <h2 className="font-extrabold text-lg mb-4">Top-rated technicians near you</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((tech) => (
          <div key={tech.id} className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-center gap-3">
              <span className={`w-12 h-12 rounded-xl text-white grid place-items-center font-bold ${tech.avatarColor}`}>
                {tech.avatarSeed}
              </span>
              <div>
                <p className="font-bold text-sm flex items-center gap-1">
                  {tech.name}
                  {tech.verified && <BadgeCheck className="w-4 h-4 text-brand" />}
                </p>
                <p className="text-xs text-brand-ink/45">
                  {tech.specialties[0]} · {tech.yearsExperience} yrs
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tech.badges.map((badge) => (
                <span key={badge} className="text-[11px] font-semibold bg-mint-100 text-brand-700 px-2 py-1 rounded-md">
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-sun fill-sun" /> {tech.rating} · {tech.reviewCount}
              </span>
              <span className="font-bold text-brand">from {tech.priceFrom}</span>
            </div>
            <button
              type="button"
              aria-label={`Book ${tech.name}`}
              className="mt-4 w-full text-sm font-bold text-white bg-brand py-2 rounded-lg hover:bg-brand-600"
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/dashboard/RecommendedTechnicians.test.tsx`
Expected: PASS (3/3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/RecommendedTechnicians.tsx src/components/dashboard/RecommendedTechnicians.test.tsx
git commit -m "Add dashboard recommended technicians section"
```

---

### Task 6: Wire up the Dashboard page

**Files:**
- Modify: `src/pages/Dashboard.tsx` (replace entire contents — removes the `LayoutDashboard` placeholder from Plan 1)
- Create: `src/pages/Dashboard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('renders all major sections', () => {
    render(<Dashboard />, { wrapper: MemoryRouter })

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Good morning, Budi/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our services' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'My appliances' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Upcoming' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Auto-diagnose via camera' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Top-rated technicians near you' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/Dashboard.test.tsx`
Expected: FAIL — current `Dashboard.tsx` only renders the Plan 1 placeholder, none of the expected headings exist.

- [ ] **Step 3: Replace `src/pages/Dashboard.tsx`**

```tsx
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/dashboard/HeroSection'
import QuickCategories from '../components/dashboard/QuickCategories'
import MyAppliances from '../components/dashboard/MyAppliances'
import UpcomingBooking from '../components/dashboard/UpcomingBooking'
import AIPromo from '../components/dashboard/AIPromo'
import RecommendedTechnicians from '../components/dashboard/RecommendedTechnicians'

function Dashboard() {
  return (
    <div className="font-sans text-brand-ink bg-white antialiased min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 bg-mint-50">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <HeroSection />
          <QuickCategories />
          <div className="grid lg:grid-cols-3 gap-6">
            <MyAppliances />
            <div className="space-y-6">
              <UpcomingBooking />
              <AIPromo />
            </div>
          </div>
          <RecommendedTechnicians />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/Dashboard.test.tsx`
Expected: PASS (1/1 test)

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: All test files pass (24 files: 18 existing + 6 new `src/components/dashboard/*.test.tsx` + 1 new `src/pages/Dashboard.test.tsx`, minus 1 since `Dashboard.test.tsx` is new not additional... i.e. 18 existing files + 7 new files = 25 files total, all passing).

- [ ] **Step 6: Type-check**

Run: `npx tsc -b --noEmit`
Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Dashboard.tsx src/pages/Dashboard.test.tsx
git commit -m "Wire up Dashboard page with all sections"
```

---

## Out of scope / deferred (intentional)

- **Sidebar app-shell, topbar search/notifications/profile chip, mobile bottom nav** from `mockup-c-dashboard.html`: this plan reuses the shared `NavBar`/`Footer` site shell (consistent with `Landing` and `AIDiagnose`) instead of building a second, separate "logged-in app" shell. A future plan could add an app-shell variant if the exhibition demo calls for it.
- **"Book" / "Track" / "Message" / "Add" actions**: rendered as static, non-navigating `<button>`s (matching the mockup, which also has no real actions for these). "Diagnose with AI" (→ `/ai-diagnose`) and "Start scan" (→ `/ai-diagnose`) are the only functional cross-page links; "Book a technician" (hero) and "Book now" (needs-attention appliance) are in-page anchors to `#technicians`.
- **Authentication / real user data**: "Budi", "Surabaya, Jawa Timur", and "78%" home health are static demo content matching the mockup and `MaintenanceLog.tsx`, consistent with the rest of the app's demo-mode approach.

---

## Self-review notes

- **Spec coverage**: Greeting + home health hero ✅ Task 1. Quick categories grid (6 categories) ✅ Task 2. My appliances list with health bars and "needs attention" treatment ✅ Task 3. Upcoming booking card ✅ Task 4. AI promo card linking to AI Diagnose ✅ Task 4. Recommended technicians (top 3, with Book action) ✅ Task 5. Full page composition replacing the Plan 1 placeholder ✅ Task 6.
- **Placeholder scan**: no TBD/TODO markers; every task has complete component code, complete test code, and exact commands with expected output.
- **Type consistency**: all components consume existing types (`Appliance`, `Booking`, `Technician`, `ServiceCategory`) from `src/data/*` without modification. No component takes props, matching the established pattern (`ServicesGrid`, `MaintenanceLog`, `TrustBand`). `Dashboard.tsx`'s imports match the exported default names from Tasks 1-5 exactly (`HeroSection`, `QuickCategories`, `MyAppliances`, `UpcomingBooking`, `AIPromo`, `RecommendedTechnicians`).
- **Cross-page consistency**: Task 1's "78%" home health figure matches `MaintenanceLog.tsx`'s existing "Home health 78%" badge on the Landing page. Task 1's "Diagnose with AI" → `/ai-diagnose` and Task 4's "Start scan" → `/ai-diagnose` both reuse the same route as `NavBar`'s "AI Diagnostics" link and `TrustBand`'s "AI diagnostics" card.
- **Deliberate deviations from the mockup**: the mockup's "78<span class='text-2xl'>%</span>" two-size number is rendered as a single "78%" text node (simpler, more testable, visually equivalent at a glance). The mockup's "⚡ AI DIAGNOSTIC ENGINE" label drops the lightning-bolt emoji (Task 4) for consistency with the rest of the app's icon-driven (not emoji-driven) visual language — the "Good morning, Budi 👋" emoji from the mockup is kept (Task 1) since it's part of the greeting copy itself.
