const TICKER_TEXT =
  'AC & HVAC ✦ Refrigerator ✦ Washing Machine ✦ Television ✦ Oven ✦ Water Heater ✦ Verified Technicians ✦ Fixed Pricing ✦'

export default function Ticker() {
  return (
    <div className="bg-brand-ink text-white overflow-hidden py-3 -rotate-1 -mt-6 relative z-20 shadow-soft">
      <div className="ticker whitespace-nowrap font-poster uppercase text-2xl tracking-wide flex gap-8">
        <span>{TICKER_TEXT}</span>
        <span>{TICKER_TEXT}</span>
      </div>
    </div>
  )
}
