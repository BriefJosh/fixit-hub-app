# Fix-It Hub Web App — Phase 1 Design Spec

## Context

Fix-It Hub is an on-demand appliance repair platform for Indonesia (SEM6 Technopreneur coursework). Positioning: "The trusted, AI-powered appliance repair platform in Indonesia." Target users: middle-class urban households in Jakarta, Surabaya, Bandung, Makassar. Core value props from the business plan: verified/certified technicians, transparent pricing, AI-powered diagnostics, maintenance logs.

Design exploration produced four static HTML mockups in `mockups/` (its own repo, deployed to GitHub Pages). The approved direction:

- **Landing page** = `mockup-d-blend-landing.html` — A's marketplace structure + B's bold editorial/poster personality, including the "Fix-It Hub Live" anonymized social-proof map section.
- **Dashboard** = `mockup-c-dashboard.html` — logged-in home with home health score, my appliances, bookings, recommended technicians.
- **AI Diagnose** = new page/flow (not previously mocked as a standalone surface), designed in this spec.

This spec covers **Phase 1**: a real React application implementing these three surfaces, with most data mocked but the AI Diagnose feature using a real (optionally-live) AI backend. Authentication, booking/payments, and persistence are explicitly deferred to later phases (see "Out of scope").

## Goals

- Stand up a real React codebase (not more static mockups) that reproduces the approved landing and dashboard designs faithfully, reusing the brand system already established in `mockups/` (colors, fonts, shadows, icons).
- Ship a working **AI Diagnose** flow: photo (+ optional text description) → appliance identification (category/brand/model) → specs lookup (incl. weight) → recommended technicians.
- Keep setup friction near zero: the app must run and demo correctly with **no API keys configured at all**, and transparently upgrade to live AI / branded maps when keys are provided.

## Tech stack

- **Build tool / framework**: Vite + React + TypeScript.
- **Styling**: Tailwind CSS, configured with the existing brand system ported from the mockups' inline `tailwind.config`:
  - Colors: `brand` (DEFAULT `#15B877`, `600 #0FA869`, `700 #0E8C58`, `ink #0A1A13`), `mint` (50–300), `sun` (DEFAULT `#FFD21E`, `600 #F5B100`).
  - Fonts: `sans` = Plus Jakarta Sans (body), `poster`/`display` = Anton (headline type).
  - Custom shadows: `soft`, `card`.
- **Routing**: React Router. Three routes: `/` (landing), `/dashboard`, `/ai-diagnose`.
- **Icons**: `lucide-react`.
- **Maps**: Mapbox GL JS (brand-green custom style) for the Live section, with a no-key fallback (see "Live section" below).
- **Generative animation**: p5.js (per the `algorithmic-art` skill) for the AI Diagnose scanning animation — seeded procedural grid-scan/particle sweep in brand colors.
- **Backend**: a small Node/Express server providing one endpoint, `POST /api/diagnose`, proxied from the Vite dev server (`/api/*`). Uses `@anthropic-ai/sdk` server-side for the live vision call.

## Navigation & auth stance

- Nav links: Services, How it works, AI Diagnostics (→ `/ai-diagnose`), Trust.
- "Log in" and "Sign up" both route to `/dashboard`. Phase 1 has **no real authentication** — the dashboard always renders for a single hardcoded mock user ("Budi"). This is a deliberate simplification, not an oversight; real auth is a later phase.
- The landing page's "Find a technician" search bar is **non-functional/decorative** in Phase 1 (no search results page, no booking flow). Submitting it routes to `/dashboard` (treated as "browse technicians while logged in") — same target as "Log in"/"Sign up", so there is one consistent "enter the app" destination throughout the landing page.

## Surfaces

### 1. Landing page (`/`)

Reproduces `mockup-d-blend-landing.html` section-for-section:

- Sticky nav (as above).
- Wave hero: poster headline, booking search bar (decorative per above), and the "AI Diagnostic Engine" widget — its "Upload Photo"/"Upload Video"/"Match me a technician" CTA routes to `/ai-diagnose`.
- Services grid (6 categories: AC & HVAC, Fridge, Washing Machine, TV, Oven, Water Heater).
- **Live section** ("Fix-It Hub Live") — see dedicated subsection below.
- Trust band (4 guarantees: Verified network, Fixed pricing, AI diagnostics, Maintenance log). The "AI diagnostics" card routes to `/ai-diagnose`.
- How it works (3 steps), maintenance log section, poster CTA, footer.

