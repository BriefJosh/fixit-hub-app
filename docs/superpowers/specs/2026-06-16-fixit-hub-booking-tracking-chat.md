# Fix-It Hub — Booking, Tracking & Chat Design Spec

**Date:** 2026-06-16  
**Approach:** A — new React Router pages layered into the existing app

---

## 1. Bug Fixes

### 1a. LiveMap — markers appearing in the sea

**Root cause:** `COORDINATE_SPREAD = 0.18` in `liveSimulation.ts` lets random offsets reach longitude ~112.84 (Madura Strait, east of Surabaya).

**Fix:** Reduce `COORDINATE_SPREAD` to `0.09` and clamp output to Surabaya's land bounds before returning from `createJobMarker`:
- lat: `[-7.35, -7.20]`
- lng: `[112.64, 112.79]`

File: `src/lib/liveSimulation.ts`

### 1b. NavBar anchor links broken from inner pages

**Root cause:** `href="#services"` etc. are fragment-only links. From `/ai-diagnose` the browser tries to scroll the current page, not navigate to Landing.

**Fix:** Change all three anchor links to absolute fragment paths:
- `href="#services"` → `href="/#services"`
- `href="#how"` → `href="/#how"`
- `href="#trust"` → `href="/#trust"`

File: `src/components/layout/NavBar.tsx`

---

## 2. Logo Integration

### Assets
Copy all SVG variants from the project root `logo/` folder into `app/public/logo/`:
- `fih logo.svg` — gradient (green → yellow), for light backgrounds with color
- `fih logo b.svg` — solid black mask, for white/light backgrounds
- `fih logo y.svg` — solid yellow mask, for dark/brand-color backgrounds

### Usage map
| Location | Variant | Size |
|---|---|---|
| NavBar (white/85 backdrop) | `fih logo b.svg` | `h-8` |
| Footer (brand-ink dark bg) | `fih logo y.svg` | `h-7` |
| BookingConfirmed top bar (dark) | `fih logo y.svg` | `h-7` |

**NavBar change:** Replace the current `<span>` wrench icon + `<span>Fix-It Hub</span>` text with `<img src="/logo/fih logo b.svg" alt="Fix-It Hub" className="h-8 w-auto" />` inside the existing `<Link to="/">`.

Files: `src/components/layout/NavBar.tsx`, `src/components/layout/Footer.tsx`

---

## 3. Booking Page — `/book/:serviceId`

### Route
Add `<Route path="/book/:serviceId" element={<Booking />} />` to `App.tsx`.

### Entry points
- Service cards in `ServicesGrid.tsx` on Landing → wrap each card with `<Link to="/book/{serviceId}">`
- Quick categories in `QuickCategories.tsx` on Dashboard → same

### Page structure
Sticky top bar with:
- `← Back` link (navigates to `/` or previous page)
- Fix-It Hub logo (`fih logo b.svg`, `h-7`)
- Step indicator pills: `1 · 2 · 3` — active step in brand green, inactive in mint-100

### Step 1 — Problem
- Anton headline: service name (e.g., "AC Repair")
- Plus Jakarta Sans subtitle: "What's going on?"
- Checkbox list of problems, service-specific (see data below)
- Optional `<textarea>` "Describe the issue (optional)"
- Dynamic price estimate badge: starts at base price, adds Rp25.000 per checked problem
- "Next →" brand-green pill CTA

**Service problem data** (new file `src/data/services.ts`):
```ts
{ id: 'ac-repair', name: 'AC Repair', basePrice: 75000, problems: ['Routine service','Not cooling','Water leaking','Strange noise','Won\'t turn on','Other'] }
{ id: 'fridge', name: 'Fridge Repair', basePrice: 85000, problems: ['Not cooling','Freezer icing up','Strange noise','Water leaking','Won\'t start','Other'] }
{ id: 'washer', name: 'Washing Machine', basePrice: 80000, problems: ['Won\'t spin','Leaking water','Not draining','Won\'t power on','Error code','Other'] }
{ id: 'tv', name: 'TV Repair', basePrice: 90000, problems: ['No picture','No sound','Screen cracked','Won\'t turn on','Remote not working','Other'] }
{ id: 'water-heater', name: 'Water Heater', basePrice: 70000, problems: ['No hot water','Leaking','Strange smell','Pilot light out','Thermostat issue','Other'] }
```

