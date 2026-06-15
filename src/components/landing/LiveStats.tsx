import { LIVE_STATS } from '../../data/liveActivity'

export default function LiveStats() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
      {LIVE_STATS.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <Icon className={`w-6 h-6 ${stat.accent}`} />
            <p className={`font-poster text-3xl mt-3 ${stat.accent}`}>{stat.value}</p>
            <p className="text-sm text-white/55 mt-1">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
