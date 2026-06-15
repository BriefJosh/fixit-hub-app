import { Plus } from 'lucide-react'
import { appliances } from '../../data/appliances'
import { categories } from '../../data/categories'

export default function MyAppliances() {
  return (
    <section className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-extrabold text-lg">My appliances</h2>
        <button type="button" className="text-sm font-bold text-brand inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {appliances.map((appliance) => {
          const categoryMeta = categories.find((category) => category.name === appliance.category)
          const Icon = categoryMeta?.icon
          const needsAttention = appliance.status === 'Needs attention'

          return (
            <div
              key={appliance.id}
              className={`flex items-center gap-4 p-3 rounded-2xl border ${
                needsAttention ? 'border-red-100 bg-red-50/40' : 'border-mint-100'
              }`}
            >
              <span className="w-12 h-12 rounded-xl bg-mint-100 grid place-items-center">
                {Icon && <Icon className={`w-6 h-6 ${categoryMeta?.iconColor ?? 'text-brand'}`} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{appliance.name}</p>
                {needsAttention ? (
                  <p className="text-xs text-red-400 font-semibold">Needs attention · service overdue</p>
                ) : (
                  <p className="text-xs text-brand-ink/45">
                    {appliance.model} · last serviced {appliance.lastService}
                  </p>
                )}
                <div
                  className={`h-1.5 rounded-full mt-2 w-40 max-w-full ${needsAttention ? 'bg-red-100' : 'bg-mint-100'}`}
                  role="progressbar"
                  aria-valuenow={appliance.healthPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${appliance.name} health`}
                >
                  <div
                    className={`h-full rounded-full ${needsAttention ? 'bg-red-400' : 'bg-brand'}`}
                    style={{ width: `${appliance.healthPercent}%` }}
                  />
                </div>
              </div>
              {needsAttention ? (
                <a
                  href="#technicians"
                  className="text-xs font-bold text-white bg-brand px-3 py-2 rounded-lg hover:bg-brand-600"
                >
                  Book now
                </a>
              ) : (
                <div className="text-right">
                  <p className="font-extrabold text-brand">{appliance.healthPercent}%</p>
                  <p className="text-[11px] text-brand-ink/45">{appliance.status}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
