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
  isAI?: boolean
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
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
    tags: ['RGE', 'Artisan', 'Conseils'],
    featured: false,
  },
  {
    id: '7',
    slug: 'isolation-des-combles-perdus',
    title: 'Isolation des combles perdus : guide complet 2024',
    excerpt:
      '30% des pertes de chaleur passent par le toit. Découvrez pourquoi l\'isolation des combles perdus est le premier chantier à prévoir.',
    content: `L'isolation des combles perdus est l'opération de rénovation énergétique la plus rentable. Pour un investissement modeste, vous pouvez réduire votre facture de chauffage de 20 à 30% et améliorer considérablement votre confort thermique.

## Pourquoi isoler les combles perdus ?

Les combles perdus représentent la principale source de déperdition thermique dans une maison mal isolée. L'air chaud, plus léger, monte naturellement vers le toit. Sans isolation efficace, jusqu'à 30% de la chaleur s'échappe par la toiture.

## Les techniques d'isolation

### Soufflage de laine
La technique la plus répandue consiste à souffler de la laine minérale (laine de verre ou laine de roche) sur le plancher des combles. Cette méthode rapide et économique permet d'atteindre une épaisseur de 30 à 40 cm d'isolant.

### Épandage manuel
Pour les combles difficilement accessibles, l'épandage manuel permet d'étaler l'isolant de manière uniforme.

## Les matériaux recommandés

- **Laine de verre** : le meilleur rapport qualité/prix (15-25€/m²)
- **Laine de roche** : excellente résistance au feu (20-30€/m²)
- **Ouate de cellulose** : solution écologique biosourcée (25-35€/m²)

## Les aides disponibles

L'isolation des combles perdus bénéficie de nombreuses aides :
- MaPrimeRénov' : jusqu'à 25€/m² pour les ménages modestes
- CEE : prime énergie de 10 à 15€/m²
- Éco-PTZ : prêt à taux zéro jusqu'à 15 000€
- TVA à 5,5%

## Budget à prévoir

Pour une maison de 100m² de combles perdus :
- Matériaux : 1 500 - 2 500€
- Main d'œuvre : 1 000 - 1 500€
- **Total HT** : 2 500 - 4 000€
- Après aides : **500 - 1 500€**`,
    category: 'Isolation',
    author: 'Équipe RENOMAG',
    authorRole: 'Experts rénovation',
    publishedAt: '2024-03-10',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    tags: ['Isolation', 'Combles perdus', 'Économies énergie'],
    featured: false,
  },
  {
    id: '8',
    slug: 'chauffage-au-bois-guide',
    title: 'Chauffage au bois : poêle ou chaudière, que choisir ?',
    excerpt:
      'Le chauffage au bois est économique et écologique. Découvrez les différents systèmes et comment bien les choisir pour votre logement.',
    content: `Le chauffage au bois connaît un regain d'intérêt grâce à son faible coût et son bilan carbone neutre. Mais entre poêle à bois, poêle à granulés et chaudière à bois, lequel choisir ?

## Les avantages du chauffage au bois

- **Économique** : le bois est l'énergie de chauffage la moins chère (2 à 3 fois moins cher que l'électricité)
- **Écologique** : le bois est une énergie renouvelable avec un bilan carbone neutre
- **Performance** : les appareils modernes offrent d'excellents rendements (75-90%)
- **Confort** : la chaleur du bois est agréable et homogène

## Poêle à bois : le chauffage d'appoint performant

Le poêle à bois est idéal pour chauffer une pièce principale ou en complément d'un chauffage central. Les modèles modernes offrent un rendement de 70 à 85% et peuvent chauffer jusqu'à 100m².

**Budget** : 1 000 - 5 000€ + installation (500-1 500€)

## Poêle à granulés : l'automatisme en plus

Le poêle à granulés (pellets) offre les mêmes avantages que le poêle à bois avec une alimentation automatique et une programmation précise. Parfait pour un usage quotidien sans contrainte.

**Budget** : 3 000 - 7 000€ + installation (1 000-2 000€)

## Chaudière à bois : le chauffage central écologique

La chaudière à bois ou à granulés remplace votre vieille chaudière fioul ou gaz. Elle alimente tous vos radiateurs et peut produire l'eau chaude sanitaire.

**Budget** : 10 000 - 20 000€ (après aides : 4 000-10 000€)

## Les aides disponibles

Le chauffage au bois bénéficie d'aides généreuses :
- MaPrimeRénov' : jusqu'à 2 500€ pour un poêle à granulés
- MaPrimeRénov' : jusqu'à 10 000€ pour une chaudière à granulés
- CEE : prime énergie de 500 à 4 000€
- TVA réduite à 5,5%

## Les critères de choix

1. **Surface à chauffer** : un poêle convient jusqu'à 100m², au-delà optez pour une chaudière
2. **Budget** : un poêle est plus accessible qu'une chaudière
3. **Confort** : les granulés offrent plus d'autonomie que les bûches
4. **Contraintes** : assurez-vous d'avoir un espace de stockage pour le bois`,
    category: 'Chauffage',
    author: 'Marc Thévenin',
    authorRole: 'Ingénieur thermique',
    publishedAt: '2024-03-05',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
    tags: ['Chauffage', 'Bois', 'Poêle', 'Granulés'],
    featured: false,
  },
  {
    id: '9',
    slug: 'vmc-double-flux',
    title: 'VMC double flux : le guide complet pour ventiler et économiser',
    excerpt:
      'La VMC double flux récupère jusqu\'à 90% de la chaleur de l\'air extrait. Découvrez comment cette ventilation intelligente réduit vos factures.',
    content: `La VMC (Ventilation Mécanique Contrôlée) double flux est un système de ventilation intelligent qui renouvelle l'air de votre logement tout en récupérant la chaleur. Un équipement indispensable pour les maisons BBC et passives.

## Comment fonctionne une VMC double flux ?

Contrairement à la VMC simple flux qui évacue l'air vicié vers l'extérieur, la VMC double flux récupère la chaleur de cet air pour préchauffer l'air neuf entrant. Un échangeur thermique permet de transférer jusqu'à 90% de la chaleur.

## Les avantages de la VMC double flux

### Économies d'énergie
La récupération de chaleur permet de réduire les besoins de chauffage de 15 à 20%, soit 300 à 500€ d'économies annuelles.

### Confort thermique
L'air entrant est préchauffé, évitant les courants d'air froid et améliorant le confort en hiver.

### Qualité de l'air
Les filtres de la VMC double flux purifient l'air entrant, éliminant pollens, poussières et pollutions extérieures.

### Isolation phonique
Contrairement aux grilles d'aération traditionnelles, la VMC double flux limite les nuisances sonores extérieures.

## Installation et dimensionnement

### Où installer une VMC double flux ?

La centrale de ventilation se place généralement dans les combles ou un local technique. Elle nécessite :
- Un réseau de gaines pour l'air neuf et l'air vicié
- Des bouches d'insufflation dans les pièces de vie
- Des bouches d'extraction dans les pièces humides (cuisine, salle de bain)

### Dimensionnement
Le débit de la VMC dépend de la surface et du nombre d'occupants :
- T2-T3 : 180 à 250 m³/h
- T4-T5 : 300 à 400 m³/h

## Budget et aides

### Coût d'installation
- VMC double flux : 3 000 - 5 000€
- Installation : 2 000 - 4 000€
- **Total** : 5 000 - 9 000€

### Aides disponibles
- MaPrimeRénov' : jusqu'à 2 500€ pour les ménages modestes
- CEE : prime énergie de 500 à 1 500€
- TVA réduite à 5,5%
- **Coût après aides** : 2 000 - 5 000€

## VMC simple flux vs double flux

| Critère | Simple flux | Double flux |
|---------|-------------|-------------|
| Prix | 800-2 000€ | 5 000-9 000€ |
| Économies énergie | 0% | 15-20% |
| Récupération chaleur | Non | Oui (90%) |
| Filtration air | Non | Oui |
| Idéal pour | Rénovation | Neuf et rénovation complète |

## Entretien

Pour maintenir les performances de votre VMC double flux :
- Nettoyage des filtres tous les 3-6 mois
- Vérification de l'échangeur tous les ans
- Nettoyage des bouches tous les 6 mois

Un entretien régulier garantit la pérennité du système et le maintien des économies d'énergie.`,
    category: 'Guides pratiques',
    author: 'Sophie Martin',
    authorRole: 'Experte ventilation',
    publishedAt: '2024-02-28',
    readTime: 12,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    tags: ['VMC', 'Ventilation', 'Double flux', 'Économies'],
    featured: false,
  },
]
