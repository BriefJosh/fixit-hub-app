import { ScanSearch } from 'lucide-react'

function AIDiagnose() {
  return (
    <main className="min-h-screen bg-mint-50 flex items-center justify-center font-sans text-brand-ink">
      <div className="text-center px-6">
        <ScanSearch className="w-10 h-10 text-brand mx-auto" />
        <h1 className="font-poster text-5xl sm:text-6xl tracking-wide mt-4">AI DIAGNOSE</h1>
        <p className="mt-3 text-brand-ink/60">AI Diagnose flow — built in a later plan.</p>
      </div>
    </main>
  )
}

export default AIDiagnose
