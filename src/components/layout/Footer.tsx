export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="mb-3">
            <img src="/logo/fih-logo-y.svg" alt="Fix-It Hub" className="h-7 w-auto" />
          </div>
          <p className="text-white/50">The trusted, AI-powered appliance repair platform in Indonesia.</p>
        </div>
        <div>
          <p className="font-bold mb-3">Services</p>
          <ul className="space-y-2 text-white/55">
            <li>AC & HVAC</li>
            <li>Refrigerator</li>
            <li>Washing Machine</li>
            <li>Television</li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-3">Company</p>
          <ul className="space-y-2 text-white/55">
            <li>About</li>
            <li>For Technicians</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-3">Get the app</p>
          <p className="text-white/55 mb-3">Available on iOS & Android.</p>
          <div className="flex gap-2">
            <span className="px-3 py-2 rounded-lg bg-white/10 text-xs font-semibold">App Store</span>
            <span className="px-3 py-2 rounded-lg bg-white/10 text-xs font-semibold">Google Play</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © 2026 Fix-It Hub · Technopreneur Project
      </div>
    </footer>
  )
}
