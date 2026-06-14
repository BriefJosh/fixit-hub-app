export interface Appliance {
  id: string
  name: string
  brand: string
  model: string
  category: string
  healthPercent: number
  status: 'Excellent' | 'Good' | 'Needs attention'
  lastService: string
  nextServiceDue: string
}

export const appliances: Appliance[] = [
  {
    id: 'ac-daikin-1',
    name: 'AC Daikin 1PK',
    brand: 'Daikin',
    model: 'FTV25AXV14',
    category: 'AC & HVAC',
    healthPercent: 78,
    status: 'Good',
    lastService: 'Mar 2026',
    nextServiceDue: 'Sep 2026',
  },
  {
    id: 'fridge-samsung-1',
    name: 'Fridge Samsung 2P',
    brand: 'Samsung',
    model: 'RT29K5034S8',
    category: 'Refrigerator',
    healthPercent: 91,
    status: 'Excellent',
    lastService: 'Jan 2026',
    nextServiceDue: 'Jan 2027',
  },
  {
    id: 'washer-lg-1',
    name: 'Washer LG',
    brand: 'LG',
    model: 'T2108VSAM',
    category: 'Washing Machine',
    healthPercent: 55,
    status: 'Needs attention',
    lastService: 'Aug 2025',
    nextServiceDue: 'Feb 2026 (overdue)',
  },
]
