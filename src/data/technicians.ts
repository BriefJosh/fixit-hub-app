export interface Technician {
  id: string
  name: string
  avatarSeed: string
  avatarColor: string
  rating: number
  reviewCount: number
  specialties: string[]
  area: string
  verified: boolean
  completedJobs: number
  yearsExperience: number
  badges: string[]
  priceFrom: string
}

export const technicians: Technician[] = [
  {
    id: 'agus-wibowo',
    name: 'Agus Wibowo',
    avatarSeed: 'AW',
    avatarColor: 'bg-brand',
    rating: 4.9,
    reviewCount: 128,
    specialties: ['AC & HVAC', 'Daikin'],
    area: 'Gubeng, Surabaya',
    verified: true,
    completedJobs: 156,
    yearsExperience: 8,
    badges: ['Daikin Certified', 'Top Rated'],
    priceFrom: 'Rp 150.000',
  },
  {
    id: 'sari-rahma',
    name: 'Sari Rahma',
    avatarSeed: 'SR',
    avatarColor: 'bg-blue-500',
    rating: 4.8,
    reviewCount: 96,
    specialties: ['Refrigerator', 'Samsung'],
    area: 'Wonokromo, Surabaya',
    verified: true,
    completedJobs: 110,
    yearsExperience: 6,
    badges: ['Samsung Partner', 'Fast reply'],
    priceFrom: 'Rp 120.000',
  },
  {
    id: 'dimas-lesmana',
    name: 'Dimas Lesmana',
    avatarSeed: 'DL',
    avatarColor: 'bg-purple-500',
    rating: 4.9,
    reviewCount: 142,
    specialties: ['Washing Machine', 'LG'],
    area: 'Tegalsari, Surabaya',
    verified: true,
    completedJobs: 165,
    yearsExperience: 5,
    badges: ['LG Certified', 'Top Rated'],
    priceFrom: 'Rp 130.000',
  },
  {
    id: 'putri-anjani',
    name: 'Putri Anjani',
    avatarSeed: 'PA',
    avatarColor: 'bg-amber-500',
    rating: 4.7,
    reviewCount: 64,
    specialties: ['Television', 'LG', 'Samsung'],
    area: 'Sukolilo, Surabaya',
    verified: true,
    completedJobs: 80,
    yearsExperience: 4,
    badges: ['Electronics Specialist', 'Fast reply'],
    priceFrom: 'Rp 100.000',
  },
  {
    id: 'rendra-saputra',
    name: 'Rendra Saputra',
    avatarSeed: 'RS',
    avatarColor: 'bg-cyan-500',
    rating: 4.8,
    reviewCount: 110,
    specialties: ['Water Heater', 'Oven', 'Ariston', 'Modena'],
    area: 'Rungkut, Surabaya',
    verified: true,
    completedJobs: 135,
    yearsExperience: 7,
    badges: ['Multi-brand Certified', 'Top Rated'],
    priceFrom: 'Rp 140.000',
  },
]
