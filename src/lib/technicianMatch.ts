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
