import { categories } from '../../data/categories'

export default function QuickCategories() {
  return (
    <section>
      <h2 className="font-extrabold text-lg mb-4">Our services</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <div key={category.name} className="bg-white rounded-2xl p-4 text-center shadow-card">
              <span className="w-11 h-11 mx-auto rounded-xl bg-mint-100 grid place-items-center">
                <Icon className={`w-5 h-5 ${category.iconColor}`} />
              </span>
              <p className="text-xs font-bold mt-2">{category.name}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
