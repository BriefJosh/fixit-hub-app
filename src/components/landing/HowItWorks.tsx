const STEPS = [
  {
    number: '01',
    title: 'Tell us the problem',
    description: 'Describe the issue or let our AI diagnose it from a photo or video in seconds.',
  },
  {
    number: '02',
    title: 'Pick a technician & slot',
    description: 'Compare verified technicians by rating, price, and availability near you.',
  },
  {
    number: '03',
    title: "Relax — it's logged",
    description: "We track the job, the parts used, and add it to your appliance's maintenance log.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="grain bg-mint-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poster uppercase text-5xl mb-10">
          Book a fix in <span className="hl">three steps.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.number} className="bg-white rounded-3xl p-7 shadow-soft">
              <span className="font-poster text-4xl text-mint-200">{step.number}</span>
              <h3 className="font-extrabold text-xl mt-3">{step.title}</h3>
              <p className="text-sm text-brand-ink/60 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
