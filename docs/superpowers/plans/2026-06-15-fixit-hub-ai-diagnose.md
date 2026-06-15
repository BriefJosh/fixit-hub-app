# AI Diagnose (Frontend, Demo Mode) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/ai-diagnose` page as a complete, self-contained three-step flow (Upload → Scanning → Result) that runs entirely client-side in demo mode — no backend, no API key, no network calls — so it is a safe, fully working centerpiece for the exhibition's live demo.

**Architecture:** A new `src/lib/aiDiagnose.ts` module exposes `getDemoDiagnosis(description?, seedIndex?)`, which picks from a rotating set of six realistic canned identifications (AC, fridge, washer, TV, water heater, plus one deliberately low-confidence "unclear" case) and assembles a full result using the already-built `lookupApplianceSpec` and `matchTechnicians` helpers from Plan 1. The `AIDiagnose` page becomes a small state machine (`upload` → `scanning` → `result`) composed of three new presentational components: `UploadStep`, `ScanningStep`, and `ResultStep`. The Scanning step uses a CSS-based scan-line + grid overlay animation (Tailwind utilities + a few keyframes in `index.css`) instead of the spec's suggested p5.js animation — this delivers the same "AI scanning" visual impact without the React-lifecycle integration risk of mounting a p5 canvas under a tight deadline. Live backend integration (`POST /api/diagnose` with a real Anthropic vision call) is deferred to an optional follow-up plan, mirroring how the Live section was already made optional — **this plan alone produces a fully demoable AI Diagnose flow**.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS (existing `brand`/`mint`/`sun` tokens and `font-poster`/`.hl` conventions), React Router (`Link`), Vitest + Testing Library, existing `lookupApplianceSpec` / `matchTechnicians` / `technicians` / `categories` modules from Plan 1.

---

## Context for the engineer

- Routing is already wired: `App.tsx` renders `<AIDiagnose />` at `/ai-diagnose`. This plan only replaces the contents of `src/pages/AIDiagnose.tsx` and adds new components/lib files — no routing changes needed.
- `src/lib/applianceSpecs.ts` already exports `lookupApplianceSpec(category, brand?, model?): SpecLookupResult | null` where `SpecLookupResult = { spec: ApplianceSpec, specsSource: 'exact' | 'category-typical' }` and `ApplianceSpec = { category, brand, model, weightKg, capacity, powerW, dimensions, isTypical }`. Do not modify this file.
- `src/lib/technicianMatch.ts` already exports `matchTechnicians(category, brand, technicians, limit = 3): Technician[]`. Do not modify this file.
- `src/data/technicians.ts` exports `technicians: Technician[]` (5 entries) and the `Technician` interface `{ id, name, avatarSeed, avatarColor, rating, reviewCount, specialties, area, verified, completedJobs, yearsExperience, badges, priceFrom }`. Do not modify this file.
- `src/data/categories.ts` exports `categories: ServiceCategory[]` with `{ name, icon, iconColor, description, priceFrom }` for the 6 categories (`AC & HVAC`, `Refrigerator`, `Washing Machine`, `Television`, `Oven`, `Water Heater`) — these names match `applianceSpecs.json` category names exactly. Do not modify this file.
- Design conventions (from `src/components/landing/*`): `rounded-3xl`, `shadow-card`, `bg-mint-50` / `bg-mint-100`, `bg-brand-ink text-white` for dark sections, `font-poster uppercase` for headlines, `.hl` for highlighted text, brand color `text-brand` / `bg-brand`.
- `vite.config.ts` already sets `test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] }`, so `describe`/`it`/`expect`/`vi` are global in test files (no import needed for `vi`, but existing tests do import `describe`/`it`/`expect` from `vitest` for clarity — follow that convention).
- jsdom does not implement `URL.createObjectURL` / `URL.revokeObjectURL`. Task 2 adds a global stub for these in `src/test/setup.ts` since multiple test files need it.
- Run tests with `npm test` (= `vitest run`) from the `app/` directory.

---

