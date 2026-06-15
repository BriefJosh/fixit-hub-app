import { useEffect, useState } from 'react'
import { jitterCount } from '../../lib/liveSimulation'
import LiveStats from './LiveStats'
import LiveMap from './LiveMap'
import LiveActivityFeed from './LiveActivityFeed'

const COUNT_INTERVAL_MS = 5200
const COUNT_MIN = 38
const COUNT_MAX = 59
const INITIAL_COUNT = 47

export default function LiveSection() {
  const [proCount, setProCount] = useState(INITIAL_COUNT)

  useEffect(() => {
    const interval = setInterval(() => {
      setProCount((current) => jitterCount(current, COUNT_MIN, COUNT_MAX))
    }, COUNT_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="live" className="bg-brand-ink text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-white/10 px-3 py-1.5 rounded-full">
          <span className="livedot" />
          Live · updating in real time
        </span>
        <h2 className="font-poster uppercase text-5xl mt-4">
          <span className="text-sun">{proCount}</span> pros working
          <br />
          across Surabaya <span className="hl text-brand-ink">right now.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-white/60">
          Every dot on the map is a real booking in progress — anonymized for privacy, updated live as technicians
          take and complete jobs across the city.
        </p>

        <div className="mt-10">
          <LiveStats />
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <LiveMap />
          <LiveActivityFeed />
        </div>
      </div>
    </section>
  )
}
