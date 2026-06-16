import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Send } from 'lucide-react'

const DEFAULT_LOCATION: [number, number] = [-7.2849915, 112.793897] // Tower 1 ITS (Menara Sains)
const ANIMATION_DURATION_MS = 45_000 // 45 seconds total

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

interface Message {
  id: string
  from: 'technician' | 'user'
  text: string
  time: string
}

const AUTO_REPLIES = [
  'Got it! See you soon.',
  'Sure, no problem at all.',
  'Thanks for letting me know!',
]

function computeTechStart(userLoc: [number, number]): [number, number] {
  return [userLoc[0] - 0.004, userLoc[1] - 0.004] // ~550m SW
}

async function fetchRoute(from: [number, number], to: [number, number]): Promise<[number, number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
    const res = await fetch(url)
    if (!res.ok) throw new Error('osrm error')
    const data = await res.json()
    const coords: [number, number][] = data.routes[0].geometry.coordinates
    return coords.map(([lng, lat]) => [lat, lng]) // GeoJSON is [lng,lat], Leaflet wants [lat,lng]
  } catch {
    return [from, to] // fallback: straight line
  }
}

function getUserLocation(): Promise<[number, number]> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_LOCATION)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      () => resolve(DEFAULT_LOCATION),
      { timeout: 5000 },
    )
  })
}

function timestamp() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
}

export default function BookingConfirmed() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [arrived, setArrived] = useState(false)
  const [eta, setEta] = useState(8)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'opening',
      from: 'technician',
      text: "Hi! I'm on my way. Should arrive in about 8 minutes. Please make sure the appliance is accessible.",
      time: timestamp(),
    },
  ])
  const [input, setInput] = useState('')
  const replyIndexRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const container = mapRef.current
    if (!container) return

    // Synchronous map init with DEFAULT_LOCATION
    const map = L.map(container, { center: DEFAULT_LOCATION, zoom: 15, zoomControl: false, scrollWheelZoom: false })
    L.tileLayer(TILE_URL, { subdomains: 'abcd', attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map)

    const userIcon = L.divIcon({
      className: '',
      html: '<span style="width:16px;height:16px;background:#15B877;border:3px solid white;border-radius:50%;display:block;box-shadow:0 0 0 4px #15B87733"></span>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    const userMarker = L.marker(DEFAULT_LOCATION, { icon: userIcon }).addTo(map)

    const techIcon = L.divIcon({
      className: '',
      html: '<span style="width:14px;height:14px;background:#FFD21E;border:3px solid white;border-radius:50%;display:block"></span>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    })
    const techMarker = L.marker(computeTechStart(DEFAULT_LOCATION), { icon: techIcon }).addTo(map)

    let intervalId: ReturnType<typeof setInterval> | null = null

    // Async: get real location, fetch route, start animation
    ;(async () => {
      const userLoc = await getUserLocation()
      userMarker.setLatLng(userLoc)
      map.setView(userLoc, 15)

      const techStart = computeTechStart(userLoc)
      techMarker.setLatLng(techStart)

      const route = await fetchRoute(techStart, userLoc)

      // Gojek-style route line from tech to user
      const routeLine = L.polyline(route, { color: '#15B877', weight: 4, opacity: 0.75 }).addTo(map)

      const stepCount = route.length
      const stepInterval = Math.max(100, Math.round(ANIMATION_DURATION_MS / stepCount))

      let step = 0
      intervalId = setInterval(() => {
        step++
        if (step >= stepCount) {
          clearInterval(intervalId!)
          intervalId = null
          routeLine.remove()
          setArrived(true)
          setEta(0)
          return
        }
        techMarker.setLatLng(route[step])
        routeLine.setLatLngs(route.slice(step))
        setEta(Math.max(0, Math.round((1 - step / stepCount) * 8)))
      }, stepInterval)
    })()

    return () => {
      if (intervalId !== null) clearInterval(intervalId)
      map.remove()
    }
  }, [])

  function sendMessage() {
    if (!input.trim()) return
    const userMsg: Message = { id: `u-${Date.now()}`, from: 'user', text: input.trim(), time: timestamp() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    const replyText = AUTO_REPLIES[replyIndexRef.current % AUTO_REPLIES.length]
    replyIndexRef.current += 1
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `t-${Date.now()}`, from: 'technician', text: replyText, time: timestamp() },
      ])
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-mint-50 font-sans text-brand-ink antialiased flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-mint-100 px-6 h-14 flex items-center relative">
        <Link to="/dashboard" className="text-sm font-semibold text-brand-ink/60 hover:text-brand-ink flex items-center gap-1">
          ← Dashboard
        </Link>
        <img
          src="/logo/fih-logo-b.svg"
          alt="Fix-It Hub"
          className="h-7 w-auto absolute left-1/2 -translate-x-1/2"
        />
      </header>

      {/* Map */}
      <div ref={mapRef} className="h-72 w-full flex-shrink-0" />

      {/* Status bar */}
      <div className="bg-white border-b border-mint-100 px-6 py-4 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
            BS
          </span>
          <div>
            <p className="font-extrabold text-sm">Budi Santoso</p>
            <p className="text-xs text-brand-ink/50">Verified Pro · ⭐ 4.9</p>
          </div>
        </div>
        <div className="text-right">
          {arrived ? (
            <p className="font-bold text-brand text-sm">Arrived ✓</p>
          ) : (
            <>
              <p className="flex items-center gap-1.5 font-bold text-sm justify-end">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse inline-block" />
                On the way
              </p>
              <p className="text-xs text-brand-ink/50">~{eta} min</p>
            </>
          )}
        </div>
      </div>

      {/* Chat thread */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-6 pb-28 overflow-y-auto">
        <p className="text-xs text-center text-brand-ink/40 mb-6 font-semibold uppercase tracking-wide">Today</p>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-3 text-sm font-medium
                  ${msg.from === 'user'
                    ? 'bg-brand text-white rounded-2xl rounded-br-none'
                    : 'bg-white text-brand-ink rounded-2xl rounded-bl-none border border-mint-100'}`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-white/60' : 'text-brand-ink/40'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky input bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-mint-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Message Budi…"
            className="flex-1 border border-mint-100 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand"
          />
          <button
            disabled={!input.trim()}
            onClick={sendMessage}
            aria-label="Send"
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-600 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
