import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Camera, Clock, MapPin, Search, ShieldCheck, Sparkles, Star, Video } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-brand wave text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 2px, transparent 2px)', backgroundSize: '34px 34px' }}
      />
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-28 grid lg:grid-cols-[1.05fr,0.95fr] gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/15 border border-white/25 rounded-full px-3 py-1.5 mb-5">
            <ShieldCheck className="w-4 h-4 text-sun" /> Verified & certified technicians only
          </span>
          <h1 className="font-poster uppercase leading-[0.9] tracking-tight text-6xl lg:text-7xl">
            Trusted repair.<br />Fix it before<br />it <span className="hl text-brand-ink">breaks.</span>
          </h1>
          <p className="mt-6 text-white/85 text-lg max-w-md">
            Book a background-checked technician for your AC, fridge, washer and more — at a fixed price you see before you book.
          </p>

          <div className="mt-7 bg-white rounded-2xl p-2 shadow-soft flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-mint-50">
              <Search className="w-5 h-5 text-brand" />
              <input
                className="bg-transparent w-full text-brand-ink placeholder:text-brand-ink/40 text-sm font-medium outline-none"
                placeholder="What needs fixing? e.g. AC not cooling"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-mint-50 sm:w-36">
              <MapPin className="w-5 h-5 text-brand" />
              <input
                className="bg-transparent w-full text-brand-ink placeholder:text-brand-ink/40 text-sm font-medium outline-none"
                placeholder="Surabaya"
              />
            </div>
            <Link
              to="/dashboard"
              className="bg-brand-ink text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-black whitespace-nowrap inline-flex items-center justify-center"
            >
              Find a technician
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-4 h-4 text-sun fill-sun" /> 4.9 avg rating
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-sun" /> Fixed, upfront pricing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sun" /> Same-day slots
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl shadow-soft p-5 border-4 border-brand-ink text-brand-ink">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold tracking-wider text-brand">⚡ AI DIAGNOSTIC ENGINE</span>
              <span className="text-[11px] font-bold text-brand-ink/40">85% accuracy</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/ai-diagnose"
                className="rounded-2xl border-2 border-dashed border-mint-200 bg-mint-50 py-6 grid place-items-center gap-1.5 hover:border-brand transition"
              >
                <Camera className="w-7 h-7 text-brand" />
                <span className="text-sm font-bold">Upload Photo</span>
              </Link>
              <Link
                to="/ai-diagnose"
                className="rounded-2xl border-2 border-dashed border-mint-200 bg-mint-50 py-6 grid place-items-center gap-1.5 hover:border-brand transition"
              >
                <Video className="w-7 h-7 text-brand" />
                <span className="text-sm font-bold">Upload Video</span>
              </Link>
            </div>
            <div className="mt-3 bg-brand-ink text-white rounded-2xl p-4 text-sm">
              <p className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sun" /> <span className="text-white/70">AI found:</span> <b>AC low on refrigerant</b>
              </p>
              <Link
                to="/ai-diagnose"
                className="mt-3 w-full bg-brand font-bold py-2.5 rounded-xl hover:bg-brand-600 inline-flex items-center justify-center gap-2"
              >
                Match me a technician <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
