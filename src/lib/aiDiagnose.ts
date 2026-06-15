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
