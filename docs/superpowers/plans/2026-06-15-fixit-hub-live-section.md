# Fix-It Hub Live Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Fix-It Hub Live" social-proof section to the Landing page showing a live-jittering "pros working" counter, 4 stat cards, a Leaflet map with pulsing job markers across Surabaya, and a scrolling anonymized activity feed — all simulated client-side, no backend dependency.

**Architecture:** A static data module (`data/liveActivity.ts`) defines categories, neighborhoods, and stat cards. A pure-function module (`lib/liveSimulation.ts`) wraps every `Math.random()` call so the random logic is unit-testable via `vi.spyOn(Math, 'random')`. Four presentational components (`LiveStats`, `LiveActivityFeed`, `LiveMap`, `LiveSection`) consume these. All randomness/timers run inside `useEffect`/`setInterval` callbacks (post-render), never during render, to satisfy the `react-hooks/purity` ESLint rule. `LiveSection` is wired into `Landing.tsx` between `ServicesGrid` and `TrustBand`, replacing a stale placeholder comment.

**Tech Stack:** React 19 + TypeScript + Vite, Tailwind (brand/mint/sun/poster design system), `leaflet` ^1.9.4 + `@types/leaflet` (already added to `package.json`/`package-lock.json` in this environment, not yet committed), Vitest + Testing Library (jsdom).

---

## Context

This is **Plan 5** in the re-sequenced plan order (Foundation → Landing → Dashboard → AI Diagnose → **Live Section**). The original design spec called this "Plan 3" and `Landing.tsx` still has a leftover placeholder comment from that numbering:

```tsx
{/* Plan 3 inserts <LiveSection /> here, between Services and Trust */}
```

This plan replaces that comment with the real `<LiveSection />` usage.

