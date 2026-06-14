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
