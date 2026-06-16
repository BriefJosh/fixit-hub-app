import { BadgeCheck, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { technicians } from '../../data/technicians'

const FEATURED_COUNT = 3

export default function RecommendedTechnicians() {
  const featured = technicians.slice(0, FEATURED_COUNT)

  return (
    <section id="technicians">
      <h2 className="font-extrabold text-lg mb-4">Top-rated technicians near you</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((tech) => (
          <div key={tech.id} className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-center gap-3">
              <span className={`w-12 h-12 rounded-xl text-white grid place-items-center font-bold ${tech.avatarColor}`}>
                {tech.avatarSeed}
              </span>
              <div>
                <p className="font-bold text-sm flex items-center gap-1">
                  {tech.name}
                  {tech.verified && <BadgeCheck className="w-4 h-4 text-brand" />}
                </p>
                <p className="text-xs text-brand-ink/45">
                  {tech.specialties[0]} · {tech.yearsExperience} yrs
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tech.badges.map((badge) => (
                <span key={badge} className="text-[11px] font-semibold bg-mint-100 text-brand-700 px-2 py-1 rounded-md">
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-sun fill-sun" /> {tech.rating} · {tech.reviewCount}
              </span>
              <span className="font-bold text-brand">from {tech.priceFrom}</span>
            </div>
            <Link
              to={`/book/${tech.serviceId}`}
              className="mt-4 w-full text-sm font-bold text-white bg-brand py-2 rounded-lg hover:bg-brand-600 text-center block"
            >
              Book
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
