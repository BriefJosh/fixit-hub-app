import type { LucideIcon } from 'lucide-react'
import { Droplets, Microwave, Refrigerator, Tv, WashingMachine, Wind } from 'lucide-react'

export interface ServiceCategory {
  name: string
  icon: LucideIcon
  iconColor: string
  description: string
  priceFrom: string
}

export const categories: ServiceCategory[] = [
  {
    name: 'AC & HVAC',
    icon: Wind,
    iconColor: 'text-brand',
    description: 'Cleaning, refrigerant, install',
    priceFrom: 'Rp 150k',
  },
  {
    name: 'Refrigerator',
    icon: Refrigerator,
    iconColor: 'text-blue-500',
    description: 'Cooling, compressor, seals',
    priceFrom: 'Rp 120k',
  },
  {
    name: 'Washing Machine',
    icon: WashingMachine,
    iconColor: 'text-purple-500',
    description: 'Drainage, drum, motor',
    priceFrom: 'Rp 130k',
  },
  {
    name: 'Television',
    icon: Tv,
    iconColor: 'text-amber-500',
    description: 'Panel, power, backlight',
    priceFrom: 'Rp 100k',
  },
  {
    name: 'Oven',
    icon: Microwave,
    iconColor: 'text-red-400',
    description: 'Heating, wiring, control',
    priceFrom: 'Rp 110k',
  },
  {
    name: 'Water Heater',
    icon: Droplets,
    iconColor: 'text-sun',
    description: 'Element, thermostat, leaks',
    priceFrom: 'Rp 140k',
  },
]
