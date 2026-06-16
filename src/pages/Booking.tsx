import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { getService } from '../data/services'

type Step = 1 | 2 | 3
type PropertyType = 'House' | 'Apartment' | 'Other'
type TimeSlot = 'Morning (07:00–10:00)' | 'Afternoon (10:00–14:00)' | 'Evening (14:00–18:00)'

const TIME_SLOTS: TimeSlot[] = [
  'Morning (07:00–10:00)',
  'Afternoon (10:00–14:00)',
  'Evening (14:00–18:00)',
]

const APARTMENT_SURCHARGE = 20000
const PLATFORM_FEE = 11000
const PROBLEM_PRICE = 25000

function formatRp(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`
}

function StepPill({ n, active }: { n: number; active: boolean }) {
  return (
    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center
      ${active ? 'bg-brand text-white' : 'bg-mint-100 text-brand-ink/40'}`}>
      {n}
    </span>
  )
}

function Calendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  const startPad = (firstDay.getDay() + 6) % 7

  const days: (Date | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewYear, viewMonth, d))

  const monthLabel = firstDay.toLocaleString('en', { month: 'long', year: 'numeric' })

  function prev() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
  }
  function next() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
  }

  return (
    <div className="bg-white rounded-2xl border border-mint-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} aria-label="Previous month" className="p-1 rounded-full hover:bg-mint-50">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-sm">{monthLabel}</span>
        <button onClick={next} aria-label="Advance month" className="p-1 rounded-full hover:bg-mint-50">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-brand-ink/50 mb-2 text-center">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <span key={`pad-${i}`} />
          const isPast = d < today
          const isSelected = selected?.toDateString() === d.toDateString()
          const isToday = d.toDateString() === today.toDateString()
          return (
            <button
              key={d.toISOString()}
              disabled={isPast}
              onClick={() => onSelect(d)}
              aria-label={d.toLocaleDateString('en', { day: 'numeric', month: 'short' })}
              className={`text-sm rounded-full w-8 h-8 mx-auto flex items-center justify-center font-medium transition
                ${isPast ? 'text-brand-ink/20 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-brand text-white' : ''}
                ${!isPast && !isSelected && isToday ? 'bg-mint-100 font-bold' : ''}
                ${!isPast && !isSelected && !isToday ? 'hover:bg-mint-100' : ''}
              `}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Booking() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const service = getService(serviceId ?? '')

  const [step, setStep] = useState<Step>(1)
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [propertyType, setPropertyType] = useState<PropertyType>('House')

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-brand-ink">
        <p className="text-brand-ink/50">Service not found.</p>
      </div>
    )
  }

  const problemsTotal = selectedProblems.length * PROBLEM_PRICE
  const apartmentSurcharge = propertyType === 'Apartment' ? APARTMENT_SURCHARGE : 0
  const subtotal = service.basePrice + problemsTotal
  const total = subtotal + apartmentSurcharge + PLATFORM_FEE

  function toggleProblem(p: string) {
    setSelectedProblems((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  return (
    <div className="min-h-screen bg-mint-50 font-sans text-brand-ink antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-mint-100">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink/60 hover:text-brand-ink">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <img src="/logo/fih-logo-b.svg" alt="Fix-It Hub" className="h-7 w-auto" />
          <div className="flex gap-1.5">
            {([1, 2, 3] as const).map((n) => <StepPill key={n} n={n} active={step === n} />)}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* ── Step 1: Problem ── */}
        {step === 1 && (
          <div>
            <h1 className="font-poster uppercase text-5xl mb-1">{service.name}</h1>
            <p className="text-brand-ink/60 mb-8">What's going on?</p>
            <div className="space-y-3 mb-6">
              {service.problems.map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 cursor-pointer border border-mint-100 hover:border-brand transition"
                >
                  <input
                    type="checkbox"
                    className="accent-brand w-4 h-4"
                    checked={selectedProblems.includes(p)}
                    onChange={() => toggleProblem(p)}
                  />
                  <span className="font-semibold">{p}</span>
                </label>
              ))}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue (optional)"
              className="w-full border border-mint-100 rounded-2xl px-5 py-4 text-sm resize-none focus:outline-none focus:border-brand mb-6 bg-white"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-ink/60">
                Estimated: <span className="font-bold text-brand-ink">{formatRp(subtotal)}</span>
              </span>
              <button
                onClick={() => setStep(2)}
                className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-600 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Schedule ── */}
        {step === 2 && (
          <div>
            <h1 className="font-poster uppercase text-5xl mb-1">Schedule</h1>
            <p className="text-brand-ink/60 mb-8">When do you need us?</p>
            <Calendar selected={selectedDate} onSelect={setSelectedDate} />
            <div className="grid grid-cols-3 gap-3 mt-6 mb-8">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-2xl py-4 px-2 text-sm font-bold border-2 transition
                    ${selectedSlot === slot
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white border-mint-100 hover:border-brand text-brand-ink'}`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="text-sm font-semibold text-brand-ink/60 hover:text-brand-ink">
                ← Back
              </button>
              <button
                disabled={!selectedDate || !selectedSlot}
                onClick={() => setStep(3)}
                className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && (
          <div>
            <h1 className="font-poster uppercase text-5xl mb-1">Confirm</h1>
            <p className="text-brand-ink/60 mb-8">Review your booking</p>

            {/* Address */}
            <div className="bg-white rounded-2xl p-5 border border-mint-100 mb-4">
              <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-wide mb-1">Location</p>
              <p className="font-semibold">Tower 1 ITS, Sukolilo, Surabaya 60111</p>
            </div>

            {/* Property type */}
            <div className="bg-white rounded-2xl p-5 border border-mint-100 mb-4">
              <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-wide mb-3">Property type</p>
              <div className="space-y-2">
                {(['House', 'Apartment', 'Other'] as PropertyType[]).map((t) => (
                  <label key={t} className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-3 font-semibold">
                      <input
                        type="radio"
                        name="propertyType"
                        className="accent-brand"
                        checked={propertyType === t}
                        onChange={() => setPropertyType(t)}
                      />
                      {t}
                    </span>
                    <span className="text-sm text-brand-ink/50">
                      {t === 'Apartment' ? `+${formatRp(APARTMENT_SURCHARGE)}` : 'Rp 0'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl p-5 border border-mint-100 mb-8">
              <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-wide mb-4">Order summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{service.name}</span>
                  <span>{formatRp(service.basePrice)}</span>
                </div>
                {selectedProblems.length > 0 && (
                  <div className="flex justify-between text-brand-ink/60">
                    <span>{selectedProblems.join(', ')}</span>
                    <span>+{formatRp(problemsTotal)}</span>
                  </div>
                )}
                {selectedDate && selectedSlot && (
                  <p className="text-brand-ink/60 text-xs mt-1">
                    {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {selectedSlot}
                  </p>
                )}
                {propertyType === 'Apartment' && (
                  <div className="flex justify-between text-brand-ink/60">
                    <span>Apartment surcharge</span>
                    <span>+{formatRp(APARTMENT_SURCHARGE)}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-ink/60">
                  <span>Platform fee</span>
                  <span>{formatRp(PLATFORM_FEE)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base pt-2 border-t border-mint-100">
                  <span>Total</span>
                  <span>{formatRp(total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="text-sm font-semibold text-brand-ink/60 hover:text-brand-ink">
                ← Back
              </button>
              <button
                onClick={() => navigate('/booking-confirmed/001')}
                className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-600 transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
