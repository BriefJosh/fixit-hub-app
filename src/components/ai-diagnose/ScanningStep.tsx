import { useEffect, useRef, useState } from 'react'
import { ScanSearch } from 'lucide-react'

interface ScanningStepProps {
  imagePreviewUrl: string
  onComplete: () => void
}

const SCAN_MESSAGES = [
  'Detecting appliance category...',
  'Checking brand markings...',
  'Cross-referencing spec sheets...',
  'Matching nearby technicians...',
]

const SCAN_DURATION_MS = 2500
const MESSAGE_INTERVAL_MS = 700

export default function ScanningStep({ imagePreviewUrl, onComplete }: ScanningStepProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const completeTimer = setTimeout(() => onCompleteRef.current(), SCAN_DURATION_MS)
    const messageTimer = setInterval(() => {
      setMessageIndex((index) => (index + 1) % SCAN_MESSAGES.length)
    }, MESSAGE_INTERVAL_MS)

    return () => {
      clearTimeout(completeTimer)
      clearInterval(messageTimer)
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="relative rounded-3xl overflow-hidden border border-mint-200 shadow-card">
        <img
          src={imagePreviewUrl}
          alt="Appliance being analyzed"
          className="w-full max-h-[28rem] object-contain bg-mint-50"
        />
        <div className="scan-grid absolute inset-0 pointer-events-none" />
        <div className="scan-line absolute inset-x-0 top-0 pointer-events-none" />
        <span className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-brand rounded-tl-xl" />
        <span className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-brand rounded-tr-xl" />
        <span className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-brand rounded-bl-xl" />
        <span className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-brand rounded-br-xl" />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-brand font-bold">
        <ScanSearch className="w-5 h-5 animate-pulse" />
        <span>{SCAN_MESSAGES[messageIndex]}</span>
      </div>
      <p className="mt-2 text-sm text-brand-ink/50">Analyzing photo with AI Diagnose...</p>
    </div>
  )
}