### Step 2 — Schedule
- Inline calendar (current month, ISO week starting Monday)
  - Today highlighted in mint-100; past dates disabled/greyed
  - Selected date: brand-green circle
- Time slot tap targets in a 3-column grid:
  - Morning (07:00–10:00)
  - Afternoon (10:00–14:00)
  - Evening (14:00–18:00)
  - Selected: brand-green bg + white text; unselected: white bg + brand-ink border
- "Next →" disabled until both date and time slot are chosen

### Step 3 — Confirm
- Pre-filled address card: "Tower 1 ITS, Sukolilo, Surabaya 60111" (fixed for demo, not editable)
- Property type radio group: House / Apartment / Other
  - House: +Rp0, Apartment: +Rp20.000, Other: +Rp0
- Order summary card:
  - Service name
  - Selected problems (comma-separated)
  - Scheduled: date + time slot
  - Subtotal (base + per-problem additions)
  - Apartment surcharge (if applicable)
  - Platform fee: Rp11.000
  - **Total**
- "Confirm Booking" brand-green CTA → navigates to `/booking-confirmed/001`

### State management
Local `useState` within `Booking.tsx`. No external store needed — it's a demo flow.

---

## 4. Booking Confirmed: Track + Chat — `/booking-confirmed/:bookingId`

### Route
Add `<Route path="/booking-confirmed/:bookingId" element={<BookingConfirmed />} />` to `App.tsx`.

### Page structure
No NavBar. Two sections stacked vertically in a single scrollable page:
- Compact top bar: `← Back to Dashboard` (left) + `fih logo b.svg` centered
- Tracking section
- Chat section

### 4a. Tracking section

**Map** (`h-72`, Leaflet, same dark CARTO tile as LiveMap):
- Center: Tower 1 ITS (-7.2756, 112.7961)
- Zoom: 15
- "Your location" pin: brand-green Leaflet divIcon at Tower 1 ITS
- "Technician" pin: starts at (-7.2856, 112.7861), ~1.5 km northwest, animates toward Tower 1 ITS over 45 seconds using `setInterval` + linear interpolation

**Status bar** (below the map, white card with soft shadow):
- Left: technician avatar (initials fallback "BS"), name "Budi Santoso", "Verified Pro" badge
- Center: Status label — "On the way" with a pulsing green dot → changes to "Arrived ✓" when animation completes
- Right: ETA countdown — "~8 min" decreasing every 10s → disappears on arrival

### 4b. Chat section

**Technician card** (top of chat section):
- Avatar, name, star rating (4.9), service being performed

**Message thread**:
- Auto-loads one opening message from Budi: *"Hi! I'm on my way. Should arrive in about 8 minutes. Please make sure the appliance is accessible."*
- Message timestamp shown below each bubble
- User bubbles: right-aligned, brand-green bg, white text, rounded-2xl rounded-br-none
- Technician bubbles: left-aligned, mint-50 bg, brand-ink text, rounded-2xl rounded-bl-none

**Auto-reply logic** (demo):
After user sends any message, wait 1500ms then push one of three pre-written replies in rotation:
1. *"Got it! See you soon."*
2. *"Sure, no problem at all."*
3. *"Thanks for letting me know!"*

**Sticky input bar** (bottom of page, fixed):
- Text input: "Message Budi…" placeholder
- Send icon button (brand-green), disabled when input is empty

---

## 5. New files summary

| File | Purpose |
|---|---|
| `src/data/services.ts` | Service definitions with problem lists and base prices |
| `src/pages/Booking.tsx` | 3-step booking wizard |
| `src/pages/BookingConfirmed.tsx` | Track + chat combined page |
| `app/public/logo/fih logo.svg` | Gradient logo asset |
| `app/public/logo/fih logo b.svg` | Black logo asset |
| `app/public/logo/fih logo y.svg` | Yellow logo asset |

## 6. Modified files summary

| File | Change |
|---|---|
| `src/App.tsx` | Add 2 new routes |
| `src/components/layout/NavBar.tsx` | Logo swap + fix anchor hrefs |
| `src/components/layout/Footer.tsx` | Logo swap |
| `src/components/landing/ServicesGrid.tsx` | Wrap cards with booking links |
| `src/components/dashboard/QuickCategories.tsx` | Wrap cards with booking links |
| `src/lib/liveSimulation.ts` | Fix coordinate bounds |
