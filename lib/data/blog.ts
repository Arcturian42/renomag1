export type Article = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  authorRole: string
  publishedAt: string
  readTime: number
  image: string
  tags: string[]
  featured: boolean
}

export const CATEGORIES = [
  'Aides & Financement',
  'Isolation',
  'Chauffage',
  'Énergie solaire',
  'Réglementation',
  'Guides pratiques',
]

export const ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'maprimrenov-2024-tout-savoir',
    title: 'MaPrimeRénov\' 2024 : le guide complet pour obtenir vos aides',
    excerpt:
      'MaPrimeRénov\' a été profondément réformée en 2024. Découvrez comment bénéficier de jusqu\'à 70% de vos travaux financés par l\'État.',
    content: `MaPrimeRénov\' est l\'aide phare du gouvernement pour la rénovation énergétique. En 2024, elle connaît une réforme majeure pour mieux cibler les ménages les plus modestes et les rénovations les plus ambitieuses.

## Qui peut bénéficier de MaPrimeRénov\' ?

Tous les propriétaires, occupants ou bailleurs, peuvent bénéficier de MaPrimeRénov\' pour leurs résidences principales construites depuis plus de 15 ans. Le montant de l\'aide dépend de vos revenus et du type de travaux.

## Les 4 catégories de revenus

1. **Ménages très modestes** (profil bleu) : jusqu'à 70% de financement
2. **Ménages modestes** (profil jaune) : jusqu'à 50% de financement
3. **Ménages intermédiaires** (profil violet) : jusqu'à 40% de financement
4. **Ménages supérieurs** (profil rose) : jusqu'à 30% de financement

## Les travaux éligibles

Les travaux éligibles à MaPrimeRénov\' sont nombreux :
- Isolation des combles, murs, planchers
- Installation de pompe à chaleur
- Changement de chaudière
- Installation de panneaux solaires
- Ventilation mécanique contrôlée (VMC)

## Comment faire votre demande ?

1. Connectez-vous sur maprimerenov.gouv.fr
2. Choisissez votre artisan certifié RGE
3. Obtenez un devis
4. Déposez votre dossier AVANT le début des travaux
5. Réalisez les travaux
6. Déclarez la fin des travaux et recevez votre prime`,
    category: 'Aides & Financement',
    author: 'Équipe RENOMAG',
    authorRole: 'Experts rénovation',
    publishedAt: '2024-04-15',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    tags: ['MaPrimeRénov', 'Aides', '2024', 'Financement'],
    featured: true,
  },
  {
    id: '2',
    slug: 'pompe-a-chaleur-guide-complet',
    title: 'Pompe à chaleur : quel modèle choisir et quel budget prévoir ?',
    excerpt:
      'Air/air, air/eau, géothermique... Les pompes à chaleur sont nombreuses. On vous aide à choisir le modèle adapté à votre logement.',
    content: `La pompe à chaleur (PAC) est devenue la solution de chauffage préférée des Français pour sa performance et ses aides généreuses. Mais face à la diversité des modèles, comment faire le bon choix ?

## Les différents types de pompes à chaleur

### PAC air/air
La PAC air/air capte les calories dans l'air extérieur pour chauffer l'air intérieur. C'est la solution la plus accessible financièrement...

### PAC air/eau
La PAC air/eau est la plus polyvalente : elle alimente à la fois le chauffage central et l'eau chaude sanitaire...

### PAC géothermique
La PAC géothermique capte la chaleur du sol ou des nappes phréatiques. C'est la solution la plus performante mais aussi la plus coûteuse à l'installation...

## Les aides disponibles

- MaPrimeRénov\' : jusqu'à 4 000€ pour les ménages modestes
- CEE : crédit d'impôt énergie
- Éco-PTZ : prêt à taux zéro jusqu'à 50 000€
- TVA réduite à 5,5%`,
    category: 'Chauffage',
    author: 'Marc Thévenin',
    authorRole: 'Ingénieur thermique',
    publishedAt: '2024-04-10',
    readTime: 12,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    tags: ['Pompe à chaleur', 'Chauffage', 'PAC'],
    featured: true,
  },
  {
    id: '3',
    slug: 'isolation-combles-perdus-guide',
    title: 'Isolation des combles perdus : pourquoi c\'est la priorité n°1',
    excerpt:
      'Jusqu\'à 30% des déperditions thermiques passent par le toit. L\'isolation des combles perdus est le geste de rénovation le plus rentable.',
    content: `L'isolation des combles perdus est sans conteste l'opération de rénovation thermique la plus rentable. Pour un investissement modeste, vous pouvez réduire votre facture de chauffage de 20 à 30%...`,
    category: 'Isolation',
    author: 'Équipe RENOMAG',
    authorRole: 'Experts rénovation',
    publishedAt: '2024-04-05',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    tags: ['Isolation', 'Combles', 'Économies énergie'],
    featured: false,
  },
  {
    id: '4',
    slug: 'panneaux-solaires-autoconsommation',
    title: 'Panneaux solaires : comment rentabiliser son installation en autoconsommation',
    excerpt:
      'L\'autoconsommation solaire permet de produire sa propre électricité. Voici comment maximiser votre retour sur investissement.',
    content: `L'énergie solaire photovoltaïque connaît un essor sans précédent en France. Avec la baisse des coûts des panneaux et les aides disponibles, le solaire est désormais accessible à tous les budgets...`,
    category: 'Énergie solaire',
    author: 'Lucie Marchand',
    authorRole: 'Spécialiste énergie solaire',
    publishedAt: '2024-03-28',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    tags: ['Solaire', 'Photovoltaïque', 'Autoconsommation'],
    featured: true,
  },
  {
    id: '5',
    slug: 'cee-certificats-economies-energie-2024',
    title: 'CEE 2024 : comment profiter des certificats d\'économies d\'énergie',
    excerpt:
      'Les Certificats d\'Économies d\'Énergie (CEE) peuvent vous faire économiser des milliers d\'euros sur vos travaux. Mode d\'emploi.',
    content: `Les Certificats d'Économies d'Énergie (CEE) sont méconnus mais peuvent représenter des aides très significatives pour financer vos travaux de rénovation...`,
    category: 'Aides & Financement',
    author: 'Équipe RENOMAG',
    authorRole: 'Experts rénovation',
    publishedAt: '2024-03-20',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    tags: ['CEE', 'Aides', 'Financement'],
    featured: false,
  },
  {
    id: '6',
    slug: 'choisir-artisan-rge-conseils',
    title: '5 critères pour choisir un bon artisan RGE',
    excerpt:
      'La certification RGE est obligatoire pour profiter des aides. Mais tous les artisans RGE ne se valent pas. Voici comment faire le bon choix.',
    content: `La certification RGE (Reconnu Garant de l'Environnement) est la condition sine qua non pour bénéficier des aides à la rénovation énergétique. Mais comment choisir le bon artisan parmi les milliers de professionnels certifiés ?...`,
    category: 'Guides pratiques',
    author: 'Pierre Dumont',
    authorRole: 'Conseiller en rénovation',
    publishedAt: '2024-03-15',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
    tags: ['RGE', 'Artisan', 'Conseils'],
    featured: false,
  },
]
