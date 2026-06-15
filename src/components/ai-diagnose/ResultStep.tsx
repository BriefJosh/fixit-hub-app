import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw, ScanSearch, Star } from 'lucide-react'
import { categories } from '../../data/categories'
import type { DiagnoseResult } from '../../lib/aiDiagnose'

const CONFIDENCE_THRESHOLD = 0.5

interface ResultStepProps {
  result: DiagnoseResult
  imagePreviewUrl: string
  onReset: () => void
}

export default function ResultStep({ result, imagePreviewUrl, onReset }: ResultStepProps) {
  const categoryMeta = categories.find((category) => category.name === result.category)
  const CategoryIcon = categoryMeta?.icon ?? ScanSearch
  const isLowConfidence = result.confidence < CONFIDENCE_THRESHOLD
  const confidencePercent = Math.round(result.confidence * 100)
  const hasIdentification = Boolean(result.brand && result.model)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="rounded-3xl bg-white border border-mint-200 shadow-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <img
            src={imagePreviewUrl}
            alt="Diagnosed appliance"
            className="w-32 h-32 rounded-2xl object-cover bg-mint-50"
          />
          <div className="flex-1 min-w-[12rem]">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryIcon className={`w-6 h-6 ${categoryMeta?.iconColor ?? 'text-brand'}`} />
              <h1 className="font-poster uppercase text-3xl sm:text-4xl tracking-wide">{result.category}</h1>
              {result.source === 'demo' && (
                <span className="text-xs font-bold uppercase tracking-wide bg-sun text-brand-ink px-2.5 py-1 rounded-full">
                  Demo mode
                </span>
              )}
            </div>
            {isLowConfidence || !hasIdentification ? (
              <p className="mt-2 text-brand-ink/70">
                We&apos;re not fully confident yet — here&apos;s our best guess based on what&apos;s visible.
              </p>
            ) : (
              <p className="mt-2 text-lg font-semibold">
                {result.brand} {result.model}
              </p>
            )}
            <span className="inline-block mt-3 text-sm font-bold bg-mint-100 text-brand-700 px-3 py-1 rounded-full">
              {confidencePercent}% confident
            </span>
          </div>
        </div>
      </div>

      {result.specs && (
        <div className="mt-6 rounded-3xl bg-mint-50 p-6 sm:p-8">
          <h2 className="font-extrabold text-lg">
            Specs{result.specsSource === 'category-typical' ? ` (typical for ${result.category})` : ''}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-ink/50">Weight</p>
              <p className="font-bold mt-1">{result.specs.weightKg} kg</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-ink/50">Capacity</p>
              <p className="font-bold mt-1">{result.specs.capacity}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-ink/50">Power</p>
              <p className="font-bold mt-1">{result.specs.powerW} W</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-ink/50">Dimensions</p>
              <p className="font-bold mt-1">{result.specs.dimensions}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-3xl bg-brand-ink text-white p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <ScanSearch className="w-5 h-5 text-sun" />
          <h2 className="font-extrabold text-lg">AI note</h2>
        </div>
        <p className="mt-2 text-white/70">{result.technicianNotes}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-extrabold text-lg mb-4">Recommended technicians</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {result.recommendedTechnicians.map((tech) => (
            <div key={tech.id} className="rounded-3xl bg-white border border-mint-200 shadow-card p-5">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full grid place-items-center text-white font-bold ${tech.avatarColor}`}>
                  {tech.avatarSeed}
                </span>
                <div>
                  <p className="font-bold">{tech.name}</p>
                  <div className="flex items-center gap-1 text-sm text-brand-ink/60">
                    <Star className="w-3.5 h-3.5 text-sun fill-sun" />
                    {tech.rating} ({tech.reviewCount})
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-brand-ink/60">
                {tech.area} · from {tech.priceFrom}
              </p>
              <Link
                to="/dashboard"
                aria-label={`Book ${tech.name}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-600"
              >
                Book <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-ink/70 hover:text-brand-ink"
      >
        <RotateCcw className="w-4 h-4" />
        Try another photo
      </button>
    </div>
  )
}
