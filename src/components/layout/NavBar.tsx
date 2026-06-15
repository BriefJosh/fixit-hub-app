import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-mint-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-brand grid place-items-center text-white">
            <Wrench className="w-5 h-5" />
          </span>
          <span className="font-extrabold text-lg tracking-tight">Fix-It Hub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-ink/70">
          <a href="#services" className="hover:text-brand-ink">Services</a>
          <a href="#how" className="hover:text-brand-ink">How it works</a>
          <Link to="/ai-diagnose" className="hover:text-brand-ink">AI Diagnostics</Link>
          <a href="#trust" className="hover:text-brand-ink">Trust</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="hidden sm:block text-sm font-semibold text-brand-ink/70 hover:text-brand-ink">
            Log in
          </Link>
          <Link to="/dashboard" className="text-sm font-bold text-white bg-brand hover:bg-brand-600 px-4 py-2 rounded-full shadow-card">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}