All content (service descriptions, stats like "850+ verified pros", "4.9★") is static/mocked, matching the existing mockup copy.

#### Live section (social-proof map)

Client-side simulated activity, ported from the mockup's JS: a poster headline with a live-jittering "N pros working" counter, 4 stat cards, a map of pulsing job markers, and a scrolling activity feed — all anonymized (category + neighborhood + status + rating, never names/addresses).

- **Map rendering**: Mapbox GL JS with a brand-green custom style **if `VITE_MAPBOX_TOKEN` is set**. If not set, falls back to Leaflet + CARTO dark tiles (as currently prototyped in the mockup) — this requires no key at all, so the section always renders. The "Preview tiles" badge is removed once Mapbox is wired up; the Leaflet fallback path keeps a small "preview map" badge instead.
- **Simulation logic**: identical in spirit to the mockup — `setInterval` adds feed entries and temporary map markers, ~20% "completed" vs "in progress", at a slow (~5s) cadence. Categories and area names are the same anonymized set used in the mockup.
- This section has **no backend dependency** — it is purely a frontend simulation, on both Mapbox and Leaflet paths.

### 2. Dashboard (`/dashboard`)

Reproduces `mockup-c-dashboard.html`:

- Sidebar nav: Home, AI Diagnose (→ `/ai-diagnose`), Bookings, My Appliances, Profile, plus an AI scan promo card (→ `/ai-diagnose`).
- Topbar: search (decorative), notifications (decorative), avatar for mock user "Budi".
- "Good morning, Budi" hero with Home Health Score ring (78%, mock value).
- Services quick-grid (same 6 categories as landing).
- "My appliances" list with progress bars, sourced from `src/data/appliances.ts` (mock): AC Daikin 78%, Fridge Samsung 91%, Washer LG 55% (overdue).
- "Upcoming" booking card, sourced from `src/data/bookings.ts` (mock).
- Dark AI promo card → `/ai-diagnose`.
- "Top-rated technicians" grid, sourced from `src/data/technicians.ts` (mock).
- Mobile bottom nav (Home / AI Diagnose / Bookings / Appliances / Profile).

