import { useCallback, useEffect, useRef, useState } from 'react'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import UploadStep from '../components/ai-diagnose/UploadStep'
import ScanningStep from '../components/ai-diagnose/ScanningStep'
import ResultStep from '../components/ai-diagnose/ResultStep'
import { DEMO_SEEDS, getDemoDiagnosis } from '../lib/aiDiagnose'
import type { DiagnoseResult } from '../lib/aiDiagnose'

type Step = 'upload' | 'scanning' | 'result'

function AIDiagnose() {
  const [step, setStep] = useState<Step>('upload')
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [result, setResult] = useState<DiagnoseResult | null>(null)
  const nextSeedIndexRef = useRef(Math.floor(Math.random() * DEMO_SEEDS.length))

  useEffect(() => {
    if (!imagePreviewUrl) return
    return () => URL.revokeObjectURL(imagePreviewUrl)
  }, [imagePreviewUrl])

  const handleAnalyze = (file: File, enteredDescription: string) => {
    setImagePreviewUrl(URL.createObjectURL(file))
    setDescription(enteredDescription)
    setStep('scanning')
  }

  const handleScanComplete = useCallback(() => {
    const seedIndex = nextSeedIndexRef.current
    nextSeedIndexRef.current = (seedIndex + 1) % DEMO_SEEDS.length
    setResult(getDemoDiagnosis(description, seedIndex))
    setStep('result')
  }, [description])

  const handleReset = () => {
    setImagePreviewUrl(null)
    setDescription('')
    setResult(null)
    setStep('upload')
  }

  return (
    <div className="font-sans text-brand-ink bg-white antialiased min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 bg-mint-50">
        {step === 'upload' && <UploadStep onAnalyze={handleAnalyze} />}
        {step === 'scanning' && imagePreviewUrl && (
          <ScanningStep imagePreviewUrl={imagePreviewUrl} onComplete={handleScanComplete} />
        )}
        {step === 'result' && result && imagePreviewUrl && (
          <ResultStep result={result} imagePreviewUrl={imagePreviewUrl} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AIDiagnose