## Task 1: Demo diagnosis data + lookup (`src/lib/aiDiagnose.ts`)

**Files:**
- Create: `src/lib/aiDiagnose.ts`
- Test: `src/lib/aiDiagnose.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/aiDiagnose.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { DEMO_SEEDS, getDemoDiagnosis } from './aiDiagnose'

describe('getDemoDiagnosis', () => {
  it('returns a full result with exact specs for a high-confidence seed', () => {
    const result = getDemoDiagnosis(undefined, 0)

    expect(result.category).toBe('AC & HVAC')
    expect(result.brand).toBe('Daikin')
    expect(result.model).toBe('FTV25AXV14')
    expect(result.confidence).toBeGreaterThanOrEqual(0.5)
    expect(result.specsSource).toBe('exact')
    expect(result.specs?.weightKg).toBe(8.5)
    expect(result.source).toBe('demo')
    expect(result.recommendedTechnicians.length).toBeGreaterThan(0)
    expect(result.recommendedTechnicians.length).toBeLessThanOrEqual(3)
  })

  it('falls back to category-typical specs with no brand/model for the low-confidence seed', () => {
    const lowConfidenceIndex = DEMO_SEEDS.findIndex((seed) => seed.confidence < 0.5)
    const result = getDemoDiagnosis(undefined, lowConfidenceIndex)

    expect(result.confidence).toBeLessThan(0.5)
    expect(result.brand).toBeUndefined()
    expect(result.specsSource).toBe('category-typical')
    expect(result.specs?.isTypical).toBe(true)
  })

  it('incorporates the user-provided description into the technician note', () => {
    const result = getDemoDiagnosis('making a loud rattling noise', 0)
    expect(result.technicianNotes).toContain('making a loud rattling noise')
  })

  it('omits the symptom clause when no description is given', () => {
    const result = getDemoDiagnosis(undefined, 0)
    expect(result.technicianNotes).not.toContain('symptom')
  })

  it('picks a seed within bounds when no index is given', () => {
    const result = getDemoDiagnosis()
    const categoryNames = DEMO_SEEDS.map((seed) => seed.category)
    expect(categoryNames).toContain(result.category)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/aiDiagnose.test.ts`
