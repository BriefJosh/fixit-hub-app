import { Link } from 'react-router-dom'
import { CalendarPlus, MapPin, ScanSearch } from 'lucide-react'
import { appliances } from '../../data/appliances'

export default function HeroSection() {
  const needsAttentionCount = appliances.filter((appliance) => appliance.status === 'Needs attention').length

  return (
    <section className="rounded-3xl bg-brand text-white p-7 md:p-9 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-16 w-64 h-64 rounded-full bg-white/10" />
      <div className="absolute right-16 -top-12 w-40 h-40 rounded-full bg-white/10" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-white/80 text-sm flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Surabaya, Jawa Timur
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Good morning, Budi 👋</h1>
          <p className="text-white/80 mt-1.5">Something wrong with a home appliance? Let&apos;s fix it.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/ai-diagnose"
              className="bg-white text-brand-ink font-bold text-sm px-5 py-2.5 rounded-full hover:bg-mint-50 inline-flex items-center gap-2"
            >
              <ScanSearch className="w-4 h-4 text-brand" /> Diagnose with AI
            </Link>
            <a
              href="#technicians"
              className="bg-brand-ink/30 border border-white/30 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-brand-ink/50 inline-flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" /> Book a technician
            </a>
          </div>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center min-w-[160px]">
          <p className="text-xs text-white/70 font-semibold">HOME HEALTH</p>
          <p className="text-5xl font-extrabold mt-1">78%</p>
          {needsAttentionCount > 0 && (
            <p className="text-xs text-sun font-semibold mt-1">{needsAttentionCount} appliance needs attention</p>
          )}
        </div>
      </div>
    </section>
  )
}
