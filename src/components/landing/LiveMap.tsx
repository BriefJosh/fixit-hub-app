import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LIVE_CENTER } from '../../data/liveActivity'
import { createJobMarker } from '../../lib/liveSimulation'

const SEED_MARKER_COUNT = 22
const MARKER_INTERVAL_MS = 5200
const MARKER_LIFETIME_MS = 9000
const MAP_ZOOM = 12
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<span class="jobdot" style="background:${color};color:${color}"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export default function LiveMap() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const map = L.map(container, {
      center: LIVE_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: false,
      scrollWheelZoom: false,
    })

    L.tileLayer(TILE_URL, { subdomains: 'abcd', attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map)

    let markerCounter = 0
    const addMarker = () => {
      const job = createJobMarker(`live-marker-${markerCounter}`)
      markerCounter += 1
      return L.marker([job.lat, job.lng], { icon: createMarkerIcon(job.color) }).addTo(map)
    }

    for (let i = 0; i < SEED_MARKER_COUNT; i += 1) {
      addMarker()
    }

    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    const interval = setInterval(() => {
      const marker = addMarker()
      const timeout = setTimeout(() => {
        map.removeLayer(marker)
        timeouts.delete(timeout)
      }, MARKER_LIFETIME_MS)
      timeouts.add(timeout)
    }, MARKER_INTERVAL_MS)

    return () => {
      clearInterval(interval)
      timeouts.forEach((timeout) => clearTimeout(timeout))
      map.remove()
    }
  }, [])

  return (
    <div className="live-map relative rounded-3xl overflow-hidden border border-white/10">
      <div ref={containerRef} className="h-[360px] w-full" />
      <span className="absolute top-3 left-3 z-[1000] text-xs font-bold uppercase tracking-wide bg-brand-ink/80 text-white px-3 py-1.5 rounded-full border border-white/10">
        Preview map · production = Mapbox in brand green
      </span>
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-3 text-xs font-bold bg-brand-ink/80 text-white px-3 py-1.5 rounded-full border border-white/10">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand inline-block" /> Live now
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sun inline-block" /> Just completed
        </span>
      </div>
    </div>
  )
}
