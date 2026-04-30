const STATS = [
  { value: '2 400+', label: 'Artisans RGE', description: 'professionnels certifiés' },
  { value: '50 000+', label: 'Particuliers', description: 'projets accompagnés' },
  { value: '94%', label: 'Satisfaction', description: 'clients satisfaits' },
  { value: '8 500€', label: 'Économisé', description: 'en aides en moyenne' },
]

export default function Stats() {
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary-800 font-display">{stat.value}</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
