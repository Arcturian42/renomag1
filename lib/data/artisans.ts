export type Certification = 'RGE' | 'QualiPAC' | 'QualiSol' | 'Qualibois' | 'QualiPV' | 'Eco Artisan'

export type Artisan = {
  id: string
  slug: string
  name: string
  company: string
  avatar: string
  city: string
  department: string
  region: string
  address: string
  phone: string
  email: string
  website?: string
  description: string
  specialties: string[]
  certifications: Certification[]
  rating: number
  reviewCount: number
  projectCount: number
  yearsExperience: number
  responseTime: string
  verified: boolean
  premium: boolean
  available: boolean
  siret: string
  since: number
  gallery: string[]
  reviews: Review[]
  latitude?: number
  longitude?: number
}

export type Review = {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
  project: string
}

export const ARTISANS: Artisan[] = [
  {
    id: '1',
    slug: 'thermoconfort-paris',
    name: 'Jean-Marc Durand',
    company: 'ThermoConfort Paris',
    avatar: 'https://ui-avatars.com/api/?name=Jean+Durand&background=1e40af&color=fff&size=200',
    city: 'Paris',
    department: 'Paris (75)',
    region: 'Île-de-France',
    address: '12 rue de la Paix, 75002 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@thermoconfort-paris.fr',
    website: 'https://thermoconfort-paris.fr',
    description:
      'Spécialiste de l\'isolation thermique et des pompes à chaleur depuis 15 ans, ThermoConfort Paris accompagne les particuliers et professionnels dans leurs projets de rénovation énergétique. Certifié RGE, nous garantissons des travaux de qualité et vous aidons à maximiser vos aides MaPrimeRénov\'.',
    specialties: ['Isolation thermique', 'Pompe à chaleur', 'VMC Double flux'],
    certifications: ['RGE', 'QualiPAC', 'Eco Artisan'],
    rating: 4.8,
    reviewCount: 127,
    projectCount: 342,
    yearsExperience: 15,
    responseTime: '< 2h',
    verified: true,
    premium: true,
    available: true,
    siret: '123 456 789 00012',
    since: 2009,
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Sophie M.',
        avatar: 'https://ui-avatars.com/api/?name=Sophie+M&background=f59e0b&color=fff',
        rating: 5,
        date: '2024-03-15',
        comment:
          'Excellent travail ! L\'équipe est professionnelle, ponctuelle et le résultat est bluffant. Ma facture de chauffage a baissé de 40%. Je recommande vivement.',
        project: 'Isolation combles + PAC air-air',
      },
      {
        id: 'r2',
        author: 'Pierre L.',
        avatar: 'https://ui-avatars.com/api/?name=Pierre+L&background=16a34a&color=fff',
        rating: 5,
        date: '2024-02-08',
        comment:
          'Très bonne expérience du début à la fin. Ils ont géré toutes les démarches pour les aides MaPrimeRénov\'. Travail soigné et délais respectés.',
        project: 'Pompe à chaleur air/eau',
      },
      {
        id: 'r3',
        author: 'Marie T.',
        avatar: 'https://ui-avatars.com/api/?name=Marie+T&background=0d9488&color=fff',
        rating: 4,
        date: '2024-01-20',
        comment: 'Bon travail dans l\'ensemble, quelques petits retards mais la qualité est au rendez-vous.',
        project: 'Isolation des murs par l\'extérieur',
      },
    ],
  },
  {
    id: '2',
    slug: 'eco-renov-lyon',
    name: 'Patrick Moreau',
    company: 'Éco-Rénov Lyon',
    avatar: 'https://ui-avatars.com/api/?name=Patrick+Moreau&background=16a34a&color=fff&size=200',
    city: 'Lyon',
    department: 'Rhône (69)',
    region: 'Auvergne-Rhône-Alpes',
    address: '8 cours Gambetta, 69003 Lyon',
    phone: '04 72 11 22 33',
    email: 'contact@eco-renov-lyon.fr',
    description:
      'Entreprise lyonnaise spécialisée dans les travaux de rénovation énergétique : isolation, ventilation, énergies renouvelables. Nous sommes votre partenaire de confiance pour améliorer le confort de votre logement tout en réduisant votre empreinte carbone.',
    specialties: ['Photovoltaïque', 'Isolation', 'Chauffe-eau solaire'],
    certifications: ['RGE', 'QualiSol', 'QualiPV'],
    rating: 4.7,
    reviewCount: 89,
    projectCount: 218,
    yearsExperience: 12,
    responseTime: '< 4h',
    verified: true,
    premium: true,
    available: true,
    siret: '987 654 321 00034',
    since: 2012,
    gallery: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600',
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600',
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Antoine B.',
        avatar: 'https://ui-avatars.com/api/?name=Antoine+B&background=1e40af&color=fff',
        rating: 5,
        date: '2024-04-01',
        comment: 'Installation solaire parfaite. Équipe compétente et sérieuse. Je produis maintenant 70% de mon électricité.',
        project: 'Panneaux solaires 6kWc',
      },
    ],
  },
  {
    id: '3',
    slug: 'artisan-renov-marseille',
    name: 'Karim Benzara',
    company: 'Artisan Rénov Marseille',
    avatar: 'https://ui-avatars.com/api/?name=Karim+Benzara&background=0d9488&color=fff&size=200',
    city: 'Marseille',
    department: 'Bouches-du-Rhône (13)',
    region: "Provence-Alpes-Côte d'Azur",
    address: '45 boulevard Michelet, 13009 Marseille',
    phone: '04 91 55 66 77',
    email: 'contact@artisanrenov-marseille.fr',
    description:
      'Artisan certifié RGE depuis 2011, spécialisé dans l\'isolation thermique par l\'extérieur (ITE) et les systèmes de ventilation. Nous intervenons sur Marseille et toute la région PACA.',
    specialties: ['ITE', 'Isolation intérieure', 'Menuiserie'],
    certifications: ['RGE', 'Eco Artisan'],
    rating: 4.6,
    reviewCount: 64,
    projectCount: 156,
    yearsExperience: 13,
    responseTime: '< 6h',
    verified: true,
    premium: false,
    available: true,
    siret: '456 789 123 00056',
    since: 2011,
    gallery: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600'],
    reviews: [],
  },
  {
    id: '4',
    slug: 'nord-isolation-lille',
    name: 'Christophe Leblanc',
    company: 'Nord Isolation',
    avatar: 'https://ui-avatars.com/api/?name=Christophe+Leblanc&background=f59e0b&color=fff&size=200',
    city: 'Lille',
    department: 'Nord (59)',
    region: 'Hauts-de-France',
    address: '3 rue Nationale, 59000 Lille',
    phone: '03 20 33 44 55',
    email: 'contact@nord-isolation.fr',
    description:
      'Leader de l\'isolation en région Nord, nous accompagnons les propriétaires dans leurs projets de rénovation énergétique depuis 2008. Spécialistes des maisons anciennes et de l\'habitat collectif.',
    specialties: ['Isolation combles', 'Isolation plancher bas', 'Double vitrage'],
    certifications: ['RGE', 'Qualibois'],
    rating: 4.9,
    reviewCount: 203,
    projectCount: 512,
    yearsExperience: 16,
    responseTime: '< 1h',
    verified: true,
    premium: true,
    available: false,
    siret: '321 654 987 00078',
    since: 2008,
    gallery: [],
    reviews: [],
  },
  {
    id: '5',
    slug: 'soleil-energie-bordeaux',
    name: 'Isabelle Fontaine',
    company: 'Soleil Énergie Bordeaux',
    avatar: 'https://ui-avatars.com/api/?name=Isabelle+Fontaine&background=7c3aed&color=fff&size=200',
    city: 'Bordeaux',
    department: 'Gironde (33)',
    region: 'Nouvelle-Aquitaine',
    address: '18 quai des Chartrons, 33300 Bordeaux',
    phone: '05 57 88 99 00',
    email: 'contact@soleil-energie-bordeaux.fr',
    description:
      'Experte en énergies renouvelables, Isabelle et son équipe installent des systèmes solaires thermiques et photovoltaïques dans tout le Bordelais. Certifiée QualiSol et QualiPV.',
    specialties: ['Solaire thermique', 'Photovoltaïque', 'Batterie de stockage'],
    certifications: ['RGE', 'QualiSol', 'QualiPV'],
    rating: 4.7,
    reviewCount: 71,
    projectCount: 189,
    yearsExperience: 9,
    responseTime: '< 3h',
    verified: true,
    premium: false,
    available: true,
    siret: '789 123 456 00090',
    since: 2015,
    gallery: [],
    reviews: [],
  },
  {
    id: '6',
    slug: 'chaleur-plus-nantes',
    name: 'Thomas Garnier',
    company: 'Chaleur Plus Nantes',
    avatar: 'https://ui-avatars.com/api/?name=Thomas+Garnier&background=dc2626&color=fff&size=200',
    city: 'Nantes',
    department: 'Loire-Atlantique (44)',
    region: 'Pays de la Loire',
    address: '22 rue du Calvaire, 44000 Nantes',
    phone: '02 40 12 23 34',
    email: 'contact@chaleur-plus-nantes.fr',
    description:
      'Spécialiste chauffage et climatisation, nous installons des pompes à chaleur et systèmes de chauffage bois certifiés Qualibois. Interventions rapides sur Nantes et agglomération.',
    specialties: ['Pompe à chaleur', 'Poêle à bois', 'Climatisation réversible'],
    certifications: ['RGE', 'QualiPAC', 'Qualibois'],
    rating: 4.5,
    reviewCount: 48,
    projectCount: 132,
    yearsExperience: 7,
    responseTime: '< 5h',
    verified: true,
    premium: false,
    available: true,
    siret: '654 321 789 00012',
    since: 2017,
    gallery: [],
    reviews: [],
  },
]

export const SPECIALTIES = [
  'Isolation thermique',
  'Pompe à chaleur',
  'Photovoltaïque',
  'Chauffe-eau solaire',
  'VMC Double flux',
  'ITE (Isolation par l\'extérieur)',
  'Isolation combles',
  'Menuiseries',
  'Chaudière biomasse',
  'Poêle à granulés',
]

export const REGIONS = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  "Provence-Alpes-Côte d'Azur",
  'Hauts-de-France',
  'Nouvelle-Aquitaine',
  'Pays de la Loire',
  'Occitanie',
  'Bretagne',
  'Grand Est',
  'Normandie',
]