Expected: FAIL — `Cannot find module './aiDiagnose'` (the module doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `src/lib/aiDiagnose.ts`:

```ts
import { lookupApplianceSpec } from './applianceSpecs'
import type { ApplianceSpec } from './applianceSpecs'
import { matchTechnicians } from './technicianMatch'
import { technicians } from '../data/technicians'
import type { Technician } from '../data/technicians'

export interface DiagnoseResult {
  category: string
  brand?: string
  model?: string
  confidence: number
  visibleNotes: string
  specs: ApplianceSpec | null
  specsSource: 'exact' | 'category-typical' | null
  technicianNotes: string
  recommendedTechnicians: Technician[]
  source: 'demo'
}

interface DemoSeed {
  category: string
  brand?: string
  model?: string
  confidence: number
  visibleNotes: string
  issueHint: string
}

export const DEMO_SEEDS: DemoSeed[] = [
  {
    category: 'AC & HVAC',
    brand: 'Daikin',
    model: 'FTV25AXV14',
    confidence: 0.93,
    visibleNotes: 'Visible dust buildup on the front filter and light rust around the outdoor unit housing.',
    issueHint: 'a fan or mounting issue',
  },
  {
    category: 'Refrigerator',
    brand: 'Samsung',
    model: 'RT29K5034S8',
    confidence: 0.9,
    visibleNotes: 'The door seal looks slightly warped and there is condensation near the bottom hinge.',
    issueHint: 'a worn door seal or thermostat fault',
  },
  {
    category: 'Washing Machine',
    brand: 'LG',
    model: 'T2108VSAM',
    confidence: 0.88,
    visibleNotes: 'The drain hose appears kinked and there are mineral deposits around the detergent tray.',
    issueHint: 'a drainage pump or hose blockage',
  },
  {
    category: 'Television',
    brand: 'Samsung',
    model: 'UA32T4003',
    confidence: 0.91,
    visibleNotes: 'There is faint vertical banding near the left edge of the panel and a loose power cable.',
    issueHint: 'a backlight driver or loose power connection',
  },
  {
    category: 'Water Heater',
    brand: 'Ariston',
    model: 'Andris RS 15',
    confidence: 0.86,
    visibleNotes: 'There is some mineral scaling near the pressure relief valve and the indicator light flickers.',
    issueHint: 'a heating element or thermostat fault',
  },
  {
    category: 'Oven',
    confidence: 0.42,
    visibleNotes: 'The photo is a bit blurry, so the brand label and model plate are not clearly visible.',
    issueHint: 'a heating element or control board issue',
  },
]

function buildTechnicianNote(seed: DemoSeed, description?: string): string {
  const subject = seed.brand ? `a ${seed.brand} ${seed.category}` : `this ${seed.category.toLowerCase()}`
  const symptomClause = description ? ` and a "${description}" symptom` : ''

  return `Given ${subject}${symptomClause}, this is commonly caused by ${seed.issueHint} — worth a technician visit. ${seed.visibleNotes}`
}

export function getDemoDiagnosis(description?: string, seedIndex?: number): DiagnoseResult {
  const index = seedIndex ?? Math.floor(Math.random() * DEMO_SEEDS.length)
  const seed = DEMO_SEEDS[index]

  const specResult = lookupApplianceSpec(seed.category, seed.brand, seed.model)
  const recommendedTechnicians = matchTechnicians(seed.category, seed.brand, technicians, 3)

  return {
    category: seed.category,
    brand: seed.brand,
    model: seed.model,
    confidence: seed.confidence,
    visibleNotes: seed.visibleNotes,
    specs: specResult?.spec ?? null,
    specsSource: specResult?.specsSource ?? null,
    technicianNotes: buildTechnicianNote(seed, description),
    recommendedTechnicians,
    source: 'demo',
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/aiDiagnose.test.ts`
Expected: PASS — 5/5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/aiDiagnose.ts src/lib/aiDiagnose.test.ts
git commit -m "Add client-side demo diagnosis generator for AI Diagnose"
```

---

## Task 2: Upload step (`UploadStep`)

**Files:**
- Create: `src/components/ai-diagnose/UploadStep.tsx`
- Modify: `src/test/setup.ts`
- Test: `src/components/ai-diagnose/UploadStep.test.tsx`

- [ ] **Step 1: Add global `URL.createObjectURL`/`revokeObjectURL` stubs**

jsdom doesn't implement these, and `UploadStep` (and later the page) call them. Modify `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'

URL.createObjectURL = vi.fn(() => 'blob:mock-url')
URL.revokeObjectURL = vi.fn()
```

- [ ] **Step 2: Write the failing test**

Create `src/components/ai-diagnose/UploadStep.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import UploadStep from './UploadStep'

function createImageFile(name = 'appliance.png') {
  return new File(['fake-image-content'], name, { type: 'image/png' })
}

describe('UploadStep', () => {
  it('renders the upload prompt with a disabled Analyze button', () => {
    render(<UploadStep onAnalyze={vi.fn()} />)

    expect(screen.getByText(/drag and drop a photo here/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled()
  })

  it('enables Analyze and shows a preview after selecting a file', () => {
    render(<UploadStep onAnalyze={vi.fn()} />)
    const input = screen.getByLabelText(/upload appliance photo/i)

    fireEvent.change(input, { target: { files: [createImageFile()] } })

    expect(screen.getByRole('button', { name: /analyze/i })).toBeEnabled()
    expect(screen.getByAltText('Selected appliance')).toBeInTheDocument()
  })

  it('accepts a dropped file', () => {
    render(<UploadStep onAnalyze={vi.fn()} />)
    const dropzone = screen.getByText(/drag and drop a photo here/i).closest('div')!

    fireEvent.drop(dropzone, { dataTransfer: { files: [createImageFile('dropped.png')] } })

    expect(screen.getByRole('button', { name: /analyze/i })).toBeEnabled()
  })

  it('calls onAnalyze with the selected file and description', () => {
    const onAnalyze = vi.fn()
    render(<UploadStep onAnalyze={onAnalyze} />)
    const file = createImageFile()

    fireEvent.change(screen.getByLabelText(/upload appliance photo/i), { target: { files: [file] } })
    fireEvent.change(screen.getByLabelText(/describe the issue/i), { target: { value: 'Making a loud noise' } })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    expect(onAnalyze).toHaveBeenCalledWith(file, 'Making a loud noise')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- src/components/ai-diagnose/UploadStep.test.tsx`
Expected: FAIL — `Cannot find module './UploadStep'`.

- [ ] **Step 4: Write the implementation**

Create `src/components/ai-diagnose/UploadStep.tsx`:

```tsx
import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { ImagePlus, ScanSearch, UploadCloud } from 'lucide-react'

interface UploadStepProps {
  onAnalyze: (file: File, description: string) => void
}

export default function UploadStep({ onAnalyze }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (selected: File | null) => {
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files[0] ?? null)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <ScanSearch className="w-10 h-10 text-brand mx-auto" />
        <h1 className="font-poster uppercase text-5xl sm:text-6xl tracking-wide mt-4">AI Diagnose</h1>
        <p className="mt-3 text-brand-ink/60">
          Snap or upload a photo of the appliance and tell us what&apos;s wrong — we&apos;ll identify it and match
          you with the right technician.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition ${
          isDragging ? 'border-brand bg-mint-50' : 'border-mint-200 bg-white'
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected appliance" className="max-h-64 mx-auto rounded-2xl object-contain" />
        ) : (
          <>
            <UploadCloud className="w-10 h-10 text-brand mx-auto" />
            <p className="mt-3 font-semibold">Drag and drop a photo here, or click to browse</p>
            <p className="text-sm text-brand-ink/50 mt-1">JPG or PNG, taken from any angle that shows the issue</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload appliance photo"
        />
      </div>

      <label className="block mt-6">
        <span className="font-semibold text-sm">Describe the issue (optional)</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="e.g. Making a loud noise when it runs"
          rows={3}
          className="mt-2 w-full rounded-2xl border border-mint-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </label>

      <button
        type="button"
        disabled={!file}
        onClick={() => file && onAnalyze(file, description)}
        className="mt-6 w-full rounded-full bg-brand text-white font-bold py-3.5 shadow-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 transition flex items-center justify-center gap-2"
      >
        <ImagePlus className="w-5 h-5" />
        Analyze
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/components/ai-diagnose/UploadStep.test.tsx`
Expected: PASS — 4/4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/test/setup.ts src/components/ai-diagnose/UploadStep.tsx src/components/ai-diagnose/UploadStep.test.tsx
git commit -m "Add AI Diagnose upload step with drag-and-drop"
```

---

## Task 3: Scanning step (`ScanningStep`) + scan animation

**Files:**
- Create: `src/components/ai-diagnose/ScanningStep.tsx`
- Modify: `src/index.css`
- Test: `src/components/ai-diagnose/ScanningStep.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ai-diagnose/ScanningStep.test.tsx`:

```tsx
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ScanningStep from './ScanningStep'

describe('ScanningStep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the provided image', () => {
    render(<ScanningStep imagePreviewUrl="blob:mock-url" onComplete={vi.fn()} />)

    expect(screen.getByAltText('Appliance being analyzed')).toHaveAttribute('src', 'blob:mock-url')
  })

  it('calls onComplete after the scan duration', () => {
    const onComplete = vi.fn()
    render(<ScanningStep imagePreviewUrl="blob:mock-url" onComplete={onComplete} />)

    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('cycles through scanning status messages', () => {
    render(<ScanningStep imagePreviewUrl="blob:mock-url" onComplete={vi.fn()} />)

    expect(screen.getByText('Detecting appliance category...')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(screen.getByText('Checking brand markings...')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/ai-diagnose/ScanningStep.test.tsx`
Expected: FAIL — `Cannot find module './ScanningStep'`.

- [ ] **Step 3: Add scan animation styles**

Modify `src/index.css` — append after the existing `.grain` block:

```css
.scan-grid {
  background-image:
    linear-gradient(rgba(21, 184, 119, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(21, 184, 119, 0.25) 1px, transparent 1px);
  background-size: 32px 32px;
  animation: scan-grid-pulse 2s ease-in-out infinite;
}

@keyframes scan-grid-pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

.scan-line {
  height: 40%;
  background: linear-gradient(to bottom, transparent 0%, rgba(21, 184, 119, 0.55) 50%, transparent 100%);
  animation: scan-sweep 1.8s linear infinite;
}

@keyframes scan-sweep {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(350%);
  }
}
```

- [ ] **Step 4: Write the implementation**

Create `src/components/ai-diagnose/ScanningStep.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { ScanSearch } from 'lucide-react'

interface ScanningStepProps {
  imagePreviewUrl: string
  onComplete: () => void
}

const SCAN_MESSAGES = [
  'Detecting appliance category...',
  'Checking brand markings...',
  'Cross-referencing spec sheets...',
  'Matching nearby technicians...',
]

const SCAN_DURATION_MS = 2500
const MESSAGE_INTERVAL_MS = 700

export default function ScanningStep({ imagePreviewUrl, onComplete }: ScanningStepProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const completeTimer = setTimeout(onComplete, SCAN_DURATION_MS)
    const messageTimer = setInterval(() => {
      setMessageIndex((index) => (index + 1) % SCAN_MESSAGES.length)
    }, MESSAGE_INTERVAL_MS)

    return () => {
      clearTimeout(completeTimer)
      clearInterval(messageTimer)
    }
  }, [onComplete])

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="relative rounded-3xl overflow-hidden border border-mint-200 shadow-card">
        <img
          src={imagePreviewUrl}
          alt="Appliance being analyzed"
          className="w-full max-h-[28rem] object-contain bg-mint-50"
        />
        <div className="scan-grid absolute inset-0 pointer-events-none" />
        <div className="scan-line absolute inset-x-0 top-0 pointer-events-none" />
        <span className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-brand rounded-tl-xl" />
        <span className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-brand rounded-tr-xl" />
        <span className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-brand rounded-bl-xl" />
        <span className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-brand rounded-br-xl" />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-brand font-bold">
        <ScanSearch className="w-5 h-5 animate-pulse" />
        <span>{SCAN_MESSAGES[messageIndex]}</span>
      </div>
      <p className="mt-2 text-sm text-brand-ink/50">Analyzing photo with AI Diagnose...</p>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/components/ai-diagnose/ScanningStep.test.tsx`
Expected: PASS — 3/3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/components/ai-diagnose/ScanningStep.tsx src/components/ai-diagnose/ScanningStep.test.tsx
git commit -m "Add AI Diagnose scanning step with CSS scan animation"
```

---

## Task 4: Result step (`ResultStep`)

**Files:**
- Create: `src/components/ai-diagnose/ResultStep.tsx`
- Test: `src/components/ai-diagnose/ResultStep.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ai-diagnose/ResultStep.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ResultStep from './ResultStep'
import { DEMO_SEEDS, getDemoDiagnosis } from '../../lib/aiDiagnose'

describe('ResultStep', () => {
  it('renders identification, specs, AI note, demo badge, and technicians for a high-confidence result', () => {
    const result = getDemoDiagnosis(undefined, 0)
    render(<ResultStep result={result} imagePreviewUrl="blob:mock-url" onReset={vi.fn()} />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: result.category })).toBeInTheDocument()
    expect(screen.getByText(`${result.brand} ${result.model}`)).toBeInTheDocument()
    expect(screen.getByText('Demo mode')).toBeInTheDocument()
    expect(screen.getByText(`${Math.round(result.confidence * 100)}% confident`)).toBeInTheDocument()
    expect(screen.getByText(result.technicianNotes)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /book/i })).toHaveLength(result.recommendedTechnicians.length)
  })

  it('shows best-guess framing and category-typical specs for a low-confidence result', () => {
    const lowConfidenceIndex = DEMO_SEEDS.findIndex((seed) => seed.confidence < 0.5)
    const result = getDemoDiagnosis(undefined, lowConfidenceIndex)
    render(<ResultStep result={result} imagePreviewUrl="blob:mock-url" onReset={vi.fn()} />, { wrapper: MemoryRouter })

    expect(screen.getByText(/best guess/i)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`typical for ${result.category}`, 'i'))).toBeInTheDocument()
  })

  it('calls onReset when "Try another photo" is clicked', () => {
    const result = getDemoDiagnosis(undefined, 0)
    const onReset = vi.fn()
    render(<ResultStep result={result} imagePreviewUrl="blob:mock-url" onReset={onReset} />, { wrapper: MemoryRouter })

    fireEvent.click(screen.getByRole('button', { name: /try another photo/i }))

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('routes technician "Book" CTAs to /dashboard', () => {
    const result = getDemoDiagnosis(undefined, 0)
    render(<ResultStep result={result} imagePreviewUrl="blob:mock-url" onReset={vi.fn()} />, { wrapper: MemoryRouter })

    const bookLinks = screen.getAllByRole('link', { name: /book/i })
    bookLinks.forEach((link) => expect(link).toHaveAttribute('href', '/dashboard'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/ai-diagnose/ResultStep.test.tsx`
Expected: FAIL — `Cannot find module './ResultStep'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/ai-diagnose/ResultStep.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw, ScanSearch, Star } from 'lucide-react'
import { categories } from '../../data/categories'
import type { DiagnoseResult } from '../../lib/aiDiagnose'

const CONFIDENCE_THRESHOLD = 0.5

interface ResultStepProps {
  result: DiagnoseResult
  imagePreviewUrl: string
  onReset: () => void
}

export default function ResultStep({ result, imagePreviewUrl, onReset }: ResultStepProps) {
  const categoryMeta = categories.find((category) => category.name === result.category)
  const CategoryIcon = categoryMeta?.icon ?? ScanSearch
  const isLowConfidence = result.confidence < CONFIDENCE_THRESHOLD
  const confidencePercent = Math.round(result.confidence * 100)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="rounded-3xl bg-white border border-mint-200 shadow-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <img
            src={imagePreviewUrl}
            alt="Diagnosed appliance"
            className="w-32 h-32 rounded-2xl object-cover bg-mint-50"
          />
          <div className="flex-1 min-w-[12rem]">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryIcon className={`w-6 h-6 ${categoryMeta?.iconColor ?? 'text-brand'}`} />
              <h1 className="font-poster uppercase text-3xl sm:text-4xl tracking-wide">{result.category}</h1>
              {result.source === 'demo' && (
                <span className="text-xs font-bold uppercase tracking-wide bg-sun text-brand-ink px-2.5 py-1 rounded-full">
                  Demo mode
                </span>
              )}
            </div>
            {isLowConfidence ? (
              <p className="mt-2 text-brand-ink/70">
                We&apos;re not fully confident yet — here&apos;s our best guess based on what&apos;s visible.
              </p>
            ) : (
              <p className="mt-2 text-lg font-semibold">
                {result.brand} {result.model}
              </p>
            )}
            <span className="inline-block mt-3 text-sm font-bold bg-mint-100 text-brand-700 px-3 py-1 rounded-full">
              {confidencePercent}% confident
            </span>
          </div>
        </div>
      </div>

      {result.specs && (
        <div className="mt-6 rounded-3xl bg-mint-50 p-6 sm:p-8">
          <h2 className="font-extrabold text-lg">
            Specs{result.specsSource === 'category-typical' ? ` (typical for ${result.category})` : ''}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-ink/50">Weight</p>
              <p className="font-bold mt-1">{result.specs.weightKg} kg</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-ink/50">Capacity</p>
              <p className="font-bold mt-1">{result.specs.capacity}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-ink/50">Power</p>
              <p className="font-bold mt-1">{result.specs.powerW} W</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-ink/50">Dimensions</p>
              <p className="font-bold mt-1">{result.specs.dimensions}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-3xl bg-brand-ink text-white p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <ScanSearch className="w-5 h-5 text-sun" />
          <h2 className="font-extrabold text-lg">AI note</h2>
        </div>
        <p className="mt-2 text-white/70">{result.technicianNotes}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-extrabold text-lg mb-4">Recommended technicians</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {result.recommendedTechnicians.map((tech) => (
            <div key={tech.id} className="rounded-3xl bg-white border border-mint-200 shadow-card p-5">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full grid place-items-center text-white font-bold ${tech.avatarColor}`}>
                  {tech.avatarSeed}
                </span>
                <div>
                  <p className="font-bold">{tech.name}</p>
                  <div className="flex items-center gap-1 text-sm text-brand-ink/60">
                    <Star className="w-3.5 h-3.5 text-sun fill-sun" />
                    {tech.rating} ({tech.reviewCount})
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-brand-ink/60">
                {tech.area} · from {tech.priceFrom}
              </p>
              <Link
                to="/dashboard"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-600"
              >
                Book <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-ink/70 hover:text-brand-ink"
      >
        <RotateCcw className="w-4 h-4" />
        Try another photo
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/ai-diagnose/ResultStep.test.tsx`
Expected: PASS — 4/4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/ai-diagnose/ResultStep.tsx src/components/ai-diagnose/ResultStep.test.tsx
git commit -m "Add AI Diagnose result step with specs, AI note, and technician matches"
```

---

## Task 5: Wire up the AI Diagnose page

**Files:**
- Modify: `src/pages/AIDiagnose.tsx` (replace the stub entirely)
- Test: Create `src/pages/AIDiagnose.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/AIDiagnose.test.tsx`:

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AIDiagnose from './AIDiagnose'

function createImageFile(name = 'appliance.png') {
  return new File(['fake-image-content'], name, { type: 'image/png' })
}

describe('AIDiagnose', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the upload step', () => {
    render(<AIDiagnose />, { wrapper: MemoryRouter })

    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled()
  })

  it('walks through scanning to a result after selecting a photo and analyzing', () => {
    render(<AIDiagnose />, { wrapper: MemoryRouter })

    fireEvent.change(screen.getByLabelText(/upload appliance photo/i), { target: { files: [createImageFile()] } })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    expect(screen.getByText(/analyzing photo with ai diagnose/i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(screen.getByText('Demo mode')).toBeInTheDocument()
  })

  it('returns to the upload step from "Try another photo"', () => {
    render(<AIDiagnose />, { wrapper: MemoryRouter })

    fireEvent.change(screen.getByLabelText(/upload appliance photo/i), { target: { files: [createImageFile()] } })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    fireEvent.click(screen.getByRole('button', { name: /try another photo/i }))

    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/pages/AIDiagnose.test.tsx`
Expected: FAIL — the stub page has no "Analyze" button, so `getByRole('button', { name: /analyze/i })` throws.

- [ ] **Step 3: Write the implementation**

Replace the entire contents of `src/pages/AIDiagnose.tsx`:

```tsx
import { useCallback, useEffect, useState } from 'react'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import UploadStep from '../components/ai-diagnose/UploadStep'
import ScanningStep from '../components/ai-diagnose/ScanningStep'
import ResultStep from '../components/ai-diagnose/ResultStep'
import { getDemoDiagnosis } from '../lib/aiDiagnose'
import type { DiagnoseResult } from '../lib/aiDiagnose'

type Step = 'upload' | 'scanning' | 'result'

function AIDiagnose() {
  const [step, setStep] = useState<Step>('upload')
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [result, setResult] = useState<DiagnoseResult | null>(null)

  useEffect(() => {
    if (!imagePreviewUrl) return
    return () => URL.revokeObjectURL(imagePreviewUrl)
  }, [imagePreviewUrl])

  const handleAnalyze = (file: File, enteredDescription: string) => {
    setImagePreviewUrl(URL.createObjectURL(file))
    setDescription(enteredDescription)
    setStep('scanning')
  }

  const handleScanComplete = useCallback(() => {
    setResult(getDemoDiagnosis(description))
    setStep('result')
  }, [description])

  const handleReset = () => {
    setImagePreviewUrl(null)
    setDescription('')
    setResult(null)
    setStep('upload')
  }

  return (
    <div className="font-sans text-brand-ink bg-white antialiased min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 bg-mint-50">
        {step === 'upload' && <UploadStep onAnalyze={handleAnalyze} />}
        {step === 'scanning' && imagePreviewUrl && (
          <ScanningStep imagePreviewUrl={imagePreviewUrl} onComplete={handleScanComplete} />
        )}
        {step === 'result' && result && imagePreviewUrl && (
          <ResultStep result={result} imagePreviewUrl={imagePreviewUrl} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AIDiagnose
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/pages/AIDiagnose.test.tsx`
Expected: PASS — 3/3 tests.

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: All tests pass (existing landing/data/lib tests plus the new AI Diagnose tests).

- [ ] **Step 6: Commit**

```bash
git add src/pages/AIDiagnose.tsx src/pages/AIDiagnose.test.tsx
git commit -m "Wire up AI Diagnose page with upload, scanning, and result steps"
```

---

## Out of scope / deferred (intentional)

- **Live mode / `POST /api/diagnose` backend** (Anthropic vision call, Express server, demo-mode rotation server-side): deferred to an optional follow-up plan, same as the Live section. This plan's client-side demo mode already satisfies the spec's "frontend resilience" fallback requirement and the "works with no `.env` file" verification criterion for AI Diagnose.
- **p5.js generative scan animation**: the spec calls for p5.js per the `algorithmic-art` skill. Given the tight exhibition timeline, this plan substitutes a CSS-only scan-line + grid overlay (Task 3) that achieves the same "AI scanning" visual without the risk of integrating a p5 canvas into React's render lifecycle. If time permits after Plans 4–5, swapping `ScanningStep`'s overlay for a p5.js sketch is a self-contained enhancement that doesn't change any prop contracts.
- **`capture="environment"`**: included on the file input for mobile-camera support, but the primary tested/demo path is drag-and-drop / click-to-browse (laptop/projector demo).

---

## Self-review notes

- **Spec coverage**: Upload step (drag-drop, file picker w/ `capture="environment"`, description textarea, disabled-until-image Analyze) ✅ Task 2. Scanning step (overlay animation, ≥2.5s minimum) ✅ Task 3. Result step (identification card w/ Demo mode badge, specs grid w/ "typical" labeling, AI note incorporating description, 3 technician cards w/ Book → `/dashboard`, Try another photo) ✅ Task 4. Low-confidence "best guess" framing + category-level specs/technicians ✅ Tasks 1 & 4 (Oven seed, confidence 0.42). Demo mode "rotating set of canned, realistic results covering AC, fridge, washer, TV, water heater" ✅ Task 1 (`DEMO_SEEDS`). Frontend resilience fallback requirement is satisfied by demo mode being the only mode in this plan — there is no failure path to fall back from.
- **Placeholder scan**: no TBD/TODO markers; every step has complete code.
- **Type consistency**: `DiagnoseResult` (Task 1) flows unchanged into `ResultStep` (Task 4) and `AIDiagnose` (Task 5). `UploadStep`'s `onAnalyze: (file: File, description: string) => void` matches `AIDiagnose`'s `handleAnalyze`. `ScanningStep`'s `{ imagePreviewUrl: string, onComplete: () => void }` matches usage in `AIDiagnose`. `ResultStep`'s `{ result: DiagnoseResult, imagePreviewUrl: string, onReset: () => void }` matches usage in `AIDiagnose`.
