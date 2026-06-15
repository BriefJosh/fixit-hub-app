import { ArrowUpRight } from 'lucide-react'
import { categories } from '../../data/categories'

export default function ServicesGrid() {
  const gridCategories = categories.slice(0, 5)
  const featuredCategory = categories[5]
  const FeaturedIcon = featuredCategory.icon

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <h2 className="font-poster uppercase text-5xl">
          Pick your <span className="hl">trouble.</span>
        </h2>
        <p className="text-brand-ink/55 max-w-sm">
          Every category is staffed by background-checked, brand-certified specialists near you.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {gridCategories.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.name}
              className="group relative rounded-3xl bg-mint-50 p-7 overflow-hidden hover:bg-brand hover:text-white transition"
            >
              <Icon className={`w-9 h-9 ${category.iconColor} group-hover:text-white`} />
              <h3 className="font-extrabold text-xl mt-4">{category.name}</h3>
              <p className="text-sm opacity-60 mt-1">
                {category.description} · from {category.priceFrom}
              </p>
              <ArrowUpRight className="w-6 h-6 absolute top-6 right-6 opacity-30 group-hover:opacity-100" />
            </div>
          )
        })}
        <div className="group relative rounded-3xl bg-brand-ink text-white p-7 overflow-hidden hover:bg-brand transition">
          <FeaturedIcon className="w-9 h-9 text-sun" />
          <h3 className="font-extrabold text-xl mt-4">{featuredCategory.name}</h3>
          <p className="text-sm opacity-70 mt-1">
            {featuredCategory.description} · from {featuredCategory.priceFrom}
          </p>
          <span className="text-xs font-bold text-sun mt-3 inline-block">+ 8 more categories →</span>
        </div>
      </div>
    </section>
  )
}
