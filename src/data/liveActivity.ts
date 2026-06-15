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
