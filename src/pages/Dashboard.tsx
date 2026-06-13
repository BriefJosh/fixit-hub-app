import { LayoutDashboard } from 'lucide-react'

function Dashboard() {
  return (
    <main className="min-h-screen bg-mint-50 flex items-center justify-center font-sans text-brand-ink">
      <div className="text-center px-6">
        <LayoutDashboard className="w-10 h-10 text-brand mx-auto" />
        <h1 className="font-poster text-5xl sm:text-6xl tracking-wide mt-4">DASHBOARD</h1>
        <p className="mt-3 text-brand-ink/60">Dashboard — built in a later plan.</p>
      </div>
    </main>
  )
}

export default Dashboard
