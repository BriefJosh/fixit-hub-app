export interface Booking {
  id: string
  service: string
  technicianId: string
  technician: string
  date: string
  price: string
  status: 'confirmed' | 'in-progress' | 'completed'
}

export const bookings: Booking[] = [
  {
    id: 'bk-1',
    service: 'AC & HVAC Specialist',
    technicianId: 'agus-wibowo',
    technician: 'Agus Wibowo',
    date: 'Mon, 5 Jun · 09:00',
    price: 'Rp 165.000',
    status: 'confirmed',
  },
]
