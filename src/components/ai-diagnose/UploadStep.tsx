import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, MouseEvent } from 'react'
import { ImagePlus, ScanSearch, UploadCloud } from 'lucide-react'

interface UploadStepProps {
  onAnalyze: (file: File, description: string) => void
}

export default function UploadStep({ onAnalyze }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const handleFile = (selected: File | null) => {
    if (!selected || !selected.type.startsWith('image/')) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files[0] ?? null)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleZoneClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== inputRef.current) inputRef.current?.click()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <ScanSearch className="w-10 h-10 text-brand mx-auto" />
        <h1 className="font-poster uppercase text-5xl sm:text-6xl tracking-wide mt-4">AI Diagnostics</h1>
        <p className="mt-3 text-brand-ink/60">
          Snap or upload a photo of the appliance and tell us what&apos;s wrong — we&apos;ll identify it and match
          you with the right technician.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
        className={`rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition ${
          isDragging ? 'border-brand bg-mint-50' : 'border-mint-200 bg-white'
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected appliance" className="max-h-64 mx-auto rounded-2xl object-contain" />
        ) : (
          <>
            <UploadCloud className="w-10 h-10 text-brand mx-auto" />
            <p className="mt-3 font-semibold">Drag and drop a photo here, or click to browse</p>
            <p className="text-sm text-brand-ink/50 mt-1">JPG or PNG, taken from any angle that shows the issue</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="sr-only"
          aria-label="Upload appliance photo"
        />
      </div>

      <label className="block mt-6">
        <span className="font-semibold text-sm">Describe the issue (optional)</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="e.g. Making a loud noise when it runs"
          rows={3}
          className="mt-2 w-full rounded-2xl border border-mint-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </label>

      <button
        type="button"
        disabled={!file}
        onClick={() => file && onAnalyze(file, description)}
        className="mt-6 w-full rounded-full bg-brand text-white font-bold py-3.5 shadow-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 transition flex items-center justify-center gap-2"
      >
        <ImagePlus className="w-5 h-5" />
        Analyze
      </button>
    </div>
  )
}
