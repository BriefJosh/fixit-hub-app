import { Calendar } from 'lucide-react'
import { bookings } from '../../data/bookings'
import { technicians } from '../../data/technicians'

export default function UpcomingBooking() {
  const booking = bookings[0]
  const technician = technicians.find((tech) => tech.id === booking.technicianId)

  return (
    <section className="bg-white rounded-3xl shadow-card p-6">
      <h2 className="font-extrabold text-lg mb-4">Upcoming</h2>
      <div className="rounded-2xl bg-mint-50 p-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-10 h-10 rounded-full text-white grid place-items-center text-xs font-bold ${technician?.avatarColor ?? 'bg-brand'}`}
          >
            {technician?.avatarSeed}
          </span>
          <div>
            <p className="font-bold text-sm">{booking.technician}</p>
            <p className="text-xs text-brand-ink/45">
              {booking.service} · {technician?.rating}★
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-brand-ink/60">
            <Calendar className="w-4 h-4" /> {booking.date}
          </span>
          <span className="font-extrabold text-brand">{booking.price}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" className="flex-1 bg-brand text-white text-xs font-bold py-2 rounded-lg hover:bg-brand-600">
            Track
          </button>
          <button type="button" className="flex-1 bg-white border border-mint-200 text-xs font-bold py-2 rounded-lg">
            Message
          </button>
        </div>
      </div>
    </section>
  )
}
