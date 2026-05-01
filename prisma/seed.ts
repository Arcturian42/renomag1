// @ts-nocheck
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed users first (required by ArtisanCompany)
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'artisan1@renomag.fr' }, update: {}, create: { email: 'artisan1@renomag.fr', role: 'ARTISAN' } }),
    prisma.user.upsert({ where: { email: 'artisan2@renomag.fr' }, update: {}, create: { email: 'artisan2@renomag.fr', role: 'ARTISAN' } }),
    prisma.user.upsert({ where: { email: 'artisan3@renomag.fr' }, update: {}, create: { email: 'artisan3@renomag.fr', role: 'ARTISAN' } }),
    prisma.user.upsert({ where: { email: 'artisan4@renomag.fr' }, update: {}, create: { email: 'artisan4@renomag.fr', role: 'ARTISAN' } }),
    prisma.user.upsert({ where: { email: 'artisan5@renomag.fr' }, update: {}, create: { email: 'artisan5@renomag.fr', role: 'ARTISAN' } }),
    prisma.user.upsert({ where: { email: 'artisan6@renomag.fr' }, update: {}, create: { email: 'artisan6@renomag.fr', role: 'ARTISAN' } }),
  ])

  // Seed certifications
  const certs = await prisma.certification.createMany({
    data: [
      { name: 'RGE', code: 'RGE' },
      { name: 'QualiPAC', code: 'QualiPAC' },
      { name: 'QualiSol', code: 'QualiSol' },
      { name: 'Qualibois', code: 'Qualibois' },
      { name: 'QualiPV', code: 'QualiPV' },
      { name: 'Eco Artisan', code: 'EcoArtisan' },
    ],
    skipDuplicates: true,
  })

  // Seed specialties
  const specs = await prisma.specialty.createMany({
    data: [
      { name: 'Isolation thermique', slug: 'isolation-thermique' },
      { name: 'Pompe à chaleur', slug: 'pompe-a-chaleur' },
      { name: 'Photovoltaïque', slug: 'photovoltaique' },
      { name: 'Chauffe-eau solaire', slug: 'chauffe-eau-solaire' },
      { name: 'VMC Double flux', slug: 'vmc-double-flux' },
      { name: 'ITE', slug: 'ite' },
      { name: 'Isolation combles', slug: 'isolation-combles' },
      { name: 'Menuiserie', slug: 'menuiserie' },
      { name: 'Chaudière biomasse', slug: 'chaudiere-biomasse' },
      { name: 'Poêle à granulés', slug: 'poele-a-granules' },
    ],
    skipDuplicates: true,
  })

  // Seed artisans
  const artisan1 = await prisma.artisanCompany.upsert({
    where: { slug: 'thermoconfort-paris' },
    update: {},
    create: {
      slug: 'thermoconfort-paris',
      name: 'ThermoConfort Paris',
      siret: '12345678900012',
      description:
        "Spécialiste de l'isolation thermique et des pompes à chaleur depuis 15 ans.",
      address: '12 rue de la Paix, 75002 Paris',
      city: 'Paris',
      zipCode: '75002',
      department: '75',
      region: 'Île-de-France',
      phone: '01 23 45 67 89',
      email: 'contact@thermoconfort-paris.fr',
      website: 'https://thermoconfort-paris.fr',
      avatar: 'https://ui-avatars.com/api/?name=Jean+Durand&background=1e40af&color=fff&size=200',
      verified: true,
      premium: true,
      available: true,
      rating: 4.8,
      reviewCount: 127,
      projectCount: 342,
      yearsExperience: 15,
      responseTime: '< 2h',
      since: 2009,
      gallery: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
      ],
    },
  })

  const artisan2 = await prisma.artisanCompany.upsert({
    where: { slug: 'eco-renov-lyon' },
    update: {},
    create: {
      slug: 'eco-renov-lyon',
      name: 'Éco-Rénov Lyon',
      siret: '98765432100034',
      description:
        'Entreprise lyonnaise spécialisée dans les travaux de rénovation énergétique.',
      address: '8 cours Gambetta, 69003 Lyon',
      city: 'Lyon',
      zipCode: '69003',
      department: '69',
      region: 'Auvergne-Rhône-Alpes',
      phone: '04 72 11 22 33',
      email: 'contact@eco-renov-lyon.fr',
      website: 'https://eco-renov-lyon.fr',
      avatar: 'https://ui-avatars.com/api/?name=Patrick+Moreau&background=16a34a&color=fff&size=200',
      verified: true,
      premium: true,
      available: true,
      rating: 4.7,
      reviewCount: 89,
      projectCount: 218,
      yearsExperience: 12,
      responseTime: '< 4h',
      since: 2012,
      gallery: [
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600',
        'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600',
      ],
    },
  })

  const artisan3 = await prisma.artisanCompany.upsert({
    where: { slug: 'artisan-renov-marseille' },
    update: {},
    create: {
      slug: 'artisan-renov-marseille',
      name: 'Artisan Rénov Marseille',
      siret: '45678912300056',
      description:
        "Artisan certifié RGE depuis 2011, spécialisé dans l'isolation thermique par l'extérieur.",
      address: '45 boulevard Michelet, 13009 Marseille',
      city: 'Marseille',
      zipCode: '13009',
      department: '13',
      region: "Provence-Alpes-Côte d'Azur",
      phone: '04 91 55 66 77',
      email: 'contact@artisanrenov-marseille.fr',
      avatar: 'https://ui-avatars.com/api/?name=Karim+Benzara&background=0d9488&color=fff&size=200',
      verified: true,
      premium: false,
      available: true,
      rating: 4.6,
      reviewCount: 64,
      projectCount: 156,
      yearsExperience: 13,
      responseTime: '< 6h',
      since: 2011,
      gallery: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600'],
    },
  })

  const artisan4 = await prisma.artisanCompany.upsert({
    where: { slug: 'nord-isolation-lille' },
    update: {},
    create: {
      slug: 'nord-isolation-lille',
      name: 'Nord Isolation',
      siret: '32165498700078',
      description:
        "Leader de l'isolation en région Nord, accompagne les propriétaires depuis 2008.",
      address: '3 rue Nationale, 59000 Lille',
      city: 'Lille',
      zipCode: '59000',
      department: '59',
      region: 'Hauts-de-France',
      phone: '03 20 33 44 55',
      email: 'contact@nord-isolation.fr',
      avatar: 'https://ui-avatars.com/api/?name=Christophe+Leblanc&background=f59e0b&color=fff&size=200',
      verified: true,
      premium: true,
      available: false,
      rating: 4.9,
      reviewCount: 203,
      projectCount: 512,
      yearsExperience: 16,
      responseTime: '< 1h',
      since: 2008,
      gallery: [],
    },
  })

  const artisan5 = await prisma.artisanCompany.upsert({
    where: { slug: 'soleil-energie-bordeaux' },
    update: {},
    create: {
      slug: 'soleil-energie-bordeaux',
      name: 'Soleil Énergie Bordeaux',
      siret: '78912345600090',
      description:
        'Experte en énergies renouvelables, systèmes solaires thermiques et photovoltaïques.',
      address: '18 quai des Chartrons, 33300 Bordeaux',
      city: 'Bordeaux',
      zipCode: '33300',
      department: '33',
      region: 'Nouvelle-Aquitaine',
      phone: '05 57 88 99 00',
      email: 'contact@soleil-energie-bordeaux.fr',
      avatar: 'https://ui-avatars.com/api/?name=Isabelle+Fontaine&background=7c3aed&color=fff&size=200',
      verified: true,
      premium: false,
      available: true,
      rating: 4.7,
      reviewCount: 71,
      projectCount: 189,
      yearsExperience: 9,
      responseTime: '< 3h',
      since: 2015,
      gallery: [],
    },
  })

  const artisan6 = await prisma.artisanCompany.upsert({
    where: { slug: 'chaleur-plus-nantes' },
    update: {},
    create: {
      slug: 'chaleur-plus-nantes',
      name: 'Chaleur Plus Nantes',
      siret: '65432178900012',
      description:
        'Spécialiste chauffage et climatisation, pompes à chaleur et systèmes de chauffage bois.',
      address: '22 rue du Calvaire, 44000 Nantes',
      city: 'Nantes',
      zipCode: '44000',
      department: '44',
      region: 'Pays de la Loire',
      phone: '02 40 12 23 34',
      email: 'contact@chaleur-plus-nantes.fr',
      avatar: 'https://ui-avatars.com/api/?name=Thomas+Garnier&background=dc2626&color=fff&size=200',
      verified: true,
      premium: false,
      available: true,
      rating: 4.5,
      reviewCount: 48,
      projectCount: 132,
      yearsExperience: 7,
      responseTime: '< 5h',
      since: 2017,
      gallery: [],
    },
  })

  // Link certifications & specialties
  const rge = await prisma.certification.findUnique({ where: { code: 'RGE' } })
  const qualipac = await prisma.certification.findUnique({ where: { code: 'QualiPAC' } })
  const qualisol = await prisma.certification.findUnique({ where: { code: 'QualiSol' } })
  const qualibois = await prisma.certification.findUnique({ where: { code: 'Qualibois' } })
  const qualipv = await prisma.certification.findUnique({ where: { code: 'QualiPV' } })
  const ecoArtisan = await prisma.certification.findUnique({ where: { code: 'EcoArtisan' } })

  const specIsolation = await prisma.specialty.findUnique({ where: { slug: 'isolation-thermique' } })
  const specPac = await prisma.specialty.findUnique({ where: { slug: 'pompe-a-chaleur' } })
  const specPv = await prisma.specialty.findUnique({ where: { slug: 'photovoltaique' } })
  const specIte = await prisma.specialty.findUnique({ where: { slug: 'ite' } })
  const specCombles = await prisma.specialty.findUnique({ where: { slug: 'isolation-combles' } })
  const specMenuiserie = await prisma.specialty.findUnique({ where: { slug: 'menuiserie' } })
  const specVmc = await prisma.specialty.findUnique({ where: { slug: 'vmc-double-flux' } })
  const specSolaire = await prisma.specialty.findUnique({ where: { slug: 'chauffe-eau-solaire' } })

  if (rge && qualipac && ecoArtisan && specIsolation && specPac && specVmc) {
    await prisma.artisanCompany.update({
      where: { id: artisan1.id },
      data: {
        certifications: { connect: [{ id: rge.id }, { id: qualipac.id }, { id: ecoArtisan.id }] },
        specialties: { connect: [{ id: specIsolation.id }, { id: specPac.id }, { id: specVmc.id }] },
      },
    })
  }

  if (rge && qualisol && qualipv && specPv && specIsolation && specSolaire) {
    await prisma.artisanCompany.update({
      where: { id: artisan2.id },
      data: {
        certifications: { connect: [{ id: rge.id }, { id: qualisol.id }, { id: qualipv.id }] },
        specialties: { connect: [{ id: specPv.id }, { id: specIsolation.id }, { id: specSolaire.id }] },
      },
    })
  }

  if (rge && ecoArtisan && specIte && specCombles && specMenuiserie) {
    await prisma.artisanCompany.update({
      where: { id: artisan3.id },
      data: {
        certifications: { connect: [{ id: rge.id }, { id: ecoArtisan.id }] },
        specialties: { connect: [{ id: specIte.id }, { id: specCombles.id }, { id: specMenuiserie.id }] },
      },
    })
  }

  if (rge && qualibois && specCombles && specIsolation && specMenuiserie) {
    await prisma.artisanCompany.update({
      where: { id: artisan4.id },
      data: {
        certifications: { connect: [{ id: rge.id }, { id: qualibois.id }] },
        specialties: { connect: [{ id: specCombles.id }, { id: specIsolation.id }, { id: specMenuiserie.id }] },
      },
    })
  }

  if (rge && qualisol && qualipv && specPv && specSolaire && specIsolation) {
    await prisma.artisanCompany.update({
      where: { id: artisan5.id },
      data: {
        certifications: { connect: [{ id: rge.id }, { id: qualisol.id }, { id: qualipv.id }] },
        specialties: { connect: [{ id: specPv.id }, { id: specSolaire.id }, { id: specIsolation.id }] },
      },
    })
  }

  if (rge && qualipac && qualibois && specPac && specCombles && specMenuiserie) {
    await prisma.artisanCompany.update({
      where: { id: artisan6.id },
      data: {
        certifications: { connect: [{ id: rge.id }, { id: qualipac.id }, { id: qualibois.id }] },
        specialties: { connect: [{ id: specPac.id }, { id: specCombles.id }, { id: specMenuiserie.id }] },
      },
    })
  }

  // Seed reviews
  await prisma.review.createMany({
    data: [
      { rating: 5, comment: 'Excellent travail !', author: 'Sophie M.', avatar: 'https://ui-avatars.com/api/?name=Sophie+M&background=f59e0b&color=fff', date: '2024-03-15', project: 'Isolation combles + PAC air-air', artisanId: artisan1.id },
      { rating: 5, comment: 'Très bonne expérience du début à la fin.', author: 'Pierre L.', avatar: 'https://ui-avatars.com/api/?name=Pierre+L&background=16a34a&color=fff', date: '2024-02-08', project: 'Pompe à chaleur air/eau', artisanId: artisan1.id },
      { rating: 4, comment: 'Bon travail dans l\'ensemble.', author: 'Marie T.', avatar: 'https://ui-avatars.com/api/?name=Marie+T&background=0d9488&color=fff', date: '2024-01-20', project: 'Isolation des murs par l\'extérieur', artisanId: artisan1.id },
      { rating: 5, comment: 'Installation solaire parfaite.', author: 'Antoine B.', avatar: 'https://ui-avatars.com/api/?name=Antoine+B&background=1e40af&color=fff', date: '2024-04-01', project: 'Panneaux solaires 6kWc', artisanId: artisan2.id },
    ],
    skipDuplicates: true,
  })

  // Seed categories
  const catAides = await prisma.category.upsert({
    where: { slug: 'aides-financement' },
    update: {},
    create: { name: 'Aides & Financement', slug: 'aides-financement' },
  })
  const catChauffage = await prisma.category.upsert({
    where: { slug: 'chauffage' },
    update: {},
    create: { name: 'Chauffage', slug: 'chauffage' },
  })
  const catIsolation = await prisma.category.upsert({
    where: { slug: 'isolation' },
    update: {},
    create: { name: 'Isolation', slug: 'isolation' },
  })
  const catSolaire = await prisma.category.upsert({
    where: { slug: 'energie-solaire' },
    update: {},
    create: { name: 'Énergie solaire', slug: 'energie-solaire' },
  })
  const catGuides = await prisma.category.upsert({
    where: { slug: 'guides-pratiques' },
    update: {},
    create: { name: 'Guides pratiques', slug: 'guides-pratiques' },
  })

  // Seed articles
  await prisma.article.createMany({
    data: [
      {
        title: "MaPrimeRénov' 2024 : le guide complet",
        slug: 'maprimrenov-2024-tout-savoir',
        content: "MaPrimeRénov' est l'aide phare...",
        excerpt: "MaPrimeRénov' a été profondément réformée en 2024.",
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        published: true,
        featured: true,
        author: 'Équipe RENOMAG',
        authorRole: 'Experts rénovation',
        readTime: 8,
        tags: ['MaPrimeRénov', 'Aides', '2024', 'Financement'],
        categoryId: catAides.id,
      },
      {
        title: 'Pompe à chaleur : quel modèle choisir ?',
        slug: 'pompe-a-chaleur-guide-complet',
        content: 'La pompe à chaleur est devenue la solution préférée...',
        excerpt: 'Air/air, air/eau, géothermique... On vous aide à choisir.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        published: true,
        featured: true,
        author: 'Marc Thévenin',
        authorRole: 'Ingénieur thermique',
        readTime: 12,
        tags: ['Pompe à chaleur', 'Chauffage', 'PAC'],
        categoryId: catChauffage.id,
      },
      {
        title: 'Isolation des combles perdus : pourquoi c\'est la priorité n°1',
        slug: 'isolation-combles-perdus-guide',
        content: 'L\'isolation des combles perdus est sans conteste...',
        excerpt: "Jusqu'à 30% des déperditions passent par le toit.",
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
        published: true,
        featured: false,
        author: 'Équipe RENOMAG',
        authorRole: 'Experts rénovation',
        readTime: 7,
        tags: ['Isolation', 'Combles', 'Économies énergie'],
        categoryId: catIsolation.id,
      },
      {
        title: 'Panneaux solaires : rentabiliser en autoconsommation',
        slug: 'panneaux-solaires-autoconsommation',
        content: 'L\'autoconsommation solaire permet de produire...',
        excerpt: 'Produisez votre propre électricité et maximisez votre ROI.',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
        published: true,
        featured: true,
        author: 'Lucie Marchand',
        authorRole: 'Spécialiste énergie solaire',
        readTime: 10,
        tags: ['Solaire', 'Photovoltaïque', 'Autoconsommation'],
        categoryId: catSolaire.id,
      },
      {
        title: 'CEE 2024 : comment profiter des certificats',
        slug: 'cee-certificats-economies-energie-2024',
        content: 'Les Certificats d\'Économies d\'Énergie sont méconnus...',
        excerpt: 'Les CEE peuvent vous faire économiser des milliers d\'euros.',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        published: true,
        featured: false,
        author: 'Équipe RENOMAG',
        authorRole: 'Experts rénovation',
        readTime: 6,
        tags: ['CEE', 'Aides', 'Financement'],
        categoryId: catAides.id,
      },
      {
        title: '5 critères pour choisir un bon artisan RGE',
        slug: 'choisir-artisan-rge-conseils',
        content: 'La certification RGE est la condition sine qua non...',
        excerpt: 'Tous les artisans RGE ne se valent pas. Voici comment choisir.',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
        published: true,
        featured: false,
        author: 'Pierre Dumont',
        authorRole: 'Conseiller en rénovation',
        readTime: 5,
        tags: ['RGE', 'Artisan', 'Conseils'],
        categoryId: catGuides.id,
      },
    ],
    skipDuplicates: true,
  })

  // Seed departments
  const departmentsData = [
    { code: '01', name: 'Ain', region: 'Auvergne-Rhône-Alpes' },
    { code: '02', name: 'Aisne', region: 'Hauts-de-France' },
    { code: '03', name: 'Allier', region: 'Auvergne-Rhône-Alpes' },
    { code: '04', name: 'Alpes-de-Haute-Provence', region: "Provence-Alpes-Côte d'Azur" },
    { code: '05', name: 'Hautes-Alpes', region: "Provence-Alpes-Côte d'Azur" },
    { code: '06', name: 'Alpes-Maritimes', region: "Provence-Alpes-Côte d'Azur" },
    { code: '07', name: 'Ardèche', region: 'Auvergne-Rhône-Alpes' },
    { code: '08', name: 'Ardennes', region: 'Grand Est' },
    { code: '09', name: 'Ariège', region: 'Occitanie' },
    { code: '10', name: 'Aube', region: 'Grand Est' },
    { code: '11', name: 'Aude', region: 'Occitanie' },
    { code: '12', name: 'Aveyron', region: 'Occitanie' },
    { code: '13', name: 'Bouches-du-Rhône', region: "Provence-Alpes-Côte d'Azur" },
    { code: '14', name: 'Calvados', region: 'Normandie' },
    { code: '15', name: 'Cantal', region: 'Auvergne-Rhône-Alpes' },
    { code: '16', name: 'Charente', region: 'Nouvelle-Aquitaine' },
    { code: '17', name: 'Charente-Maritime', region: 'Nouvelle-Aquitaine' },
    { code: '18', name: 'Cher', region: 'Centre-Val de Loire' },
    { code: '19', name: 'Corrèze', region: 'Nouvelle-Aquitaine' },
    { code: '21', name: "Côte-d'Or", region: 'Bourgogne-Franche-Comté' },
    { code: '22', name: "Côtes-d'Armor", region: 'Bretagne' },
    { code: '23', name: 'Creuse', region: 'Nouvelle-Aquitaine' },
    { code: '24', name: 'Dordogne', region: 'Nouvelle-Aquitaine' },
    { code: '25', name: 'Doubs', region: 'Bourgogne-Franche-Comté' },
    { code: '26', name: 'Drôme', region: 'Auvergne-Rhône-Alpes' },
    { code: '27', name: 'Eure', region: 'Normandie' },
    { code: '28', name: 'Eure-et-Loir', region: 'Centre-Val de Loire' },
    { code: '29', name: 'Finistère', region: 'Bretagne' },
    { code: '2A', name: 'Corse-du-Sud', region: 'Corse' },
    { code: '2B', name: 'Haute-Corse', region: 'Corse' },
    { code: '30', name: 'Gard', region: 'Occitanie' },
    { code: '31', name: 'Haute-Garonne', region: 'Occitanie' },
    { code: '32', name: 'Gers', region: 'Occitanie' },
    { code: '33', name: 'Gironde', region: 'Nouvelle-Aquitaine' },
    { code: '34', name: 'Hérault', region: 'Occitanie' },
    { code: '35', name: 'Ille-et-Vilaine', region: 'Bretagne' },
    { code: '36', name: 'Indre', region: 'Centre-Val de Loire' },
    { code: '37', name: 'Indre-et-Loire', region: 'Centre-Val de Loire' },
    { code: '38', name: 'Isère', region: 'Auvergne-Rhône-Alpes' },
    { code: '39', name: 'Jura', region: 'Bourgogne-Franche-Comté' },
    { code: '40', name: 'Landes', region: 'Nouvelle-Aquitaine' },
    { code: '41', name: 'Loir-et-Cher', region: 'Centre-Val de Loire' },
    { code: '42', name: 'Loire', region: 'Auvergne-Rhône-Alpes' },
    { code: '43', name: 'Haute-Loire', region: 'Auvergne-Rhône-Alpes' },
    { code: '44', name: 'Loire-Atlantique', region: 'Pays de la Loire' },
    { code: '45', name: 'Loiret', region: 'Centre-Val de Loire' },
    { code: '46', name: 'Lot', region: 'Occitanie' },
    { code: '47', name: 'Lot-et-Garonne', region: 'Nouvelle-Aquitaine' },
    { code: '48', name: 'Lozère', region: 'Occitanie' },
    { code: '49', name: 'Maine-et-Loire', region: 'Pays de la Loire' },
    { code: '50', name: 'Manche', region: 'Normandie' },
    { code: '51', name: 'Marne', region: 'Grand Est' },
    { code: '52', name: 'Haute-Marne', region: 'Grand Est' },
    { code: '53', name: 'Mayenne', region: 'Pays de la Loire' },
    { code: '54', name: 'Meurthe-et-Moselle', region: 'Grand Est' },
    { code: '55', name: 'Meuse', region: 'Grand Est' },
    { code: '56', name: 'Morbihan', region: 'Bretagne' },
    { code: '57', name: 'Moselle', region: 'Grand Est' },
    { code: '58', name: 'Nièvre', region: 'Bourgogne-Franche-Comté' },
    { code: '59', name: 'Nord', region: 'Hauts-de-France' },
    { code: '60', name: 'Oise', region: 'Hauts-de-France' },
    { code: '61', name: 'Orne', region: 'Normandie' },
    { code: '62', name: 'Pas-de-Calais', region: 'Hauts-de-France' },
    { code: '63', name: 'Puy-de-Dôme', region: 'Auvergne-Rhône-Alpes' },
    { code: '64', name: 'Pyrénées-Atlantiques', region: 'Nouvelle-Aquitaine' },
    { code: '65', name: 'Hautes-Pyrénées', region: 'Occitanie' },
    { code: '66', name: 'Pyrénées-Orientales', region: 'Occitanie' },
    { code: '67', name: 'Bas-Rhin', region: 'Grand Est' },
    { code: '68', name: 'Haut-Rhin', region: 'Grand Est' },
    { code: '69', name: 'Rhône', region: 'Auvergne-Rhône-Alpes' },
    { code: '70', name: 'Haute-Saône', region: 'Bourgogne-Franche-Comté' },
    { code: '71', name: 'Saône-et-Loire', region: 'Bourgogne-Franche-Comté' },
    { code: '72', name: 'Sarthe', region: 'Pays de la Loire' },
    { code: '73', name: 'Savoie', region: 'Auvergne-Rhône-Alpes' },
    { code: '74', name: 'Haute-Savoie', region: 'Auvergne-Rhône-Alpes' },
    { code: '75', name: 'Paris', region: 'Île-de-France' },
    { code: '76', name: 'Seine-Maritime', region: 'Normandie' },
    { code: '77', name: 'Seine-et-Marne', region: 'Île-de-France' },
    { code: '78', name: 'Yvelines', region: 'Île-de-France' },
    { code: '79', name: 'Deux-Sèvres', region: 'Nouvelle-Aquitaine' },
    { code: '80', name: 'Somme', region: 'Hauts-de-France' },
    { code: '81', name: 'Tarn', region: 'Occitanie' },
    { code: '82', name: 'Tarn-et-Garonne', region: 'Occitanie' },
    { code: '83', name: 'Var', region: "Provence-Alpes-Côte d'Azur" },
    { code: '84', name: 'Vaucluse', region: "Provence-Alpes-Côte d'Azur" },
    { code: '85', name: 'Vendée', region: 'Pays de la Loire' },
    { code: '86', name: 'Vienne', region: 'Nouvelle-Aquitaine' },
    { code: '87', name: 'Haute-Vienne', region: 'Nouvelle-Aquitaine' },
    { code: '88', name: 'Vosges', region: 'Grand Est' },
    { code: '89', name: 'Yonne', region: 'Bourgogne-Franche-Comté' },
    { code: '90', name: 'Territoire de Belfort', region: 'Bourgogne-Franche-Comté' },
    { code: '91', name: 'Essonne', region: 'Île-de-France' },
    { code: '92', name: 'Hauts-de-Seine', region: 'Île-de-France' },
    { code: '93', name: 'Seine-Saint-Denis', region: 'Île-de-France' },
    { code: '94', name: 'Val-de-Marne', region: 'Île-de-France' },
    { code: '95', name: "Val-d'Oise", region: 'Île-de-France' },
    { code: '971', name: 'Guadeloupe', region: 'Guadeloupe' },
    { code: '972', name: 'Martinique', region: 'Martinique' },
    { code: '973', name: 'Guyane', region: 'Guyane' },
    { code: '974', name: 'La Réunion', region: 'La Réunion' },
    { code: '976', name: 'Mayotte', region: 'Mayotte' },
  ]

  await prisma.department.createMany({
    data: departmentsData,
    skipDuplicates: true,
  })

  console.log('✅ Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
