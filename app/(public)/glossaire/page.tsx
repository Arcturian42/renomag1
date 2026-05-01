import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Glossaire de la rénovation énergétique — RENOMAG',
  description: 'Définitions de tous les termes techniques de la rénovation énergétique : RGE, CEE, DPE, BBC, PAC, ITE...',
}

const TERMS = [
  { term: 'BBC', definition: 'Bâtiment Basse Consommation. Label attribué aux bâtiments dont la consommation d\'énergie est inférieure à 50 kWh/m²/an en énergie primaire.' },
  { term: 'CEE', definition: 'Certificats d\'Économies d\'Énergie. Dispositif obligeant les fournisseurs d\'énergie à financer des travaux d\'économies d\'énergie chez leurs clients.' },
  { term: 'COP', definition: 'Coefficient de Performance. Indicateur d\'efficacité d\'une pompe à chaleur. Un COP de 3 signifie que la PAC produit 3 kWh de chaleur pour 1 kWh d\'électricité consommée.' },
  { term: 'DPE', definition: 'Diagnostic de Performance Énergétique. Document obligatoire qui évalue la consommation d\'énergie d\'un logement et son impact sur le climat, de A (très performant) à G (passoire thermique).' },
  { term: 'Éco-PTZ', definition: 'Éco-Prêt à Taux Zéro. Prêt bancaire sans intérêts pour financer des travaux de rénovation énergétique, jusqu\'à 50 000€ sur 20 ans.' },
  { term: 'ITE', definition: 'Isolation Thermique par l\'Extérieur. Technique d\'isolation qui consiste à poser un isolant sur les façades extérieures du bâtiment.' },
  { term: 'ITI', definition: 'Isolation Thermique par l\'Intérieur. Technique d\'isolation réalisée en posant un isolant sur les murs intérieurs.' },
  { term: 'MaPrimeRénov\'', definition: 'Aide financière de l\'État pour les travaux de rénovation énergétique. Le montant varie selon les revenus du ménage et le type de travaux réalisés.' },
  { term: 'PAC', definition: 'Pompe à Chaleur. Système de chauffage qui capte les calories présentes dans l\'air, le sol ou l\'eau pour chauffer le logement.' },
  { term: 'PAC air/air', definition: 'Pompe à chaleur qui capte les calories dans l\'air extérieur pour chauffer l\'air intérieur. Solution économique mais moins performante que la PAC air/eau.' },
  { term: 'PAC air/eau', definition: 'Pompe à chaleur qui capte les calories dans l\'air extérieur pour alimenter un circuit d\'eau chaude (radiateurs ou plancher chauffant).' },
  { term: 'Passoire thermique', definition: 'Logement classé F ou G au DPE, dont la consommation énergétique est très élevée. La loi prévoit leur interdiction progressive à la location.' },
  { term: 'R (Résistance thermique)', definition: 'Mesure de la capacité d\'un matériau à s\'opposer au passage de la chaleur. Plus le R est élevé, meilleure est l\'isolation.' },
  { term: 'RE 2020', definition: 'Réglementation Environnementale 2020. Norme applicable aux constructions neuves depuis le 1er janvier 2022, imposant des critères stricts de performance énergétique et d\'impact carbone.' },
  { term: 'RGE', definition: 'Reconnu Garant de l\'Environnement. Qualification attribuée aux professionnels ayant suivi une formation aux travaux de rénovation énergétique. Obligatoire pour que les clients puissent bénéficier des aides de l\'État.' },
  { term: 'SHAB', definition: 'Surface Habitable. Surface de plancher d\'un logement après déduction des parties non habitables (murs, cloisons, marches, escaliers...).' },
  { term: 'VMC', definition: 'Ventilation Mécanique Contrôlée. Système assurant le renouvellement de l\'air dans un logement. La VMC double flux récupère la chaleur de l\'air extrait pour préchauffer l\'air entrant.' },
]

export default function GlossairePage() {
  const letters = Array.from(new Set(TERMS.map(t => t.term[0]))).sort()

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="badge-primary mb-4">Glossaire</div>
          <h1 className="text-4xl font-bold">Glossaire de la rénovation énergétique</h1>
          <p className="mt-4 text-slate-400">
            Définitions des principaux termes techniques pour mieux comprendre votre projet de rénovation.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Alphabet nav */}
        <div className="flex flex-wrap gap-2 mb-10">
          {letters.map(letter => (
            <a key={letter} href={`#${letter}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors">
              {letter}
            </a>
          ))}
        </div>

        <div className="space-y-8">
          {letters.map(letter => (
            <div key={letter} id={letter}>
              <h2 className="text-lg font-bold text-primary-800 mb-3 pb-2 border-b border-primary-100">{letter}</h2>
              <dl className="space-y-4">
                {TERMS.filter(t => t.term[0] === letter).map(({ term, definition }) => (
                  <div key={term} className="bg-slate-50 rounded-xl p-4">
                    <dt className="font-semibold text-slate-900 mb-1">{term}</dt>
                    <dd className="text-sm text-slate-600 leading-relaxed">{definition}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