All data on this page is static mock data — no edit/CRUD actions in Phase 1 (clicking into an appliance or booking can show a detail view, but changes aren't persisted).

### 3. AI Diagnose (`/ai-diagnose`) — new

A three-step flow on a single page/route:

1. **Upload step**
   - Photo input: drag-and-drop zone (desktop) / file picker with `capture="environment"` (mobile camera).
   - Optional "Describe the issue" textarea (placeholder: e.g. "Making a loud noise when it runs").
   - "Analyze" button, disabled until an image is selected.

2. **Scanning step**
   - A p5.js generative scan animation overlays the uploaded photo: seeded grid-scan lines / particle sweep in brand green, per the `algorithmic-art` skill.
   - Runs for a minimum of ~2.5s even if the API responds faster, so the analysis feels substantive.

3. **Result step**
   - **Identification card**: photo thumbnail, category icon, brand, model, confidence badge. If `source: "demo"`, show a small "Demo mode" badge.
   - **Specs grid**: weight, capacity, power, dimensions — pulled from the spec lookup dataset. If no exact model match, specs are labeled "typical for this category" instead of asserting exact figures.
   - **AI note**: a short note that incorporates the user's optional description (e.g., "Given a Daikin 1.5 PK split AC and a 'loud noise' symptom, this is commonly a fan or mounting issue — worth a technician visit.").
   - **Recommended technicians**: 3 cards filtered from `src/data/technicians.ts` by category/brand specialty + rating, each with a "Book" CTA (routes to `/dashboard`, since booking isn't implemented in Phase 1).
   - "Try another photo" resets to the upload step.

## Backend: `/api/diagnose`

Single Express endpoint, `POST /api/diagnose`, body `{ imageBase64: string, description?: string }`.

**Live mode** (when `ANTHROPIC_API_KEY` is set):
1. Calls the Anthropic API with a vision-capable Claude model, sending the image plus a structured prompt asking for JSON: `{ category, brand, model, confidence, visibleNotes }`.
2. Looks up `data/applianceSpecs.json` for an entry matching `category` + `brand` + `model`. If found, `specsSource: "exact"`. If not, falls back to category-level typical specs, `specsSource: "category-typical"`.
3. Filters `technicians.ts`-equivalent server-side data by `category`/`brand` specialty tags, sorted by rating, returns top 3.
4. Returns `{ category, brand, model, confidence, specs, specsSource, technicianNotes, recommendedTechnicians, source: "live" }`.

**Demo mode** (when `ANTHROPIC_API_KEY` is not set):
- Returns one of a small rotating set of canned, realistic results (covering AC, fridge, washer, TV, water heater — matching the Live section's categories), with `source: "demo"`. Specs and technician matches still come from the same `applianceSpecs.json` / technician data, so demo results look identical in shape to live ones — only the identification step is canned.

**Frontend resilience**: if the `/api/diagnose` call fails outright (network error, server not running), the frontend falls back to a small bundled local demo result (same shape, `source: "demo"`) so the flow never dead-ends — this is a second safety net on top of the backend's own demo mode.

**Low confidence**: if `confidence` is below a threshold (e.g. 0.5), the result step uses "best guess" framing and shows category-level specs/technicians rather than asserting a specific brand/model.

## Data layer (Phase 1, all mock/static)

- `src/data/technicians.ts` — `{ id, name, avatarSeed, rating, specialties: string[], area, verified, completedJobs }`. Specialties combine category tags (e.g. `"AC"`) and brand tags (e.g. `"Daikin"`) for matching.
- `src/data/appliances.ts` — "My appliances" for the dashboard: `{ id, name, brand, model, category, healthPercent, lastService, nextServiceDue }`.
- `src/data/bookings.ts` — upcoming bookings: `{ id, service, technician, date, status }`.
- `data/applianceSpecs.json` — shared between frontend (for reference/typing) and backend (for lookup): entries per `{ category, brand, model, weightKg, capacityBTUorLiters, powerW, dimensions }`, plus one category-level "typical" entry per category for the fallback path.

Exact field shapes will be finalized during implementation, but the categories and the brand/model examples already shown in the mockups (Daikin, Samsung, LG, etc.) should be reused for continuity.

## Out of scope for Phase 1

- Real authentication/accounts (single mock user "Budi").
- Real booking/payment flow (CTAs route to `/dashboard` or are decorative).
- Persistence/database (all data is static mock data, in-memory or JSON files).
- Production deployment of the Express backend (local dev only).
- Real-time backend for the Live section (remains a client-side simulation).
- Editing/CRUD on appliances, bookings, or maintenance logs.

## Project structure

New `app/` directory at the project root, its own git repo (mirroring how `mockups/` is its own repo — independently versioned, can later be deployed separately, e.g. to Vercel/Netlify). Illustrative layout (finalized during implementation planning):

```
app/
├── src/
│   ├── pages/        # Landing, Dashboard, AIDiagnose
│   ├── components/
│   ├── data/          # technicians.ts, appliances.ts, bookings.ts
│   └── styles/
├── server/            # Express app, /api/diagnose
├── data/
│   └── applianceSpecs.json
├── public/
├── .env.example       # ANTHROPIC_API_KEY=, VITE_MAPBOX_TOKEN= (both optional)
├── vite.config.ts     # dev proxy: /api -> Express server
├── tailwind.config.ts
└── package.json
```

## Verification

- `npm run dev` (or equivalent) starts both the Vite app and the Express server, with `/api/diagnose` proxied correctly.
- With no `.env` file at all: landing, dashboard, and AI Diagnose (in demo mode, with "Demo mode" badge) all work end-to-end, and the Live section renders via the Leaflet/CARTO fallback.
- With `ANTHROPIC_API_KEY` set: AI Diagnose returns live results (`source: "live"`) for a real appliance photo.
- With `VITE_MAPBOX_TOKEN` set: the Live section renders on Mapbox with a brand-green style instead of the Leaflet fallback.
