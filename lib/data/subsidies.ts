export type Aid = {
  id: string
  name: string
  shortName: string
  description: string
  maxAmount: string
  eligibility: string[]
  workTypes: string[]
  color: string
  logo: string
  url: string
}

export const AIDS: Aid[] = [
  {
    id: 'mpr',
    name: "MaPrimeRénov'",
    shortName: 'MPR',
    description:
      "L'aide principale de l'État pour la rénovation énergétique. Accessible à tous les propriétaires, le montant varie selon vos revenus et le type de travaux.",
    maxAmount: "Jusqu'à 70% des travaux",
    eligibility: ['Propriétaires occupants', 'Propriétaires bailleurs', 'Copropriétés'],
    workTypes: [
      'Isolation',
      'Pompe à chaleur',
      'Chauffe-eau solaire',
      'Chaudière biomasse',
      'VMC double flux',
    ],
    color: 'bg-blue-600',
    logo: '🏛️',
    url: 'https://www.maprimerenov.gouv.fr',
  },
  {
    id: 'cee',
    name: "Certificats d'Économies d'Énergie",
    shortName: 'CEE',
    description:
      "Les fournisseurs d'énergie financent une partie de vos travaux en échange de certificats. Cumulable avec MaPrimeRénov'.",
    maxAmount: 'Variable selon les fournisseurs',
    eligibility: ['Tous les ménages', 'Entreprises'],
    workTypes: ['Isolation', 'Chauffage', 'Éclairage', 'Équipements'],
    color: 'bg-green-600',
    logo: '🌱',
    url: 'https://www.ecologie.gouv.fr/dispositif-des-certificats-deconomies-denergie',
  },
  {
    id: 'eco-ptz',
    name: 'Éco-Prêt à Taux Zéro',
    shortName: 'Éco-PTZ',
    description:
      'Un prêt sans intérêt pour financer vos travaux de rénovation énergétique. Jusqu\'à 50 000€ remboursables sur 20 ans.',
    maxAmount: "Jusqu'à 50 000€",
    eligibility: ['Propriétaires occupants', 'Propriétaires bailleurs'],
    workTypes: ['Tous types de rénovation énergétique'],
    color: 'bg-amber-600',
    logo: '🏦',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F19905',
  },
  {
    id: 'tva',
    name: 'TVA réduite à 5,5%',
    shortName: 'TVA 5,5%',
    description:
      'La TVA sur les travaux de rénovation énergétique est réduite à 5,5% au lieu de 20%. S\'applique automatiquement sur vos factures.',
    maxAmount: '14,5% d\'économie sur la main d\'œuvre',
    eligibility: ['Tous les propriétaires'],
    workTypes: ['Tous types de rénovation énergétique'],
    color: 'bg-purple-600',
    logo: '📋',
    url: 'https://www.impots.gouv.fr/particulier/tva-taux-reduit',
  },
  {
    id: 'anah',
    name: 'Aide de l\'Anah',
    shortName: 'Anah',
    description:
      'L\'Agence Nationale de l\'Habitat octroie des subventions pour les ménages modestes souhaitant sortir de la précarité énergétique.',
    maxAmount: "Jusqu'à 50% des travaux",
    eligibility: ['Ménages aux revenus modestes', 'Propriétaires occupants'],
    workTypes: ['Rénovation globale', 'Adaptation du logement'],
    color: 'bg-red-600',
    logo: '🏠',
    url: 'https://www.anah.fr',
  },
]

export type WorkType = {
  id: string
  name: string
  icon: string
  description: string
  avgCost: [number, number]
  avgSaving: string
  aids: string[]
}

export const WORK_TYPES: WorkType[] = [
  {
    id: 'isolation_combles',
    name: 'Isolation des combles',
    icon: '🏠',
    description: 'Isolation des combles perdus ou aménagés par soufflage ou projection.',
    avgCost: [1500, 4000],
    avgSaving: '20-25%',
    aids: ['mpr', 'cee', 'eco-ptz', 'tva'],
  },
  {
    id: 'isolation_murs',
    name: 'Isolation des murs',
    icon: '🧱',
    description: 'Isolation thermique par l\'intérieur (ITI) ou par l\'extérieur (ITE).',
    avgCost: [8000, 25000],
    avgSaving: '15-20%',
    aids: ['mpr', 'cee', 'eco-ptz', 'tva'],
  },
  {
    id: 'pac',
    name: 'Pompe à chaleur',
    icon: '🌡️',
    description: 'PAC air/eau, air/air ou géothermique pour chauffage et eau chaude.',
    avgCost: [8000, 20000],
    avgSaving: '30-50%',
    aids: ['mpr', 'cee', 'eco-ptz', 'tva'],
  },
  {
    id: 'photovoltaique',
    name: 'Panneaux solaires',
    icon: '☀️',
    description: 'Installation de panneaux photovoltaïques pour autoconsommation.',
    avgCost: [8000, 18000],
    avgSaving: '30-60%',
    aids: ['mpr', 'tva'],
  },
  {
    id: 'fenetres',
    name: 'Menuiseries',
    icon: '🪟',
    description: 'Remplacement des fenêtres et portes pour améliorer l\'isolation.',
    avgCost: [800, 3000],
    avgSaving: '5-10%',
    aids: ['mpr', 'cee', 'eco-ptz', 'tva'],
  },
  {
    id: 'vmc',
    name: 'VMC Double Flux',
    icon: '💨',
    description: 'Ventilation mécanique contrôlée à double flux pour renouveler l\'air.',
    avgCost: [4000, 8000],
    avgSaving: '10-15%',
    aids: ['mpr', 'cee', 'eco-ptz', 'tva'],
  },
]
