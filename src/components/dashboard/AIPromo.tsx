import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function AIPromo() {
  return (
    <section className="bg-brand-ink text-white rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-brand/30 blur-2xl" />
      <span className="text-xs font-extrabold text-brand uppercase tracking-wide">AI diagnostic engine</span>
      <h3 className="font-bold text-lg mt-2 leading-snug">Auto-diagnose via camera</h3>
      <p className="text-sm text-white/60 mt-1">Upload a photo → AI spots the issue → matches a technician.</p>
      <Link
        to="/ai-diagnose"
        className="mt-4 inline-flex items-center gap-2 bg-brand font-bold text-sm px-4 py-2 rounded-full hover:bg-brand-600"
      >
        Start scan <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  )
}
