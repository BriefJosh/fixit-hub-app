import { Link } from 'react-router-dom'
import { CalendarCheck, ScanSearch, ShieldCheck, Tag } from 'lucide-react'

export default function TrustBand() {
  return (
    <section id="trust" className="bg-brand-ink text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poster uppercase text-5xl mb-10">
          Who's really <span className="hl text-brand-ink">fixing it?</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <ShieldCheck className="w-8 h-8 text-sun" />
            <h3 className="font-extrabold text-lg mt-4">Verified network</h3>
            <p className="text-sm text-white/55 mt-1">Every technician passes a background check and skills certification.</p>
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <Tag className="w-8 h-8 text-sun" />
            <h3 className="font-extrabold text-lg mt-4">Fixed pricing</h3>
            <p className="text-sm text-white/55 mt-1">See the price before you book — no surprise call-out fees.</p>
          </div>
          <Link to="/ai-diagnose" className="rounded-3xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition block">
            <ScanSearch className="w-8 h-8 text-sun" />
            <h3 className="font-extrabold text-lg mt-4">AI diagnostics</h3>
            <p className="text-sm text-white/55 mt-1">Snap a photo or video and get an instant likely-cause estimate.</p>
          </Link>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
            <CalendarCheck className="w-8 h-8 text-sun" />
            <h3 className="font-extrabold text-lg mt-4">Maintenance log</h3>
            <p className="text-sm text-white/55 mt-1">Every job is logged so you know exactly what's been done — and what's next.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