**Leaflet-only simplification (user-approved):** The original design spec described a Mapbox-with-Leaflet-fallback approach (`VITE_MAPBOX_TOKEN` env branching). The user explicitly approved a **Leaflet-only** implementation for this plan — no Mapbox SDK, no token, no env branching. The map uses free CARTO dark-tile raster tiles (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`), with an on-map badge reading "Preview map · production = Mapbox in brand green" to communicate the production intent without building it. **`VITE_MAPBOX_TOKEN` / Mapbox integration is explicitly out of scope for this plan** (see "Out of scope" section at the end).

**Leaflet + jsdom verified working:** A spike was run in this environment confirming `L.map()`, `L.tileLayer()`, and `L.marker()` with `L.divIcon()` all initialize and render real DOM nodes (including custom CSS classes like `.jobdot`) inside Vitest's jsdom environment — even with a 0×0 container (jsdom doesn't compute layout) and under `vi.useFakeTimers()`. **No `vi.mock('leaflet')` is needed anywhere** — component tests assert against Leaflet's real rendered DOM.

**Reference mockup:** `mockups/mockup-d-blend-landing.html` (the "current favored direction" mockup) contains the full HTML/CSS/JS reference for this section — badge, poster headline with `#liveCount`, 4 stat cards, map with `.jobdot` markers, activity feed with `.feed-enter` items, and the `setInterval` simulation loop. This plan reimplements that simulation as React components + testable pure functions.

**Display-only category vocabulary:** The Live section's categories (`AC repair`, `Fridge service`, `Washer fix`, `TV repair`, `Water heater`) are intentionally a *different*, display-only vocabulary from the canonical category strings (`AC & HVAC`, `Refrigerator`, etc.) used by `lookupApplianceSpec`/`matchTechnicians`. This section has no backend/matching dependency — it's a purely decorative simulation — so no mapping between vocabularies is needed.

---

## File Structure

- **Create** `src/data/liveActivity.ts` — static data: map center, 5 categories (name/color/icon), 10 neighborhood names, 4 stat cards.
- **Create** `src/data/liveActivity.test.ts` — sanity tests on the static data shapes.
- **Create** `src/lib/liveSimulation.ts` — pure functions wrapping all `Math.random()` calls: `pickRandomItem`, `jitterCount`, `randomRating`, `isJobCompleted`, `randomOffset`, `createJobMarker`, `createFeedItem`. Exports `JobMarker`, `FeedItem`, `JobStatus` types.
- **Create** `src/lib/liveSimulation.test.ts` — TDD tests for all of the above using `vi.spyOn(Math, 'random')`.
- **Create** `src/components/landing/LiveStats.tsx` — renders the 4 stat cards from `LIVE_STATS`.
- **Create** `src/components/landing/LiveStats.test.tsx`
- **Create** `src/components/landing/LiveActivityFeed.tsx` — seeds 6 feed items, adds a new one every ~5.2s (capped at 7).
- **Create** `src/components/landing/LiveActivityFeed.test.tsx`
- **Create** `src/components/landing/LiveMap.tsx` — Leaflet map with 22 seeded pulsing job markers, adds/removes a marker every ~5.2s/9s.
- **Create** `src/components/landing/LiveMap.test.tsx`
- **Create** `src/components/landing/LiveSection.tsx` — composes badge + jittering headline + `LiveStats` + `LiveMap` + `LiveActivityFeed` into the `<section id="live">`.
- **Create** `src/components/landing/LiveSection.test.tsx`
- **Modify** `src/index.css` — append `.jobdot`/`@keyframes ping`, `.livedot`/`@keyframes beat`, `.feed-enter`/`@keyframes popin`, `.live-map` Leaflet container overrides.
- **Modify** `src/pages/Landing.tsx` — import and render `<LiveSection />`, remove the stale "Plan 3" comment.
- **Modify** `src/pages/Landing.test.tsx` — add an assertion for the new Live section.
- **Modify** `package.json` / `package-lock.json` — `leaflet` + `@types/leaflet` (already installed in this environment; the install step below is idempotent and the task should commit these files).

---

## Task 1: Dependencies, CSS, and live-activity data module

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify: `src/index.css`
- Create: `src/data/liveActivity.ts`
- Test: `src/data/liveActivity.test.ts`

- [ ] **Step 1: Confirm Leaflet dependencies are installed**

Run: `npm install leaflet @types/leaflet`

This is idempotent — `leaflet@^1.9.4` and `@types/leaflet@^1.9.21` are already present in `package.json`'s `dependencies`/`devDependencies` in this environment (uncommitted). Running the command again confirms `node_modules` is in sync and leaves `package.json`/`package-lock.json` ready to commit.

- [ ] **Step 2: Write the failing data test**

Create `src/data/liveActivity.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { LIVE_AREAS, LIVE_CATEGORIES, LIVE_CENTER, LIVE_STATS } from './liveActivity'

describe('liveActivity data', () => {
  it('defines a Surabaya map center', () => {
    expect(LIVE_CENTER).toEqual([-7.2575, 112.7521])
  })

  it('defines 5 service categories with unique colors', () => {
    expect(LIVE_CATEGORIES).toHaveLength(5)
    const colors = new Set(LIVE_CATEGORIES.map((category) => category.color))
    expect(colors.size).toBe(5)
  })

  it('defines 10 neighborhood areas', () => {
    expect(LIVE_AREAS).toHaveLength(10)
  })

  it('defines 4 stat cards', () => {
    expect(LIVE_STATS).toHaveLength(4)
    expect(LIVE_STATS.map((stat) => stat.label)).toEqual([
      'repairs this week',
      'verified pros',
      'avg rating',
      'cities live',
    ])
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/data/liveActivity.test.ts`
Expected: FAIL — `Cannot find module './liveActivity'` (file doesn't exist yet).

- [ ] **Step 4: Create the data module**

Create `src/data/liveActivity.ts`:

```ts
import type { LucideIcon } from 'lucide-react'
import { Droplets, MapPin, Refrigerator, ShieldCheck, Star, Tv, WashingMachine, Wind, Wrench } from 'lucide-react'

export const LIVE_CENTER: [number, number] = [-7.2575, 112.7521]

export interface LiveCategory {
  name: string
  color: string
  icon: LucideIcon
}

export const LIVE_CATEGORIES: LiveCategory[] = [
  { name: 'AC repair', color: '#22e07a', icon: Wind },
  { name: 'Fridge service', color: '#3B82F6', icon: Refrigerator },
  { name: 'Washer fix', color: '#8B5CF6', icon: WashingMachine },
  { name: 'TV repair', color: '#EC4899', icon: Tv },
  { name: 'Water heater', color: '#22d3ee', icon: Droplets },
]

export const LIVE_AREAS: string[] = [
  'Gubeng',
  'Wonokromo',
  'Tegalsari',
  'Mulyorejo',
  'Sukolilo',
  'Rungkut',
  'Genteng',
  'Sawahan',
  'Tambaksari',
  'Wiyung',
]

export interface LiveStat {
  icon: LucideIcon
  value: string
  label: string
  accent: string
}

export const LIVE_STATS: LiveStat[] = [
  { icon: Wrench, value: '1,284', label: 'repairs this week', accent: 'text-sun' },
  { icon: ShieldCheck, value: '850+', label: 'verified pros', accent: 'text-white' },
  { icon: Star, value: '4.9★', label: 'avg rating', accent: 'text-white' },
  { icon: MapPin, value: '4', label: 'cities live', accent: 'text-white' },
]
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/data/liveActivity.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 6: Append Live-section CSS**

Append to the end of `src/index.css` (after the existing `.scan-line`/`@keyframes scan-sweep` block):

```css

.jobdot {
  position: relative;
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.jobdot::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid currentColor;
  animation: ping 1.9s ease-out infinite;
}

@keyframes ping {
  0% {
    transform: scale(0.5);
    opacity: 0.85;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

.livedot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22e07a;
  animation: beat 1.6s infinite;
}

@keyframes beat {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 224, 122, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(34, 224, 122, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 224, 122, 0);
  }
}

@keyframes popin {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.feed-enter {
  animation: popin 0.5s ease-out;
}

.live-map .leaflet-container {
  background: #0d2820;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.live-map .leaflet-control-attribution {
  font-size: 9px;
  opacity: 0.6;
}
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/index.css src/data/liveActivity.ts src/data/liveActivity.test.ts
git commit -m "Add live-activity data module, Leaflet dependency, and live-section CSS"
```

---

## Task 2: Pure simulation functions (`lib/liveSimulation.ts`)

**Files:**
- Create: `src/lib/liveSimulation.ts`
- Test: `src/lib/liveSimulation.test.ts`

This module wraps every `Math.random()` call used by the Live section so it can be deterministically tested. `createJobMarker`/`createFeedItem` take a caller-supplied `id` string (no `Date.now()`/`crypto` needed — callers manage their own counters).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/liveSimulation.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LIVE_AREAS, LIVE_CATEGORIES, LIVE_CENTER } from '../data/liveActivity'
import {
  createFeedItem,
  createJobMarker,
  isJobCompleted,
  jitterCount,
  pickRandomItem,
  randomOffset,
  randomRating,
} from './liveSimulation'

describe('liveSimulation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('pickRandomItem', () => {
    it('returns the first item when Math.random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(pickRandomItem(['a', 'b', 'c'])).toBe('a')
    })

    it('returns the last item when Math.random returns just under 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999)
      expect(pickRandomItem(['a', 'b', 'c'])).toBe('c')
    })
  })

  describe('jitterCount', () => {
    it('decreases by 1 when random is below 0.5', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2)
      expect(jitterCount(45, 38, 59)).toBe(44)
    })

    it('increases by 1 when random is 0.5 or above', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.8)
      expect(jitterCount(45, 38, 59)).toBe(46)
    })

    it('clamps at the maximum', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.8)
      expect(jitterCount(59, 38, 59)).toBe(59)
    })

    it('clamps at the minimum', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2)
      expect(jitterCount(38, 38, 59)).toBe(38)
    })
  })

  describe('randomRating', () => {
    it('returns 4.3 when random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomRating()).toBe(4.3)
    })

    it('returns 5 when random returns just under 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999999)
      expect(randomRating()).toBe(5)
    })
  })

  describe('isJobCompleted', () => {
    it('returns false at or below the completion threshold', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      expect(isJobCompleted()).toBe(false)
    })

    it('returns true above the completion threshold', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.95)
      expect(isJobCompleted()).toBe(true)
    })
  })

  describe('randomOffset', () => {
    it('returns -spread/2 when random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomOffset(0.18)).toBeCloseTo(-0.09, 5)
    })

    it('returns spread/2 when random returns 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(1)
      expect(randomOffset(0.18)).toBeCloseTo(0.09, 5)
    })
  })

  describe('createJobMarker', () => {
    it('returns a marker with a valid shape', () => {
      const marker = createJobMarker('job-1')

      expect(marker.id).toBe('job-1')
      expect(LIVE_CATEGORIES.map((category) => category.name)).toContain(marker.category)
      expect(LIVE_AREAS).toContain(marker.area)
      expect(['In progress', 'Completed']).toContain(marker.status)
      expect(marker.rating).toBeGreaterThanOrEqual(4.3)
      expect(marker.rating).toBeLessThanOrEqual(5)
      expect(marker.lat).toBeGreaterThan(LIVE_CENTER[0] - 0.1)
      expect(marker.lat).toBeLessThan(LIVE_CENTER[0] + 0.1)
      expect(marker.lng).toBeGreaterThan(LIVE_CENTER[1] - 0.1)
      expect(marker.lng).toBeLessThan(LIVE_CENTER[1] + 0.1)
    })

    it('uses the completed color when the job is marked done', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0) // category pick -> first category
        .mockReturnValueOnce(0.95) // isJobCompleted -> true
        .mockReturnValueOnce(0.5) // lat offset
        .mockReturnValueOnce(0.5) // lng offset
        .mockReturnValueOnce(0) // area pick
        .mockReturnValueOnce(0) // rating

      const marker = createJobMarker('job-2')

      expect(marker.status).toBe('Completed')
      expect(marker.color).toBe('#FFD21E')
    })
  })

  describe('createFeedItem', () => {
    it('returns a feed item with a valid shape', () => {
      const item = createFeedItem('feed-1')

      expect(item.id).toBe('feed-1')
      expect(LIVE_CATEGORIES.map((category) => category.name)).toContain(item.category)
      expect(LIVE_AREAS).toContain(item.area)
      expect(['In progress', 'Completed']).toContain(item.status)
      expect(item.rating).toBeGreaterThanOrEqual(4.3)
      expect(item.rating).toBeLessThanOrEqual(5)
      expect(item.timeLabel).toBe('Just now')
    })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/liveSimulation.test.ts`
Expected: FAIL — `Cannot find module './liveSimulation'` (file doesn't exist yet).

- [ ] **Step 3: Implement the simulation module**

Create `src/lib/liveSimulation.ts`:

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
const COORDINATE_SPREAD = 0.18
const COMPLETED_COLOR = '#FFD21E'

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
    lat: LIVE_CENTER[0] + randomOffset(COORDINATE_SPREAD),
    lng: LIVE_CENTER[1] + randomOffset(COORDINATE_SPREAD),
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

**Important:** The order of `Math.random()` calls inside `createJobMarker` must match the test's mocked sequence exactly: category pick → `isJobCompleted` → lat offset → lng offset → area pick → rating. This order falls out naturally from the object literal's property evaluation order (left-to-right) plus the two `const` calls above it — do not reorder the properties in the returned object.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/liveSimulation.test.ts`
Expected: PASS (12 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/liveSimulation.ts src/lib/liveSimulation.test.ts
git commit -m "Add pure simulation functions for the live section"
```

---

## Task 3: `LiveStats` component

**Files:**
- Create: `src/components/landing/LiveStats.tsx`
- Test: `src/components/landing/LiveStats.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/LiveStats.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LiveStats from './LiveStats'
import { LIVE_STATS } from '../../data/liveActivity'

describe('LiveStats', () => {
  it('renders all stat cards with their values and labels', () => {
    render(<LiveStats />)

    LIVE_STATS.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument()
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/landing/LiveStats.test.tsx`
Expected: FAIL — `Cannot find module './LiveStats'` (file doesn't exist yet).

- [ ] **Step 3: Implement the component**

Create `src/components/landing/LiveStats.tsx`:

```tsx
import { LIVE_STATS } from '../../data/liveActivity'

export default function LiveStats() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
      {LIVE_STATS.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <Icon className={`w-6 h-6 ${stat.accent}`} />
            <p className={`font-poster text-3xl mt-3 ${stat.accent}`}>{stat.value}</p>
            <p className="text-sm text-white/55 mt-1">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/landing/LiveStats.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/LiveStats.tsx src/components/landing/LiveStats.test.tsx
git commit -m "Add LiveStats component"
```

---

## Task 4: `LiveActivityFeed` component

**Files:**
- Create: `src/components/landing/LiveActivityFeed.tsx`
- Test: `src/components/landing/LiveActivityFeed.test.tsx`

Seeds 6 feed items on mount (via `useState`'s lazy initializer — a one-time impure computation, which is the established pattern for purity-safe seeding in this codebase). Every 5.2s, prepends a new item and caps the list at 7.

- [ ] **Step 1: Write the failing tests**

Create `src/components/landing/LiveActivityFeed.test.tsx`:

```tsx
import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LiveActivityFeed from './LiveActivityFeed'

describe('LiveActivityFeed', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders 6 seeded feed items', () => {
    const { container } = render(<LiveActivityFeed />)
    expect(container.querySelectorAll('.feed-enter')).toHaveLength(6)
  })

  it('adds new items over time but caps the feed at 7', () => {
    const { container } = render(<LiveActivityFeed />)

    act(() => {
      vi.advanceTimersByTime(5200)
    })
    expect(container.querySelectorAll('.feed-enter')).toHaveLength(7)

    act(() => {
      vi.advanceTimersByTime(5200)
    })
    expect(container.querySelectorAll('.feed-enter')).toHaveLength(7)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/landing/LiveActivityFeed.test.tsx`
Expected: FAIL — `Cannot find module './LiveActivityFeed'` (file doesn't exist yet).

- [ ] **Step 3: Implement the component**

Create `src/components/landing/LiveActivityFeed.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { LIVE_CATEGORIES } from '../../data/liveActivity'
import { createFeedItem } from '../../lib/liveSimulation'
import type { FeedItem } from '../../lib/liveSimulation'

const FEED_INTERVAL_MS = 5200
const MAX_FEED_ITEMS = 7
const SEED_COUNT = 6

function iconFor(category: string) {
  return LIVE_CATEGORIES.find((item) => item.name === category)?.icon ?? LIVE_CATEGORIES[0].icon
}

export default function LiveActivityFeed() {
  const [items, setItems] = useState<FeedItem[]>(() =>
    Array.from({ length: SEED_COUNT }, (_, index) => createFeedItem(`seed-${index}`)),
  )
  const counterRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const next = createFeedItem(`feed-${counterRef.current}`)
      counterRef.current += 1
      setItems((current) => [next, ...current].slice(0, MAX_FEED_ITEMS))
    }, FEED_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2.5 h-[360px] overflow-y-auto">
      {items.map((item) => {
        const Icon = iconFor(item.category)
        return (
          <div
            key={item.id}
            className="feed-enter flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
          >
            <span
              className="w-9 h-9 rounded-full grid place-items-center shrink-0"
              style={{ backgroundColor: `${item.color}26`, color: item.color }}
            >
              <Icon className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {item.category} · {item.status}
              </p>
              <p className="text-xs text-white/55">
                {item.area} · ★ {item.rating.toFixed(1)} · {item.timeLabel}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/landing/LiveActivityFeed.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/LiveActivityFeed.tsx src/components/landing/LiveActivityFeed.test.tsx
git commit -m "Add LiveActivityFeed component"
```

---

## Task 5: `LiveMap` component (Leaflet)

**Files:**
- Create: `src/components/landing/LiveMap.tsx`
- Test: `src/components/landing/LiveMap.test.tsx`

Renders a Leaflet map centered on Surabaya with a CARTO dark tile layer, seeds 22 pulsing `.jobdot` markers via `createJobMarker`, and every 5.2s adds one more marker that is removed again after 9s. All Leaflet setup happens inside `useEffect`; cleanup calls `map.remove()` for React 19 `<StrictMode>` double-invoke safety (confirmed in `src/main.tsx`).

A spike in this environment confirmed real Leaflet (map + tile layer + `divIcon` markers) works cleanly in Vitest's jsdom environment, including with `vi.useFakeTimers()` — no mocking of the `leaflet` module is required.

- [ ] **Step 1: Write the failing tests**

Create `src/components/landing/LiveMap.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LiveMap from './LiveMap'

describe('LiveMap', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a Leaflet map with seeded job markers', () => {
    const { container } = render(<LiveMap />)

    expect(container.querySelector('.leaflet-container')).toBeInTheDocument()
    expect(container.querySelectorAll('.jobdot')).toHaveLength(22)
  })

  it('shows the preview badge and status legend', () => {
    render(<LiveMap />)

    expect(screen.getByText(/Preview map/i)).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/landing/LiveMap.test.tsx`
Expected: FAIL — `Cannot find module './LiveMap'` (file doesn't exist yet).

- [ ] **Step 3: Implement the component**

Create `src/components/landing/LiveMap.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LIVE_CENTER } from '../../data/liveActivity'
import { createJobMarker } from '../../lib/liveSimulation'

const SEED_MARKER_COUNT = 22
const MARKER_INTERVAL_MS = 5200
const MARKER_LIFETIME_MS = 9000
const MAP_ZOOM = 12
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<span class="jobdot" style="background:${color};color:${color}"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export default function LiveMap() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const map = L.map(container, {
      center: LIVE_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: false,
      scrollWheelZoom: false,
    })

    L.tileLayer(TILE_URL, { subdomains: 'abcd', attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map)

    let markerCounter = 0
    const addMarker = () => {
      const job = createJobMarker(`live-marker-${markerCounter}`)
      markerCounter += 1
      return L.marker([job.lat, job.lng], { icon: createMarkerIcon(job.color) }).addTo(map)
    }

    for (let i = 0; i < SEED_MARKER_COUNT; i += 1) {
      addMarker()
    }

    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    const interval = setInterval(() => {
      const marker = addMarker()
      const timeout = setTimeout(() => {
        map.removeLayer(marker)
        timeouts.delete(timeout)
      }, MARKER_LIFETIME_MS)
      timeouts.add(timeout)
    }, MARKER_INTERVAL_MS)

    return () => {
      clearInterval(interval)
      timeouts.forEach((timeout) => clearTimeout(timeout))
      map.remove()
    }
  }, [])

  return (
    <div className="live-map relative rounded-3xl overflow-hidden border border-white/10">
      <div ref={containerRef} className="h-[360px] w-full" />
      <span className="absolute top-3 left-3 z-[1000] text-xs font-bold uppercase tracking-wide bg-brand-ink/80 text-white px-3 py-1.5 rounded-full border border-white/10">
        Preview map · production = Mapbox in brand green
      </span>
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-3 text-xs font-bold bg-brand-ink/80 text-white px-3 py-1.5 rounded-full border border-white/10">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand inline-block" /> In progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sun inline-block" /> Completed
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/landing/LiveMap.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/LiveMap.tsx src/components/landing/LiveMap.test.tsx
git commit -m "Add LiveMap component with Leaflet job markers"
```

---

## Task 6: `LiveSection` composition + Landing wiring

**Files:**
- Create: `src/components/landing/LiveSection.tsx`
- Test: `src/components/landing/LiveSection.test.tsx`
- Modify: `src/pages/Landing.tsx`
- Modify: `src/pages/Landing.test.tsx`

`LiveSection` owns the jittering "N pros working" counter (the only piece of state/interval not already covered by `LiveStats`/`LiveMap`/`LiveActivityFeed`) and composes the three child components into the full `<section id="live">`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/landing/LiveSection.test.tsx`:

```tsx
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LiveSection from './LiveSection'

describe('LiveSection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the live badge, headline, stats, map, and feed', () => {
    render(<LiveSection />)

    expect(screen.getByText(/Live · updating in real time/i)).toBeInTheDocument()
    expect(screen.getByText(/pros working/i)).toBeInTheDocument()
    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.getByText('repairs this week')).toBeInTheDocument()
    expect(screen.getByText(/Preview map/i)).toBeInTheDocument()
  })

  it('jitters the pro count after an interval tick', () => {
    render(<LiveSection />)
    expect(screen.getByText('47')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5200)
    })

    expect(screen.getByText(/^(46|48)$/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/landing/LiveSection.test.tsx`
Expected: FAIL — `Cannot find module './LiveSection'` (file doesn't exist yet).

- [ ] **Step 3: Implement the component**

Create `src/components/landing/LiveSection.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { jitterCount } from '../../lib/liveSimulation'
import LiveStats from './LiveStats'
import LiveMap from './LiveMap'
import LiveActivityFeed from './LiveActivityFeed'

const COUNT_INTERVAL_MS = 5200
const COUNT_MIN = 38
const COUNT_MAX = 59
const INITIAL_COUNT = 47

export default function LiveSection() {
  const [proCount, setProCount] = useState(INITIAL_COUNT)

  useEffect(() => {
    const interval = setInterval(() => {
      setProCount((current) => jitterCount(current, COUNT_MIN, COUNT_MAX))
    }, COUNT_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="live" className="bg-brand-ink text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-white/10 px-3 py-1.5 rounded-full">
          <span className="livedot" />
          Live · updating in real time
        </span>
        <h2 className="font-poster uppercase text-5xl mt-4">
          <span className="text-sun">{proCount}</span> pros working
          <br />
          across Surabaya <span className="hl text-brand-ink">right now.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-white/60">
          Every dot on the map is a real booking in progress — anonymized for privacy, updated live as technicians
          take and complete jobs across the city.
        </p>

        <div className="mt-10">
          <LiveStats />
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <LiveMap />
          <LiveActivityFeed />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/landing/LiveSection.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Wire `LiveSection` into the Landing page**

In `src/pages/Landing.tsx`, the current content is:

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

Replace it with:

```tsx
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import Hero from '../components/landing/Hero'
import Ticker from '../components/landing/Ticker'
import ServicesGrid from '../components/landing/ServicesGrid'
import LiveSection from '../components/landing/LiveSection'
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
      <LiveSection />
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

- [ ] **Step 6: Update the Landing page test**

In `src/pages/Landing.test.tsx`, the current content is:

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

Replace it with:

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
    expect(screen.getByText(/pros working/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Who's really fixing it?" })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Book a fix in three steps/ })).toBeInTheDocument()
    expect(screen.getByText('My Appliances')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Stop guessing/ })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
```

- [ ] **Step 7: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS (all tests, including the new Live section tests and the updated Landing test)

- [ ] **Step 8: Run lint and typecheck**

Run: `npm run lint && npx tsc -b --noEmit`
Expected: No errors. Pay particular attention to `react-hooks/purity` — all `Math.random()`-driven work in `LiveSection`, `LiveActivityFeed`, and `LiveMap` must happen inside `useEffect`/`useState` lazy initializers, never directly during render.

- [ ] **Step 9: Commit**

```bash
git add src/components/landing/LiveSection.tsx src/components/landing/LiveSection.test.tsx src/pages/Landing.tsx src/pages/Landing.test.tsx
git commit -m "Wire LiveSection into the Landing page"
```

---

## Out of scope / deferred

- **Mapbox integration / `VITE_MAPBOX_TOKEN`**: The original design spec described a Mapbox-with-Leaflet-fallback approach. The user explicitly approved a **Leaflet-only** implementation for this plan. No Mapbox SDK, no token env var, no fallback branching — `LiveMap` always renders the Leaflet/CARTO map, with an on-map badge noting the production intent ("production = Mapbox in brand green").
- **Marker popups**: The reference mockup binds a popup (category/area/status/rating) to each map marker on click. This plan keeps `LiveMap` markers popup-free to limit scope — the same information is already visible in the activity feed.
- **Real backend data**: The entire Live section is a client-side simulation with no API calls. Connecting it to real booking data is future work.
- **Canonical category vocabulary mapping**: The Live section's display categories (`AC repair`, `Fridge service`, etc.) intentionally do not map to the canonical category strings used by `lookupApplianceSpec`/`matchTechnicians`, since this section has no matching dependency.

---

## Self-Review Notes

**Spec coverage** (against `docs/superpowers/specs/2026-06-14-fixit-hub-web-design.md` Live-section requirements):
- ✅ Poster headline with live-jittering "N pros working" counter — `LiveSection` (Task 6), `jitterCount` (Task 2).
- ✅ 4 stat cards — `LiveStats` (Task 3), `LIVE_STATS` (Task 1).
- ✅ Map with pulsing job markers — `LiveMap` (Task 5), `.jobdot`/`@keyframes ping` (Task 1).
- ✅ Scrolling anonymized activity feed (category + neighborhood + status + rating, never names/addresses) — `LiveActivityFeed` (Task 4); `LIVE_AREAS` are neighborhood names, `LIVE_CATEGORIES` are repair categories — no technician names or addresses anywhere in the data model.
- ✅ Leaflet-only (Mapbox out of scope per user approval) — documented in Context and Out-of-scope sections.
- ✅ `setInterval`-based simulation at ~5s cadence, completion split — `FEED_INTERVAL_MS`/`MARKER_INTERVAL_MS`/`COUNT_INTERVAL_MS` = 5200ms; `COMPLETION_THRESHOLD = 0.8` (~20% completed, matching the design spec's "~20%").
- ✅ No backend dependency — purely client-side, no `fetch`/API calls anywhere in this plan.

**Placeholder scan:** No TBD/TODO/"implement later" markers; every step has complete code.

**Type consistency:** `JobMarker`, `FeedItem`, `JobStatus` are defined once in `lib/liveSimulation.ts` and imported by `LiveActivityFeed.tsx` (`FeedItem`) and used internally by `LiveMap.tsx` (`createJobMarker` return value, not re-exported under a different name). `LiveCategory`, `LiveStat` defined once in `data/liveActivity.ts`. `LIVE_CENTER`, `LIVE_CATEGORIES`, `LIVE_AREAS`, `LIVE_STATS` are the single canonical names used consistently across Tasks 1–6.
