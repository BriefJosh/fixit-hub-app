import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="bg-brand text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-poster uppercase text-5xl lg:text-6xl">Stop guessing. Start fixing.</h2>
        <p className="mt-4 text-white/85 max-w-lg mx-auto">
          Join thousands of households across Indonesia who trust Fix-It Hub for fast, fair, and verified appliance repair.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/dashboard" className="bg-brand-ink text-white font-bold px-7 py-3.5 rounded-full hover:bg-black">
            Book a repair
          </Link>
          <Link to="/dashboard" className="bg-sun text-brand-ink font-bold px-7 py-3.5 rounded-full hover:brightness-105">
            Become a technician
          </Link>
        </div>
      </div>
    </section>
  )
}
