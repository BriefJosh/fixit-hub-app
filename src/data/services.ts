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
