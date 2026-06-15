import { useEffect, useRef, useState } from 'react'
import { LIVE_CATEGORIES } from '../../data/liveActivity'
import { createFeedItem } from '../../lib/liveSimulation'
import type { FeedItem } from '../../lib/liveSimulation'

const FEED_INTERVAL_MS = 5200
const MAX_FEED_ITEMS = 7
const SEED_COUNT = 6

function iconFor(category: string) {
  return LIVE_CATEGORIES.find((item) => item.name === category)?.icon ?? LIVE_CATEGORIES[0].icon
}

export default function LiveActivityFeed() {
  const [items, setItems] = useState<FeedItem[]>(() =>
    Array.from({ length: SEED_COUNT }, (_, index) => createFeedItem(`seed-${index}`)),
  )
  const counterRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const next = createFeedItem(`feed-${counterRef.current}`)
      counterRef.current += 1
      setItems((current) => [next, ...current].slice(0, MAX_FEED_ITEMS))
    }, FEED_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2.5 h-[360px] overflow-y-auto">
      {items.map((item) => {
        const Icon = iconFor(item.category)
        return (
          <div
            key={item.id}
            className="feed-enter flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
          >
            <span
              className="w-9 h-9 rounded-full grid place-items-center shrink-0"
              style={{ backgroundColor: `${item.color}26`, color: item.color }}
            >
              <Icon className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {item.category} · {item.status}
              </p>
              <p className="text-xs text-white/55">
                {item.area} · ★ {item.rating.toFixed(1)} · {item.timeLabel}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
