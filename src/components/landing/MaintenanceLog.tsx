import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { appliances } from '../../data/appliances'
import { categories } from '../../data/categories'

export default function MaintenanceLog() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-poster uppercase text-5xl">
            Make it <span className="hl">last longer.</span>
          </h2>
          <p className="mt-4 text-brand-ink/60 max-w-md">
            Every repair, service, and part replacement is logged automatically — so you always know your appliances' health and what's due next.
          </p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-brand hover:text-brand-700">
            See your home health <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-mint-50 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg">My Appliances</h3>
            <span className="text-xs font-bold bg-brand text-white px-3 py-1 rounded-full">Home health 78%</span>
          </div>
          <div className="space-y-3">
            {appliances.map((appliance) => {
              const category = categories.find((c) => c.name === appliance.category)
              const Icon = category?.icon
              return (
                <div key={appliance.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-card">
                  {Icon && <Icon className={`w-7 h-7 ${category?.iconColor}`} />}
                  <div className="flex-1">
                    <p className="font-bold text-sm">{appliance.name}</p>
                    <p className="text-xs text-brand-ink/50">{appliance.brand} · {appliance.model}</p>
                    {appliance.status === 'Needs attention' && (
                      <p className="text-xs text-red-400 font-semibold mt-1">Needs attention</p>
                    )}
                  </div>
                  <span className="font-extrabold text-lg">{appliance.healthPercent}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
